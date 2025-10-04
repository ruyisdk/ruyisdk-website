import React from 'react';
import CopyButton from './CopyButton';

/**
 * Header - 代码块顶部标题栏
 * @param {string} filename - 文件名或语言标签
 * @param {string} code - 代码内容
 * @param {boolean} isHovered - 是否处于悬停状态
 */
const Header = ({ filename, code, isHovered }) => {
    return (
        <div className="flex items-center justify-between px-4 py-2.5 min-h-[44px] 
                        bg-neutral-100 border-b border-neutral-200 
                        dark:bg-neutral-800 dark:border-neutral-700">
            {/* 文件名/语言标签 */}
            <span className="text-[0.8125rem] font-medium tracking-tight 
                             text-neutral-900 dark:text-neutral-100 font-sans">
                {filename}
            </span>
            
            {/* 复制按钮 - 仅在悬停时显示 */}
            <div 
                className="transition-opacity duration-200"
                style={{ opacity: isHovered ? 1 : 0 }}
            >
                <CopyButton textToCopy={code} />
            </div>
        </div>
    );
};

export default Header;

