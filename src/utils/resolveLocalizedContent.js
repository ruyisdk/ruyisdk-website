export default function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en;
}
