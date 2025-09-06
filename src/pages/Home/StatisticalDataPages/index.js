import React from 'react';
import Layout from '@theme/Layout';
import StatisticalData from '../../../components/common/StatisticalData';
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

const StatisticalDataPages = () => {
  return (
    <Layout title="Data Panel" description="RuyiSDK Data Panel">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
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
