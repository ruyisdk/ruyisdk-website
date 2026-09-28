/**
 * Universal JSON fetch helper with AbortController timeout and error handling.
 */
async function fetchJsonWithTimeout(url, options = {}) {
  const {
    timeoutMs = 10_000,
    headers = {},
    logPrefix = '[fetch-with-timeout]',
  } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fetchOptions = {
      ...options,
      headers: {
        accept: 'application/json',
        ...headers,
      },
      signal: controller.signal,
    };
    delete fetchOptions.timeoutMs;
    delete fetchOptions.logPrefix;

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      console.warn(`${logPrefix} API ${url} return HTTP ${res.status} ${res.statusText}`);
      return { data: null, headers: res.headers, code: res.status, ok: false };
    }

    const json = await res.json();
    if (!json || typeof json !== 'object') {
      console.error(`${logPrefix} API ${url} return invalid JSON payload`);
      return { data: null, headers: res.headers, code: res.status, ok: false };
    }

    return { data: json, headers: res.headers, code: res.status, ok: true };
  } catch (err) {
    console.error(`${logPrefix} Unexpected error in fetchJsonWithTimeout for ${url}:`, err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  fetchJsonWithTimeout,
};
