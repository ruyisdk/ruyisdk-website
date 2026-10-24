/**
 * Shared locale helpers used across pages and components.
 */

/** Pick localized content from a locale->module map. */
export function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en || contentMap["zh-Hans"];
}

/** Pick a localized string from a locale->string map. */
export function getLocaleMessage(messages, locale) {
  if (typeof messages === "string") return messages;
  return messages[locale] ?? messages.en;
}

/** Resolve a configured external link for a locale. */
export function getExternalLink(externalLinks, key, locale) {
  const links = externalLinks[key];
  return links[locale] ?? links.en;
}

/** Backward-compatibility alias for byLocale. */
export function byLocale(messages, locale = 'zh-Hans') {
  return getLocaleMessage(messages, locale);
}

/** Backward-compatibility alias for externalLinks. */
export function externalLinks(externalLinkMap, key, locale = 'zh-Hans') {
  return getExternalLink(externalLinkMap, key, locale);
}
