import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import ServiceData from '@site/src/components/ServiceData';
import { translate } from "@docusaurus/Translate";
import { GithubOutlined, StarOutlined, ForkOutlined, IssuesCloseOutlined, CodeOutlined, EyeOutlined } from '@ant-design/icons';

const Dashboard = () => {
  return (
    <Layout title="Data Panel" description="RuyiSDK Data Panel">
      <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] relative overflow-hidden flex flex-col font-sans">
        <div className="relative z-20 text-center pt-14 px-8 pb-6 bg-transparent border-b border-[rgba(0,0,0,0.06)]">
          <h1 className="m-0 mb-4 text-[clamp(1.8rem,4vw,3rem)] font-extrabold text-[#0A2C7E]">
            {translate({ id: "RuyiSDK 数据统计", message: "RuyiSDK 数据统计" })}
          </h1>
        </div>

        <div className="relative z-20 flex-1 flex justify-center items-start pt-10 pb-16 px-6">
          <div className="w-full max-w-site mx-auto">
            <ServiceData />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
