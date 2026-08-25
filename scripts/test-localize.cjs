const { localizeBiweeklyTitle } = require('./plugins/news-localize.cjs');

const tests = [
  { title: "RuyiSDK Biweekly 003: 2025-04-22", locale: "en" },
  { title: "RuyiSDK Biweekly 003", locale: "en" },
  { title: "Biweekly 007: 2025-05-20", locale: "en" },
  { title: "RuyiSDK Zweiwochenbericht 010: 2025-06-15", locale: "de" },
  { title: "RuyiSDK 双周进展汇报 第 44 期·2025 年 05 月 13 日", locale: "zh-Hans" },
  { title: "双周进展汇报 第 55 期·2025 年 09 月 30 日", locale: "zh-Hans" },
  { title: "第 053 期·2025 年 09 月 30 日", locale: "zh-Hans" },
];

for (const t of tests) {
  console.log(t.locale, '::', t.title, '=>', localizeBiweeklyTitle(t.title, t.locale));
}
