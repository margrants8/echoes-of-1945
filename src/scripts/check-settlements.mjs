// Accuracy gate for settlements data (settlements/*.json are plain data, not an
// Astro content collection, so zod does not validate them at build time).
//
// Rules enforced (build fails on any violation):
//   1. every clause must cite at least one source;
//   2. every localized text field must have both `en` and `zh`;
//   3. a `disputed` clause must carry a bilingual `note` explaining the dispute.
//   4. the reckoning `scorecard` must have all four dimensions, each with a
//      0..1 score, at least one source, and bilingual `verdict` + `note`.
//
// Pure Node, no dependencies — runs as an npm `prebuild` step in any CI runner.
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../content/settlements/', import.meta.url);
const localizedFields = { clause: ['label', 'note'], top: ['displayName', 'treaty'] };
const SCORECARD_DIMENSIONS = ['execution', 'military', 'apology', 'warmongering'];
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

  const card = data.scorecard;
  if (!card || typeof card !== 'object') {
    bad(`${file}: missing "scorecard" object`);
  } else {
    for (const d of SCORECARD_DIMENSIONS) {
      const e = card[d];
      if (!e) {
        bad(`${file}: scorecard missing dimension "${d}"`);
        continue;
      }
      if (typeof e.score !== 'number' || e.score < 0 || e.score > 1) {
        bad(`${file}: scorecard "${d}" score must be a number in 0..1`);
      }
      if (!e.sources?.length) bad(`${file}: scorecard "${d}" has no source`);
      for (const f of ['verdict', 'note']) {
        if (!isLocalized(e[f])) bad(`${file}: scorecard "${d}" field "${f}" must have both en and zh`);
      }
      if (e.disputed && !(e.note?.en && e.note?.zh)) {
        bad(`${file}: disputed scorecard "${d}" is missing a bilingual note`);
      }
    }
  }
}

if (failed) {
  console.error('\nSettlements accuracy gate FAILED — fix the issues above.');
  process.exit(1);
}
console.log('Settlements accuracy gate passed.');
