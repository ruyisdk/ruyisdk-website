import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import PaginatorNavLink from '@theme/PaginatorNavLink';
import styles from './styles.module.css';

export default function DocsPaginator(props) {
  const {previous, next} = props;
  return (
    <nav
      className={clsx('pagination-nav', styles.paginationNav)}
      aria-label={Translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages',
        description: 'The ARIA label for the docs pagination',
      })}>
      {previous && (
        <PaginatorNavLink
          permalink={previous.permalink}
          title={previous.title}
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
