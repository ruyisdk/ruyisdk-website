import { Card, Statistic, ConfigProvider, Tabs } from "antd"
import { SmileOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useRef, useState } from "react"
import useDashboardClient from "../../../utils/hooks/useDashboardClient"
import { translate } from "@docusaurus/Translate"
import styles from "./styles.module.css";
import { Chart } from '@antv/g2';

const CustomizeRenderEmpty = () => (
  <div style={{ textAlign: 'center', height: '20rem' }}>
    <SmileOutlined style={{ fontSize: '2rem', color: "black", marginTop: "1rem" }} />
    <p style={{ color: "black" }}>{translate({ id: "暂无数据", message: "暂无数据" })}</p>
  </div>
);

const TopList = ({ data }) => {
  const containerRef = useRef();
  const chartRef = useRef();

  const barData = useMemo(() => {
    return Object.entries(data)
      .map(([action, { total }]) => ({ action, total }));
  }, [data]);

  useEffect(() => {
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
        .interval().style({ fill: "#0d4977" })
        .data(barData)
        .transform({ type: 'sortX', reverse: true, by: "y" })
        .axis('x', { line: false, title: false, label: false, tick: false })
        .axis('y', { title: false, line: false, tick: false })
        .encode('x', 'action')
        .encode('y', 'total')
        .scale('x', { padding: 0.6 })
        .style('maxWidth', 200)
        .label({ text: 'action', position: "top-left", fill: '#000', dy: -22, fontWeight: 600 })
        .label({
          text: 'total',
          position: (d) => (d.total > maxTotal * 0.1 ? 'left' : 'right'),
          fill: (d) => (d.total > maxTotal * 0.1 ? 'white' : '#333'),
          dx: 5,
          fontWeight: 600
        })
        .interaction({ tooltip: { body: false } });

      chart.interaction('view-scroll', false);
      chart.render();
    }
  }, [barData]);

  return (
    <div className="custom-scroll" style={{
      height: "75vh", overflow: "auto", WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain", msOverflowStyle: "none", scrollbarWidth: "none"
    }}>
      <style jsx>{`.custom-scroll::-webkit-scrollbar { display: none; }`}</style>

      {barData.length ?
        <div ref={containerRef} style={{
          width: "100%", height: "70vh", touchAction: "pan-y", position: "relative"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }} />
        </div>
        :
        <div style={{ width: "100%", height: "70vh" }}><CustomizeRenderEmpty /></div>
      }
    </div>
  );
};

const StatisticalData = () => {
  const axiosInstance = useDashboardClient();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
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
      "downloads": "组件下载量",
      "pm_downloads": "包管理器下载量",
      "3rdparty": "第三方下载量",
      "humans": "文档等",
      "ide": "IDE下载次数"
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
      children: <TopList data={data?.top_commands || {}} />,
    },
    // 已删除分目录 tab 页展示
  ];

  const CardTwoitems = [
    {
      key: '1',
      label: translate({ id: "最常用包 Top Packages", message: "最常用包" }),
      children: <TopList data={data?.top_packages || {}} />,
    }
  ];

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
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
    if (typeof IntersectionObserver === 'undefined') return;
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
        setData((await axiosInstance.post('/fe/dashboard', {})).data);
        setError(null);
      } catch (error) {
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

  const NavigationDots = () => {
    if (!isMobile) return null;
    return (
      <div style={{
        position: 'fixed', right: '20px', top: '50%',
        transform: 'translateY(-50%)', display: 'flex',
        flexDirection: 'column', gap: '10px', zIndex: 100
      }}>
        {[0, 1, 2].map(index => (
          <div key={index}
            onClick={() => scrollToCard(index)}
            style={{
              width: '12px', height: '12px', borderRadius: '50%',
              background: currentSlide === index ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: isFooterVisible ? 'default' : 'pointer'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={styles.container}
      style={{ pointerEvents: isFooterVisible && isMobile ? 'none' : 'auto' }}>
      <NavigationDots />
      <ConfigProvider renderEmpty={CustomizeRenderEmpty} theme={{
        components: { Tabs: { itemSelectedColor: "#0d4977", inkBarColor: "#0d4977" } }
      }}>
        <div className={`${styles.card}`}>
          <Card style={{
            width: '90%', height: '90vh', backgroundColor: "rgba(0,0,0,0)",
            border: "none", margin: "0 auto"
          }}>
            <div>
              <h1 style={{ color: "#e3e3e3", marginTop: "2rem" }}>
                {translate({ id: "RuyiSDK 数据总览", message: "RuyiSDK 数据总览" })}
              </h1>
              <Statistic title={<span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>
                {translate({ id: "下载数量 Downloads", message: "组件下载数量" })}
              </span>}
                value={
                  data?.downloads?.total != null && data?.pm_downloads?.total != null
                    ? data.downloads.total + data.pm_downloads.total
                    : translate({ id: "载入中", message: "载入中" }) + "..."
                }
                valueStyle={{ color: "#e3e3e3", fontSize: "3rem" }}
                style={{ marginTop: "2rem" }}
              />
              <Statistic title={<span style={{ color: "#e3e3e3", fontSize: "1.5rem", fontWeight: "bold" }}>
                {translate({ id: "安装台数 Installs", message: "包管理器安装台数" })}
              </span>}
                value={data?.installs?.total || translate({ id: "载入中", message: "载入中" }) + "..."}
                valueStyle={{ color: "#e3e3e3", fontSize: "3rem" }}
              />
            </div>

            {data && (
              <div style={{ marginTop: "2.5rem", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "1.5rem 2rem" }}>
                <h2 style={{ color: "#e3e3e3", fontSize: "1.2rem", fontWeight: 600, marginBottom: "1rem" }}>
                  {translate({ id: "分目录的下载数量", message: "分目录的下载数量" })}
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {Object.entries(getCombinedDownloads(data)).map(([dir, val]) => (
                    <li key={dir} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "0.5rem 0", borderBottom: "1px solid #2222"
                    }}>
                      <span style={{ color: "#e3e3e3", fontWeight: 500 }}>{dir}</span>
                      <span style={{ color: "#e3e3e3", fontWeight: 700 }}>{val.total}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data && (
              <p style={{ marginTop: "4rem", color: "#d1d1d1", fontSize: '0.8rem' }}>
                {translate({ id: "最后更新时间", message: "数据更新时间" })}:
                {String(data.last_updated).slice(0, 16).replace("T", " ")}
              </p>
            )}
          </Card>
        </div>

        <div className={`${styles.card}`}>
          <Card style={{ width: '80%', height: '75vh', border: "none", marginTop: "1rem" }}>
            <Tabs defaultActiveKey="1" items={CardOneitems} style={{ width: "100%", height: "90vh" }}
              more={{ icon: <EllipsisOutlined />, trigger: 'click' }} />
          </Card>
        </div>

        <div className={`${styles.card}`}>
          <Card style={{ width: '80%', height: '75vh', border: "none", marginTop: "1rem" }}>
            <Tabs defaultActiveKey="1" items={CardTwoitems} style={{ width: "100%", height: "90vh" }}
              more={{ icon: <EllipsisOutlined />, trigger: 'click' }} />
          </Card>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default StatisticalData;
