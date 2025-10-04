import React, { useState, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import './styles.css';

// --- COPY ICON (Next.js style) ---
const CopyIcon = () => (
    <svg 
        height="16" 
        strokeLinejoin="round" 
        viewBox="0 0 16 16" 
        width="16" 
        style={{ color: 'currentcolor' }}
    >
        <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z" 
            fill="currentColor"
        />
    </svg>
);

// --- COPIED ICON (Check mark) ---
const CopiedIcon = () => (
    <svg 
        height="16" 
        strokeLinejoin="round" 
        viewBox="0 0 16 16" 
        width="16" 
        style={{ color: 'currentcolor' }}
    >
        <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z" 
            fill="currentColor"
        />
    </svg>
);

// --- COPY BUTTON COMPONENT ---
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

// --- MAIN COMPONENT ---
const CodeBlock = ({ code = '', lang = 'text', filename }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Clean and normalize code
    const cleanedCode = useMemo(() => {
        if (typeof code !== 'string') return '';
        
        const normalized = code.replace(/\r\n/g, '\n');
        const lines = normalized.split('\n');
        
        // Remove leading empty line
        if (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
        }
        
        return lines.join('\n');
    }, [code]);

    const displayLang = lang === 'no' ? 'text' : lang;

    return (
        <div 
            className="rounded-xl font-mono my-6 overflow-hidden text-sm 
                       bg-neutral-50 border border-neutral-200 shadow-sm 
                       dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-black/30"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 min-h-[44px] 
                            bg-neutral-100 border-b border-neutral-200 
                            dark:bg-neutral-800 dark:border-neutral-700">
                <span className="text-[0.8125rem] font-medium tracking-tight 
                                 text-neutral-900 dark:text-neutral-100 font-sans">
                    {filename || displayLang}
                </span>
                <div 
                    className="transition-opacity duration-200"
                    style={{ opacity: isHovered ? 1 : 0 }}
                >
                    <CopyButton textToCopy={cleanedCode} />
                </div>
            </div>
            
            {/* Code Content */}
            <SyntaxHighlighter 
                language={displayLang} 
                customStyle={{ 
                    margin: 0, 
                    padding: '1rem 1.25rem', 
                    fontSize: '0.875rem', 
                    lineHeight: '1.7', 
                    fontWeight: 400 
                }} 
                wrapLines={true} 
                wrapLongLines={true}
            >
                {cleanedCode}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;

