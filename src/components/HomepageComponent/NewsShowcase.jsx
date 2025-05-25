import React, { useState, useRef, useEffect } from 'react';

const NewsShowcase = () => {
  const newsData = [
    {
      title: "2025软件所公众科学日，PLCT实验室揭秘RISC-V\"小架构，大神通\"，科技魅力大放送！",
      description: "2025年软件所公众科学日上，PLCT实验室以\"小架构，大神通\"为主题，通过丰富互动展示全面揭秘RISC-V生态，点燃公众探索开源与软件未来的热情。",
      img: "img/newsshowcase/2025OpenDay.webp",
      link: "https://mp.weixin.qq.com/s/lXXLUuNh_aOBXEh3oXxECw"
    },
    {
      title: "2025 RISC-V欧洲峰会之巴黎游记",
      description: "在2025 RISC-V 欧洲峰会之余，两位中国学者于巴黎街头感受人情温暖与城市变迁，记录下一段科技与人文交织的别样旅程。",
      img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop",
      link: "https://mp.weixin.qq.com/s/n4do0LAlECR8mak_QW1Uyw"
    },
    {
      title: "靴子落地：riscv64 成为 Debian 官方支持架构，RISC-V 全球软件生态支持即将迎来一次巨大跃升",
      description: "RISC-V 架构正式成为 Debian 官方支持平台，标志着 RISC-V 软件生态进入主流、全球开源支持迈入新纪元。",
      img: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop",
      link: "https://mp.weixin.qq.com/s/G_cZU6t_MPoeDoYCwmGIqg"
    }
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mainRef = useRef(null);

  const handleNewsClick = (idx) => {
    setSelectedIndex(idx);
  };

  const handleCardClick = (link) => {
    window.open(link, '_blank');
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
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
        .newsshowcase-container { display: flex; overflow-x: auto; width: 100%; height: calc(600px + 32px); gap: 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 8px 32px 24px; background-color: #f5f5f7; }
        .newsshowcase-sidebar { width: 320px; height: 600px; overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none; display: flex; flex-direction: column; gap: 1rem; padding: 0rem 1rem 1rem 0; }
        .newsshowcase-sidebar::-webkit-scrollbar { display: none; }
        .newsshowcase-title-item { padding: 1rem 1.5rem; background: white; border-radius: 10px; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; font-size: 1rem; font-weight: 500; color: #1d1d1f; border: 1px solid rgba(230, 230, 230, 1); user-select: none; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); margin: 0; }
        .newsshowcase-title-item:hover { transform: scale(1.01); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15); }
        .newsshowcase-title-item.newsshowcase-active { background: #002677; color: #fff; box-shadow: none; transform: scale(1.01); }
        .newsshowcase-main { flex: 1; height: 600px; position: relative; overflow: hidden; }
        .cards-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; }
        .newsshowcase-card { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; width: 100%; height: 100%; display: flex; flex-direction: column; margin-bottom: 1rem; border: 1px solid rgba(230, 230, 230, 1); flex-shrink: 0; }
        .newsshowcase-card:hover { transform: scale(1.01); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15); }
        .newsshowcase-image { width: 100%; height: 350px; object-fit: cover; transition: transform 0.3s ease; }
        .newsshowcase-card:hover .newsshowcase-image { transform: scale(1.02); }
        .newsshowcase-content { padding: 2rem; background: white; flex: 1; display: flex; flex-direction: column; position: relative; }
        .newsshowcase-card-title { font-size: 2rem; font-weight: 700; color: #1a1a1a; margin-bottom: 1rem; line-height: 1.2; letter-spacing: -0.5px; }
        .newsshowcase-description { font-size: 1rem; color: #333; line-height: 1.6; flex: 1; }
        .newsshowcase-link-indicator { position: absolute; bottom: 1.5rem; right: 1.5rem; display: inline-flex; align-items: center; color: #0A2C7E; font-weight: bold; font-size: 1rem; opacity: 0; transform: translateX(10px); transition: all 0.3s ease; background: #FDEFC3; padding: 0.5rem 1rem; border-radius: 99rem; border: rgb(255, 228, 138); gap: 0.35rem; }
        .newsshowcase-card:hover .newsshowcase-link-indicator { opacity: 1; transform: translateX(0); }
        .newsshowcase-arrow { font-size: 1rem; }
        @media (max-width: 768px) {
          .newsshowcase-container { flex-direction: column; height: auto; padding: 1rem; }
          .newsshowcase-sidebar, .newsshowcase-main { display: none; }
          .accordion-item { margin-bottom: 1rem; border: 1px solid rgba(230, 230, 230, 1); border-radius: 10px; overflow: hidden; }
          .accordion-title { padding: 1rem; background: white; cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; }
          .accordion-title.active { background: #002677; color: #fff; }
          .accordion-content { max-height: 0; overflow: hidden; transition: max-height 0.5s ease; }
          .accordion-content.expanded { max-height: 1000px; }
          .accordion-content .newsshowcase-card { box-shadow: none; border: none; margin: 0; }
          .accordion-content .newsshowcase-image { height: 200px; }
          .accordion-content .newsshowcase-content { padding: 1rem; }
          .accordion-content .newsshowcase-link-indicator {
            position: static;
            opacity: 1;
            transform: none;
            margin-top: 1rem;
            justify-content: center;
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
                {news.title}
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
                  <img src={news.img} alt={news.title} className="newsshowcase-image" />
                  <div className="newsshowcase-content">
                    <h2 className="newsshowcase-card-title">{news.title}</h2>
                    <p className="newsshowcase-description">{news.description}</p>
                    <div className="newsshowcase-link-indicator">前往阅读<span className="newsshowcase-arrow">→</span></div>
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
                onClick={() => handleNewsClick(idx)}
              >
                <span>{news.title}</span>
                <span>{selectedIndex === idx ? '−' : '+'}</span>
              </div>
              <div className={`accordion-content ${selectedIndex === idx ? 'expanded' : ''}`}>
                <div className="newsshowcase-card" onClick={() => handleCardClick(news.link)}>
                  <img src={news.img} alt={news.title} className="newsshowcase-image" />
                  <div className="newsshowcase-content">
                    <h2 className="newsshowcase-card-title">{news.title}</h2>
                    <p className="newsshowcase-description">{news.description}</p>
                    <div className="newsshowcase-link-indicator">前往阅读<span className="newsshowcase-arrow">→</span></div>
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
