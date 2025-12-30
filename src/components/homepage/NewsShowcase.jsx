import React, { useState, useRef, useEffect } from 'react';
import Translate from '@docusaurus/Translate';
import SectionContainer from './SectionContainer';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'; // Added for baseUrl resolution
import axios from 'axios';

const NewsShowcase = () => {
  const { siteConfig, i18n } = useDocusaurusContext(); // Access global site config and i18n
  const baseUrl = siteConfig?.baseUrl || '/'; // Fallback to '/'

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoSwitchPaused, setIsAutoSwitchPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // items we display; empty until fetched
  const [newsData, setNewsData] = useState([]);
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

  // Resolve image path: keep absolute URLs, otherwise prefix with Docusaurus baseUrl
  const resolveImg = (src) => {
    if (!src) return null;
    try {
      // Absolute URL will succeed constructing URL
      // eslint-disable-next-line no-new
      new URL(src);
      return src;
    } catch {}
    // Not absolute: normalize leading slash and prefix baseUrl
    if (src.startsWith('/')) return baseUrl + src.slice(1);
    return baseUrl + src;
  };

  // Auto-switch news every 3 seconds, but only when component is visible and not on mobile
  useEffect(() => {
    if (!isVisible || isMobile || newsData.length < 2) return; // Don't start auto-switching until component is visible and not on mobile
    
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

  // Load /news.json to populate the showcase with latest articles
  useEffect(() => {
    let isMounted = true;
    async function loadNews() {
      try {
        // use the i18n from component scope
        let newsUrl = "/news.json";
        if (i18n?.currentLocale && i18n.currentLocale !== i18n.defaultLocale) {
          newsUrl = `/${i18n.currentLocale}${newsUrl}`;
        }
        const res = await axios.get(newsUrl);
        const items = (res?.data?.articles || []).filter((item) => {
          const timestamp = Number(item?.date);
          const now = Date.now();
          return !Number.isFinite(timestamp) || timestamp <= now;
        });
        // Already sorted descending by date in news-generator; use first 3
        const selected = items.slice(0, 3).map((it) => ({
          title: it.title,
          description: it.summary,
          img: it.image,
          link: it.link,
        }));
        if (isMounted) {
          setNewsData(selected);
          setSelectedIndex(0);
        }
      } catch (err) {
        if (isMounted) {
          // If nothing was fetched, display nothing.
          setNewsData([]);
          setSelectedIndex(0);
        }
      }
    }

    loadNews();
    return () => { isMounted = false; };
    // We intentionally don't add useDocusaurusContext to dep array because it is a hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n?.currentLocale, i18n?.defaultLocale]);

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

  if (newsData.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
    <div
          /* Unified container: restored negative top margin to reduce gap; removed inner horizontal padding to align width with other sections */
          className="newsshowcase-container -mt-6 flex w-full h-auto md:h-[44rem] gap-4 font-sans pt-2 pb-10 overflow-x-hidden md:overflow-visible"
      ref={containerRef}
    >

      {!isMobile && (
        <>
          <div
            /* Sidebar: widened to 25rem with negative margins and padding to allow shadows to render without clipping, while maintaining 23rem content width and alignment */
            className="newsshowcase-sidebar w-[25rem] min-w-[25rem] h-[42rem] md:h-[42rem] overflow-y-auto flex flex-col gap-4 pb-8 pt-6 px-4"
          >
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
          <div className="newsshowcase-main flex-1 h-[42rem] md:h-[42rem] relative overflow-hidden px-4" ref={mainRef}>
            <div className="cards-wrapper flex flex-col w-full h-full md:overflow-visible">
              {newsData.map((news, idx) => (
                <div key={idx} className="w-full h-full pb-8 pt-6 flex-shrink-0">
                  <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    /* Card: added isolate for stacking context, inner paddings from finetune */
                    className="newsshowcase-card group bg-white rounded-[0.625rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)] cursor-pointer transition-transform duration-300 transform hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] w-full h-full flex flex-col border border-[rgba(230,230,230,1)] flex-shrink-0 no-underline isolate"
                  >
                    <img
                      src={resolveImg(news.img) || resolveImg('img/newsshowcase/1.png')}
                      alt={news.title}
                      className="newsshowcase-image w-full h-[60%] max-h-[60%] object-cover transition-transform duration-300 group-hover:scale-[1.02] block border-0 rounded-t-[0.625rem]"
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
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {isMobile && (
  <div className="mobile-cards-wrapper flex flex-col gap-4 w-full">{/* Mobile: removed outer padding to align width */}
          {newsData.map((news, idx) => (
            <a
              key={idx}
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-news-card group bg-white rounded-[0.625rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)] cursor-pointer transition-transform duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[rgba(230,230,230,1)] no-underline"
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
      )}
    </div>
    </SectionContainer>
  );
};

export default NewsShowcase;