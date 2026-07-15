// Accuracy gate for settlements data (settlements/*.json are plain data, not an
// Astro content collection, so zod does not validate them at build time).
//
// Rules enforced (build fails on any violation):
//   1. every clause must cite at least one source;
//   2. every localized text field must have both `en` and `zh`;
//   3. a `disputed` clause must carry a bilingual `note` explaining the dispute.
//
// Pure Node, no dependencies — runs as an npm `prebuild` step in any CI runner.
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../content/settlements/', import.meta.url);
const localizedFields = { clause: ['label', 'note'], top: ['displayName', 'treaty'] };
let failed = false;

const bad = (msg) => {
  console.error(`  ✗ ${msg}`);
  failed = true;
};

const isLocalized = (v) => v && typeof v === 'object' && v.en && v.zh;

for (const file of readdirSync(dir).filter((n) => n.endsWith('.json'))) {
  const data = JSON.parse(readFileSync(new URL(file, dir)));

  for (const f of localizedFields.top) {
    if (!isLocalized(data[f])) bad(`${file}: top-level "${f}" must have both en and zh`);
  }

  for (const c of data.clauses ?? []) {
    const id = c.id ?? '(no id)';
    if (!c.sources?.length) bad(`${file}: clause "${id}" has no source`);
    for (const f of localizedFields.clause) {
      if (!isLocalized(c[f])) bad(`${file}: clause "${id}" field "${f}" must have both en and zh`);
    }
    if (c.disputed && !(c.note?.en && c.note?.zh)) {
      bad(`${file}: disputed clause "${id}" is missing a bilingual note`);
    }
  }
}

if (failed) {
  console.error('\nSettlements accuracy gate FAILED — fix the issues above.');
  process.exit(1);
}
console.log('Settlements accuracy gate passed.');
