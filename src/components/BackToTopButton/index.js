import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';

import styles from './styles.module.css';

const THRESHOLD = 300;

export default function BackToTopButton() {
  const [shown, setShown] = useState(false);
  const [footerOffset, setFooterOffset] = useState(0);

  useEffect(() => {
    const updateButton = () => {
      const footer = document.querySelector('footer');
      const nextFooterOffset = footer
        ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top)
        : 0;

      setFooterOffset(nextFooterOffset);
      setShown(window.scrollY > THRESHOLD);
    };

    updateButton();
    window.addEventListener('scroll', updateButton, {passive: true});
    window.addEventListener('resize', updateButton);
    return () => {
      window.removeEventListener('scroll', updateButton);
      window.removeEventListener('resize', updateButton);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, []);

  return (
    <button
      aria-label={translate({
        id: 'theme.BackToTopButton.buttonAriaLabel',
        message: 'Scroll back to top',
        description: 'The ARIA label for the back to top button',
      })}
      className={clsx(styles.button, shown && styles.buttonVisible)}
      style={{'--back-to-top-footer-offset': `${footerOffset}px`}}
      type="button"
      onClick={scrollToTop}>
      <span className={styles.arrow} aria-hidden="true" />
    </button>
  );
}
