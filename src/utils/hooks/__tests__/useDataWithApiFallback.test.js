import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import useDataWithApiFallback from "../useDataWithApiFallback";

describe("useDataWithApiFallback hook", () => {
  const fallback = { downloads: 100 };
  const mockApiUrl = "https://api.example.com/data";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("should return fallback data initially", () => {
    const { result } = renderHook(() => useDataWithApiFallback(fallback, null));
    expect(result.current.data).toEqual(fallback);
    expect(result.current.hasRemoteData).toBe(false);
  });

  it("should fetch remote data successfully", async () => {
    const remoteData = { downloads: 500 };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => remoteData,
    });

    const { result } = renderHook(() => useDataWithApiFallback(fallback, mockApiUrl));

    await waitFor(() => {
      expect(result.current.hasRemoteData).toBe(true);
      expect(result.current.data).toEqual(remoteData);
    });
  });

  it("should fallback to local data if fetch fails after max retries", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() =>
      useDataWithApiFallback(fallback, mockApiUrl, { maxRetryCount: 1, retryDelayBase: 10 })
    );

    expect(result.current.data).toEqual(fallback);
    expect(result.current.hasRemoteData).toBe(false);
  });
});
