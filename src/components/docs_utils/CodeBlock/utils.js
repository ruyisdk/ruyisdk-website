/**
 * 代码处理工具函数
 */

/**
 * 清理 bash/zsh 命令的提示符
 * 去除行首的 $ 符号，便于直接复制使用
 * 
 * @param {string} code - 原始代码
 * @param {string} lang - 语言类型
 * @returns {string} - 处理后的代码
 * 
 * @example
 * // bash 命令
 * cleanShellPrompt('$ npm install\n$ npm start', 'bash')
 * // 返回: 'npm install\nnpm start'
 * 
 * // 非 shell 语言，不处理
 * cleanShellPrompt('console.log("$test")', 'javascript')
 * // 返回: 'console.log("$test")'
 */
export function cleanShellPrompt(code, lang) {
    // 只处理 bash 和 zsh
    if (!['bash', 'zsh', 'shell', 'sh'].includes(lang)) {
        return code;
    }
    
    if (typeof code !== 'string') return '';
    
    const lines = code.split('\n');
    
    const cleanedLines = lines.map(line => {
        // 去除行首的 $ 和后面的空格
        // 匹配：^ 开头，可能有空格，然后是 $，然后是一个或多个空格
        return line.replace(/^\s*\$\s+/, '').replace(/^\s*\$/, '');
    });
    
    return cleanedLines.join('\n');
}

/**
 * 清理和标准化代码
 * - CRLF 转 LF
 * - 移除开头的空行
 * 
 * @param {string} code - 原始代码
 * @returns {string} - 清理后的代码
 */
export function normalizeCode(code) {
    if (typeof code !== 'string') return '';
    
    // CRLF 转 LF
    const normalized = code.replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    
    // 移除开头的空行
    if (lines.length > 0 && lines[0].trim() === '') {
        lines.shift();
    }
    
    return lines.join('\n');
}

