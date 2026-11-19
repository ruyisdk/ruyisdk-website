import React from 'react';
import { translate } from '@docusaurus/Translate';

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
            type="button"
            key={langOption.lang || index}
            onClick={() => onLangChange(langOption.lang)}
            className={`
              px-2 py-0.5 text-xs font-medium rounded-md transition-colors duration-150
              ${
                isActive
                  ? 'bg-slate-200/90 text-slate-900 dark:bg-slate-700/90 dark:text-slate-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
              }
            `}
            aria-label={translate(
              {
                id: 'theme.CodeBlock.switchLanguage',
                message: '切换到 {language}',
                description: 'The ARIA label for switching the code block language',
              },
              { language: langOption.lang },
            )}
          >
            {langOption.lang}
          </button>
        );
      })}
    </div>
  );
};

export default LangSwitcher;
