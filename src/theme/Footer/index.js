import React from 'react';
import OriginalFooter from '@theme-original/Footer';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Footer(props) {
  const { i18n } = useDocusaurusContext();
  const locale = i18n?.currentLocale;
  const revyosLink = (locale === 'en' || locale === 'de') ? 'https://docs.revyos.dev/en' : 'https://docs.revyos.dev';
  console.log('当前语言:', locale, 'RevyOS 链接:', revyosLink);
  const links = [
    {
      title: "生态",
      items: [
        { label: "RuyiSDK", to: "/docs/intro" },
        { label: "RevyOS", href: revyosLink },
        { label: "Support Matrix", href: "https://matrix.ruyisdk.org/" },
      ],
    },
    {
      title: "社区",
      items: [
        { label: "讨论组", href: "https://github.com/ruyisdk/ruyisdk/discussions" },
        { label: "数据统计", to: "/Home/StatisticalDataPages" },
        { label: "实习生招聘", href: "https://github.com/plctlab/weloveinterns/blob/master/open-internships.md" },
      ],
    },
    {
      title: "关注我们",
      items: [
        { label: "微信公众号", className: 'hover-wechat-link', to: '/contact' },
        { label: "QQ群", className: 'hover-qq-link', to: '/contact' },
        { label: "PLCT 实验室", href: "https://plctlab.org/" },
      ],
    },
    {
      title: "更多开发工具",
      items: [
        { label: "JetBrains IDE Multiarch", href: "https://github.com/Glavo/JetBrains-IDE-Multiarch" },
      ],
    },
  ];

  return <OriginalFooter {...props} links={links} />;
} 

// import React from 'react';
// import {useLocation} from '@docusaurus/router';
// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// export default function Footer() {
//   const { i18n } = useDocusaurusContext();
//   const locale = i18n?.currentLocale || 'en';

//   // 动态根据语言设置 RevyOS 链接
//   const revyosLink = (locale === 'en' || locale === 'de')
//     ? 'https://docs.revyos.dev/en'
//     : 'https://docs.revyos.dev';

//   const links = [
//     {
//       title: "生态",
//       items: [
//         { label: "RuyiSDK", to: "/docs/intro" },
//         { label: "RevyOS", href: revyosLink },
//         { label: "Support Matrix", href: "https://matrix.ruyisdk.org/" },
//       ],
//     },
//     {
//       title: "社区",
//       items: [
//         { label: "讨论组", href: "https://github.com/ruyisdk/ruyisdk/discussions" },
//         { label: "数据统计", to: "/Home/StatisticalDataPages" },
//         { label: "实习生招聘", href: "https://github.com/plctlab/weloveinterns/blob/master/open-internships.md" },
//       ],
//     },
//     {
//       title: "关注我们",
//       items: [
//         { label: "微信公众号", className: 'hover-wechat-link', to: '/contact' },
//         { label: "QQ群", className: 'hover-qq-link', to: '/contact' },
//         { label: "PLCT 实验室", href: "https://plctlab.org/" },
//       ],
//     },
//     {
//       title: "更多开发工具",
//       items: [
//         { label: "JetBrains IDE Multiarch", href: "https://github.com/Glavo/JetBrains-IDE-Multiarch" },
//       ],
//     },
//   ];

//   // 简单内部路由跳转用 <a href>（Docusaurus 内部路由通常会用 Link 组件）
//   // 这里为简化直接用 <a>，你也可以import Link换用
//   return (
//     <footer style={{backgroundColor: '#f9f9f9', padding: '2rem'}}>
//       <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
//         {links.map((section, idx) => (
//           <div key={idx} style={{minWidth: 150, marginBottom: 24}}>
//             <h3>{section.title}</h3>
//             <ul style={{listStyle: 'none', paddingLeft: 0}}>
//               {section.items.map((item, i) => (
//                 <li key={i} style={{marginBottom: 8}}>
//                   {item.to ? (
//                     <a href={item.to} style={{color: '#0078d4', textDecoration: 'none'}}>
//                       {item.label}
//                     </a>
//                   ) : (
//                     <a href={item.href} target="_blank" rel="noopener noreferrer" style={{color: '#0078d4', textDecoration: 'none'}}>
//                       {item.label}
//                     </a>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//       <div style={{textAlign: 'center', marginTop: '2rem', color: '#888'}}>
//         Copyright © 2024-{new Date().getFullYear()} RuyiSDK
//       </div>
//     </footer>
//   );
// }
