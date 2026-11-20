package main

import (
	"errors"
	"fmt"
	"strings"
	"syscall/js"
	"time"

	"github.com/pelletier/go-toml/v2"
	"go.starlark.net/starlark"
	"go.starlark.net/starlarkstruct"
	"go.starlark.net/syntax"
)

func object(fields starlark.StringDict) starlark.Value {
	return starlarkstruct.FromStringDict(starlark.String("RUYI"), fields)
}

func messageTable(text string) (*starlark.Dict, error) {
	raw := map[string]any{}
	if err := toml.Unmarshal([]byte(text), &raw); err != nil {
		return nil, err
	}
	table := starlark.NewDict(len(raw))
	for key, item := range raw {
		fields, ok := item.(map[string]any)
		if !ok {
			continue
		}
		locales := starlark.NewDict(len(fields))
		for lang, value := range fields {
			if text, ok := value.(string); ok {
				locales.SetKey(starlark.String(lang), starlark.String(text))
			}
		}
		table.SetKey(starlark.String(key), locales)
	}
	return table, nil
}

func lookupMessage(job js.Value) (any, error) {
	var messages map[string]any
	if err := toml.Unmarshal([]byte(job.Get("text").String()), &messages); err != nil {
		return nil, err
	}
	fields, ok := messages[job.Get("id").String()].(map[string]any)
	if !ok {
		return nil, fmt.Errorf("Missing installation message %s", job.Get("id").String())
	}
	if value, ok := fields[job.Get("locale").String()]; ok {
		return value, nil
	}
	return fields["en_US"], nil
}

