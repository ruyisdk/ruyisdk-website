import { Card, Statistic, ConfigProvider, Tabs, Row, Col, Progress, Tooltip } from "antd"
import { SmileOutlined, EllipsisOutlined, RiseOutlined, DownloadOutlined, DesktopOutlined, CodeOutlined, CloudServerOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from "react"
import useDashboardClient from "../../../utils/hooks/useDashboardClient"
import { translate } from "@docusaurus/Translate"
import styles from "./styles.module.css";
import { Chart } from '@antv/g2';
import FlipCounter from './FlipCounter';

// Constants
const CHART_COLORS = ['#06bcee', '#087ea4', '#0d4977', '#1a365d', '#2d3748'];
const ANIMATION_DURATION = 2000;
const ANIMATION_STEPS = 60;
const SCROLL_TIMEOUT = 500;
const MOBILE_BREAKPOINT = 1024;
const MAX_RETRY_COUNT = 5;
const RETRY_DELAY_BASE = 1000;

// Translation keys
const TRANSLATIONS = {
  NO_DATA: { id: "暂无数据", message: "暂无数据" },
  TOP_COMMANDS: { id: "最常用指令 Top Commands", message: "最常用指令" },
  TOP_PACKAGES: { id: "最常用包 Top Packages", message: "最常用包" },
  TOP_COMMANDS_TITLE: { id: "最常用指令", message: "最常用指令" },
  TOP_PACKAGES_TITLE: { id: "最常用包", message: "最常用包" },
  COMPONENT_DOWNLOADS: { id: "组件下载数量", message: "组件下载数量" },
  PM_DOWNLOADS: { id: "ruyi包管理器下载次数", message: "ruyi包管理器下载次数" },
  THIRD_PARTY: { id: "第三方软件下载次数", message: "第三方软件下载次数" },
  DOCS_DOWNLOADS: { id: "文档下载数量", message: "文档下载数量" },
  IDE_DOWNLOADS: { id: "IDE下载次数", message: "IDE下载次数" },
  RUYI_INSTALLS: { id: "ruyi安装台数", message: "ruyi安装台数" },
  RUYI_GITHUB_DOWNLOADS: { id: "ruyi包管理器github下载数量", message: "Ruyi GitHub下载数量" },
  DETAILED_STATS: { id: "详细下载统计", message: "详细下载统计" },
  UPDATE_TIME: { id: "数据更新时间", message: "数据更新时间" }
};

// Category mapping
const CATEGORY_NAMES = {
  downloads: TRANSLATIONS.COMPONENT_DOWNLOADS,
  pm_downloads: TRANSLATIONS.PM_DOWNLOADS,
  "3rdparty": TRANSLATIONS.THIRD_PARTY,
  humans: TRANSLATIONS.DOCS_DOWNLOADS,
  ide: TRANSLATIONS.IDE_DOWNLOADS
};

// Utility functions
const useIntersectionObserver = (callback, options = { threshold: 0.1 }) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          callback?.(entry);
        }
      },
      options
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [callback, options]);

  return { elementRef, isVisible };
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkIsMobile = () => setIsMobile(window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Components
const CustomizeRenderEmpty = () => (
  <div className={styles.emptyState}>
    <SmileOutlined className={styles.emptyIcon} />
    <p className={styles.emptyText}>{translate(TRANSLATIONS.NO_DATA)}</p>
  </div>
);

const AnimatedStatistic = ({ title, value, icon, color, loading }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const { elementRef, isVisible } = useIntersectionObserver();

  useEffect(() => {
    if (isVisible && !loading && typeof value === 'number') {
      const increment = value / ANIMATION_STEPS;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, ANIMATION_DURATION / ANIMATION_STEPS);

      return () => clearInterval(timer);
    }
  }, [isVisible, value, loading]);

  return (
    <div className={styles.statCard} ref={elementRef} data-stat={title}>
      <div className={styles.statIcon} style={{ color }}>
        {icon}
      </div>
      <div className={styles.statContent}>
        <h3 className={styles.statTitle}>{title}</h3>
        <div className={styles.statValue}>
          {loading ? (
            <div className={styles.loadingSkeleton}></div>
          ) : (
            <span className={styles.valueNumber}>
              {typeof value === 'number' ? displayValue.toLocaleString() : value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const TopList = ({ data, title }) => {
  const containerRef = useRef();
  const chartRef = useRef();

  const barData = useMemo(() => {
    return Object.entries(data)
      .map(([action, { total }]) => ({ 
        action, 
        total, 
        logTotal: Math.pow(total, 0.4) * (1 + total / 2000) * 0.6
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [data]);

  useEffect(() => {
    if (typeof window === 'undefined' || !barData.length || !containerRef.current) return;
    
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      events: { enabled: false }
    });

    chartRef.current = chart;

    chart.coordinate({ transform: [{ type: 'transpose' }] });
    chart
      .interval()
      .style({ 
        fill: (d, index) => CHART_COLORS[index % CHART_COLORS.length]
      })
      .data(barData)
      .transform({ type: 'sortX', reverse: true, by: "y" })
      .axis('x', { line: false, title: false, label: false, tick: false })
      .axis('y', { title: false, line: false, tick: false })
      .encode('x', 'action')
      .encode('y', 'logTotal')
      .scale('y', { 
        nice: false,
        padding: 0.6,
        min: 0,
        max: Math.max(...barData.map(d => d.logTotal)) * 3.5
      })
      .scale('x', { padding: 0.6 })
      .style('maxWidth', 200)
      .label({ 
        text: 'action', 
        position: "top-left", 
        fill: '#fff', 
        dy: -12, 
        fontWeight: 600,
        fontSize: 12
      })
      .label({ 
        text: 'total', 
        position: "top-right", 
        fill: '#ffffff', 
        dy: 0, 
        dx: -10,
        fontWeight: 700,
        fontSize: 13
      })
      .interaction({ tooltip: { body: false } });

    chart.interaction('view-scroll', false);
    chart.render();
  }, [barData]);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartWrapper}>
        {barData.length ? (
          <div ref={containerRef} className={styles.chart} />
        ) : (
          <CustomizeRenderEmpty />
        )}
      </div>
    </div>
  );
};

const NavigationDots = ({ currentSlide, onDotClick, isMobile }) => {
  if (!isMobile) return null;
  
  return (
    <div className={styles.navigationDots}>
      {[0, 1, 2].map(index => (
        <div 
          key={index}
          onClick={() => onDotClick(index)}
          className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
        />
      ))}
    </div>
  );
};

const MobileInstallSection = ({ totalInstalls, loading }) => (
  <div className={styles.installSection}>
    <div className={styles.installContainer}>
      <div className={styles.installContent}>
        <h2 className={styles.installTitle}>
          <span className={styles.installIcon}>🖥️</span>
          {translate(TRANSLATIONS.RUYI_INSTALLS)}
        </h2>
        <div className={styles.installValue}>
          {loading ? (
            <div className={styles.loadingSkeleton}></div>
          ) : (
            <FlipCounter
              value={totalInstalls}
              loading={loading}
              standalone={true}
            />
          )}
        </div>
      </div>
    </div>
  </div>
);

const StatsSection = ({ data, loading, isMobile }) => {
  const totalInstalls = data?.installs?.total || 0;
  const componentDownloads = data?.downloads?.total || 0;
  const pmDownloads = data?.pm_downloads?.total || 0;

  return (
    <div className={styles.statsSection}>
      <Row gutter={[24, 24]} className={styles.statsRow}>
        {!isMobile && (
          <Col xs={24} sm={12} lg={8}>
            <AnimatedStatistic
              title={translate(TRANSLATIONS.RUYI_INSTALLS)}
              value={totalInstalls}
              icon={<CloudServerOutlined />}
              color="#f093fb"
              loading={loading}
            />
          </Col>
        )}
        
        <Col xs={24} sm={12} lg={!isMobile ? 8 : 12}>
          <AnimatedStatistic
            title={translate(TRANSLATIONS.RUYI_GITHUB_DOWNLOADS)}
            value={pmDownloads}
            icon={<DownloadOutlined />}
            color="#667eea"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} lg={!isMobile ? 8 : 12}>
          <AnimatedStatistic
            title={translate(TRANSLATIONS.COMPONENT_DOWNLOADS)}
            value={componentDownloads}
            icon={<DesktopOutlined />}
            color="#4ade80"
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
};

const CategorySection = ({ data }) => {
  const getCombinedDownloads = (data) => {
    if (!data) return {};
    const combined = {};
    Object.entries(data.other_categories_downloads || {}).forEach(([key, value]) => {
      combined[translate(CATEGORY_NAMES[key])] = { ...value };
    });
    if (data.downloads) combined[translate(CATEGORY_NAMES.downloads)] = { ...data.downloads };
    if (data.pm_downloads) combined[translate(CATEGORY_NAMES.pm_downloads)] = { ...data.pm_downloads };
    return combined;
  };

  const combinedDownloads = getCombinedDownloads(data);
  const maxTotal = Math.max(...Object.values(combinedDownloads).map(v => v.total), 0);

  return (
    <div className={styles.categorySection}>
      <h3 className={styles.sectionTitle}>{translate(TRANSLATIONS.DETAILED_STATS)}</h3>
      <div className={styles.categoryGrid}>
        {Object.entries(combinedDownloads).map(([dir, val]) => {
          // 使用更温和的公式来缩小数据差异
          // 使用对数变换 + 平方根 + 动态缩放因子
          const logValue = Math.log10(val.total + 1);
          const sqrtValue = Math.sqrt(val.total);
          const combinedValue = (logValue * 0.7 + sqrtValue * 0.3) * (1 + val.total / 10000);
          
          const maxLogValue = Math.log10(maxTotal + 1);
          const maxSqrtValue = Math.sqrt(maxTotal);
          const maxCombinedValue = (maxLogValue * 0.7 + maxSqrtValue * 0.3) * (1 + maxTotal / 10000);
          
          const percentage = maxCombinedValue > 0 ? (combinedValue / maxCombinedValue) * 100 : 0;
          
          // 调试信息 - 可以在控制台查看
          console.log(`${dir}: 原始值=${val.total}, 计算值=${combinedValue}, 百分比=${percentage.toFixed(2)}%`);
          
          return (
            <div key={dir} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{dir}</span>
                <span className={styles.categoryValue}>{val.total.toLocaleString()}</span>
              </div>
              <Progress 
                percent={percentage} 
                showInfo={false}
                strokeColor={{
                  '0%': '#667eea',
                  '50%': '#764ba2',
                  '100%': '#f093fb',
                }}
                className={styles.categoryProgress}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChartsSection = ({ data }) => {
  const CardOneitems = [{
    key: '1',
    label: translate(TRANSLATIONS.TOP_COMMANDS),
    children: <TopList data={data?.top_commands || {}} title={translate(TRANSLATIONS.TOP_COMMANDS_TITLE)} />,
  }];

  const CardTwoitems = [{
    key: '1',
    label: translate(TRANSLATIONS.TOP_PACKAGES),
    children: <TopList data={data?.top_packages || {}} title={translate(TRANSLATIONS.TOP_PACKAGES_TITLE)} />,
  }];

  return (
    <div className={styles.chartsSection}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card className={styles.chartCard}>
            <Tabs defaultActiveKey="1" items={CardOneitems} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className={styles.chartCard}>
            <Tabs defaultActiveKey="1" items={CardTwoitems} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const UpdateTime = ({ data }) => (
  <div className={styles.updateTime}>
    <p>
      {translate(TRANSLATIONS.UPDATE_TIME)}: {String(data.last_updated).slice(0, 16).replace("T", " ")}
    </p>
  </div>
);

// Main component
const StatisticalData = () => {
  const axiosInstance = useDashboardClient();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();
  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  
  const isMobile = useMobileDetection();

  // Scroll handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const container = containerRef.current;
    const handleScroll = () => {
      if (container) {
        const pos = container.scrollTop;
        const slide = Math.round(pos / window.innerHeight);
        setCurrentSlide(slide);
      }
    };
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  // Footer visibility
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    
    const footer = document.querySelector('footer');
    if (footer) {
      footerRef.current = footer;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => setIsFooterVisible(entry.isIntersecting));
      }, { threshold: [0] });
      observer.observe(footer);
      return () => observer.disconnect();
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e) => {
      if (isScrolling || isFooterVisible || !isMobile) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToCard(Math.min(2, currentSlide + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToCard(Math.max(0, currentSlide - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [isScrolling, currentSlide, isFooterVisible, isMobile]);

  // Data fetching
  useEffect(() => {
    if (!axiosInstance) return;
    
    let retryTimer = null;
    let retryCount = 0;
    
    const fetchData = async () => {
      if (retryCount > MAX_RETRY_COUNT) return;
      
      try {
        setLoading(true);
        const response = await axiosInstance.post('/fe/dashboard', {});
        setData(response.data);
        setError(null);
      } catch (error) {
        setError(error);
        retryTimer = setTimeout(fetchData, Math.pow(2, retryCount) * RETRY_DELAY_BASE);
        retryCount++;
      } finally {
        setLoading(false);
      }
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(fetchData);
      return () => {
        cancelIdleCallback(id);
        clearTimeout(retryTimer);
      }
    } else {
      retryTimer = setTimeout(fetchData, 500);
      return () => clearTimeout(retryTimer);
    }
  }, [axiosInstance]);

  const scrollToCard = (index) => {
    if (containerRef.current && !isScrolling && !isFooterVisible) {
      setIsScrolling(true);
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), SCROLL_TIMEOUT);
    }
  };

  const totalInstalls = data?.installs?.total || 0;

  return (
    <div 
      ref={containerRef} 
      className={styles.container}
      style={{ pointerEvents: isFooterVisible && isMobile ? 'none' : 'auto' }}
    >
      <NavigationDots 
        currentSlide={currentSlide} 
        onDotClick={scrollToCard} 
        isMobile={isMobile} 
      />
      
      <ConfigProvider 
        renderEmpty={CustomizeRenderEmpty} 
        theme={{
          components: { 
            Tabs: { 
              itemSelectedColor: "#f093fb", 
              inkBarColor: "#f093fb",
              itemActiveColor: "#f093fb",
              itemHoverColor: "#f093fb"
            },
            Card: {
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }}
      >
        <div className={styles.mainContent}>
          {isMobile && (
            <MobileInstallSection totalInstalls={totalInstalls} loading={loading} />
          )}
          
          <StatsSection data={data} loading={loading} isMobile={isMobile} />
          
          {data && <CategorySection data={data} />}
          
          <ChartsSection data={data} />
          
          {data && <UpdateTime data={data} />}
        </div>
      </ConfigProvider>
    </div>
  );
};

export default StatisticalData;
