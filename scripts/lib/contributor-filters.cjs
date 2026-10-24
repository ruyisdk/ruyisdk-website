const fs = require('fs');

function loadFilters(filterFilePath) {
  const patterns = [];
  try {
    if (!filterFilePath || !fs.existsSync(filterFilePath)) return patterns;
    const raw = fs.readFileSync(filterFilePath, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const s = (line || '').trim();
      if (!s || s.startsWith('#')) return;
      try {
        patterns.push(new RegExp(s, 'i'));
      } catch {
        console.warn(`[contributors] Invalid regex in filter file skipped: ${s}`);
      }
    });
  } catch (e) {
    console.warn('[contributors] Failed to read filter file:', e?.message || e);
  }
  return patterns;
}

function isFiltered(name, patterns) {
  if (!name || !patterns || patterns.length === 0) return false;
  return patterns.some((re) => {
    try {
      return re.test(name);
    } catch {
      return false;
    }
  });
}

module.exports = {
  loadFilters,
  isFiltered,
};
