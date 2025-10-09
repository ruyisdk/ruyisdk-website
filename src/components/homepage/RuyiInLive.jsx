import React, { useEffect, useMemo, useState } from 'react';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Custom SVG icons
const UsersIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: '0.5rem' }}
  >
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
    <path
      d="M21 21v-2a4 4 0 0 0-3-3.85"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const GithubIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: '0.5rem' }}
  >
    <path
      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
      fill="currentColor"
    />
  </svg>
);

const RuyiInLive = () => {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);

  const [isDiscussButtonHovered, setIsDiscussButtonHovered] = useState(false);
  const [isSourceButtonHovered, setIsSourceButtonHovered] = useState(false);

  const colors = {
    navyBlue: '#002677',
    creamBeige_light: 'rgb(252, 232, 164)',
    creamBeige: '#F8F3E2',
    gold: '#FFBD30',
    lightGold: '#FFD580',
    white: '#FFFFFF',
    lightGray: '#F5F5F7',
    textDark: '#002677',
    textGray: '#86868B',
    placeholderGrey: '#E0E0E0',
    placeholderTextShade: 'rgba(0,0,0,0.1)',
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsWideScreen(window.innerWidth >= 1440); // Breakpoint for wide screen
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const placeholderData = useMemo(
    () => [
      { action: 'Loading Action 1', total: 80 },
      { action: 'Loading Action 2', total: 65 },
      { action: 'Loading Action 3', total: 50 },
    ],
    [],
  );

  useEffect(() => {
    if (!customFields.apiURL) {
      console.warn('apiURL not found in Docusaurus customFields.');
      setLoading(false);
      setError(new Error('API configuration is missing.'));
      return;
    }

    // In development, avoid spinning a Worker that calls remote APIs to speed up preview and avoid rate limits.
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      // Use lightweight placeholder data to render immediately.
      setTimeout(() => {
        setData({
          pm_downloads: { total: 1200 },
          downloads: { total: 5400 },
          installs: { total: 3200 },
          top_commands: { ruyi: { total: 120 }, build: { total: 95 }, run: { total: 60 } },
        });
        setLoading(false);
        setError(null);
      }, 0);

      return;
    }

    const worker = new Worker('/js/dashboardFetcher.js');
    worker.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'success') {
        setData(payload);
        setError(null);
      } else if (type === 'error') {
        setError(new Error(payload.message));
      }
      setLoading(false);
    };
    worker.onerror = (err) => {
      console.error('An error occurred in the dashboard fetcher worker:', err);
      setError(new Error('Failed to load data due to a worker error.'));
      setLoading(false);
    };
    worker.postMessage({ apiURL: customFields.apiURL });
    return () => {
      worker.terminate();
    };
  }, [customFields.apiURL]);

  const barData = useMemo(() => {
    if (!data || !data.top_commands) return [];
    return Object.entries(data.top_commands)
      .map(([action, { total }]) => ({ action, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  }, [data]);

  const styles = {
    outerContainer: {
      display: 'flex',
      overflowX: 'auto',
      width: '100%',
      gap: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      margin: '0 auto',
      padding: '0rem 0rem 0rem',
      backgroundColor: '#f5f5f7',
      maxWidth: isWideScreen ? '90rem' : '100%',
      borderRadius: isWideScreen ? '0.625rem' : '0',
      boxShadow: 'none',
    },
    background: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.lightGray,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem 0',
    },
    container: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      width: isMobile ? 'calc(100% - 2rem)' : 'calc(100% - 4rem)',
      height: isMobile ? 'auto' : '21.875rem',
      backgroundColor: colors.lightGray,
      borderRadius: '0.75rem',
      overflow: 'hidden',
      color: colors.textDark,
      margin: '0 auto 1rem auto',
      boxShadow: isWideScreen ? 'none' : '0 0.25rem 1.25rem rgba(0, 0, 0, 0.1)',
    },
    leftPanel: {
      width: isMobile ? '100%' : '40%',
      padding: isMobile ? '1.875rem' : '2.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: `linear-gradient(135deg, ${colors.navyBlue}, ${colors.navyBlue} 70%, ${colors.navyBlue} 85%)`,
      color: colors.white,
      position: 'relative',
      overflow: 'hidden',
    },
    leftPanelAccent: {
      position: 'absolute',
      bottom: '-3.125rem',
      right: '-3.125rem',
      width: '12.5rem',
      height: '12.5rem',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${colors.gold} 0%, transparent 70%)`,
      opacity: 0.6,
    },
    rightPanel: {
      width: isMobile ? '100%' : '60%',
      padding: isMobile ? '1.5rem' : '1.5rem 2rem', // Adjusted padding
      overflowY: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.white,
    },
    title: {
      fontSize: '1.8rem',
      fontWeight: '700',
      marginBottom: '0.375rem',
      letterSpacing: '-0.03125rem',
    },
    subtitle: {
      fontSize: '0.9rem',
      lineHeight: '1.5',
      marginBottom: '1.125rem',
      fontWeight: '500',
      opacity: '0.9',
    },
    buttonContainer: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      padding: '0.625rem 1.125rem',
      borderRadius: '62.4375rem',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease-out',
      boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)',
      textDecoration: 'none',
      minWidth: '6.25rem',
    },
    discussButtonBase: {
      backgroundColor: colors.creamBeige_light,
      color: colors.textDark,
    },
    sourceButtonBase: {
      backgroundColor: colors.creamBeige,
      color: colors.textDark,
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 0.25rem 1rem rgba(0, 0, 0, 0.2)',
    },
    rightPanelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '1rem', // Space below title
    },
    rightPanelTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: colors.textDark,
    },
    viewMoreLink: {
      fontSize: '0.8rem',
      color: colors.textGray,
      textDecoration: 'none',
      transition: 'color 0.2s',
    },
    statsBox: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '1rem',
      backgroundColor: colors.lightGray,
      borderRadius: '0.5rem',
      textAlign: 'center',
      marginBottom: '1.5rem', // More space below stats
    },
    statItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    statValue: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: colors.navyBlue,
      lineHeight: 1.2,
      minHeight: '2.1rem',
    },
    statLabel: {
      fontSize: '0.75rem',
      color: colors.textGray,
      marginTop: '0.25rem',
    },
    statPlaceholder: {
      height: '1.75rem',
      width: '4rem',
      backgroundColor: colors.placeholderGrey,
      borderRadius: '0.25rem',
      animation: 'pulse 1.5s infinite ease-in-out',
    },
    chartContainer: {
      flex: 1, // Allow chart to take remaining space
      display: 'flex',
      flexDirection: 'column',
    },
    chartWrapper: {
      width: '100%',
      flex: 1,
      position: 'relative',
    },
    placeholderWrapper: {
      width: '100%',
      position: 'relative',
      opacity: 0.6,
      flex: 1,
    },
    nativeChart: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      gap: '0.5rem',
    },
    nativeChartRow: {
      display: 'flex',
      alignItems: 'center',
      minHeight: '2rem',
    },
    nativeChartBarOuter: {
      width: '100%',
      height: '1.75rem',
      backgroundColor: colors.lightGray,
      borderRadius: '0.25rem',
      overflow: 'hidden',
    },
    nativeChartBarInner: {
      height: '100%',
      borderRadius: '0.25rem',
      transition: 'width 0.4s ease-out',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    nativeChartActionLabelInsideBar: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: colors.white,
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
    },
    placeholderLabelInsideBar: {
      height: '0.75rem',
      backgroundColor: colors.placeholderTextShade,
      borderRadius: '0.1875rem',
      marginLeft: '0.5rem',
    },
    emptyDataText: {
      textAlign: 'center',
      color: colors.textGray,
      fontSize: '0.875rem',
      padding: '1.25rem',
      fontWeight: '500',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const getMaxValue = (currentData) => {
    if (!currentData || currentData.length === 0) return 100;
    return Math.max(...currentData.map((item) => item.total), 0);
  };

  const discussButtonStyle = {
    ...styles.button,
    ...styles.discussButtonBase,
    ...(isDiscussButtonHovered ? styles.buttonHover : {}),
  };

  const sourceButtonStyle = {
    ...styles.button,
    ...styles.sourceButtonBase,
    ...(isSourceButtonHovered ? styles.buttonHover : {}),
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
              <div className="w-full h-7 bg-[#F5F5F7] rounded-[0.25rem] overflow-hidden">
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
    <div className="w-full bg-[#f5f5f7]">
      <div className={`w-full mx-auto px-4 md:px-8 ${isWideScreen ? 'max-w-[90rem] rounded-[0.625rem]' : ''}`}>
        <div className="w-full py-4 flex justify-center items-center bg-[#f5f5f7]">
          <div className={`w-full mx-auto ${isMobile ? 'flex flex-col' : 'flex flex-row'} ${isMobile ? 'h-auto' : 'h-[21.875rem]'} bg-[#f5f5f7] rounded-[0.75rem] overflow-hidden text-[#002677] mx-auto mb-4`}>

          <div
            className={`${isMobile ? 'w-full' : 'w-2/5'} p-6 md:p-10 flex flex-col justify-center relative overflow-hidden text-white`}
            style={{ background: `linear-gradient(135deg, ${colors.navyBlue}, ${colors.navyBlue} 70%, ${colors.navyBlue} 85%)` }}
          >
            <h1 className="text-2xl md:text-[1.8rem] font-bold mb-1">
              <Translate id="ruyisdk.community" />
            </h1>
            <p className="text-sm md:text-[0.9rem] mb-3 font-medium opacity-90">
              <Translate id="ruyisdk.community.open" />
            </p>

            <div className="flex gap-3 flex-wrap">
              <a
                href="https://ruyisdk.cn/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 font-semibold transition ${isDiscussButtonHovered ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}`}
                style={{ background: colors.creamBeige_light, color: colors.textDark, minWidth: '6.25rem' }}
                onMouseEnter={() => setIsDiscussButtonHovered(true)}
                onMouseLeave={() => setIsDiscussButtonHovered(false)}
              >
                <UsersIcon />
                <Translate id="ruyisdk.cn" />
              </a>

              <a
                href="https://github.com/ruyisdk"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 font-semibold transition ${isSourceButtonHovered ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}`}
                style={{ background: colors.creamBeige, color: colors.textDark, minWidth: '6.25rem' }}
                onMouseEnter={() => setIsSourceButtonHovered(true)}
                onMouseLeave={() => setIsSourceButtonHovered(false)}
              >
                <GithubIcon />
                <Translate id="source.repository" />
              </a>
            </div>

            <div
              className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-60 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${colors.gold} 0%, transparent 70%)` }}
            />
          </div>

          <div className={`${isMobile ? 'w-full' : 'w-3/5'} p-4 md:p-6 overflow-hidden flex flex-col bg-white`}>
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-lg font-semibold text-[#002677]">
                <Translate id="statistics" />
              </h2>
              <a
                href="/Home/StatisticalDataPages"
                className="text-sm text-[#86868B] hover:text-[#002677]"
                onMouseEnter={(e) => e.currentTarget.style.color = colors.navyBlue}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.textGray}
              >
                <Translate id="view.more" />&nbsp;&gt;
              </a>
            </div>

            <div className="flex justify-around p-4 bg-[#F5F5F7] rounded-[0.5rem] text-center mb-6">
              <StatItem value={data?.pm_downloads?.total} label="pm_downloads" loading={loading} />
              <StatItem value={data?.downloads?.total} label="downloads" loading={loading} />
              <StatItem value={data?.installs?.total} label="installs" loading={loading} />
            </div>

            <div className="flex-1">
              {loading || error ? (
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
                          <div className="w-full h-7 bg-[#F5F5F7] rounded-[0.25rem] overflow-hidden">
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
      </div>
      <style>{`
        @keyframes pulse {
          0% { background-color: ${colors.placeholderGrey}; }
          50% { background-color: #d0d0d0; }
          100% { background-color: ${colors.placeholderGrey}; }
        }
      `}</style>
    </div>
  );
};

export default RuyiInLive;