package main

import (
	"archive/tar"
	"archive/zip"
	"bufio"
	"bytes"
	"compress/gzip"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"math"
	"strings"
	"syscall/js"

	"github.com/klauspost/compress/zstd"
	"github.com/pierrec/lz4/v4"
	"github.com/ulikunitz/xz"
)

const bufferSize = 1024 * 1024

type blobReader struct {
	blob js.Value
	size int64
}

type outputWriter struct{ host js.Value }

type extractionProgress struct {
	host        js.Value
	done, total uint64
	percent     int
}

func (progress *extractionProgress) Write(data []byte) (int, error) {
	progress.done += uint64(len(data))
	if progress.total > 0 {
		percent := min(99, int(float64(progress.done)/float64(progress.total)*100))
		if percent > progress.percent {
			progress.percent = percent
			progress.host.Call("progress", percent)
		}
	}
	return len(data), nil
}

func (writer outputWriter) Write(buffer []byte) (int, error) {
	data := js.Global().Get("Uint8Array").New(len(buffer))
	js.CopyBytesToJS(data, buffer)
	if _, err := await(writer.host.Call("write", data)); err != nil {
		return 0, err
	}
	return len(buffer), nil
}

func (reader blobReader) ReadAt(buffer []byte, offset int64) (int, error) {
	if offset >= reader.size {
		return 0, io.EOF
	}
	data, err := await(reader.blob.Call("slice", float64(offset), float64(offset+int64(len(buffer)))).Call("arrayBuffer"))
	if err != nil {
		return 0, err
	}
	count := js.CopyBytesToGo(buffer, js.Global().Get("Uint8Array").New(data))
	if count < len(buffer) {
		return count, io.EOF
	}
	return count, nil
}

func gzipChunk(job js.Value) (js.Value, error) {
	blob := job.Get("file")
	source := blobReader{blob, int64(blob.Get("size").Float())}
	var compressed bytes.Buffer
	writer, err := gzip.NewWriterLevel(&compressed, job.Get("level").Int())
	if err != nil {
		return js.Undefined(), err
	}
	if _, err = io.CopyBuffer(writer, io.NewSectionReader(source, 0, source.size), make([]byte, bufferSize)); err != nil {
		return js.Undefined(), err
	}
	if err = writer.Close(); err != nil {
		return js.Undefined(), err
	}
	data := js.Global().Get("Uint8Array").New(compressed.Len())
	js.CopyBytesToJS(data, compressed.Bytes())
	return data, nil
}

func processImage(job, host js.Value) (any, error) {
	blob := job.Get("file")
	source := blobReader{blob, int64(blob.Get("size").Float())}
	section := io.NewSectionReader(source, 0, source.size)
	if job.Get("kind").String() == "hash" {
		digest := sha256.New()
		if _, err := io.CopyBuffer(digest, section, make([]byte, bufferSize)); err != nil {
			return nil, err
		}
		return hex.EncodeToString(digest.Sum(nil)), nil
	}
	name := job.Get("name").String()
	progress := &extractionProgress{host: host, total: uint64(source.size)}
	input := bufio.NewReaderSize(io.TeeReader(section, progress), bufferSize)
	var destination io.Writer = outputWriter{host}
	wanted := map[string]bool{}
	names := job.Get("wanted")
	for index := 0; index < names.Length(); index++ {
		wanted[names.Index(index).String()] = true
	}
	found := []string{}
	write := func(path string, input io.Reader) error {
		if !wanted[path] {
			return nil
		}
		for _, seen := range found {
			if seen == path {
				return fmt.Errorf("Duplicate archive member %s", path)
			}
		}
		found = append(found, path)
		if _, err := await(host.Call("open", path)); err != nil {
			return err
		}
		output := bufio.NewWriterSize(destination, bufferSize)
		if _, err := io.Copy(output, input); err != nil {
			return err
		}
		if err := output.Flush(); err != nil {
			return err
		}
		_, err := await(host.Call("close"))
		return err
	}
	switch {
	case strings.HasSuffix(name, ".zip"):
		archive, err := zip.NewReader(source, source.size)
		if err != nil {
			return nil, err
		}
		progress.total = 0
		var selected []*zip.File
		for _, member := range archive.File {
			path := strings.TrimPrefix(member.Name, "./")
			if !wanted[path] || !member.Mode().IsRegular() {
				continue
			}
			if member.UncompressedSize64 > math.MaxUint64-progress.total {
				return nil, fmt.Errorf("ZIP image sizes overflow")
			}
			progress.total += member.UncompressedSize64
			selected = append(selected, member)
		}
		destination = io.MultiWriter(destination, progress)
		for _, member := range selected {
			stream, err := member.Open()
			if err != nil {
				return nil, err
			}
			err = write(strings.TrimPrefix(member.Name, "./"), stream)
			stream.Close()
			if err != nil {
				return nil, err
			}
		}
	case strings.HasSuffix(name, ".tar.gz") || strings.HasSuffix(name, ".tgz"):
		stream, err := gzip.NewReader(input)
		if err != nil {
			return nil, err
		}
		defer stream.Close()
		archive := tar.NewReader(stream)
		strip := job.Get("strip").Int()
		for {
			header, err := archive.Next()
			if err == io.EOF {
				break
			}
			if err != nil {
				return nil, err
			}
			parts := strings.Split(header.Name, "/")
			if len(parts) <= strip || header.Typeflag != tar.TypeReg {
				continue
			}
			path := strings.Join(parts[strip:], "/")
			if err = write(path, archive); err != nil {
				return nil, err
			}
		}
	case strings.HasSuffix(name, ".zst"):
		stream, err := zstd.NewReader(input, zstd.WithDecoderConcurrency(1), zstd.WithDecoderMaxMemory(256<<20))
		if err != nil {
			return nil, err
		}
		defer stream.Close()
		if err = write(strings.TrimSuffix(name, ".zst"), stream); err != nil {
			return nil, err
		}
	case strings.HasSuffix(name, ".gz"):
		stream, err := gzip.NewReader(input)
		if err != nil {
			return nil, err
		}
		defer stream.Close()
		if err = write(strings.TrimSuffix(name, ".gz"), stream); err != nil {
			return nil, err
		}
	case strings.HasSuffix(name, ".xz"):
		stream, err := xz.NewReader(input)
		if err != nil {
			return nil, err
		}
		if err = write(strings.TrimSuffix(name, ".xz"), stream); err != nil {
			return nil, err
		}
	case strings.HasSuffix(name, ".lz4"):
		stream := lz4.NewReader(input)
		if err := write(strings.TrimSuffix(name, ".lz4"), stream); err != nil {
			return nil, err
		}
	default:
		if err := write(name, input); err != nil {
			return nil, err
		}
	}
	host.Call("progress", 100)
	return found, nil
}
