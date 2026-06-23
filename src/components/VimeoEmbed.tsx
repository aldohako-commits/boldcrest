'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  registerPlayer,
  setBlocked as setBlockedInStore,
  setPlayed as setPlayedInStore,
  setReady as setReadyInStore,
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
  setQuality: (q: string) => Promise<string>
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
  // Detection only runs once the clip has BOTH loaded and scrolled into view — see
  // the IntersectionObserver effect for why (mobile defers off-screen autoplay).
  const loadedRef = useRef(false)
  const intersectingRef = useRef(false)
  // Overlay = the clip loaded but never started (autoplay blocked — typically iOS
  // Low Power Mode). After the player frame loads we wait briefly: a background clip
  // that's allowed to play emits a play signal almost immediately, so if none
  // arrives the clip is frozen and we surface a tap-to-play control. A normally
  // autoplaying clip fires the signal and the overlay never shows, so desktop and
  // standard devices are untouched.
  const [blocked, setBlocked] = useState(forced)
  const [playing, setPlaying] = useState(false)

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
    // Page-wide proof autoplay works here → it's not Low Power Mode → the banner
    // must never show (kills the brief desktop flash where a clip's "frozen?" timer
    // fires a hair before its play event arrives).
    setPlayedInStore(id)
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

  // Attach the Vimeo SDK player to EVERY clip up front (the SDK is already warmed on
  // iframe load, so this adds no extra network cost). Two wins at once:
  //   1. Quality — background players honor neither the `quality` URL param nor the
  //      device pixel ratio, so on a 2× screen a ~600px box was served ~720p and
  //      looked soft. We pin a retina-aware rendition via the SDK instead.
  //   2. Low Power Mode tap — the player is pre-attached, so one press plays every
  //      clip with no cold-load race (lazily creating it on tap defers play() past
  //      the iOS gesture window → blocked).
  useEffect(() => {
    let cancelled = false
    loadVimeoSDK()
      .then((Player) => {
        if (cancelled || playerRef.current || !iframeRef.current) return
        const player = new Player(iframeRef.current)
        playerRef.current = player
        player
          .ready()
          .then(() => {
            if (cancelled) return
            // Smallest rendition that covers the box at the device's pixel density,
            // capped at 1080p so we never pull 2K/4K for a small looping clip.
            const el = iframeRef.current
            const side = el ? Math.max(el.clientWidth, el.clientHeight) : 0
            const need = side * (window.devicePixelRatio || 1)
            const q = need <= 0 ? '1080p' : need <= 540 ? '540p' : need <= 720 ? '720p' : '1080p'
            player.setQuality(q).catch(() => {})
            // Mark ready: the banner waits for ALL clips before the spinner becomes
            // a pressable play button.
            setReadyInStore(id, true)
          })
          .catch(() => {})
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [id])

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

  // Arm the "did it autoplay?" countdown — but ONLY when the clip has loaded AND is
  // in view AND hasn't already played. An allowed clip emits a play signal within a
  // few hundred ms; if none arrives within the grace window the clip is frozen and we
  // surface the tap-to-play banner. Gating on visibility is essential: mobile browsers
  // don't autoplay OFF-screen clips even when Low Power Mode is OFF, so an on-load-only
  // timer flagged them as frozen and showed the banner with no Low Power Mode at all.
  const armDetection = useCallback(() => {
    if (
      forced ||
      timerRef.current ||
      !loadedRef.current ||
      !intersectingRef.current ||
      playingRef.current
    )
      return
    timerRef.current = window.setTimeout(() => {
      timerRef.current = 0
      if (!playingRef.current) setBlocked(true)
    }, 1500)
  }, [forced])

  const disarmDetection = useCallback(() => {
    window.clearTimeout(timerRef.current)
    timerRef.current = 0
  }, [])

  // The player frame finished loading. Subscribe (harmless if already unsolicited),
  // warm the SDK, and arm detection (fires only if the clip is also in view).
  const onIframeLoad = () => {
    // Warm the SDK now (memoised, shared) so it's ready long before the banner shows
    // and the user can press — avoids the cold-load race where play() fires after the
    // tap gesture has expired (which needed a refresh to work).
    loadVimeoSDK().catch(() => {})
    if (forced) return
    post('addEventListener', 'play')
    post('addEventListener', 'playProgress')
    loadedRef.current = true
    armDetection()
  }

  // Detection is viewport-gated: a clip only counts as "frozen" if it's actually
  // on-screen (where a normal device WOULD autoplay) yet hasn't started. Off-screen
  // clips are left alone — mobile legitimately defers their autoplay. Re-arms on enter,
  // cancels on exit so a clip scrolled past before the grace elapses isn't misjudged.
  useEffect(() => {
    if (forced || !videoId) return
    const el = iframeRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1]
        if (!e) return
        intersectingRef.current = e.isIntersecting
        if (e.isIntersecting) armDetection()
        else disarmDetection()
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      disarmDetection()
    }
  }, [forced, videoId, armDetection, disarmDetection])

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

  // No `quality` URL param: background players ignore it and stay on `auto` (verified
  // — getQuality reports "auto" with it set). The rendition is pinned via the SDK's
  // setQuality() once the player attaches (see the attach effect above).
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
