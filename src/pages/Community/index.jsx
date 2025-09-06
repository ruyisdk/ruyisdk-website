import React from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import styles from "./community.module.css";

export default function CommunityHub() {
  return (
    <Layout title="Community" description="RuyiSDK 社区页面">
      <div className={styles.pageWrapper}>
        <div className={styles.contentContainer}>
          <h1 className={styles.sectionHeader}>
            <Translate>RuyiSDK 社区</Translate>
          </h1>

          <p className={styles.leadText}>
            <Translate id="community.hub.lead">RuyiSDK 是一个开放、包容的社区，我们欢迎每一位对 RISC-V 与开源软件感兴趣的贡献者参与其中。</Translate>
          </p>

          <div className={styles.hubGrid}>
            <div className={styles.hubCard}>
              <div className={styles.hubCardTitle}><Translate>贡献者</Translate></div>
              <div className={styles.hubCardDesc}><Translate id="community.hub.contributors.desc">查看并感谢为项目做出贡献的个人与组织。</Translate></div>
              <a href="/Community/contributors" className={styles.linkItem}><Translate>前往查看 →</Translate></a>
            </div>
            <div className={styles.hubCard}>
              <div className={styles.hubCardTitle}><Translate>社区共建计划</Translate></div>
              <div className={styles.hubCardDesc}><Translate id="community.hub.partners.desc">了解我们的合作伙伴与共建项目，发现合作机会。</Translate></div>
              <a href="/Community/partners" className={styles.linkItem}><Translate>前往查看 →</Translate></a>
            </div>
            <div className={styles.hubCard}>
              <div className={styles.hubCardTitle}><Translate>贡献者公约</Translate></div>
              <div className={styles.hubCardDesc}><Translate id="community.hub.code.desc">阅读社区行为准则，确保友好与高质量的协作。</Translate></div>
              <a href="/code_of_conduct" className={styles.linkItem}><Translate>前往查看 →</Translate></a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
