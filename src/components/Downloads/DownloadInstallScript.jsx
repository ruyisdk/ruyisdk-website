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

export default function DownloadInstallScript({ variant = 'default' }) {
  const { i18n } = useDocusaurusContext();
  const InstallContent = resolveLocalizedContent(INSTALL_CONTENT, i18n?.currentLocale);

  const components = React.useMemo(() => {
    const base = { ...MDX_COMPONENTS };
    if (variant === 'plain') {
      base.h2 = (props) => (
        <h3
          className="text-xl font-bold text-gray-900 mb-4"
          style={{
            marginTop: 0,
            marginBottom: '1rem',
            fontSize: '1.25rem',
            fontWeight: '700',
            lineHeight: '1.75rem',
          }}
          {...props}
        />
      );
    }
    return base;
  }, [variant]);

  return (
    <MarkdownCard variant={variant} className="w-full">
      <InstallContent components={components} />
    </MarkdownCard>
  );
}
