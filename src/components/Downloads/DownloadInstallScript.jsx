import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import MarkdownCard from '@site/src/components/About/MarkdownCard';
import CodeBlock from '@theme/CodeBlock';

import InstallEn from './mdx/install.en.mdx';
import InstallZhHans from './mdx/install.zh-Hans.mdx';

const INSTALL_CONTENT = {
  'zh-Hans': InstallZhHans,
  en: InstallEn,
};

function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en;
}

function PreCodeBlock(props) {
  const children = React.Children.toArray(props.children);
  const code = children.find(
    (child) => React.isValidElement(child)
      && (child.type === 'code' || child.props?.mdxType === 'code')
  );

  if (!code) {
    return <pre {...props} />;
  }

  return <CodeBlock {...code.props} />;
}

const MDX_COMPONENTS = {
  pre: PreCodeBlock,
};

export default function DownloadInstallScript() {
  const { i18n } = useDocusaurusContext();
  const InstallContent = resolveLocalizedContent(INSTALL_CONTENT, i18n?.currentLocale);

  return (
    <MarkdownCard className="w-full">
      <InstallContent components={MDX_COMPONENTS} />
    </MarkdownCard>
  );
}
