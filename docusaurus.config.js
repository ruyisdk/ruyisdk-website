// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config
import { themes as prismThemes } from "prism-react-renderer";

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
      ({
        docs: {
          sidebarPath: "./src/components/core/sidebars.js",
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
          customCss: ["./src/css/custom.scss", "./src/css/unocss.css"],
        },
      }),
    ],
  ],

  themeConfig:
    ({
      colorMode: {
        defaultMode: "light",
        disableSwitch: true,
      },
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "RuyiSDK",
        hideOnScroll: false,
        logo: {
          alt: "RuyiSDK Logo",
          src: "img/ruyi-logo-720.svg",
        },
        style: "primary",
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
            type: "dropdown",
            label: "社区",
            position: "left",
            items: [
              {
                label: "Discussion",
                href: "https://github.com/ruyisdk/ruyisdk/discussions",
              },
              {
                label: "社区守则",
                to: "/code_of_conduct",
              },
              {
                label: "关于我们",
                to: "/contact",
              },
            ],
          },
          {
            type: "localeDropdown",
            position: "right",
          },
          {
            href: "https://github.com/ruyisdk",
            html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        links: [],
        copyright: `Copyright © 2024-2025 Institute of Software, CAS`,
      },
      prism: {
        additionalLanguages: ["bash"],

        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
  plugins: [
    "docusaurus-plugin-sass",
    "./plugins/unocss",
    "./plugins/news-generator",
    [
      "@docusaurus/plugin-content-blog",
      {
        blogTitle: "RuyiSDK 双周报",
        blogSidebarTitle: "所有报告",
        id: "biweekly",
        routeBasePath: "biweekly",
        path: "biweekly",
        blogSidebarCount: "ALL",
      },
    ],
  ],
  // add custom script
  scripts: [
    {
      src: '/js/toc-smooth-scroll.js',
      async: true,
    },
  ],
};

export default config;
