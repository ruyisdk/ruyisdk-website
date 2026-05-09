import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageBackground } from "@site/src/components/Home/Background";

import AboutDe from "./mdx/about.de.mdx";
import AboutEn from "./mdx/about.en.mdx";
import AboutZhHans from "./mdx/about.zh-Hans.mdx";
import ContactDe from "./mdx/contact.de.mdx";
import ContactEn from "./mdx/contact.en.mdx";
import ContactZhHans from "./mdx/contact.zh-Hans.mdx";
import QrDe from "./mdx/qr.de.mdx";
import QrEn from "./mdx/qr.en.mdx";
import QrZhHans from "./mdx/qr.zh-Hans.mdx";

import styles from "./about.module.css";

const ABOUT_CONTENT = {
  "zh-Hans": AboutZhHans,
  de: AboutDe,
  en: AboutEn,
};

const CONTACT_CONTENT = {
  "zh-Hans": ContactZhHans,
  de: ContactDe,
  en: ContactEn,
};

const QR_CONTENT = {
  "zh-Hans": QrZhHans,
  de: QrDe,
  en: QrEn,
};

function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en;
}

export default function About() {
  const { i18n } = useDocusaurusContext();
  const AboutContent = resolveLocalizedContent(ABOUT_CONTENT, i18n?.currentLocale);
  const ContactContent = resolveLocalizedContent(CONTACT_CONTENT, i18n?.currentLocale);
  const QrContent = resolveLocalizedContent(QR_CONTENT, i18n?.currentLocale);

  return (
    <div className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
      <PageBackground />
      <div className="mx-auto relative z-10 max-w-screen-xl flex flex-col items-center">
        <div className="w-full grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-stretch">
          <section className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6 sm:p-8">
            <div className={styles.aboutMarkdown}>
              <AboutContent />
            </div>
          </section>

          <aside className="flex h-full flex-col gap-6">
            <section className="bg-white/75 backdrop-blur-md rounded-2xl border border-white/70 shadow-lg p-6">
              <div className={styles.aboutMarkdown}>
                <ContactContent />
              </div>
            </section>

            <section className="bg-white/45 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-6 flex-1">
              <div className={styles.aboutMarkdown}>
                <QrContent />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
