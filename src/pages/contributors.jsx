import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";

import PageBackground from "@site/src/components/common/PageBackground";
import ContributorCard from "@site/src/components/Contributors/ContributorCard";
import { StatIconCommit, StatIconPR, StatIconUser } from "@site/src/components/Contributors/StatIcons";

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

  const totals = (peopleData && peopleData.totals) || { contributors: allPeople.length, commits: null, pullRequests: null };

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
              <div className="text-slate-900 mb-1 text-2xl"><StatIconUser /></div>
              <div className="text-slate-500 text-sm mb-1"><Translate id="community.stats.contributors">Contributors</Translate></div>
              <div className="font-extrabold text-slate-900 text-2xl">{totals.contributors ?? allPeople.length}</div>
            </div>
            <div className="flex-1 min-w-[140px] bg-white/90 rounded-xl p-3 flex flex-col items-center shadow-md transition-transform duration-200 hover:scale-105">
              <div className="text-slate-900 mb-1 text-2xl"><StatIconCommit /></div>
              <div className="text-slate-500 text-sm mb-1"><Translate id="community.stats.commits">Commits</Translate></div>
              <div className="font-extrabold text-slate-900 text-2xl">{typeof totals.commits === 'number' ? totals.commits : <Translate id="community.stats.unknown">N/A</Translate>}</div>
            </div>
            <div className="flex-1 min-w-[140px] bg-white/90 rounded-xl p-3 flex flex-col items-center shadow-md transition-transform duration-200 hover:scale-105">
              <div className="text-slate-900 mb-1 text-2xl"><StatIconPR /></div>
              <div className="text-slate-500 text-sm mb-1"><Translate id="community.stats.prs">Pull Requests</Translate></div>
              <div className="font-extrabold text-slate-900 text-2xl">{typeof totals.pullRequests === 'number' ? totals.pullRequests : <Translate id="community.stats.unknown">N/A</Translate>}</div>
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
