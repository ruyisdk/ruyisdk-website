import React from 'react';
import CopyButton from './CopyButton';
import LangSwitcher from './LangSwitcher';
import { TerminalIcon } from './Icons';

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
        <div className="flex items-center justify-between pl-4 pr-3 py-0 min-h-[48px] bg-neutral-50 dark:bg-neutral-800">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    {title === 'Terminal' && <TerminalIcon />}
                    <span className="text-[13px] font-normal tracking-normal 
                                     text-neutral-600 dark:text-neutral-400
                                     font-sans">
                        {title}
                    </span>
                </div>
                
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

