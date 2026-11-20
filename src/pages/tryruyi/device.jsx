import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function DeviceProvisionPage() {
  return (
    <Layout
      title="ruyi device provision"
      description="Install a Ruyi board image over WebUSB fastboot"
    >
      <BrowserOnly fallback={<main>ruyi device provision</main>}>
        {() => {
          const DeviceConsole =
            require('../../components/DeviceProvision/DeviceConsole').default;
          return <DeviceConsole />;
        }}
      </BrowserOnly>
    </Layout>
  );
}
