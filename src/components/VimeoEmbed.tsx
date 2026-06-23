'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  registerPlayer,
  setBlocked as setBlockedInStore,
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

  // Preload the SDK as soon as the overlay shows, so the tap handler can call
  // play() synchronously (the load is no longer in the gesture's critical path).
  useEffect(() => {
    if (blocked && !forced) loadVimeoSDK().catch(() => {})
  }, [blocked, forced])

  // Start THIS clip. Driven by the shared "play all" button: one tap fires every
  // registered clip's play() synchronously, so the single user gesture carries to
  // all of them (iOS allows muted, gesture-initiated playback even in Low Power
  // Mode). A bare postMessage 'play' wouldn't carry the gesture across the iframe;
  // the SDK's player.play() does.
  const playSelf = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const start = (Player: VimeoPlayerCtor) => {
      try {
        if (!playerRef.current) playerRef.current = new Player(iframe)
        const player = playerRef.current
        player.setMuted(true).catch(() => {})
        player
          .play()
          .then(clearOverlay)
          .catch(() => post('play')) // last-resort nudge
      } catch {
        post('play')
      }
    }
    const Player = (
      window as unknown as { Vimeo?: { Player?: VimeoPlayerCtor } }
    ).Vimeo?.Player
    if (Player) start(Player) // synchronous — best for preserving the iOS gesture
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
  // and start the "did it autoplay?" countdown. Tied to load (not mount) so slides
  // still off-screen — which haven't loaded — never flag.
  const onIframeLoad = () => {
    if (forced) return
    post('addEventListener', 'play')
    post('addEventListener', 'playProgress')
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
        loading="lazy"
        title="Vimeo video"
      />
    </div>
  )
}
