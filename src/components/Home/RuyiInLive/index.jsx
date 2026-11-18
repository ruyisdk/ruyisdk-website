import React, { useMemo } from 'react';
import { IconLink, IconLogin2 } from '@tabler/icons-react';

import Translate from '@docusaurus/Translate';
import useDataWithApiFallback from '@site/src/utils/hooks/useDataWithApiFallback';
import dashboardData from '@site/static/data/api/api_ruyisdk_cn/fe_dashboard.json';

const DASHBOARD_API_URL = 'https://api.ruyisdk.cn/fe/dashboard';

const RuyiInLive = () => {
  const { data } = useDataWithApiFallback(dashboardData, DASHBOARD_API_URL);

  const colors = {
    navyBlue: '#0A2C7E',
    gold: '#F5B926',
  };

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

  const StatItem = ({ value, labelId, label }) => (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="text-[1.75rem] font-bold text-[#0A2C7E] dark:text-[#79a8ff] min-h-[2.1rem]">
        {value !== null && value !== undefined ? value.toLocaleString() : '---'}
      </div>
      <div className="text-[0.75rem] text-slate-500 dark:text-slate-400 mt-1">
        <Translate id={labelId}>{label}</Translate>
      </div>
    </div>
  );

  return (
    <>
        <div className="w-full flex justify-center items-center">
          <div className="w-full mx-auto flex flex-col lg:flex-row h-auto lg:h-[21.875rem] rounded-xl border border-slate-200/85 shadow-[0_12px_32px_rgba(10,44,126,0.07)] dark:border-white/10 dark:shadow-[0_12px_32px_rgba(0,0,0,0.4)] overflow-hidden text-[#0A2C7E] dark:text-slate-100">

          <div
            className="w-full lg:w-2/5 p-6 md:p-10 flex flex-col justify-center relative overflow-hidden text-white"
            style={{ background: 'linear-gradient(135deg, #08205E 0%, #0A2C7E 58%, #1648B8 100%)' }}
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
                <IconLink size={18} stroke={2} />&nbsp;
                <Translate id="home.ruyiinlive.seecommunity">随便逛逛</Translate>
              </a>

              <a
                href="https://ruyisdk.cn/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button items-center justify-center rounded-full px-4 py-2.5 font-semibold"
              >
                <IconLogin2 size={18} stroke={2} />&nbsp;
                <Translate id="home.ruyiinlive.joincommunity">现在加入</Translate>
              </a>
            </div>

            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-45 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${colors.gold} 0%, transparent 70%)` }}
            />
          </div>

          <div className="w-full lg:w-3/5 p-4 md:p-6 overflow-hidden flex flex-col bg-white dark:bg-[#151b23]">
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-lg font-semibold text-(--home-title-color)">
                <Translate id="home.ruyiinlive.statistics">实时数据</Translate>
              </h2>
              <a
                href="/dashboard"
                className="text-sm font-medium"
              >
                <Translate id="home.ruyiinlive.viewmore">查看更多</Translate>&nbsp;&gt;
              </a>
            </div>

            <div className="flex justify-around p-4 rounded-lg bg-slate-50/90 border border-slate-200/70 dark:bg-[#1c2330] dark:border-white/8 text-center mb-5">
              <StatItem value={data?.pm_downloads?.total} labelId="pm_downloads" label="包管理器下载量" />
              <StatItem value={data?.downloads?.total} labelId="downloads" label="组件下载数量" />
              <StatItem value={data?.installs?.total} labelId="installs" label="安装台数" />
            </div>

            <div className="flex-1">
              {barData.length > 0 ? (
                <div className="w-full h-full">
                  <div className="w-full h-full flex flex-col gap-1.5">
                    {barData.map((item) => {
                      const maxValue = getMaxValue(barData);
                      const barWidth =
                        maxValue > 0 ? (item.total / maxValue) * 100 : 0;
                      return (
                        <div key={item.action} className="flex items-center min-h-[2rem]">
                          <div className="w-full h-7 rounded-md bg-[#eef4ff] dark:bg-[#1c2330] overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#0A2C7E] to-[#1648B8] dark:from-[#1d4ed8] dark:to-[#3b82f6]"
                              style={{
                                height: '100%',
                                borderRadius: '0.375rem',
                                transition: 'width 0.4s ease-out',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                width: `${barWidth}%`,
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
                null
              )}
            </div>
          </div>
        </div>
        </div>
    </>
  );
};

export default RuyiInLive;
