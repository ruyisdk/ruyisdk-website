import { useEffect, useState } from "react";

const DEFAULT_MAX_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY_BASE = 1000;

const isGithubApiUrl = (apiUrl) => {
  try {
    return new URL(apiUrl).hostname === "api.github.com";
  } catch {
    return false;
  }
};

const useDataWithApiFallback = (
  fallbackData,
  apiUrl,
  {
    maxRetryCount = DEFAULT_MAX_RETRY_COUNT,
    retryDelayBase = DEFAULT_RETRY_DELAY_BASE,
  } = {}
) => {
  const [data, setData] = useState(fallbackData);
  const [hasRemoteData, setHasRemoteData] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !apiUrl) return;

    let retryTimer = null;
    let retryCount = 0;
    let isCancelled = false;

    const fetchData = async () => {
      if (retryCount > maxRetryCount || isCancelled) return;

      try {
        const isGithubApi = isGithubApiUrl(apiUrl);
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: isGithubApi ? "application/vnd.github+json" : "application/json",
            ...(isGithubApi ? { "X-GitHub-Api-Version": "2022-11-28" } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`);
        }

        const remoteData = await response.json();
        if (!isCancelled) {
          setData(remoteData);
          setHasRemoteData(true);
        }
      } catch (error) {
        retryTimer = setTimeout(fetchData, Math.pow(2, retryCount) * retryDelayBase);
        retryCount++;
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
      clearTimeout(retryTimer);
    };
  }, [apiUrl, maxRetryCount, retryDelayBase]);

  return { data, hasRemoteData };
};

export default useDataWithApiFallback;
