import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { getExternalLink, getLocaleMessage } from "@site/src/utils/locale";

export function externalLinks(key) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { i18n, siteConfig: { customFields } } = useDocusaurusContext();
  return getExternalLink(customFields.externalLinks, key, i18n?.currentLocale || 'zh-Hans');
}

export function byLocale(messages) {
  if (typeof messages === "string") return messages;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { i18n } = useDocusaurusContext();
  return getLocaleMessage(messages, i18n?.currentLocale || 'zh-Hans');
}
