import React, { useState, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Header from './Header';
import './styles.css';

/**
 * CodeBlock - 代码块核心组件
 * @param {string} code - 代码内容
 * @param {string} lang - 语言类型，默认 'bash'
 * @param {Array<{lang: string, code: string}>} langs - 多语言版本选项，默认 []
 * @param {string} filename - 可选的文件名，如果提供则显示在 Header 左侧
 * @param {string} title - Header 标题，默认 'Terminal'
 * @param {boolean} copiable - 是否显示复制按钮，默认 true
 */
const CodeBlock = ({ 
    code = '', 
    lang = 'bash', 
    langs = [],
    filename = '',
    title = 'Terminal',
    copiable = true 
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentLang, setCurrentLang] = useState(lang);

    // 获取当前显示的代码
    const currentCode = useMemo(() => {
        // 如果有多语言选项，从 langs 中查找对应语言的代码
        if (langs && langs.length > 0) {
            const langOption = langs.find(l => l.lang === currentLang);
            return langOption ? langOption.code : code;
        }
        // 否则使用传入的 code
        return code;
    }, [langs, currentLang, code]);

    // 清理和标准化代码
    const cleanedCode = useMemo(() => {
        if (typeof currentCode !== 'string') return '';
        
        // CRLF 转 LF
        const normalized = currentCode.replace(/\r\n/g, '\n');
        const lines = normalized.split('\n');
        
        // 移除开头的空行
        if (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
        }
        
        return lines.join('\n');
    }, [currentCode]);

    // 显示的语言标签
    const displayLang = currentLang === 'no' ? 'text' : currentLang;

    // Header 标题逻辑
    const headerTitle = useMemo(() => {
        // 如果传了 filename，优先显示 filename
        if (filename) return filename;
        
        // 否则显示 title 或按语言推断
        if (title && title !== 'Terminal') return title;
        
        // 如果是 bash，显示 Terminal
        if (currentLang === 'bash') return 'Terminal';
        
        // 否则显示语言名称
        return displayLang;
    }, [filename, title, currentLang, displayLang]);

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
                title={headerTitle}
                code={cleanedCode}
                isHovered={isHovered}
                copiable={copiable}
                langs={langs}
                currentLang={currentLang}
                onLangChange={setCurrentLang}
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

