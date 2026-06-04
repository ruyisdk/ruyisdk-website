import { useEffect, useState } from "react";

const DEFAULT_MAX_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY_BASE = 1000;

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
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
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
