// Tiny shared store so ONE "tap to play" button can start every frozen Vimeo clip
// on the page at once. Each VimeoEmbed registers a play() callback and reports
// whether it's currently blocked (autoplay denied — typically iOS Low Power Mode);
// the floating button reads the blocked count and, on tap, calls every play()
// synchronously so the single user gesture carries to all of them.

type PlayFn = () => void

const players = new Map<string, PlayFn>()
const blocked = new Set<string>()
const ready = new Set<string>() // clips whose player is attached + initialised
const subscribers = new Set<() => void>()

function notify() {
  subscribers.forEach((fn) => fn())
}

export function registerPlayer(id: string, play: PlayFn) {
  players.set(id, play)
}

export function unregisterPlayer(id: string) {
  players.delete(id)
  let changed = blocked.delete(id)
  changed = ready.delete(id) || changed
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

export function blockedCount(): number {
  return blocked.size
}

// True once every CURRENTLY-blocked clip has its player ready to play. Detection is
// viewport-gated (see VimeoEmbed), so the blocked set is just the frozen clips the
// user can actually see — waiting for those is correct and fast. (Players attach
// page-wide up front, so one tap still reaches below-the-fold clips too; we just
// don't keep the button spinning on clips that aren't on screen yet.)
export function allBlockedReady(): boolean {
  if (blocked.size === 0) return false
  for (const id of blocked) if (!ready.has(id)) return false
  return true
}

export function playAll() {
  // Synchronous loop — keeps every play() inside the tap's user gesture.
  players.forEach((play) => play())
}

// Live counts for the `?lpmdebug` on-screen panel (diagnosing real-device behavior).
export function debugState() {
  return { players: players.size, blocked: blocked.size, ready: ready.size }
}

export function subscribe(fn: () => void): () => void {
  subscribers.add(fn)
  return () => {
    subscribers.delete(fn)
  }
}
