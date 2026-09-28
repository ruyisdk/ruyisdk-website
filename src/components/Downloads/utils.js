// Shared helpers for the /downloads page and the download-thanks page.

export const COLOR_VARS = {
  gold: 'var(--ruyi-gold, var(--ifm-color-warning))',
  goldDark: 'var(--ruyi-gold-dark, var(--ifm-color-warning-dark, var(--ifm-color-warning)))',
  blue: 'var(--ruyi-blue, var(--ifm-color-primary))',
  blueDark: 'var(--ruyi-blue-dark, var(--ifm-color-primary-dark, var(--ifm-color-primary)))',
  eclipse: '#5f3dc4',
  contrast: 'var(--ruyi-primary-contrast, var(--ifm-font-color-base))',
};

export function headerGradientStyle(accent) {
  if (accent === 'gold') {
    return { background: 'linear-gradient(90deg, rgba(255, 247, 230, 0.98) 0%, rgba(255, 253, 245, 0.98) 100%)' };
  }
  if (accent === 'eclipse') {
    return { background: 'linear-gradient(90deg, rgba(239, 235, 255, 0.96) 0%, rgba(250, 248, 255, 0.98) 100%)' };
  }
  return { background: 'linear-gradient(90deg, rgba(236, 246, 255, 0.98) 0%, rgba(248, 252, 255, 0.98) 100%)' };
}

export function buttonStyle(variant = 'primary', accent = 'blue') {
  if (variant === 'secondary') {
    return { color: COLOR_VARS.contrast, background: '#fff', border: '1px solid rgba(0,0,0,0.16)' };
  }
  if (accent === 'gold') {
    return { backgroundColor: 'rgba(232, 183, 22, 0.18)', color: '#8c6b00', boxShadow: 'none' };
  }
  if (accent === 'eclipse') {
    return { backgroundColor: 'rgba(95, 61, 196, 0.14)', color: COLOR_VARS.eclipse, boxShadow: 'none' };
  }
  return { backgroundColor: 'rgba(45, 120, 255, 0.14)', color: COLOR_VARS.blue, boxShadow: 'none' };
}

export function safeParseUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function extractFileName(url) {
  const parsed = safeParseUrl(url);
  if (!parsed) return '';
  const parts = parsed.pathname.split('/').filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] || '');
}

export function detectSource(url) {
  const parsed = safeParseUrl(url);
  if (!parsed) return 'unknown';
  if (parsed.hostname.includes('mirror.iscas.ac.cn')) return 'mirror';
  if (parsed.hostname.includes('github.com')) return 'github';
  return 'unknown';
}
