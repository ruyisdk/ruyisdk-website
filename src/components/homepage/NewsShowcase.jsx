import React, { useState, useRef, useEffect } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import SectionContainer from './SectionContainer';

const NewsShowcase = () => {
  const newsData = [
    {
      title: "学习+比赛+实习，一起安排! 机会难得，假期放松与学习两不误",
      description: "节日快乐！PLCT实验室与玄铁RV学院联合推出「RISC-V学习+实践指南」，助你假期提升技能。玄铁RISC-V学院提供免费系列课程，涵盖初、中、高三级学习路径，由资深专家授课。现同步开启“CIE-玄铁杯 RISC-V 应用创新比赛”，设硬件加速、服务器组件、智能硬件三大赛题，等你来挑战！学以致用，赢取佳绩，快来加入这场RISC-V学习盛宴吧！",
      img: "img/newsshowcase/1.png",
      link: "https://mp.weixin.qq.com/s/bQEtqcFE5r3njDBsAoKiUw"
    },
    {
      title: "openGauss RISC-V SIG深度参与openGauss Meetup成都站，探索开源数据库与RISC-V的融合与实践",
      description: "2025年9月27日，openGauss Meetup成都站成功举办。openGauss RISC-V SIG核心团队精彩亮相，分享了在RISC-V架构下的重要进展：实现了openGauss容器化部署方案，完成从5.1.0到7.0.0全量版的移植，性能提升显著。目前社区正积极推进技术优化与生态建设，并启动[甲辰计划]实习生招募，诚邀开发者加入，共同推动开源数据库在RISC-V生态的发展。加入我们，探索RISC-V未来！",
      img: "img/newsshowcase/2.png",
      link: "https://mp.weixin.qq.com/s/6BBBUjR-8d0pYgO2W9vLPg"
    },
    {
      title: "首届“合肥RISC-V开放日”在合肥工业大学顺利举行，生态成果喜人",
      description: "2025年9月24日，首届[合肥RISC-V开放日]在合肥工业大学成功举行。活动汇聚百余位专家学者，共同探讨RISC-V软硬件生态发展。红帽、PLCT实验室等机构专家分享了在操作系统、AI、教育等领域的创新实践，现场还设置了生态展区，展示openKylin、deepin等社区的最新成果。此次活动为产学研合作搭建了重要平台，有力推动了RISC-V生态的融合发展。",
      img: "img/newsshowcase/3.png",
      link: "https://mp.weixin.qq.com/s/BNRZfGiAbu8FPx8sjQeC5g"
    }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoSwitchPaused, setIsAutoSwitchPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mainRef = useRef(null);
  const containerRef = useRef(null);

  /**
   * Truncates text to a specified maximum length, avoiding word breaks.
   * It applies different length limits for Chinese Hanzi and other scripts.
   * @param {string} text The text to truncate.
   * @param {number} charLimit The character limit for non-Hanzi text.
   * @param {number} hanziLimit The character limit for Hanzi text.
   * @returns {string} The truncated text with an ellipsis, or the original text.
   */
  const truncateText = (text, charLimit, hanziLimit) => {
    const hasHanzi = /[\u4e00-\u9fa5]/.test(text);
    const limit = hasHanzi ? hanziLimit : charLimit;

    if (text.length <= limit) {
      return text;
    }

    let truncated = text.substring(0, limit);

    if (!hasHanzi) {
      // Avoid breaking a word in the middle for non-Hanzi text
      const lastSpaceIndex = truncated.lastIndexOf(' ');
      if (lastSpaceIndex !== -1) {
        truncated = truncated.substring(0, lastSpaceIndex);
      }
    }
    
    return truncated + '...';
  };

  const handleNewsClick = (idx) => {
    setSelectedIndex(idx);
    setIsAutoSwitchPaused(true);
    
    // Resume auto-switching after 10 seconds of user inactivity
    setTimeout(() => {
      setIsAutoSwitchPaused(false);
    }, 10000);
  };

  const handleCardClick = (link) => {
    window.open(link, '_blank');
  };

  // Auto-switch news every 3 seconds, but only when component is visible and not on mobile
  useEffect(() => {
    if (!isVisible || isMobile) return; // Don't start auto-switching until component is visible and not on mobile
    
    const interval = setInterval(() => {
      if (!isAutoSwitchPaused) {
        setSelectedIndex((prevIndex) => {
          // Handle mobile accordion mode where selectedIndex might be -1
          const currentIndex = prevIndex === -1 ? 0 : prevIndex;
          return (currentIndex + 1) % newsData.length;
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [newsData.length, isAutoSwitchPaused, isVisible, isMobile]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768); // 768px breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer to detect when component is visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
        rootMargin: '0px 0px -100px 0px' // Start a bit before the component comes into view
      }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobile && mainRef.current) {
      const wrapper = mainRef.current.querySelector('.cards-wrapper');
      wrapper.style.transition = 'transform 0.5s ease';
      wrapper.style.transform = `translateY(-${selectedIndex * 100}%)`;
    }
  }, [selectedIndex, isMobile]);

  return (
    <SectionContainer>
    <div
          className="newsshowcase-container flex w-full h-auto md:h-[44rem] gap-4 font-sans pt-2 pb-10 md:overflow-visible overflow-x-auto"
      ref={containerRef}
    >

      {!isMobile && (
        <>
          <div className="newsshowcase-sidebar w-[20rem] min-w-[20rem] h-[42rem] md:h-[42rem] overflow-y-auto flex flex-col gap-4 pr-4">
            {newsData.map((news, idx) => (
              <div
                key={idx}
                className={`newsshowcase-title-item px-4 py-4 rounded-[0.625rem] cursor-pointer transition-transform duration-300 text-base font-medium border border-[rgba(230,230,230,1)] select-none shadow-[0_8px_30px_rgba(0,0,0,0.1)] m-0 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] ${
                  selectedIndex === idx
                    ? 'newsshowcase-active bg-[#002677] text-white shadow-none scale-[1.01]'
                    : 'bg-white text-[#1d1d1f]'
                }`}
                onClick={() => handleNewsClick(idx)}
              >
                <Translate>{news.title}</Translate>
              </div>
            ))}
          </div>
          <div className="newsshowcase-main flex-1 h-[42rem] md:h-[42rem] relative overflow-hidden" ref={mainRef}>
            <div className="cards-wrapper flex flex-col w-full h-full md:overflow-visible">
              {newsData.map((news, idx) => (
                <div
                  key={idx}
                  className="newsshowcase-card group bg-white rounded-[0.625rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)] cursor-pointer transition-transform duration-300 transform hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] w-full h-full flex flex-col border border-[rgba(230,230,230,1)] flex-shrink-0"
                  onClick={() => handleCardClick(news.link)}
                >
                  <img
                    src={news.img}
                    alt={translate({ message: news.title, id: `newsShowcase.news.${idx}.titleAlt` })}
                    className="newsshowcase-image w-full h-[60%] max-h-[60%] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="newsshowcase-content p-8 bg-white flex-1 flex flex-col relative">
                    <h2 className="newsshowcase-card-title text-2xl font-bold text-[#1a1a1a] mb-4 leading-tight tracking-tight"><Translate>{news.title}</Translate></h2>
                    <p className="newsshowcase-description text-base text-[#333] leading-7 flex-1">
                      <Translate>{news.description}</Translate>
                    </p>
                    <div className="newsshowcase-link-indicator absolute bottom-6 right-6 inline-flex items-center text-[#0A2C7E] font-bold text-base opacity-0 translate-x-2.5 transition-all duration-300 bg-[#FDEFC3] px-4 py-2 rounded-full border border-[rgb(255,228,138)] gap-2 group-hover:opacity-100 group-hover:translate-x-0">
                      <Translate>前往阅读</Translate>
                      <span className="newsshowcase-arrow">→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {isMobile && (
  <div className="mobile-cards-wrapper flex flex-col gap-4 w-full">
          {newsData.map((news, idx) => (
            <div
              key={idx}
              className="mobile-news-card group bg-white rounded-[0.625rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)] cursor-pointer transition-transform duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[rgba(230,230,230,1)]"
              onClick={() => handleCardClick(news.link)}
            >
              <img
                src={news.img}
                alt={translate({ message: news.title, id: `newsShowcase.news.${idx}.titleAltMobile` })}
                className="mobile-news-image w-full h-[12.5rem] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="mobile-news-content p-4 bg-white flex flex-col relative">
                <h2 className="mobile-news-title text-2xl font-bold text-[#1a1a1a] mb-4 leading-tight"><Translate>{news.title}</Translate></h2>
                <p className="mobile-news-description text-sm text-[#333] leading-7 mb-4"><Translate>{news.description}</Translate></p>
                <div className="mobile-news-link-indicator inline-flex items-center text-[#0A2C7E] font-bold text-base bg-[#FDEFC3] px-4 py-2 rounded-full border border-[rgb(255,228,138)] gap-2 justify-center w-fit mx-auto">
                  <Translate>前往阅读</Translate>
                  <span className="newsshowcase-arrow">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </SectionContainer>
  );
};

export default NewsShowcase;