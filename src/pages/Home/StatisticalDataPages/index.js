import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import StatisticalData from '../../../components/common/StatisticalData';
import { translate } from "@docusaurus/Translate";
import { GithubOutlined, StarOutlined, ForkOutlined, IssuesCloseOutlined, CodeOutlined, EyeOutlined } from '@ant-design/icons';

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
            // Try to fetch a local cached JSON from the static /data path at runtime.
            // Using fetch avoids webpack trying to resolve the file at build time.
            if (typeof window !== 'undefined' && window.fetch) {
              const resp = await fetch('/data/github-stats.json');
              if (resp.ok) {
                const local = await resp.json();
                const stats = {
                  stars: local.stars || 0,
                  forks: local.forks || 0,
                  issues: local.issues || 0,
                  commits: local.commits || 0,
                  watchers: local.watchers || 0,
                };
                setGithubData(stats);
              } else {
                console.warn('Local /data/github-stats.json not available (status ' + resp.status + '), skipping GitHub fetch in development.');
                setGithubData(null);
              }
            } else {
              setGithubData(null);
            }
          } catch (e) {
            console.warn('Local github-stats.json not available, skipping GitHub fetch in development.', e);
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
      <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] relative overflow-hidden flex flex-col font-sans">
        <div className="relative z-20 text-center pt-14 px-8 pb-6 bg-transparent border-b border-[rgba(0,0,0,0.06)]">
          <h1 className="m-0 mb-4 text-[clamp(1.8rem,4vw,3rem)] font-extrabold text-[#0A2C7E]">
            {translate({ id: "RuyiSDK 数据统计", message: "RuyiSDK 数据统计" })}
          </h1>

          <p className="flex items-center justify-center gap-4 my-2 text-sm text-[#6a737d] flex-wrap transition-all duration-300 ease-in-out hover:-translate-y-[1px]">
            <GithubOutlined className="text-[#24292e] text-base mr-2" />
            {loading ? (
              <span className="text-[#6a737d] text-sm italic">
                {translate({ id: "加载中...", message: "Loading..." })}
              </span>
            ) : githubData ? (
              <>
                <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                  <StarOutlined className="text-[#FFD700] text-sm" />
                  {githubData.stars}
                </span>
                <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                  <ForkOutlined className="text-[#1890FF] text-sm" />
                  {githubData.forks}
                </span>
                <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                  <IssuesCloseOutlined className="text-[#FF4D4F] text-sm" />
                  {githubData.issues}
                </span>
                <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                  <CodeOutlined className="text-[#52C41A] text-sm" />
                  {githubData.commits}
                </span>
                <span className="flex items-center gap-1 font-medium whitespace-nowrap">
                  <EyeOutlined className="text-[#722ED1] text-sm" />
                  {githubData.watchers}
                </span>
              </>
            ) : (
              <span className="text-[#6a737d] text-sm italic">
                {translate({ id: "GitHub数据不可用", message: "GitHub data unavailable" })}
              </span>
            )}
          </p>
        </div>

        <div className="relative z-20 flex-1 flex justify-center items-start pt-10 pb-16 px-6">
          <div className="w-full max-w-site mx-auto">
            <StatisticalData />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StatisticalDataPages;
