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
import Partners from "./Partners";


function Hero() {
  return (
    <div className="relative min-h-screen">
      <BackgroundAnimation />

        <div className="max-w-7xl mx-auto flex flex-col px-4 py-8 gap-6 mt-4" >
          <MainDisplay />
          <CardNews />
          {/*<DemoBoardsDisplay />*/}
        </div>

        <div className="max-w-7xl mx-auto flex flex-col px-4 py-8 gap-6 border-t-2 border-black/5" >
          <RuyiInLive />
          <NewsShowcase />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col px-4 py-8 gap-6 mb-18 border-t-2 border-black/5">
          <Partners />
        </div>

    </div>
  );
}

export default Hero;
