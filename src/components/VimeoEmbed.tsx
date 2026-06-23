'use client'

import { useEffect, useRef, useState } from 'react'

interface VimeoEmbedProps {
  url: string
  className?: string
  /** Native width/height of the video (from Vimeo oEmbed). Sets the box shape so
   *  square/portrait clips aren't cropped into 16:9. Falls back to 16:9. */
  aspect?: number | null
}

// Vimeo background players emit these to the parent as they run. We treat any of
// them as proof the clip is actually playing (background mode sends them WITHOUT a
// prior addEventListener, and never sends a `ready` event, so we can't gate on that).
const PLAY_EVENTS = new Set([
  'play',
  'playing',
  'playProgress',
  'timeupdate',
  'bufferend',
])

function extractVimeoId(url: string): string | null {
  // Handles: vimeo.com/123456, vimeo.com/video/123456, player.vimeo.com/video/123456
  const match = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/)
  return match ? match[1] : null
}

export default function VimeoEmbed({ url, className = '', aspect }: VimeoEmbedProps) {
  const videoId = extractVimeoId(url)
  // Native aspect from oEmbed; default to 16:9 when unknown. The box is set to
  // this aspect and the background player fills it exactly, so the clip shows at
  // its true shape.
  const aspectRatio = aspect && aspect > 0 ? aspect : 16 / 9

  // ?lpm in the URL force-shows the tap-to-play overlay so its UI can be previewed
  // on any device — real iOS Low Power Mode can't be simulated in a desktop browser.
  const forced =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('lpm')

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const playingRef = useRef(false)
  const wantPlayRef = useRef(false)
  const timerRef = useRef(0)
  // Overlay = the clip loaded but never started (autoplay blocked — typically iOS
  // Low Power Mode). After the player frame loads we wait briefly: a background clip
  // that's allowed to play emits a play signal almost immediately, so if none
  // arrives the clip is frozen and we surface a tap-to-play control. A normally
  // autoplaying clip fires the signal and the overlay never shows, so desktop and
  // standard devices are untouched.
  const [blocked, setBlocked] = useState(forced)
  const [playing, setPlaying] = useState(false)
  // Bumped on tap to remount the iframe, so the (re)load is a user gesture — which
  // iOS permits to start muted inline playback even in Low Power Mode.
  const [attempt, setAttempt] = useState(0)

  const post = (method: string, value?: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify(value === undefined ? { method } : { method, value }),
      'https://player.vimeo.com',
    )
  }

  // Watch the real player's messages; any play signal clears the overlay.
  useEffect(() => {
    if (!videoId || forced) return
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return
      if (typeof e.origin === 'string' && !e.origin.includes('vimeo')) return
      let data: unknown = e.data
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch {
          return
        }
      }
      const event = (data as { event?: string })?.event
      if (event && PLAY_EVENTS.has(event)) {
        window.clearTimeout(timerRef.current)
        playingRef.current = true
        setPlaying(true)
        setBlocked(false)
      }
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(timerRef.current)
    }
    // Re-run on remount (attempt) so the handler tracks the fresh iframe window.
  }, [videoId, forced, attempt])

  // The player frame finished loading. Subscribe (harmless if already unsolicited),
  // honour a pending tap, and start the "did it autoplay?" countdown. Tied to load
  // (not mount) so slides still off-screen — which haven't loaded — never flag.
  const onIframeLoad = () => {
    if (forced) return
    post('addEventListener', 'play')
    post('addEventListener', 'playProgress')
    if (wantPlayRef.current) post('play')
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (!playingRef.current) setBlocked(true)
    }, 3500)
  }

  if (!videoId) {
    return (
      <div
        className={`flex items-center justify-center bg-bg-card text-text-tertiary ${className}`}
        style={{ aspectRatio }}
      >
        Invalid Vimeo URL
      </div>
    )
  }

  const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1&playsinline=1`

  const handlePlay = () => {
    wantPlayRef.current = true
    playingRef.current = false
    setPlaying(false)
    post('play') // nudge the current player within the user gesture
    setAttempt((a) => a + 1) // remount → user-initiated load (iOS-allowed autoplay)
    setBlocked(false) // optimistic; the re-armed countdown re-shows it only if it truly stays frozen
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <iframe
        key={attempt}
        ref={iframeRef}
        src={embedUrl}
        onLoad={onIframeLoad}
        // Fill the native-aspect box 1:1. The old 200% overscan was a hack from
        // when the box was forced to 16:9 (to crop the letterbox); on a box that
        // already matches the clip's aspect it just zooms the video 2x.
        className="pointer-events-none absolute inset-0 h-full w-full border-none"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="Vimeo video"
      />

      {/* Tap-to-play — shown only when autoplay was blocked (e.g. Low Power Mode).
          A pill anchored bottom-right: label on the left, round play button on the
          right. Tapping reloads the clip as a user gesture so it can start. */}
      {blocked && !playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play video"
          className="group absolute bottom-3 right-3 z-20 flex items-center gap-2.5 rounded-full bg-black/55 py-1.5 pl-4 pr-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <span className="whitespace-nowrap text-[12px] font-medium leading-none tracking-wide">
            Tap to play
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-black transition-transform group-active:scale-95">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M5 3.5v9l7-4.5-7-4.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
