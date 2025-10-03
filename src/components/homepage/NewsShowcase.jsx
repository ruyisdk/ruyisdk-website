import React, { useState, useRef, useEffect } from 'react';
import Translate, { translate } from '@docusaurus/Translate';

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
    <div className="newsshowcase-container" ref={containerRef}>
      <style>{`
        .newsshowcase-container {
          display: flex;
          overflow-x: auto;
          width: 100%;
          height: calc(37.5rem + 2rem); /* 600px + 32px */
          gap: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          margin: 0 auto; /* Added for centering */
          padding: 0.5rem 2rem 1.5rem; /* 8px 32px 24px */
          background-color: #f5f5f7;
        }

        /* New media query for very wide screens */
        @media (min-width: 90rem) { /* 1440px or adjust as needed */
          .newsshowcase-container {
            max-width: 90rem; /* For example, 1440px */
            border-radius: 0.625rem; /* 10px - Optional: to make it look like a contained block */
            box-shadow: 0 0.5rem 1.875rem rgba(255, 255, 255, 0); /* Optional: subtle shadow */
          }
        }

        .newsshowcase-sidebar {
          width: 20rem; /* 320px */
          height: 37.5rem; /* 600px */
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 0rem 1rem 1rem 0;
        }
        .newsshowcase-sidebar::-webkit-scrollbar {
          display: none;
        }
        .newsshowcase-title-item {
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 0.625rem; /* 10px */
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          font-size: 1rem;
          font-weight: 500;
          color: #1d1d1f;
          border: 0.0625rem solid rgba(230, 230, 230, 1); /* 1px */
          user-select: none;
          box-shadow: 0 0.5rem 1.875rem rgba(0, 0, 0, 0.1); /* 0 8px 30px */
          margin: 0;
        }
        .newsshowcase-title-item:hover {
          transform: scale(1.01);
          box-shadow: 0 0.75rem 2.5rem rgba(0, 0, 0, 0.15); /* 0 12px 40px */
        }
        .newsshowcase-title-item.newsshowcase-active {
          background: #002677;
          color: #fff;
          box-shadow: none;
          transform: scale(1.01);
        }
        .newsshowcase-main {
          flex: 1;
          height: 37.5rem; /* 600px */
          position: relative;
          overflow: hidden;
        }
        .cards-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
        }
        .newsshowcase-card {
          background: white;
          border-radius: 0.625rem; /* 10px */
          overflow: hidden;
          box-shadow: 0 0.5rem 1.875rem rgba(0, 0, 0, 0.1); /* 0 8px 30px */
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 0.0625rem solid rgba(230, 230, 230, 1); /* 1px */
          flex-shrink: 0;
        }
        .newsshowcase-card:hover {
          transform: scale(1.01);
          box-shadow: 0 0.75rem 2.5rem rgba(0, 0, 0, 0.15); /* 0 12px 40px */
        }
        .newsshowcase-image {
          width: 100%;
          height: 60%;
          max-height: 60%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .newsshowcase-card:hover .newsshowcase-image {
          transform: scale(1.02);
        }
        .newsshowcase-content {
          padding: 2rem;
          background: white;
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .newsshowcase-card-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
          line-height: 1.2;
          letter-spacing: -0.03125rem; /* -0.5px */
        }
        .newsshowcase-description {
          font-size: 1rem;
          color: #333;
          line-height: 1.6;
          flex: 1;
        }
        .newsshowcase-link-indicator {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          display: inline-flex;
          align-items: center;
          color: #0A2C7E;
          font-weight: bold;
          font-size: 1rem;
          opacity: 0;
          transform: translateX(0.625rem); /* 10px */
          transition: all 0.3s ease;
          background: #FDEFC3;
          padding: 0.5rem 1rem;
          border-radius: 99rem;
          border: 0.0625rem solid rgb(255, 228, 138); /* Assuming 1px solid */
          gap: 0.5rem; /* Adjusted for consistency */
        }
        .newsshowcase-card:hover .newsshowcase-link-indicator {
          opacity: 1;
          transform: translateX(0);
        }
        .newsshowcase-arrow {
          font-size: 1rem;
        }
        @media (max-width: 48rem) { /* 768px */
          .newsshowcase-container {
            flex-direction: column;
            height: auto;
            padding: 1rem;
            max-width: 100%; /* Ensure it uses full width on mobile */
          }
          .newsshowcase-sidebar, .newsshowcase-main {
            display: none;
          }
          .mobile-cards-wrapper {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .mobile-news-card {
            background: white;
            border-radius: 0.625rem;
            overflow: hidden;
            box-shadow: 0 0.5rem 1.875rem rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 0.0625rem solid rgba(230, 230, 230, 1);
          }
          .mobile-news-card:hover {
            transform: scale(1.01);
            box-shadow: 0 0.75rem 2.5rem rgba(0, 0, 0, 0.15);
          }
          .mobile-news-image {
            width: 100%;
            height: 12.5rem; /* 200px */
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          .mobile-news-card:hover .mobile-news-image {
            transform: scale(1.02);
          }
          .mobile-news-content {
            padding: 1rem;
            background: white;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .mobile-news-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 1rem;
            line-height: 1.2;
          }
          .mobile-news-description {
            font-size: 0.875rem;
            color: #333;
            line-height: 1.6;
            margin-bottom: 1rem;
          }
          .mobile-news-link-indicator {
            display: inline-flex;
            align-items: center;
            color: #0A2C7E;
            font-weight: bold;
            font-size: 1rem;
            background: #FDEFC3;
            padding: 0.5rem 1rem;
            border-radius: 99rem;
            border: 0.0625rem solid rgb(255, 228, 138);
            gap: 0.5rem;
            justify-content: center;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>

      {!isMobile && (
        <>
          <div className="newsshowcase-sidebar">
            {newsData.map((news, idx) => (
              <div
                key={idx}
                className={`newsshowcase-title-item ${selectedIndex === idx ? 'newsshowcase-active' : ''}`}
                onClick={() => handleNewsClick(idx)}
              >
                <Translate>{news.title}</Translate>
              </div>
            ))}
          </div>
          <div className="newsshowcase-main" ref={mainRef}>
            <div className="cards-wrapper">
              {newsData.map((news, idx) => (
                <div
                  key={idx}
                  className="newsshowcase-card"
                  onClick={() => handleCardClick(news.link)}
                >
                  <img src={news.img} alt={translate({ message: news.title, id: `newsShowcase.news.${idx}.titleAlt`})} className="newsshowcase-image" />
                  <div className="newsshowcase-content">
                    <h2 className="newsshowcase-card-title"><Translate>{news.title}</Translate></h2>
                    <p className="newsshowcase-description">
                      <Translate>
                        {news.description}
                      </Translate>
                    </p>
                    <div className="newsshowcase-link-indicator">
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
        <div className="mobile-cards-wrapper">
          {newsData.map((news, idx) => (
            <div
              key={idx}
              className="mobile-news-card"
              onClick={() => handleCardClick(news.link)}
            >
              <img src={news.img} alt={translate({ message: news.title, id: `newsShowcase.news.${idx}.titleAltMobile`})} className="mobile-news-image" />
              <div className="mobile-news-content">
                <h2 className="mobile-news-title"><Translate>{news.title}</Translate></h2>
                <p className="mobile-news-description"><Translate>{news.description}</Translate></p>
                <div className="mobile-news-link-indicator">
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