import React from 'react';
import CopyButton from './CopyButton';
import LangSwitcher from './LangSwitcher';

/**
 * Header - 代码块顶部标题栏
 * @param {string} title - 标题文本
 * @param {string} code - 代码内容
 * @param {boolean} isHovered - 是否处于悬停状态
 * @param {boolean} copiable - 是否显示复制按钮，默认 true
 * @param {Array} langs - 多语言选项数组
 * @param {string} currentLang - 当前语言
 * @param {Function} onLangChange - 语言切换回调
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
            {/* 左侧：标题和语言切换器 */}
            <div className="flex items-center gap-3">
                {/* 标题 */}
                <span className="text-[0.8125rem] font-medium tracking-tight 
                                 text-neutral-900 dark:text-neutral-100 font-sans">
                    {title}
                </span>
                
                {/* 语言切换器 */}
                <LangSwitcher 
                    langs={langs}
                    currentLang={currentLang}
                    onLangChange={onLangChange}
                />
            </div>
            
            {/* 右侧：复制按钮 - 仅在悬停时显示且 copiable 为 true */}
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

