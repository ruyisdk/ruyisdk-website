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
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const placeholderData = useMemo(
    () => [
      { action: 'Loading Action 1', total: 80 },
      { action: 'Loading Action 2', total: 65 },
      { action: 'Loading Action 3', total: 50 },
      { action: 'Loading Action 4', total: 35 },
      { action: 'Loading Action 5', total: 20 },
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
      .slice(0, 5);
  }, [data]);

  const styles = {
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
      maxWidth: '100rem',
      height: isMobile ? 'auto' : '21.875rem',
      backgroundColor: colors.lightGray,
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 0.25rem 1.25rem rgba(0, 0, 0, 0.1)',
      color: colors.textDark,
      margin: '0 auto 1rem auto',
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
      padding: '1.25rem',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.white,
      minHeight: isMobile ? '18.75rem' : 'auto',
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
    chartContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: colors.white,
    },
    chartTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
      marginBottom: '0.875rem',
      color: colors.navyBlue,
    },
    chartWrapper: {
      width: '100%',
      height: '15.625rem',
      position: 'relative',
    },
    placeholderWrapper: {
      width: '100%',
      height: '15.625rem',
      position: 'relative',
      opacity: 0.6,
    },
    loadingText: {
      textAlign: 'center',
      color: colors.textGray,
      fontSize: '0.8125rem',
      marginTop: '0.5rem',
      fontWeight: '500',
    },
    errorText: {
      textAlign: 'center',
      color: colors.textGray,
      fontSize: '0.875rem',
      padding: '1.25rem',
      fontWeight: '500',
    },
    nativeChart: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
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
    <div style={styles.placeholderWrapper}>
      <div style={styles.nativeChart}>
        {placeholderData.map((item, index) => {
          const maxValue = getMaxValue(placeholderData);
          const barWidth = maxValue > 0 ? (item.total / maxValue) * 100 : 0;
          return (
            <div key={`placeholder-${index}`} style={styles.nativeChartRow}>
              <div style={styles.nativeChartBarOuter}>
                <div
                  style={{
                    ...styles.nativeChartBarInner,
                    width: `${barWidth}%`,
                    backgroundColor: colors.placeholderGrey,
                  }}
                >
                  <div
                    style={{
                      ...styles.placeholderLabelInsideBar,
                      width: `${Math.min(80, Math.max(20, barWidth * 0.6))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <h1 style={styles.title}>
            <Translate>RuyiSDK 社区</Translate>
          </h1>
          <p style={styles.subtitle}>
            <Translate>RuyiSDK 社区讨论板块现已开启</Translate>
          </p>
          <div style={styles.buttonContainer}>
            <a
              href="https://github.com/ruyisdk/ruyisdk/discussions/"
              target="_blank"
              rel="noopener noreferrer"
              style={discussButtonStyle}
              onMouseEnter={() => setIsDiscussButtonHovered(true)}
              onMouseLeave={() => setIsDiscussButtonHovered(false)}
            >
              <UsersIcon />
              <Translate>讨论组</Translate>
            </a>
            <a
              href="https://github.com/ruyisdk"
              target="_blank"
              rel="noopener noreferrer"
              style={sourceButtonStyle}
              onMouseEnter={() => setIsSourceButtonHovered(true)}
              onMouseLeave={() => setIsSourceButtonHovered(false)}
            >
              <GithubIcon />
              <Translate>源码库</Translate>
            </a>
          </div>
          <div style={styles.leftPanelAccent}></div>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.chartContainer}>
            <h2 style={styles.chartTitle}>
              <a
                href="/Home/StatisticalDataPages"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <Translate>大家都在用</Translate>
              </a>
            </h2>

            {loading ? (
              <>
                <PlaceholderChart />
                <div style={styles.loadingText}>
                  <Translate>Loading...</Translate>
                </div>
              </>
            ) : error ? (
              <PlaceholderChart />
            ) : barData.length > 0 ? (
              <div style={styles.chartWrapper}>
                <div style={styles.nativeChart}>
                  {barData.map((item) => {
                    const maxValue = getMaxValue(barData);
                    const barWidth =
                      maxValue > 0 ? (item.total / maxValue) * 100 : 0;
                    return (
                      <div key={item.action} style={styles.nativeChartRow}>
                        <div style={styles.nativeChartBarOuter}>
                          <div
                            style={{
                              ...styles.nativeChartBarInner,
                              width: `${barWidth}%`,
                              backgroundColor: colors.navyBlue,
                            }}
                          >
                            <span
                              style={styles.nativeChartActionLabelInsideBar}
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
              <div style={styles.emptyDataText}>
                <Translate>No statistical data available currently.</Translate>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuyiInLive;