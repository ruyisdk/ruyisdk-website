import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import { ArrowUp } from 'lucide-react';

import styles from './styles.module.css';

const THRESHOLD = 300;

export default function BackToTopButton() {
  const { pathname, search, hash } = useLocation();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const updateButton = () => {
      setShown(window.scrollY > THRESHOLD);
    };

    updateButton();
    window.addEventListener('scroll', updateButton, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateButton);
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
      type="button"
      onClick={scrollToTop}
    >
      <ArrowUp size={18} strokeWidth={2.2} aria-hidden="true" />
    </button>
  );
}
