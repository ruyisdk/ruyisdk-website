import React, { useState } from 'react';
import { CopyIcon, CopiedIcon } from './Icons';

/**
 * CopyButton - 复制按钮组件
 * @param {string} textToCopy - 要复制的文本内容
 */
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
            onClick={handleCopy}
            className="flex items-center justify-center p-2 rounded-md border-0 cursor-pointer 
                       transition-all duration-200 
                       text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 
                       dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-700 
                       focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
            aria-label="Copy code"
            title={isCopied ? "Copied!" : "Copy code"}
        >
            {isCopied ? (
                <span className="text-green-500 dark:text-green-400">
                    <CopiedIcon />
                </span>
            ) : (
                <CopyIcon />
            )}
        </button>
    );
};

export default CopyButton;

