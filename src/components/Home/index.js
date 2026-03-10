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

export default function Hero() {
  return (
    <div className="relative min-h-screen">
      <BackgroundAnimation />
      <div className="max-w-7xl mx-auto px-4 text-black" >
        <MainDisplay />
        <CardNews />
        <RuyiInLive />
        <NewsShowcase />
        <WeChatLink />
        {/*<DemoBoardsDisplay />*/}
      </div>
    </div>
  );
}
