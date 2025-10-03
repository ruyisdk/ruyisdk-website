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
        background: '#ffffff',
        fontSize: '0.875rem',
        lineHeight: '1.7',
    },
    'code[class*="language-"]': {
        ...vscLightPlus['code[class*="language-"]'],
        background: '#ffffff',
        fontSize: '0.875rem',
        lineHeight: '1.7',
        fontFamily: 'ui-monospace, "SF Mono", "Roboto Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
};

const customDarkTheme = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
        ...vscDarkPlus['pre[class*="language-"]'],
        background: '#0a0a0a',
        fontSize: '0.875rem',
        lineHeight: '1.7',
    },
    'code[class*="language-"]': {
        ...vscDarkPlus['code[class*="language-"]'],
        background: '#0a0a0a',
        fontSize: '0.875rem',
        lineHeight: '1.7',
        fontFamily: 'ui-monospace, "SF Mono", "Roboto Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
};

// --- HELPER COMPONENT: CopyButton ---
const CopyButton = ({ textToCopy, themeStyles }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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

    const style = {
        ...themeStyles.copyButton,
        backgroundColor: isHovered ? themeStyles.copyButtonHoverBg : 'transparent',
        color: isHovered ? themeStyles.copyButtonHoverColor : themeStyles.copyButton.color,
    };

    return (
        <button
            onClick={handleCopy}
            style={style}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Copy code"
        >
            {isCopied ? <Check size={16} style={{ color: '#4ade80' }} /> : <Copy size={16} />}
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

    // --- DYNAMIC STYLES BASED ON THEME (Next.js-inspired) ---
    const lightThemeStyles = {
        container: { 
            backgroundColor: '#fafafa', 
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        },
        header: { 
            backgroundColor: '#f5f5f5', 
            borderBottom: '1px solid #e5e7eb'
        },
        filename: { 
            color: '#171717',
            fontWeight: 500,
            letterSpacing: '-0.01em'
        },
        icon: { color: '#737373' },
        copyButton: { 
            color: '#737373', 
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '0.5rem', 
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        copyButtonHoverBg: '#e5e5e5',
        copyButtonHoverColor: '#171717',
        bashLineHoverBg: 'rgba(0, 0, 0, 0.03)',
        syntaxTheme: customLightTheme,
        codeBackground: '#ffffff'
    };

    const darkThemeStyles = {
        container: { 
            backgroundColor: '#161616', 
            border: '1px solid #262626',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)'
        },
        header: { 
            backgroundColor: '#1a1a1a', 
            borderBottom: '1px solid #262626'
        },
        filename: { 
            color: '#ededed',
            fontWeight: 500,
            letterSpacing: '-0.01em'
        },
        icon: { color: '#a3a3a3' },
        copyButton: { 
            color: '#a3a3a3', 
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '0.5rem', 
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        copyButtonHoverBg: '#262626',
        copyButtonHoverColor: '#ffffff',
        bashLineHoverBg: 'rgba(255, 255, 255, 0.05)',
        syntaxTheme: customDarkTheme,
        codeBackground: '#0a0a0a'
    };

    const currentStyles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;
    const syntaxTheme = currentStyles.syntaxTheme;

    const baseStyles = {
        container: { 
            borderRadius: '0.75rem', 
            fontFamily: 'ui-monospace, "SF Mono", "Roboto Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', 
            margin: '1.5rem 0', 
            overflow: 'hidden',
            fontSize: '14px'
        },
        header: { 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0.625rem 1rem',
            minHeight: '44px'
        },
        headerTextContainer: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
        },
        filename: { 
            fontSize: '0.8125rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif'
        },
        syntaxHighlighter: { 
            margin: 0, 
            padding: '1rem 1.25rem', 
            fontSize: '0.875rem', 
            lineHeight: '1.7',
            fontWeight: 400
        },
        bashLine: { 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0 1.25rem',
            transition: 'background-color 150ms ease'
        },
    };

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

            // Make line container stretch to content width for horizontal scroll
            const lineStyle = {
                ...baseStyles.bashLine,
                backgroundColor: isHovered ? currentStyles.bashLineHoverBg : 'transparent',
                minWidth: 'max-content',
                width: '100%',
                position: 'relative',
                paddingRight: '2rem',
            };
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
                <div style={lineStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <SyntaxHighlighter language="bash" style={syntaxTheme} customStyle={lineHighlighterStyle}>{line}</SyntaxHighlighter>
                    {isCommand && (
                        // UPDATE: Elegant copy button style.
                        // It is now invisible by default and fades in on hover without a background.
                        <div style={{
                            position: 'sticky',
                            right: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 150ms ease-in-out',
                        }}>
                            <CopyButton textToCopy={commandToCopy} themeStyles={currentStyles} />
                        </div>
                    )}
                </div>
            );
        };

        const bashContainerBg = currentStyles.codeBackground;

        // Make the bash container scrollable and allow lines to stretch horizontally
        return (
            <div style={{ ...baseStyles.container, ...currentStyles.container }}>
                <div style={{ ...baseStyles.header, ...currentStyles.header }}>
                    <div style={baseStyles.headerTextContainer}>
                        <Terminal size={16} style={currentStyles.icon} />
                        <span style={{ ...baseStyles.filename, ...currentStyles.filename }}>{filename || 'Terminal'}</span>
                    </div>
                    {/* UPDATE: This button is now hidden by default for bash blocks */}
                    {showTitleCopyButton && (
                        <CopyButton textToCopy={getCommandsToCopy(cleanedCode)} themeStyles={currentStyles} />
                    )}
                </div>
                    <div style={{ 
                        backgroundColor: bashContainerBg, 
                        overflowX: 'auto', 
                        padding: '0.75rem 0', 
                        width: '100%' 
                    }}>
                    <div style={{ display: 'table', width: 'max-content', minWidth: '100%' }}>
                        {cleanedCode.split('\n').map((line, index) => <LineRenderer key={index} line={line} />)}
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER LOGIC FOR ALL OTHER CODE ---
    return (
        <div style={{ ...baseStyles.container, ...currentStyles.container }}>
            <div style={{ ...baseStyles.header, ...currentStyles.header }}>
                <span style={{ ...baseStyles.filename, ...currentStyles.filename }}>{filename || lang}</span>
                        {showTitleCopyButton && (
                    <CopyButton textToCopy={cleanedCode} themeStyles={currentStyles} />
                )}
            </div>
                <SyntaxHighlighter language={lang === 'no' ? 'text' : lang} style={syntaxTheme} customStyle={baseStyles.syntaxHighlighter} wrapLines={true} wrapLongLines={true}>
                {cleanedCode}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;