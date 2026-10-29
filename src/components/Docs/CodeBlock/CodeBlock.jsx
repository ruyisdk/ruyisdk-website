import React, { useState, useMemo, useCallback } from 'react';
import { normalizeCode, cleanShellPrompt } from './utils';
import CodeBlockToolbar from './CodeBlockToolbar';
import CodeBlockBody from './CodeBlockBody';

const CodeBlock = ({
  code = '',
  lang = 'bash',
  langs = [],
  title = '',
  copiable,
  input = '',
  hasInput = false,
  showTitleCopyButton,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentLang, setCurrentLang] = useState(lang);

  const inputLines = useMemo(() => {
    const lines = new Set();
    if (!hasInput || !input) return lines;

    const normalizedInput = String(input).replace(/^['"]|['"]$/g, '');
    const parts = normalizedInput.split(',');

    parts.forEach((part) => {
      part = part.trim();
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
        for (let i = start; i <= end; i++) {
          lines.add(i - 1);
        }
      } else {
        const lineNum = parseInt(part, 10);
        if (!isNaN(lineNum)) {
          lines.add(lineNum - 1);
        }
      }
    });

    return lines;
  }, [input, hasInput]);

  const currentCode = useMemo(() => {
    if (langs && langs.length > 0) {
      const langOption = langs.find((l) => l.lang === currentLang);
      return langOption ? langOption.code : code;
    }
    return code;
  }, [langs, currentLang, code]);

  const { displayCode, highlightLines } = useMemo(() => {
    const lines = currentCode.split('\n');
    const toHighlight = new Set();
    let isHighlighting = false;
    const filteredLines = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.includes('highlight-start')) {
        isHighlighting = true;
        return;
      }

      if (trimmedLine.includes('highlight-end')) {
        isHighlighting = false;
        return;
      }

      if (trimmedLine.includes('highlight-next-line')) {
        toHighlight.add(filteredLines.length);
        return;
      }

      filteredLines.push(line);

      if (isHighlighting) {
        toHighlight.add(filteredLines.length - 1);
      }
    });

    return {
      displayCode: normalizeCode(filteredLines.join('\n')),
      highlightLines: toHighlight,
    };
  }, [currentCode]);

  const displayLang = currentLang === 'no' ? 'text' : currentLang;
  const isInputOutputBlock = hasInput;

  const copyableCode = useMemo(
    () => (isInputOutputBlock ? cleanShellPrompt(displayCode) : displayCode),
    [displayCode, isInputOutputBlock],
  );

  const shouldShowHeaderCopy = useMemo(() => {
    if (typeof showTitleCopyButton === 'boolean') return showTitleCopyButton;
    if (typeof showTitleCopyButton === 'string') return showTitleCopyButton === 'true';
    if (typeof copiable === 'boolean') return copiable;
    if (typeof copiable === 'string') return copiable === 'true';
    return !isInputOutputBlock;
  }, [showTitleCopyButton, copiable, isInputOutputBlock]);

  const headerTitle = useMemo(() => {
    if (title && title.trim() !== '') return title;
    if (isInputOutputBlock) return displayLang;
    if (currentLang === 'text' || currentLang === '') return 'text';
    return displayLang;
  }, [title, currentLang, displayLang, isInputOutputBlock]);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return Promise.resolve();
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise((resolve, reject) => {
        const successful = document.execCommand('copy');
        textArea.remove();

        if (successful) {
          resolve();
        } else {
          reject(err);
        }
      });
    }
  }, []);

  return (
    <div
      className="rounded-xl font-mono my-6 overflow-hidden text-sm 
                 bg-neutral-50 border border-neutral-200 shadow-sm 
                 dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-black/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CodeBlockToolbar
        title={headerTitle}
        code={copyableCode}
        isHovered={isHovered}
        copiable={shouldShowHeaderCopy}
        langs={langs}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        isTerminal={isInputOutputBlock}
      />

      <CodeBlockBody
        displayCode={displayCode}
        displayLang={displayLang}
        isInputOutputBlock={isInputOutputBlock}
        highlightLines={highlightLines}
        inputLines={inputLines}
        copyToClipboard={copyToClipboard}
      />
    </div>
  );
};

export default CodeBlock;
