import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { translate } from '@docusaurus/Translate';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from './Header';
import { normalizeCode, cleanShellPrompt, stripShellPrompt } from './utils';

const COPY_SVG = (size) => `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
  </svg>
`;

const CHECK_SVG = (size) => `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
    <path d="M20 6 9 17l-5-5"></path>
  </svg>
`;

function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const root = document.documentElement;
    const sync = () => {
      setIsDark(root.getAttribute('data-theme') === 'dark');
    };
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const CodeBlock = ({
  code = '',
  lang = 'bash',
  langs = [],
  title = '',
  copiable,
  input = '',
  hasInput = false,
  showTitleCopyButton,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentLang, setCurrentLang] = useState(lang);
  const isDark = useIsDarkTheme();
  const copyButtonsRef = useRef(new Map());
  const copyLineLabel = translate({
    id: 'theme.CodeBlock.copyLine',
    message: '复制此行',
    description: 'The ARIA label for copying an individual code line',
  });

  const inputLines = useMemo(() => {
    const lines = new Set();
    if (!hasInput || !input) return lines;

    const normalizedInput = String(input).replace(/^['"]|['"]$/g, '');
    const parts = normalizedInput.split(',');

    parts.forEach((rawPart) => {
      const part = rawPart.trim();
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
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
      const langOption = langs.find((l) => l.lang === currentLang);
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
      highlightLines: toHighlight,
    };
  }, [currentCode]);

  const displayLang = currentLang === 'no' ? 'text' : currentLang;
  const isInputOutputBlock = hasInput;

  const copyableCode = useMemo(
    () => (isInputOutputBlock ? cleanShellPrompt(displayCode) : displayCode),
    [displayCode, isInputOutputBlock]
  );

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

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return Promise.resolve();
    } catch (err) {
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
    if (!codeBlockRef.current) return undefined;

    const preElement = codeBlockRef.current.querySelector('pre');
    if (!preElement) return undefined;
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

    const rafId = requestAnimationFrame(() => {
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
      allLines.forEach((_, index) => {
        const shouldHighlight = isInputOutputBlock ? inputLines.has(index) : highlightLines.has(index);
        if (shouldHighlight) {
          highlightedLines.add(index);
        }
      });

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
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
          line.offsetHeight;
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
        const rightPaddingPx = isMobile ? '56px' : '48px';
        const leftPaddingPx = isMobile ? '12px' : '20px';
        const horizontalMargin = isMobile ? '0' : '-20px';

        const removeExistingCopyButton = () => {
          const existingBtn =
            line.querySelector('.line-copy-button') || copyButtonsRef.current.get(index);
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
          line.style.backgroundColor = isDark ? 'transparent' : 'rgb(255, 255, 255)';
          line.style.position = '';
          line.style.margin = `0 ${horizontalMargin}`;
          line.style.padding = `0 ${rightPaddingPx} 0 ${leftPaddingPx}`;
          line.style.boxSizing = 'border-box';
          line.style.width = maxLineWidth > 0 ? `${maxLineWidth}px` : 'fit-content';
          line.style.minWidth = isMobile ? '100%' : 'calc(100% + 40px)';
          line.style.borderRadius = '';
          line.style.minHeight = '';
          line.style.lineHeight = 'var(--ifm-pre-line-height)';
          line.style.color = isDark ? 'rgb(148, 163, 184)' : '';
          line.style.fontFamily = '';
          line.querySelectorAll('*').forEach((child) => {
            child.style.color = 'inherit';
            child.style.fontWeight = 'inherit';
            child.style.fontStyle = 'inherit';
            child.style.textShadow = 'none';
          });
        } else if (!shouldHighlight) {
          line.style.backgroundColor = '';
          line.style.color = '';
        } else {
          line.style.color = '';
          line.style.fontFamily = '';
        }

        if (shouldHighlight) {
          const prevHighlighted = highlightedLines.has(index - 1);
          const nextHighlighted = highlightedLines.has(index + 1);

          line.style.backgroundColor = isDark
            ? 'rgba(56, 139, 253, 0.14)'
            : 'rgb(255, 255, 255)';
          line.style.position = 'relative';

          const marginTop = !prevHighlighted ? '2px' : '0';
          const marginBottom = !nextHighlighted ? '2px' : '0';

          line.style.margin = `${marginTop} ${horizontalMargin} ${marginBottom} ${horizontalMargin}`;
          line.style.padding = `0 ${rightPaddingPx} 0 ${leftPaddingPx}`;
          line.style.boxSizing = 'border-box';
          line.style.width = maxLineWidth > 0 ? `${maxLineWidth}px` : 'fit-content';
          line.style.minWidth = isMobile ? '100%' : 'calc(100% + 40px)';
          line.style.borderRadius = '0';
          line.style.minHeight = '';
          line.style.lineHeight = 'var(--ifm-pre-line-height)';

          removeExistingCopyButton();

          const copyBtn = document.createElement('button');
          copyBtn.type = 'button';
          copyBtn.className = 'line-copy-button';
          copyBtn.setAttribute('aria-label', copyLineLabel);
          copyButtonsRef.current.set(index, copyBtn);

          const iconSize = isMobile ? '12' : '13';
          copyBtn.innerHTML = COPY_SVG(iconSize);

          const btnSize = isMobile ? 20 : 22;
          const btnRight = 8;
          const btnPadding = isMobile ? '2px' : '3px';
          const btnBaseBg = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
          const btnHoverBg = isDark ? 'rgba(51, 65, 85, 0.95)' : 'rgba(241, 245, 249, 0.98)';
          const btnBorder = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.45)';
          const btnColor = isDark ? 'rgb(148, 163, 184)' : 'rgb(100, 116, 139)';

          copyBtn.style.cssText = `
            position: fixed;
            transform: translateY(-50%);
            background: ${btnBaseBg};
            border: 1px solid ${btnBorder};
            outline: none;
            cursor: pointer;
            padding: ${btnPadding};
            border-radius: ${isMobile ? '8px' : '6px'};
            color: ${btnColor};
            opacity: ${isMobile ? '0.85' : '0'};
            transition: opacity 0.18s ease, background-color 0.18s ease, transform 0.18s ease, color 0.18s ease;
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
            box-shadow: ${isDark ? '0 2px 6px rgba(2, 6, 23, 0.55)' : '0 2px 6px rgba(15, 23, 42, 0.12)'};
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
            border-bottom: 1px solid ${isDark ? 'rgba(121, 168, 255, 0.5)' : 'rgb(156, 163, 175)'};
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

            copyToClipboard(textToCopy)
              .then(() => {
                copyBtn.innerHTML = CHECK_SVG(iconSize);
                copyBtn.style.color = isDark ? 'rgb(52, 211, 153)' : 'rgb(22, 163, 74)';

                setTimeout(() => {
                  copyBtn.innerHTML = COPY_SVG(iconSize);
                  copyBtn.style.color = btnColor;
                  isProcessing = false;
                }, 1500);
              })
              .catch((err) => {
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
              copyBtn.style.backgroundColor = btnHoverBg;
              copyBtn.style.opacity = '1';
              copyBtn.style.transform = 'translateY(-50%) scale(1.05)';
            }
          };

          const handleBtnMouseLeave = () => {
            if (!isMobile) {
              copyBtn.style.backgroundColor = btnBaseBg;
              copyBtn.style.transform = 'translateY(-50%) scale(1)';
              copyBtn.style.opacity = '0';
            }
          };

          const handleTouchStart = () => {
            if (isMobile) {
              updateCopyButtonPosition();
              copyBtn.style.backgroundColor = btnHoverBg;
              copyBtn.style.transform = 'translateY(-50%) scale(0.92)';
              copyBtn.style.opacity = '1';
            }
          };

          const handleTouchEnd = () => {
            if (isMobile) {
              setTimeout(() => {
                copyBtn.style.backgroundColor = btnBaseBg;
                copyBtn.style.transform = 'translateY(-50%) scale(1)';
                copyBtn.style.opacity = '0.85';
              }, 100);
            }
          };

          if (isMobile) {
            copyBtn.addEventListener('touchstart', handleTouchStart, { passive: true });
            copyBtn.addEventListener('touchend', handleTouchEnd, { passive: true });
            copyBtn.addEventListener('click', handleCopy);
            cleanupFns.push(() => {
              copyBtn.removeEventListener('touchstart', handleTouchStart);
              copyBtn.removeEventListener('touchend', handleTouchEnd);
              copyBtn.removeEventListener('click', handleCopy);
            });
          } else {
            line.addEventListener('mouseenter', handleMouseEnter);
            line.addEventListener('mouseleave', handleMouseLeave);
            copyBtn.addEventListener('mouseenter', handleBtnMouseEnter);
            copyBtn.addEventListener('mouseleave', handleBtnMouseLeave);
            copyBtn.addEventListener('click', handleCopy);
            cleanupFns.push(() => {
              line.removeEventListener('mouseenter', handleMouseEnter);
              line.removeEventListener('mouseleave', handleMouseLeave);
              copyBtn.removeEventListener('mouseenter', handleBtnMouseEnter);
              copyBtn.removeEventListener('mouseleave', handleBtnMouseLeave);
              copyBtn.removeEventListener('click', handleCopy);
            });
          }

          document.body.appendChild(copyBtn);
          cleanupFns.push(() => {
            try {
              copyBtn.remove();
              if (copyButtonsRef.current.get(index) === copyBtn) {
                copyButtonsRef.current.delete(index);
              }
            } catch {
              // no-op
            }
          });
        } else {
          const existingUnderline = line.querySelector('.line-command-underline');
          if (existingUnderline) {
            existingUnderline.remove();
          }
          removeExistingCopyButton();
        }
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, [highlightLines, displayCode, inputLines, isInputOutputBlock, isDark, copyToClipboard, copyLineLabel]);

  return (
    <div
      ref={codeBlockRef}
      className="rounded-xl font-mono my-6 overflow-hidden text-sm bg-neutral-50 border border-neutral-200 shadow-sm
                 dark:border-white/10 dark:bg-[#151b23] dark:shadow-black/30"
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

      <div className="overflow-x-auto bg-white dark:bg-[#151b23]">
        <SyntaxHighlighter
          language={displayLang}
          style={isDark ? oneDark : undefined}
          customStyle={{
            margin: 0,
            padding: '20px',
            fontSize: '0.875rem',
            lineHeight: 'var(--ifm-pre-line-height)',
            fontWeight: 400,
            backgroundColor: 'transparent',
            background: 'transparent',
            textShadow: 'none',
          }}
          codeTagProps={{
            style: {
              background: 'transparent',
              backgroundColor: 'transparent',
              textShadow: 'none',
              fontFamily: 'inherit',
            },
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
