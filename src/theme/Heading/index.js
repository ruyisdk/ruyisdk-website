import React from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import useBrokenLinks from '@docusaurus/useBrokenLinks';
import { translate } from '@docusaurus/Translate';
import { Link } from 'lucide-react';

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
  const anchorTitle = translate(
    {
      id: 'theme.common.headingLinkTitle',
      message: 'Direct link to {heading}',
      description: 'Title for link to heading',
    },
    { heading: typeof props.children === 'string' ? props.children : id },
  );
  return (
    <As
      {...props}
      className={clsx(
        'anchor',
        // Use Tailwind (incl. arbitrary values) to replace CSS module:
        // when navbar hides on scroll, use 0.5rem scroll margin; otherwise include navbar height
        hideOnScroll
          ? 'scroll-mt-2'
          : 'scroll-mt-[calc(var(--ifm-navbar-height)+0.5rem)]',
        props.className,
      )}
      id={id}>
      {props.children}
      <a
        className="hash-link"
        href={`#${id}`}
        aria-label={anchorTitle}
        title={anchorTitle}
      >
        <Link size="0.75em" />
      </a>
    </As>
  );
}
