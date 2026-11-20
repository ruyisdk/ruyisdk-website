const KNOWN_LOCALES = new Set(['zh-Hans', 'en', 'de']);

export function headerGradientClass(accent) {
  if (accent === 'gold') {
    return 'bg-gradient-to-r from-[#fffbeb] via-[#fffef7] to-white dark:from-amber-500/12 dark:via-[#181f2a] dark:to-[#151b23]';
  }
  if (accent === 'eclipse') {
    return 'bg-gradient-to-r from-[#f3f4ff] via-[#f9faff] to-white dark:from-indigo-500/14 dark:via-[#181f2a] dark:to-[#151b23]';
  }
  return 'bg-gradient-to-r from-[#eff5ff] via-[#f8fbff] to-white dark:from-blue-500/14 dark:via-[#181f2a] dark:to-[#151b23]';
}

export function headerIconClass(accent) {
  if (accent === 'gold') {
    return 'text-[#c88a04] dark:text-amber-400';
  }
  if (accent === 'eclipse') {
    return 'text-[#3730a3] dark:text-indigo-300';
  }
  return 'text-[#1648B8] dark:text-[#79a8ff]';
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

export function withLocalePrefix(path, localePrefix) {
  if (!path.startsWith('/')) return `${localePrefix}/${path}`;
  return `${localePrefix}${path}`;
}

export function getLocalePrefixFromPathname(pathname) {
  const segments = (pathname || '').split('/').filter(Boolean);
  const first = segments[0];
  return KNOWN_LOCALES.has(first) ? `/${first}` : '';
}

export function detectSource(url) {
  const parsed = safeParseUrl(url);
  if (!parsed) return 'unknown';
  if (parsed.hostname.includes('mirror.iscas.ac.cn')) return 'mirror';
  if (parsed.hostname.includes('github.com')) return 'github';
  return 'unknown';
}

export function extractFileName(url) {
  const parsed = safeParseUrl(url);
  if (!parsed) return '';
  const parts = parsed.pathname.split('/').filter(Boolean);
  const fileName = parts[parts.length - 1] || '';
  try {
    return decodeURIComponent(fileName);
  } catch {
    return fileName;
  }
}
