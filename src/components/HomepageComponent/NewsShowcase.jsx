import React, { useState, useRef, useEffect } from 'react';
import Translate, { translate } from '@docusaurus/Translate';

const NewsShowcase = () => {
  const newsData = [
    {
      title: "开源之夏合肥工业大学站，廖仕华分享成为一名GCC开发者的成长路径",
      description: "在分享中，廖仕华深入剖析了成为一名 GCC 开发者所需的关键技能和知识体系。他不仅对 GCC 这一重要的编译器工具的核心概念和编译流程进行了清晰的阐述，更结合自身的丰富经验，讲解了开发者需要掌握的编程基础、代码调试技巧。",
      img: "img/newsshowcase/OSPP.webp",
      link: "https://mp.weixin.qq.com/s/nnumLWZNUyn2XKjgEHYZBw"
    },
    {
      title: "2025软件所公众科学日，PLCT实验室揭秘RISC-V\"小架构，大神通\"，科技魅力大放送！",
      description: "与PLCT实验室一起，共同探寻软件科学的更多奥秘与可能！",
      img: "img/newsshowcase/2025OpenDay.webp",
      link: "https://mp.weixin.qq.com/s/lXXLUuNh_aOBXEh3oXxECw"
    },
    {
      title: "靴子落地：riscv64 成为 Debian 官方支持架构，RISC-V 全球软件生态支持即将迎来一次巨大跃升",
      description: "RISC-V 架构正式成为 Debian 官方支持平台，标志着 RISC-V 软件生态进入主流、全球开源支持迈入新纪元。",
      img: "img/newsshowcase/DebianRiscv.png",
      link: "https://mp.weixin.qq.com/s/G_cZU6t_MPoeDoYCwmGIqg"
    },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mainRef = useRef(null);

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
  };

  const handleCardClick = (link) => {
    window.open(link, '_blank');
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768); // 768px breakpoint
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && mainRef.current) {
      const wrapper = mainRef.current.querySelector('.cards-wrapper');
      wrapper.style.transition = 'transform 0.5s ease';
      wrapper.style.transform = `translateY(-${selectedIndex * 100}%)`;
    }
  }, [selectedIndex, isMobile]);

  return (
    <div className="newsshowcase-container">
      <style>{`
        .newsshowcase-container {
          display: flex;
          overflow-x: auto;
          width: 100%;
          height: calc(37.5rem + 2rem); /* 600px + 32px */
          gap: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          margin: 0;
          padding: 0.5rem 2rem 1.5rem; /* 8px 32px 24px */
          background-color: #f5f5f7;
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
          }
          .newsshowcase-sidebar, .newsshowcase-main {
            /* Sidebar and main content area are hidden on mobile, replaced by accordion */
            display: none;
          }
          /* Styles for accordion view on mobile */
          .accordion-wrapper { /* Added a wrapper for accordion items if needed, or apply to container */
            display: flex;
            flex-direction: column;
            gap: 1rem; /* Consistent gap for accordion items */
          }
          .accordion-item {
            margin-bottom: 1rem; /* This might be redundant if accordion-wrapper has gap */
            border: 0.0625rem solid rgba(230, 230, 230, 1); /* 1px */
            border-radius: 0.625rem; /* 10px */
            overflow: hidden;
            background: white; /* Added background to item for consistent look */
          }
          .accordion-title {
            padding: 1rem;
            background: white;
            cursor: pointer;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 500; /* Match sidebar item weight */
            color: #1d1d1f; /* Match sidebar item color */
          }
          .accordion-title.active {
            background: #002677;
            color: #fff;
          }
          .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease;
            background: white; /* Ensure content area has background */
          }
          .accordion-content.expanded {
            max-height: 62.5rem; /* 1000px, for ample space */
          }
          .accordion-content .newsshowcase-card {
            box-shadow: none;
            border: none;
            border-radius: 0; /* Remove radius if it's inside an already rounded item */
            margin: 0;
          }
          .accordion-content .newsshowcase-image {
            height: 12.5rem; /* 200px */
            border-radius: 0; /* No specific radius needed if card is not rounded */
          }
          .accordion-content .newsshowcase-content {
            padding: 1rem;
          }
          .accordion-content .newsshowcase-card-title {
            font-size: 1.5rem; /* Slightly smaller for accordion */
          }
          .accordion-content .newsshowcase-description {
            font-size: 0.875rem; /* Slightly smaller for accordion */
          }
          .accordion-content .newsshowcase-link-indicator {
            position: static; /* Displayed in flow */
            opacity: 1;
            transform: none;
            margin-top: 1rem;
            justify-content: center; /* Center the button */
            width: fit-content; /* Allow button to size to content */
            margin-left: auto;   /* Center align if needed */
            margin-right: auto;  /* Center align if needed */
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
                        {truncateText(news.description, 200, 100)}
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
        <div className="accordion-wrapper">
          {newsData.map((news, idx) => (
            <div key={idx} className="accordion-item">
              <div
                className={`accordion-title ${selectedIndex === idx ? 'active' : ''}`}
                onClick={() => {
                  setSelectedIndex(prevIndex => prevIndex === idx ? -1 : idx); // Allow toggle
                }}
              >
                <span><Translate>{news.title}</Translate></span>
                <span>{selectedIndex === idx ? '−' : '+'}</span>
              </div>
              <div className={`accordion-content ${selectedIndex === idx ? 'expanded' : ''}`}>
                <div className="newsshowcase-card" onClick={() => handleCardClick(news.link)}>
                  <img src={news.img} alt={translate({ message: news.title, id: `newsShowcase.news.${idx}.titleAltMobile`})} className="newsshowcase-image" />
                  <div className="newsshowcase-content">
                    {/* Titles and descriptions are already in the accordion title for brevity,
                        but can be repeated or summarized here if design prefers.
                        For this example, keeping the card content consistent.
                    */}
                    <h2 className="newsshowcase-card-title"><Translate>{news.title}</Translate></h2>
                    <p className="newsshowcase-description"><Translate>{news.description}</Translate></p>
                    <div className="newsshowcase-link-indicator">
                      <Translate>前往阅读</Translate>
                      <span className="newsshowcase-arrow">→</span>
                    </div>
                  </div>
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