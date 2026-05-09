import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Header from './Header';
import { normalizeCode, cleanShellPrompt, stripShellPrompt } from './utils';

const CodeBlock = ({ 
    code = '', 
    lang = 'bash', 
    langs = [],
    title = '',
    copiable,
    input = '',
    hasInput = false,
    showTitleCopyButton
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentLang, setCurrentLang] = useState(lang);

    const inputLines = useMemo(() => {
        const lines = new Set();
        if (!hasInput || !input) return lines;

        const normalizedInput = String(input).replace(/^['"]|['"]$/g, '');
        const parts = normalizedInput.split(',');
        
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
    }, [input, hasInput]);

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
                toHighlight.add(filteredLines.length);
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

    const displayLang = currentLang === 'no' ? 'text' : currentLang;
    const isInputOutputBlock = hasInput;

    const copyableCode = useMemo(() => 
        isInputOutputBlock ? cleanShellPrompt(displayCode) : displayCode,
    [displayCode, isInputOutputBlock]);

    const shouldShowHeaderCopy = useMemo(() => {
        if (typeof showTitleCopyButton === 'boolean') return showTitleCopyButton;
        if (typeof showTitleCopyButton === 'string') return showTitleCopyButton === 'true';
        if (typeof copiable === 'boolean') return copiable;
        if (typeof copiable === 'string') return copiable === 'true';
        return !isInputOutputBlock;
    }, [showTitleCopyButton, copiable, isInputOutputBlock]);

    const headerTitle = useMemo(() => {
        if (title && title.trim() !== '') return title;
        if (isInputOutputBlock) return displayLang;
        if (currentLang === 'text' || currentLang === '') return 'text';
        return displayLang;
    }, [title, currentLang, displayLang, isInputOutputBlock]);

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
        const scrollElement = preElement.parentElement || preElement;

        const cleanupFns = [];
        const positionUpdaters = new Set();
        let animationFrame = null;

        const updateAllCopyButtonPositions = () => {
            positionUpdaters.forEach((update) => update());
        };

        const schedulePositionUpdate = () => {
            if (animationFrame !== null) return;

            animationFrame = requestAnimationFrame(() => {
                animationFrame = null;
                updateAllCopyButtonPositions();
            });
        };

        scrollElement.addEventListener('scroll', schedulePositionUpdate, { passive: true });
        window.addEventListener('scroll', schedulePositionUpdate, { passive: true });
        window.addEventListener('resize', schedulePositionUpdate);
        cleanupFns.push(() => scrollElement.removeEventListener('scroll', schedulePositionUpdate));
        cleanupFns.push(() => window.removeEventListener('scroll', schedulePositionUpdate));
        cleanupFns.push(() => window.removeEventListener('resize', schedulePositionUpdate));
        cleanupFns.push(() => {
            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
            }
        });
        
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
                const shouldHighlight = isInputOutputBlock ? inputLines.has(index) : highlightLines.has(index);
                
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
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const rightPaddingPx = isMobile ? '56px' : '48px';
                const leftPaddingPx = isMobile ? '12px' : '20px';
                const horizontalMargin = isMobile ? '0' : '-20px';
                
                // Ensure all lines display as block to preserve line breaks
                line.style.display = 'block';
                line.style.textShadow = 'none';
                line.querySelectorAll('*').forEach((child) => {
                    child.style.textShadow = 'none';
                });
                
                if (isInputOutputBlock && !shouldHighlight) {
                    line.style.backgroundColor = isDark ? 'rgb(23, 23, 23)' : 'rgb(255, 255, 255)';
                    line.style.position = '';
                    line.style.margin = `0 ${horizontalMargin}`;
                    line.style.padding = `0 ${rightPaddingPx} 0 ${leftPaddingPx}`;
                    line.style.boxSizing = 'border-box';
                    line.style.width = maxLineWidth > 0 ? `${maxLineWidth}px` : 'fit-content';
                    line.style.minWidth = isMobile ? '100%' : 'calc(100% + 40px)';
                    line.style.borderRadius = '';
                    line.style.minHeight = '';
                    line.style.lineHeight = 'var(--ifm-pre-line-height)';
                    line.style.color = '';
                    line.style.fontFamily = '';
                    line.querySelectorAll('*').forEach((child) => {
                        child.style.color = 'inherit';
                        child.style.fontWeight = 'inherit';
                        child.style.fontStyle = 'inherit';
                        child.style.textShadow = 'none';
                    });
                } else if (shouldHighlight) {
                    line.style.color = '';
                    line.style.fontFamily = '';
                }
                
                if (shouldHighlight) {
                    const prevHighlighted = highlightedLines.has(index - 1);
                    const nextHighlighted = highlightedLines.has(index + 1);
                    
                    line.style.backgroundColor = isDark ? 'rgba(180, 83, 9, 0.14)' : 'rgb(255, 251, 235)';
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
                    line.style.margin = `${marginTop} ${horizontalMargin} ${marginBottom} ${horizontalMargin}`;
                    line.style.padding = `0 ${rightPaddingPx} 0 ${leftPaddingPx}`;
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
                    line.style.minHeight = '';
                    line.style.lineHeight = 'var(--ifm-pre-line-height)';
                    
                    // Remove existing copy button if any
                    const existingBtn = line.querySelector('.line-copy-button');
                    if (existingBtn) {
                        existingBtn.remove();
                    }
                    
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'line-copy-button';
                    
                    // Larger icon for mobile
                    const iconSize = isMobile ? '12' : '14';
                    copyBtn.innerHTML = `
                        <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" fill="currentColor" style="display: block;">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"/>
                        </svg>
                    `;
                    
                    // Mobile-optimized styling
                    const btnSize = isMobile ? 20 : 22;
                    const btnRight = isMobile ? 8 : 8;
                    const btnPadding = isMobile ? '2px' : '3px';
                    
                    copyBtn.style.cssText = `
                        position: fixed;
                        transform: translateY(-50%);
                        background: ${isDark ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
                        border: 1px solid ${isDark ? 'rgba(82, 82, 82, 0.8)' : 'rgba(203, 213, 225, 0.8)'};
                        outline: none;
                        cursor: pointer;
                        padding: ${btnPadding};
                        border-radius: ${isMobile ? '8px' : '6px'};
                        color: rgb(107, 114, 128);
                        opacity: ${isMobile ? '0.85' : '0'};
                        transition: opacity 0.2s ease, background-color 0.2s ease, transform 0.2s ease, color 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        line-height: 0;
                        z-index: 10;
                        pointer-events: auto;
                        user-select: none;
                        -webkit-user-select: none;
                        -webkit-tap-highlight-color: transparent;
                        touch-action: manipulation;
                        width: ${btnSize}px;
                        height: ${btnSize}px;
                        min-width: ${btnSize}px;
                        min-height: ${btnSize}px;
                        flex-shrink: 0;
                        box-shadow: ${isDark ? '0 2px 6px rgba(0, 0, 0, 0.5)' : '0 2px 6px rgba(0, 0, 0, 0.2)'};
                    `;

                    const updateCopyButtonPosition = () => {
                        const scrollRect = scrollElement.getBoundingClientRect();
                        const lineRect = line.getBoundingClientRect();

                        copyBtn.style.left = `${scrollRect.right - btnSize - btnRight}px`;
                        copyBtn.style.top = `${lineRect.top + lineRect.height / 2}px`;
                    };

                    updateCopyButtonPosition();
                    requestAnimationFrame(() => {
                        updateCopyButtonPosition();
                        requestAnimationFrame(updateCopyButtonPosition);
                    });
                    positionUpdaters.add(updateCopyButtonPosition);

                    const existingUnderline = line.querySelector('.line-command-underline');
                    if (existingUnderline) {
                        existingUnderline.remove();
                    }

                    const rawLineText = line.textContent || '';
                    const commandText = stripShellPrompt(rawLineText);
                    const commandStart = commandText ? rawLineText.indexOf(commandText) : -1;
                    const commandUnderline = document.createElement('span');
                    commandUnderline.className = 'line-command-underline';
                    commandUnderline.style.cssText = `
                        position: absolute;
                        left: calc(${leftPaddingPx} + ${Math.max(commandStart, 0)}ch);
                        bottom: 1px;
                        width: ${commandText.length}ch;
                        border-bottom: 1px solid ${isDark ? 'rgb(115, 115, 115)' : 'rgb(156, 163, 175)'};
                        opacity: ${isMobile ? '1' : '0'};
                        pointer-events: none;
                    `;
                    line.appendChild(commandUnderline);
                    
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
                        
                        const textToCopy = isInputOutputBlock
                            ? stripShellPrompt(lineClone.textContent || '')
                            : (lineClone.textContent || '').trim();
                        
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
                            updateCopyButtonPosition();
                            copyBtn.style.opacity = '1';
                            commandUnderline.style.opacity = '1';
                        }
                    };
                    
                    const handleMouseLeave = () => {
                        if (!isMobile) {
                            copyBtn.style.opacity = '0';
                            commandUnderline.style.opacity = '0';
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
                            updateCopyButtonPosition();
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
            cleanupFns.forEach((cleanup) => cleanup());
        };
    }, [highlightLines, displayCode, inputLines, isInputOutputBlock]);

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
                copiable={shouldShowHeaderCopy}
                langs={langs}
                currentLang={currentLang}
                onLangChange={setCurrentLang}
                isTerminal={isInputOutputBlock}
            />
            
            <div
                className={`${isInputOutputBlock ? 'bg-[#fffbeb] dark:bg-[rgba(180,83,9,0.14)]' : 'bg-white dark:bg-neutral-900'} overflow-x-auto`}
            >
                <SyntaxHighlighter 
                    language={displayLang} 
                    customStyle={{ 
                        margin: 0, 
                        padding: '20px', 
                        fontSize: '0.875rem', 
                        lineHeight: 'var(--ifm-pre-line-height)', 
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
