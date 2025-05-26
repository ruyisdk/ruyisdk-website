import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Chart } from '@antv/g2';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import axios from 'axios';

// Custom SVG icons
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.85" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const NewspaperIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M3 8h18" stroke="currentColor" strokeWidth="2" />
    <path d="M7 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M7 16h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" fill="currentColor" />
  </svg>
);

// Custom hook for dashboard client
const useDashboardClient = () => {
  const { siteConfig: { customFields } } = useDocusaurusContext();
  
  const axiosInstance = useMemo(() => {
    if (!customFields.apiURL) return null;
    
    const instance = axios.create({
      baseURL: `https://${customFields.apiURL}`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return instance;
  }, [customFields.apiURL]);
  
  return axiosInstance;
};

const RuyiInLive = () => {
  const axiosInstance = useDashboardClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const containerRef = useRef();
  const chartRef = useRef();
  const placeholderRef = useRef();
  const placeholderChartRef = useRef();
  
  // Colors from the Ruyi style
  const colors = {
    navyBlue: '#002677', // Darker blue matching the image
    creamBeige_light:'rgb(252, 232, 164)',  
    creamBeige: '#F8F3E2', // Cream/beige color from the image
    gold: '#FFBD30',     // Gold/yellow from the Ruyi logo
    lightGold: '#FFD580', // Lighter gold
    white: '#FFFFFF',
    lightGray: '#F5F5F7',
    textDark: '#002677', // Dark blue text
    textGray: '#86868B',
    placeholderGrey: '#E0E0E0', // Grey color for placeholder
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Placeholder data for loading state
  const placeholderData = useMemo(() => {
    return [
      { action: 'Action 1', total: 80 },
      { action: 'Action 2', total: 65 },
      { action: 'Action 3', total: 50 },
      { action: 'Action 4', total: 35 },
      { action: 'Action 5', total: 20 },
    ];
  }, []);

  // Fetch data
  useEffect(() => {
    if (!axiosInstance) return;

    let retryTimer = null;
    let retryCount = 0;

    const apiPost = async () => {
      if (retryCount > 5) {
        console.warn('Stop retry');
        return;
      }

      try {
        setData((await axiosInstance.post('/fe/dashboard', {})).data);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Dashboard API error, will retry', error);
        setError(error);
        retryTimer = setTimeout(apiPost, 2 ** retryCount * 1000);
        retryCount++;
      }
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(apiPost);
      return () => {
        cancelIdleCallback(id);
        clearTimeout(retryTimer);
      }
    } else {
      retryTimer = setTimeout(apiPost, 500);
      return () => clearTimeout(retryTimer);
    }
  }, [axiosInstance]);

  // Process the data for the chart
  const barData = useMemo(() => {
    if (!data || !data.top_commands) return [];
    
    return Object.entries(data.top_commands)
      .map(([action, { total }]) => ({ action, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [data]);

  // Create placeholder chart during loading
  useEffect(() => {
    if (loading && placeholderRef.current) {
      if (placeholderChartRef.current) {
        placeholderChartRef.current.destroy();
      }

      const chart = new Chart({
        container: placeholderRef.current,
        autoFit: true,
        events: {
          enabled: false
        }
      });

      placeholderChartRef.current = chart;

      chart.coordinate({ transform: [{ type: 'transpose' }] });
      chart
        .interval().style({
          fill: colors.placeholderGrey
        })
        .data(placeholderData)
        .transform({ type: 'sortX', reverse: true, by: "y" })
        .axis('x', {
          line: false,
          title: false,
          label: false,
          tick: false
        })
        .axis('y', { title: false, line: false, tick: false })
        .encode('x', 'action')
        .encode('y', 'total')
        .scale('x', { padding: 0.6 })
        .style('maxWidth', 200)
        // No labels for placeholder
        .interaction({
          tooltip: {
            body: false
          }
        });
      chart.interaction('view-scroll', false);

      chart.render();
    }
  }, [loading, placeholderData, colors]);

  // Create and update the chart
  useEffect(() => {
    if (barData.length && containerRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const chart = new Chart({
        container: containerRef.current,
        autoFit: true,
        events: {
          enabled: false
        }
      });

      chartRef.current = chart;

      chart.coordinate({ transform: [{ type: 'transpose' }] });
      chart
        .interval().style({
          fill: colors.navyBlue
        })
        .data(barData)
        .transform({ type: 'sortX', reverse: true, by: "y" })
        .axis('x', {
          line: false,
          title: false,
          label: false,
          tick: false
        })
        .axis('y', { title: false, line: false, tick: false })
        .encode('x', 'action')
        .encode('y', 'total')
        .scale('x', { padding: 0.6 })
        .style('maxWidth', 200)
        .label({
          text: 'action',
          position: "top-left",
          fill: '#000',
          dy: -22,
          fontWeight: 600,
          fontSize: 12 // Smaller font size for labels
        })
        .label({
          text: 'total',
          position: "left",
          fill: 'white',
          dx: 5,
          fontWeight: 600,
          fontSize: 12 // Smaller font size for values
        })
        .interaction({
          tooltip: {
            body: false
          }
        });
      chart.interaction('view-scroll', false);

      chart.render();
    }
  }, [barData, colors]);

  // Styles
  const styles = {
    background: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.lightGray,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      width: isMobile ? 'calc(100% - 64px)' : 'calc(100% - 64px)', 
      height: isMobile ? 'auto' : '350px', // Auto height for mobile
      backgroundColor: colors.lightGray,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      color: colors.textDark,
      margin: '0 auto 16px auto',
    },
    leftPanel: {
      width: isMobile ? '100%' : '40%',
      padding: isMobile ? '30px' : '60px',
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
      bottom: '-50px',
      right: '-50px',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${colors.gold} 0%, transparent 70%)`,
      opacity: 0.6,
    },
    rightPanel: {
      width: isMobile ? '100%' : '60%',
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.white,
      minHeight: isMobile ? '250px' : 'auto',
    },
    title: {
      fontSize: '2rem', // Slightly smaller title
      fontWeight: '700',
      marginBottom: '6px',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '1rem', // Smaller subtitle
      lineHeight: '1.5',
      marginBottom: '18px',
      fontWeight: '500',
      opacity: '0.9',
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.creamBeige_light,
      color: colors.textDark,
      border: 'none',
      padding: '12px 24px',
      borderRadius: '9999px', // Pill shape
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      textDecoration: 'none',
      minWidth: '120px',
    },
    chartContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: colors.white,
    },
    chartTitle: {
      fontSize: '14px', // Smaller chart title
      fontWeight: '600',
      marginBottom: '14px',
      color: colors.navyBlue,
    },
    chartWrapper: {
      width: '100%',
      height: '250px',
      position: 'relative',
    },
    placeholderWrapper: {
      width: '100%',
      height: '250px',
      position: 'relative',
      opacity: 0.6,
    },
    loadingText: {
      textAlign: 'center',
      color: colors.textGray,
      fontSize: '13px',
      marginTop: '8px',
      fontWeight: '500',
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <h1 style={styles.title}><Translate>RuyiSDK 社区</Translate></h1>
          <p style={styles.subtitle}><Translate>RuyiSDK 社区讨论板块现已开启</Translate></p>
          <div style={styles.buttonContainer}>
            <a 
              href="https://github.com/ruyisdk/ruyisdk/discussions/"
              target="_blank"
              style={styles.button}
            >
              <UsersIcon />
              <Translate>讨论组</Translate>
            </a>
            <a 
              href="https://github.com/ruyisdk" 
              target="_blank"
              style={{...styles.button, backgroundColor: colors.creamBeige, color: colors.textDark}}
            >
              <GithubIcon />
              <Translate>源码库</Translate>
            </a>
          </div>
          <div style={styles.leftPanelAccent}></div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <div style={styles.chartContainer}>
            <h2 style={styles.chartTitle}><Translate>大家都在用</Translate></h2>
            
            {loading ? (
              <>
                <div 
                  ref={placeholderRef} 
                  style={styles.placeholderWrapper}
                />
                <div style={styles.loadingText}>Loading...</div>
              </>
            ) : error ? (
              <div style={styles.loader}>Failed to load data. Please try again later.</div>
            ) : (
              <div 
                ref={containerRef} 
                style={styles.chartWrapper}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuyiInLive;
