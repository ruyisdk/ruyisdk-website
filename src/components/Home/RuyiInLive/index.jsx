import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { IconLink, IconLogin2 } from '@tabler/icons-react';

import Translate from '@docusaurus/Translate';

const TAG_STEP_MS = 2000;

const TAG_SLOT_STYLE = {
  '-1': { left: '-12%', scale: 0.52, opacity: 0, zIndex: 0, y: 20, blur: 6 },
  '0': { left: '20%', scale: 0.8, opacity: 0.75, zIndex: 2, y: 16, blur: 2.8 },
  '1': { left: '34%', scale: 1, opacity: 1, zIndex: 6, y: 8, blur: 0 },
  '2': { left: '48%', scale: 0.8, opacity: 0.9, zIndex: 5, y: 6, blur: 0.6 },
  '3': { left: '62%', scale: 0.7, opacity: 0.84, zIndex: 4, y: 8, blur: 1.2 },
  '4': { left: '76%', scale: 0.6, opacity: 0.72, zIndex: 3, y: 12, blur: 1.8 },
  '5': { left: '90%', scale: 0.52, opacity: 0.55, zIndex: 2, y: 16, blur: 2.4 },
  '6': { left: '108%', scale: 0.4, opacity: 0, zIndex: 1, y: 22, blur: 5 },
};

function resolveTagSlot(relativeIndex, total) {
  if (relativeIndex === total - 1) {
    return -1;
  }
  if (relativeIndex >= 0 && relativeIndex <= 6) {
    return relativeIndex;
  }
  return null;
}

function normalizeTag(rawTag, index) {
  const fallbackId = `tag-${index}`;
  const id = String(rawTag?.id ?? rawTag?.slug ?? rawTag?.name ?? fallbackId);
  const label = String(rawTag?.name ?? rawTag?.label ?? rawTag?.slug ?? id);
  const url = rawTag?.href ?? rawTag?.url ?? `https://ruyisdk.cn/tag/${rawTag?.slug ?? label}/${rawTag?.id ?? index}`;
  const numericCount = Number(rawTag?.count ?? rawTag?.posts ?? 0);

  return {
    id,
    label,
    url,
    count: Number.isFinite(numericCount) ? numericCount : 0,
  };
}

