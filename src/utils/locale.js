import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

/**
 * Shared locale helpers used across pages and components.
 */

/**
 * Pick a localized content module from a locale->module map.
 * Falls back to English, then zh-Hans.
 */
export function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en || contentMap["zh-Hans"];
}

/** Pick a localized string from a locale->string map (plain strings pass through). */
export function byLocale(messages) {
  if (typeof messages === "string") return messages;

  const { i18n } = useDocusaurusContext();

  return messages[i18n.currentLocale] ?? messages.en;
}

/** Resolve an external link configured in siteConfig.customFields for the current locale. */
export function externalLinks(key) {
  const {
    i18n,
    siteConfig: { customFields },
  } = useDocusaurusContext();

  return (
    customFields.externalLinks[key][i18n.currentLocale] ??
    customFields.externalLinks[key].en
  );
}
