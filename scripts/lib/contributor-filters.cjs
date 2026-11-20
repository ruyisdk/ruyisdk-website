const fs = require('fs');

function loadFilters(filterFile) {
  const patterns = [];
  try {
    if (!fs.existsSync(filterFile)) return patterns;
    const raw = fs.readFileSync(filterFile, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const s = (line || '').trim();
      if (!s || s.startsWith('#')) return;
      try {
        patterns.push(new RegExp(s, 'i'));
      } catch (e) {
        console.warn(`[contributors] Invalid regex in filter file skipped: ${s}`);
      }
    });
  } catch (e) {
    console.warn('[contributors] Failed to read filter file:', e.message || e);
  }
  return patterns;
}

function isFiltered(name, patterns) {
  if (!name || !patterns || patterns.length === 0) return false;
  return patterns.some((re) => {
    try { return re.test(name); } catch { return false; }
  });
}

module.exports = { loadFilters, isFiltered };
