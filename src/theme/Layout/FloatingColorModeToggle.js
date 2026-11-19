import React from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import ColorModeToggle from '@theme/ColorModeToggle';
import styles from '@site/src/css/floating-buttons.module.css';

export default function FloatingColorModeToggle() {
  const {colorMode, setColorMode} = useColorMode();

  return (
    <ColorModeToggle
      className={styles.themeToggle}
      buttonClassName={styles.button}
      value={colorMode}
      onChange={setColorMode}
    />
  );
}