const RuyiInLive = () => {
  const [data, setData] = useState(null);
  const [hotTags, setHotTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [hoveredTop, setHoveredTop] = useState(null);
  const [highlightStyle, setHighlightStyle] = useState({ left: '0px', width: '0px', height: '100%' });
  const selectorButtonRefs = useRef([]);


  const topCategories = useMemo(
    () => [
      { id: 'study', label: '学习', url: 'https://ruyisdk.cn/c/learn/15', gradient: 'from-cyan-400 to-emerald-400' },
      { id: 'news', label: '新闻', url: 'https://ruyisdk.cn/c/news/12', gradient: 'from-fuchsia-500 to-pink-500' },
      { id: 'jobs', label: '招聘', url: 'https://ruyisdk.cn/c/jobs/18', gradient: 'from-orange-400 to-rose-500' },
    ],
    [],
  );

  const activeTop = hoveredTop ?? topCategories[0]?.id;

  const updateHighlight = () => {
    const activeIndex = topCategories.findIndex((category) => category.id === activeTop);
    const button = selectorButtonRefs.current[activeIndex];
    if (button && button.parentElement) {
      const wrapperRect = button.parentElement.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const isVerticalLayout = window.matchMedia('(max-width: 1023px)').matches;
      const horizontalPadding = 8;

      if (isVerticalLayout) {
        setHighlightStyle({
          top: `${buttonRect.top - wrapperRect.top}px`,
          left: `${buttonRect.left - wrapperRect.left + horizontalPadding}px`,
          width: `${buttonRect.width - horizontalPadding * 2}px`,
          height: `${buttonRect.height}px`,
          transform: 'none',
        });
      } else {
        setHighlightStyle({
          left: `${buttonRect.left - wrapperRect.left}px`,
          width: `${buttonRect.width}px`,
          height: `${buttonRect.height}px`,
        });
      }
    }
  };

  useLayoutEffect(() => {
    updateHighlight();
  }, [activeTop, topCategories]);

  useEffect(() => {
    window.addEventListener('resize', updateHighlight);
    return () => {
      window.removeEventListener('resize', updateHighlight);
    };
  }, [activeTop, topCategories]);

  useEffect(() => {
    const controller = new AbortController();

    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        setData({
          topics_30_days: 66,
          posts_30_days: 121,
          active_users_30_days: 60,
        });
        setLoading(false);
      }, 0);

      return () => {
        controller.abort();
      };
    }

    fetch('https://ruyisdk.cn/site/statistics.json', {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        setData(payload);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch community statistics:', err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    fetch('/data/api/api_ruyisdk_cn/tags_hot.json', {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        const tags = Array.isArray(payload?.data) ? payload.data : [];
        setHotTags(tags);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch hot tags:', err);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const visibleTags = hotTags.filter((tag) => {
    const numericCount = Number(tag?.count ?? tag?.posts ?? 0);
    return Number.isFinite(numericCount) && numericCount > 2;
  });

  const normalizedTags = useMemo(() => {
    return visibleTags.map((tag, index) => normalizeTag(tag, index));
  }, [visibleTags]);

  const carouselSource = useMemo(() => {
    if (normalizedTags.length === 0) {
      return [];
    }
    if (normalizedTags.length >= 8) {
      return normalizedTags.map((tag, index) => ({
        ...tag,
        uid: `${tag.id}-${index}`,
      }));
    }

    const expanded = [];
    for (let index = 0; index < 8; index += 1) {
      const tag = normalizedTags[index % normalizedTags.length];
      expanded.push({
        ...tag,
        uid: `${tag.id}-loop-${index}`,
      });
    }
    return expanded;
  }, [normalizedTags]);

  useEffect(() => {
    setActiveTagIndex(0);
  }, [carouselSource.length]);

  useEffect(() => {
    if (carouselSource.length <= 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveTagIndex((previous) => (previous + 1) % carouselSource.length);
    }, TAG_STEP_MS);

    return () => {
      clearInterval(timer);
    };
  }, [carouselSource.length]);

  const carouselTags = useMemo(() => {
    const total = carouselSource.length;
    if (total === 0) {
      return [];
    }

    return carouselSource
      .map((tag, index) => {
        const relativeIndex = (index - activeTagIndex + total) % total;
        const slot = resolveTagSlot(relativeIndex, total);
        if (slot === null) {
          return null;
        }

        const slotStyle = TAG_SLOT_STYLE[String(slot)];
        return {
          ...tag,
          slot,
          slotStyle,
        };
      })
      .filter(Boolean);
  }, [activeTagIndex, carouselSource]);

  const activityStats = useMemo(
    () => [
      {
        key: 'active_users_30_days',
        value: data?.active_users_30_days,
        labelId: 'home.ruyiinlive.metric.active_users_30_days',
        defaultLabel: '30天活跃用户',
      },
      {
        key: 'posts_30_days',
        value: data?.posts_30_days,
        labelId: 'home.ruyiinlive.metric.posts_30_days',
        defaultLabel: '30天发帖数',
      },
      {
        key: 'topics_30_days',
        value: data?.topics_30_days,
        labelId: 'home.ruyiinlive.metric.topics_30_days',
        defaultLabel: '30天新话题',
      },
    ],
    [data],
  );

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="w-full mx-auto flex flex-col lg:flex-row h-auto lg:h-[17.5rem] rounded-[0.75rem] overflow-hidden text-[#002677] shadow-[0_24px_80px_rgba(0,0,0,0.18)] ruyi-liquid-surface">
          <div className="ruyi-surface-overlay" aria-hidden="true" />
          <div className="w-full lg:w-2/7 p-5 md:p-8 flex flex-col justify-center relative z-10">
            <div className="relative z-10 w-full lg:max-w-[22.5rem]">
              <h1 className="text-xl md:text-[1.45rem] font-bold mb-1 leading-tight">
                <Translate id="home.ruyiinlive.community">RuyiSDK 社区</Translate>
              </h1>
              <p className="whitespace-pre-line text-xs md:text-[0.78rem] mb-4 font-medium opacity-90 max-w-[24rem]">
                <Translate id="home.ruyiinlive.community.subtitle">RuyiSDK 开发者社区现已开启</Translate>
              </p>

              <div className="flex flex-nowrap gap-2.5">
                <a
                  href="https://ruyisdk.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tertiary-button items-center justify-center rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap"
                >
                  <IconLink size={18} stroke={2} color="#002677" />&nbsp;
                  <Translate id="home.ruyiinlive.seecommunity">随便逛逛</Translate>
                </a>

                <a
                  href="https://ruyisdk.cn/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button items-center justify-center rounded-full px-3.5 py-2 text-sm font-semibold whitespace-nowrap"
                >
                  <IconLogin2 size={18} stroke={2} color="#002677" />&nbsp;
                  <Translate id="home.ruyiinlive.joincommunity">现在加入</Translate>
                </a>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-5/7 px-3 py-4 md:px-5 md:py-5 overflow-x-hidden overflow-y-visible relative z-10 lg:h-full">
            <div className="flex h-full min-h-0 flex-col gap-3 md:gap-4 lg:grid lg:grid-rows-[minmax(0,2fr)_minmax(0,5fr)] lg:gap-3">
              <div className="relative z-20 ruyi-top-panel flex flex-col gap-2.5 pb-1 md:gap-3 lg:h-full lg:min-h-0 lg:flex-row lg:items-center lg:overflow-visible">
                <div
                  className="ruyi-selector-wrapper flex flex-1 items-center lg:h-full lg:min-h-0"
                  onMouseLeave={() => setHoveredTop(null)}
                >
                  <div
                    className="ruyi-selector-highlight absolute rounded-[0.75rem]"
                    style={highlightStyle}
                  />
                  {topCategories.map((category, index) => (
                    <a
                      key={category.id}
                      ref={(el) => {
                        selectorButtonRefs.current[index] = el;
                      }}
                      href={category.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setHoveredTop(category.id)}
                      onFocus={() => setHoveredTop(category.id)}
                      className={`ruyi-selector-item relative inline-flex h-[2.52rem] items-center justify-center px-3.5 text-[clamp(1.08rem,1.44vw,1.52rem)] font-bold transition duration-300 lg:h-full ${activeTop === category.id ? 'ruyi-selector-item-active' : ''}`}
                    >
                      <span className="relative z-10">{category.label}</span>
                    </a>
                  ))}
                </div>

                <div className="ruyi-stat-container lg:h-full lg:w-[11.2rem] lg:min-w-[11.2rem]">
                  {activityStats.map((stat, index) => (
                    <div
                      key={stat.key}
                      className={`ruyi-stat-row ${index < activityStats.length - 1 ? 'border-b border-[#002677]/15' : ''}`}
                    >
                      <div className="truncate text-[0.68rem] text-[#002677]/80">
                        <Translate id={stat.labelId}>{stat.defaultLabel}</Translate>
                      </div>
                      <div className="ml-2.5 max-w-[6rem] shrink-0 truncate text-right text-[1.05rem] font-semibold leading-none text-[#002677]">
                        {loading ? <span className="inline-block h-4 w-11 rounded bg-[#002677]/20 animate-pulse" /> : valueToString(stat.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ruyi-tag-stage relative z-10 min-h-[6.72rem] lg:h-full lg:min-h-0" aria-live="polite">
                {carouselTags.map((tag) => (
                  <a
                    key={tag.uid}
                    href={tag.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ruyi-glass-tag"
                    data-slot={tag.slot}
                    style={{
                      left: tag.slotStyle.left,
                      opacity: tag.slotStyle.opacity,
                      zIndex: tag.slotStyle.zIndex,
                      transform: `translate(-50%, calc(-50% + ${tag.slotStyle.y}px)) scale(${tag.slotStyle.scale})`,
                      filter: `blur(${tag.slotStyle.blur}px)`,
                      pointerEvents: tag.slot >= 0 && tag.slot <= 5 ? 'auto' : 'none',
                    }}
                  >
                    <span className="block truncate text-[1.12rem] font-medium text-[#002677]/80">{tag.label}</span>
                    <span className="mt-1 block text-[0.8rem] font-semibold tracking-tight text-[#041941]/50">
                      {tag.count.toLocaleString()} 帖子
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ruyi-liquid-surface {
          position: relative;
          isolation: isolate;
          background: radial-gradient(circle at 14% 16%, hsla(36, 95%, 50%, 0.62), transparent 24%),
            radial-gradient(circle at 88% 22%, rgba(255, 255, 255, 0.18), transparent 20%),
            linear-gradient(132deg, rgba(0, 38, 119, 0.96) 0%, rgba(21, 76, 182, 0.9) 52%, rgba(0, 38, 119, 0.97) 100%);
          background-size: 140% 140%;
          animation: ruyi-surface-breathe 30s ease-in-out infinite;
        }

        .ruyi-liquid-surface::before,
        .ruyi-liquid-surface::after {
          content: '';
          position: absolute;
          inset: -18%;
          border-radius: 36%;
          pointer-events: none;
          z-index: 0;
        }

        .ruyi-liquid-surface::before {
          background: radial-gradient(circle at 24% 42%, hsla(36, 95%, 50%, 0.50), transparent 33%),
            radial-gradient(circle at 72% 64%, rgba(255, 255, 255, 0.14), transparent 30%);
          background-size: 140% 140%;
          mix-blend-mode: screen;
          animation: ruyi-fluid-drift 24s ease-in-out infinite;
        }

        .ruyi-liquid-surface::after {
          background: radial-gradient(circle at 78% 18%, rgba(255, 255, 255, 0.18), transparent 24%),
            radial-gradient(circle at 34% 78%, rgba(76, 175, 255, 0.22), transparent 27%);
          background-size: 145% 145%;
          animation: ruyi-fluid-wave 30s ease-in-out infinite;
        }

        .ruyi-surface-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          border-radius: inherit;
          pointer-events: none;
          background: rgba(255, 255, 255, 0.35);
          mix-blend-mode: screen;
          transition: background 220ms ease;
        }

        .ruyi-stat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          border-width: 1px;
          border-style: solid;
          border-color: rgba(255, 255, 255, 0.23);
          border-radius: 0.75rem;
          background: linear-gradient(154deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 18px 36px rgba(5, 22, 62, 0.14);
          backdrop-filter: blur(20px) saturate(155%);
          -webkit-backdrop-filter: blur(20px) saturate(155%);
        }

        .ruyi-selector-wrapper {
          display: flex;
          position: relative;
          width: 100%;
          min-height: 2.52rem;
          gap: 0.18rem;
          border-width: 1px;
          border-style: solid;
          border-color: rgba(255, 255, 255, 0.23);
          border-radius: 0.75rem;
          padding: 0.22rem;
          background: linear-gradient(154deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(20px) saturate(155%);
          -webkit-backdrop-filter: blur(20px) saturate(155%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24), 0 18px 36px rgba(5, 22, 62, 0.14);
          align-items: center;
          overflow: hidden;
        }

        .ruyi-selector-highlight {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          border-radius: 0.75rem;
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.44), rgba(255, 255, 255, 0.22));
          border: 1px solid rgba(255, 255, 255, 0.48);
          box-shadow: 0 16px 24px rgba(4, 25, 65, 0.18);
          backdrop-filter: blur(18px) saturate(170%);
          -webkit-backdrop-filter: blur(18px) saturate(170%);
          transition: top 220ms cubic-bezier(0.22, 0.8, 0.32, 1), left 220ms cubic-bezier(0.22, 0.8, 0.32, 1), width 220ms cubic-bezier(0.22, 0.8, 0.32, 1), height 220ms cubic-bezier(0.22, 0.8, 0.32, 1);
          pointer-events: none;
        }

        .ruyi-selector-item {
          position: relative;
          z-index: 1;
          flex: 1 1 0%;
          min-width: 0;
          height: 2.52rem;
          border-radius: 0.75rem;
          border: 1px solid transparent;
          background: transparent;
          color: rgba(0, 38, 119, 0.7);
          font-weight: 700;
          cursor: pointer;
          transition: color 240ms ease, transform 240ms ease, border-color 240ms ease, background 240ms ease, box-shadow 240ms ease;
        }

        .ruyi-selector-item-active {
          color: #002677;
        }

        .ruyi-selector-item:hover {
          color: #002677;
        }

        .ruyi-selector-item:focus-visible {
          outline: 2px solid rgba(0, 38, 119, 0.5);
          outline-offset: 2px;
        }

        .ruyi-stat-row {
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: space-between;
          min-height: 0;
          padding: 0.5rem 0.72rem;
        }

        .ruyi-tag-stage {
          position: relative;
          height: 100%;
          min-height: 0;
          padding: 0.44rem 0 1rem;
          overflow: visible;
        }

        .ruyi-glass-tag {
          position: absolute;
          top: 50%;
          width: clamp(9.36rem, 15.84vw, 13.44rem);
          aspect-ratio: 16 / 10;
          min-height: 6.24rem;
          border-radius: 0.75rem;
          padding: 0.72rem 0.76rem;
          border: 1px solid rgba(255, 255, 255, 0.32);
          background: linear-gradient(138deg, rgba(255, 255, 255, 0.28), rgba(255, 255, 255, 0.08)),
            linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03));
          box-shadow: 0 20px 44px rgba(3, 14, 54, 0.34), inset 0 1px 0 rgba(255, 255, 255, 0.38), inset 0 -20px 26px rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(22px) saturate(145%);
          -webkit-backdrop-filter: blur(22px) saturate(145%);
          transform-origin: center;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          transition: left 1180ms cubic-bezier(0.19, 0.82, 0.25, 1), transform 1180ms cubic-bezier(0.19, 0.82, 0.25, 1), opacity 300ms ease, filter 1180ms ease;
            background-position: 0% 50%;
          }
        }

        @keyframes ruyi-fluid-drift {
          0% {
            transform: translate3d(0, 0, 0);
            background-position: 12% 42%;
            opacity: 0.74;
          }
          50% {
            transform: translate3d(-3%, 4%, 0);
            background-position: 84% 58%;
            opacity: 0.92;
          }
          100% {
            transform: translate3d(0, 0, 0);
            background-position: 12% 42%;
            opacity: 0.74;
          }
        }

        @keyframes ruyi-fluid-wave {
          0% {
            transform: translate3d(0, 0, 0);
            background-position: 85% 22%;
            opacity: 0.62;
          }
          33% {
            transform: translate3d(-3%, 6%, 0);
            background-position: 22% 78%;
            opacity: 0.76;
          }
          66% {
            transform: translate3d(4%, -5%, 0);
            background-position: 70% 35%;
            opacity: 0.66;
          }
          100% {
            transform: translate3d(0, 0, 0);
            background-position: 85% 22%;
            opacity: 0.62;
          }
        }

        @media (max-width: 1023px) {
          .ruyi-top-panel {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.75rem;
            align-items: flex-start;
          }

          .ruyi-top-panel > .ruyi-stat-container,
          .ruyi-top-panel > .ruyi-selector-wrapper {
            flex: 1 1 calc(50% - 0.375rem);
            min-width: calc(50% - 0.375rem);
            max-width: calc(50% - 0.375rem);
          }

          .ruyi-selector-wrapper {
            flex-direction: column;
            align-items: stretch;
          }

          .ruyi-selector-item {
            width: 100%;
          }

          .ruyi-stat-container {
            min-height: 6.4rem;
          }

          .ruyi-stat-row {
            padding: 0.52rem 0.7rem;
          }

          .ruyi-glass-tag {
            width: clamp(9.6rem, 37.2vw, 12.24rem);
            aspect-ratio: 16 / 10;
            min-height: 5.92rem;
            padding: 0.56rem 0.66rem;
          }

          .ruyi-tag-stage {
            min-height: 8.8rem;
            padding-bottom: 0.8rem;
            overflow: visible;
          }

          .ruyi-liquid-surface {
            border-radius: 0.75rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ruyi-liquid-surface {
            animation-duration: 0s;
          }

          .ruyi-liquid-surface::before,
          .ruyi-liquid-surface::after {
            animation-duration: 0s;
          }

          .ruyi-glass-tag {
            transition-duration: 0s;
          }
        }
      `}</style>
    </>
  );
};

function valueToString(value) {
  return value !== null && value !== undefined ? value.toLocaleString() : '---';
}

export default RuyiInLive;
