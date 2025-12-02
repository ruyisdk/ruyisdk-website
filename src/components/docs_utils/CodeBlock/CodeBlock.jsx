import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Header from './Header';
import { normalizeCode, cleanShellPrompt } from './utils';

const CodeBlock = ({ 
    code = '', 
    lang = 'bash', 
    langs = [],
    filename = '',
    title = '',
    copiable = false,
    input = ''
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentLang, setCurrentLang] = useState(lang);

    const inputLines = useMemo(() => {
        if (!input) return new Set();
        
        const lines = new Set();
        const parts = input.split(',');
        
        parts.forEach(part => {
            part = part.trim();
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
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
    }, [input]);

    const currentCode = useMemo(() => {
        if (langs && langs.length > 0) {
            const langOption = langs.find(l => l.lang === currentLang);
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
                toHighlight.add(filteredLines.length + 1);
                return;
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

    const copyableCode = useMemo(() => 
        cleanShellPrompt(displayCode, currentLang),
    [displayCode, currentLang]);

    const displayLang = currentLang === 'no' ? 'text' : currentLang;

    const headerTitle = useMemo(() => {
        if (filename) return filename;
        if (title && title.trim() !== '') return title;
        if (currentLang === 'bash') return 'Terminal';
        if (currentLang === 'text' || currentLang === '') return 'text';
        return displayLang;
    }, [filename, title, currentLang, displayLang]);

    const codeBlockRef = useRef(null);
    
    // Use Docusaurus-style copy to clipboard logic
    const copyToClipboard = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return Promise.resolve();
        } catch (err) {
            // Fallback for older browsers
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

    useEffect(() => {
        if (!codeBlockRef.current) return;
        
        const preElement = codeBlockRef.current.querySelector('pre');
        if (!preElement) return;
        
        const timeoutId = setTimeout(() => {
            const codeElement = preElement.querySelector('code');
            if (!codeElement) return;
            
            const lines = Array.from(codeElement.children);
            
            if (lines.length === 0) {
                const textContent = codeElement.textContent || '';
                const textLines = textContent.split('\n');
                
                codeElement.innerHTML = '';
                textLines.forEach((lineText) => {
                    const span = document.createElement('span');
                    span.textContent = lineText;
                    span.style.display = 'block';
                    codeElement.appendChild(span);
                });
            }
            
            const allLines = Array.from(codeElement.children);
            
            const highlightedLines = new Set();
            allLines.forEach((line, index) => {
                const shouldHighlight = input ? inputLines.has(index) : highlightLines.has(index);
                
                if (shouldHighlight) {
                    highlightedLines.add(index);
                }
            });
            
            // Detect device type for padding calculation
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const rightPadding = isMobile ? 56 : 48;
            const leftPadding = isMobile ? 12 : 20;
            
            // First pass: reset styles to measure pure content width (no padding)
            allLines.forEach((line) => {
                line.style.width = 'auto';
                line.style.display = 'inline-block';
                line.style.padding = '0';
            });
            
            // Calculate max content width of ALL lines (pure code content)
            let maxContentWidth = 0;
            allLines.forEach((line) => {
                if (line) {
                    // Force layout recalculation
                    line.offsetHeight;
                    // Get pure content width
                    const rect = line.getBoundingClientRect();
                    const contentWidth = Math.max(line.scrollWidth, rect.width, line.offsetWidth);
                    if (contentWidth > maxContentWidth) {
                        maxContentWidth = contentWidth;
                    }
                }
            });
            
            // Calculate final width: max content width + button space
            const maxLineWidth = maxContentWidth + rightPadding + leftPadding;
            
            allLines.forEach((line, index) => {
                const shouldHighlight = highlightedLines.has(index);
                
                // Ensure all lines display as block to preserve line breaks
                line.style.display = 'block';
                
                if (!shouldHighlight && input) {
                    line.style.color = 'rgb(107, 114, 128)';
                    line.style.fontFamily = 'monospace';
                    line.querySelectorAll('*').forEach(child => {
                        child.style.color = 'inherit';
                    });
                } else if (shouldHighlight) {
                    // Reset styles for highlighted lines
                    line.style.color = '';
                    line.style.fontFamily = '';
                    line.querySelectorAll('*').forEach(child => {
                        child.style.color = '';
                    });
                }
                
                if (shouldHighlight) {
                    const prevHighlighted = highlightedLines.has(index - 1);
                    const nextHighlighted = highlightedLines.has(index + 1);
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    
                    line.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgb(235, 244, 255)';
                    line.style.position = 'relative';
                    
                    // Only add spacing before first and after last highlighted line
                    let marginTop = '0';
                    let marginBottom = '0';
                    
                    if (!prevHighlighted) {
                        marginTop = '2px'; // First highlighted line
                    }
                    if (!nextHighlighted) {
                        marginBottom = '2px'; // Last highlighted line
                    }
                    
                    // All highlighted lines use the same width (max width)
                    const rightPaddingPx = isMobile ? '56px' : '48px';
                    const leftPaddingPx = isMobile ? '12px' : '20px';
                    const horizontalMargin = isMobile ? '0' : '-20px';
                    
                    line.style.margin = `${marginTop} ${horizontalMargin} ${marginBottom} ${horizontalMargin}`;
                    line.style.padding = `4px ${rightPaddingPx} 4px ${leftPaddingPx}`;
                    line.style.boxSizing = 'border-box';
                    
                    // All highlighted lines use max width from entire code block
                    if (maxLineWidth > 0) {
                        // Width includes padding (border-box), so use maxLineWidth directly
                        line.style.width = `${maxLineWidth}px`;
                    } else {
                        line.style.width = 'fit-content';
                    }
                    line.style.minWidth = isMobile ? '100%' : 'calc(100% + 40px)';
                    
                    line.style.borderRadius = '0';
                    line.style.minHeight = isMobile ? '40px' : '32px';
                    line.style.lineHeight = '1.7';
                    
                    // Remove existing copy button if any
                    const existingBtn = line.querySelector('.line-copy-button');
                    if (existingBtn) {
                        existingBtn.remove();
                    }
                    
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'line-copy-button';
                    
                    // Larger icon for mobile
                    const iconSize = isMobile ? '18' : '16';
                    copyBtn.innerHTML = `
                        <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" fill="currentColor" style="display: block;">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"/>
                        </svg>
                    `;
                    
                    // Mobile-optimized styling
                    const btnSize = isMobile ? '36px' : '28px';
                    const btnRight = isMobile ? '8px' : '8px';
                    const btnPadding = isMobile ? '6px' : '4px';
                    
                    copyBtn.style.cssText = `
                        position: absolute;
                        right: ${btnRight};
                        top: 50%;
                        transform: translateY(-50%);
                        background: ${isDark ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
                        border: 1px solid ${isDark ? 'rgba(82, 82, 82, 0.8)' : 'rgba(203, 213, 225, 0.8)'};
                        outline: none;
                        cursor: pointer;
                        padding: ${btnPadding};
                        border-radius: ${isMobile ? '8px' : '6px'};
                        color: rgb(107, 114, 128);
                        opacity: ${isMobile ? '0.85' : '0'};
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10;
                        pointer-events: auto;
                        user-select: none;
                        -webkit-user-select: none;
                        -webkit-tap-highlight-color: transparent;
                        touch-action: manipulation;
                        width: ${btnSize};
                        height: ${btnSize};
                        min-width: ${btnSize};
                        min-height: ${btnSize};
                        flex-shrink: 0;
                        box-shadow: ${isDark ? '0 2px 6px rgba(0, 0, 0, 0.5)' : '0 2px 6px rgba(0, 0, 0, 0.2)'};
                    `;
                    
                    let isProcessing = false;
                    
                    const handleCopy = async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (isProcessing) return;
                        isProcessing = true;
                        
                        // Clone the line and remove the copy button to get clean text
                        const lineClone = line.cloneNode(true);
                        const btnInClone = lineClone.querySelector('.line-copy-button');
                        if (btnInClone) {
                            btnInClone.remove();
                        }
                        
                        let textToCopy = lineClone.textContent || '';
                        
                        // Remove PS1 prompt ($ and everything before it)
                        const dollarIndex = textToCopy.indexOf('$');
                        if (dollarIndex !== -1) {
                            textToCopy = textToCopy.substring(dollarIndex + 1);
                        }
                        
                        // Trim leading and trailing whitespace
                        textToCopy = textToCopy.trim();
                        
                        // Use Docusaurus copyToClipboard
                        copyToClipboard(textToCopy).then(() => {
                            // Show success icon
                            copyBtn.innerHTML = `
                                <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" fill="currentColor" style="display: block;">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"/>
                                </svg>
                            `;
                            copyBtn.style.color = 'rgb(34, 197, 94)';
                            
                            // Reset after 1.5s
                            setTimeout(() => {
                                copyBtn.innerHTML = `
                                    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" fill="currentColor" style="display: block;">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"/>
                                    </svg>
                                `;
                                copyBtn.style.color = 'rgb(107, 114, 128)';
                                isProcessing = false;
                            }, 1500);
                        }).catch((err) => {
                            console.error('Copy failed:', err);
                            isProcessing = false;
                        });
                    };
                    
                    const handleMouseEnter = () => {
                        if (!isMobile) {
                            copyBtn.style.opacity = '1';
                        }
                    };
                    
                    const handleMouseLeave = () => {
                        if (!isMobile) {
                            copyBtn.style.opacity = '0';
                        }
                    };
                    
                    const handleBtnMouseEnter = () => {
                        if (!isMobile) {
                            copyBtn.style.backgroundColor = isDark ? 'rgba(82, 82, 82, 0.9)' : 'rgba(229, 229, 229, 0.8)';
                            copyBtn.style.opacity = '1';
                            copyBtn.style.transform = 'translateY(-50%) scale(1.05)';
                        }
                    };
                    
                    const handleBtnMouseLeave = () => {
                        if (!isMobile) {
                            copyBtn.style.backgroundColor = isDark ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)';
                            copyBtn.style.transform = 'translateY(-50%) scale(1)';
                            copyBtn.style.opacity = '0';
                        }
                    };
                    
                    const handleTouchStart = (e) => {
                        if (isMobile) {
                            copyBtn.style.backgroundColor = isDark ? 'rgba(82, 82, 82, 1)' : 'rgba(200, 200, 200, 1)';
                            copyBtn.style.transform = 'translateY(-50%) scale(0.92)';
                            copyBtn.style.opacity = '1';
                        }
                    };
                    
                    const handleTouchEnd = (e) => {
                        if (isMobile) {
                            setTimeout(() => {
                                copyBtn.style.backgroundColor = isDark ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)';
                                copyBtn.style.transform = 'translateY(-50%) scale(1)';
                                copyBtn.style.opacity = '0.85';
                            }, 100);
                        }
                    };
                    
                    if (isMobile) {
                        // Mobile: touch events only
                        copyBtn.addEventListener('touchstart', handleTouchStart, { passive: true });
                        copyBtn.addEventListener('touchend', handleTouchEnd, { passive: true });
                        copyBtn.addEventListener('click', handleCopy);
                    } else {
                        // Desktop: mouse events
                        line.addEventListener('mouseenter', handleMouseEnter);
                        line.addEventListener('mouseleave', handleMouseLeave);
                        copyBtn.addEventListener('mouseenter', handleBtnMouseEnter);
                        copyBtn.addEventListener('mouseleave', handleBtnMouseLeave);
                        copyBtn.addEventListener('click', handleCopy);
                    }
                    
                    line.appendChild(copyBtn);
                } else {
                    // Remove copy button if line is not highlighted
                    const existingBtn = line.querySelector('.line-copy-button');
                    if (existingBtn) {
                        existingBtn.remove();
                    }
                }
            });
        }, 100);
        
        return () => {
            clearTimeout(timeoutId);
            // This won't clean up if timeout already fired, but that's okay
            // because the next render will clean up old buttons
        };
    }, [highlightLines, displayCode, headerTitle, input, inputLines]);

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
                    {displayCode}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeBlock;

