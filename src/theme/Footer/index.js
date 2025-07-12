import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function Footer() {
  const { i18n, siteConfig } = useDocusaurusContext();
  const locale = i18n?.currentLocale;
  const revyosLink = (locale === 'en' || locale === 'de') ? 'https://docs.revyos.dev/en' : 'https://docs.revyos.dev';

  const links = [
    {
      title: <Translate id="footer.ecosystem">生态</Translate>,
      items: [
        { label: <Translate id="footer.ruyisdk">RuyiSDK</Translate>, to: "/docs/intro" },
        { label: <Translate id="footer.revyos">RevyOS</Translate>, href: revyosLink },
        { label: <Translate id="footer.matrix">Support Matrix</Translate>, href: "https://matrix.ruyisdk.org/" },
      ],
    },
    {
      title: <Translate id="footer.community">社区</Translate>,
      items: [
        { label: <Translate id="footer.riscv-community">RISC-V 开发者社区</Translate>, href: "https://ruyisdk.cn" },
        { label: <Translate id="footer.discussion">讨论组</Translate>, href: "https://github.com/ruyisdk/ruyisdk/discussions" },
        { label: <Translate id="footer.stats">数据统计</Translate>, to: "/Home/StatisticalDataPages" },
        { label: <Translate id="footer.intern">实习生招聘</Translate>, href: "https://github.com/plctlab/weloveinterns/blob/master/open-internships.md" },
      ],
    },
    {
      title: <Translate id="footer.followus">关注我们</Translate>,
      items: [
        { label: <Translate id="footer.wechat">微信公众号</Translate>, className: 'hover-wechat-link', to: '/contact' },
        { label: <Translate id="footer.qqgroup">QQ群</Translate>, className: 'hover-qq-link', to: '/contact' },
        { label: <Translate id="footer.plct">PLCT 实验室</Translate>, href: "https://plctlab.org/" },
      ],
    },
    {
      title: <Translate id="footer.tools">更多开发工具</Translate>,
      items: [
        { label: <Translate id="footer.jetbrains">JetBrains IDE Multiarch</Translate>, href: "https://github.com/Glavo/JetBrains-IDE-Multiarch" },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__links}>
        {links.map((section, idx) => (
          <div key={idx} className={styles.footer__col}>
            <div className={styles.footer__title}>{section.title}</div>
            <ul className={styles.footer__items}>
              {section.items.map((item, i) => (
                <li key={i} className={styles.footer__item}>
                  {item.to ? (
                    <Link to={item.to} className={item.className || ''}>{item.label}</Link>
                  ) : (
                    <a href={item.href} className={item.className || ''} target="_blank" rel="noopener noreferrer">{item.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.footer__copyright}>
        {siteConfig.themeConfig.footer.copyright}
      </div>
    </footer>
  );
}
