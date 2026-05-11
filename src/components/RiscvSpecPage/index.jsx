import React from "react";
import SpecOverview from "@site/drafts/riscv-spec-page-content/spec-overview.md";
import specCards from "@site/drafts/riscv-spec-page-content/spec-cards.json";

import styles from "./styles.module.css";

const CATEGORY_ORDER = [
  "Core Architecture",
  "Profiles",
  "Hardware",
  "Debug, Trace, and RAS",
  "Platform Software",
  "Application Enablement",
];

const CATEGORY_DESCRIPTIONS = {
  "Core Architecture": "理解处理器、指令、特权级和中断等基础运行模型。",
  Profiles: "理解不同平台应具备的能力组合，辅助判断软件生态兼容性。",
  Hardware: "面向 SoC、外设、IOMMU、服务器平台和资源管理等硬件实现问题。",
  "Debug, Trace, and RAS": "面向调试、执行追踪、错误记录和可靠性分析相关能力。",
  "Platform Software": "面向固件、启动、SBI、UEFI 和平台管理等系统软件接口。",
  "Application Enablement": "面向 ABI、应用移植、semihosting 和向量 intrinsic 等工具链支持。",
};

const AUDIENCE_GUIDES = [
  {
    audience: "关注 ISA 基础",
    category: "Core Architecture",
    description: "先理解普通程序、特权级、异常和中断等基础运行模型。",
  },
  {
    audience: "关注系统软件/固件",
    category: "Platform Software",
    description: "优先看启动、SBI、UEFI 和平台管理接口，贴近日常系统适配工作。",
  },
  {
    audience: "关注软件生态兼容",
    category: "Profiles",
    description: "用 Profiles 判断目标平台是否具备软件期望的基础能力组合。",
  },
  {
    audience: "关注硬件/SoC/平台验证",
    category: "Hardware",
    description: "关注 IOMMU、PLIC、Server SoC、QoS 等平台集成和硬件接口。",
  },
  {
    audience: "关注调试/追踪/bring-up",
    category: "Debug, Trace, and RAS",
    description: "从调试模型、trace 数据和错误记录接口入手，定位底层问题。",
  },
  {
    audience: "关注编译器/运行库/向量库",
    category: "Application Enablement",
    description: "重点看 ABI、semihosting 和 Vector Intrinsic，服务应用移植与优化。",
  },
];

function groupCardsByCategory(cards) {
  return cards.reduce((groups, card) => {
    if (!groups[card.category]) {
      groups[card.category] = [];
    }
    groups[card.category].push(card);
    return groups;
  }, {});
}

function toSectionId(category) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function CategoryNav({ groupedCards }) {
  return (
    <nav className={styles.categoryNav} aria-label="RISC-V Specs 分类导航">
      {CATEGORY_ORDER.map((category) => (
        <a key={category} href={`#${toSectionId(category)}`}>
          <span>{category}</span>
          <strong>{groupedCards[category]?.length || 0}</strong>
        </a>
      ))}
    </nav>
  );
}

function AudienceGuide() {
  return (
    <section className={styles.audienceGuide} aria-labelledby="audience-guide-title">
      <div className={styles.guideHeader}>
        <h2 id="audience-guide-title">按关注点阅读</h2>
      </div>

      <div className={styles.guideGrid}>
        {AUDIENCE_GUIDES.map((item) => (
          <a key={item.audience} className={styles.guideCard} href={`#${toSectionId(item.category)}`}>
            <span className={styles.guideBadge}>{item.audience}</span>
            <strong>
              对应分类：
              <span>{item.category}</span>
            </strong>
            <p>{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function SpecCard({ spec }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>{spec.titleZh}</h3>
          <p className={styles.cardSubtitle}>{spec.titleEn}</p>
        </div>
        <span className={styles.version}>{spec.version}</span>
      </div>

      <p className={styles.summary}>
        <span>简介：</span>
        {spec.summary}
      </p>
      <p className={styles.audience}>
        <span>面向对象：</span>
        {spec.audience}
      </p>

      <div className={styles.cardFooter}>
        <span className={styles.date}>镜像日期：{spec.mirrorDate}</span>
        <a
          className={styles.downloadButton}
          href={spec.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          下载 PDF
        </a>
      </div>
    </article>
  );
}

function CategorySection({ category, specs }) {
  return (
    <section className={styles.categorySection} id={toSectionId(category)}>
      <div className={styles.categoryHeader}>
        <div>
          <h2>{category}</h2>
          <p>{CATEGORY_DESCRIPTIONS[category]}</p>
        </div>
        <span>{specs.length} 份规范</span>
      </div>

      <div className={styles.cardGrid}>
        {specs.map((spec) => (
          <SpecCard key={spec.id} spec={spec} />
        ))}
      </div>
    </section>
  );
}

export default function RiscvSpecPage() {
  const groupedCards = groupCardsByCategory(specCards);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.overview}>
          <div className={styles.overviewContent}>
            <SpecOverview />
          </div>

          <AudienceGuide />
          <CategoryNav groupedCards={groupedCards} />
        </section>

        <section className={styles.specs} aria-label="RISC-V Ratified Specs 分类列表">
          {CATEGORY_ORDER.map((category) => (
            <CategorySection
              key={category}
              category={category}
              specs={groupedCards[category] || []}
            />
          ))}
        </section>

        <p className={styles.pageNote}>
          备注：本页用于导览和下载镜像定位；相应技术标准请以{" "}
          <a href="https://docs.riscv.org/reference/home/index.html" target="_blank" rel="noopener noreferrer">
            RISC-V International 官方技术网站
          </a>{" "}
          为准。
        </p>
      </div>
    </main>
  );
}
