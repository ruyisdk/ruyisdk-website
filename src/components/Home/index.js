/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import clsx from "clsx";

import BackgroundAnimation from "./Background";
import MainDisplay from "./MainDisplay";
import WeChatLink from "../common/WeChatLink";
import NewsShowcase from "./NewsShowcase";
import RuyiInLive from "./RuyiInLive";
import CardNews from './CardNews';


function Hero() {
  return (
    <div className="relative min-h-screen">
      <BackgroundAnimation />

      <section className="py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4" >
          <MainDisplay />
          <CardNews />
          {/*<DemoBoardsDisplay />*/}
        </div>
      </section>

      <section className="py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 border-t-2 border-black/5" >
          <RuyiInLive />
          <NewsShowcase />
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <WeChatLink />
        </div>
      </section>

    </div>
  );
}

export default Hero;
