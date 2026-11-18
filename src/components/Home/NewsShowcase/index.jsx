import React from 'react';
import Translate from '@docusaurus/Translate';
import { usePluginData } from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';


const NewsShowcase = () => {
  const { siteConfig } = useDocusaurusContext();
  const { withBaseUrl } = useBaseUrlUtils();
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
            href={withBaseUrl(news.link)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/85 bg-white no-underline !text-slate-900 shadow-[0_10px_28px_rgba(10,44,126,0.06)] transition-all hover:border-[#0A2C7E]/20 hover:shadow-[0_14px_34px_rgba(10,44,126,0.11)] dark:border-white/10 dark:bg-[#151b23] dark:!text-slate-100"
          >
            <img
              src={resolveImg(news.img) || resolveImg('img/downloads/ruyi-logo-720.svg')}
              alt={news.title}
              className="block aspect-[3/2] w-full rounded-t-xl border-0 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />

            <div className="flex flex-1 flex-col bg-white dark:bg-[#151b23] p-5">
              <h2 className="text-xl font-bold leading-tight text-slate-900 dark:text-slate-100">
                {news.title}
              </h2>


              <div className="mt-auto flex justify-end pt-5">
                <div className="inline-flex items-center text-sm font-medium text-(--ifm-link-color) transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-(--ifm-link-hover-color)">
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
