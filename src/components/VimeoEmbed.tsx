'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  blockedCount,
  registerPlayer,
  setBlocked as setBlockedInStore,
  setReady as setReadyInStore,
  subscribe,
  unregisterPlayer,
} from './vimeoPlayAll'

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

// The official Vimeo Player SDK, loaded once and shared. We need it (not a raw
// postMessage) to start a clip from a tap on iOS Low Power Mode: player.play()
// called inside the gesture carries the user activation across the cross-origin
// iframe, which a bare postMessage 'play' does not.
type VimeoPlayer = {
  play: () => Promise<void>
  setMuted: (m: boolean) => Promise<boolean>
  ready: () => Promise<void>
}
type VimeoPlayerCtor = new (el: HTMLIFrameElement) => VimeoPlayer
let sdkPromise: Promise<VimeoPlayerCtor> | null = null
function loadVimeoSDK(): Promise<VimeoPlayerCtor> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  const existing = (window as unknown as { Vimeo?: { Player?: VimeoPlayerCtor } })
    .Vimeo?.Player
  if (existing) return Promise.resolve(existing)
  if (!sdkPromise) {
    sdkPromise = new Promise<VimeoPlayerCtor>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://player.vimeo.com/api/player.js'
      s.async = true
      s.onload = () => {
        const P = (window as unknown as { Vimeo?: { Player?: VimeoPlayerCtor } })
          .Vimeo?.Player
        if (P) resolve(P)
        else reject(new Error('Vimeo SDK missing'))
      }
      s.onerror = () => reject(new Error('Vimeo SDK failed to load'))
      document.head.appendChild(s)
    })
  }
  return sdkPromise
}

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

  const id = useId()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const playerRef = useRef<VimeoPlayer | null>(null)
  const playingRef = useRef(false)
  const timerRef = useRef(0)
  // Overlay = the clip loaded but never started (autoplay blocked — typically iOS
  // Low Power Mode). After the player frame loads we wait briefly: a background clip
  // that's allowed to play emits a play signal almost immediately, so if none
  // arrives the clip is frozen and we surface a tap-to-play control. A normally
  // autoplaying clip fires the signal and the overlay never shows, so desktop and
  // standard devices are untouched.
  const [blocked, setBlocked] = useState(forced)
  const [playing, setPlaying] = useState(false)
  // True once ANY clip on the page is frozen. Lets every clip pre-attach its player
  // the moment Low Power Mode is detected (not only when its own timer fires), so a
  // tap right when the banner appears reaches all clips. Starts false (matches SSR).
  const [anyBlocked, setAnyBlocked] = useState(false)

  const post = (method: string, value?: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify(value === undefined ? { method } : { method, value }),
      'https://player.vimeo.com',
    )
  }

  const clearOverlay = () => {
    window.clearTimeout(timerRef.current)
    playingRef.current = true
    setPlaying(true)
    setBlocked(false)
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
      if (event && PLAY_EVENTS.has(event)) clearOverlay()
    }
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(timerRef.current)
    }
  }, [videoId, forced])

  // Mirror the page-wide "any clip frozen?" flag.
  useEffect(() => {
    if (forced) {
      const raf = requestAnimationFrame(() => setAnyBlocked(true))
      return () => cancelAnimationFrame(raf)
    }
    return subscribe(() => setAnyBlocked(blockedCount() > 0))
  }, [forced])

  // As soon as ANY clip is frozen (this one, any other in Low Power Mode, or ?lpm
  // test mode), load the SDK AND attach this clip's Player up front. Creating it
  // lazily on the first tap defers play() until the player's async handshake
  // finishes — past the gesture window — so iOS blocks it. Pre-attached, the tap's
  // play() fires immediately, inside the user gesture, for EVERY clip at once.
  useEffect(() => {
    if (!blocked && !forced && !anyBlocked) return
    let cancelled = false
    loadVimeoSDK()
      .then((Player) => {
        if (cancelled || playerRef.current || !iframeRef.current) return
        const player = new Player(iframeRef.current)
        playerRef.current = player
        // Mark this clip ready once its player has initialised — the banner waits
        // for ALL clips before it stops spinning and becomes pressable.
        player
          .ready()
          .then(() => {
            if (!cancelled) setReadyInStore(id, true)
          })
          .catch(() => {})
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [blocked, forced, anyBlocked, id])

  // Start THIS clip. Driven by the shared "play all" button: one tap fires every
  // registered clip's play() synchronously, so the single user gesture carries to
  // all of them (iOS allows muted, gesture-initiated playback even in Low Power
  // Mode). A bare postMessage 'play' wouldn't carry the gesture across the iframe;
  // the SDK's player.play() does.
  const playSelf = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const run = (player: VimeoPlayer) => {
      player.setMuted(true).catch(() => {})
      player
        .play()
        .then(clearOverlay)
        .catch(() => post('play')) // last-resort nudge
    }
    // Player was attached up front by the effect above — play immediately so the
    // call stays inside the user gesture.
    if (playerRef.current) {
      run(playerRef.current)
      return
    }
    // Fallback: not attached yet — create then play (may miss the gesture window).
    const Player = (
      window as unknown as { Vimeo?: { Player?: VimeoPlayerCtor } }
    ).Vimeo?.Player
    const start = (P: VimeoPlayerCtor) => {
      try {
        playerRef.current = new P(iframe)
        run(playerRef.current)
      } catch {
        post('play')
      }
    }
    if (Player) start(Player)
    else loadVimeoSDK().then(start).catch(() => post('play'))
    // clearOverlay/post read only refs + stable setters, so no extra deps needed.
  }, [])

  // Register with the shared store so the single "play all" button can reach this
  // clip, and report whether it's currently frozen (drives the button's visibility).
  useEffect(() => {
    registerPlayer(id, playSelf)
    return () => unregisterPlayer(id)
  }, [id, playSelf])

  useEffect(() => {
    setBlockedInStore(id, blocked && !playing)
  }, [id, blocked, playing])

  // The player frame finished loading. Subscribe (harmless if already unsolicited)
  // and start the "did it autoplay?" countdown. An allowed clip emits a play signal
  // within a few hundred ms, so a short wait surfaces the banner fast; a slow-but-
  // working clip that starts late still clears it via the play event.
  const onIframeLoad = () => {
    // Warm the SDK now (memoised, shared) so it's ready long before the banner shows
    // and the user can press — avoids the cold-load race where play() fires after the
    // tap gesture has expired (which needed a refresh to work).
    loadVimeoSDK().catch(() => {})
    if (forced) return
    post('addEventListener', 'play')
    post('addEventListener', 'playProgress')
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      if (!playingRef.current) setBlocked(true)
    }, 1000)
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

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        onLoad={onIframeLoad}
        // Fill the native-aspect box 1:1. The old 200% overscan was a hack from
        // when the box was forced to 16:9 (to crop the letterbox); on a box that
        // already matches the clip's aspect it just zooms the video 2x.
        className="pointer-events-none absolute inset-0 h-full w-full border-none"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        // Eager (not lazy): every clip loads + pre-attaches its player up front, so a
        // single "play all" tap reaches the below-the-fold ones too. (Lazy left them
        // unloaded at tap time, so they couldn't be played in Low Power Mode.)
        loading="eager"
        title="Vimeo video"
      />
    </div>
  )
}
