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

export function normalizeCode(code) {
    if (typeof code !== 'string') return '';
    
    const normalized = code.replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    
    if (lines.length > 0 && lines[0].trim() === '') {
        lines.shift();
    }
    
    return lines.join('\n');
}

