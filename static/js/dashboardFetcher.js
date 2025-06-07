// This script runs in a separate background thread (a Web Worker).

self.onmessage = (event) => {
  const { apiURL } = event.data;
  if (!apiURL) {
    self.postMessage({ type: 'error', payload: { message: 'API URL not provided to worker.' } });
    return;
  }

  let retryCount = 0;

  const apiPost = async () => {
    // If we have retried more than 5 times, give up.
    if (retryCount > 5) {
      console.warn('Stop retry');
      self.postMessage({ type: 'error', payload: { message: 'Max retries reached' } });
      return;
    }

    try {
      const response = await fetch(`https://${apiURL}/fe/dashboard`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        // You can add a timeout using AbortController if needed
      });

      if (!response.ok) {
        // Handle HTTP errors like 4xx, 5xx
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Send the successfully fetched data back to the main component.
      self.postMessage({ type: 'success', payload: data });

    } catch (error) {
      console.error('Dashboard API error, will retry', error);
      retryCount++;
      // This schedules the next retry with an exponential backoff delay.
      setTimeout(apiPost, 2 ** retryCount * 1000);
    }
  };

  // Initial call to start the fetching process.
  apiPost();
};