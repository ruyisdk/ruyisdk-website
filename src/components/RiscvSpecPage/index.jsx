import React from "react";
import Translate, { translate } from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import SpecOverviewEn from "./content/spec-overview.en.mdx";
import SpecOverviewZhHans from "./content/spec-overview.zh-Hans.mdx";
import specCardsEn from "./content/spec-cards.en.json";
import specCardsZhHans from "./content/spec-cards.zh-Hans.json";

import styles from "./styles.module.css";

const CATEGORY_ORDER = [
  "Core Architecture",
  "Profiles",
  "Hardware",
  "Debug, Trace, and RAS",
  "Platform Software",
  "Application Enablement",
];

const LOCALIZED_CONTENT = {
  "zh-Hans": {
    Overview: SpecOverviewZhHans,
    cards: specCardsZhHans,
  },
  en: {
    Overview: SpecOverviewEn,
    cards: specCardsEn,
  },
};

const CATEGORY_DESCRIPTION_IDS = {
  "Core Architecture": {
    id: "riscvSpecs.category.core.description",
    message: "理解处理器、指令、特权级和中断等基础运行模型。",
  },
  Profiles: {
    id: "riscvSpecs.category.profiles.description",
    message: "理解不同平台应具备的能力组合，辅助判断软件生态兼容性。",
  },
  Hardware: {
    id: "riscvSpecs.category.hardware.description",
    message: "面向 SoC、外设、IOMMU、服务器平台和资源管理等硬件实现问题。",
  },
  "Debug, Trace, and RAS": {
    id: "riscvSpecs.category.debugTraceRas.description",
    message: "面向调试、执行追踪、错误记录和可靠性分析相关能力。",
  },
  "Platform Software": {
    id: "riscvSpecs.category.platformSoftware.description",
    message: "面向固件、启动、SBI、UEFI 和平台管理等系统软件接口。",
  },
  "Application Enablement": {
    id: "riscvSpecs.category.applicationEnablement.description",
    message: "面向 ABI、应用移植、semihosting 和向量 intrinsic 等工具链支持。",
  },
};

