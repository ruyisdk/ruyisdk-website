import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export function externalLinks(key) {
  const {
    i18n,
    siteConfig: { customFields },
  } = useDocusaurusContext();

  return customFields.externalLinks[key][i18n.currentLocale] ??
    customFields.externalLinks[key].en;
}
