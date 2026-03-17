import Translate from "@docusaurus/Translate";
import React from "react";

const Partners = ({ partners, noWrapper = false }) => {
  const grid = (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {partners.map((partner) => (
        <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer" className="group block">
          <div className="flex justify-center items-center w-full aspect-5/2 p-1 rounded-sm transition-shadow duration-300 ease-in-out group-hover:shadow-lg">
            <img src={partner.logoUrl} alt={partner.name} className={`max-h-full max-w-full object-contain ${partner.logoClass || ''}`}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x80/ffffff/000000?text=" + partner.name; }} />
          </div>
        </a>
      ))}
    </div>
  );

  if (noWrapper) {
    return grid;
  }

  return (
    <div className="bg-white/45 border-white/60 backdrop-blur-md rounded-2xl border shadow-lg p-6 mt-6">
      {grid}
    </div>
  );
};

const partnersData = [
    { id: 1, name: "Deepin", logoUrl: "/img/about-partners-deepin.png", url: "https://www.deepin.org/", logoClass: "lg:scale-110" },
    { id: 2, name: "openCloudOS", logoUrl: "/img/about-partners-opencloudos.png", url: "https://opencloudos.org/" },
    { id: 3, name: "openKylin", logoUrl: "/img/about-partners-openkylin.png", url: "https://www.openkylin.top/" },
    { id: 4, name: "苦芽科技", logoUrl: "/img/about-partners-kubuds.webp", url: "https://kubuds.io/ch/", logoClass: "lg:scale-90" },
    { id: 5, name: "玄铁", logoUrl: "/img/about-partners-xuantie.png", url: "https://www.xrvm.cn/", logoClass: "lg:scale-120" },
    { id: 6, name: "算能科技", logoUrl: "/img/about-partners-sophgo.png", url: "https://www.sophgo.com/", logoClass: "scale-70 lg:scale-130" },
    { id: 7, name: "Milk-V", logoUrl: "/img/about-partners-milkv.png", url: "https://milkv.io/", logoClass: "scale-70" },
    { id: 8, name: "Sipeed", logoUrl: "/img/about-partners-sipeed.png", url: "https://sipeed.com/", logoClass: "lg:scale-90" },
    { id: 9, name: "英麟智能", logoUrl: "/img/about-partners-inchi.png", url: "http://www.inchitech.com/", logoClass: "scale-120 lg:scale-100" },
    { id: 10, name: "赛昉科技", logoUrl: "/img/about-partners-starfive.png", url: "https://starfivetech.com/", logoClass: "scale-70 lg:scale-150" },
    { id: 11, name: "嘉楠科技", logoUrl: "/img/about-partners-canaan.png", url: "https://www.canaan.io/", logoClass: "lg:scale-90" },
    { id: 12, name: "秦派软件", logoUrl: "/img/about-partners-qinware.png", url: "https://www.qinware.com/" },
    { id: 13, name: "匠芯创", logoUrl: "/img/about-partners-artinchip.png", url: "https://www.artinchip.com/", logoClass: "lg:scale-120" },
    { id: 14, name: "跃昉科技", logoUrl: "/img/about-partners-leapfive.png", url: "https://www.leapfive.com/", logoClass: "lg:scale-150" },
  ];

export default function PartnersSection() {
  // convenience wrapper with title and padding; when used on the about page we only want the
  // outer card, so ask <Partners> not to render its own inner box.
  return (
    <div className="bg-white/45 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-8">
      <div className="flex justify-between items-baseline mb-4">
      <p className="text-3xl font-bold mb-4 text-(--home-title-color)">
        <Translate id='home.partners.title'>合作伙伴</Translate>
      </p>
      <a
        href="/docs/Other/partner-guide"
        className="text-sm"
      >
        <Translate id="home.partners.joindoc">生态接入指南</Translate>&nbsp;&gt;
      </a>
      </div>
      <div className="mt-6">
        <Partners partners={partnersData} noWrapper />
      </div>
    </div>
  );
}
