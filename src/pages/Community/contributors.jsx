import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import ReactDOM from "react-dom";
import styles from "./community.module.css";

const GithubIcon = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const AvatarWithGithub = ({ avatarUrl, name, githubUrl, sizeClass = "" }) => (
  <div className={`${styles.avatarWrapper} ${sizeClass}`}>
    <img
      src={avatarUrl}
      alt={`${name}'s avatar`}
      className={styles.avatarImage}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/192x192/e0e0e0/757575?text=Avatar`;
      }}
    />
    {githubUrl && (
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubIconOnAvatar}>
        <GithubIcon size={20} className={styles.githubIconSvg} />
      </a>
    )}
  </div>
);

const ContributorCard = ({ person }) => {
  const { name, avatarUrl, github } = person;
  return (
    <div className={styles.contributorCard}>
      <AvatarWithGithub avatarUrl={avatarUrl} name={name} githubUrl={github} sizeClass={styles.avatarSmall} />
      <p className={styles.contributorName}>{name}</p>
    </div>
  );
};

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

export default function ContributorsPage() {
  const [isClient, setIsClient] = useState(false);

  // Try to load generated contributors file produced at build time
  let initialPeopleData = { coreTeam: [], interns: [], contributors: [] };
  try {
    // This will be present after running the generate script during build/dev start
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const generated = require('./generated_contributors.json');
    if (generated && Array.isArray(generated.contributors)) {
      initialPeopleData = generated;
    }
  } catch (e) {
    // ignore, will fallback to locale JSON in effect below
  }

  const [peopleData, setPeopleData] = useState(initialPeopleData);

  useEffect(() => {
    setIsClient(true);
    const detectedLocale = typeof window !== 'undefined' ? (window.location.pathname.split('/').filter(Boolean)[0] || 'zh-Hans') : 'zh-Hans';

    // If generated data isn't available, use local peoples_*.json fallback
    if (!peopleData || !(peopleData.contributors || []).length) {
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const module = require(`./peoples_${detectedLocale === 'zh-Hans' ? 'zh-Hans' : detectedLocale}.json`);
        setPeopleData(module);
      } catch (e) {
        try {
          // eslint-disable-next-line import/no-dynamic-require, global-require
          const module = require('./peoples_en.json');
          setPeopleData(module);
        } catch (err) {
          setPeopleData({ coreTeam: [], interns: [], contributors: [] });
        }
      }
    }
  }, []);

  const allPeople = [
    ...(peopleData.coreTeam || []),
    ...(peopleData.interns || []),
    ...(peopleData.contributors || []),
  ];

  return (
    <Layout title="Contributors" description="RuyiSDK 贡献者">
      <PageBackground isClient={isClient} />
      <div className={styles.pageWrapper}>
        <div className={styles.contentContainer}>
          {/* Title and intro removed per request */}

          <h2 className={styles.sectionHeader}><Translate id="community.contributors.title">贡献者</Translate></h2>
          <p className={`${styles.communityIntroText} ${styles.subtitleCentered}`}>
            <Translate id="community.contributors.subtitle">RuyiSDK社区由贡献者们共同驱动。</Translate>
          </p>
          <div className={`${styles.glassContainer} ${styles.contributorGrid}`}>
            {allPeople.map((p, i) => (
              <ContributorCard key={p.id ? `${p.id}` : `p-${i}`} person={p} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
