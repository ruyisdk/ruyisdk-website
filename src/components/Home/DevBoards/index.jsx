import React from 'react';
import Translate from '@docusaurus/Translate';
import {
  IconArrowRight,
  IconBoxSeam,
  IconCodeDots,
  IconSettings,
} from '@tabler/icons-react';

import styles from './styles.module.css';

const boards = [
  {
    title: 'Sipeed LicheePi 4A',
    descriptionId: 'home.devboards.licheepi4a.description',
    description: '基于 TH1520 处理器的高性能 RISC-V 单板计算机',
    image: '/img/home/devboards/LicheePi4A.webp',
    href: 'https://board-docs-frontend.pages.dev/boards/LicheePi4A/',
  },
  {
    title: 'StarFive VisionFive 2 Lite',
    descriptionId: 'home.devboards.visionfive2.description',
    description: '一款入手门槛极低且功能丰富的 RISC-V 单板计算机',
    image: '/img/home/devboards/VisionFive2-lite.webp',
    href: 'https://board-docs-frontend.pages.dev/boards/VisionFive2Lite/',
  },
  {
    title: 'Milk-V Duo (256M)',
    descriptionId: 'home.devboards.milkvDuo256m.description',
    description: 'Duo 的升级版本，满足需要更大内存容量的应用',
    image: '/img/home/devboards/SG2002.webp',
    href: 'https://board-docs-frontend.pages.dev/boards/Duo_256m/',
  },
  {
    title: 'Banana Pi BPI-F3',
    descriptionId: 'home.devboards.bpif3.description',
    description: '一款工业级 8 核 RISC-V 开源硬件开发板',
    image: '/img/home/devboards/BPI-F3.webp',
    href: 'https://board-docs-frontend.pages.dev/boards/BPI-F3/',
  },
];

function BoardCard({ board }) {
  return (
    <a className={styles.boardCard} href={board.href} target="_blank" rel="noopener noreferrer">
      <div className={styles.boardImageWrap}>
        <img className={styles.boardImage} src={board.image} alt={board.title} loading="lazy" />
      </div>
      <h3>{board.title}</h3>
      <p>
        <Translate id={board.descriptionId}>{board.description}</Translate>
      </p>
      <span className={styles.cardLink}>
        <Translate id="home.devboards.cardLink">查看示例</Translate>
        <span>&gt;</span>
      </span>
    </a>
  );
}

function FeaturePill({ icon, titleId, title, descriptionId, description, className }) {
  return (
    <div className={`${styles.featurePill} ${className}`}>
      <span className={styles.featureIcon}>{icon}</span>
      <span>
        <strong>
          <Translate id={titleId}>{title}</Translate>
        </strong>
        <small>
          <Translate id={descriptionId}>{description}</Translate>
        </small>
      </span>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className={styles.visualStage} aria-hidden="true">
      <div className={styles.orbit} />
      <FeaturePill
        className={styles.featureConfig}
        icon={<IconSettings size={24} stroke={2} />}
        titleId="home.devboards.hero.config.title"
        title="环境配置"
        descriptionId="home.devboards.hero.config.description"
        description="一键安装 RuyiSDK"
      />
      <FeaturePill
        className={styles.featureFlash}
        icon={<IconBoxSeam size={24} stroke={2} />}
        titleId="home.devboards.hero.flash.title"
        title="系统烧录"
        descriptionId="home.devboards.hero.flash.description"
        description="快速烧录到开发板"
      />
      <FeaturePill
        className={styles.featureDemo}
        icon={<IconCodeDots size={24} stroke={2} />}
        titleId="home.devboards.hero.demo.title"
        title="示例运行"
        descriptionId="home.devboards.hero.demo.description"
        description="开箱即用的示例代码"
      />
      <img className={`${styles.heroBoard} ${styles.heroBoardMain}`} src="/img/home/devboards/BPI-F3.webp" alt="" loading="lazy" />
      <img className={`${styles.heroBoard} ${styles.heroBoardTop}`} src="/img/home/devboards/LicheePi4A.webp" alt="" loading="lazy" />
      <img className={`${styles.heroBoard} ${styles.heroBoardSmall}`} src="/img/home/devboards/SG2002.webp" alt="" loading="lazy" />
    </div>
  );
}

export default function DevBoards() {
  return (
    <section className={styles.devboards} aria-labelledby="home-devboards-title">
      <div className={styles.heroGrid}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <Translate id="home.devboards.eyebrow">从 RuyiSDK 开始</Translate>
          </p>
          <h2 id="home-devboards-title">
            <Translate id="home.devboards.titlePrefix">上手</Translate>{' '}
            <span>RISC-V</span>{' '}
            <Translate id="home.devboards.titleSuffix">开发板</Translate>
          </h2>
          <p className={styles.description}>
            <Translate id="home.devboards.description">
              精选热门 RISC-V 开发板，上手示例、开发环境配置、固件烧录、调试运行，RuyiSDK 帮你快速开始开发。
            </Translate>
          </p>
          <a className="primary-button" href="https://board-docs-frontend.pages.dev/" target="_blank" rel="noopener noreferrer">
            <Translate id="home.devboards.cta">查看所有开发板示例</Translate>
            <IconArrowRight size={18} stroke={2.2} />
          </a>
        </div>

        <div className={styles.visual}>
          <HeroVisual />
        </div>
      </div>

      <div className={styles.examplesHeader}>
        <h3>
          <Translate id="home.devboards.examplesTitle">最新最热开发板上手示例</Translate>
        </h3>
      </div>

      <div className={styles.boardGrid}>
        {boards.map((board) => (
          <BoardCard key={board.title} board={board} />
        ))}
      </div>
    </section>
  );
}
