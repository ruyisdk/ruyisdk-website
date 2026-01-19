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
            type: "localeDropdown",
            position: "right",
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
                label: "贡献者",
                to: "/contributors",
              },
              {
                label: "社区守则",
                to: "/code_of_conduct",
              },
            ],
          },
          {
            label: "关于",
            to: "/about",
            position: "left",
          },
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "right",
            label: "文档",
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
        links: [],
        copyright: `Copyright © 2024-2026 Institute of Software, CAS`,
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
        blogTitle: "双周报",
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
    {
      src: '/js/menu-title-click.js',
      defer: false,
    },
  ],
};

export default config;
