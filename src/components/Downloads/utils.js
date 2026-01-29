import { DOWNLOAD_ALLOWED_HOSTS } from './constants';

export function safeParseUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function triggerDownload(url) {
  const parsed = safeParseUrl(url);
  if (!parsed) return;

  const allowedHosts = new Set(DOWNLOAD_ALLOWED_HOSTS);
  if (!allowedHosts.has(parsed.hostname)) return;

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = parsed.toString();
  document.body.appendChild(iframe);

  window.setTimeout(() => {
    try {
      document.body.removeChild(iframe);
    } catch {
      // no-op
    }
  }, 15_000);
}

export function getLocalePrefixFromPathname(pathname) {
  const segments = (pathname || '').split('/').filter(Boolean);
  const known = new Set(['zh-Hans', 'en', 'de']);
  const first = segments[0];
  return known.has(first) ? `/${first}` : '';
}

export function withLocalePrefix(path, localePrefix) {
  if (!path.startsWith('/')) return `${localePrefix}/${path}`;
  return `${localePrefix}${path}`;
}

export function detectArchDefault() {
  if (typeof navigator === 'undefined') return 'x86_64';
  const ua = (navigator.userAgent || '').toLowerCase();
  const uaArch = (navigator.userAgentData && navigator.userAgentData.architecture) || '';

  if (/riscv64|risc-v|riscv/.test(ua) || /riscv64/.test(uaArch)) return 'riscv64';
  if (/aarch64|arm64/.test(ua) || /arm64/.test(uaArch)) return 'aarch64';
  return 'x86_64';
}

export function extractFileName(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const last = parsed.pathname.split('/').filter(Boolean).pop();
    return last || '';
  } catch {
    return url.split('/').pop() || '';
  }
}