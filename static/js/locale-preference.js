(() => {
  const storageKey = 'ruyisdk.locale';
  const switchFragment = '#ruyisdk-locale-switch:';
  const {defaultLocale, locales} = document.currentScript.dataset;
  const configuredLocales = locales.split(' ');
  const alternatives = new Map();
  for (const link of document.querySelectorAll('link[rel="alternate"][hreflang]')) {
    alternatives.set(link.hreflang, new URL(link.href).pathname);
  }
  const defaultPath = alternatives.get(defaultLocale) ?? alternatives.get('x-default');
  alternatives.delete('x-default');

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('.navbar a[lang]');
    if (!link || !configuredLocales.includes(link.lang) || link.origin !== location.origin) return;

    const target = new URL(link.href);
    target.search = location.search;
    target.hash = location.hash;
    try {
      localStorage.setItem(storageKey, link.lang);
    } catch {
      if (link.lang === defaultLocale) {
        if (link.lang === document.documentElement.lang) {
          event.preventDefault();
          return;
        }
        target.hash = switchFragment + target.hash.slice(1);
      }
    }
    link.href = target.href;
  }, true);

  if (location.hash.startsWith(switchFragment)) {
    const anchor = location.hash.slice(switchFragment.length);
    history.replaceState(history.state, '', location.pathname + location.search + (anchor ? '#' + anchor : ''));
    return;
  }

  const route = (path) => path.replace(/\/(?:index\.html)?$/, '');
  if (!defaultPath || route(location.pathname) !== route(defaultPath)) return;

  let preferred;
  try {
    preferred = localStorage.getItem(storageKey);
  } catch {
    preferred = null;
  }

  if (!alternatives.has(preferred)) {
    const availableLocales = configuredLocales.filter((locale) => alternatives.has(locale));
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const language of languages) {
      const tag = language.toLowerCase();
      preferred = availableLocales.find((locale) => locale.toLowerCase() === tag)
        ?? availableLocales.find((locale) => locale.split('-')[0].toLowerCase() === tag.split('-')[0]);
      if (preferred) break;
    }
  }

  const targetPath = alternatives.get(preferred);
  if (targetPath && targetPath !== defaultPath) {
    location.replace(targetPath + location.search + location.hash);
  }
})();
