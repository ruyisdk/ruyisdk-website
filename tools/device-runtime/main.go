package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"syscall/js"
)

type result struct {
	value js.Value
	err   error
}

func await(promise js.Value) (js.Value, error) {
	done := make(chan result, 1)
	success := js.FuncOf(func(_ js.Value, args []js.Value) any { done <- result{value: args[0]}; return nil })
	failure := js.FuncOf(func(_ js.Value, args []js.Value) any {
		message := js.Global().Get("String").Invoke(args[0]).String()
		done <- result{err: errors.New(message)}
		return nil
	})
	defer success.Release()
	defer failure.Release()
	promise.Call("then", success, failure)
	completed := <-done
	return completed.value, completed.err
}

func main() {
	js.Global().Set("runProvisionTask", js.FuncOf(func(_ js.Value, args []js.Value) any {
		job, host := args[0], args[1]
		executor := js.FuncOf(func(_ js.Value, callbacks []js.Value) any {
			resolve, reject := callbacks[0], callbacks[1]
			go func() {
				defer func() {
					if failure := recover(); failure != nil {
						reject.Invoke(fmt.Sprint(failure))
					}
				}()
				var value any
				var err error
				switch job.Get("kind").String() {
				case "gzip":
					compressed, err := gzipChunk(job)
					if err != nil {
						reject.Invoke(err.Error())
					} else {
						resolve.Invoke(compressed)
					}
					return
				case "hash", "extract":
					value, err = processImage(job, host)
				case "preview", "flash":
					value, err = runPlugin(job, host)
				case "message":
					value, err = lookupMessage(job)
				default:
					err = errors.New("Unknown runtime operation")
				}
				if err != nil {
					reject.Invoke(err.Error())
					return
				}
				data, err := json.Marshal(value)
				if err != nil {
					reject.Invoke(err.Error())
					return
				}
				resolve.Invoke(js.Global().Get("JSON").Call("parse", string(data)))
			}()
			return nil
		})
		defer executor.Release()
		return js.Global().Get("Promise").New(executor)
	}))
	select {}
}
