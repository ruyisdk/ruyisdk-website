/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";

import Logo from "../Logo";

import styles from "./styles.module.css";

import Translate, { translate } from "@docusaurus/Translate";

function CallToAction() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.background} />
      <div className={styles.container}>
        <Logo />
        <h1 className={styles.title}>
          <Translate id="actionwelcome">欢迎来到RuyiSDK 社区</Translate>
        </h1>
        <a href="contact" className={styles.primaryButton}>
          <Translate id="actionstart">现在开始</Translate>
        </a>
      </div>
    </div>
  );
}

export default CallToAction;
