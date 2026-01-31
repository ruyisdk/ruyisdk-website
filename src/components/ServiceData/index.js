import { Card, Statistic, ConfigProvider, Tabs, Row, Col, Tooltip } from "antd"
import { useCallback } from "react"
import { SmileOutlined, EllipsisOutlined, RiseOutlined, DownloadOutlined, DesktopOutlined, CodeOutlined, CloudServerOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from "react"
import useDashboardClient from "@site/src/utils/hooks/useDashboardClient"
import { translate } from "@docusaurus/Translate"
import "./styles.tailwind.css";
import { Chart } from '@antv/g2';
import FlipCounter from './FlipCounter';

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
  <div className="flex flex-col items-center justify-center p-8">
    <SmileOutlined className="text-4xl text-[#0A2C7E] mb-2" />
    <p className="text-sm text-[#6a737d]">{translate(TRANSLATION_KEY.NO_DATA)}</p>
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
    <div className="bg-white border border-[rgba(0,0,0,0.06)] rounded-lg p-8 flex items-center gap-6 transition-transform duration-150 ease-in-out hover:-translate-y-1 hover:shadow-lg relative overflow-hidden h-full min-h-[160px]" ref={elementRef} data-stat={title}>
      <div className="text-3xl p-4 rounded-lg bg-[rgba(10,44,126,0.06)] border border-[rgba(10,44,126,0.08)]" style={{ color }}>
        {icon}
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-[#0A2C7E] text-base font-medium mb-2">{title}</h3>
        <div className="relative flex items-center justify-center min-h-[60px]">
          {loading ? (
            <div className="w-[120px] h-10 bg-[rgba(0,0,0,0.06)] rounded"></div>
          ) : (
            <span className="text-[#07a0cc] text-4xl font-extrabold">
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
  const debouncedData = useDebounce(data, 300);

  const barData = useMemo(() => {
    if (!debouncedData) return [];
    return Object.entries(data)
      .map(([action, { total }]) => ({ 
        action, 
        total, 
        logTotal: Math.pow(total, 0.4) * (1 + total / 2000) * 0.6
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [debouncedData]);

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
        fill: (d, index) => {
          const maxValue = Math.max(...barData.map(item => item.total));
          const minValue = Math.min(...barData.map(item => item.total));
          const normalizedValue = (d.total - minValue) / (maxValue - minValue);
          const colorIndex = Math.floor((1 - normalizedValue) * (CHART_COLORS.length - 1));
          return CHART_COLORS[colorIndex];
        }
      })
      .data(barData)
      .transform({ type: 'sortX', reverse: true, by: "y" })
      .axis('x', { line: false, title: false, label: false, tick: false, grid: false })
      .axis('y', { title: false, line: false, tick: false, grid: false })
      .encode('x', 'action')
      .encode('y', 'logTotal')
      .scale('y', { 
        nice: false,
        padding: 0.6,
        min: 0,
        max: Math.max(...barData.map(d => d.logTotal)) * 3.5,
        tickCount: 0
      })
      .scale('x', { padding: 0.6, tickCount: 0 })
      .style('maxWidth', 200)
      .label({ 
        text: 'action', 
        position: "top-left", 
        fill: '#2E3A46', 
        dy: -12, 
        fontWeight: 600,
        fontSize: 12
      })
      .label({ 
        text: 'total', 
        position: "inside", 
        fill: '#ffffff', 
        dy: 0, 
        dx: -5,
        fontWeight: 700,
        fontSize: 12
      })
      .interaction({ tooltip: { body: false } });

    chart.interaction('view-scroll', false);
    chart.render();
  }, [barData]);

  return (
    <div className="mb-6">
      <h3 className="text-[#2E3A46] text-lg font-semibold text-center mb-2">{title}</h3>
      <div className="flex-1 relative">
        {barData.length ? (
          <div ref={containerRef} className="w-full h-full min-h-[400px] sd-chart" />
        ) : (
          <CustomizeRenderEmpty />
        )}
      </div>
    </div>
  );
};


const MobileInstallSection = ({ pmDownloads, loading }) => (
  <div className="mb-12 text-center">
    <div className="bg-white/90 border border-[rgba(0,0,0,0.06)] rounded-[24px] p-8 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-[#0A2C7E] text-xl font-semibold tracking-wide uppercase flex items-center justify-center gap-2">
          <span className="text-2xl drop-shadow-lg">💻</span>
          {translate(TRANSLATION_KEY.PM_DOWNLOADS)}
        </h2>
        <div className="flex items-center justify-center min-h-[90px]">
          {loading ? (
            <div className="w-[120px] h-10 bg-[rgba(0,0,0,0.06)] rounded"></div>
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
    <div className="mb-8">
      <Row gutter={[24, 24]}>
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
    if (!data) {
      return {
        component: 0,
        pm: 0,
        ide: 0,
        vscode: 0,
        thirdParty: 0,
        docs: 0,
      };
    }

    const downloads = data?.downloads_by_categories_v1 ?? {};
    return {
      component: downloads.pkg?.total ?? 0,
      pm: (downloads["pm:github"]?.total ?? 0) + (downloads["pm:mirror"]?.total ?? 0) + (downloads["pm:pypi"]?.total ?? 0),
      ide: (downloads["ide:eclipse:mirror"]?.total ?? 0) + (downloads["ide:plugin:eclipse:mirror"]?.total ?? 0) + (downloads["ide:plugin:eclipse:github"]?.total ?? 0),
      vscode: (downloads["ide:plugin:vscode:mirror"]?.total ?? 0) + (downloads["ide:plugin:vscode:github"]?.total ?? 0),
      thirdParty: downloads["3rdparty"]?.total ?? 0,
      docs: downloads.humans?.total ?? 0,
    };
  };

  const combinedDownloads = getCombinedDownloads(data);

  const statItems = [
    { key: 'component', label: translate(TRANSLATION_KEY.COMPONENT_DOWNLOADS), value: combinedDownloads.component },
    { key: 'pm', label: translate(TRANSLATION_KEY.PM_DOWNLOADS), value: combinedDownloads.pm },
    { key: 'ide', label: translate(TRANSLATION_KEY.IDE_DOWNLOADS), value: combinedDownloads.ide },
    { key: 'vscode', label: translate(TRANSLATION_KEY.VSCODE_DOWNLOADS), value: combinedDownloads.vscode },
    { key: 'thirdParty', label: translate(TRANSLATION_KEY.THIRD_PARTY), value: combinedDownloads.thirdParty },
    { key: 'docs', label: translate(TRANSLATION_KEY.DOCS_DOWNLOADS), value: combinedDownloads.docs },
  ];

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.06)] rounded-lg p-6">
      <h3 className="text-[#0A2C7E] text-xl font-semibold text-center mb-4">{translate(TRANSLATION_KEY.DETAILED_STATS)}</h3>
      <div className="sd-orbit">
        <div className="orbitCenter">
          <div className="logoRing">
            <img
              className="logoImage"
              src="/img/ruyi-logo-720.svg"
              alt="RuyiSDK Logo"
            />
          </div>
        </div>
        {statItems.map((item, index) => (
          <div
            key={item.key}
            className={`orbitItem orbitItem${index + 1}`}
          >
            <span className="orbitLabel">{item.label}</span>
            <span className="orbitValue">{Number(item.value || 0).toLocaleString()}</span>
          </div>
        ))}
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
    <div className="mt-8">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card className="bg-white border border-[rgba(0,0,0,0.06)] rounded-lg h-[520px] transition-shadow hover:shadow-xl">
            <Tabs defaultActiveKey="1" items={CardOneitems} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="bg-white border border-[rgba(0,0,0,0.06)] rounded-lg h-[520px] transition-shadow hover:shadow-xl">
            <Tabs defaultActiveKey="1" items={CardTwoitems} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const UpdateTime = ({ data }) => (
  <div className="text-right text-sm text-[#6a737d]">
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
      className="min-h-screen w-full m-0 relative mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12 py-10 flex flex-col gap-12"
      style={{ pointerEvents: isFooterVisible && isMobile ? 'none' : 'auto' }}
    >

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
        
          {isMobile && (
            <MobileInstallSection pmDownloads={pmDownloads} loading={loading} />
          )}
          
          <StatsSection data={data} loading={loading} isMobile={isMobile} />
          
          {data && <CategorySection data={data} />}
          
          <ChartsSection data={data} />
          
          {data && <UpdateTime data={data} />}
      </ConfigProvider>
    </div>
  );
};

export default ServiceData;
