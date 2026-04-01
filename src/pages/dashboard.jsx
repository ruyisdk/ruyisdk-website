import Layout from '@theme/Layout';
import ServiceData from '@site/src/components/ServiceData';
import { translate } from "@docusaurus/Translate";
import { Suspense } from "react";

const PageHeader = ({ title }) => (
  <header className="text-center pt-14 px-8 pb-6 border-b border-black/5">
    <h1 className="text-3xl font-extrabold text-blue-900">
      {title}
    </h1>
  </header>
);

const Dashboard = () => {
  return (
    <Layout title="Data Panel" description="RuyiSDK Data Panel">
      <main className="min-h-screen flex flex-col font-sans bg-gray-100 text-gray-900">
        
        <PageHeader
          title={translate({
            id: "dashboard.title",
            message: "RuyiSDK 数据统计"
          })}
        />

        <section className="flex-1 flex justify-center pt-10 pb-16 px-6">
          <div className="w-full max-w-screen-xl mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <ServiceData />
            </Suspense>
          </div>
        </section>

      </main>
    </Layout>
  );
};

export default Dashboard;