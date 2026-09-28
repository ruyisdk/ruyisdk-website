import { describe, it, expect } from 'vitest';
import { resolveImg } from '../../src/utils/img';

describe('resolveImg', () => {
  it('returns null when input is empty', () => {
    expect(resolveImg('')).toBeNull();
    expect(resolveImg(undefined)).toBeNull();
    expect(resolveImg(null)).toBeNull();
  });

  it('keeps absolute http(s) URLs intact', () => {
    expect(resolveImg('https://example.com/image.png')).toBe('https://example.com/image.png');
    expect(resolveImg('http://example.com/image.png')).toBe('http://example.com/image.png');
  });

  it('normalizes leading slash and prepends baseUrl', () => {
    expect(resolveImg('/img/banner.png', '/')).toBe('/img/banner.png');
    expect(resolveImg('img/banner.png', '/site/')).toBe('/site/img/banner.png');
    expect(resolveImg('/img/banner.png', '/site/')).toBe('/site/img/banner.png');
  });
});
