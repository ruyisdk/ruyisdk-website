import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import StatisticalData from '../../../components/common/StatisticalData';
import { translate } from "@docusaurus/Translate";
import { GithubOutlined, StarOutlined, ForkOutlined, IssuesCloseOutlined, CodeOutlined, EyeOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";

const StatisticalDataPages = () => {
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setLoading(true);
        // In development, avoid hitting GitHub API to speed up dev preview and avoid rate limits.
        if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
          try {
            // Use local cached data when available
            // eslint-disable-next-line global-require, import/no-dynamic-require
            const local = require('../../../data/github-stats.json');
            const stats = {
              stars: local.stars || 0,
              forks: local.forks || 0,
              issues: local.issues || 0,
              commits: local.commits || 0,
              watchers: local.watchers || 0,
            };
            setGithubData(stats);
          } catch (e) {
            console.warn('Local github-stats.json not available, skipping GitHub fetch in development.');
            setGithubData(null);
          }
        } else {
          const response = await fetch('https://api.github.com/repos/ruyisdk/ruyi');

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const repoData = await response.json();

          const stats = {
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            issues: repoData.open_issues_count,
            commits: repoData.size,
            watchers: repoData.watchers_count
          };

          setGithubData(stats);
        }
      } catch (err) {
        console.error('Failed to fetch GitHub stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  return (
    <Layout title="Data Panel" description="RuyiSDK Data Panel">
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {translate({ id: "RuyiSDK 数据统计", message: "RuyiSDK 数据统计" })}
          </h1>
          
          <p className={styles.githubStats}>
            <GithubOutlined className={styles.githubIcon} />
            {loading ? (
              <span className={styles.loadingText}>
                {translate({ id: "加载中...", message: "Loading..." })}
              </span>
            ) : githubData ? (
              <>
                <span className={styles.statItem}>
                  <StarOutlined className={styles.starIcon} />
                  {githubData.stars}
                </span>
                <span className={styles.statItem}>
                  <ForkOutlined className={styles.forkIcon} />
                  {githubData.forks}
                </span>
                <span className={styles.statItem}>
                  <IssuesCloseOutlined className={styles.issueIcon} />
                  {githubData.issues}
                </span>
                <span className={styles.statItem}>
                  <CodeOutlined className={styles.commitIcon} />
                  {githubData.commits}
                </span>
                <span className={styles.statItem}>
                  <EyeOutlined className={styles.watcherIcon} />
                  {githubData.watchers}
                </span>
              </>
            ) : (
              <span className={styles.errorText}>
                {translate({ id: "GitHub数据不可用", message: "GitHub data unavailable" })}
              </span>
            )}
          </p>
        </div>

        <div className={styles.content}>
          <StatisticalData />
        </div>
      </div>
    </Layout>
  );
}

export default StatisticalDataPages;
