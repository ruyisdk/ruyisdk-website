import React from 'react';
import CopyButton from './CopyButton';
import LangSwitcher from './LangSwitcher';

/**
 * Header - Code block header component
 * @param {string} title - Title text
 * @param {string} code - Code content
 * @param {boolean} isHovered - Whether in hover state
 * @param {boolean} copiable - Whether to show copy button, defaults to true
 * @param {Array} langs - Multi-language options array
 * @param {string} currentLang - Current language
 * @param {Function} onLangChange - Language change callback
 */
const Header = ({ 
    title, 
    code, 
    isHovered, 
    copiable = true,
    langs = [],
    currentLang,
    onLangChange
}) => {
    return (
        <div className="flex items-center justify-between px-4 py-2.5 min-h-[44px] 
                        bg-neutral-100 border-b border-neutral-200 
                        dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex items-center gap-3">
                <span className="text-[0.8125rem] font-medium tracking-tight 
                                 text-neutral-900 dark:text-neutral-100 font-sans">
                    {title}
                </span>
                
                <LangSwitcher 
                    langs={langs}
                    currentLang={currentLang}
                    onLangChange={onLangChange}
                />
            </div>
            
            {copiable && (
                <div 
                    className="transition-opacity duration-200"
                    style={{ opacity: isHovered ? 1 : 0 }}
                >
                    <CopyButton textToCopy={code} />
                </div>
            )}
        </div>
    );
};

export default Header;

