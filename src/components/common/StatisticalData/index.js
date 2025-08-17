import { Card, Statistic, ConfigProvider, Tabs, Row, Col, Progress, Tooltip } from "antd"
import { SmileOutlined, EllipsisOutlined, RiseOutlined, DownloadOutlined, DesktopOutlined, CodeOutlined, CloudServerOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from "react"
import useDashboardClient from "../../../utils/hooks/useDashboardClient"
import { translate } from "@docusaurus/Translate"
import styles from "./styles.module.css";
import { Chart } from '@antv/g2';
import FlipCounter from './FlipCounter';

const CustomizeRenderEmpty = () => (
  <div className={styles.emptyState}>
    <SmileOutlined className={styles.emptyIcon} />
    <p className={styles.emptyText}>{translate({ id: "暂无数据", message: "暂无数据" })}</p>
  </div>
);

const AnimatedStatistic = ({ title, value, icon, color, loading }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // 确保在客户端环境下执行
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !loading && typeof value === 'number') {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

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
        logTotal: Math.log10(total + 1) // 添加对数变换后的值，+1避免log(0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // 只显示前10个
  }, [data]);

  useEffect(() => {
    // 确保在客户端环境下执行
    if (typeof window === 'undefined') return;
    
    if (barData.length && containerRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const chart = new Chart({
        container: containerRef.current,
        autoFit: true,
        events: { enabled: false }
      });

      chartRef.current = chart;

      const maxTotal = Math.max(...barData.map(d => d.total), 0);

      chart.coordinate({ transform: [{ type: 'transpose' }] });
      chart
        .interval()
        .style({ 
          fill: (d, index) => {
            const colors = [
              '#667eea', // 深空蓝
              '#764ba2', // 科技紫
              '#f093fb', // 霓虹蓝
              '#4ade80', // 薄荷绿
              '#fb7185', // 珊瑚橙
              '#a78bfa', // 薰衣草紫
              '#64748b', // 石墨灰
              '#06b6d4', // 青色
              '#8b5cf6', // 紫色
              '#ec4899'  // 粉色
            ];
            return colors[index % colors.length];
          }
        })
        .data(barData)
        .transform({ type: 'sortX', reverse: true, by: "y" })
        .axis('x', { line: false, title: false, label: false, tick: false })
        .axis('y', { title: false, line: false, tick: false })
        .encode('x', 'action')
        .encode('y', 'logTotal')
        .scale('y', { 
          nice: true,
          padding: 0.6 
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
          position: "right", 
          fill: '#ffffff', 
          dy: 0, 
          dx: 29,
          fontWeight: 700,
          fontSize: 13
        })
        .interaction({ tooltip: { body: false } });

      chart.interaction('view-scroll', false);
      chart.render();
    }
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
  const [isMobile, setIsMobile] = useState(false);

  const getCombinedDownloads = (data) => {
    if (!data) return {};
    const categoryNames = {
      "downloads": translate({ id: "组件下载数量", message: "组件下载数量" }),
      "pm_downloads": translate({ id: "ruyi包管理器下载次数", message: "Ruyi 包管理器下载次数" }),
      "3rdparty": translate({ id: "第三方软件下载次数", message: "第三方软件下载次数" }),
      "humans": translate({ id: "文档下载数量", message: "文档下载数量" }),
      "ide": translate({ id: "IDE下载次数", message: "IDE下载次数" })
    };
    const combined = {};
    Object.entries(data.other_categories_downloads || {}).forEach(([key, value]) => {
      combined[categoryNames[key]] = { ...value };
    });
    if (data.downloads) combined[categoryNames["downloads"]] = { ...data.downloads };
    if (data.pm_downloads) combined[categoryNames["pm_downloads"]] = { ...data.pm_downloads };
    return combined;
  };

  const CardOneitems = [
    {
      key: '1',
      label: translate({ id: "最常用指令 Top Commands", message: "最常用指令" }),
      children: <TopList data={data?.top_commands || {}} title={translate({ id: "最常用指令", message: "最常用指令" })} />,
    },
  ];

  const CardTwoitems = [
    {
      key: '1',
      label: translate({ id: "最常用包 Top Packages", message: "最常用包" }),
      children: <TopList data={data?.top_packages || {}} title={translate({ id: "最常用包", message: "最常用包" })} />,
    }
  ];

  useEffect(() => {
    // 确保在客户端环境下执行
    if (typeof window === 'undefined') return;
    
    const checkIsMobile = () => setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    // 确保在客户端环境下执行
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

  useEffect(() => {
    // 确保在客户端环境下执行
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

  const scrollToCard = (index) => {
    if (containerRef.current && !isScrolling && !isFooterVisible) {
      setIsScrolling(true);
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 500);
    }
  };

  useEffect(() => {
    // 确保在客户端环境下执行
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

  useEffect(() => {
    if (!axiosInstance) return;
    let retryTimer = null;
    let retryCount = 0;
    const apiPost = async () => {
      if (retryCount > 5) return;
      try {
        setLoading(true);
        const response = await axiosInstance.post('/fe/dashboard', {});
        setData(response.data);
        setError(null);
      } catch (error) {
        setError(error);
        retryTimer = setTimeout(apiPost, 2 ** retryCount * 1000);
        retryCount++;
      } finally {
        setLoading(false);
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

  const NavigationDots = () => {
    if (!isMobile) return null;
    return (
      <div className={styles.navigationDots}>
        {[0, 1, 2].map(index => (
          <div key={index}
            onClick={() => scrollToCard(index)}
            className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
          />
        ))}
      </div>
    );
  };

  const totalDownloads = data?.downloads?.total != null && data?.pm_downloads?.total != null
    ? data.downloads.total + data.pm_downloads.total
    : 0;
  
  const componentDownloads = data?.downloads?.total || 0;

  const totalInstalls = data?.installs?.total || 0;

  return (
    <div ref={containerRef} className={styles.container}
      style={{ pointerEvents: isFooterVisible && isMobile ? 'none' : 'auto' }}>
      <NavigationDots />
      <ConfigProvider renderEmpty={CustomizeRenderEmpty} theme={{
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
      }}>
        <div className={styles.mainContent}>
          {/* 移动端：安装台数独立显示 */}
          {isMobile && (
            <div className={styles.installSection}>
              <div className={styles.installContainer}>
                <div className={styles.installContent}>
                  <h2 className={styles.installTitle}>
                    <span className={styles.installIcon}>🖥️</span>
                    {translate({ id: "ruyi安装台数", message: "RuyiSDK 安装台数" })}
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
          )}

          {/* 统计数据卡片区域 */}
          <div className={styles.statsSection}>
            <Row gutter={[24, 24]} className={styles.statsRow}>
              {/* PC端：安装台数作为第一个卡片 */}
              {!isMobile && (
                <Col xs={24} sm={12} lg={8}>
                  <AnimatedStatistic
                    title={translate({ id: "ruyi安装台数", message: "RuyiSDK 安装台数" })}
                    value={totalInstalls}
                    icon={<CloudServerOutlined />}
                    color="#f093fb"
                    loading={loading}
                  />
                </Col>
              )}
              
              <Col xs={24} sm={12} lg={!isMobile ? 8 : 12}>
                <AnimatedStatistic
                  title={translate({ id: "ruyi包管理器github下载数量", message: "Ruyi GitHub 下载数量" })}
                  value={data?.pm_downloads?.total || 0}
                  icon={<DownloadOutlined />}
                  color="#667eea"
                  loading={loading}
                />
              </Col>
              <Col xs={24} sm={12} lg={!isMobile ? 8 : 12}>
                <AnimatedStatistic
                  title={translate({ id: "组件下载数量", message: "RuyiSDK 组件下载数量" })}
                  value={componentDownloads}
                  icon={<DesktopOutlined />}
                  color="#4ade80"
                  loading={loading}
                />
              </Col>
            </Row>
          </div>

          {/* 分类下载数据 */}
          {data && (
            <div className={styles.categorySection}>
              <h3 className={styles.sectionTitle}>{translate({ id: "详细下载统计", message: "详细下载统计" })}</h3>
              <div className={styles.categoryGrid}>
                {Object.entries(getCombinedDownloads(data)).map(([dir, val], index) => {
                  // 使用对数变换计算进度条长度，但保持真实数据展示
                  const logTotal = Math.log10(val.total + 1); // +1 避免 log(0)
                  const maxLogTotal = Math.log10(Math.max(...Object.values(getCombinedDownloads(data)).map(v => v.total)) + 1);
                  const logPercentage = maxLogTotal > 0 ? (logTotal / maxLogTotal) * 100 : 0;
                  
                  return (
                    <div key={dir} className={styles.categoryCard}>
                      <div className={styles.categoryHeader}>
                        <span className={styles.categoryName}>{dir}</span>
                        <span className={styles.categoryValue}>{val.total.toLocaleString()}</span>
                      </div>
                      <Progress 
                        percent={logPercentage} 
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
          )}

          {/* 图表区域 */}
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

          {/* 更新时间 */}
          {data && (
            <div className={styles.updateTime}>
              <p>
                {translate({ id: "数据更新时间", message: "数据更新时间" })}: {String(data.last_updated).slice(0, 16).replace("T", " ")}
              </p>
            </div>
          )}
        </div>
      </ConfigProvider>
    </div>
  );
}

export default StatisticalData;
