import React, { useEffect, useState } from 'react';
import CopyButton from './CopyButton';
import LangSwitcher from './LangSwitcher';
import { TerminalIcon } from './Icons';

const Header = ({
  title,
  code,
  isHovered,
  copiable = true,
  langs = [],
  currentLang,
  onLangChange,
  isTerminal = false,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  return (
    <div className="flex min-h-[48px] items-center justify-between bg-neutral-50 pl-4 pr-3 py-0 dark:border-b dark:border-white/8 dark:bg-[#1c2330]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isTerminal && <TerminalIcon />}
          <span className="font-sans text-[13px] font-normal tracking-normal text-neutral-600 dark:text-slate-400">
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
          style={{ opacity: isHovered || isTouchDevice ? 1 : 0 }}
        >
          <CopyButton textToCopy={code} />
        </div>
      )}
    </div>
  );
};

export default Header;
