import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
// Tailwind/Uno utility classes are used directly; no module CSS needed

export default function PaginatorNavLink(props) {
  const {permalink, title, subLabel, isNext, className} = props;
  return (
    <Link
      className={clsx(
        'pagination-nav__link',
        className,
        { 'pagination-nav__link--next': isNext, 'pagination-nav__link--prev': !isNext }
      )}
      to={permalink}>
      {subLabel && (
        <div className={clsx(
          'pagination-nav__sublabel',
          'text-xs text-[var(--ifm-color-emphasis-600)] mb-1 font-normal'
        )}>
          {subLabel}
        </div>
      )}
      <div
        className={clsx(
          'pagination-nav__label',
          'inline-flex items-center font-semibold text-base text-[var(--ifm-font-color-base)]'
        )}
      >
        {!isNext && <span className="mr-1 text-lg">‹</span>}
        <span>{title}</span>
        {isNext && <span className="ml-1 text-lg">›</span>}
      </div>
    </Link>
  );
}
