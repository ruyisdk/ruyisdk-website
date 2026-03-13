import React, { useEffect, useState } from 'react';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import axios from 'axios';


const NewsShowcase = () => {
  const { siteConfig, i18n } = useDocusaurusContext();
  const baseUrl = siteConfig?.baseUrl || '/';

  const [newsData, setNewsData] = useState([]);

  const resolveImg = (src) => {
    if (!src) return null;
    try {
      new URL(src);
      return src;
    } catch {}
    if (src.startsWith('/')) return baseUrl + src.slice(1);
    return baseUrl + src;
  };

  useEffect(() => {
    let isMounted = true;

    async function loadNews() {
      try {
        let newsUrl = '/news.json';
        if (i18n?.currentLocale && i18n.currentLocale !== i18n.defaultLocale) {
          newsUrl = `/${i18n.currentLocale}${newsUrl}`;
        }
        const res = await axios.get(newsUrl);
        const items = (res?.data?.articles || []).filter((item) => {
          const timestamp = Number(item?.date);
          const now = Date.now();
          return !Number.isFinite(timestamp) || timestamp <= now;
        });
        const selected = items.slice(0, 3).map((it) => ({
          title: it.title,
          description: it.summary,
          img: it.image,
          link: it.link,
        }));

        if (isMounted) {
          setNewsData(selected);
        }
      } catch {
        if (isMounted) {
          setNewsData([]);
        }
      }
    }

    loadNews();
    return () => { isMounted = false; };
  }, [i18n?.currentLocale, i18n?.defaultLocale]);

  if (newsData.length === 0) {
    return null;
  }

  return (
    <div className="newsshowcase-container w-full font-sans pt-4 md:-mt-8 pb-12 md:pb-16">
      <div className="hidden md:grid md:grid-cols-3 gap-4 w-full">
        {newsData.map((news, idx) => (
          <a
            key={idx}
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="newsshowcase-card group bg-white rounded-[0.625rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)] cursor-pointer transition-transform duration-300 hover:scale-[1.01] border border-[rgba(230,230,230,1)] no-underline !text-[#1a1a1a] flex flex-col"
          >
            <img
              src={resolveImg(news.img) || resolveImg('img/newsshowcase/1.png')}
              alt={news.title}
              className="newsshowcase-image w-full h-[13rem] object-cover transition-transform duration-300 group-hover:scale-[1.02] block border-0 rounded-t-[0.625rem]"
            />
            <div className="newsshowcase-content p-5 bg-white">
              <h2 className="newsshowcase-card-title text-[2rem] font-bold text-[#1a1a1a] leading-tight">
                <Translate>{news.title}</Translate>
              </h2>
            </div>
          </a>
        ))}
      </div>

      <div className="mobile-cards-wrapper flex flex-col gap-4 w-full md:hidden">
          {newsData.map((news, idx) => (
            <a
              key={idx}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-news-card group bg-white rounded-[0.625rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)] cursor-pointer transition-transform duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[rgba(230,230,230,1)] no-underline !text-[#1a1a1a]"
            >
              <img
                src={resolveImg(news.img) || resolveImg('img/newsshowcase/1.png')}
                alt={news.title}
                className="mobile-news-image w-full h-[12.5rem] object-cover transition-transform duration-300 group-hover:scale-[1.02] block border-0 rounded-t-[0.625rem]"
              />
              <div className="mobile-news-content p-4 bg-white flex flex-col relative">
                <h2 className="mobile-news-title text-2xl font-bold text-[#1a1a1a] mb-4 leading-tight"><Translate>{news.title}</Translate></h2>
                <p className="mobile-news-description text-sm text-[#333] leading-7 mb-4"><Translate>{news.description}</Translate></p>
                <div className="mobile-news-link-indicator inline-flex items-center text-[#0A2C7E] font-bold text-base bg-[#FDEFC3] px-4 py-2 rounded-full border border-[rgb(255,228,138)] gap-2 justify-center w-fit mx-auto">
                  <Translate>前往阅读</Translate>
                  <span className="newsshowcase-arrow">→</span>
                </div>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
};

export default NewsShowcase;