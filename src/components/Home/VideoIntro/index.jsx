import React from 'react';
import Translate from '@docusaurus/Translate';
import { IconArrowRight } from '@tabler/icons-react';

export default function VideoIntro() {
  return (
    <section className="mb-4 w-full overflow-hidden rounded-[0.75rem] bg-[linear-gradient(135deg,rgba(232,237,249,0.9),rgba(250,251,254,0.82))] shadow-[0_1rem_2.75rem_rgba(18,61,145,0.09)] backdrop-blur">
      <div className="grid items-center gap-0 lg:grid-cols-2">
        <div className="overflow-hidden bg-black">
          <video
            className="block aspect-video w-full bg-black object-cover"
            src="https://mirrors.iscas.ac.cn/ruyisdk/humans/events/cas-public-science-day-2026/hello-ruyisdk.mp4"
            controls
            preload="metadata"
            playsInline
          >
            <Translate id="home.videointro.unsupported">
              您的浏览器不支持 HTML5 视频播放。
            </Translate>
          </video>
        </div>

        <div className="flex flex-col items-start px-4 py-5 md:px-7 md:py-7 lg:px-10">
          <h2 className="mb-4 text-2xl font-bold leading-tight text-(--home-title-color) md:text-[1.85rem]">
            <Translate id="home.videointro.title">
              RuyiSDK亮相中科院软件所2026年“软件定义未来”公众科学日
            </Translate>
          </h2>
          <p className="mb-7 max-w-[36rem] text-[1rem] font-medium leading-7 text-(--home-subtitle-color) md:text-[1.08rem]">
            <Translate id="home.videointro.description">
              5月16日，中国科学院软件研究所2026年“软件定义未来”公众科学日将在北京中关村软件园区举行。作为RISC-V软件生态的重要建设者，RuyiSDK携完整工具链、操作系统及开发者资源亮相本届活动，与广大开发者、开源爱好者及高校师生展开技术交流。
            </Translate>
          </p>
          <a href="/news/events/202605-cas-public-science-day-2026" className="primary-button self-end">
            <Translate id="home.videointro.button">参加线下活动</Translate>
            &nbsp;
            <IconArrowRight size={18} stroke={2} />
          </a>
        </div>
      </div>
    </section>
  );
}
