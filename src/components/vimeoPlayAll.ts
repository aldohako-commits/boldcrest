// Tiny shared store so ONE "tap to play" button can start every frozen Vimeo clip
// on the page at once. Each VimeoEmbed registers a play() callback and reports
// whether it's currently blocked (autoplay denied — typically iOS Low Power Mode);
// the floating button reads the blocked count and, on tap, calls every play()
// synchronously so the single user gesture carries to all of them.

type PlayFn = () => void

const players = new Map<string, PlayFn>()
const blocked = new Set<string>()
const subscribers = new Set<() => void>()

function notify() {
  subscribers.forEach((fn) => fn())
}

export function registerPlayer(id: string, play: PlayFn) {
  players.set(id, play)
}

export function unregisterPlayer(id: string) {
  players.delete(id)
  if (blocked.delete(id)) notify()
}

export function setBlocked(id: string, isBlocked: boolean) {
  const had = blocked.has(id)
  if (isBlocked) blocked.add(id)
  else blocked.delete(id)
  if (blocked.has(id) !== had) notify()
}

export function blockedCount(): number {
  return blocked.size
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
