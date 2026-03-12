import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import { translate } from "@docusaurus/Translate";
import ReactDOM from "react-dom";

const Partners = ({ partners, noWrapper = false }) => {
  const grid = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
      {partners.map((partner) => (
        <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer" className="block transform transition-transform duration-300 ease-in-out hover:scale-105">
          <div className="flex justify-center">
            <img src={partner.logoUrl} alt={partner.name} className={`h-20 object-contain transition-shadow duration-300 ease-in-out hover:shadow-lg ${partner.logoClass || ''}`}
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
    <div className="bg-white/45 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-6 mt-6">
      {grid}
    </div>
  );
};

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

export const partnersData = [
    { id: 1, name: "Deepin", logoUrl: "https://storage.deepin.org/thread/202305231040315865_1.png", url: "https://www.deepin.org/", logoClass: "h-24" },
    { id: 2, name: "openCloudOS", logoUrl: "https://opencloudos.org/assets/logo-C2hewUFH.png", url: "https://opencloudos.org/" },
    { id: 3, name: "openKylin", logoUrl: "https://www.openkylin.top/upload/202209/1664440595.png", url: "https://www.openkylin.top/" },
    { id: 4, name: "苦芽科技", logoUrl: "https://kubuds.io/assets/img/logos/kubuds_en.webp", url: "https://kubuds.io/ch/" },
    { id: 5, name: "玄铁", logoUrl: "https://img.alicdn.com/imgextra/i2/O1CN01i43OVP1sjpL2Qkkge_!!6000000005803-2-tps-209-38.png", url: "https://www.xrvm.cn/", logoClass: "bg-[#8145e2]" },
    { id: 6, name: "算能科技", logoUrl: "https://sophon-assets.sophon.cn/sophon-prod-s3/assets/images/sophgo-logo-new3.png", url: "https://www.sophgo.com/" },
    { id: 7, name: "Milk-V", logoUrl: "https://www.fedoravforce.org/partner-logo/milkv.png", url: "https://milkv.io/" },
    { id: 8, name: "Sipeed", logoUrl: "https://www.fedoravforce.org/partner-logo/sipeed.png", url: "https://sipeed.com/" },
    { id: 9, name: "英麟智能", logoUrl: "http://pro557598cf.pic11.ysjianzhan.cn/upload/logo2-02.jpg", url: "http://www.inchitech.com/" },
    { id: 10, name: "赛昉科技", logoUrl: "https://starfivetech.com/themes/basic/skin/images/logo1.png", url: "https://starfivetech.com/", logoClass: "h-24" },
    { id: 11, name: "嘉楠科技", logoUrl: "https://static.canaan.io/prod/u_file/2401/29/logo-1bdb.png?x-oss-process=image/quality,q_80/resize,m_lfit,h_0,w_1920", url: "https://www.canaan.io/", logoClass: "h-24" },
    { id: 12, name: "秦派软件", logoUrl: "https://www.qinware.com/images/common/qinware.png", url: "https://www.qinware.com/" },
    { id: 13, name: "匠芯创", logoUrl: "https://www.artinchip.com/upload/images/site/20231226/17035607408910353.png", url: "https://www.artinchip.com/" },
    { id: 14, name: "跃昉科技", logoUrl: "https://omo-oss-image.thefastimg.com/portal-saas/pg2024081421440948431/cms/image/bfeababb-b487-4483-8fad-fcf46229bbbf.png", url: "https://www.leapfive.com/" },
  ];

export function PartnersSection() {
  // convenience wrapper with title and padding; when used on the about page we only want the
  // outer card, so ask <Partners> not to render its own inner box.
  return (
    <div className="bg-white/45 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4">
        {translate({id: 'community.partners.title', message: '合作伙伴'})}
      </h2>
      <div className="mt-6">
        <Partners partners={partnersData} noWrapper />
      </div>
    </div>
  );
}

export default function PartnersPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <Layout
      title={translate({id: 'community.partners.meta.title', message: 'Community Partners'})}
      description={translate({id: 'community.partners.meta.description', message: '社区共建计划'})}
    >
      <PageBackground isClient={isClient} />
      <div className="relative overflow-hidden px-6 py-8 text-gray-800">
        <div className="mx-auto relative z-10 max-w-screen-xl max-w-site">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mt-6 mb-4">
            {translate({id: 'community.partners.title', message: '合作伙伴'})}
          </h2>
          <p className="text-gray-500 text-lg text-center mb-6">
            {translate({id: 'community.partners.subtitle', message: 'RuyiSDK合作伙伴'})}
          </p>
          <Partners partners={partnersData} />
        </div>
      </div>
    </Layout>
  );
}
