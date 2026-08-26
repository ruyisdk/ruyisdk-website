const toArabicDigits = (str = '') => str.replace(/[０-９]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xfee0));
const zeroPad = (value, width = 2) => String(value).padStart(width, '0');

function extractIssueNumber(title = '') {
  const text = toArabicDigits(title);
  const match = text.match(/第\s*(\d{1,4})\s*期|biweekly\s*(?:no\.?\s*)?(\d{1,4})|zweiwochenbericht\s*(?:nr\.?\s*)?(\d{1,4})/i);
  return match ? Number(match[1] || match[2] || match[3]) : null;
}

function extractDate(title = '') {
  const text = toArabicDigits(title);
  const match = text.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?|(?<!\d)(\d{4})-(\d{1,2})-(\d{1,2})(?!\d)/);
  if (!match) return null;
  const offset = match[1] ? 0 : 3;
  return { y: Number(match[1 + offset]), mo: Number(match[2 + offset]), d: Number(match[3 + offset]) };
}

function localizeBiweeklyTitle(title, locale) {
  const issue = extractIssueNumber(title);
  const date = extractDate(title);
  if (issue == null && !date) return title;
  const num = issue == null ? null : zeroPad(issue, 3);
  const y = date?.y;
  const mo = date ? zeroPad(date.mo) : null;
  const d = date ? zeroPad(date.d) : null;
  const stripped = title.replace(/^(?:RuyiSDK|RUYISDK|Ruyi SDK)\s*/i, '').replace(/^(?:双周进展汇报\s*)/u, '');
  if (locale === 'en') return num && date ? `Biweekly ${num}: ${y}-${mo}-${d}` : num ? `Biweekly ${num}` : `Biweekly: ${y}-${mo}-${d}`;
  if (locale === 'de') return num && date ? `Zweiwochenbericht ${num}: ${d}.${mo}.${y}` : num ? `Zweiwochenbericht ${num}` : `Zweiwochenbericht: ${d}.${mo}.${y}`;
  if (locale === 'zh-Hans') return num && date ? `第${Number(num)}期 ${y}年${mo}月${d}日` : num ? `第${Number(num)}期` : `${y}年${mo}月${d}日`;
  return stripped;
}

function localizeRuyiNewsTitle(title, locale) {
  const match = toArabicDigits(title).match(/RuyiSDK\s+([0-9.]+)\s*版本?更新说明/);
  if (!match) return title;
  if (locale === 'en') return `RuyiSDK ${match[1]} Release Notes`;
  if (locale === 'de') return `RuyiSDK ${match[1]} Versionshinweise`;
  return title;
}

function localizeTitle(title, itemName, locale) {
  if (itemName === 'weeklies') return localizeBiweeklyTitle(title, locale);
  if (itemName === 'ruyinews') return localizeRuyiNewsTitle(title, locale);
  return title;
}

module.exports = { localizeBiweeklyTitle, localizeRuyiNewsTitle, localizeTitle };
