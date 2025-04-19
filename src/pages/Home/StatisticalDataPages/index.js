import React from 'react';
import Layout from '@theme/Layout';
import StatisticalData from '../../../components/StatisticalData'
import styles from "./styles.module.css";
const StatisticalDataPages = () => {
  return (
    <Layout title="Data Panel" description="RuyiSDK Data Panel">
      <div
        className={styles.container}
      >
        <StatisticalData></StatisticalData>
      </div>
    </Layout>
  );
}

export default StatisticalDataPages
