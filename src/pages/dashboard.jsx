import React, { useEffect, useState } from "react";
import Layout from '@theme/Layout';
import ServiceData from '@site/src/components/ServiceData';
import { translate } from "@docusaurus/Translate";
import ReactDOM from "react-dom";

function PageBackground({ isClient }) {
  if (!isClient) return null;
  return ReactDOM.createPortal(
    <div>
      <div
        aria-hidden
        className="fixed top-0 left-0 rounded-full -z-10"
        style={{ width: 600, height: 600, background: "rgba(221, 190, 221, 0.2)", filter: "blur(120px)" }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 right-0 rounded-full -z-10"
        style={{ width: 700, height: 700, background: "rgba(168, 218, 220, 0.2)", filter: "blur(120px)" }}
      />
    </div>,
    document.body,
  );
}

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Layout title="Data Panel" description="RuyiSDK Data Panel">
      <PageBackground isClient={isClient} />
      <div className="relative overflow-hidden px-6 py-10 text-gray-800 font-inter">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm mb-4">
              {translate({ id: "RuyiSDK 数据统计", message: "RuyiSDK 数据统计" })}
            </h1>
          </div>
          <ServiceData />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
