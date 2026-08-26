import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import { PaginatorNavLink } from '@site/src/theme/SharedPaginator';
// Tailwind/Uno utility classes are used directly; no module CSS needed

export default function DocsPaginator(props) {
  const {previous, next} = props;
  return (
    <nav
      className={clsx(
        'pagination-nav',
        // top border divider + spacing
        'border-t border-[var(--ifm-hr-border-color)] mt-6 pt-4',
        // two columns, items pinned left/right
        'grid grid-cols-2 gap-8 items-start'
      )}
      aria-label={Translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages',
        description: 'The ARIA label for the docs pagination',
      })}>
      {previous && (
        <PaginatorNavLink
          permalink={previous.permalink}
          title={previous.title}
          className={clsx('justify-self-start text-left')}
          subLabel={Translate({
            id: 'theme.docs.paginator.previous',
            message: 'Previous',
            description: 'The label used to navigate to the previous doc',
          })}
        />
      )}
      {next && (
        <PaginatorNavLink
          permalink={next.permalink}
          title={next.title}
          className={clsx('justify-self-end text-right')}
          subLabel={Translate({
            id: 'theme.docs.paginator.next',
            message: 'Next',
            description: 'The label used to navigate to the next doc',
          })}
          isNext
        />
      )}
    </nav>
  );
}
