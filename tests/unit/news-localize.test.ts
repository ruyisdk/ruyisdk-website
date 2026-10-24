import { describe, it, expect } from 'vitest';
import newsLocalize from '../../scripts/plugins/news-localize.cjs';

const { localizeTitle } = newsLocalize;

describe('localizeTitle', () => {
  it('localizes weekly title for English locale', () => {
    const zhTitle = '第 45 期';
    const enTitle = localizeTitle(zhTitle, 'weeklies', 'en');
    expect(enTitle).toBe('Biweekly 045');
  });

  it('formats weekly title for zh-Hans locale', () => {
    const zhTitle = '第 45 期 2024-05-01';
    const localized = localizeTitle(zhTitle, 'weeklies', 'zh-Hans');
    expect(localized).toBe('第45期 2024年05月01日');
  });

  it('localizes ruyinews release notes title', () => {
    const zhTitle = 'RuyiSDK 0.39 版本更新说明';
    const enTitle = localizeTitle(zhTitle, 'ruyinews', 'en');
    expect(enTitle).toBe('RuyiSDK 0.39 Release Notes');
  });

  it('returns original title when item is not weeklies or ruyinews', () => {
    const title = 'RuyiSDK News Article';
    const localized = localizeTitle(title, 'articles', 'en');
    expect(localized).toBe(title);
  });
});
