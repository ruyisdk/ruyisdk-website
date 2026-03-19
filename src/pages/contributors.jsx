import React, { useState, useEffect, useRef } from "react";
import { IconUser, IconUserCircle, IconGitCommit, IconGitPullRequest, IconCircleDot } from '@tabler/icons-react';

import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";

import { PageBackground } from "@site/src/components/Home/Background";

const ContributorAvatar = ({ avatarUrl, name, githubUrl}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) {
      return;
    }

    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [avatarUrl]);

  return (
    <div className={`relative rounded-full overflow-hidden shadow-lg w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28`}>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${name}'s GitHub profile`} className="block w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <IconUserCircle
            stroke={0.5}
            color="black"
            className={`w-full h-full transition-opacity duration-200 ${
              loaded ? "opacity-0" : "opacity-15"
            }`}
          />
        </div>

        <img
          ref={imgRef}
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className={`absolute inset-0 w-full h-full object-cover rounded-full transition-opacity duration-200 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
        />
      </a>
    </div>
  );
};

const ContributorCard = ({ person }) => {
  const { name, avatarUrl, github } = person;

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-2 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03]">
      <ContributorAvatar avatarUrl={avatarUrl} name={name} githubUrl={github} />

      <p className="text-sm font-semibold text-slate-900 text-center truncate lg:max-w-42 md:max-w-36 sm:max-w-24 max-w-22">{name}</p>
      </div>
  );
};

export default function ContributorsPage() {

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
      <div className={`relative min-h-screen` }>
        <PageBackground />

        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4 mt-16">

        <div className="relative mx-auto w-full z-10">
          {/* Title and intro removed per request */}

          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 drop-shadow-sm">
            <Translate id="community.contributors.title">贡献者</Translate>
          </h2>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed text-center mt-8">
            <Translate id="community.contributors.subtitle">RuyiSDK社区由贡献者们共同驱动</Translate>
          </p>
          {/* Totals / stats bar (populated at build time by generator) */}
          <div className="flex flex-wrap w-full gap-4 justify-center items-stretch mt-8">
            <div className="flex-1 min-w-[140px] bg-white/90 rounded-xl p-3 flex flex-col items-center shadow-md transition-transform duration-200 hover:scale-105">
              <div className="text-slate-900 mb-1 text-2xl"><IconUser size={28} stroke={1.5} color="black" /></div>
              <div className="text-slate-500 text-sm mb-1"><Translate id="community.stats.contributors">贡献者</Translate></div>
              <div className="font-extrabold text-slate-900 text-2xl">{totals.contributors ?? allPeople.length}</div>
            </div>
            <div className="flex-1 min-w-[140px] bg-white/90 rounded-xl p-3 flex flex-col items-center shadow-md transition-transform duration-200 hover:scale-105">
              <div className="text-slate-900 mb-1 text-2xl"><IconGitCommit size={28} stroke={1.5} color="black" style={{transform: 'rotate(90deg)'}} /></div>
              <div className="text-slate-500 text-sm mb-1"><Translate id="community.stats.commits">提交数</Translate></div>
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

          <div className="relative w-full bg-white/45 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-6 mt-8 mb-24">
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center items-start">
              {allPeople.map((p, i) => (
                <ContributorCard key={p.id ? `${p.id}` : `p-${i}`} person={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}
