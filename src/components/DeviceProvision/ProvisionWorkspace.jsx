import { FastbootSession } from '../../lib/device/fastboot';
import { provision } from '../../lib/device/provision';
import { ProvisionRuntime } from '../../lib/device/runtime';
import Button from '../common/Button';
import ImagerPanel from './ImagerPanel';
import styles from './device.module.css';
import { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Terminal, Usb, FolderOpen, RotateCcw, Download } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const clean = (text) =>
  String(text).replace(
    /\[(?:\/?(?:bold |bold|green|yellow|blue|red|cyan|white|dim|reset)\s*)+\]|\[\/\]/g,
    '',
  );
const formatBytes = (bytes) => `${(bytes / 1048576).toFixed(1)} MiB`;
const logClock = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function phaseLabel(phase) {
  switch (phase) {
    case 'Download':
      return translate({
        id: 'tryruyi.device.downloading',
        message: '正在下载',
      });
    case 'Extract':
      return translate({
        id: 'tryruyi.device.extracting',
        message: '正在解包',
      });
    case 'SHA-256':
      return translate({
        id: 'tryruyi.device.verifying',
        message: '正在校验 SHA-256',
      });
    default:
      return phase;
  }
}

export default function ProvisionWorkspace({ graphical = false }) {
  const base = useBaseUrl('/');
  const { i18n } = useDocusaurusContext();
  const zh = i18n.currentLocale.startsWith('zh');
  const [run, setRun] = useState(0),
    [lines, setLines] = useState([]),
    [prompt, setPrompt] = useState(null),
    [answer, setAnswer] = useState('');
  const [catalog, setCatalog] = useState(null);
  const selectedImage = useRef(null);
  const [preparing, setPreparing] = useState(false);
  const [packageOptions, setPackageOptions] = useState(null);
  const [steps, setSteps] = useState(null);
  const [fastbootRequired, setFastbootRequired] = useState(true);
  const [panelStatus, setPanelStatus] = useState({});
  const [traceText, setTraceText] = useState('');
  const [traceOpen, setTraceOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null);
  const traceView = useRef(null),
    followTrace = useRef(true);
  const [complete, setComplete] = useState(false),
    [issue, setIssue] = useState(''),
    [directoryName, setDirectoryName] = useState(''),
    [pickingDirectory, setPickingDirectory] = useState(false),
    [transfer, setTransfer] = useState(null);
  const [, refresh] = useState(0);
  const session = useRef(null),
    previousRun = useRef(null),
    pending = useRef(null),
    directory = useRef(null),
    filePicker = useRef(null),
    scroll = useRef(null),
    input = useRef(null);
  const log = (text) =>
    setLines((list) => [...list.slice(-511), clean(text).slice(0, 8192)]);
  const settle = useCallback((value) => {
    const current = pending.current;
    if (!current) return;
    pending.current = null;
    setPrompt(null);
    setAnswer('');
    current.resolve(value);
  }, []);
  const selectSystem = useCallback(
    (image) => {
      if (image?.id === selectedImage.current?.id) return;
      selectedImage.current = image;
      setPackageOptions(null);
      if (image && pending.current?.kind === 'system') settle(image);
      else setRun((value) => value + 1);
    },
    [settle],
  );
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
    if (prompt?.kind === 'text') input.current?.focus({ preventScroll: true });
  }, [lines, prompt]);
  useEffect(() => {
    if (traceOpen && traceView.current && followTrace.current)
      traceView.current.scrollTop = traceView.current.scrollHeight;
  }, [traceOpen, traceText]);
  useEffect(() => {
    if (copyStatus !== 'copied') return;
    const timer = setTimeout(() => setCopyStatus(null), 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);
  useEffect(() => {
    const controller = new AbortController();
    const t = (cn, en) => (zh ? cn : en);
    const { signal } = controller;
    let activePanel = 'setup';
    const update = () => {
      if (!signal.aborted) refresh((value) => value + 1);
    };
    const output = (text) => {
      if (signal.aborted) return;
      if (graphical) {
        const panel = activePanel;
        const message = clean(text).slice(0, 8192);
        setPanelStatus((previous) => ({ ...previous, [panel]: message }));
      } else log(text);
    };
    const trace = (text) => {
      if (signal.aborted) return;
      const entry = `${logClock.format(Date.now())}  ${clean(text).slice(0, 8192)}\n`;
      setTraceText((previous) => {
        const all = previous + entry;
        const limit = 512 * 1024;
        if (all.length <= limit) return all;
        const start = all.indexOf('\n', all.length - limit + 64);
        return `[Earlier log entries omitted]\n${all.slice(start + 1)}`;
      });
    };
    const usb = new FastbootSession(update, output, signal, trace);
    const runtime = new ProvisionRuntime(base, output, signal, trace);
    session.current = { usb, runtime, signal, writing: false, trace };
    setTraceText('');
    setCopyStatus(null);
    followTrace.current = true;
    trace('ruyi device provision');
    setLines(graphical ? [] : ['$ ruyi device provision']);
    setPreparing(false);
    setPackageOptions(null);
    setSteps(null);
    setFastbootRequired(true);
    setPanelStatus({});
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
      fastbootRequired: setFastbootRequired,
      log: output,
      trace,
      confirm: async (title) => {
        if (graphical) {
          const accepted = await wait('confirm', title);
          if (!accepted) output(t('已取消。', 'Cancelled.'));
          return accepted;
        }
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
      directory: async () => {
        if (graphical) setPreparing(true);
        return (
          directory.current ??
          (await wait(
            'directory',
            t(
              '请在侧栏选择存放镜像的本地目录。',
              'Choose a local image directory in the sidebar.',
            ),
          ))
        );
      },
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
      localFile: async (spec, mirrors) =>
        await wait(
          'file',
          mirrors.length
            ? t(
                `请用侧栏的镜像链接下载 ${spec.name}，然后选择本地文件继续。`,
                `Download ${spec.name} using the mirror link in the sidebar, then select the local file to continue.`,
              )
            : t(
                `请选择本地文件 ${spec.name} 继续。`,
                `Select the local file ${spec.name} to continue.`,
              ),
          { spec, mirrors },
        ),
    };
    if (graphical) {
      ui.selectSystem = async (catalog, vendors) => {
        signal.throwIfAborted();
        setCatalog({ catalog, vendors });
        const image = selectedImage.current ?? (await wait('system', ''));
        activePanel = 'prepare';
        return image;
      };
      ui.preparePackages = (options) => {
        signal.throwIfAborted();
        setPackageOptions(options);
        return wait('packages', '');
      };
      ui.review = (items) => {
        signal.throwIfAborted();
        activePanel = 'flash';
        setSteps(items);
      };
    }
    const execute = () =>
      provision({ runtime, usb, ui, signal, locale: zh ? 'zh_CN' : 'en_US' });
    const start = async (previous) => {
      await previous;
      signal.throwIfAborted();
      if (!navigator.locks) return execute();
      return navigator.locks.request(
        'ruyi-device-provision',
        { ifAvailable: true },
        (lock) => {
          signal.throwIfAborted();
          if (!lock)
            throw Error(
              t(
                '另一个页面已打开刷写向导。请关闭它后重试。',
                'Another tab is running the provisioner. Close it and retry.',
              ),
            );
          return execute();
        },
      );
    };
    let closing;
    const closeUsb = () => (closing ??= usb.dispose());
    previousRun.current = start(previousRun.current)
      .catch((error) => {
        trace(`ERROR: ${error.message ?? error}`);
        output(`${t('已停止', 'Stopped')}: ${error.message ?? error}`);
      })
      .finally(async () => {
        runtime.dispose();
        await closeUsb();
        if (!signal.aborted) {
          setComplete(true);
          setPrompt(null);
          setTransfer(null);
        }
      });
    return () => {
      controller.abort();
      pending.current?.reject(Error('Session closed'));
      pending.current = null;
      void closeUsb();
    };
  }, [run, base, zh, graphical]);
  async function copyTrace() {
    try {
      await navigator.clipboard.writeText(traceText);
      setCopyStatus('copied');
    } catch {
      if (!traceView.current) return;
      const range = document.createRange();
      range.selectNodeContents(traceView.current);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      setCopyStatus('manual');
    }
  }
  const report = (error, message) => {
    if (error.name !== 'AbortError' && error.name !== 'NotFoundError') {
      session.current?.trace(`${message} ${error}`);
      setIssue(`${message} ${error.message ?? String(error)}`);
    }
  };
  const expectedFile = prompt?.kind === 'file' ? prompt.spec.name : '';
  const extension = expectedFile.match(/\.[a-z0-9_+-]{1,15}$/i)?.[0];
  function acceptImage(file) {
    if (!file || pending.current?.kind !== 'file') return;
    if (file.name !== expectedFile) {
      setIssue(
        translate(
          {
            id: 'tryruyi.device.fileNameMismatch',
            message: '所选文件是 {selected}。请选择 {expected}。',
          },
          { selected: file.name, expected: expectedFile },
        ),
      );
      return;
    }
    setIssue('');
    settle(file);
  }
  async function selectImage() {
    if (!window.showOpenFilePicker || !extension) {
      filePicker.current?.click();
      return;
    }
    const request = pending.current;
    try {
      const [handle] = await window.showOpenFilePicker({
        id: 'ruyi-image-files',
        startIn: 'downloads',
        excludeAcceptAllOption: true,
        types: [
          {
            description: expectedFile,
            accept: { 'application/octet-stream': [extension] },
          },
        ],
      });
      const file = await handle.getFile();
      if (pending.current === request) acceptImage(file);
    } catch (error) {
      if (pending.current === request)
        report(
          error,
          translate({
            id: 'tryruyi.device.filePickerError',
            message: '无法打开镜像文件。',
          }),
        );
    }
  }
  async function selectDirectory() {
    if (pickingDirectory) return;
    setPickingDirectory(true);
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
      report(
        error,
        translate({
          id: 'tryruyi.device.directoryError',
          message: '无法打开镜像目录。',
        }),
      );
    } finally {
      setPickingDirectory(false);
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
      report(
        error,
        translate({
          id: 'tryruyi.device.connectionError',
          message: '无法连接开发板。',
        }),
      );
    }
  }
  const usb = session.current?.usb,
    online = Boolean(usb?.device?.opened);
  return (
    <>
      <header className={styles.header}>
        <h1>{graphical ? 'Ruyi Imager' : 'ruyi device provision'}</h1>
        <p>
          {translate({
            id: 'tryruyi.device.description',
            message: '选择开发板和系统镜像，通过 USB 安装到设备。',
          })}
        </p>
      </header>
      <div className={styles.grid}>
        {graphical ? (
          <ImagerPanel
            prompt={prompt}
            catalog={catalog}
            hasImage={Boolean(selectedImage.current)}
            preparing={preparing}
            packageOptions={packageOptions}
            steps={steps}
            panelStatus={panelStatus}
            complete={complete}
            writing={session.current?.writing}
            restart={() => {
              selectedImage.current = null;
              setPackageOptions(null);
              setCatalog(null);
              setRun((value) => value + 1);
            }}
            settle={settle}
            selectSystem={selectSystem}
          />
        ) : (
          <section
            className={styles.console}
            aria-label={translate({
              id: 'tryruyi.device.terminalLabel',
              message: '交互终端',
            })}
          >
            <div className={styles.bar}>
              <span>
                <Terminal size={17} />{' '}
                {translate({ id: 'tryruyi.device.terminal', message: '终端' })}
              </span>
              <button
                onClick={() => setRun((value) => value + 1)}
                disabled={!complete && session.current?.writing}
              >
                <RotateCcw size={14} />
                {translate({
                  id: 'tryruyi.device.restart',
                  message: '重新开始',
                })}
              </button>
            </div>
            <div
              ref={scroll}
              className={styles.output}
              role="log"
              lang={zh ? 'zh-Hans' : 'en'}
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
                aria-label={translate({
                  id: 'tryruyi.device.terminalInput',
                  message: '终端输入',
                })}
                autoComplete="off"
                spellCheck="false"
              />
              <button disabled={prompt?.kind !== 'text'}>
                {translate({ id: 'tryruyi.device.enter', message: '输入' })} ↵
              </button>
            </form>
          </section>
        )}
        <aside className={styles.aside}>
          {fastbootRequired && (
            <section>
              <h2>
                <Usb size={20} /> Fastboot
              </h2>
              <div className={styles.status}>
                <i data-online={online} />
                {!navigator.usb
                  ? translate({
                      id: 'tryruyi.device.usbUnavailable',
                      message: '浏览器不支持 WebUSB',
                    })
                  : online
                    ? usb.label
                    : usb?.lastDevice
                      ? translate({
                          id: 'tryruyi.device.reconnecting',
                          message:
                            '等待设备重新连接。重启后 USB 名称或 ID 可能变化。若未自动重连，请点击“连接开发板”，选择这块板新出现的设备。',
                        })
                      : translate({
                          id: 'tryruyi.device.disconnected',
                          message: '未连接开发板',
                        })}
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={
                  !navigator.usb ||
                  complete ||
                  !usb?.acceptSelection ||
                  usb?.selecting
                }
                onClick={connect}
              >
                {translate({
                  id: 'tryruyi.device.connect',
                  message: '连接开发板',
                })}
              </Button>
            </section>
          )}
          <section>
            <h2>
              <FolderOpen size={20} />
              {translate({
                id: 'tryruyi.device.directory',
                message: '镜像目录',
              })}
            </h2>
            <p>
              {directoryName
                ? `${directoryName}/RuyiImages/`
                : translate({
                    id: 'tryruyi.device.directoryHint',
                    message: '选择本机目录保存下载包和解包后的分区文件。',
                  })}
            </p>
            <Button
              variant="secondary"
              size="sm"
              disabled={
                pickingDirectory ||
                !window.showDirectoryPicker ||
                (Boolean(directoryName) &&
                  !complete &&
                  prompt?.kind !== 'directory')
              }
              onClick={selectDirectory}
            >
              {translate({
                id: 'tryruyi.device.chooseDirectory',
                message: '选择目录',
              })}
            </Button>
          </section>
          {transfer && (
            <section>
              <h2>
                <Download size={20} />
                {phaseLabel(transfer.phase)}
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
              <h2>
                {translate({
                  id: 'tryruyi.device.imageFile',
                  message: '选择镜像文件',
                })}
              </h2>
              <p>{prompt.spec.name}</p>
              {prompt.mirrors.map((url) => (
                <a
                  className={styles.downloadLink}
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {translate(
                    {
                      id: 'tryruyi.device.downloadFrom',
                      message: '从 {host} 下载',
                    },
                    { host: new URL(url).hostname },
                  )}
                </a>
              ))}
              <Button variant="secondary" size="sm" onClick={selectImage}>
                {translate({
                  id: 'tryruyi.device.chooseFile',
                  message: '选择本地文件',
                })}
              </Button>
              <input
                ref={filePicker}
                hidden
                type="file"
                accept={extension}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  acceptImage(file);
                }}
              />
            </section>
          )}
          {issue && (
            <p role="alert" className={styles.error}>
              {issue}
            </p>
          )}
          <details
            className={styles.traceCard}
            onToggle={(event) => setTraceOpen(event.currentTarget.open)}
          >
            <summary>
              {translate({
                id: 'tryruyi.device.flashLog',
                message: '刷写日志',
              })}
            </summary>
            {traceOpen && (
              <>
                <div className={styles.traceActions}>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!traceText}
                    onClick={copyTrace}
                  >
                    {translate({
                      id: 'tryruyi.device.copyLog',
                      message: '复制日志',
                    })}
                  </Button>
                  <span role="status">
                    {copyStatus === 'copied' &&
                      translate({
                        id: 'tryruyi.device.copiedLog',
                        message: '已复制',
                      })}
                    {copyStatus === 'manual' &&
                      translate({
                        id: 'tryruyi.device.copyLogManually',
                        message: '请手动复制已选中的日志。',
                      })}
                  </span>
                </div>
                <pre
                  ref={traceView}
                  tabIndex={0}
                  onScroll={(event) => {
                    const view = event.currentTarget;
                    followTrace.current =
                      view.scrollHeight - view.scrollTop - view.clientHeight <
                      4;
                  }}
                >
                  {traceText}
                </pre>
              </>
            )}
          </details>
        </aside>
      </div>
    </>
  );
}
