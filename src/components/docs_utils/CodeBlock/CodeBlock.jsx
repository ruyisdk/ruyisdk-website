import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Header from './Header';
import { normalizeCode, cleanShellPrompt } from './utils';

/**
 * CodeBlock - Core code block component
 * @param {string} code - Code content
 * @param {string} lang - Language type, defaults to 'bash'
 * @param {Array<{lang: string, code: string}>} langs - Multi-language options, defaults to []
 * @param {string} filename - Optional filename, displays in Header if provided
 * @param {string} title - Header title, defaults to empty string
 * @param {boolean} copiable - Whether to show copy button, defaults to true
 */
const CodeBlock = ({ 
    code = '', 
    lang = 'bash', 
    langs = [],
    filename = '',
    title = '',
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

    // Parse highlight markers and get line numbers to highlight
    const { displayCode, highlightLines } = useMemo(() => {
        const lines = currentCode.split('\n');
        const toHighlight = new Set();
        let isHighlighting = false;
        const filteredLines = [];

        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.includes('highlight-start')) {
                isHighlighting = true;
                return; // Don't include this line in output
            }
            
            if (trimmedLine.includes('highlight-end')) {
                isHighlighting = false;
                return; // Don't include this line in output
            }
            
            if (trimmedLine.includes('highlight-next-line')) {
                // Mark next line for highlighting
                toHighlight.add(filteredLines.length + 1);
                return; // Don't include this line in output
            }
            
            filteredLines.push(line);
            
            if (isHighlighting) {
                toHighlight.add(filteredLines.length - 1);
            }
        });

        return {
            displayCode: normalizeCode(filteredLines.join('\n')),
            highlightLines: toHighlight
        };
    }, [currentCode]);

    const cleanedCode = displayCode;

    const copyableCode = useMemo(() => {
        return cleanShellPrompt(displayCode, currentLang);
    }, [displayCode, currentLang]);

    const displayLang = currentLang === 'no' ? 'text' : currentLang;

    const headerTitle = useMemo(() => {
        // Priority 1: filename has highest priority
        if (filename) return filename;
        
        // Priority 2: explicit title has second highest priority
        if (title && title.trim() !== '') return title;
        
        // Priority 3: if language is bash and no title specified, use "Terminal"
        if (currentLang === 'bash') return 'Terminal';
        
        // Priority 4: if no language specified and no title, use "text"
        if (currentLang === 'text' || currentLang === '') return 'text';
        
        // Priority 5: fallback to display language
        return displayLang;
    }, [filename, title, currentLang, displayLang]);

    const codeBlockRef = useRef(null);

    // 使用 DOM 操作应用高亮效果
    useEffect(() => {
        if (codeBlockRef.current) {
            const codeElement = codeBlockRef.current.querySelector('pre code');
            if (codeElement) {
                const lines = codeElement.querySelectorAll('.token-line, code > span');
                
                lines.forEach((line, index) => {
                    // 移除之前的高亮样式
                    line.style.backgroundColor = '';
                    line.style.display = '';
                    line.style.margin = '';
                    line.style.padding = '';
                    line.style.borderRadius = '';
                    
                    // 应用 highlight-start/end 标记的高亮
                    if (highlightLines.has(index)) {
                        line.style.backgroundColor = 'rgb(229, 229, 229)';
                        line.style.display = 'block';
                        line.style.margin = '2px -12px';
                        line.style.padding = '4px 12px';
                        line.style.borderRadius = '6px';
                    }
                    
                    // 如果是 Terminal 标题，高亮以 $ 开头的行
                    if (headerTitle === 'Terminal') {
                        const text = line.textContent || '';
                        if (text.trim().startsWith('$')) {
                            line.style.backgroundColor = 'rgb(229, 229, 229)';
                            line.style.display = 'block';
                            line.style.margin = '2px -12px';
                            line.style.padding = '4px 12px';
                            line.style.borderRadius = '6px';
                        }
                    }
                });
            }
        }
    }, [highlightLines, cleanedCode, headerTitle]);

    return (
        <div 
            ref={codeBlockRef}
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
            
            <div className="bg-white dark:bg-neutral-900 overflow-x-auto">
                <SyntaxHighlighter 
                    language={displayLang} 
                    customStyle={{ 
                        margin: 0, 
                        padding: '20px', 
                        fontSize: '0.875rem', 
                        lineHeight: '1.7', 
                        fontWeight: 400,
                        backgroundColor: 'transparent'
                    }} 
                    wrapLines={true} 
                    wrapLongLines={false}
                >
                    {cleanedCode}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeBlock;

