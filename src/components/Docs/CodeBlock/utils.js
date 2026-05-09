export function stripShellPrompt(line) {
    if (typeof line !== 'string') return '';

    return line
        .replace(/^\s*«[^»]*»\s*(?:[$#])\s?/, '')
        .replace(/^\s*\[[^\]]+\][^\s]*\s*(?:[$#])\s?/, '')
        .replace(/^\s*(?:[$#])\s?/, '')
        .trim();
}

export function cleanShellPrompt(code) {
    if (typeof code !== 'string') return '';
    
    const lines = code.split('\n');
    
    const cleanedLines = lines.map(stripShellPrompt);
    
    return cleanedLines.join('\n');
}

export function normalizeCode(code) {
    if (typeof code !== 'string') return '';
    
    const normalized = code.replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    
    if (lines.length > 0 && lines[0].trim() === '') {
        lines.shift();
    }

    if (lines.length > 0 && lines[lines.length - 1] === '') {
        lines.pop();
    }
    
    return lines.join('\n');
}
