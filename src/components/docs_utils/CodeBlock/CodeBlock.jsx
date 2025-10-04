import React, { useState, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Header from './Header';
import './styles.css';

/**
 * CodeBlock - 代码块核心组件
 * @param {string} code - 代码内容
 * @param {string} lang - 语言类型，默认 'text'
 * @param {string} filename - 可选的文件名
 */
const CodeBlock = ({ code = '', lang = 'text', filename }) => {
    const [isHovered, setIsHovered] = useState(false);

    // 清理和标准化代码
    const cleanedCode = useMemo(() => {
        if (typeof code !== 'string') return '';
        
        // CRLF 转 LF
        const normalized = code.replace(/\r\n/g, '\n');
        const lines = normalized.split('\n');
        
        // 移除开头的空行
        if (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
        }
        
        return lines.join('\n');
    }, [code]);

    // 显示的语言标签
    const displayLang = lang === 'no' ? 'text' : lang;

    return (
        <div 
            className="rounded-xl font-mono my-6 overflow-hidden text-sm 
                       bg-neutral-50 border border-neutral-200 shadow-sm 
                       dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-black/30"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 顶部标题栏 */}
            <Header 
                filename={filename || displayLang}
                code={cleanedCode}
                isHovered={isHovered}
            />
            
            {/* 代码内容 */}
            <SyntaxHighlighter 
                language={displayLang} 
                customStyle={{ 
                    margin: 0, 
                    padding: '1rem 1.25rem', 
                    fontSize: '0.875rem', 
                    lineHeight: '1.7', 
                    fontWeight: 400 
                }} 
                wrapLines={true} 
                wrapLongLines={true}
            >
                {cleanedCode}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;

