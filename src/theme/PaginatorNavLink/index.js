import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function PaginatorNavLink(props) {
  const {permalink, title, subLabel, isNext} = props;
  return (
    <Link
      className={clsx(
        'pagination-nav__link',
        styles.paginationNavLink,
        {
          'pagination-nav__link--next': isNext,
          'pagination-nav__link--prev': !isNext,
        }
      )}
      to={permalink}>
      {subLabel && (
        <div className={clsx('pagination-nav__sublabel', styles.paginationNavSublabel)}>
          {subLabel}
        </div>
      )}
      <div className={clsx('pagination-nav__label', styles.paginationNavLabel)}>
        {title}
      </div>
    </Link>
  );
}
