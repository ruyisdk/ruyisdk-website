import React, { useEffect, useMemo, useState } from 'react';
import { IconLink, IconLogin2 } from '@tabler/icons-react';

import Translate from '@docusaurus/Translate';

const RuyiInLive = () => {
  const [data, setData] = useState(null);
  const [hotTags, setHotTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    navyBlue: '#002677',
    gold: '#FFBD30',
    categoryPillColors: [
      '#4D7FA1',
      '#5E8E9A',
      '#8A7FB2',
      '#C07A92',
      '#A87A60',
      '#7FA04B',
      '#7E7098',
      '#527AA0',
    ],
  };

  const fallbackHotTags = useMemo(
    () => [
      {
        id: 'qemu',
        href: 'https://ruyisdk.cn/tag/qemu/4',
        label: 'qemu',
      },
      {
        id: 'debian',
        href: 'https://ruyisdk.cn/tag/debian/13',
        label: 'debian',
      },
      {
        id: 'internship',
        href: 'https://ruyisdk.cn/tag/internship/20',
        label: 'internship',
      },
      {
        id: 'linux-upstream',
        href: 'https://ruyisdk.cn/tag/linux-upstream/12',
        label: 'linux-upstream',
      },
      {
        id: 'linux',
        href: 'https://ruyisdk.cn/tag/linux/9',
        label: 'linux',
      },
      {
        id: 'llvm',
        href: 'https://ruyisdk.cn/tag/llvm/1',
        label: 'llvm',
      },
      {
        id: 'ruyisdk',
        href: 'https://ruyisdk.cn/tag/ruyisdk/2',
        label: 'ruyisdk',
      },
      {
        id: 'gcc',
        href: 'https://ruyisdk.cn/tag/gcc/3',
        label: 'gcc',
      },
    ],
    [],
  );

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

  const visibleTags = hotTags.length > 0 ? hotTags : fallbackHotTags;

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

  const StatItem = ({ value, labelId, defaultLabel, loading }) => (
    <div className="flex min-w-0 flex-col items-center justify-center px-1">
      <div className="w-full min-h-[2.1rem] text-center text-[clamp(1rem,3.1vw,1.75rem)] font-bold leading-tight text-[#002677]">
        {loading ? (
          <div className="mx-auto h-6 w-16 rounded bg-[#E0E0E0] animate-pulse" />
        ) : (
          <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap" title={value !== null && value !== undefined ? value.toLocaleString() : '---'}>
            {value !== null && value !== undefined ? value.toLocaleString() : '---'}
          </span>
        )}
      </div>
      <div className="mt-1 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[0.75rem] text-[#86868B] md:text-[0.8rem]">
        <Translate id={labelId}>{defaultLabel}</Translate>
      </div>
    </div>
  );

  return (
    <>
        <div className="w-full flex justify-center items-center">
          <div className="w-full mx-auto flex flex-col lg:flex-row h-auto lg:h-[21.875rem] rounded-[0.75rem] overflow-hidden text-[#002677]">

          <div
            className="w-full lg:w-2/5 p-6 md:p-10 flex flex-col justify-center relative overflow-hidden text-white"
            style={{ background: `linear-gradient(135deg, ${colors.navyBlue}, ${colors.navyBlue} 70%, ${colors.navyBlue} 85%)` }}
          >
            <h1 className="text-2xl md:text-[1.8rem] font-bold mb-1">
              <Translate id="home.ruyiinlive.community">RuyiSDK 社区</Translate>
            </h1>
            <p className="whitespace-pre-line text-sm md:text-[0.9rem] mb-3 font-medium opacity-90">
              <Translate id="home.ruyiinlive.community.subtitle">RuyiSDK 开发者社区现已开启</Translate>
            </p>

            <div className="flex gap-3 flex-wrap">
              <a
                href="https://ruyisdk.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className="tertiary-button items-center justify-center rounded-full px-4 py-2.5 font-semibold"
              >
                <IconLink size={18} stroke={2} color="#002677" />&nbsp;
                <Translate id="home.ruyiinlive.seecommunity">随便逛逛</Translate>
              </a>

              <a
                href="https://ruyisdk.cn/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button items-center justify-center rounded-full px-4 py-2.5 font-semibold"
              >
                <IconLogin2 size={18} stroke={2} color="#002677" />&nbsp;
                <Translate id="home.ruyiinlive.joincommunity">现在加入</Translate>
              </a>
            </div>

            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-60 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${colors.gold} 0%, transparent 70%)` }}
            />
          </div>

          <div className="w-full lg:w-3/5 px-4 py-5 md:px-7 md:py-6 overflow-hidden flex flex-col bg-white lg:justify-between">
            <div className="shrink-0 mb-4 md:mb-5 grid grid-cols-3 gap-y-3 gap-x-2 rounded-[0.5rem] p-2 text-center md:gap-x-4 md:p-3">
              {activityStats.map((stat) => (
                <StatItem
                  key={stat.key}
                  value={stat.value}
                  labelId={stat.labelId}
                  defaultLabel={stat.defaultLabel}
                  loading={loading}
                />
              ))}
            </div>

            <div className="flex-1 min-h-0 pt-1 md:pt-2">
              <div className="h-full">
                <div className="flex h-full flex-wrap content-start gap-x-2.5 gap-y-3 overflow-hidden pr-1 md:gap-x-3 md:gap-y-3.5 max-h-[10.25rem] md:max-h-[11.625rem]">
                  {visibleTags.map((tag, index) => (
                    <a
                      key={tag.id || tag.slug || tag.name || `tag-${index}`}
                      href={tag.href || tag.url || `https://ruyisdk.cn/tag/${tag.slug}/${tag.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 md:h-9 max-w-full items-center rounded-full border px-3.5 text-xs md:text-sm font-semibold whitespace-nowrap transition-transform duration-200 hover:-translate-y-[1px]"
                      style={{
                        color:
                          colors.categoryPillColors[
                            index % colors.categoryPillColors.length
                          ],
                        borderColor:
                          colors.categoryPillColors[
                            index % colors.categoryPillColors.length
                          ],
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <span className="max-w-[16rem] overflow-hidden text-ellipsis whitespace-nowrap">
                        {tag.name || tag.label || tag.slug}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    </>
  );
};

export default RuyiInLive;