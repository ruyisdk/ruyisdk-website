import { Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useDataWithApiFallback from "@site/src/utils/hooks/useDataWithApiFallback";
import { PageBackground } from "@site/src/components/Home/Background";
import MarkdownCard from "@site/src/components/About/MarkdownCard";

import dashboardData from "@site/static/data/api/api_ruyisdk_cn/fe_dashboard.json";
import StatsDetailDe from "./mdx/stats_detail.de.md";
import StatsDetailEn from "./mdx/stats_detail.en.md";
import StatsDetailZhHans from "./mdx/stats_detail.zh-Hans.md";

import styles from "./styles.module.css";

const DASHBOARD_API_URL = "https://api.ruyisdk.cn/fe/dashboard";

const STATS_DETAIL_CONTENT = {
  "zh-Hans": StatsDetailZhHans,
  de: StatsDetailDe,
  en: StatsDetailEn,
};

function resolveLocalizedContent(contentMap, locale) {
  return contentMap[locale] || contentMap.en;
}

const PageHeader = ({ title }) => (
  <header className="text-center pt-14 px-8">
    <h1 className="text-3xl font-extrabold text-blue-900">
      {title}
    </h1>
    <div className="mx-auto mt-6 max-w-screen-xl border-b border-black/5" />
  </header>
);

const useIntersectionObserver = (callback, options = { threshold: 0.1 }) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

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

const AnimatedStatistic = ({ title, value, unit, note, animate }) => {
  const ANIMATION_DURATION = 500;
  const MAX_ANIMATION_STEPS = 30;

  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);
  const { elementRef, isVisible } = useIntersectionObserver();

  useEffect(() => {
    if (typeof value !== "number") return;

    if (!animate || !isVisible) {
      setDisplayValue(value);
      previousValueRef.current = value;
      return;
    }

    const startValue = previousValueRef.current;
    const diff = value - startValue;
    previousValueRef.current = value;

    if (diff === 0) {
      setDisplayValue(value);
      return;
    }

    const stepCount = Math.min(Math.abs(diff), MAX_ANIMATION_STEPS);
    if (stepCount <= 0) return;

    const stepDuration = ANIMATION_DURATION / stepCount;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      if (currentStep >= stepCount) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        const progress = currentStep / stepCount;
        setDisplayValue(Math.round(startValue + diff * progress));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [animate, isVisible, value]);

  return (
    <div
      className={`${styles.statCard} min-h-35 p-[1.15rem] md:min-h-35 md:p-5 lg:px-[1.45rem] lg:pt-[1.35rem] lg:pb-[1.15rem]`}
      ref={elementRef}
      data-stat={title}
    >
      <h3 className={styles.statTitle}>{title}</h3>
      <div className={styles.statValue}>
        <span className={`${styles.valueNumber} text-[1.8rem] md:text-[1.9rem] lg:text-[2rem]`}>
          {displayValue.toLocaleString()}
        </span>
        <span className={styles.statUnit}>{unit}</span>
      </div>
      <div className={styles.statDivider} />
      <p className={`${styles.statNote} text-[0.74rem]`}>{note}</p>
    </div>
  );
};

const getCategoryV1Total = (data, key) => data?.downloads_by_categories_v1?.[key]?.total || 0;

const CategorySection = ({ data, animate }) => {
  const stats = [
    {
      title: translate({ id: "RuyiSDK 组件包下载量", message: "RuyiSDK 组件包下载量" }),
      value: getCategoryV1Total(data, "pkg"),
      unit: translate({ id: "次", message: "次" }),
      note: translate({ id: "包含 GNU/LLVM 工具链、QEMU 等组件", message: "包含 GNU/LLVM 工具链、QEMU 等组件" }),
    },
    {
      title: translate({ id: "RuyiSDK 遥测设备数", message: "RuyiSDK 遥测设备数" }),
      value: data?.installs?.total || 0,
      unit: translate({ id: "台", message: "台" }),
      note: translate({ id: "上报设备数", message: "上报设备数" }),
    },
    {
      title: translate({ id: "RuyiSDK 文档下载量", message: "RuyiSDK 文档下载量" }),
      value: getCategoryV1Total(data, "humans"),
      unit: translate({ id: "次", message: "次" }),
      note: translate({ id: "含用户手册、峰会演示稿、规格书", message: "含用户手册、峰会演示稿、规格书" }),
    },
    {
      title: translate({ id: "RuyiSDK 包管理器下载量", message: "RuyiSDK 包管理器下载量" }),
      value: getCategoryV1Total(data, "pm:github") + getCategoryV1Total(data, "pm:mirror") + getCategoryV1Total(data, "pm:pypi"),
      unit: translate({ id: "次", message: "次" }),
      note: translate({ id: "RuyiSDK CLI 工具，三渠道下载量汇总", message: "RuyiSDK CLI 工具，三渠道下载量汇总" }),
    },
    {
      title: translate({ id: "RuyiSDK VS Code 插件下载量", message: "RuyiSDK VS Code 插件下载量" }),
      value: getCategoryV1Total(data, "ide:plugin:vscode:mirror") + getCategoryV1Total(data, "ide:plugin:vscode:github"),
      unit: translate({ id: "次", message: "次" }),
      note: translate({ id: "不含两个市场 Open VSX、Visual Studio Marketplace", message: "不含两个市场 Open VSX、Visual Studio Marketplace" }),
    },
    {
      title: translate({ id: "RuyiSDK Eclipse 组件下载量", message: "RuyiSDK Eclipse 组件下载量" }),
      value: getCategoryV1Total(data, "ide:eclipse:mirror") + getCategoryV1Total(data, "ide:plugin:eclipse:mirror") + getCategoryV1Total(data, "ide:plugin:eclipse:github"),
      unit: translate({ id: "次", message: "次" }),
      note: translate({ id: "IDE定制包 + 插件，不含 Eclipse Marketplace 市场", message: "IDE定制包 + 插件，不含 Eclipse Marketplace 市场" }),
    },
  ];

  return (
    <section className={styles.statsSection}>
      <Row gutter={[24, 24]} className={styles.statsRow}>
        {stats.map((item) => (
          <Col key={item.title} xs={24} md={12} lg={8}>
            <div className="mx-auto h-full max-w-md lg:max-w-none">
              <AnimatedStatistic {...item} animate={animate} />
            </div>
          </Col>
        ))}
      </Row>
      <div className={`${styles.updateTime} mx-auto max-w-md text-[0.74rem] md:max-w-[calc(56rem+24px)] lg:max-w-none`}>
        {translate({ id: "数据更新时间", message: "数据更新时间" })}: {String(data.last_updated).slice(0, 16).replace("T", " ")}
      </div>
    </section>
  );
};

const Dashboard = () => {
  const { i18n } = useDocusaurusContext();
  const { data, hasRemoteData } = useDataWithApiFallback(dashboardData, DASHBOARD_API_URL);
  const StatsDetail = resolveLocalizedContent(STATS_DETAIL_CONTENT, i18n?.currentLocale);

  return (
    <div className={styles.container}>
      <PageBackground />
      <PageHeader title={translate({ id: "dashboard.title", message: "RuyiSDK 下载统计" })} />
      <div className={`${styles.mainContent} max-w-screen-xl px-3 py-6 md:px-4 md:py-8 lg:px-8 lg:py-14`}>
        <CategorySection data={data} animate={hasRemoteData} />
        <MarkdownCard variant="solid" className={styles.markdownSection}>
          <StatsDetail />
        </MarkdownCard>
      </div>
    </div>
  );
};

export default Dashboard;
