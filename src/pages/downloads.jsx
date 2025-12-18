import React, { useEffect, useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Translate, { translate } from "@docusaurus/Translate";
import ReactDOM from "react-dom";
import CodeBlock from '@site/src/components/docs_utils/CodeBlock';
import latestPm from '@site/src/generated/latest_pm.json';

// NOTE: /downloads must be self-contained. The global theme does not guarantee
// that --ruyi-* CSS variables exist, so we provide safe fallbacks to existing
// Docusaurus theme tokens.
const COLOR_VARS = {
  gold: 'var(--ruyi-gold, var(--ifm-color-warning))',
  goldDark: 'var(--ruyi-gold-dark, var(--ifm-color-warning-dark, var(--ifm-color-warning)))',
  blue: 'var(--ruyi-blue, var(--ifm-color-primary))',
  blueDark: 'var(--ruyi-blue-dark, var(--ifm-color-primary-dark, var(--ifm-color-primary)))',
  contrast: 'var(--ruyi-primary-contrast, var(--ifm-font-color-base))',
};

function headerGradientStyle(accent) {
  if (accent === 'gold') {
    return { background: `linear-gradient(90deg, ${COLOR_VARS.goldDark} 0%, ${COLOR_VARS.gold} 100%)` };
  }
  return { background: `linear-gradient(90deg, ${COLOR_VARS.blue} 0%, ${COLOR_VARS.blueDark} 100%)` };
}

function primaryButtonStyle(accent) {
  if (accent === 'gold') {
    return {
      backgroundColor: COLOR_VARS.gold,
      color: COLOR_VARS.contrast,
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    };
  }
  return {
    backgroundColor: COLOR_VARS.blue,
    color: 'white',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
  };
}

function pillButtonStyle(active, accent) {
  if (active) {
    return {
      ...primaryButtonStyle(accent),
      borderColor: 'transparent',
    };
  }
  return {
    backgroundColor: 'white',
    color: COLOR_VARS.contrast,
    borderColor: 'rgba(0,0,0,0.18)',
  };
}

const ARCHES = [
  {
    id: 'x86_64',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'riscv64',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    id: 'aarch64',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

function detectArchFromNavigator() {
  if (typeof navigator === 'undefined') return null;
  const ua = (navigator.userAgent || '').toLowerCase();
  const uaArch = (navigator.userAgentData && navigator.userAgentData.architecture) || '';
  if (/riscv64|risc-v|riscv/.test(ua) || /riscv64/.test(uaArch)) return 'riscv64';
  if (/aarch64|arm64/.test(ua) || /arm64/.test(uaArch)) return 'aarch64';
  return 'x86_64';
}

function useDetectedArch() {
  const [arch, setArch] = useState('x86_64');
  useEffect(() => {
    const detected = detectArchFromNavigator();
    if (detected) setArch(detected);
  }, []);
  return [arch, setArch];
}

function filenameFromUrl(urlString) {
  if (!urlString) return '';
  try {
    const url = new URL(urlString);
    return url.pathname.split('/').filter(Boolean).pop() || '';
  } catch {
    return urlString.split('/').pop() || '';
  }
}

function ArchSelector({ selectedArch, onChange, accent }) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
        <Translate id="downloads.selectArch">选择架构</Translate>
      </label>
      <div className="flex flex-wrap gap-4">
        {ARCHES.map(({ id, icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 border ${
              selectedArch === id
                ? 'scale-105'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200'
            }`}
            style={
              selectedArch === id
                ? {
                    backgroundColor: accent === 'gold' ? COLOR_VARS.gold : COLOR_VARS.blue,
                    color: accent === 'gold' ? COLOR_VARS.contrast : 'white',
                    borderColor: 'transparent',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                  }
                : undefined
            }
            type="button"
          >
            {icon}
            {id}
          </button>
        ))}
      </div>
    </div>
  );
}

// Re-using the background style from About page as requested
function PageBackground({ isClient }) {
  if (!isClient) return null;
  return ReactDOM.createPortal(
    <div>
      <div
        aria-hidden
        className="fixed top-0 left-0 rounded-full -z-10"
        style={{ width: 600, height: 600, background: "rgba(221, 190, 221, 0.2)", filter: "blur(120px)" }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 right-0 rounded-full -z-10"
        style={{ width: 700, height: 700, background: "rgba(168, 218, 220, 0.2)", filter: "blur(120px)" }}
      />
    </div>,
    document.body,
  );
}

function PackageManagerSection({ releaseData }) {
  const data = releaseData;
  const hasReleaseData = Boolean(data?.channels?.stable?.download_urls);
  const [selectedArch, setSelectedArch] = useDetectedArch();

  const mirrorLink = useMemo(() => {
    if (!hasReleaseData) return '';
    // JSON structure: data.channels.stable.download_urls["linux/x86_64"] = [github, mirror]
    return data.channels?.stable?.download_urls?.[`linux/${selectedArch}`]?.[1] || '';
  }, [data, hasReleaseData, selectedArch]);

  const githubLink = useMemo(() => {
    if (!hasReleaseData) return '';
    return data.channels?.stable?.download_urls?.[`linux/${selectedArch}`]?.[0] || '';
  }, [data, hasReleaseData, selectedArch]);

  const filename = useMemo(() => {
    return filenameFromUrl(mirrorLink || githubLink);
  }, [mirrorLink, githubLink]);

  const version = data?.channels?.stable?.version || 'latest';

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10 transition-all hover:shadow-2xl">
      <div className="px-8 py-6 text-white" style={headerGradientStyle('gold')}>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <Translate id="downloads.pm.title">RuyiSDK Package Manager</Translate>
        </h2>
        <p className="mt-2 text-lg opacity-90 text-white/90">
            <Translate id="downloads.pm.description">
            Ruyi 包管理器是 RuyiSDK 的核心组件，提供包管理、环境配置等功能。
            </Translate>
        </p>
      </div>
      
      <div className="p-6 sm:p-8">
        <ArchSelector
          selectedArch={selectedArch}
          onChange={setSelectedArch}
          accent="gold"
        />

        {!hasReleaseData ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-5 py-4 rounded-xl">
            <p className="m-0">
              <Translate id="downloads.pm.noData">
                当前构建未能获取最新版本信息，请使用下方 Mirror / GitHub Releases 链接获取下载。
              </Translate>
            </p>
          </div>
        ) : (
            <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide rounded-full">
                          <Translate id="downloads.badge.stable">稳定版</Translate>
                        </span>
                        <span className="text-gray-500 text-sm font-medium">
                          <Translate id="downloads.label.version">版本</Translate> {version}
                        </span>
                    </div>
                    <div
                      className="font-mono text-sm text-gray-600 break-all bg-white px-3 py-2 rounded inline-block max-w-full"
                      style={{ border: '1px solid rgba(0,0,0,0.10)' }}
                    >
                        {filename || <Translate id="downloads.noLink">暂无下载链接</Translate>}
                    </div>
                </div>
                {(mirrorLink || githubLink) && (
                  <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    {mirrorLink && (
                      <a
                          href={mirrorLink}
                          className="w-full inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl transition-all focus:outline-none hover:opacity-95 hover:shadow-lg transform hover:-translate-y-0.5"
                          style={primaryButtonStyle('gold')}
                        >
                        <svg className="mr-2 -ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <Translate id="downloads.pm.downloadBtn">下载二进制包</Translate>
                      </a>
                    )}
                    {githubLink && (
                      <a
                        href={githubLink}
                        className="w-full inline-flex items-center justify-center px-6 py-4 border text-base font-bold rounded-xl bg-white hover:bg-gray-50 transition-all focus:outline-none"
                        style={{
                          color: COLOR_VARS.contrast,
                          borderColor: 'rgba(0,0,0,0.16)',
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Translate id="downloads.label.github">GitHub</Translate>
                      </a>
                    )}
                  </div>
                )}
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm">1</span>
                    <Translate id="downloads.installGuide">安装指南</Translate>
                </h3>
                <div className="pl-10 space-y-6">
                    <div>
                        <p className="text-gray-600 mb-3">
                            <Translate id="downloads.installStep1">下载完成后，执行以下命令赋予可执行权限并移动到系统路径：</Translate>
                        </p>
                        <CodeBlock
                          lang="bash"
                          code={`chmod +x ./${filename || 'ruyi'}\nsudo cp -v ./${filename || 'ruyi'} /usr/local/bin/ruyi`}
                        />
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 -ml-10">
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm">2</span>
                            <Translate id="downloads.verify">验证安装</Translate>
                        </h3>
                        <CodeBlock lang="bash" code="ruyi version" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 -ml-10">
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm">3</span>
                            <Translate id="downloads.completion">启用自动补全 (可选)</Translate>
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bash</span>
                                <CodeBlock lang="bash" code='eval "$(ruyi --output-completion-script=bash)"' />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Zsh</span>
                                <CodeBlock lang="bash" code={`#compdef ruyi
eval "$(ruyi --output-completion-script=zsh)"`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap gap-4 justify-center md:justify-start">
        <span className="font-medium"><Translate id="downloads.otherMethods">其他安装方式：</Translate></span>
        <a
          href="/docs/Package-Manager/installation"
          className="hover:underline font-medium transition-colors"
          style={{ color: COLOR_VARS.gold }}
        >
            <Translate id="downloads.viewDocs">查看完整安装文档</Translate>
        </a>
        <span className="text-gray-300">|</span>
        <a
          href="https://github.com/ruyisdk/ruyi/releases"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium transition-colors"
          style={{ color: COLOR_VARS.gold }}
        >
            <Translate id="downloads.label.githubReleases">GitHub Releases</Translate>
        </a>
        <span className="text-gray-300">|</span>
        <a
          href="https://mirror.iscas.ac.cn/ruyisdk/ruyi/releases/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium transition-colors"
          style={{ color: COLOR_VARS.gold }}
        >
          <Translate id="downloads.label.mirror">镜像站</Translate>
        </a>
      </div>
    </section>
  );
}

function IDESection() {
  const [selectedArch, setSelectedArch] = useDetectedArch();
  
  // Hardcoded for now as per old page logic, but structured better
  const ideVersion = "0.0.3";
  const downloadLink = `https://mirror.iscas.ac.cn/ruyisdk/ide/${ideVersion}/ruyisdk-${ideVersion}-linux.gtk.${selectedArch === 'x86_64' ? 'x86_64' : selectedArch}.tar.gz`;
  
  return (
    <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-10 transition-all hover:shadow-2xl">
      <div className="px-8 py-6 text-white" style={headerGradientStyle('blue')}>
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 m-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <Translate id="downloads.ide.title">RuyiSDK IDE</Translate>
        </h2>
        <p className="mt-2 text-lg opacity-90 text-white/90">
            <Translate id="downloads.ide.description">
            基于 Eclipse 的集成开发环境，提供开箱即用的 RISC-V 开发体验。
            </Translate>
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <ArchSelector
          selectedArch={selectedArch}
          onChange={setSelectedArch}
          accent="blue"
        />

        <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full">
                          <Translate id="downloads.badge.stable">稳定版</Translate>
                        </span>
                        <span className="text-gray-500 text-sm font-medium">
                          <Translate id="downloads.label.version">版本</Translate> {ideVersion}
                        </span>
                    </div>
                    <div
                      className="font-mono text-sm text-gray-600 break-all bg-white px-3 py-2 rounded inline-block max-w-full"
                      style={{ border: '1px solid rgba(0,0,0,0.10)' }}
                    >
                        ruyisdk-{ideVersion}-linux.gtk.{selectedArch}.tar.gz
                    </div>
                </div>
                <a
                  href={downloadLink}
                  className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl transition-all focus:outline-none hover:opacity-95 hover:shadow-lg transform hover:-translate-y-0.5"
                  style={primaryButtonStyle('blue')}
                >
                    <svg className="mr-2 -ml-1 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <Translate id="downloads.ide.downloadBtn">下载 IDE</Translate>
                </a>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm">1</span>
                    <Translate id="downloads.installGuide">安装指南</Translate>
                </h3>
                <div className="pl-10 space-y-6">
                    <div>
                        <p className="text-gray-600 mb-3">
                            <Translate id="downloads.ide.installStep1">建立目录并解压：</Translate>
                        </p>
                        <CodeBlock lang="bash" code={`sudo mkdir -p /opt/ruyisdk
cd /opt/ruyisdk
sudo tar -zxvf ~/Downloads/ruyisdk-${ideVersion}-linux.gtk.${selectedArch}.tar.gz`} />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 -ml-10">
                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm">2</span>
                            <Translate id="downloads.ide.installStep2">运行 IDE：</Translate>
                        </h3>
                        <CodeBlock lang="bash" code="/opt/ruyisdk/ruyisdk/ruyisdk" />
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-yellow-800 mb-2">
                            <Translate id="downloads.ide.pluginTitle">插件安装</Translate>
                        </h4>
                        <p className="text-yellow-700 mb-4 leading-relaxed">
                            <Translate id="downloads.ide.pluginDesc">
                                目前插件需要手动安装。请从 GitHub Releases 下载最新插件包，并将 org.ruyisdk.ide_*.zip 解包到 RuyiSDK IDE 安装目录下的 dropins 目录中。
                            </Translate>
                        </p>
                        <a 
                            href="https://github.com/ruyisdk/ruyisdk-eclipse-plugins/releases/latest" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-bold text-yellow-800 hover:text-yellow-900 underline"
                        >
                            <Translate id="downloads.ide.pluginLink">前往下载插件</Translate> 
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default function DownloadsPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedSection, setSelectedSection] = useState('pm');

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Layout
      title={translate({
        id: 'downloads.meta.title',
        message: '下载',
      })}
      description={translate({
        id: 'downloads.meta.description',
        message: '下载 RuyiSDK 包管理器与 IDE',
      })}
    >
      <PageBackground isClient={isClient} />
      <div className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site">
          
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm mb-4">
              <Translate id="downloads.title">下载 RuyiSDK</Translate>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              <Translate id="downloads.subtitle">
                获取 RuyiSDK 包管理器和 IDE，开启您的 RISC-V 开发之旅。
              </Translate>
            </p>

            {/* Section switch: Package Manager / IDE */}
            <div className="mt-6 inline-flex rounded-full bg-white p-1 shadow-sm">
              <button
                onClick={() => setSelectedSection('pm')}
                className="px-4 py-2 rounded-full font-medium transition-all border"
                style={pillButtonStyle(selectedSection === 'pm', 'gold')}
                aria-pressed={selectedSection === 'pm'}
                type="button"
              >
                <Translate id="downloads.switch.pm">包管理器</Translate>
              </button>
              <button
                onClick={() => setSelectedSection('ide')}
                className="ml-2 px-4 py-2 rounded-full font-medium transition-all border"
                style={pillButtonStyle(selectedSection === 'ide', 'blue')}
                aria-pressed={selectedSection === 'ide'}
                type="button"
              >
                <Translate id="downloads.switch.ide">IDE</Translate>
              </button>
            </div>
          </div>

          <div className="w-full grid gap-8">
            {selectedSection === 'pm' ? (
              <PackageManagerSection releaseData={latestPm} />
            ) : (
              <IDESection />
            )}
          </div>

          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>
              <Translate
                id="downloads.agreement"
                values={{
                  privacyLink: (
                    <a href="/docs/legal/privacyPolicy/" className="hover:underline" style={{ color: COLOR_VARS.blue }}>
                      <Translate id="downloads.privacy">隐私声明</Translate>
                    </a>
                  ),
                }}
              >
                {'下载并使用 RuyiSDK，即表示您同意许可条款和 {privacyLink}。'}
              </Translate>
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
}
