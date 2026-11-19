import React from 'react';
import {useColorMode, useThemeConfig} from '@docusaurus/theme-common';
import ColorModeToggle from '@theme/ColorModeToggle';
import styles from '@site/src/css/floating-buttons.module.css';

export default function FloatingColorModeToggle() {
  const {disableSwitch} = useThemeConfig().colorMode;
  const {colorMode, setColorMode} = useColorMode();

  if (disableSwitch) {
    return null;
  }

  return (
    <ColorModeToggle
      className={styles.themeToggle}
      buttonClassName={styles.button}
      value={colorMode}
      onChange={setColorMode}
    />
  );
}
