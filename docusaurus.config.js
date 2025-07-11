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
  customFields: {
    // Put your custom environment here
    apiURL: process.env.BASE_URL,
  },
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
      colorMode: {
        defaultMode: "light",
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
        style: "primary",
        items: [
          {
            type: "localeDropdown",
            position: "right",
          },
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "right",
            label: "文档",
          },
          { to: "/blog", label: "博客", position: "right" },
          { to: "/biweekly", label: "双周报", position: "right" },
          { to: "/download", label: "下载", position: "right" },
          {
            type: "dropdown",
            label: "社区",
            position: "right",
            items: [
              {
                label: "Discussion",
                href: "https://github.com/ruyisdk/ruyisdk/discussions",
              },
              {
                label: "社区守则",
                to: "/code_of_conduct",
              },
            ],
          },
          {
            label: "关于",
            to: "/contact",
            position: "right",
          },
          {
            href: "https://github.com/ruyisdk",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        links: [
          {
            title: "生态",
            items: [
              {
                label: "RuyiSDK",
                to: "/docs/intro",
              },
              {
                label: "RevyOS",
                href: "https://docs.revyos.dev/",
              },
              {
                label: "Support Matrix",
                href: "https://matrix.ruyisdk.org/",
              },
            ],
          },
          {
            title: "社区",
            items: [
              {
                label: "RISC-V 开发者社区",
                href: "https://ruyisdk.cn"
              },
              {
                label: "讨论组",
                href: "https://github.com/ruyisdk/ruyisdk/discussions",
              },
              {
                label: "数据统计",
                to: "/Home/StatisticalDataPages",
              },
              {
                label: "实习生招聘",
                href: "https://github.com/plctlab/weloveinterns/blob/master/open-internships.md",
              },
            ],
          },
          {
            title: "关注我们",
            items: [
              {
                label: "微信公众号",
                className: 'hover-wechat-link',
                to: '/contact'
              },
              {
                label: "QQ群",
                className: 'hover-qq-link',
                to: '/contact'
              },
              {
                label: "PLCT 实验室",
                href: "https://plctlab.org/",
              },
            ],
          },
          {
            title: "更多开发工具",
            items: [
              {
                label: "JetBrains IDE Multiarch",
                href: "https://github.com/Glavo/JetBrains-IDE-Multiarch",
              },
            ],
          },
        ],
        copyright: `Copyright © 2024-${new Date().getFullYear()} RuyiSDK`,
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
