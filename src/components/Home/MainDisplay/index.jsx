
import React from "react";
import { IconCode, IconBrandGithub } from '@tabler/icons-react';
import Translate from '@docusaurus/Translate';

import Terminal from './Terminal';

const MainDisplay = () => {

  return (
    <div className="py-16 font-sans w-full relative overflow-hidden flex flex-col">

      {/* Main page content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-8 box-border">

        <div className="flex w-full flex-col items-center justify-between gap-10 lg:flex-row lg:items-center lg:gap-12">

          <div className="flex min-w-0 flex-1 flex-col items-center text-center lg:max-w-[680px] lg:items-start lg:text-left lg:ml-16">
            <h1
              className="leading-[1.05] font-bold mb-6 tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2.94rem, 3.92vw, 3.5rem)', color: 'var(--home-title-color)' }}
            >
              <Translate id="home.ruyisdk">RuyiSDK</Translate>
            </h1>
            <p className="text-[clamp(0.98rem,1.47vw,1.4rem)] text-[#515154] mb-10 leading-[1.35] lg:max-w-[40ch] max-w-none">
              <Translate id="home.description">面向 RISC-V 架构的一体化集成开发环境</Translate>
            </p>

            <div className="flex flex-wrap gap-4 justify-start">
              <a href="/docs/intro" className="primary-button">
                <IconCode size={18} stroke={2} />&nbsp;
                <Translate id="home.maindisplay.getstarted">现在开始</Translate>
              </a>
              <a href="https://github.com/ruyisdk" className="secondary-button">
                <IconBrandGithub size={18} stroke={2} />&nbsp;
                <Translate id="home.maindisplay.source">源码库</Translate>
              </a>
            </div>
          </div>

          {/* Terminal component on the right */}
          <div className="relative w-full max-w-[600px] h-[420px] flex-shrink-0 lg:w-[600px]">
            <Terminal />
          </div>

        </div>

      </div>

      {/* The CardNews component remains outside the main scaling container */}
    </div>
  );
};

export default MainDisplay;
