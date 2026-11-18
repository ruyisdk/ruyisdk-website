import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import { ArrowUp } from 'lucide-react';

import styles from './styles.module.css';

const THRESHOLD = 300;
const NAVBAR_SAFE_CLEARANCE = 136;

function findSiteFooter() {
  return (
    document.querySelector('footer[data-site-footer]') ||
    Array.from(document.querySelectorAll('footer')).find(
      (el) => !el.closest('main, article'),
    ) ||
    null
  );
}

export default function BackToTopButton() {
  const { pathname, search, hash } = useLocation();
  const [shown, setShown] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);

  useEffect(() => {
    const updateButton = () => {
      const footer = findSiteFooter();
      const rawOffset = footer
        ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top)
        : 0;
      const maxOffset = Math.max(0, window.innerHeight - NAVBAR_SAFE_CLEARANCE);

      setFooterOffset(Math.min(rawOffset, maxOffset));
      setShown(window.scrollY > THRESHOLD);
    };

    updateButton();
    window.addEventListener('scroll', updateButton, { passive: true });
    window.addEventListener('resize', updateButton);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(updateButton);
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', updateButton);
      window.removeEventListener('resize', updateButton);
      resizeObserver?.disconnect();
    };
  }, [pathname, search, hash]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <button
      aria-label={translate({
        id: 'theme.BackToTopButton.buttonAriaLabel',
        message: 'Scroll back to top',
        description: 'The ARIA label for the back to top button',
      })}
      className={clsx(styles.button, shown && styles.buttonVisible)}
      style={{ '--back-to-top-footer-offset': `${footerOffset}px` }}
      type="button"
      onClick={scrollToTop}
    >
      <ArrowUp size={18} strokeWidth={2.2} aria-hidden="true" />
    </button>
  );
}
