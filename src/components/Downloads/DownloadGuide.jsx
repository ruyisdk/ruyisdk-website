import React from 'react';
import resolveLocalizedContent from '@site/src/utils/resolveLocalizedContent';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Admonition from '@theme/Admonition';
import MarkdownCard from '@site/src/components/About/MarkdownCard';

import GuideDe from './mdx/guide.de.mdx';
import GuideEn from './mdx/guide.en.mdx';
import GuideZhHans from './mdx/guide.zh-Hans.mdx';

const GUIDE_CONTENT = {
  'zh-Hans': GuideZhHans,
  en: GuideEn,
  de: GuideDe,
};

const MDX_COMPONENTS = {
  admonition: Admonition,
};

export default function DownloadGuide() {
  const { i18n } = useDocusaurusContext();
  const GuideContent = resolveLocalizedContent(GUIDE_CONTENT, i18n?.currentLocale);

  return (
    <MarkdownCard className="mt-8 mb-8 w-full">
      <GuideContent components={MDX_COMPONENTS} />
    </MarkdownCard>
  );
}
