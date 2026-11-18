import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaginatorNavLink(props) {
  const { permalink, title, subLabel, isNext, className } = props;
  return (
    <Link
      className={clsx(
        'pagination-nav__link',
        'bg-transparent border-0 shadow-none no-underline',
        'block transition-colors duration-200',
        'hover:text-[var(--ifm-link-color)]',
        className,
        { 'pagination-nav__link--next': isNext, 'pagination-nav__link--prev': !isNext }
      )}
      to={permalink}
    >
      {subLabel && (
        <div
          className={clsx(
            'pagination-nav__sublabel',
            'text-xs text-[var(--ifm-color-emphasis-600)] mb-1 font-normal'
          )}
        >
          {subLabel}
        </div>
      )}
      <div
        className={clsx(
          'pagination-nav__label',
          'inline-flex items-center font-semibold text-base text-[var(--ifm-font-color-base)]'
        )}
      >
        {!isNext && <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" className="mr-1 shrink-0" />}
        <span>{title}</span>
        {isNext && <ChevronRight size={16} strokeWidth={2} aria-hidden="true" className="ml-1 shrink-0" />}
      </div>
    </Link>
  );
}
