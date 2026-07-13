import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function PackagesIndexPage() {
  return (
    <Layout
      title="Packages Index"
      description="RuyiSDK 软件包索引及设备平台支持情况"
    >
      <BrowserOnly fallback={<div className="p-8 text-center text-zinc-500">Loading...</div>}>
        {() => {
          const App = require('@site/src/components/PackagesIndex/App').default;
          return <App />;
        }}
      </BrowserOnly>
    </Layout>
  );
}
