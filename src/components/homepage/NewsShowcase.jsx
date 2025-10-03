import React, { useState, useRef, useEffect } from 'react';
import Translate, { translate } from '@docusaurus/Translate';

const NewsShowcase = () => {
  const newsData = [
    {
      title: "学以致用 虚位以待｜玄铁RV学院课程正式上线，玄铁与PLCT实验室邀您创\"芯\"未来",
      description: "玄铁携手 PLCT 实验室推出 RISC-V 系列课程，包含三大中级课程与两大高阶进阶课程。由专业讲师团队授课，涵盖 RISC-V 软件生态、编译器开发等领域。提供主流开发板实践机会，结业后可参与技术沙龙、Hackathon 比赛等活动，与行业专家交流，获得职业发展机会。",
      img: "img/newsshowcase/XuanTie.jpg",
      link: "https://mp.weixin.qq.com/s/1K17gWu_TZFfzkxgZGxL-Q"
    },
    {
      title: "PLCT实验室携香山南湖笔记本倾情参与BOSC世界RISC-V日",
      description: "2025年8月8日，World RISC-V Days 北京站在北京开源芯片研究院圆满举行。作为由RISC-V 国际基金会推出的首届世界 RISC-V 日盛典，此次活动汇集了来自各地的行业专家、企业代表与开发者分享洞见、交流合作，进一步推动 RISC-V 在中国及全球的广泛落地与持续创新。",
      img: "img/newsshowcase/xiangshan.jpg",
      link: "https://mp.weixin.qq.com/s/OW8OAXUPN-kWurjVjk2VsQ"
    },
    {
      title: "人物｜程龙灿：做RISC-V世界的 \"连接者\"",
      description: "程龙灿，PLCT实验室运营经理，从测试小队成员转型为社区运营专家。他带着对Linux的热爱和技术储备，致力于让RISC-V技术被更多人看见，推动社区有序发展。作为RISC-V世界的'连接者'，他搭建起技术与用户之间的桥梁，让开源生态的价值得到充分释放。",
      img: "img/newsshowcase/chenglongcan.png",
      link: "https://mp.weixin.qq.com/s/ufRXLP7Dl3mrkSU7IWaIrQ"
    },
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
    <div
          className="newsshowcase-container flex w-full h-auto md:h-[44rem] gap-4 font-sans mx-auto px-6 md:px-8 pt-2 pb-10 bg-[#f5f5f7] 2xl:max-w-[90rem] xl:rounded-[0.625rem] md:overflow-visible overflow-x-auto"
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
        <div className="mobile-cards-wrapper flex flex-col gap-4 px-4 w-full">
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
  );
};

export default NewsShowcase;