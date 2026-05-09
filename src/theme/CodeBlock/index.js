import React from 'react';
import RuyiCodeBlock from '@site/src/components/Docs/CodeBlock';

function parseMetaString(metastring) {
  if (typeof metastring !== 'string' || !metastring.trim()) {
    return {};
  }

  const meta = {};
  const matcher = /(?:^|\s)([^\s="'{}]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g;
  let match;

  while ((match = matcher.exec(metastring)) !== null) {
    const [, key, doubleQuoted, singleQuoted, bare] = match;
    meta[key] = doubleQuoted ?? singleQuoted ?? bare ?? true;
  }

  return meta;
}

// Adapter to route all fenced code blocks to our custom CodeBlock
export default function CodeBlockAdapter(props) {
  const { children, className = '', metastring, title, language } = props;

  const rawCode = typeof children === 'string' ? children : String(children || '');

  // Derive language from explicit prop or className like "language-bash"
  const langFromClass = /(?:^|\s)language-([\w-]+)/.exec(className || '');
  const derivedLang = language ?? (langFromClass && langFromClass[1]) ?? '';
  // If language is explicitly empty/absent, fall back to plain text; otherwise use provided
  const lang = String(derivedLang).trim() === '' ? 'text' : derivedLang;

  const meta = parseMetaString(metastring);
  const hasInput = Object.prototype.hasOwnProperty.call(meta, 'input');
  const customTitle = title || meta.title || '';
  const input = hasInput && typeof meta.input === 'string' ? meta.input : '';
  const copiable = meta.nocopy || meta.noCopy ? false : (meta.copiable ? true : undefined);

  return (
    <RuyiCodeBlock
      code={rawCode}
      lang={lang}
      title={customTitle}
      copiable={copiable}
      input={input}
      hasInput={hasInput}
    />
  );
}
