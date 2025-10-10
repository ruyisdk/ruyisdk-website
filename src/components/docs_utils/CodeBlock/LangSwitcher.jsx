import React from 'react';

/**
 * LangSwitcher - Language switcher component
 * @param {Array<{lang: string, code: string}>} langs - Language options array
 * @param {string} currentLang - Currently selected language
 * @param {Function} onLangChange - Language change callback
 */
const LangSwitcher = ({ langs, currentLang, onLangChange }) => {
    if (!langs || langs.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-1">
            {langs.map((langOption, index) => {
                const isActive = langOption.lang === currentLang;
                
                return (
                    <button
                        key={langOption.lang || index}
                        onClick={() => onLangChange(langOption.lang)}
                        className={`
                            px-2 py-1 text-xs font-medium rounded transition-all duration-200
                            ${isActive 
                                ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100' 
                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800'
                            }
                        `}
                        aria-label={`Switch to ${langOption.lang}`}
                    >
                        {langOption.lang}
                    </button>
                );
            })}
        </div>
    );
};

export default LangSwitcher;

