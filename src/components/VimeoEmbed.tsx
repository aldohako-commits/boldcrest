'use client'

import { useRef, useState } from 'react'

interface VimeoEmbedProps {
  url: string
  className?: string
  /** Native width/height of the video (from Vimeo oEmbed). Sets the box shape so
   *  square/portrait clips aren't cropped into 16:9. Falls back to 16:9. */
  aspect?: number | null
  /** true → a real player with sound + controls (click-to-play poster), instead
   *  of the default silent looping background clip. */
  feature?: boolean
  /** Poster image (Vimeo thumbnail) shown before the feature player is started. */
  poster?: string | null
}

// The official Vimeo Player SDK, loaded once and shared. We use it for ONE thing:
// pinning a retina-aware quality. Background players ignore the `quality` URL param
// and the device pixel ratio, so a ~600px box on a 2× screen was served ~720p and
// looked soft. setQuality() fixes that.
type VimeoPlayer = {
  ready: () => Promise<void>
  setQuality: (q: string) => Promise<string>
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

export default function VimeoEmbed({
  url,
  className = '',
  aspect,
  feature = false,
  poster,
}: VimeoEmbedProps) {
  const videoId = extractVimeoId(url)
  // Native aspect from oEmbed; default to 16:9 when unknown. The box is set to this
  // aspect and the background player fills it exactly, so the clip shows true shape.
  const aspectRatio = aspect && aspect > 0 ? aspect : 16 / 9

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const playerRef = useRef<VimeoPlayer | null>(null)
  const [playing, setPlaying] = useState(false)

  // Once the frame is loaded, attach the SDK player and pin a retina-aware rendition:
  // smallest quality that covers the box at the device's pixel density, capped at
  // 1080p so we never pull 2K/4K for a small looping clip.
  const onIframeLoad = () => {
    const iframe = iframeRef.current
    if (!iframe || playerRef.current) return
    loadVimeoSDK()
      .then((Player) => {
        if (playerRef.current) return
        const player = new Player(iframe)
        playerRef.current = player
        return player.ready().then(() => {
          const side = Math.max(iframe.clientWidth, iframe.clientHeight)
          const need = side * (window.devicePixelRatio || 1)
          const q =
            need <= 0 ? '1080p' : need <= 540 ? '540p' : need <= 720 ? '720p' : '1080p'
          return player.setQuality(q).catch(() => {})
        })
      })
      .catch(() => {})
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

  // Feature player: a real, click-to-play player with sound and controls, styled
  // with a site-design play button over the poster. Vimeo's own chrome (themed to
  // the brand accent) takes over once playing.
  if (feature) {
    const playerUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&playsinline=1&title=0&byline=0&portrait=0&dnt=1&color=a3a3a3`
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
        {playing ? (
          <iframe
            src={playerUrl}
            className="absolute inset-0 h-full w-full border-none"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Vimeo video"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play video"
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {poster && (
              <span
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${poster})` }}
              />
            )}
            <span
              aria-hidden
              className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30"
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className="ml-1 h-6 w-6 text-white sm:h-7 sm:w-7"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
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
        // Fill the native-aspect box 1:1 (the box already matches the clip's shape).
        className="pointer-events-none absolute inset-0 h-full w-full border-none"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        title="Vimeo video"
      />
    </div>
  )
}
