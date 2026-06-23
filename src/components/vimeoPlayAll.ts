// Tiny shared store so ONE "tap to play" button can start every frozen Vimeo clip
// on the page at once. Each VimeoEmbed registers a play() callback and reports
// whether it's currently blocked (autoplay denied — typically iOS Low Power Mode);
// the floating button reads the blocked count and, on tap, calls every play()
// synchronously so the single user gesture carries to all of them.

type PlayFn = () => void

const players = new Map<string, PlayFn>()
const blocked = new Set<string>()
const ready = new Set<string>() // clips whose player is attached + initialised
const played = new Set<string>() // clips that have actually started playing
const subscribers = new Set<() => void>()

function notify() {
  subscribers.forEach((fn) => fn())
}

export function registerPlayer(id: string, play: PlayFn) {
  players.set(id, play)
  // Re-evaluate readiness as the clip count grows, so "all clips ready" can't pass
  // on a partial set while the rest of the page's players are still mounting.
  notify()
}

export function unregisterPlayer(id: string) {
  players.delete(id)
  let changed = blocked.delete(id)
  changed = ready.delete(id) || changed
  // Keep `played` sticky — once a clip has played, autoplay works on this device,
  // and we never want the Low Power Mode banner to reappear for the page.
  if (changed) notify()
}

export function setBlocked(id: string, isBlocked: boolean) {
  const had = blocked.has(id)
  if (isBlocked) blocked.add(id)
  else blocked.delete(id)
  if (blocked.has(id) !== had) notify()
}

export function setReady(id: string, isReady: boolean) {
  const had = ready.has(id)
  if (isReady) ready.add(id)
  else ready.delete(id)
  if (ready.has(id) !== had) notify()
}

// A clip actually started playing. Sticky page-wide signal that autoplay works on
// this device (so it's NOT Low Power Mode) — used to suppress the banner.
export function setPlayed(id: string) {
  if (!played.has(id)) {
    played.add(id)
    notify()
  }
}

export function anyPlayed(): boolean {
  return played.size > 0
}

export function blockedCount(): number {
  return blocked.size
}

// True once EVERY clip on the page has its player ready to play — not just the
// currently-blocked subset. On a long portfolio whose clips load progressively,
// gating on the blocked subset alone let the button go pressable after the FIRST
// clip was ready, while later clips weren't loaded/attached yet — so a tap couldn't
// reach them (the "had to refresh" bug). Waiting for ALL players fixes that; the
// spinner simply lasts until the whole page is primed.
export function allClipsReady(): boolean {
  if (blocked.size === 0 || players.size === 0) return false
  for (const id of players.keys()) if (!ready.has(id)) return false
  return true
}

export function playAll() {
  // Synchronous loop — keeps every play() inside the tap's user gesture.
  players.forEach((play) => play())
}

export function subscribe(fn: () => void): () => void {
  subscribers.add(fn)
  return () => {
    subscribers.delete(fn)
  }
}
