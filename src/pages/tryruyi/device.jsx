import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { translate } from '@docusaurus/Translate';
import MarkdownCard from '@site/src/components/About/MarkdownCard';
import GuideDe from '../../components/DeviceProvision/mdx/guide.de.mdx';
import GuideEn from '../../components/DeviceProvision/mdx/guide.en.mdx';
import GuideZhHans from '../../components/DeviceProvision/mdx/guide.zh-Hans.mdx';
import styles from '../../components/DeviceProvision/device.module.css';

const guides = { 'zh-Hans': GuideZhHans, en: GuideEn, de: GuideDe };

export default function DeviceProvisionPage() {
  const { i18n } = useDocusaurusContext();
  const Guide = guides[i18n.currentLocale] ?? GuideEn;
  return (
    <Layout
      title="ruyi device provision"
      description={translate({
        id: 'tryruyi.device.description',
        message: '选择开发板和系统镜像，通过 USB 安装到设备。',
      })}
    >
      <main className={styles.page}>
        <BrowserOnly fallback={<h1>ruyi device provision</h1>}>
          {() => {
            const DeviceConsole =
              require('../../components/DeviceProvision/DeviceConsole').default;
            return <DeviceConsole />;
          }}
        </BrowserOnly>
        <MarkdownCard className={styles.guide}>
          <Guide />
        </MarkdownCard>
      </main>
    </Layout>
  );
}
