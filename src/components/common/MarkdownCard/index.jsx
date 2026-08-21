import React from "react";
import clsx from "clsx";

import styles from "./styles.module.css";

export default function MarkdownCard({
  as: Component = "section",
  children,
  className,
  variant = "default",
  ...rest
}) {
  return (
    <Component {...rest} className={clsx(styles.card, styles[variant], className)}>
      <div className={styles.markdown}>
        {children}
      </div>
    </Component>
  );
}
