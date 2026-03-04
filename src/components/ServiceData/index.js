import { Card, Statistic, ConfigProvider, Tabs, Row, Col, Progress, Tooltip } from "antd"
import { useCallback } from "react"
import { SmileOutlined, EllipsisOutlined, RiseOutlined, DownloadOutlined, DesktopOutlined, CodeOutlined, CloudServerOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from "react"
import useDashboardClient from "@site/src/utils/hooks/useDashboardClient"
import { translate } from "@docusaurus/Translate"
import styles from "./styles.module.css";
import FlipCounter from './FlipCounter';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';

// Constants (palette aligned with homepage)
// Data visualization palette (value-based color intensity, blue gradient theme)
// Source inspiration: Value-proportional color intensity with blue gradient
const CHART_COLORS = ['#0A2C7E', '#1A3A8E', '#2A4A9E', '#3A5AAE', '#4A6ABE', '#5A7ACE', '#6A8ADE', '#7A9AEE', '#8AAAEE', '#9ABAEE'];
const ANIMATION_DURATION = 2000;
const ANIMATION_STEPS = 60;
const MOBILE_BREAKPOINT = 1024;
const MAX_RETRY_COUNT = 5;
const RETRY_DELAY_BASE = 1000;

// Translation keys
const TRANSLATION_KEY = {
  // top commands/packages
  NO_DATA: { id: "暂无数据", message: "暂无数据" },
  TOP_COMMANDS: { id: "最常用指令 Top Commands", message: "最常用指令" },
  TOP_PACKAGES: { id: "最常用包 Top Packages", message: "最常用包" },
  TOP_COMMANDS_TITLE: { id: "最常用指令", message: "最常用指令" },
  TOP_PACKAGES_TITLE: { id: "最常用包", message: "最常用包" },

  // data overview
  RUYI_INSTALLS: { id: "ruyi安装台数", message: "ruyi安装台数" },
  RUYI_GITHUB_DOWNLOADS: { id: "ruyi包管理器github下载数量", message: "Ruyi GitHub下载数量" },

  // download data
  DETAILED_STATS: { id: "详细下载统计", message: "详细下载统计" },
  COMPONENT_DOWNLOADS: { id: "组件下载数量", message: "组件下载数量" },
  PM_DOWNLOADS: { id: "ruyi包管理器下载次数", message: "ruyi包管理器下载次数" },
  IDE_DOWNLOADS: { id: "IDE下载次数", message: "IDE下载次数" },
  VSCODE_DOWNLOADS: { id: "vscode下载次数", message: "VSCode下载次数" },
  THIRD_PARTY: { id: "第三方软件下载次数", message: "第三方软件下载次数" },
  DOCS_DOWNLOADS: { id: "文档下载数量", message: "文档下载数量" },

  // update time
  UPDATE_TIME: { id: "数据更新时间", message: "数据更新时间" }
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

// 防抖hook用于优化图表渲染
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};
// Components
const CustomizeRenderEmpty = () => (
  <div className={styles.emptyState}>
    <SmileOutlined className={styles.emptyIcon} />
    <p className={styles.emptyText}>{translate(TRANSLATION_KEY.NO_DATA)}</p>
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
  const debouncedData = useDebounce(data, 300);

  const barData = useMemo(() => {
    if (!debouncedData) return [];
    return Object.entries(data)
      .map(([action, { total }]) => ({
        action,
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [debouncedData]);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartWrapper}>
        {barData.length ? (
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 10, right: 24, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  dataKey="action"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={120}
                />
                <RechartsTooltip
                  formatter={(value) =>
                    typeof value === 'number'
                      ? value.toLocaleString()
                      : value
                  }
                />
                <Bar
                  dataKey="total"
                  radius={[0, 4, 4, 0]}
                  fill="#0A2C7E"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <CustomizeRenderEmpty />
        )}
      </div>
    </div>
  );
};


const MobileInstallSection = ({ pmDownloads, loading }) => (
  <div className={styles.installSection}>
    <div className={styles.installContainer}>
      <div className={styles.installContent}>
        <h2 className={styles.installTitle}>
          <span className={styles.installIcon}>💻</span>
          {translate(TRANSLATION_KEY.PM_DOWNLOADS)}
        </h2>
        <div className={styles.installValue}>
          {loading ? (
            <div className={styles.loadingSkeleton}></div>
          ) : (
            <FlipCounter
              value={pmDownloads}
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
              title={translate(TRANSLATION_KEY.PM_DOWNLOADS)}
              value={pmDownloads}
              icon={<DownloadOutlined />}
              color="#07a0cc"
              loading={loading}
            />
          </Col>
        )}
        
        <Col xs={24} sm={12} lg={!isMobile ? 8 : 12}>
          <AnimatedStatistic
            title={translate(TRANSLATION_KEY.COMPONENT_DOWNLOADS)}
            value={componentDownloads}
            icon={<CloudServerOutlined />}
            color="#07a0cc"
            loading={loading}
            />
        </Col>
        <Col xs={24} sm={12} lg={!isMobile ? 8 : 12}>
          <AnimatedStatistic
            title={translate(TRANSLATION_KEY.RUYI_INSTALLS)}
            value={totalInstalls}
            icon={<DesktopOutlined />}
            color="#07a0cc"
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
    combined[translate(TRANSLATION_KEY.COMPONENT_DOWNLOADS)] = { ...data.downloads_by_categories_v1.pkg };
    combined[translate(TRANSLATION_KEY.PM_DOWNLOADS)] = { total: data.downloads_by_categories_v1["pm:github"].total + data.downloads_by_categories_v1["pm:mirror"].total + data.downloads_by_categories_v1["pm:pypi"].total };
    combined[translate(TRANSLATION_KEY.IDE_DOWNLOADS)] = { total: data.downloads_by_categories_v1["ide:eclipse:mirror"].total + data.downloads_by_categories_v1["ide:plugin:eclipse:mirror"].total + data.downloads_by_categories_v1["ide:plugin:eclipse:github"].total };
    combined[translate(TRANSLATION_KEY.VSCODE_DOWNLOADS)] = { total: data.downloads_by_categories_v1["ide:plugin:vscode:mirror"].total + data.downloads_by_categories_v1["ide:plugin:vscode:github"].total };
    combined[translate(TRANSLATION_KEY.THIRD_PARTY)] = { ...data.downloads_by_categories_v1["3rdparty"] };
    combined[translate(TRANSLATION_KEY.DOCS_DOWNLOADS)] = { ...data.downloads_by_categories_v1.humans };
    return combined;
  };

  const combinedDownloads = getCombinedDownloads(data);
  const maxTotal = Math.max(...Object.values(combinedDownloads).map(v => v.total), 0);

  return (
    <div className={styles.categorySection}>
      <h3 className={styles.sectionTitle}>{translate(TRANSLATION_KEY.DETAILED_STATS)}</h3>
      <div className={styles.categoryGrid}>
        {Object.entries(combinedDownloads).map(([dir, val]) => {
          // 重新设计的合理公式：使用对数压缩 + 线性调整，确保数值差异正确反映
          // 1. 对数压缩：Math.log10(val.total + 1) 压缩大数值差异
          // 2. 线性调整：添加适当的线性因子，避免过度压缩
          // 3. 最小长度保证：确保小数值也有合理的进度条长度
          
          // 基础对数压缩
          const logValue = Math.log10(val.total + 1);
          
          // 线性调整因子：为较大数值提供额外的增长空间
          const linearFactor = Math.min(val.total / 10000, 0.3);
          
          // 组合计算：对数压缩 + 线性调整
          const calculatedValue = logValue * (1 + linearFactor);
          
          // 最小长度保证：确保小数值至少有10%的进度条长度
          const minPercentage = 10;
          const adjustedValue = Math.max(calculatedValue, minPercentage / 100);
          
          const maxLogValue = Math.log10(maxTotal + 1);
          const maxLinearFactor = Math.min(maxTotal / 10000, 0.3);
          const maxCalculatedValue = maxLogValue * (1 + maxLinearFactor);
          
          // 计算百分比，确保最大值是100%，其他值按比例分布
          const percentage = maxCalculatedValue > 0 ? (adjustedValue / maxCalculatedValue) * 100 : minPercentage;
          
          // 调试信息 - 可以在控制台查看
          console.log(`${dir}: 原始值=${val.total}, 对数=${logValue.toFixed(2)}, 线性因子=${linearFactor.toFixed(2)}, 计算值=${calculatedValue.toFixed(2)}, 调整值=${adjustedValue.toFixed(2)}, 百分比=${percentage.toFixed(2)}%`);
          
          return (
            <div key={dir} className={styles.categoryCard}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryName}>{dir}</span>
                <span className={styles.categoryValue}>{val.total.toLocaleString()}</span>
              </div>
              <Progress 
                percent={percentage} 
                showInfo={false}
                strokeColor="#07a0cc"
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
    label: translate(TRANSLATION_KEY.TOP_COMMANDS),
    children: <TopList data={data?.top_commands || {}} title={translate(TRANSLATION_KEY.TOP_COMMANDS_TITLE)} />,
  }];

  const CardTwoitems = [{
    key: '1',
    label: translate(TRANSLATION_KEY.TOP_PACKAGES),
    children: <TopList data={data?.top_packages || {}} title={translate(TRANSLATION_KEY.TOP_PACKAGES_TITLE)} />,
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
      {translate(TRANSLATION_KEY.UPDATE_TIME)}: {String(data.last_updated).slice(0, 16).replace("T", " ")}
    </p>
  </div>
);

// Main component
const ServiceData = () => {
  const axiosInstance = useDashboardClient();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();
  const footerRef = useRef(null);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  
  const isMobile = useMobileDetection();


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


  // Data fetching
  useEffect(() => {
    if (!axiosInstance) return;

    // In development, avoid calling remote dashboard API to speed up preview and avoid rate limits.
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      // Provide lightweight placeholder data
      const placeholder = {
        pm_downloads: { total: 1200 },
        downloads: { total: 5400 },
        installs: { total: 3200 },
        top_commands: { ruyi: { total: 120 }, build: { total: 95 }, run: { total: 60 } },
      };
      setData(placeholder);
      setLoading(false);
      setError(null);
      return;
    }

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


  // TODO: why we count this again????
  // so data is not in this scope, so you use ? to fix compile error
  const pmDownloads = data?.downloads_by_categories_v1["pm:github"].total + data?.downloads_by_categories_v1["pm:mirror"].total + data?.downloads_by_categories_v1["pm:pypi"].total;

  return (
    <div 
      ref={containerRef} 
      className={styles.container}
      style={{ pointerEvents: isFooterVisible && isMobile ? 'none' : 'auto' }}
    >

      {/* Decorative header + animated background blobs (homepage-style) */}
      <div className={styles.backgroundHeader} />
      <div className={styles.animationContainer} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <ConfigProvider 
        renderEmpty={CustomizeRenderEmpty} 
        theme={{
          components: { 
            Tabs: { 
                  itemSelectedColor: "#0A2C7E", 
                  inkBarColor: "#F9C23C",
            },
            Card: {
                  borderRadius: 12,
                  boxShadow: '0 8px 24px rgba(16, 24, 40, 0.06)',
                  borderColor: 'rgba(16, 24, 40, 0.04)'
            }
          }
        }}
      >
        <div className={styles.mainContent}>
          {isMobile && (
            <MobileInstallSection pmDownloads={pmDownloads} loading={loading} />
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

export default ServiceData;
