import React, { useState, useEffect } from "react";
import { IconUser, IconGitCommit, IconGitPullRequest, IconCircleDot } from '@tabler/icons-react';
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import ReactDOM from "react-dom";

const AvatarWithGithub = ({ avatarUrl, name, githubUrl, sizeClass = "w-20 h-20" }) => {
  const img = (
    <img
      src={avatarUrl}
      alt={`${name}'s avatar`}
      className={`w-full h-full object-cover rounded-full`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/192x192/e0e0e0/757575?text=Avatar`;
      }}
    />
  );

  // If a GitHub URL is provided, wrap the avatar in a link. Otherwise just render the image container.
  return (
    <div className={`relative rounded-full overflow-hidden shadow-lg ${sizeClass}`}>
      {githubUrl ? (
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name}'s GitHub profile`} className="block w-full h-full">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
};

const ContributorCard = ({ person }) => {
  const { name, avatarUrl, github } = person;
  // Responsive avatar sizing: small screens show slightly smaller avatars, scale up on larger viewports
  const sizeClass = "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28";
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-2 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03]">
      <AvatarWithGithub avatarUrl={avatarUrl} name={name} githubUrl={github} sizeClass={sizeClass} />
      {github ? (
        <a href={github} target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base md:text-lg font-semibold !text-slate-900 visited:!text-slate-900 text-center truncate max-w-[12rem] hover:underline">
          {name}
        </a>
      ) : (
        <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 text-center truncate max-w-[12rem]">{name}</p>
      )}
    </div>
  );
};

export default function ContributorsPage() {
  const [isClient, setIsClient] = useState(false);

  // Try to load generated contributors file produced at build time
  let initialPeopleData = { coreTeam: [], interns: [], contributors: [] };
  try {
    // This will be present after running the generate script during build/dev start
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const generated = require('@site/static/data/generated_contributors.json');
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
    // TODO: core teams, should remove these code
    if (!peopleData || !(peopleData.contributors || []).length) {
      try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const module = require(`@site/src/components/Community/peoples_${detectedLocale === 'zh-Hans' ? 'zh-Hans' : detectedLocale}.json`);
        setPeopleData(module);
      } catch (e) {
        try {
          // eslint-disable-next-line import/no-dynamic-require, global-require
          const module = require('@site/src/components/Community/peoples_en.json');
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

  // `peopleData.totals` comes from the generated JSON; fall back gracefully when unavailable
  const totals = (peopleData && peopleData.totals) || { contributors: allPeople.length, commits: null, pullRequests: null, issues: null };

  return (
    <Layout title="Contributors" description="RuyiSDK 贡献者">
      <PageBackground isClient={isClient} />
      <div className={`relative overflow-hidden px-6 py-8 text-gray-800 font-inter` }>
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site">
          {/* Title and intro removed per request */}

          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 drop-shadow-sm mt-6 mb-8"><Translate id="community.contributors.title">贡献者</Translate></h2>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed text-center mb-7">
            <Translate id="community.contributors.subtitle">RuyiSDK社区由贡献者们共同驱动。</Translate>
          </p>
          {/* Totals / stats bar (populated at build time by generator) */}
          <div className="flex flex-wrap gap-4 justify-center items-stretch my-4 md:my-6">
            <div className="flex-1 min-w-[140px] bg-white/90 rounded-xl p-3 flex flex-col items-center shadow-md transition-transform duration-200 hover:scale-105">
              <div className="text-slate-900 mb-1 text-2xl"><IconUser size={28} stroke={1.5} color="black" /></div>
              <div className="text-slate-500 text-sm mb-1"><Translate id="community.stats.contributors">Contributors</Translate></div>
              <div className="font-extrabold text-slate-900 text-2xl">{totals.contributors ?? allPeople.length}</div>
            </div>
            <div className="flex-1 min-w-[140px] bg-white/90 rounded-xl p-3 flex flex-col items-center shadow-md transition-transform duration-200 hover:scale-105">
              <div className="text-slate-900 mb-1 text-2xl"><IconGitCommit size={28} stroke={1.5} color="black" style={{transform: 'rotate(90deg)'}} /></div>
              <div className="text-slate-500 text-sm mb-1"><Translate id="community.stats.commits">Commits</Translate></div>
              <div className="font-extrabold text-slate-900 text-2xl">{typeof totals.commits === 'number' ? totals.commits : <Translate id="community.stats.unknown">N/A</Translate>}</div>
            </div>
            <div className="flex-1 min-w-[140px] bg-white/90 rounded-xl p-3 flex flex-col items-center shadow-md transition-transform duration-200 hover:scale-105">
              <div className="text-slate-900 mb-1 text-2xl"><IconGitPullRequest size={28} stroke={1.5} color="black" /></div>
              <div className="text-slate-500 text-sm mb-1"><Translate id="community.stats.prs">Pull Requests</Translate></div>
              <div className="font-extrabold text-slate-900 text-2xl">{typeof totals.pullRequests === 'number' ? totals.pullRequests : <Translate id="community.stats.unknown">N/A</Translate>}</div>
            </div>
            {/* issues count card */}
            <div className="flex-1 min-w-[140px] bg-white/90 rounded-xl p-3 flex flex-col items-center shadow-md transition-transform duration-200 hover:scale-105">
              <div className="text-slate-900 mb-1 text-2xl"><IconCircleDot size={28} stroke={1.5} color="black" /></div>
              <div className="text-slate-500 text-sm mb-1"><Translate id="community.stats.issues">Issues</Translate></div>
              <div className="font-extrabold text-slate-900 text-2xl">{typeof totals.issues === 'number' ? totals.issues : <Translate id="community.stats.unknown">N/A</Translate>}</div>
            </div>
          </div>

            <div className="bg-white/45 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-6 mt-6">
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center items-start">
              {allPeople.map((p, i) => (
                <ContributorCard key={p.id ? `${p.id}` : `p-${i}`} person={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// PageBackground: keep portal but replace CSS-based blobs with inline/Tailwind utilities
function PageBackground({ isClient }) {
  if (!isClient) return null;
  return ReactDOM.createPortal(
    <div>
      <div
        aria-hidden
        className="fixed top-0 left-0 rounded-full -z-10"
        style={{ width: 600, height: 600, background: 'rgba(221, 190, 221, 0.2)', filter: 'blur(120px)' }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 right-0 rounded-full -z-10"
        style={{ width: 700, height: 700, background: 'rgba(168, 218, 220, 0.2)', filter: 'blur(120px)' }}
      />
    </div>,
    document.body,
  );
}
