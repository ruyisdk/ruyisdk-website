const toArabicDigits = (str = "") =>
  str.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));

const zeroPad = (n, w = 2) => String(n).padStart(w, "0");

const extractIssueNumber = (title = "") => {
  const t = toArabicDigits(title);
  // Chinese: 第 N 期
  let m = t.match(/第\s*(\d{1,4})\s*期/);
  if (m) return Number(m[1]);
  // English: Biweekly N or Biweekly N:
  m = t.match(/biweekly\s*(?:no\.?\s*)?(\d{1,4})/i);
  if (m) return Number(m[1]);
  // German: Zweiwochenbericht N or Zweiwochenbericht N:
  m = t.match(/zweiwochenbericht\s*(?:nr\.?\s*)?(\d{1,4})/i);
  if (m) return Number(m[1]);
  return null;
};

const extractDateFromText = (title = "") => {
  const t = toArabicDigits(title);
  // Chinese date: YYYY 年 MM 月 DD 日
  let m = t.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?/);
  if (m) {
    const [, y, mo, d] = m.map((x) => Number(x));
    return { y, mo, d };
  }
  // ISO-like date: YYYY-MM-DD
  m = t.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) {
    const [, y, mo, d] = m.map((x) => Number(x));
    return { y, mo, d };
  }
  return null;
};

const localizeBiweeklyTitle = (title, locale) => {
  const issue = extractIssueNumber(title);
  const date = extractDateFromText(title);
  if (!issue && !date) return title;

  const num = issue != null ? zeroPad(issue, 3) : null;
  const y = date?.y, mo = date ? zeroPad(date.mo) : null, d = date ? zeroPad(date.d) : null;

  // Strip brand and Chinese phrase
  title = title.replace(/^(?:RuyiSDK|RUYISDK|Ruyi SDK)\s*/i, "");
  if (/^\s*双周进展汇报\s*/u.test(title) || /^(?:RuyiSDK|RUYISDK)\s*双周进展汇报\s*/i.test(title)) {
    title = title.replace(/^(?:RuyiSDK|RUYISDK)?\s*双周进展汇报\s*/iu, "");
  }

  if (locale === "en") {
    if (num && y && mo && d) return `Biweekly ${num}: ${y}-${mo}-${d}`;
    if (num) return `Biweekly ${num}`;
    if (y && mo && d) return `Biweekly: ${y}-${mo}-${d}`;
    return title;
  }
  if (locale === "de") {
    if (num && y && mo && d) return `Zweiwochenbericht ${num}: ${d}.${mo}.${y}`;
    if (num) return `Zweiwochenbericht ${num}`;
    if (y && mo && d) return `Zweiwochenbericht: ${d}.${mo}.${y}`;
    return title;
  }

  if (locale === "zh-Hans") {
    if (num && y && mo && d) return `第${Number(num)}期 ${y}年${mo}月${d}日`;
    if (num) return `第${Number(num)}期`;
    if (y && mo && d) return `${y}年${mo}月${d}日`;
    return title;
  }

  return title;
};

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
