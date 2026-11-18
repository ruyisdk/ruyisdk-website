import Layout from '@theme/Layout';
import Dashboard from '@site/src/components/Dashboard';
import { translate } from '@docusaurus/Translate';

const Dashboard_thin = () => {
  return (
    <Layout
      title={translate({ id: 'dashboard.title', message: 'RuyiSDK 下载统计' })}
      description={translate({ id: 'dashboard.meta.description', message: 'RuyiSDK 下载与使用统计' })}
    >
      <Dashboard />
    </Layout>
  );
};

export default Dashboard_thin;
