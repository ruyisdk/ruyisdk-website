import React, { useMemo } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import { COLOR_VARS, IDE_ECLIPSE_RELEASES_URL, IDE_MIRROR_URL, IDE_VSCODE_RELEASES_URL } from './constants';
import { headerGradientStyle } from './styles';

export default function IDESection() {
  const entries = useMemo(() => {
    return [
      {
        title: translate({ id: 'downloads.ide.entry.mirror', message: 'IDE 镜像目录' }),
        description: translate({ id: 'downloads.ide.entry.mirror.desc', message: '获取 IDE 的最新构建/版本。' }),
        href: IDE_MIRROR_URL,
      },
      {
        title: translate({ id: 'downloads.ide.entry.vscode', message: 'RuyiSDK VS Code Extension（Releases）' }),
        description: translate({ id: 'downloads.ide.entry.vscode.desc', message: '基于 VS Code 的 RuyiSDK 扩展发布页。' }),
        href: IDE_VSCODE_RELEASES_URL,
      },
      {
        title: translate({ id: 'downloads.ide.entry.eclipse', message: 'RuyiSDK Eclipse（Releases）' }),
        description: translate({ id: 'downloads.ide.entry.eclipse.desc', message: '基于 Eclipse 的 RuyiSDK 项目发布页。' }),
        href: IDE_ECLIPSE_RELEASES_URL,
      },
    ];
  }, []);

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
      <div className="px-8 py-6 text-white" style={headerGradientStyle('blue')}>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <Translate id="downloads.ide.title">RuyiSDK IDE</Translate>
        </h2>
        <p className="mt-2 text-lg opacity-90 text-white/90">
          <Translate id="downloads.ide.description">IDE 相关下载与发布入口。</Translate>
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full">
              <Translate id="downloads.badge.stable">稳定版</Translate>
            </span>
            <span className="text-gray-500 text-sm font-medium">
              <Translate id="downloads.ide.latestOnly">前往下载页面</Translate>
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {entries.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900 mb-1 group-hover:underline" style={{ color: COLOR_VARS.contrast }}>
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">{item.description}</div>
                  </div>

                  <span
                    aria-hidden
                    className="shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white border border-gray-200 shadow-sm group-hover:shadow-md transition-all"
                    style={{ color: COLOR_VARS.blue }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v10" />
                      <path d="M7 11l5 5 5-5" />
                      <path d="M4 21h16" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}