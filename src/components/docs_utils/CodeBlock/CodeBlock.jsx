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
 * @param {boolean} copiable - Whether to show copy button, defaults to false
 */
const CodeBlock = ({ 
    code = '', 
    lang = 'bash', 
    langs = [],
    filename = '',
    title = '',
    copiable = false 
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

    // 使用 DOM 操作应用高亮效果和行级复制按钮
    useEffect(() => {
        if (codeBlockRef.current) {
            const codeElement = codeBlockRef.current.querySelector('pre code');
            if (codeElement) {
                const lines = codeElement.querySelectorAll('.token-line, code > span');
                
                // 第一步：确定哪些行需要高亮
                const highlightedLines = new Set();
                lines.forEach((line, index) => {
                    const text = line.textContent || '';
                    const shouldHighlight = highlightLines.has(index) || 
                                          (headerTitle === 'Terminal' && text.trim().startsWith('$'));
                    if (shouldHighlight) {
                        highlightedLines.add(index);
                    }
                });
                
                // 第二步：应用样式，考虑连续高亮
                lines.forEach((line, index) => {
                    // 移除之前的高亮样式和复制按钮
                    line.style.backgroundColor = '';
                    line.style.display = '';
                    line.style.margin = '';
                    line.style.padding = '';
                    line.style.borderRadius = '';
                    line.style.position = '';
                    
                    // 移除之前的复制按钮
                    const existingBtn = line.querySelector('.line-copy-button');
                    if (existingBtn) {
                        existingBtn.remove();
                    }
                    
                    const shouldHighlight = highlightedLines.has(index);
                    
                    // 应用高亮样式
                    if (shouldHighlight) {
                        const prevHighlighted = highlightedLines.has(index - 1);
                        const nextHighlighted = highlightedLines.has(index + 1);
                        
                        line.style.backgroundColor = 'rgb(229, 229, 229)';
                        line.style.display = 'block';
                        line.style.position = 'relative';
                        
                        // 根据上下行是否高亮调整样式
                        let marginTop = '2px';
                        let marginBottom = '2px';
                        let paddingTop = '4px';
                        let paddingBottom = '4px';
                        let borderRadius = '';
                        
                        if (prevHighlighted && nextHighlighted) {
                            // 中间行：上下都有高亮
                            marginTop = '0';
                            marginBottom = '0';
                            borderRadius = '0';
                        } else if (prevHighlighted && !nextHighlighted) {
                            // 最后一行：只有上面有高亮
                            marginTop = '0';
                            marginBottom = '2px';
                            borderRadius = '0 0 6px 6px';
                        } else if (!prevHighlighted && nextHighlighted) {
                            // 第一行：只有下面有高亮
                            marginTop = '2px';
                            marginBottom = '0';
                            borderRadius = '6px 6px 0 0';
                        } else {
                            // 单独一行：上下都没有高亮
                            marginTop = '2px';
                            marginBottom = '2px';
                            borderRadius = '6px';
                        }
                        
                        line.style.margin = `${marginTop} -12px ${marginBottom} -12px`;
                        line.style.padding = `${paddingTop} 12px ${paddingBottom} 12px`;
                        line.style.borderRadius = borderRadius;
                        
                        // 创建行级复制按钮
                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'line-copy-button';
                        copyBtn.innerHTML = `
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"/>
                            </svg>
                        `;
                        copyBtn.style.cssText = `
                            position: absolute;
                            right: 12px;
                            top: 50%;
                            transform: translateY(-50%);
                            background: transparent;
                            border: none;
                            cursor: pointer;
                            padding: 4px;
                            border-radius: 4px;
                            color: rgb(107, 114, 128);
                            opacity: 0;
                            transition: opacity 0.2s, background-color 0.2s;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        `;
                        
                        // 鼠标悬停显示按钮
                        line.addEventListener('mouseenter', () => {
                            copyBtn.style.opacity = '1';
                        });
                        line.addEventListener('mouseleave', () => {
                            copyBtn.style.opacity = '0';
                        });
                        
                        // 复制功能
                        copyBtn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            let textToCopy = text;
                            // 去掉行开头的 $ 符号
                            if (textToCopy.trim().startsWith('$')) {
                                textToCopy = textToCopy.replace(/^\s*\$\s*/, '');
                            }
                            
                            try {
                                await navigator.clipboard.writeText(textToCopy);
                                // 显示复制成功
                                copyBtn.innerHTML = `
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"/>
                                    </svg>
                                `;
                                copyBtn.style.color = 'rgb(34, 197, 94)';
                                setTimeout(() => {
                                    copyBtn.innerHTML = `
                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"/>
                                        </svg>
                                    `;
                                    copyBtn.style.color = 'rgb(107, 114, 128)';
                                }, 1500);
                            } catch (err) {
                                console.error('Copy failed:', err);
                            }
                        });
                        
                        // 按钮悬停效果
                        copyBtn.addEventListener('mouseenter', () => {
                            copyBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                        });
                        copyBtn.addEventListener('mouseleave', () => {
                            copyBtn.style.backgroundColor = 'transparent';
                        });
                        
                        line.appendChild(copyBtn);
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

