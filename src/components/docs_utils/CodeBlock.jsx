import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs as vscLightPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal } from 'lucide-react';

// --- HELPER COMPONENT: CopyButton ---
const CopyButton = ({ textToCopy, themeStyles }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleCopy = () => {
        if (!textToCopy) return;
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
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
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
// With updated bash copy logic.
const CodeBlock = ({ code = '', lang = 'no', filename, showTitleCopyButton = true }) => {
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

    // --- DYNAMIC STYLES BASED ON THEME ---
    const lightThemeStyles = {
        container: { backgroundColor: '#ffffff', border: '1px solid #e5e7eb' },
        header: { backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' },
        filename: { color: '#1f2937' },
        icon: { color: '#4b5563' },
        copyButton: { color: '#4b5563', transition: 'background-color 150ms ease-in-out', border: 'none', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem' },
        copyButtonHoverBg: '#e5e7eb',
        copyButtonHoverColor: '#1f2937',
        bashLineHoverBg: 'rgba(229, 231, 235, 0.6)',
        syntaxTheme: vscLightPlus,
    };

    const darkThemeStyles = {
        container: { backgroundColor: '#1e1e1e', border: '1px solid #333333' },
        header: { backgroundColor: '#252526', borderBottom: '1px solid #333333' },
        filename: { color: '#cccccc' },
        icon: { color: '#cccccc' },
        copyButton: { color: '#cccccc', transition: 'background-color 150ms ease-in-out', border: 'none', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.375rem' },
        copyButtonHoverBg: '#3c3c3c',
        copyButtonHoverColor: '#ffffff',
        bashLineHoverBg: 'rgba(55, 65, 81, 0.4)',
        syntaxTheme: vscDarkPlus,
    };

    const currentStyles = theme === 'dark' ? darkThemeStyles : lightThemeStyles;
    const syntaxTheme = currentStyles.syntaxTheme;

    const baseStyles = {
        container: { borderRadius: '0.5rem', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', margin: '1.5rem 0', overflow: 'hidden' },
        header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem' },
        headerTextContainer: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
        filename: { fontSize: '0.875rem' },
        syntaxHighlighter: { margin: 0, padding: '1rem', fontSize: '0.9rem', lineHeight: '1.6' },
        bashLine: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' },
    };

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
                fontSize: '0.9rem',
                lineHeight: '1.6',
            };

            return (
                <div style={lineStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <SyntaxHighlighter language="bash" style={syntaxTheme} customStyle={lineHighlighterStyle}>{line}</SyntaxHighlighter>
                    {isCommand && (
                        <div style={{
                            position: 'sticky',
                            right: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            opacity: isHovered ? 1 : 0.7,
                            transition: 'opacity 150ms ease-in-out',
                            background: 'rgba(30,30,30,0.18)', // semi-transparent for readability
                            borderRadius: '0.375rem',
                            padding: '0.1rem 0.2rem',
                        }}>
                            <CopyButton textToCopy={commandToCopy} themeStyles={currentStyles} />
                        </div>
                    )}
                </div>
            );
        };

        const bashContainerBg = (syntaxTheme['pre[class*="language-"]'] && syntaxTheme['pre[class*="language-"]'].background) || currentStyles.container.backgroundColor;

        // Make the bash container scrollable and allow lines to stretch horizontally
        return (
            <div style={{ ...baseStyles.container, ...currentStyles.container }}>
                <div style={{ ...baseStyles.header, ...currentStyles.header }}>
                    <div style={baseStyles.headerTextContainer}>
                        <Terminal size={16} style={currentStyles.icon} />
                        <span style={{ ...baseStyles.filename, ...currentStyles.filename }}>{filename || 'bash'}</span>
                    </div>
                    {showTitleCopyButton && (
                        <CopyButton textToCopy={getCommandsToCopy(code)} themeStyles={currentStyles} />
                    )}
                </div>
                <div style={{ backgroundColor: bashContainerBg, overflowX: 'auto', padding: '1rem 0', width: '100%' }}>
                    <div style={{ display: 'table', width: 'max-content', minWidth: '100%' }}>
                        {code.split('\n').map((line, index) => <LineRenderer key={index} line={line} />)}
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
                    <CopyButton textToCopy={code} themeStyles={currentStyles} />
                )}
            </div>
            <SyntaxHighlighter language={lang === 'no' ? 'text' : lang} style={syntaxTheme} customStyle={baseStyles.syntaxHighlighter} wrapLines={true} wrapLongLines={true}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;