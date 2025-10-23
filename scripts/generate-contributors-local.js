const fs = require('fs');
const path = require('path');

const OUT_FILE = path.resolve(__dirname, '../src/pages/Community/generated_contributors.json');

// If the output file already exists, do not overwrite it. This allows
// `build-noupdate` to use a previously generated contributors file without
// replacing it with dummy data.
if (fs.existsSync(OUT_FILE)) {
  console.log(`Skipping local generator because ${OUT_FILE} already exists`);
  process.exit(0);
}

// Minimal dummy data shape matching the real generator's output
const out = {
  coreTeam: [
    {
      id: 'local-core-1',
      name: 'Local Core',
      avatarUrl: 'https://placehold.co/192x192/e0e0e0/757575?text=LC',
      github: 'https://github.com/local-core',
      contributions: 100,
    },
  ],
  interns: [],
  contributors: [
    {
      id: 'local-1',
      name: 'Local Contributor 1',
      avatarUrl: 'https://placehold.co/192x192/e0e0e0/757575?text=C1',
      github: 'https://github.com/local-contrib-1',
      contributions: 42,
    },
    {
      id: 'local-2',
      name: 'Local Contributor 2',
      avatarUrl: 'https://placehold.co/192x192/e0e0e0/757575?text=C2',
      github: 'https://github.com/local-contrib-2',
      contributions: 17,
    },
  ],
  totals: {
    contributors: 3,
    commits: 159,
    pullRequests: 12,
  },
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), 'utf8');
console.log(`Wrote ${OUT_FILE} with ${out.contributors.length + out.coreTeam.length} contributors (local dummy)`);
