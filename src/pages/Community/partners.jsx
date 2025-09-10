import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import ReactDOM from "react-dom";
import styles from "./community.module.css";

const Partners = ({ partners }) => (
  <div className={styles.glassContainer}>
    <div className={styles.partnersGrid}>
      {partners.map((partner) => (
        <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer" className={styles.partnerLink}>
          <div className={styles.partnerLogoContainer}>
            <img src={partner.logoUrl} alt={partner.name} className={styles.partnerLogo}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x80/ffffff/000000?text=" + partner.name; }} />
          </div>
        </a>
      ))}
    </div>
  </div>
);

const PageBackground = ({ isClient }) => {
  if (!isClient) return null;
  return ReactDOM.createPortal(
    <div>
      <div className={`${styles.pageBlob} ${styles.pageBlob1}`} />
      <div className={`${styles.pageBlob} ${styles.pageBlob2}`} />
    </div>,
    document.body,
  );
};

export default function PartnersPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const partnersData = [
    { id: 1, name: "Milk-V", logoUrl: "https://www.fedoravforce.org/partner-logo/milkv.png", url: "https://milkv.io/" },
    { id: 2, name: "Sipeed", logoUrl: "https://www.fedoravforce.org/partner-logo/sipeed.png", url: "https://sipeed.com/" },
    { id: 3, name: "Fedora-V Force", logoUrl: "https://images.fedoravforce.org/images/fvf-logo.png", url: "https://www.fedoravforce.org/" },
  { id: 4, name: "openEuler RISC-V sig", logoUrl: "https://www.openeuler.org/assets/logo.XeUCiAZu.svg", url: "https://www.openeuler.org/en/sig/sig-detail/?name=sig-RISC-V" },
    { id: 5, name: "openKylin", logoUrl: "https://www.openkylin.top/upload/202209/1664440595.png", url: "https://www.openkylin.top/" },
  ];

  return (
    <Layout title="Community Partners" description="社区共建计划">
      <PageBackground isClient={isClient} />
      <div className={styles.pageWrapper}>
        <div className={styles.contentContainer}>
          <h2 className={styles.sectionHeader}><Translate id="community.partners.title">合作伙伴</Translate></h2>
          <p className={`${styles.communityIntroText} ${styles.subtitleCentered}`}>
            <Translate id="community.partners.subtitle">RuyiSDK合作伙伴</Translate>
          </p>
          <Partners partners={partnersData} />
        </div>
      </div>
    </Layout>
  );
}
