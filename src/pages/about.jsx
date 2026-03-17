import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import ReactDOM from "react-dom";
import Translate from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { marked } from "marked";
import { QRCode, QRGroup } from "@site/src/components/common";
import styles from "./about.module.css";

const ABOUT_CONTENT_FILES = {
  "zh-Hans": "/content/about/about.zh-Hans.md",
  de: "/content/about/about.de.md",
  en: "/content/about/about.en.md",
};

const CONTACT_CONTENT_FILES = {
  "zh-Hans": "/content/about/contact.zh-Hans.md",
  de: "/content/about/contact.de.md",
  en: "/content/about/contact.en.md",
};

const QR_CONTENT_FILES = {
  "zh-Hans": "/content/about/qr.zh-Hans.md",
  de: "/content/about/qr.de.md",
  en: "/content/about/qr.en.md",
};

function resolveAboutContentFile(locale) {
  return ABOUT_CONTENT_FILES[locale] || ABOUT_CONTENT_FILES.en;
}
function resolveContactContentFile(locale) {
  return CONTACT_CONTENT_FILES[locale] || CONTACT_CONTENT_FILES.en;
}
function resolveQrContentFile(locale) {
  return QR_CONTENT_FILES[locale] || QR_CONTENT_FILES.en;
}

// 与 /Community/contributors 页面保持相同的背景风格
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

export default function AboutPage() {
  const [isClient, setIsClient] = useState(false);
  const [aboutMarkdown, setAboutMarkdown] = useState("");
  const [aboutLoadError, setAboutLoadError] = useState(false);
  const [aboutLoading, setAboutLoading] = useState(true);

  const [contactMarkdown, setContactMarkdown] = useState("");
  const [contactLoadError, setContactLoadError] = useState(false);
  const [contactLoading, setContactLoading] = useState(true);

  const [qrMarkdown, setQrMarkdown] = useState("");
  const [qrLoadError, setQrLoadError] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);
  const { i18n } = useDocusaurusContext();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadContent(filePath, setMd, setErr, setLoading) {
      setLoading(true);
      setErr(false);

      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load markdown file: ${filePath}`);
        }
        const markdownText = await response.text();
        if (isActive) {
          setMd(markdownText);
        }
      } catch {
        if (isActive) {
          setErr(true);
          setMd("");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadContent(resolveAboutContentFile(i18n?.currentLocale), setAboutMarkdown, setAboutLoadError, setAboutLoading);
    loadContent(resolveContactContentFile(i18n?.currentLocale), setContactMarkdown, setContactLoadError, setContactLoading);
    loadContent(resolveQrContentFile(i18n?.currentLocale), setQrMarkdown, setQrLoadError, setQrLoading);

    return () => {
      isActive = false;
    };
  }, [i18n?.currentLocale]);

  const pageTitle = i18n?.currentLocale === "zh-Hans" ? "关于我们" : i18n?.currentLocale === "de" ? "Über uns" : "About";
  const aboutHtml = React.useMemo(
    () => marked.parse(aboutMarkdown, { gfm: true, breaks: true }),
    [aboutMarkdown],
  );
  const contactHtml = React.useMemo(
    () => marked.parse(contactMarkdown, { gfm: true, breaks: true }),
    [contactMarkdown],
  );
  const qrHtml = React.useMemo(
    () => marked.parse(qrMarkdown, { gfm: true, breaks: true }),
    [qrMarkdown],
  );

  return (
    <Layout
      title={pageTitle}
      description="RuyiSDK 项目介绍与联系方式"
    >
      <PageBackground isClient={isClient} />
      <div className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site flex flex-col items-center">
          {/* 顶部居中的 名称（已移除 'RuyiSDK' 文本） */}

          {/* 内容主体卡片 */}
          <div className="w-full grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-stretch">
            <section className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6 sm:p-8">
              {aboutLoading && (
                <p className="text-gray-600 text-sm md:text-base">
                  <Translate id="about.content.loading">内容加载中...</Translate>
                </p>
              )}
              {!aboutLoading && aboutLoadError && (
                <p className="text-red-600 text-sm md:text-base">
                  <Translate id="about.content.loadError">内容加载失败，请稍后重试。</Translate>
                </p>
              )}
              {!aboutLoading && !aboutLoadError && (
                <div
                  className={styles.aboutMarkdown}
                  dangerouslySetInnerHTML={{ __html: aboutHtml }}
                />
              )}
            </section>
            {/* 右侧：联系方式与二维码内容由 Markdown 管理 */}
            <aside className="flex h-full flex-col gap-6">
              <section className="bg-white/75 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6">
                {contactLoading && (
                  <p className="text-gray-600 text-sm md:text-base">
                    <Translate id="about.content.loading">内容加载中...</Translate>
                  </p>
                )}
                {!contactLoading && contactLoadError && (
                  <p className="text-red-600 text-sm md:text-base">
                    <Translate id="about.content.loadError">内容加载失败，请稍后重试。</Translate>
                  </p>
                )}
                {!contactLoading && !contactLoadError && (
                  <div
                    className={styles.aboutMarkdown}
                    dangerouslySetInnerHTML={{ __html: contactHtml }}
                  />
                )}
              </section>

              <section className="bg-white/45 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-6 flex-1">
                {qrLoading && (
                  <p className="text-gray-600 text-sm md:text-base">
                    <Translate id="about.content.loading">内容加载中...</Translate>
                  </p>
                )}
                {!qrLoading && qrLoadError && (
                  <p className="text-red-600 text-sm md:text-base">
                    <Translate id="about.content.loadError">内容加载失败，请稍后重试。</Translate>
                  </p>
                )}
                {!qrLoading && !qrLoadError && (
                  <div
                    className={styles.aboutMarkdown}
                    dangerouslySetInnerHTML={{ __html: qrHtml }}
                  />
                )}
              </section>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}
