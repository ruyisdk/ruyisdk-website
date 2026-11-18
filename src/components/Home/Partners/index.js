import Translate from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import React from "react";
import styles from "./styles.module.css";

const Partners = ({ partners, noWrapper = false }) => {
  const grid = (
    <div className={styles.grid}>
      {partners.map((partner) => (
        <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer" className="group block">
          <div className="flex justify-center items-center w-full aspect-5/2 rounded-xl border border-slate-200/60 bg-slate-50/70 transition-all duration-300 ease-in-out group-hover:border-[#0A2C7E]/20 group-hover:bg-white group-hover:shadow-[0_8px_20px_rgba(10,44,126,0.08)] dark:bg-[#f1f5f9]/95 dark:border-white/15 dark:group-hover:bg-white dark:group-hover:border-[#79a8ff]/40">
            <img
              src={partner.logoUrl}
              alt={partner.name}
              className="w-[var(--partner-logo-width,82%)] h-auto max-h-full object-contain"
              style={{ "--partner-logo-width": partner.logoWidth }}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x80/ffffff/000000?text=" + partner.name; }}
            />
          </div>
        </a>
      ))}
    </div>
  );

  if (noWrapper) {
    return grid;
  }

  return (
    <div className="bg-white/92 border-slate-200/85 backdrop-blur-md rounded-2xl border shadow-[0_10px_28px_rgba(10,44,126,0.06)] dark:bg-[#151b23] dark:border-white/10 p-6 mt-6">
      {grid}
    </div>
  );
};

const partnersData = [
    { id: 1, name: "Deepin", logoUrl: "/img/home/partners/about-partners-deepin.webp", url: "https://www.deepin.org/", logoWidth: "92%" },
    { id: 2, name: "openCloudOS", logoUrl: "/img/home/partners/about-partners-opencloudos.webp", url: "https://opencloudos.org/", logoWidth: "78%" },
    { id: 3, name: "openKylin", logoUrl: "/img/home/partners/about-partners-openkylin.webp", url: "https://www.openkylin.top/", logoWidth: "91%" },
    { id: 4, name: "苦芽科技", logoUrl: "/img/home/partners/about-partners-kubuds.webp", url: "https://kubuds.io/ch/" },
    { id: 5, name: "玄铁", logoUrl: "/img/home/partners/about-partners-xuantie.webp", url: "https://www.xrvm.cn/" },
    { id: 6, name: "Sipeed", logoUrl: "/img/home/partners/about-partners-sipeed.webp", url: "https://sipeed.com/" },
    { id: 7, name: "嘉楠科技", logoUrl: "/img/home/partners/about-partners-canaan.webp", url: "https://www.canaan.io/" },
    { id: 8, name: "赛昉科技", logoUrl: "/img/home/partners/about-partners-starfive.webp", url: "https://starfivetech.com/", logoWidth: "66%" },
    { id: 9, name: "英麟智能", logoUrl: "/img/home/partners/about-partners-inchi.webp", url: "http://www.inchitech.com/", logoWidth: "62%" },
    { id: 10, name: "Jeandle", logoUrl: "/img/home/partners/about-partners-jeandle.webp", url: "https://github.com/jeandle" },
    { id: 11, name: "Milk-V", logoUrl: "/img/home/partners/about-partners-milkv.webp", url: "https://milkv.io/", logoWidth: "64%" },
    { id: 12, name: "算能科技", logoUrl: "/img/home/partners/about-partners-sophgo.webp", url: "https://www.sophgo.com/", logoWidth: "70%" },
    { id: 13, name: "秦派软件", logoUrl: "/img/home/partners/about-partners-qinware.webp", url: "https://www.qinware.com/", logoWidth: "59%" },
    { id: 14, name: "匠芯创", logoUrl: "/img/home/partners/about-partners-artinchip.webp", url: "https://www.artinchip.com/", logoWidth: "74%" },
    { id: 15, name: "跃昉科技", logoUrl: "/img/home/partners/about-partners-leapfive.webp", url: "https://www.leapfive.com/", logoWidth: "81%" },
    { id: 16, name: "进迭时空", logoUrl: "/img/home/partners/about-partners-spacemit.webp", url: "https://www.spacemit.com/" },
  ];

export default function PartnersSection() {
  // convenience wrapper with title and padding; when used on the about page we only want the
  // outer card, so ask <Partners> not to render its own inner box.
  return (
    <div className={`bg-white/92 backdrop-blur-md rounded-2xl border border-slate-200/85 shadow-[0_12px_32px_rgba(10,44,126,0.06)] dark:bg-[#151b23] dark:border-white/10 py-5 sm:py-8 ${styles.section}`}>
      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-4">
      <p className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-(--home-title-color)">
        <Translate id='home.partners.title'>合作伙伴</Translate>
      </p>
      <Link
        to="/docs/Other/partner-guide"
        className="text-sm font-medium"
      >
        <Translate id="home.partners.joindoc">生态接入指南</Translate>&nbsp;&gt;
      </Link>
      </div>
      <div className="mt-6">
        <Partners partners={partnersData} noWrapper />
      </div>
    </div>
  );
}
