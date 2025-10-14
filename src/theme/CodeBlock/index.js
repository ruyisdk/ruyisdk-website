import React from 'react';
import RuyiCodeBlock from '@site/src/components/docs_utils/CodeBlock';

// Adapter to route all fenced code blocks to our custom CodeBlock
export default function CodeBlockAdapter(props) {
  const { children, className = '', metastring, title, language } = props;

  const rawCode = typeof children === 'string' ? children : String(children || '');

  // Derive language from explicit prop or className like "language-bash"
  const langFromClass = /(?:^|\s)language-([\w-]+)/.exec(className || '');
  const derivedLang = language ?? (langFromClass && langFromClass[1]) ?? '';
  // If language is explicitly empty/absent, fall back to plain text; otherwise use provided
  const lang = String(derivedLang).trim() === '' ? 'text' : derivedLang;

  // Parse metastring for filename/title (supports: filename=xxx title="My Title")
  let filename;
  let customTitle = title;
  if (typeof metastring === 'string' && metastring.trim()) {
    const fileMatch = metastring.match(/(?:^|\s)filename=([^\s"']+)/);
    const titleMatchQuoted = metastring.match(/(?:^|\s)title=("|')(.*?)\1/);
    const titleMatchBare = metastring.match(/(?:^|\s)title=([^\s"']+)/);

    if (fileMatch && fileMatch[1]) filename = fileMatch[1];
    if (!customTitle) {
      if (titleMatchQuoted && titleMatchQuoted[2]) customTitle = titleMatchQuoted[2];
      else if (titleMatchBare && titleMatchBare[1]) customTitle = titleMatchBare[1];
    }
  }

  return (
    <RuyiCodeBlock
      code={rawCode}
      lang={lang}
      filename={filename}
      title={customTitle}
    />
  );
}


