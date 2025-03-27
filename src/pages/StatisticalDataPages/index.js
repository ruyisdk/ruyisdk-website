import React from 'react';
import Layout from '@theme/Layout';
import StatisticalData from '../../components/StatisticalData';

const StatisticalDataPages = () => {
  return (
    <Layout title="Data Panel" description="RuyiSDK Data Panel">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: "100%",
          fontSize: '20px',
        }}>
        <StatisticalData></StatisticalData>
      </div>
    </Layout>
  );
}

export default StatisticalDataPages