func pluginHost(module string, host js.Value, flashing bool, messages *starlark.Dict, locale string) starlark.Value {
	logs := starlark.StringDict{}
	for _, level := range []string{"D", "I", "W", "E", "F"} {
		logs[level] = starlark.NewBuiltin(level, func(_ *starlark.Thread, builtin *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (starlark.Value, error) {
			var msg string
			if err := starlark.UnpackArgs(builtin.Name(), args, kwargs, "message", &msg); err != nil {
				return nil, err
			}
			host.Call("log", builtin.Name(), msg)
			return starlark.None, nil
		})
	}
	methods := starlark.StringDict{"log": object(logs)}
	methods["i18n"] = object(starlark.StringDict{"locale": starlark.String(locale), "msg": starlark.NewBuiltin("msg", func(_ *starlark.Thread, _ *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (starlark.Value, error) {
		var id string
		language := locale
		if err := starlark.UnpackArgs("msg", args, kwargs, "msgid", &id, "locale?", &language); err != nil {
			return nil, err
		}
		entry, ok, err := messages.Get(starlark.String(id))
		if err != nil {
			return nil, err
		}
		if !ok {
			return starlark.None, nil
		}
		fields := entry.(*starlark.Dict)
		for _, key := range []string{language, "en_US"} {
			if value, ok, _ := fields.Get(starlark.String(key)); ok {
				return value, nil
			}
		}
		return starlark.None, nil
	})})
	for _, name := range []string{"load_toml", "sleep", "call_subprocess_argv", "cli_ask_for_yesno_confirmation", "has_feature"} {
		methods[name] = starlark.NewBuiltin(name, func(_ *starlark.Thread, builtin *starlark.Builtin, args starlark.Tuple, kwargs []starlark.Tuple) (starlark.Value, error) {
			switch builtin.Name() {
			case "has_feature":
				var feature string
				if err := starlark.UnpackArgs(name, args, kwargs, "feature", &feature); err != nil {
					return nil, err
				}
				return starlark.Bool(feature == "call-subprocess-capture-v1" || feature == "i18n-v1"), nil
			case "load_toml":
				var path string
				if err := starlark.UnpackArgs(name, args, kwargs, "path", &path); err != nil {
					return nil, err
				}
				text, err := await(host.Call("asset", module, path))
				if err != nil {
					return nil, err
				}
				return messageTable(text.String())
			case "sleep":
				var seconds starlark.Value
				if err := starlark.UnpackArgs(name, args, kwargs, "seconds", &seconds); err != nil {
					return nil, err
				}
				duration, ok := starlark.AsFloat(seconds)
				if !ok || duration < 0 || duration > 60 {
					return nil, errors.New("Invalid wait time")
				}
				time.Sleep(time.Duration(duration * float64(time.Second)))
				return starlark.None, nil
			case "cli_ask_for_yesno_confirmation":
				return starlark.False, nil
			case "call_subprocess_argv":
				if !flashing {
					return nil, errors.New("Device commands are disabled in preview")
				}
				var argv *starlark.List
				capture := false
				if err := starlark.UnpackArgs(name, args, kwargs, "argv", &argv, "capture_output?", &capture); err != nil {
					return nil, err
				}
				words := make([]any, argv.Len())
				for index := range words {
					word, ok := starlark.AsString(argv.Index(index))
					if !ok {
						return nil, errors.New("Invalid command argument")
					}
					words[index] = word
				}
				answer, err := await(host.Call("command", js.ValueOf(words)))
				if err != nil {
					return nil, err
				}
				status := starlark.MakeInt(answer.Get("status").Int())
				if capture {
					return starlark.Tuple{status, starlark.String(answer.Get("output").String())}, nil
				}
				return status, nil
			}
			return nil, errors.New("Unknown host operation")
		})
	}
	return object(methods)
}

func runPlugin(job, host js.Value) (any, error) {
	flashing := job.Get("kind").String() == "flash"
	messages, err := messageTable(job.Get("messages").String())
	if err != nil {
		return nil, err
	}
	thread := &starlark.Thread{Name: "device provision"}
	thread.SetMaxExecutionSteps(1_000_000)
	cache := map[string]starlark.StringDict{}
	thread.Load = func(thread *starlark.Thread, uri string) (starlark.StringDict, error) {
		name, ok := strings.CutPrefix(uri, "ruyi-plugin://")
		if !ok {
			return nil, fmt.Errorf("Unsupported module URI %s", uri)
		}
		if globals, exists := cache[name]; exists {
			if globals == nil {
				return nil, fmt.Errorf("Circular module load: %s", name)
			}
			return globals, nil
		}
		cache[name] = nil
		text, err := await(host.Call("source", name))
		if err != nil {
			return nil, err
		}
		api := pluginHost(name, host, flashing, messages, job.Get("locale").String())
		globals, err := starlark.ExecFileOptions(&syntax.FileOptions{TopLevelControl: true, GlobalReassign: true}, thread, name, text.String(), starlark.StringDict{"ruyi_plugin_rev": starlark.NewBuiltin("ruyi_plugin_rev", func(_ *starlark.Thread, _ *starlark.Builtin, args starlark.Tuple, _ []starlark.Tuple) (starlark.Value, error) {
			if len(args) != 1 || args[0].String() != "1" {
				return nil, errors.New("Unsupported Ruyi plugin revision")
			}
			return api, nil
		})})
		if err != nil {
			return nil, err
		}
		cache[name] = globals
		return globals, nil
	}
	strategy := job.Get("strategy").String()
	var declaration *starlark.Dict
	for _, id := range []string{"ruyi-device-provision-strategy-std", "ruyi-device-provision-strategy-" + strategy} {
		globals, err := thread.Load(thread, "ruyi-plugin://"+id)
		if err != nil {
			return nil, err
		}
		strategies, ok := globals["PROVIDED_DEVICE_PROVISION_STRATEGIES_V1"].(*starlark.Dict)
		if !ok {
			return nil, fmt.Errorf("Missing strategies in %s", id)
		}
		value, found, err := strategies.Get(starlark.String(strategy))
		if err != nil {
			return nil, err
		}
		if found {
			declaration, ok = value.(*starlark.Dict)
			if !ok {
				return nil, errors.New("Invalid strategy declaration")
			}
			break
		}
	}
	if declaration == nil {
		return nil, fmt.Errorf("Unknown strategy %s", strategy)
	}
	paths := job.Get("paths")
	keys := js.Global().Get("Object").Call("keys", paths)
	mapping := starlark.NewDict(keys.Length())
	for index := 0; index < keys.Length(); index++ {
		key := keys.Index(index).String()
		mapping.SetKey(starlark.String(key), starlark.String(paths.Get(key).String()))
	}
	function := "pretend_fn"
	if flashing {
		function = "flash_fn"
	}
	fn, _, _ := declaration.Get(starlark.String(function))
	if fn == nil {
		return nil, fmt.Errorf("Missing %s", function)
	}
	needs, _, _ := declaration.Get(starlark.String("need_host_blkdevs_fn"))
	required, err := starlark.Call(thread, needs, starlark.Tuple{starlark.NewList(mapping.Keys())}, nil)
	if err != nil {
		return nil, err
	}
	slots, ok := required.(*starlark.List)
	if !ok {
		return nil, errors.New("Invalid block device requirements")
	}
	devices := starlark.NewDict(slots.Len())
	for index := 0; index < slots.Len(); index++ {
		key, ok := starlark.AsString(slots.Index(index))
		if !ok || !job.Get("blockDevices").Truthy() || job.Get("blockDevices").Get(key).Type() != js.TypeString {
			return nil, fmt.Errorf("Missing target disk for %q", key)
		}
		devices.SetKey(slots.Index(index), starlark.String(job.Get("blockDevices").Get(key).String()))
	}
	returned, err := starlark.Call(thread, fn, starlark.Tuple{mapping, devices}, nil)
	if err != nil {
		return nil, err
	}
	if flashing {
		if returned.String() != "0" {
			return nil, fmt.Errorf("Flashing stopped (status %s)", returned)
		}
		return 0, nil
	}
	priority, _, _ := declaration.Get(starlark.String("priority"))
	rank, err := starlark.AsInt32(priority)
	if err != nil {
		return nil, err
	}
	list, ok := returned.(*starlark.List)
	if !ok {
		return nil, errors.New("Invalid plan")
	}
	steps := make([]string, list.Len())
	for index := range steps {
		steps[index], ok = starlark.AsString(list.Index(index))
		if !ok {
			return nil, errors.New("Invalid plan step")
		}
	}
	return map[string]any{"priority": rank, "steps": steps}, nil
}
