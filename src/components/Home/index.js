/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import WeChatLink from "../common/WeChatLink";
import MainDisplay from "./MainDisplay";
import NewsShowcase from "./NewsShowcase";
import RuyiInLive from "./RuyiInLive";
import styles from "./styles.module.css";

function Hero() {
  return (
    <div className="homecontainer">
      <div
        className={styles.container}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <MainDisplay />
        <RuyiInLive />
        <NewsShowcase />
        <WeChatLink />
        {/*<DemoBoardsDisplay />*/}
      </div>
    </div>
  );
}

export default function Home() {
  return <Hero />;
}
