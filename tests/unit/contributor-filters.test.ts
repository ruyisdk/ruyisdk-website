import { describe, it, expect } from 'vitest';
import { isFiltered } from '../../scripts/lib/contributor-filters.cjs';

describe('contributor-filters', () => {
  const patterns = [
    /bot/i,
    /^actions-user$/i,
    /dependabot/i,
  ];

  it('identifies filtered bot accounts', () => {
    expect(isFiltered('dependabot[bot]', patterns)).toBe(true);
    expect(isFiltered('actions-user', patterns)).toBe(true);
    expect(isFiltered('renovate-bot', patterns)).toBe(true);
  });

  it('keeps genuine contributor names', () => {
    expect(isFiltered('alice', patterns)).toBe(false);
    expect(isFiltered('bob_developer', patterns)).toBe(false);
    expect(isFiltered('charlie-riscv', patterns)).toBe(false);
  });

  it('handles empty or null values safely', () => {
    expect(isFiltered('', patterns)).toBe(false);
    expect(isFiltered(null, patterns)).toBe(false);
    expect(isFiltered('alice', [])).toBe(false);
  });
});
