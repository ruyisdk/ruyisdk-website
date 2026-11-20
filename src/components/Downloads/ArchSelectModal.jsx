import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Translate, { translate } from '@docusaurus/Translate';

function archLabel(arch) {
  if (arch === 'x86_64') return translate({ id: 'downloads.arch.x86_64', message: 'x86_64' });
  if (arch === 'aarch64') return translate({ id: 'downloads.arch.aarch64', message: 'aarch64' });
  if (arch === 'riscv64') return translate({ id: 'downloads.arch.riscv64', message: 'riscv64' });
  return translate({ id: 'downloads.arch.universal', message: '通用（无架构区分）' });
}

export default function ArchSelectModal({ modalState, onClose, onSelect }) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!modalState.open) return;
    const id = window.requestAnimationFrame(() => setEntered(true));
    return () => {
      window.cancelAnimationFrame(id);
      setEntered(false);
    };
  }, [modalState.open]);

  if (!modalState.open || typeof document === 'undefined') return null;

  return createPortal(
    <div className={`fixed inset-0 z-[var(--ifm-z-index-overlay)] transition-opacity duration-200 ${entered ? 'opacity-100' : 'opacity-0'}`}>
      <button aria-label={translate({ id: 'downloads.modal.close', message: '关闭' })} type="button" className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col rounded-2xl bg-white dark:bg-[#151b23] border border-slate-200/90 dark:border-white/12 shadow-[0_24px_48px_rgba(10,44,126,0.16)] transition-all duration-200 ${entered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
        >
          <div className="shrink-0 px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200/80 dark:border-white/10">
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              <Translate id="downloads.modal.title">选择架构并下载</Translate>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {modalState.projectLabel} · <Translate id="downloads.modal.latestVersion">最新版本</Translate> {modalState.version || '-'}
            </div>
          </div>

          <div className="min-h-0 overflow-y-auto p-4 grid gap-3">
            {modalState.options.map((item) => (
              <button
                key={`${item.arch}-${item.url}`}
                type="button"
                className="w-full rounded-xl border border-slate-200/85 dark:border-white/10 bg-[#f8fafd] dark:bg-[#1c2330] hover:bg-[#eef4ff]/65 dark:hover:bg-[#253042] hover:border-[#1648B8]/30 hover:shadow-sm transition-all px-4 py-3 text-left cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="font-semibold text-slate-900 dark:text-slate-100">{archLabel(item.arch)}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400" style={{ wordBreak: 'break-all' }}>{item.fileName || item.url}</div>
              </button>
            ))}
          </div>

          <div className="shrink-0 px-5 py-3.5 sm:px-6 sm:py-4 border-t border-slate-200/80 dark:border-white/10 flex justify-end">
            <button
              type="button"
              className="secondary-button text-sm font-semibold whitespace-nowrap"
              onClick={onClose}
            >
              <Translate id="downloads.modal.cancel">取消</Translate>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
