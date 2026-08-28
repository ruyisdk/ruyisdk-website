import { describe, it, expect, vi } from 'vitest';
import { fetchJsonWithTimeout } from '../../scripts/lib/fetch-with-timeout.cjs';

describe('fetchJsonWithTimeout', () => {
  it('returns data when HTTP request succeeds', async () => {
    const mockData = { version: '0.25.0' };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchJsonWithTimeout('https://api.example.com/test');
    expect(result).toBeDefined();
    expect(result?.data).toEqual(mockData);
    expect(result?.code).toBe(200);

    vi.unstubAllGlobals();
  });

  it('returns response object with ok=false on 404 error when not throwing', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await fetchJsonWithTimeout('https://api.example.com/not-found');
    expect(result).toBeDefined();
    expect(result?.ok).toBe(false);
    expect(result?.code).toBe(404);
    expect(result?.data).toBeNull();

    vi.unstubAllGlobals();
  });
});
