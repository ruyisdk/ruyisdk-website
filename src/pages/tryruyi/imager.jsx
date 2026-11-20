import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';
import styles from '../../components/DeviceProvision/device.module.css';

export default function ImagerPage() {
  return (
    <Layout
      title="Ruyi Imager"
      description={translate({
        id: 'tryruyi.device.description',
        message: '选择开发板和系统镜像，通过 USB 安装到设备。',
      })}
    >
      <main className={styles.page}>
        <BrowserOnly fallback={<h1>Ruyi Imager</h1>}>
          {() => {
            const ProvisionWorkspace =
              require('../../components/DeviceProvision/ProvisionWorkspace').default;
            return <ProvisionWorkspace graphical />;
          }}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
