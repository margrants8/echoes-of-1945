import type { DisputeSocialSource } from '../utils/disputes';

// ─────────────────────────────────────────────────────────────────────────────
// Curated social posts (X / other), keyed by dispute id.
//
// This is the ONE place to attach a specific, archived post to a dispute card.
// A configured post here OVERRIDES any inline `socialSource` in disputes.json,
// and any entry whose `url` is empty is ignored — so the placeholders below are
// safe to leave blank until you have a real URL to paste.
//
// HOW TO ADD A POST
//   1. Pick the dispute id you want (full list at the bottom of this comment).
//   2. Paste the exact post URL into `url`
//        e.g. "https://x.com/PolandMFA/status/1565…"
//   3. Paste an archive snapshot into `archiveUrl` (STRONGLY recommended so the
//      citation survives deletion) — archive.today or the Wayback Machine:
//        e.g. "https://archive.ph/abcd1"  or  "https://web.archive.org/web/2022…/https://x.com/…"
//   4. Optionally fill the verbatim `quote` (bilingual) and the post `date` (YYYY-MM-DD).
//   5. Leave `embed: false` to render in the site's own citation style (no third-party
//      JS, deletion-proof). Set `embed: true` ONLY to render the live official X widget
//      (loads X's script, tracks the visitor, and blanks out if the post is deleted).
//
// Available dispute ids (see src/data/disputes.json):
//   japan-yasukuni-visits        japan-forced-labor-rulings   japan-comfort-women
//   japan-security-strategy-2022 germany-poland-reparations   germany-greece-reparations
//   germany-looted-art           italy-armadio-della-vergogna italy-foibe-memory
//   italy-colonial-crimes
// ─────────────────────────────────────────────────────────────────────────────

export const disputePosts: Record<string, DisputeSocialSource> = {
  // ── Flagship example: paste a Yasukuni-visit post here ──
  'japan-yasukuni-visits': {
    platform: 'x',
    author: '', // e.g. "Sanae Takaichi"
    handle: '', // e.g. "@takaichi_sanae"
    url: '', // paste the exact post URL here
    archiveUrl: '', // paste an archive.today / Wayback snapshot here
    date: '', // e.g. "2024-08-15"
    quote: { en: '', zh: '' },
    embed: false,
  },

  'germany-poland-reparations': {
    platform: 'x',
    author: 'Poland MFA 🇵🇱',
    handle: '@PolandMFA',
    url: '', // paste the exact post URL here
    archiveUrl: '',
    date: '',
    quote: {
      en: 'Poland maintains that it never received compensation adequate to its wartime losses and continues to raise the reparations question with Germany.',
      zh: '波兰坚持认为其从未就战时损失获得充分赔偿，并持续就赔偿问题向德国交涉。',
    },
    embed: false,
  },

  'japan-security-strategy-2022': {
    platform: 'x',
    author: "Prime Minister's Office of Japan",
    handle: '@JPN_PMO',
    url: '', // paste the exact post URL here
    archiveUrl: '',
    date: '',
    quote: { en: '', zh: '' },
    embed: false,
  },
};
