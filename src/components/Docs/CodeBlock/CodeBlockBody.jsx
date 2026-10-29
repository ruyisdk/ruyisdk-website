import React, { useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { stripShellPrompt } from './utils';

export default function CodeBlockBody({
  displayCode,
  displayLang,
  isInputOutputBlock,
  highlightLines,
  inputLines,
  copyToClipboard,
}) {
  const containerRef = useRef(null);
  const copyButtonsRef = useRef(new Map());

  useEffect(() => {
    if (!containerRef.current) return;

    const preElement = containerRef.current.querySelector('pre');
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

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const rightPadding = isMobile ? 56 : 48;
      const leftPadding = isMobile ? 12 : 20;

      allLines.forEach((line) => {
        line.style.width = 'auto';
        line.style.minWidth = '';
        line.style.display = 'inline-block';
        line.style.margin = '0';
        line.style.padding = '0';
        line.style.boxSizing = '';
      });

      let maxContentWidth = 0;
      allLines.forEach((line) => {
        if (line) {
          void line.offsetHeight;
          const rect = line.getBoundingClientRect();
          const contentWidth = Math.max(line.scrollWidth, rect.width, line.offsetWidth);
          if (contentWidth > maxContentWidth) {
            maxContentWidth = contentWidth;
          }
        }
      });

      const maxLineWidth = maxContentWidth + rightPadding + leftPadding;

      allLines.forEach((line, index) => {
        const shouldHighlight = highlightedLines.has(index);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const rightPaddingPx = isMobile ? '56px' : '48px';
        const leftPaddingPx = isMobile ? '12px' : '20px';
        const horizontalMargin = isMobile ? '0' : '-20px';
        const removeExistingCopyButton = () => {
          const existingBtn = line.querySelector('.line-copy-button') || copyButtonsRef.current.get(index);

          if (existingBtn) {
            existingBtn.remove();
          }

          copyButtonsRef.current.delete(index);
        };

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

          line.style.backgroundColor = isDark ? 'rgba(180, 83, 9, 0.14)' : 'rgb(255, 255, 255)';
          line.style.position = 'relative';

          let marginTop = '0';
          let marginBottom = '0';

          if (!prevHighlighted) {
            marginTop = '2px';
          }
          if (!nextHighlighted) {
            marginBottom = '2px';
          }

          line.style.margin = `${marginTop} ${horizontalMargin} ${marginBottom} ${horizontalMargin}`;
          line.style.padding = `0 ${rightPaddingPx} 0 ${leftPaddingPx}`;
          line.style.boxSizing = 'border-box';

          if (maxLineWidth > 0) {
            line.style.width = `${maxLineWidth}px`;
          } else {
            line.style.width = 'fit-content';
          }
          line.style.minWidth = isMobile ? '100%' : 'calc(100% + 40px)';

          line.style.borderRadius = '0';
          line.style.minHeight = '';
          line.style.lineHeight = 'var(--ifm-pre-line-height)';

          removeExistingCopyButton();

          const copyBtn = document.createElement('button');
          copyBtn.className = 'line-copy-button';
          copyButtonsRef.current.set(index, copyBtn);

          const iconSize = isMobile ? '12' : '14';
          copyBtn.innerHTML = `
            <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" fill="currentColor" style="display: block;">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z"/>
            </svg>
          `;

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

            const lineClone = line.cloneNode(true);
            const btnInClone = lineClone.querySelector('.line-copy-button');
            if (btnInClone) {
              btnInClone.remove();
            }

            const textToCopy = isInputOutputBlock
              ? stripShellPrompt(lineClone.textContent || '')
              : (lineClone.textContent || '').trim();

            copyToClipboard(textToCopy).then(() => {
              copyBtn.innerHTML = `
                <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 16 16" fill="currentColor" style="display: block;">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5607 3.99999L15.0303 4.53032L6.23744 13.3232C5.55403 14.0066 4.44599 14.0066 3.76257 13.3232L4.2929 12.7929L3.76257 13.3232L0.969676 10.5303L0.439346 9.99999L1.50001 8.93933L2.03034 9.46966L4.82323 12.2626C4.92086 12.3602 5.07915 12.3602 5.17678 12.2626L13.9697 3.46966L14.5 2.93933L15.5607 3.99999Z"/>
                </svg>
              `;
              copyBtn.style.color = 'rgb(34, 197, 94)';

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

          const handleTouchStart = () => {
            if (isMobile) {
              updateCopyButtonPosition();
              copyBtn.style.backgroundColor = isDark ? 'rgba(82, 82, 82, 1)' : 'rgba(200, 200, 200, 1)';
              copyBtn.style.transform = 'translateY(-50%) scale(0.92)';
              copyBtn.style.opacity = '1';
            }
          };

          const handleTouchEnd = () => {
            if (isMobile) {
              setTimeout(() => {
                copyBtn.style.backgroundColor = isDark ? 'rgba(38, 38, 38, 0.95)' : 'rgba(255, 255, 255, 0.95)';
                copyBtn.style.transform = 'translateY(-50%) scale(1)';
                copyBtn.style.opacity = '0.85';
              }, 100);
            }
          };

          if (isMobile) {
            copyBtn.addEventListener('touchstart', handleTouchStart, { passive: true });
            copyBtn.addEventListener('touchend', handleTouchEnd, { passive: true });
            copyBtn.addEventListener('click', handleCopy);
          } else {
            line.addEventListener('mouseenter', handleMouseEnter);
            line.addEventListener('mouseleave', handleMouseLeave);
            copyBtn.addEventListener('mouseenter', handleBtnMouseEnter);
            copyBtn.addEventListener('mouseleave', handleBtnMouseLeave);
            copyBtn.addEventListener('click', handleCopy);
          }

          document.body.appendChild(copyBtn);
          cleanupFns.push(() => {
            try {
              copyBtn.remove();
              if (copyButtonsRef.current.get(index) === copyBtn) {
                copyButtonsRef.current.delete(index);
              }
            } catch {}
          });
        } else {
          removeExistingCopyButton();
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, [highlightLines, displayCode, inputLines, isInputOutputBlock, copyToClipboard]);

  return (
    <div
      ref={containerRef}
      className={`${isInputOutputBlock ? 'bg-white dark:bg-[rgba(180,83,9,0.14)]' : 'bg-white dark:bg-neutral-900'} overflow-x-auto`}
    >
      <SyntaxHighlighter
        language={displayLang}
        customStyle={{
          margin: 0,
          padding: '20px',
          fontSize: '0.875rem',
          lineHeight: 'var(--ifm-pre-line-height)',
          fontWeight: 400,
          backgroundColor: 'transparent',
        }}
        wrapLines={true}
        wrapLongLines={false}
      >
        {displayCode}
      </SyntaxHighlighter>
    </div>
  );
}
