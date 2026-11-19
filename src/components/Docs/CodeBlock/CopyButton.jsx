import React, { useState } from 'react';
import { translate } from '@docusaurus/Translate';
import { CopyIcon, CopiedIcon } from './Icons';

const CopyButton = ({ textToCopy }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center justify-center rounded-md border-0 p-1.5 cursor-pointer
                 transition-colors duration-150
                 text-slate-500 hover:text-slate-900 hover:bg-slate-200/80
                 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800
                 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
      aria-label={translate({
        id: 'theme.CodeBlock.copyButtonAriaLabel',
        message: 'Copy code to clipboard',
        description: 'The ARIA label for copy code blocks button',
      })}
      title={isCopied ? translate({
        id: 'theme.CodeBlock.copied',
        message: 'Copied',
        description: 'The copied button label on code blocks',
      }) : translate({
        id: 'theme.CodeBlock.copy',
        message: 'Copy',
        description: 'The copy button label on code blocks',
      })}
    >
      {isCopied ? (
        <span className="text-emerald-600 dark:text-emerald-400">
          <CopiedIcon />
        </span>
      ) : (
        <CopyIcon />
      )}
    </button>
  );
};

export default CopyButton;
