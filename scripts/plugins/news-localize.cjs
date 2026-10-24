/*
 * Shared title-localization helpers for news data.
 * Used by both the Docusaurus news-generator plugin (ESM) and the
 * standalone test script scripts/test-localize.cjs (CJS).
 */

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
  // If not a Chinese-styled title, keep as-is
  const issue = extractIssueNumber(title);
  const date = extractDateFromText(title);
  if (!issue && !date) return title;

  const num = issue != null ? zeroPad(issue, 3) : null;
  const y = date?.y, mo = date ? zeroPad(date.mo) : null, d = date ? zeroPad(date.d) : null;

  // Always strip the brand 'RuyiSDK' from the display title where present
  title = title.replace(/^(?:RuyiSDK|RUYISDK|Ruyi SDK)\s*/i, "");

  // Also strip the Chinese phrase '双周进展汇报' when it appears after the brand
  // or at the beginning of the title in Chinese locales.
  if (/^\s*双周进展汇报\s*/u.test(title) || /^(?:RuyiSDK|RUYISDK)\s*双周进展汇报\s*/i.test(title)) {
    title = title.replace(/^(?:RuyiSDK|RUYISDK)?\s*双周进展汇报\s*/iu, "");
  }

  if (locale === "en") {
    // English: keep 'Biweekly' but remove the brand
    if (num && y && mo && d) return `Biweekly ${num}: ${y}-${mo}-${d}`;
    if (num) return `Biweekly ${num}`;
    if (y && mo && d) return `Biweekly: ${y}-${mo}-${d}`;
    return title;
  }
  if (locale === "de") {
    // German: keep 'Zweiwochenbericht' but remove the brand
    if (num && y && mo && d) return `Zweiwochenbericht ${num}: ${d}.${mo}.${y}`;
    if (num) return `Zweiwochenbericht ${num}`;
    if (y && mo && d) return `Zweiwochenbericht: ${d}.${mo}.${y}`;
    return title;
  }

  if (locale === "zh-Hans") {
    // Chinese: remove brand and the phrase '双周进展汇报' and format as '第NN期 YYYY年MM月DD日'
    if (num && y && mo && d) return `第${Number(num)}期 ${y}年${mo}月${d}日`;
    if (num) return `第${Number(num)}期`;
    if (y && mo && d) return `${y}年${mo}月${d}日`;
    return title;
  }

  return title;
};

const localizeRuyiNewsTitle = (title, locale) => {
  // Attempt to translate common pattern: "RuyiSDK 0.39 版本更新说明"
  const t = toArabicDigits(title);
  const m = t.match(/RuyiSDK\s+([0-9.]+)\s*版本?更新说明/);
  if (m) {
    const version = m[1];
    if (locale === "en") return `RuyiSDK ${version} Release Notes`;
    if (locale === "de") return `RuyiSDK ${version} Versionshinweise`;
  }
  return title;
};

const localizeTitle = (title, itemname, locale) => {
  if (itemname === "weeklies") return localizeBiweeklyTitle(title, locale);
  if (itemname === "ruyinews") return localizeRuyiNewsTitle(title, locale);
  return title;
};

exports.toArabicDigits = toArabicDigits;
exports.zeroPad = zeroPad;
exports.extractIssueNumber = extractIssueNumber;
exports.extractDateFromText = extractDateFromText;
exports.localizeBiweeklyTitle = localizeBiweeklyTitle;
exports.localizeRuyiNewsTitle = localizeRuyiNewsTitle;
exports.localizeTitle = localizeTitle;
