/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import BackgroundAnimation from "./Background";
import SectionContainer from "./common/SectionContainer";
import MainDisplay from "./MainDisplay";
import NewsShowcase from "./NewsShowcase";
import RuyiInLive from "./RuyiInLive";
import CardNews from './CardNews';
import Partners from "./Partners";
import VideoIntro from "./VideoIntro";
import DevBoards from "./DevBoards";


function Hero() {
  return (
    <div className="relative min-h-screen">
      <BackgroundAnimation />

        <SectionContainer className="mt-4">
          <MainDisplay />
          <VideoIntro />
          <CardNews />
          {/*<DemoBoardsDisplay />*/}
        </SectionContainer>

        <SectionContainer className="border-t-2 border-black/5">
          <DevBoards />
        </SectionContainer>

        <SectionContainer className="border-t-2 border-black/5">
          <RuyiInLive />
          <NewsShowcase />
        </SectionContainer>

        <SectionContainer className="border-t-2 border-black/5 mb-18">
          <Partners />
        </SectionContainer>

    </div>
  );
}

export default Hero;
