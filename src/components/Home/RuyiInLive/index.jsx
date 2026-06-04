import React, { useMemo } from 'react';
import { IconLink, IconLogin2 } from '@tabler/icons-react';

import Translate from '@docusaurus/Translate';
import useDataWithApiFallback from '@site/src/utils/hooks/useDataWithApiFallback';
import dashboardData from '@site/static/data/api/api_ruyisdk_cn/fe_dashboard.json';

const DASHBOARD_API_URL = 'https://api.ruyisdk.cn/fe/dashboard';

const RuyiInLive = () => {
  const { data } = useDataWithApiFallback(dashboardData, DASHBOARD_API_URL);

  const colors = {
    navyBlue: '#002677',
    gold: '#FFBD30',
    lightGold: '#FFD580',
    white: '#FFFFFF',
    textGray: '#86868B',
    placeholderGrey: '#E0E0E0',
    placeholderTextShade: 'rgba(0,0,0,0.1)',
  };

  const placeholderData = useMemo(
    () => [
      { action: 'Loading Action 1', total: 80 },
      { action: 'Loading Action 2', total: 65 },
      { action: 'Loading Action 3', total: 50 },
    ],
    [],
  );

  const barData = useMemo(() => {
    if (!data || !data.top_commands) return [];
    return Object.entries(data.top_commands)
      .map(([action, { total }]) => ({ action, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  }, [data]);

  const getMaxValue = (currentData) => {
    if (!currentData || currentData.length === 0) return 100;
    return Math.max(...currentData.map((item) => item.total), 0);
  };

  const PlaceholderChart = () => (
    <div className="w-full h-full relative opacity-60">
      <div className="w-full h-full flex flex-col justify-around gap-2">
        {placeholderData.map((item, index) => {
          const maxValue = getMaxValue(placeholderData);
          const barWidth = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
          const innerLabelWidth = Math.min(80, Math.max(20, barWidth * 0.6));
          return (
            <div key={`placeholder-${index}`} className="flex items-center min-h-[2rem]">
              <div className="w-full h-7 rounded-[0.25rem] overflow-hidden">
                <div
                  style={{ width: `${barWidth}%`, backgroundColor: colors.placeholderGrey }}
                  className="h-full rounded-[0.25rem] transition-all duration-300"
                >
                  <div
                    style={{ width: `${innerLabelWidth}%` }}
                    className="h-3 bg-[rgba(0,0,0,0.06)] rounded-[0.1875rem] ml-2 mt-2"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const StatItem = ({ value, label, loading }) => (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="text-[1.75rem] font-bold text-[#002677] min-h-[2.1rem]">
        {loading ? <div className="h-6 w-16 bg-[#E0E0E0] rounded animate-pulse" /> : (value !== null && value !== undefined ? value.toLocaleString() : '---')}
      </div>
      <div className="text-[0.75rem] text-[#86868B] mt-1">
        <Translate>{label}</Translate>
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

          <div className="w-full lg:w-3/5 p-4 md:p-6 overflow-hidden flex flex-col bg-white">
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-lg font-semibold text-(--home-title-color)">
                <Translate id="home.ruyiinlive.statistics">实时数据</Translate>
              </h2>
              <a
                href="/dashboard"
                className="text-sm"
              >
                <Translate id="home.ruyiinlive.viewmore">查看更多</Translate>&nbsp;&gt;
              </a>
            </div>

            <div className="flex justify-around p-4 rounded-[0.5rem] text-center mb-6">
              <StatItem value={data?.pm_downloads?.total} label="pm_downloads" loading={!data} />
              <StatItem value={data?.downloads?.total} label="downloads" loading={!data} />
              <StatItem value={data?.installs?.total} label="installs" loading={!data} />
            </div>

            <div className="flex-1">
              {!data ? (
                <PlaceholderChart />
              ) : barData.length > 0 ? (
                <div className="w-full h-full">
                  <div className="w-full h-full">
                    {barData.map((item) => {
                      const maxValue = getMaxValue(barData);
                      const barWidth =
                        maxValue > 0 ? (item.total / maxValue) * 100 : 0;
                      return (
                        <div key={item.action} className="flex items-center min-h-[2rem]">
                          <div className="w-full h-7 rounded-[0.25rem] overflow-hidden">
                            <div
                              style={{
                                height: '100%',
                                borderRadius: '0.25rem',
                                transition: 'width 0.4s ease-out',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                width: `${barWidth}%`,
                                backgroundColor: colors.navyBlue,
                              }}
                            >
                              <span
                                className="text-[0.75rem] font-semibold text-white px-2 overflow-hidden text-ellipsis whitespace-nowrap"
                                title={item.action}
                              >
                                {item.action}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#86868B] text-sm p-4">
                  <Translate id="no.data" />
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      <style>{`
        @keyframes pulse {
          0% { background-color: ${colors.placeholderGrey}; }
          50% { background-color: #d0d0d0; }
          100% { background-color: ${colors.placeholderGrey}; }
        }
      `}</style>
    </>
  );
};

export default RuyiInLive;