const AUDIENCE_GUIDE_MESSAGE_IDS = [
  {
    audienceId: "riscvSpecs.guide.isa.audience",
    audienceMessage: "关注 ISA 基础",
    category: "Core Architecture",
    descriptionId: "riscvSpecs.guide.isa.description",
    descriptionMessage: "先理解普通程序、特权级、异常和中断等基础运行模型。",
  },
  {
    audienceId: "riscvSpecs.guide.platformSoftware.audience",
    audienceMessage: "关注系统软件/固件",
    category: "Platform Software",
    descriptionId: "riscvSpecs.guide.platformSoftware.description",
    descriptionMessage: "优先看启动、SBI、UEFI 和平台管理接口，贴近日常系统适配工作。",
  },
  {
    audienceId: "riscvSpecs.guide.profiles.audience",
    audienceMessage: "关注软件生态兼容",
    category: "Profiles",
    descriptionId: "riscvSpecs.guide.profiles.description",
    descriptionMessage: "用 Profiles 判断目标平台是否具备软件期望的基础能力组合。",
  },
  {
    audienceId: "riscvSpecs.guide.hardware.audience",
    audienceMessage: "关注硬件/SoC/平台验证",
    category: "Hardware",
    descriptionId: "riscvSpecs.guide.hardware.description",
    descriptionMessage: "关注 IOMMU、PLIC、Server SoC、QoS 等平台集成和硬件接口。",
  },
  {
    audienceId: "riscvSpecs.guide.debugTraceRas.audience",
    audienceMessage: "关注调试/追踪/bring-up",
    category: "Debug, Trace, and RAS",
    descriptionId: "riscvSpecs.guide.debugTraceRas.description",
    descriptionMessage: "从调试模型、trace 数据和错误记录接口入手，定位底层问题。",
  },
  {
    audienceId: "riscvSpecs.guide.applicationEnablement.audience",
    audienceMessage: "关注编译器/运行库/向量库",
    category: "Application Enablement",
    descriptionId: "riscvSpecs.guide.applicationEnablement.description",
    descriptionMessage: "重点看 ABI、semihosting 和 Vector Intrinsic，服务应用移植与优化。",
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
    <nav
      className={styles.categoryNav}
      aria-label={translate({
        id: "riscvSpecs.categoryNav.ariaLabel",
        message: "RISC-V Specs 分类导航",
      })}
    >
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
        <h2 id="audience-guide-title">
          <Translate id="riscvSpecs.guide.title">按关注点阅读</Translate>
        </h2>
      </div>

      <div className={styles.guideGrid}>
        {AUDIENCE_GUIDE_MESSAGE_IDS.map((item) => (
          <a key={item.audienceId} className={styles.guideCard} href={`#${toSectionId(item.category)}`}>
            <span className={styles.guideBadge}>
              <Translate id={item.audienceId}>{item.audienceMessage}</Translate>
            </span>
            <strong>
              <Translate id="riscvSpecs.guide.categoryLabel">对应分类：</Translate>
              <span>{item.category}</span>
            </strong>
            <p>
              <Translate id={item.descriptionId}>{item.descriptionMessage}</Translate>
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}

function SpecCard({ spec }) {
  const title = spec.title || spec.titleZh;
  const subtitle = spec.subtitle || spec.titleEn;

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardSubtitle}>{subtitle}</p>
        </div>
        <span className={styles.version}>{spec.version}</span>
      </div>

      <p className={styles.summary}>
        <span>
          <Translate id="riscvSpecs.card.summaryLabel">简介：</Translate>
        </span>
        {spec.summary}
      </p>
      <p className={styles.audience}>
        <span>
          <Translate id="riscvSpecs.card.audienceLabel">面向对象：</Translate>
        </span>
        {spec.audience}
      </p>

      <div className={styles.cardFooter}>
        <span className={styles.date}>
          <Translate id="riscvSpecs.card.mirrorDate" values={{ date: spec.mirrorDate }}>
            {"镜像日期：{date}"}
          </Translate>
        </span>
        <a
          className={styles.downloadButton}
          href={spec.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Translate id="riscvSpecs.card.downloadPdf">下载 PDF</Translate>
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
          <p>
            <Translate id={CATEGORY_DESCRIPTION_IDS[category].id}>
              {CATEGORY_DESCRIPTION_IDS[category].message}
            </Translate>
          </p>
        </div>
        <span>
          <Translate id="riscvSpecs.category.count" values={{ count: specs.length }}>
            {"{count} 份规范"}
          </Translate>
        </span>
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
  const { i18n } = useDocusaurusContext();
  const localizedContent = LOCALIZED_CONTENT[i18n.currentLocale] || LOCALIZED_CONTENT["zh-Hans"];
  const SpecOverview = localizedContent.Overview;
  const specCards = localizedContent.cards;
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

        <section
          className={styles.specs}
          aria-label={translate({
            id: "riscvSpecs.specs.ariaLabel",
            message: "RISC-V Ratified Specs 分类列表",
          })}
        >
          {CATEGORY_ORDER.map((category) => (
            <CategorySection
              key={category}
              category={category}
              specs={groupedCards[category] || []}
            />
          ))}
        </section>

        <p className={styles.pageNote}>
          <Translate
            id="riscvSpecs.pageNote"
            values={{
              link: (
                <a href="https://docs.riscv.org/reference/home/index.html" target="_blank" rel="noopener noreferrer">
                  <Translate id="riscvSpecs.officialSite">RISC-V International 官方技术网站</Translate>
                </a>
              ),
            }}
          >
            {"备注：本页用于导览和下载镜像定位；相应技术标准请以 {link} 为准。"}
          </Translate>
        </p>
      </div>
    </main>
  );
}
