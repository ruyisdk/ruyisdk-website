async function withRequestTimeout(request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    return await request(controller.signal);
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { withRequestTimeout };
