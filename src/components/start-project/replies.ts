/* ════════════════════════════════════════════════════
   Megi's contextual replies (Start a New Project chat)

   SINGLE SOURCE OF TRUTH for the bot's answer to each selection. To change
   what Megi says, edit the copy below — nothing else needs touching.

   How it renders: each reply is ONE bubble, shaped as `${opener}, ${clause}`
   (one sentence, friendly + a touch playful, no emoji, no em dash). The opener
   is picked deterministically from the chosen value, so the same answer always
   reads the same (stable across re-renders / the reveal animation) while
   different answers vary the opener across the conversation.

   Keys MUST match the option strings in StartProjectChat.tsx exactly.
══════════════════════════════════════════════════════ */

export type ReplyStep = 'services' | 'kickoff' | 'deadline' | 'budget' | 'source'

// 5 alternative acknowledgement openers. No trailing punctuation — a comma +
// the clause is appended.
const OPENERS = ['Perfect', 'Love that', 'Great', 'Got it', 'Nice'] as const

// Per-option clause. Reads as the second half of `${opener}, ${clause}`, so
// keep each one lowercase, short, and able to follow a comma naturally.
const CLAUSES: Record<ReplyStep, Record<string, string>> = {
  services: {
    'Branding': 'an identity people actually remember is our happy place.',
    'Packaging design': 'shelf presence is where we have the most fun.',
    'Photography': 'we will make sure it looks every bit the part.',
    'Videography': 'motion is one of our favourite ways to tell a story.',
    'TV commercials': 'big screen, bigger ideas, count us in.',
    'Social media': 'we will keep your feed worth the follow.',
    'Website': 'a site that works as hard as it looks, done.',
    'Other': 'tell us a little more and we will shape it together.',
  },
  kickoff: {
    'ASAP, within the next two weeks.': 'we like momentum just as much as you do.',
    'Soon, next month would be great.': 'that gives us room to start it right.',
    'Within the next 3 months.': 'a healthy runway to do this properly.',
    'No rush. Whenever fits your team.': 'good work rarely likes being rushed.',
  },
  deadline: {
    'Within 3 months.': 'tight but very doable, we like the pace.',
    'Within 6 months.': 'plenty of space to get it right.',
    'In about a year.': 'room to be properly ambitious.',
    'Open-ended, quality over speed.': 'our favourite kind of brief.',
  },
  budget: {
    'Under €5,000': 'we will make every euro pull its weight.',
    '€5,000 – €15,000': 'a solid base to build something sharp.',
    '€15,000 – €50,000': 'now we have room to get ambitious.',
    '€50,000+': 'this is where we do our best work.',
    "Not sure yet, let's figure it out.": 'no problem, we will shape it around the work.',
  },
  source: {
    'A client referral': 'always the best kind of introduction.',
    'A friend or colleague': 'good people talk, and we appreciate it.',
    'Google': 'glad the search sent you our way.',
    'Social media': 'glad the feed did its job.',
    "I've been following BoldCrest for a while": 'that genuinely means a lot.',
    'Somewhere else': 'however you found us, we are glad you did.',
  },
}

// Deterministic opener pick: same seed -> same opener (stable across renders),
// different seeds spread across the pool.
function pickOpener(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return OPENERS[h % OPENERS.length]
}

/**
 * Megi's one-sentence contextual reply for a given selection. For multi-select
 * steps (services, source) pass the representative value (e.g. the first
 * picked). Falls back gracefully so an unmapped/empty value never breaks the
 * flow.
 */
export function botReply(step: ReplyStep, value: string | undefined): string {
  const clause = (value && CLAUSES[step]?.[value]) || 'sounds good, let us keep going.'
  return `${pickOpener(value || step)}, ${clause}`
}
