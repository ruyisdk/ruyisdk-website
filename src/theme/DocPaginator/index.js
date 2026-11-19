import React from 'react';
import DocPaginator from '@theme-original/DocPaginator';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';

function findCategoryLabel(items, permalink) {
  for (const item of items) {
    if (item.type !== 'category') continue;
    if (item.href === permalink) return item.label;
    const label = findCategoryLabel(item.items, permalink);
    if (label) return label;
  }
  return undefined;
}

export default function LocalizedDocPaginator({ previous, next }) {
  const sidebar = useDocsSidebar();

  function localize(link) {
    if (!link || !sidebar) return link;
    const title = findCategoryLabel(sidebar.items, link.permalink);
    return title ? { ...link, title } : link;
  }

  return <DocPaginator previous={localize(previous)} next={localize(next)} />;
}
