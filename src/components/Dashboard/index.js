import { Col, Row } from "antd";
import { IconCloudDown, IconDownload } from '@tabler/icons-react';
import { useEffect, useRef, useState } from "react"
import { translate } from "@docusaurus/Translate"
import styles from "../ServiceData/styles.module.css";
import dashboardData from "@site/static/data/api/api_ruyisdk_cn/fe_dashboard.json";

const DASHBOARD_API_URL = "https://api.ruyisdk.cn/fe/dashboard";
const ANIMATION_DURATION = 2000;
const ANIMATION_STEPS = 60;
const MAX_RETRY_COUNT = 5;
const RETRY_DELAY_BASE = 1000;

const TRANSLATION_KEY = {
  DETAILED_STATS: { id: "详细下载统计", message: "详细下载统计" },
  COMPONENT_DOWNLOADS: { id: "组件下载数量", message: "组件下载数量" },
  PM_DOWNLOADS: { id: "ruyi包管理器下载次数", message: "ruyi包管理器下载次数" },
  IDE_DOWNLOADS: { id: "IDE下载次数", message: "IDE下载次数" },
  VSCODE_DOWNLOADS: { id: "vscode下载次数", message: "VSCode下载次数" },
  THIRD_PARTY: { id: "第三方软件下载次数", message: "第三方软件下载次数" },
  DOCS_DOWNLOADS: { id: "文档下载数量", message: "文档下载数量" },

  UPDATE_TIME: { id: "数据更新时间", message: "数据更新时间" }
};

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

const getCategoryTotal = (data, key) => data?.downloads_by_categories_v1?.[key]?.total || 0;

const CategorySection = ({ data }) => {
  const combinedDownloads = [
    {
      title: translate(TRANSLATION_KEY.COMPONENT_DOWNLOADS),
      value: getCategoryTotal(data, "pkg"),
      icon: <IconCloudDown size={48} stroke={1.5} />,
    },
    {
      title: translate(TRANSLATION_KEY.PM_DOWNLOADS),
      value: getCategoryTotal(data, "pm:github") + getCategoryTotal(data, "pm:mirror") + getCategoryTotal(data, "pm:pypi"),
      icon: <IconDownload size={48} stroke={1.5} />,
    },
    {
      title: translate(TRANSLATION_KEY.IDE_DOWNLOADS),
      value: getCategoryTotal(data, "ide:eclipse:mirror") + getCategoryTotal(data, "ide:plugin:eclipse:mirror") + getCategoryTotal(data, "ide:plugin:eclipse:github"),
      icon: <IconDownload size={48} stroke={1.5} />,
    },
    {
      title: translate(TRANSLATION_KEY.VSCODE_DOWNLOADS),
      value: getCategoryTotal(data, "ide:plugin:vscode:mirror") + getCategoryTotal(data, "ide:plugin:vscode:github"),
      icon: <IconDownload size={48} stroke={1.5} />,
    },
    {
      title: translate(TRANSLATION_KEY.THIRD_PARTY),
      value: getCategoryTotal(data, "3rdparty"),
      icon: <IconCloudDown size={48} stroke={1.5} />,
    },
    {
      title: translate(TRANSLATION_KEY.DOCS_DOWNLOADS),
      value: getCategoryTotal(data, "humans"),
      icon: <IconCloudDown size={48} stroke={1.5} />,
    },
  ];

  return (
    <div className={styles.categorySection}>
      <h3 className={styles.sectionTitle}>{translate(TRANSLATION_KEY.DETAILED_STATS)}</h3>
      <Row gutter={[24, 24]} className={styles.statsRow}>
        {combinedDownloads.map((item) => (
          <Col key={item.title} xs={24} sm={12} lg={8}>
            <AnimatedStatistic
              title={item.title}
              value={item.value}
              icon={item.icon}
              color="#07a0cc"
              loading={false}
            />
          </Col>
        ))}
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

const Dashboard = () => {
  const [data, setData] = useState(dashboardData);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let retryTimer = null;
    let retryCount = 0;

    const fetchData = async () => {
      if (retryCount > MAX_RETRY_COUNT) return;

      try {
        const response = await fetch(DASHBOARD_API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Dashboard API responded with ${response.status}`);
        }

        const nextData = await response.json();
        setData(nextData);
      } catch (error) {
        retryTimer = setTimeout(fetchData, Math.pow(2, retryCount) * RETRY_DELAY_BASE);
        retryCount++;
      }
    };

    fetchData();

    return () => {
      clearTimeout(retryTimer);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <CategorySection data={data} />
        <UpdateTime data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
