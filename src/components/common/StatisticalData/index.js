import { Card, Statistic, ConfigProvider, Tabs, Row, Col, Progress, Tooltip } from "antd"
import { SmileOutlined, EllipsisOutlined, RiseOutlined, DownloadOutlined, DesktopOutlined, CodeOutlined, CloudServerOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from "react"
import useDashboardClient from "../../../utils/hooks/useDashboardClient"
import { translate } from "@docusaurus/Translate"
import styles from "./styles.module.css";
import * as echarts from 'echarts';
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
  const [isMobile, setIsMobile] = useState(false);

  const barData = useMemo(() => {
    return Object.entries(data)
      .map(([action, { total }]) => ({ action, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // 只显示前10个
  }, [data]);

  useEffect(() => {
    // 检测是否为移动端
    const checkIsMobile = () => {
      const mobile = window.matchMedia('(max-width: 1024px)').matches;
      setIsMobile(mobile);
      console.log('Mobile detected:', mobile); // 添加调试信息
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 如果没有数据，显示空状态
  if (!barData.length) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.chartWrapper}>
          <CustomizeRenderEmpty />
        </div>
      </div>
    );
  }

  const maxTotal = Math.max(...barData.map(d => d.total), 0);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartWrapper}>
        <div className={styles.nativeChart}>
          {barData.map((item, index) => {
            const barWidth = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
            const colors = [
              '#00d4ff', // 亮蓝色 - 最高使用
              '#0099ff', // 蓝色
              '#0066ff', // 深蓝色
              '#0033ff', // 更深的蓝色
              '#0000ff', // 纯蓝色
              '#3300ff', // 蓝紫色
              '#6600ff', // 紫色
              '#9900ff', // 亮紫色
              '#cc00ff', // 更亮的紫色
              '#ff00ff'  // 洋红色
            ];
            return (
              <div key={item.action} className={styles.nativeChartRow}>
                <div className={styles.nativeChartBarOuter}>
                  <div
                    className={styles.nativeChartBarInner}
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  >
                    {/* 只在PC端显示柱子内部标签 */}
                    {!isMobile && (
                      <span className={styles.nativeChartActionLabelInsideBar}>
                        {item.action}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* 只在PC端显示柱子右侧数值标签 */}
                {!isMobile && (
                  <span className={styles.nativeChartValueLabel}>
                    {item.total}
                  </span>
                )}
                
                {/* 移动端：标签在柱子下方 */}
                {isMobile && (
                  <div className={styles.mobileLabelsContainer}>
                    <span className={styles.mobileActionLabel}>
                      {item.action}
                    </span>
                    <span className={styles.mobileValueLabel}>
                      {item.total}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CircularChart = ({ data, title }) => {
  const [isMobile, setIsMobile] = useState(false);
  const chartRef = useRef();
  const chartInstance = useRef();

  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([action, { total }]) => ({ action, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 9); // 显示前9个数据点
  }, [data]);

  useEffect(() => {
    // 检测是否为移动端
    const checkIsMobile = () => {
      const mobile = window.matchMedia('(max-width: 1024px)').matches;
      setIsMobile(mobile);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    // 确保在客户端环境下执行
    if (typeof window === 'undefined') return;
    
    if (chartData.length && chartRef.current) {
      // 销毁之前的图表实例
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      // 创建新的图表实例
      const chart = echarts.init(chartRef.current);
      chartInstance.current = chart;

      // 准备数据
      const seriesData = chartData.map((item, index) => ({
        name: item.action,
        value: item.total,
        itemStyle: {
          color: [
            '#06bcee', // 亮蓝色 - ruyi list
            '#087ea4', // 深蓝色 - ruyi admin format-manifest
            '#0ea5e9', // 天蓝色 - ruyi update
            '#0284c7', // 蓝色 - ruyi install
            '#0369a1', // 深天蓝 - ruyi
            '#075985', // 深蓝 - ruyi telemetry upload
            '#0c4a6e', // 深青蓝 - ruyi device provision
            '#1e40af', // 靛蓝 - ruyi news read
            '#3730a3'  // 紫蓝 - ruyi version
          ][index]
        }
      }));

      // 配置选项
      const option = {
        tooltip: {
          trigger: isMobile ? 'item' : 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: '#06bcee',
          borderWidth: 1,
          textStyle: {
            color: '#ffffff'
          },
          // 移动端优化：触摸时显示提示
          confine: true,
          enterable: isMobile ? false : true
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          textStyle: {
            color: '#ffffff',
            fontSize: isMobile ? 10 : 12
          },
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 10,
          itemStyle: {
            borderWidth: 0
          },
          // 移动端优化：增加触摸区域
          itemGap: isMobile ? 12 : 10,
          selectedMode: isMobile ? true : true
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: isMobile ? ['40%', '70%'] : ['50%', '80%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: isMobile ? false : true, // 移动端不显示标签，避免遮挡
                fontSize: isMobile ? 14 : 18,
                fontWeight: 'bold',
                color: '#ffffff'
              },
              itemStyle: {
                shadowBlur: isMobile ? 8 : 15, // 移动端减少阴影
                shadowOffsetX: 0,
                shadowColor: 'rgba(6, 188, 238, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
            data: seriesData,
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
            // 移动端优化：触摸交互
            select: {
              disabled: false
            },
            selectedOffset: isMobile ? 5 : 10
          }
        ],
        // 移动端优化：触摸手势支持
        animation: isMobile ? false : true, // 移动端关闭动画提升性能
        // 移动端优化：触摸事件
        useUTC: false,
        // 移动端优化：触摸敏感度
        hoverLayerThreshold: isMobile ? 10 : 5,
        // 移动端优化：触摸区域
        progressive: isMobile ? 1000 : 0,
        progressiveThreshold: isMobile ? 3000 : 0
      };

      // 设置配置并渲染
      chart.setOption(option);

      // 移动端触摸交互优化
      if (isMobile) {
        // 为移动端添加触摸事件
        chart.on('click', function (params) {
          // 点击扇面时高亮显示
          if (params.componentType === 'series') {
            // 重置所有扇面的高亮状态
            chart.dispatchAction({
              type: 'downplay'
            });
            
            // 高亮当前点击的扇面
            chart.dispatchAction({
              type: 'highlight',
              seriesIndex: params.seriesIndex,
              dataIndex: params.dataIndex
            });
            
            // 显示tooltip
            chart.dispatchAction({
              type: 'showTip',
              seriesIndex: params.seriesIndex,
              dataIndex: params.dataIndex
            });
          }
        });

        // 点击图例时切换显示/隐藏
        chart.on('legendselectchanged', function (params) {
          // 图例切换后的处理
          console.log('Legend changed:', params);
        });
      }

      // 响应式处理
      const handleResize = () => {
        chart.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, [chartData, title, isMobile]);

  // 如果没有数据，显示空状态
  if (!chartData.length) {
    return (
      <div className={styles.chartContainer}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.chartWrapper}>
          <CustomizeRenderEmpty />
        </div>
      </div>
    );
  }

  const total = chartData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      {isMobile && (
        <div className={styles.mobileTip}>
          💡 点击扇面查看详细信息
        </div>
      )}
      <div className={styles.chartWrapper}>
        <div className={styles.echartsContainer}>
          {/* ECharts 图表容器 */}
          <div ref={chartRef} className={styles.echartsChart} />
        </div>
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
      "pm_downloads": translate({ id: "ruyi包管理器下载次数", message: "ruyi包管理器下载次数" }),
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
      children: <CircularChart data={data?.top_commands || {}} title={translate({ id: "最常用指令", message: "最常用指令" })} />,
    },
  ];

  const CardTwoitems = [
    {
      key: '1',
      label: translate({ id: "最常用包 Top Packages", message: "最常用包" }),
      children: <CircularChart data={data?.top_packages || {}} title={translate({ id: "最常用包", message: "最常用包" })} />,
    }
  ];

  useEffect(() => {
    // 确保在客户端环境下执行
    if (typeof window === 'undefined') return;
    
    const checkIsMobile = () => {
      const mobile = window.matchMedia('(max-width: 1024px)').matches;
      setIsMobile(mobile);
      console.log('Mobile detected:', mobile); // 添加调试信息
    };
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
            itemSelectedColor: "#06bcee", 
            inkBarColor: "#06bcee",
            itemActiveColor: "#06bcee",
            itemHoverColor: "#06bcee"
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
                    {translate({ id: "ruyi安装台数", message: "ruyi安装台数" })}
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
                    title={translate({ id: "ruyi安装台数", message: "ruyi安装台数" })}
                    value={totalInstalls}
                    icon={<CloudServerOutlined />}
                    color="#06bcee"
                    loading={loading}
                  />
                </Col>
              )}
              
              <Col xs={24} sm={12} lg={!isMobile ? 8 : 12}>
                <AnimatedStatistic
                  title={translate({ id: "ruyi包管理器工具下载数量", message: "ruyi包管理器工具下载数量" })}
                  value={data?.pm_downloads?.total || 0}
                  icon={<DownloadOutlined />}
                  color="#06bcee"
                  loading={loading}
                />
              </Col>
              <Col xs={24} sm={12} lg={!isMobile ? 8 : 12}>
                <AnimatedStatistic
                  title={translate({ id: "组件下载数量", message: "组件下载数量" })}
                  value={componentDownloads}
                  icon={<DesktopOutlined />}
                  color="#087ea4"
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
                  const percentage = totalDownloads > 0 ? (val.total / totalDownloads) * 100 : 0;
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
                          '0%': '#06bcee',
                          '100%': '#087ea4',
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
