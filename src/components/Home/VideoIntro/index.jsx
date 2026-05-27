import React from 'react';
import Translate from '@docusaurus/Translate';

export default function VideoIntro() {
  return (
    <section className="mb-4 w-full overflow-hidden rounded-[0.75rem] bg-[linear-gradient(135deg,rgba(232,237,249,0.9),rgba(250,251,254,0.82))] shadow-[0_1rem_2.75rem_rgba(18,61,145,0.09)] backdrop-blur">
      <div className="grid items-center gap-0 lg:grid-cols-2">
        <div className="overflow-hidden bg-black">
          <video
            className="block aspect-video w-full bg-black object-cover"
            src="https://mirrors.iscas.ac.cn/ruyisdk/humans/events/cas-public-science-day-2026/hello-ruyisdk.mp4"
            poster="/img/news/events/202605_cas_public_science_day_2026/title.webp"
            controls
            autoPlay={false}
            muted
            defaultMuted
            preload="metadata"
            playsInline
          >
            <Translate id="home.videointro.unsupportedPrefix">
              您的浏览器不支持 HTML5 视频播放，请
            </Translate>
            <a href="https://mirrors.iscas.ac.cn/ruyisdk/humans/events/cas-public-science-day-2026/hello-ruyisdk.mp4">
              <Translate id="home.videointro.downloadVideo">下载视频</Translate>
            </a>
            <Translate id="home.videointro.unsupportedSuffix">
              观看。
            </Translate>
          </video>
        </div>

        <div className="flex flex-col items-start px-4 py-5 md:px-7 md:py-7 lg:px-10">
          <h2 className="mb-4 text-2xl font-bold leading-tight text-(--home-title-color) md:text-[1.85rem]">
            <Translate id="home.videointro.title">
              快速了解 RuyiSDK
            </Translate>
          </h2>
          <p className="mb-7 max-w-[36rem] text-[1rem] font-medium leading-7 text-(--home-subtitle-color) md:text-[1.08rem]">
            <Translate id="home.videointro.description">
              支持 RISC-V 本地开发与交叉开发的一体化集成开发环境，从工具链、模拟器、运行时环境到调试工具，一个视频带你了解为什么应该选择 RuyiSDK。
            </Translate>
          </p>
        </div>
      </div>
    </section>
  );
}
