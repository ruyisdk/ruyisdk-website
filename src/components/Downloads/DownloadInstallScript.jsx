import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import MarkdownCard from '@site/src/components/About/MarkdownCard';

import InstallEn from './mdx/install.en.mdx';
import InstallZhHans from './mdx/install.zh-Hans.mdx';

const INSTALL_CONTENT = {
  'zh-Hans': InstallZhHans,
  en: InstallEn,
};

function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en;
}

export default function DownloadInstallScript() {
  const { i18n } = useDocusaurusContext();
  const InstallContent = resolveLocalizedContent(INSTALL_CONTENT, i18n?.currentLocale);

  return (
    <MarkdownCard className="w-full">
      <InstallContent />
    </MarkdownCard>
  );
}
