/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import BackgroundAnimation from "./Background";
import MainDisplay from "./MainDisplay";
import WeChatLink from "../common/WeChatLink";
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
        <BackgroundAnimation />
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
