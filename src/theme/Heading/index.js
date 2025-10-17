import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
export default function Heading({as: As, id, ...props}) {
  const brokenLinks = useBrokenLinks();
  const {
    navbar: {hideOnScroll},
  } = useThemeConfig();
  // H1 headings do not need an id because they don't appear in the TOC.
  if (As === 'h1' || !id) {
    return <As {...props} id={undefined} />;
  }
  brokenLinks.collectAnchor(id);
  return (
    <As
      {...props}
      className={clsx(
        'anchor',
        // Use Tailwind (incl. arbitrary values) to replace CSS module:
        // when navbar hides on scroll, use 0.5rem scroll margin; otherwise include navbar height
        hideOnScroll
          ? 'scroll-mt-2'
          : '[scroll-margin-top:calc(var(--ifm-navbar-height)_+_0.5rem)]',
        props.className,
      )}
      id={id}>
      {props.children}
      <a
        className="hash-link"
        href={`#${id}`}
        aria-label={`${props.children} permalink`}
        title={`${props.children} permalink`}
      />
    </As>
  );
}
