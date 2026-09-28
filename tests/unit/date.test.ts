import { describe, it, expect } from 'vitest';
import { formatDate } from '../../src/utils/date';

describe('formatDate', () => {
  const timestamp = Date.UTC(2025, 9, 24); // 2025-10-24

  it('formats dates in English locale correctly', () => {
    const formatted = formatDate(timestamp, 'en-US');
    expect(formatted).toContain('2025');
    expect(formatted).toContain('24');
  });

  it('formats dates in Chinese locale correctly', () => {
    const formatted = formatDate(timestamp, 'zh-Hans');
    expect(formatted).toContain('2025');
    expect(formatted).toContain('10');
    expect(formatted).toContain('24');
  });

  it('handles string dates safely', () => {
    const formatted = formatDate('2025-10-24', 'zh-Hans');
    expect(formatted).toContain('2025');
  });

  it('returns empty string for invalid date', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate('invalid-date')).toBe('');
  });
});
