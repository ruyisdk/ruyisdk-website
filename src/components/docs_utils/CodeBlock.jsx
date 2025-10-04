import React, { useState, useEffect, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs as vscLightPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal } from 'lucide-react';
import './CodeBlock.css';

// --- CUSTOM SYNTAX THEMES (Next.js-inspired) ---
const customLightTheme = {
    ...vscLightPlus,
    'pre[class*="language-"]': {
        ...vscLightPlus['pre[class*="language-"]'],
        background: '#fafafa',
        fontSize: '0.875rem',
        lineHeight: '1.7',
    },
    'code[class*="language-"]': {
        ...vscLightPlus['code[class*="language-"]'],
        background: '#fafafa',
        fontSize: '0.875rem',
        lineHeight: '1.7',
        fontFamily: 'ui-monospace, "SF Mono", "Roboto Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
};

const customDarkTheme = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
        ...vscDarkPlus['pre[class*="language-"]'],
        background: '#111111',
        fontSize: '0.875rem',
        lineHeight: '1.7',
    },
    'code[class*="language-"]': {
        ...vscDarkPlus['code[class*="language-"]'],
        background: '#111111',
        fontSize: '0.875rem',
        lineHeight: '1.7',
        fontFamily: 'ui-monospace, "SF Mono", "Roboto Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
};

// --- HELPER COMPONENT: CopyButton ---
const CopyButton = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!textToCopy) return;
        // Using Clipboard API for modern browsers
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            try {
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                textArea.style.top = '-9999px';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (fallbackErr) {
                console.error('Fallback copy method failed: ', fallbackErr);
            }
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center justify-center p-2 rounded-md border-0 cursor-pointer transition-all duration-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2"
            aria-label="Copy code"
        >
            {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
    );
};


// --- MAIN COMPONENT: CodeBlock ---
const CodeBlock = ({ code = '', lang = 'no', filename, showTitleCopyButton = (lang !== 'bash') }) => {
    const [theme, setTheme] = useState('dark');

    // Effect to detect and observe Docusaurus theme changes
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const getTheme = () => document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(getTheme());

        const observer = new MutationObserver(() => setTheme(getTheme()));
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        return () => observer.disconnect();
    }, []);

    const syntaxTheme = theme === 'dark' ? customDarkTheme : customLightTheme;

    // --- NORMALIZE / CLEAN CODE PROP ---
    const cleanedCode = useMemo(() => {
        if (typeof code !== 'string') return '';
        // Normalize CRLF to LF then split
        const normalized = code.replace(/\r\n/g, '\n');
        const lines = normalized.split('\n');
        // If first line is empty (only a newline at start), drop it
        if (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
        }
        return lines.join('\n');
    }, [code]);

    // --- RENDER LOGIC FOR BASH SCRIPTS ---
    if (lang === 'bash') {
        const commandOnlyRegex = /^\s*(?:«[^»]+»\s*)?(\$)\s+/;

        // Function to extract only the commands for the main copy button
        const getCommandsToCopy = (rawCode) => {
            return rawCode
                .split('\n')
                .filter(line => commandOnlyRegex.test(line))
                .map(line => {
                    const match = line.match(commandOnlyRegex);
                    const promptSymbolIndex = line.indexOf(match[1]);
                    return line.substring(promptSymbolIndex + 1).trim();
                })
                .join('\n');
        };

        const LineRenderer = ({ line }) => {
            const [isHovered, setIsHovered] = useState(false);
            const match = line.match(commandOnlyRegex);
            const isCommand = !!match;

            let commandToCopy = '';
            if (isCommand) {
                const promptSymbolIndex = line.indexOf(match[1]);
                commandToCopy = line.substring(promptSymbolIndex + 1).trim();
            }

            const lineHighlighterStyle = {
                padding: 0,
                margin: 0,
                border: 'none',
                borderRadius: 0,
                background: 'transparent',
                overflow: 'visible',
                width: 'auto',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                lineHeight: '1.7',
                fontWeight: 400,
            };

            return (
                <div 
                    className={`flex items-center justify-between px-5 transition-colors duration-150 min-w-max w-full relative pr-8 ${
                        isHovered ? 'bg-black/[0.03] dark:bg-white/[0.05]' : 'bg-transparent'
                    }`}
                    onMouseEnter={() => setIsHovered(true)} 
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <SyntaxHighlighter language="bash" style={syntaxTheme} customStyle={lineHighlighterStyle}>{line}</SyntaxHighlighter>
                    {isCommand && (
                        <div className={`sticky right-4 flex items-center h-full transition-opacity duration-150 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                        }`}>
                            <CopyButton textToCopy={commandToCopy} />
                        </div>
                    )}
                </div>
            );
        };

        // Make the bash container scrollable and allow lines to stretch horizontally
        return (
            <div className="rounded-xl font-mono my-6 overflow-hidden text-sm bg-neutral-50 border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-black/30">
                <div className="flex items-center justify-between px-4 py-2.5 min-h-[44px] bg-neutral-100 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-neutral-600 dark:text-neutral-400" />
                        <span className="text-[0.8125rem] font-medium tracking-tight text-neutral-900 dark:text-neutral-100 font-sans">
                            {filename || 'Terminal'}
                        </span>
                    </div>
                    {showTitleCopyButton && (
                        <CopyButton textToCopy={getCommandsToCopy(cleanedCode)} />
                    )}
                </div>
                <div className="bg-white dark:bg-[#111111] overflow-x-auto py-3 w-full">
                    <div className="table w-max min-w-full">
                        {cleanedCode.split('\n').map((line, index) => <LineRenderer key={index} line={line} />)}
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER LOGIC FOR ALL OTHER CODE ---
    return (
        <div className="rounded-xl font-mono my-6 overflow-hidden text-sm bg-neutral-50 border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-black/30">
            <div className="flex items-center justify-between px-4 py-2.5 min-h-[44px] bg-neutral-100 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                <span className="text-[0.8125rem] font-medium tracking-tight text-neutral-900 dark:text-neutral-100 font-sans">
                    {filename || lang}
                </span>
                {showTitleCopyButton && (
                    <CopyButton textToCopy={cleanedCode} />
                )}
            </div>
            <SyntaxHighlighter 
                language={lang === 'no' ? 'text' : lang} 
                style={syntaxTheme} 
                customStyle={{ margin: 0, padding: '1rem 1.25rem', fontSize: '0.875rem', lineHeight: '1.7', fontWeight: 400 }} 
                wrapLines={true} 
                wrapLongLines={true}
            >
                {cleanedCode}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;