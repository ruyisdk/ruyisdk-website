/**
 * Code processing utility functions
 */

/**
 * Clean bash/zsh command prompts
 * Remove leading $ symbols for direct copy usage
 * 
 * @param {string} code - Original code
 * @param {string} lang - Language type
 * @returns {string} - Processed code
 * 
 * @example
 * // bash command
 * cleanShellPrompt('$ npm install\n$ npm start', 'bash')
 * // returns: 'npm install\nnpm start'
 * 
 * // non-shell language, no processing
 * cleanShellPrompt('console.log("$test")', 'javascript')
 * // returns: 'console.log("$test")'
 */
export function cleanShellPrompt(code, lang) {
    if (!['bash', 'zsh', 'shell', 'sh'].includes(lang)) {
        return code;
    }
    
    if (typeof code !== 'string') return '';
    
    const lines = code.split('\n');
    
    const cleanedLines = lines.map(line => {
        return line.replace(/^\s*\$\s+/, '').replace(/^\s*\$/, '');
    });
    
    return cleanedLines.join('\n');
}

/**
 * Clean and normalize code
 * - Convert CRLF to LF
 * - Remove leading empty lines
 * 
 * @param {string} code - Original code
 * @returns {string} - Cleaned code
 */
export function normalizeCode(code) {
    if (typeof code !== 'string') return '';
    
    const normalized = code.replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    
    if (lines.length > 0 && lines[0].trim() === '') {
        lines.shift();
    }
    
    return lines.join('\n');
}

