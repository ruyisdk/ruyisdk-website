import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import Translate from "@docusaurus/Translate";
import ReactDOM from "react-dom";

const Partners = ({ partners }) => (
  <div className="bg-white/45 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-6 mt-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
      {partners.map((partner) => (
        <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer" className="block transform transition hover:scale-105">
          <div className="flex justify-center">
            <img src={partner.logoUrl} alt={partner.name} className="h-20 object-contain"
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
      <div className="relative overflow-hidden px-6 py-8 text-gray-800">
        <div className="mx-auto relative z-10 max-w-screen-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mt-6 mb-4"><Translate id="community.partners.title">合作伙伴</Translate></h2>
          <p className="text-gray-500 text-lg text-center mb-6"><Translate id="community.partners.subtitle">RuyiSDK合作伙伴</Translate></p>
          <Partners partners={partnersData} />
        </div>
      </div>
    </Layout>
  );
}
