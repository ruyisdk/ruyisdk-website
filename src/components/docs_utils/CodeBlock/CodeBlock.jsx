import React, { useState, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Header from './Header';
import { normalizeCode, cleanShellPrompt } from './utils';
import './styles.css';

/**
 * CodeBlock - Core code block component
 * @param {string} code - Code content
 * @param {string} lang - Language type, defaults to 'bash'
 * @param {Array<{lang: string, code: string}>} langs - Multi-language options, defaults to []
 * @param {string} filename - Optional filename, displays in Header if provided
 * @param {string} title - Header title, defaults to 'Terminal'
 * @param {boolean} copiable - Whether to show copy button, defaults to true
 */
const CodeBlock = ({ 
    code = '', 
    lang = 'bash', 
    langs = [],
    filename = '',
    title = 'Terminal',
    copiable = true 
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentLang, setCurrentLang] = useState(lang);

    const currentCode = useMemo(() => {
        if (langs && langs.length > 0) {
            const langOption = langs.find(l => l.lang === currentLang);
            return langOption ? langOption.code : code;
        }
        return code;
    }, [langs, currentLang, code]);

    const cleanedCode = useMemo(() => {
        return normalizeCode(currentCode);
    }, [currentCode]);

    const copyableCode = useMemo(() => {
        const normalized = normalizeCode(currentCode);
        return cleanShellPrompt(normalized, currentLang);
    }, [currentCode, currentLang]);

    const displayLang = currentLang === 'no' ? 'text' : currentLang;

    const headerTitle = useMemo(() => {
        if (filename) return filename;
        if (title && title !== 'Terminal') return title;
        if (currentLang === 'bash') return 'Terminal';
        return displayLang;
    }, [filename, title, currentLang, displayLang]);

    return (
        <div 
            className="rounded-xl font-mono my-6 overflow-hidden text-sm 
                       bg-neutral-50 border border-neutral-200 shadow-sm 
                       dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-black/30"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Header 
                title={headerTitle}
                code={copyableCode}
                isHovered={isHovered}
                copiable={copiable}
                langs={langs}
                currentLang={currentLang}
                onLangChange={setCurrentLang}
            />
            
            <SyntaxHighlighter 
                language={displayLang} 
                customStyle={{ 
                    margin: 0, 
                    padding: '20px 0px 20px 20px', 
                    fontSize: '0.875rem', 
                    lineHeight: '1.7', 
                    fontWeight: 400,
                    backgroundColor: '#FFFFFF'
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

