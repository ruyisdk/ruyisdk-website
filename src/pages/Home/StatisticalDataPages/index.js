import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import StatisticalData from '../../../components/common/StatisticalData';
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

const StatisticalDataPages = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 添加页面加载动画
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout title="Data Panel" description="RuyiSDK Data Panel">
      <div className={`${styles.container} ${isLoaded ? styles.loaded : ''}`}>
        <div className={styles.backgroundAnimation}>
          <div className={styles.floatingOrb}></div>
          <div className={styles.floatingOrb}></div>
          <div className={styles.floatingOrb}></div>
        </div>
        
        <div className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📊</span>
            {translate({ id: "RuyiSDK 数据统计", message: "RuyiSDK 数据统计" })}
          </h1>
        </div>

        <div className={styles.content}>
          <StatisticalData />
        </div>
      </div>
    </Layout>
  );
}

export default StatisticalDataPages;
