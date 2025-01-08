// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "RuyiSDK",
  tagline: "RuyiSDK是面向RISC-V架构的一体化集成开发环境",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://ruyisdk.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "ruyisdk", // Usually your GitHub org/user name.
  projectName: "ruyisdk-website", // Usually your repo name.

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans", "en", "de"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        blog: {
          blogTitle: "RuyiSDK 博客",
          blogSidebarTitle: "所有博文",
          blogSidebarCount: "ALL",
          showReadingTime: true,
          blogDescription: "Blog",
        },
        theme: {
          customCss: "./src/css/custom.scss",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      /* algolia: {
        // The application ID provided by Algolia
        appId: '',
  
        // Public API key: it is safe to commit it
        apiKey: '',
  
        indexName: 'ruyisdk',

      }, */
      announcementBar: {
        id: "th1520",
        content:
          '内核从 5.10 升级至 6.6，RuyiSDK 发布面向 TH1520 系列开发板操作系统新镜像 <a target="_blank" rel="noopener noreferrer" href="/blog/2024/12/31/th1520">点击查看</a>',
        backgroundColor: "#20232a",
        textColor: "#fff",
        isCloseable: true,
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: true,
      },
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "RuyiSDK",
        hideOnScroll: true,
        logo: {
          alt: "RuyiSDK Logo",
          src: "img/ruyi-logo-720.svg",
        },
        style: "dark",
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "文档",
          },
          { to: "/blog", label: "博客", position: "left" },
          { to: "/biweekly", label: "双周报", position: "left" },
          { to: "/download", label: "下载", position: "left" },
          {
            type: "localeDropdown",
            position: "right",
          },
          {
            href: "https://github.com/ruyisdk",
            label: "GitHub",
            position: "right",
          },
          {
            type: "dropdown",
            label: "社区",
            position: "left",
            items: [
              {
                label: "Discussion",
                href: "https://github.com/ruyisdk/ruyisdk-website/discussions",
              },
              {
                label: "社区活动",
                to: "/meetup",
              },
              {
                label: "社区守则",
                to: "/code_of_conduct",
              },
            ],
          },
          {
            label: "联系我们",
            to: "/contact",
            position: "left",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "文档",
            items: [
              {
                label: "RuyiSDK",
                to: "/docs/intro",
              },
            ],
          },
          {
            title: "社区",
            items: [
              {
                label: "Discussion",
                href: "https://github.com/ruyisdk/ruyisdk-website/discussions",
              },
            ],
          },
          {
            title: "更多",
            items: [
              {
                label: "博客",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/ruyisdk",
              },
              {
                label: "微信公众号",
                className: 'hover-wechat-link',
                to: '/contact'
              },
            ],
          },
          {
            items: [
              {
                label: "QQ群",
                className: 'hover-qq-link',
                to: '/contact'
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} RuyiSDK`,
      },
      prism: {
        additionalLanguages: ["bash"],

        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  plugins: [
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-content-blog",
      {
        blogTitle: "RuyiSDK 双周报",
        blogSidebarTitle: "所有报告",
        /**
         * Required for any multi-instance plugin
         */
        id: "biweekly",
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: "biweekly",
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: "biweekly",

        blogSidebarCount: "ALL",
      },
    ],
    /* [
      "@docusaurus/plugin-google-gtag",
      {
        trackingID: "",
        anonymizeIP: true,
      },
    ], */
  ],
};

export default config;
