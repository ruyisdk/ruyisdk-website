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
          
          <div className={styles.githubStats}>
            <GithubOutlined className={styles.githubIcon} />
            <span className={styles.githubText}>
              {loading ? (
                "Loading GitHub stats..."
              ) : githubData ? (
                <>
                  <span className={styles.statItem}>
                    <StarOutlined className={styles.statIcon} />
                    {githubData.stars}
                  </span>
                  <span className={styles.statItem}>
                    <ForkOutlined className={styles.statIcon} />
                    {githubData.forks}
                  </span>
                  <span className={styles.statItem}>
                    <IssuesCloseOutlined className={styles.statIcon} />
                    {githubData.issues}
                  </span>
                  <span className={styles.statItem}>
                    <CodeOutlined className={styles.statIcon} />
                    {githubData.commits}
                  </span>
                  <span className={styles.statItem}>
                    <EyeOutlined className={styles.statIcon} />
                    {githubData.watchers}
                  </span>
                </>
              ) : (
                "GitHub stats unavailable"
              )}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <StatisticalData />
        </div>
      </div>
    </Layout>
  );
}

export default StatisticalDataPages;
