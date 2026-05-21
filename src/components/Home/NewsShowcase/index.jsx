import React from 'react';
import Translate from '@docusaurus/Translate';
import { usePluginData } from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';


const NewsShowcase = () => {
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig?.baseUrl || '/';
  const pluginData = usePluginData('docusaurus-news-generator');

  const resolveImg = (src) => {
    if (!src) return null;
    try {
      new URL(src);
      return src;
    } catch {}
    if (src.startsWith('/')) return baseUrl + src.slice(1);
    return baseUrl + src;
  };

  const now = Date.now();
  const newsData = (pluginData?.articles || [])
    .filter((item) => {
      const timestamp = Number(item?.date);
      return !Number.isFinite(timestamp) || timestamp <= now;
    })
    .slice(0, 3)
    .map((it) => ({
      title: it.title,
      description: it.summary,
      img: it.image,
      link: it.link,
    }));

  if (newsData.length === 0) {
    return null;
  }

  return (
    <div className="w-full font-sans">
      <div className="w-full gap-4 grid grid-cols-1 lg:grid-cols-3">
        {newsData.map((news, idx) => (
          <a
            key={idx}
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col overflow-hidden rounded-[0.625rem] border border-[rgba(230,230,230,1)] bg-white no-underline !text-[#1a1a1a] shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all"
          >
            <img
              src={resolveImg(news.img) || resolveImg('img/ruyi-logo-720.svg')}
              alt={news.title}
              className="block aspect-[3/2] w-full rounded-t-[0.625rem] border-0 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />

            <div className="flex flex-1 flex-col bg-white p-5">
              <h2 className="text-xl font-bold leading-tight text-[#1a1a1a]">
                <Translate>{news.title}</Translate>
              </h2>


              <div className="mt-auto flex justify-end pt-5">
                <div className="inline-flex items-center text-sm text-(--ifm-link-color) transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-(--ifm-link-hover-color)">
                  <Translate id="home.ruyiinlive.viewmore">查看更多</Translate>
                  <span className="ml-1">&gt;</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsShowcase;
