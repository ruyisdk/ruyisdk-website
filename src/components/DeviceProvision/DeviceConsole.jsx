import React, { useEffect, useRef, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Terminal, Usb, FolderOpen, RotateCcw, Download } from 'lucide-react';
import { ProvisionRuntime } from '../../lib/device/runtime';
import { FastbootSession } from '../../lib/device/fastboot';
import { provision } from '../../lib/device/provision';
import styles from './device.module.css';

const clean = (text) =>
  String(text).replace(
    /\[(?:\/?(?:bold |bold|green|yellow|blue|red|cyan|white|dim|reset)\s*)+\]|\[\/\]/g,
    '',
  );
const formatBytes = (bytes) => `${(bytes / 1048576).toFixed(1)} MiB`;

export default function DeviceConsole() {
  const base = useBaseUrl('/');
  const { i18n } = useDocusaurusContext();
  const zh = i18n.currentLocale.startsWith('zh');
  const t = (cn, en) => (zh ? cn : en);
  const [run, setRun] = useState(0),
    [lines, setLines] = useState([]),
    [prompt, setPrompt] = useState(null),
    [answer, setAnswer] = useState('');
  const [complete, setComplete] = useState(false),
    [issue, setIssue] = useState(''),
    [directoryName, setDirectoryName] = useState(''),
    [transfer, setTransfer] = useState(null);
  const [, refresh] = useState(0);
  const session = useRef(null),
    pending = useRef(null),
    directory = useRef(null),
    scroll = useRef(null),
    input = useRef(null);
  const log = (text) => setLines((list) => [...list, clean(text)]);
  const settle = (value) => {
    const current = pending.current;
    if (!current) return;
    pending.current = null;
    setPrompt(null);
    setAnswer('');
    current.resolve(value);
  };
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
    if (prompt?.kind === 'text') input.current?.focus({ preventScroll: true });
  }, [lines, prompt]);
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const update = () => {
      if (!signal.aborted) refresh((value) => value + 1);
    };
    const output = (text) => {
      if (!signal.aborted) log(text);
    };
    const usb = new FastbootSession(update, output, signal);
    const runtime = new ProvisionRuntime(base, output);
    session.current = { usb, runtime, signal, writing: false };
    setLines(['$ ruyi device provision']);
    setComplete(false);
    setIssue('');
    setTransfer(null);
    setPrompt(null);
    setAnswer('');
    const wait = (kind, title, extra = {}) => {
      signal.throwIfAborted();
      return new Promise((resolve, reject) => {
        pending.current = { kind, resolve, reject };
        setPrompt({ kind, title, ...extra });
      });
    };
    let lastProgress = 0;
    const ui = {
      log: output,
      confirm: async (title) => {
        for (;;) {
          const value = await wait('text', `${title} (y/N)`);
          if (/^(y|yes)$/i.test(value)) return true;
          if (!value || /^(n|no)$/i.test(value)) return false;
          output(t('请输入 y 或 n。', 'Enter y or n.'));
        }
      },
      choose: async (title, choices) => {
        output(title);
        output(
          choices.map((label, index) => `  ${index + 1}. ${label}`).join('\n'),
        );
        for (;;) {
          const value = await wait(
            'text',
            `${t('请选择', 'Choice')} (1–${choices.length})`,
          );
          if (
            /^\d+$/.test(value) &&
            Number(value) >= 1 &&
            Number(value) <= choices.length
          )
            return Number(value) - 1;
          output(t('请输入列表中的编号。', 'Enter a number from the list.'));
        }
      },
      directory: async () =>
        directory.current ??
        (await wait(
          'directory',
          t(
            '请在侧栏选择存放镜像的本地目录。',
            'Choose a local image directory in the sidebar.',
          ),
        )),
      device: async () => {
        if (!usb.device?.opened)
          await wait(
            'device',
            t(
              '请在侧栏连接目标开发板。',
              'Connect the target board in the sidebar.',
            ),
          );
        usb.acceptSelection = false;
        usb.changed();
      },
      progress: (value) => {
        if (
          !signal.aborted &&
          (!value ||
            !value.bytes ||
            value.bytes === value.total ||
            Date.now() - lastProgress > 120)
        ) {
          setTransfer(value);
          lastProgress = Date.now();
        }
      },
      flashing: () => {
        session.current.writing = true;
        update();
      },
      localFile: async (spec) =>
        await wait(
          'file',
          t(
            '自动下载失败。请手动下载并选择对应文件。',
            'Automatic download failed. Download and select the matching file.',
          ),
          { spec },
        ),
    };
    const execute = () =>
      provision({ runtime, usb, ui, signal, locale: zh ? 'zh_CN' : 'en_US' });
    const operation = navigator.locks
      ? navigator.locks.request(
          'ruyi-device-provision',
          { ifAvailable: true },
          (lock) => {
            if (!lock)
              throw Error(
                t(
                  '另一个页面已打开刷写向导。请关闭它后重试。',
                  'Another tab is running the provisioner. Close it and retry.',
                ),
              );
            return execute();
          },
        )
      : execute();
    operation
      .catch((error) =>
        output(`${t('已停止', 'Stopped')}: ${error.message ?? error}`),
      )
      .finally(() => {
        if (!signal.aborted) {
          setComplete(true);
          setPrompt(null);
          setTransfer(null);
          runtime.dispose();
          void usb.dispose().then(update);
        }
      });
    return () => {
      controller.abort();
      pending.current?.reject(Error('Session closed'));
      pending.current = null;
      runtime.dispose();
      void usb.dispose();
    };
  }, [run, base, zh]);
  const report = (error) => {
    if (error.name !== 'AbortError' && error.name !== 'NotFoundError')
      setIssue(error.message ?? String(error));
  };
  async function selectDirectory() {
    try {
      const selected = await window.showDirectoryPicker({
        mode: 'readwrite',
        id: 'ruyi-images',
      });
      directory.current = selected;
      setDirectoryName(selected.name);
      setIssue('');
      if (pending.current?.kind === 'directory') settle(selected);
    } catch (error) {
      report(error);
    }
  }
  async function connect() {
    const usb = session.current?.usb;
    if (!usb) return;
    try {
      await usb.select();
      setIssue('');
      if (usb.device?.opened && pending.current?.kind === 'device')
        settle(usb.device);
    } catch (error) {
      report(error);
    }
  }
  const usb = session.current?.usb,
    online = Boolean(usb?.device?.opened);
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>ruyi device provision</h1>
        <p>
          {t(
            '选择开发板和系统镜像，通过 USB 安装到设备。',
            'Select a board and system image to install over USB.',
          )}
        </p>
      </header>
      <div className={styles.grid}>
        <section
          className={styles.console}
          aria-label={t('交互终端', 'Interactive terminal')}
        >
          <div className={styles.bar}>
            <span>
              <Terminal size={17} /> {t('终端', 'Terminal')}
            </span>
            <button
              onClick={() => setRun((value) => value + 1)}
              disabled={!complete && session.current?.writing}
            >
              <RotateCcw size={14} />
              {t('重新开始', 'Restart')}
            </button>
          </div>
          <div
            ref={scroll}
            className={styles.output}
            role="log"
            aria-live="polite"
          >
            {lines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
            {prompt && <div className={styles.current}>{prompt.title}</div>}
          </div>
          <form
            className={styles.command}
            onSubmit={(event) => {
              event.preventDefault();
              if (prompt?.kind === 'text') {
                log(`${prompt.title} ${answer}`);
                settle(answer.trim());
              }
            }}
          >
            <span aria-hidden="true">❯</span>
            <input
              ref={input}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={prompt?.kind !== 'text'}
              aria-label={t('终端输入', 'Terminal input')}
              autoComplete="off"
              spellCheck="false"
            />
            <button disabled={prompt?.kind !== 'text'}>
              {t('输入', 'Enter')} ↵
            </button>
          </form>
        </section>
        <aside className={styles.aside}>
          <section>
            <h2>
              <Usb size={20} /> Fastboot
            </h2>
            <div className={styles.status}>
              <i data-online={online} />
              {!navigator.usb
                ? t('浏览器不支持 WebUSB', 'WebUSB unavailable')
                : online
                  ? usb.label
                  : usb?.lastDevice
                    ? t('等待设备重新连接', 'Waiting for reconnection')
                    : t('未连接开发板', 'No board connected')}
            </div>
            <button
              disabled={
                !navigator.usb ||
                complete ||
                !usb?.acceptSelection ||
                usb?.selecting
              }
              onClick={connect}
            >
              {t('连接开发板', 'Connect board')}
            </button>
            <label>
              <input
                type="checkbox"
                checked={usb?.allowGzip ?? true}
                disabled={!usb || session.current?.writing}
                onChange={(event) => {
                  usb.allowGzip = event.target.checked;
                  usb.changed();
                }}
              />
              {t(
                'Bianbu USB 2 分区压缩',
                'Compress eligible Bianbu partitions over USB 2',
              )}
            </label>
          </section>
          <section>
            <h2>
              <FolderOpen size={20} />
              {t('镜像目录', 'Image directory')}
            </h2>
            <p>
              {directoryName
                ? `${directoryName}/RuyiImages/`
                : t(
                    '选择本机目录保存下载包和解包后的分区文件。',
                    'Choose a local directory for downloads and extracted partition images.',
                  )}
            </p>
            <button
              disabled={
                !window.showDirectoryPicker ||
                (Boolean(directoryName) &&
                  !complete &&
                  prompt?.kind !== 'directory')
              }
              onClick={selectDirectory}
            >
              {t('选择目录', 'Choose directory')}
            </button>
          </section>
          {transfer && (
            <section>
              <h2>
                <Download size={20} />
                {transfer.phase}
              </h2>
              <p>{transfer.name}</p>
              <progress
                max={transfer.total}
                value={transfer.bytes || undefined}
              />
              <small>{formatBytes(transfer.total)}</small>
            </section>
          )}
          {prompt?.kind === 'file' && (
            <section>
              <h2>{t('选择镜像文件', 'Select image file')}</h2>
              <p>{prompt.spec.name}</p>
              {prompt.spec.resolved_urls
                .filter((url) => /^https?:\/\//.test(url))
                .map((url) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer">
                    {new URL(url).hostname} ↗{' '}
                  </a>
                ))}
              <input
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) settle(file);
                }}
              />
            </section>
          )}
          {issue && (
            <p role="alert" className={styles.error}>
              {issue}
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
