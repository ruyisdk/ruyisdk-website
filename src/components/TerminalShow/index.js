import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";
import { Terminal } from "@xterm/xterm";

import React, { useEffect, useRef } from "react";

const TerminalShow = () => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal();
    terminal.open(terminalRef.current);
    // Customize further as needed
    return () => {
      terminal.dispose();
    };
  }, []);

  return <div ref={terminalRef} />;
};

export default TerminalShow;
