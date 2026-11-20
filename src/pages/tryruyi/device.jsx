import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { translate } from '@docusaurus/Translate';
import styles from '../../components/DeviceProvision/device.module.css';

export default function DeviceProvisionPage() {
  return (
    <Layout
      title="ruyi device provision"
      description={translate({
        id: 'tryruyi.device.description',
        message: '选择开发板和系统镜像，通过 USB 安装到设备。',
      })}
    >
      <BrowserOnly fallback={<main className={styles.page}>ruyi device provision</main>}>
        {() => {
          const DeviceConsole =
            require('../../components/DeviceProvision/DeviceConsole').default;
          return <DeviceConsole />;
        }}
      </BrowserOnly>
    </Layout>
  );
}
