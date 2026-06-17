import React from 'react';
import Translate, { translate } from '@docusaurus/Translate';

export default function DownloadGuide({ sectionIds }) {
  const stepItems = [
    {
      number: '01',
      title: translate({ id: 'downloads.guide.step.os.title', message: '确认操作系统' }),
      description: translate({
        id: 'downloads.guide.step.os.description',
        message: '包管理器当前支持 Linux 平台的 x86_64、aarch64 与 riscv64 架构。',
      }),
    },
    {
      number: '02',
      title: translate({ id: 'downloads.guide.step.habit.title', message: '选择使用习惯' }),
      description: translate({
        id: 'downloads.guide.step.habit.description',
        message: '命令行用户下载包管理器；VS Code 或 Eclipse 用户安装对应插件。',
      }),
    },
    {
      number: '03',
      title: translate({ id: 'downloads.guide.step.download.title', message: '下载开发工具' }),
      description: translate({
        id: 'downloads.guide.step.download.description',
        message: '点击下方卡片获取最新版，或进入其它版本列表选择指定发布。',
      }),
    },
  ];

  const toolItems = [
    {
      label: translate({ id: 'downloads.guide.tool.pm.label', message: '喜欢命令行操作？' }),
      target: translate({ id: 'downloads.guide.tool.pm.target', message: '下载 RuyiSDK 包管理器' }),
      href: `#${sectionIds.packageManager}`,
    },
    {
      label: translate({ id: 'downloads.guide.tool.vscode.label', message: '习惯使用 VS Code？' }),
      target: translate({ id: 'downloads.guide.tool.vscode.target', message: '安装 VS Code 插件' }),
      href: `#${sectionIds.vscodeExtension}`,
    },
    {
      label: translate({ id: 'downloads.guide.tool.eclipse.label', message: '习惯使用 Eclipse？' }),
      target: translate({ id: 'downloads.guide.tool.eclipse.target', message: '安装 Eclipse 插件' }),
      href: `#${sectionIds.eclipseExtension}`,
    },
  ];

  return (
    <section className="mb-8 w-full rounded-3xl border border-gray-100 bg-white shadow-xl overflow-hidden">
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <div className="text-sm font-bold uppercase text-amber-600">
            <Translate id="downloads.guide.eyebrow">关于 RuyiSDK 下载</Translate>
          </div>
          <h2 className="mt-2 mb-0 text-2xl md:text-3xl font-extrabold text-gray-900 tracking-normal">
            <Translate id="downloads.guide.title">选择适合你的 RISC-V 开发入口</Translate>
          </h2>
          <p className="mt-4 mb-0 text-base leading-8 text-gray-700">
            <Translate id="downloads.guide.description">
              RuyiSDK 的核心是一套完整的 RISC-V 开发工具链，包含编译器、调试器、模拟器等关键组件。推荐优先通过包管理器获取和管理这些工具；如果你习惯集成开发环境，也可以安装 VS Code 插件或 Eclipse 插件，在图形界面中完成工具链调用与环境管理。
            </Translate>
          </p>
          <div className="mt-5 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
            <Translate id="downloads.guide.notice">
              VS Code 与 Eclipse 插件可运行于 Linux、Windows、macOS，但插件所调用的 ruyi 包管理器及其分发的工具链均需在 Linux 环境运行；Windows 或 macOS 用户请准备虚拟机、WSL 或容器等 Linux 环境。
            </Translate>
          </div>
        </div>

        <div className="border-t lg:border-l lg:border-t-0 border-gray-200 bg-gray-50 px-6 py-7 sm:px-8 sm:py-8">
          <div className="grid gap-4">
            {stepItems.map((item) => (
              <div key={item.number} className="flex gap-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-extrabold text-blue-700">
                  {item.number}
                </span>
                <div>
                  <h3 className="m-0 text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 mb-0 text-sm leading-6 text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-0 border-t border-gray-200 md:grid-cols-3">
        {toolItems.map((item, index) => (
          <a
            key={item.href}
            href={item.href}
            className={`block px-6 py-4 text-decoration-none hover:bg-gray-50 ${index > 0 ? 'border-t md:border-l md:border-t-0 border-gray-200' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <span className="block text-sm font-semibold text-gray-500">{item.label}</span>
            <span className="mt-1 block text-base font-extrabold text-gray-900">{item.target}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
