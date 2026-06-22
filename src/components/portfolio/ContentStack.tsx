'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import VimeoEmbed from '@/components/VimeoEmbed'
import { useLenis } from '@/components/LenisProvider'

const HEADER_OFFSET = 120

interface VideoMedia {
  _type: 'videoMedia'
  _key: string
  type: 'video'
  vimeoUrl?: string
  /** Native aspect ratio (w/h) resolved server-side from Vimeo oEmbed. */
  aspect?: number | null
}

interface ImageMedia {
  _type: 'imageMedia' | 'image'
  _key: string
  type: 'image'
  asset?: { _ref: string }
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  image?: { asset: { _ref: string } }
  alt?: string
}

type MediaBlock = VideoMedia | ImageMedia

interface ThumbnailImage {
  asset?: { _ref: string }
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
  alt?: string
}

interface ContentStackProps {
  media?: MediaBlock[]
  thumbnail?: ThumbnailImage
  thumbnailVideo?: string
  thumbnailVideoAspect?: number | null
  thumbnailType?: string
  /** Descriptive base for image alt text, e.g. "Client — Project Name". */
  altBase?: string
  /** Appended to alt text, e.g. "Branding · BoldCrest". */
  altSuffix?: string
}

interface StackItem {
  type: 'image' | 'video'
  key: string
  content: React.ReactNode
  // Small image source for the thumbnail rail (null → video/no-image placeholder)
  thumbSource: ThumbnailImage | { asset: { _ref: string } } | null
}

function getImageRef(img: ImageMedia): string | null {
  if (img.asset?._ref) return img.asset._ref
  if (img.image?.asset?._ref) return img.image.asset._ref
  return null
}

function getImageSource(img: ImageMedia) {
  if (img.asset?._ref) return img
  if (img.image?.asset?._ref) return img.image
  return null
}

function radiusClass(index: number, total: number): string {
  if (total === 1) return 'rounded-2xl'
  if (index === 0) return 'rounded-t-2xl'
  if (index === total - 1) return 'rounded-b-2xl'
  return ''
}

export default function ContentStack({
  media,
  thumbnail,
  thumbnailVideo,
  thumbnailVideoAspect,
  thumbnailType,
  altBase,
  altSuffix,
}: ContentStackProps) {
  const baseAlt =
    [altBase, altSuffix].filter(Boolean).join(', ') || 'BoldCrest project'
  const items: StackItem[] = []

  // Thumbnail as first item
  if (thumbnailType === 'video' && thumbnailVideo) {
    items.push({
      type: 'video',
      key: 'thumb-video',
      content: <VimeoEmbed url={thumbnailVideo} aspect={thumbnailVideoAspect} className="bg-bg-card" />,
      thumbSource: thumbnail?.asset?._ref ? thumbnail : null,
    })
  } else if (thumbnail?.asset?._ref) {
    items.push({
      type: 'image',
      key: 'thumb-image',
      content: (
        <Image
          loader={sanityImageLoader}
          src={urlFor(thumbnail).width(1800).quality(85).url()}
          alt={thumbnail.alt || baseAlt}
          width={1800}
          height={1200}
          priority
          className="h-auto w-full"
          sizes="(max-width: 959px) 100vw, 70vw"
        />
      ),
      thumbSource: thumbnail,
    })
  }

  // Media items
  if (media) {
    for (const block of media) {
      if (block._type === 'videoMedia') {
        const video = block as VideoMedia
        if (!video.vimeoUrl) continue
        items.push({
          type: 'video',
          key: video._key,
          content: <VimeoEmbed url={video.vimeoUrl} aspect={video.aspect} className="bg-bg-card" />,
          thumbSource: null,
        })
      } else if (block._type === 'imageMedia' || block._type === 'image') {
        const img = block as ImageMedia
        const ref = getImageRef(img)
        if (!ref) continue
        const source = getImageSource(img)!
        items.push({
          type: 'image',
          key: img._key,
          content: (
            <Image
              loader={sanityImageLoader}
              src={urlFor(source).width(1800).quality(85).url()}
              alt={img.alt || baseAlt}
              width={1800}
              height={1200}
              loading="lazy"
              className="h-auto w-full"
              sizes="(max-width: 959px) 100vw, 70vw"
            />
          ),
          thumbSource: source,
        })
      }
    }
  }

  const total = items.length

  const lenis = useLenis()
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const mediaStackRef = useRef<HTMLDivElement | null>(null)
  const railRef = useRef<HTMLElement | null>(null)
  const railBtnRefs = useRef<(HTMLButtonElement | null)[]>([])
  // Vertical travel (px) before a press is treated as a scrub-drag instead of a
  // click. Kept generously above a typical mouse's click-drift (a few px) so an
  // intended thumbnail click reliably jumps to that item instead of being
  // misread as a scrub — which maps cursor-Y proportionally across the stack and,
  // because media have unequal heights, lands on the wrong item.
  const DRAG_THRESHOLD = 10
  const scrub = useRef({ active: false, moved: false, startY: 0, captured: false })
  const rafRef = useRef(0)
  const [active, setActive] = useState(0)
  // 0..1 position of the indicator line = how far we've scrolled through the media
  const [progress, setProgress] = useState(0)

  // Per-item "snap" = the scroll position that brings item i to the header offset,
  // clamped to the document's real scroll range. EVERYTHING (active item, indicator
  // line, drag-scrub) is expressed against these snaps so the rail shares ONE
  // coordinate system with the thumbnails. The old code mapped the line by uniform
  // scroll-fraction while the thumbnails are laid out by item index — and because
  // media heights are unequal those disagreed, so the line drifted off the active
  // thumbnail (worst near the end, where the last item's snap clamps).
  const getSnaps = useCallback(() => {
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    const y = window.scrollY
    const snaps: number[] = []
    for (let i = 0; i < total; i++) {
      const el = itemRefs.current[i]
      const docTop = el ? el.getBoundingClientRect().top + y : 0
      snaps[i] = Math.min(Math.max(0, docTop - HEADER_OFFSET), maxScroll)
    }
    return snaps
  }, [total])

  // Vertical center of thumbnail i within the rail (px), used to place the line.
  const thumbCenter = (i: number) => {
    const b = railBtnRefs.current[i]
    return b ? b.offsetTop + b.offsetHeight / 2 : 0
  }

  // Recompute the indicator-line position (in thumbnail space) and the active item.
  const computeState = useCallback(() => {
    const rail = railRef.current
    if (!rail || total === 0) return
    const snaps = getSnaps()
    const y = window.scrollY
    // active = last item whose snap we've reached; f = progress toward the next.
    let a = 0
    for (let i = 0; i < total; i++) {
      if (y + 1 >= snaps[i]) a = i
      else break
    }
    let f = 0
    if (a < total - 1) {
      const span = snaps[a + 1] - snaps[a]
      f = span > 0 ? Math.min(1, Math.max(0, (y - snaps[a]) / span)) : 0
    }
    setActive(a)
    // Line center = active thumbnail center, interpolated toward the next by f, so
    // the marker rides exactly through the thumbnails.
    const cur = thumbCenter(a)
    const nxt = a < total - 1 ? thumbCenter(a + 1) : cur
    const railH = rail.offsetHeight || 1
    setProgress((cur + f * (nxt - cur)) / railH)
  }, [total, getSnaps])

  // Drag the rail to scrub: the cursor maps to the thumbnail under it (+ how far
  // through it), then to that item's snap range — so dragging over a thumbnail
  // scrolls to that media, matching a click. (deuxhuithuit-style minimap, but
  // per-item rather than uniform so it can't drift off the thumbnails.)
  const scrubTo = (clientY: number) => {
    const rail = railRef.current
    if (!rail || total === 0) return
    const railRect = rail.getBoundingClientRect()
    const railH = rail.offsetHeight || 1
    const localY = Math.min(railH, Math.max(0, clientY - railRect.top))
    // thumbnail under the cursor
    let i = 0
    for (let k = 0; k < total; k++) {
      const b = railBtnRefs.current[k]
      if (!b) continue
      if (localY >= b.offsetTop) i = k
      else break
    }
    const b = railBtnRefs.current[i]
    const slot = b ? b.offsetHeight + 3 /* gap-[3px] */ : railH / total
    const f = b ? Math.min(1, Math.max(0, (localY - b.offsetTop) / slot)) : 0
    const snaps = getSnaps()
    const s0 = snaps[i]
    const s1 = i < total - 1 ? snaps[i + 1] : s0
    const target = s0 + f * (s1 - s0)
    setProgress(localY / railH) // line follows the cursor immediately
    // `force` lets the jump land even though Lenis is paused for the drag (below).
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true })
    else window.scrollTo(0, target)
  }

  const onRailPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    // Mouse AND touch scrub. The rail is `touch-none`, so a finger drag on it
    // scrubs the stack instead of scrolling the page; a tap (no movement past the
    // threshold) still falls through to a thumbnail's onClick. Touch used to feel
    // glitchy because the old proportional scrub jumped around — the item-space
    // scrub + unconditional capture release fix that.
    scrub.current = { active: true, moved: false, startY: e.clientY, captured: false }
  }
  const onRailPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!scrub.current.active) return
    if (!scrub.current.moved && Math.abs(e.clientY - scrub.current.startY) > DRAG_THRESHOLD) {
      // Real drag: take over the pointer (only now, so a plain click still
      // reaches a thumbnail button) and start scrubbing.
      scrub.current.moved = true
      // Pause Lenis for the duration of the drag. Otherwise Lenis ALSO reads the
      // same finger as a scroll gesture (it keeps native touch listeners) and adds
      // its own delta on top of our scrubTo — the two fight and the page jitters up
      // and down. Stopped, Lenis ignores input; scrubTo drives scroll with `force`.
      lenis?.stop()
      try {
        railRef.current?.setPointerCapture?.(e.pointerId)
        scrub.current.captured = true
      } catch {
        /* ignore — capture is best-effort */
      }
    }
    if (scrub.current.moved) scrubTo(e.clientY)
  }
  // End the gesture however it finishes (up / cancel / leave). Release pointer
  // capture UNCONDITIONALLY — the old `if (!active) return` guard could skip the
  // release when a `pointercancel` had already cleared `active`, leaking the
  // capture so the rail swallowed every subsequent click ("can't pick another").
  const endRailGesture = (e: React.PointerEvent<HTMLElement>) => {
    if (scrub.current.captured) {
      try {
        railRef.current?.releasePointerCapture?.(e.pointerId)
      } catch {
        /* ignore */
      }
      scrub.current.captured = false
    }
    scrub.current.active = false
    // Resume Lenis (idempotent — safe even if this gesture was only a tap and we
    // never stopped it). Its internal position is already synced via scrubTo.
    lenis?.start()
  }
  // Swallow the click that follows a real drag so it doesn't also jump.
  const onRailClickCapture = (e: React.MouseEvent<HTMLElement>) => {
    if (scrub.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      scrub.current.moved = false
    }
  }

  // Drive the indicator line + active thumbnail from page scroll (rAF-throttled).
  useEffect(() => {
    if (total <= 1) return
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(computeState)
    }
    computeState()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [total, computeState])

  // Jump to a thumbnail's media. Drive it through Lenis with an explicit target
  // (item top minus the header offset) — the same path the scrub uses. A native
  // `scrollIntoView` here fights Lenis's own smooth-scroll and settles a little
  // short, so clicking a far thumbnail used to land on the previous item.
  const scrollToItem = (i: number) => {
    const el = itemRefs.current[i]
    if (!el) return
    const target = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    if (lenis) lenis.scrollTo(target)
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (total === 0) return null

  return (
    <div className="flex justify-center gap-[var(--space-2xl)]">
      {/* Invisible left spacer mirroring the navigator so the media is centred */}
      {total > 1 && (
        <div aria-hidden className="hidden w-[42px] shrink-0 min-[960px]:block pointer-coarse:w-[60px]" />
      )}
      {/* Media stack — centred (capped width), the navigator sits to its right */}
      <div ref={mediaStackRef} className="flex w-full min-w-0 max-w-[1200px] flex-col">
        {items.map((item, i) => (
          <div
            key={item.key}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            data-idx={i}
            className={`relative w-full scroll-mt-[120px] overflow-hidden bg-bg-card ${radiusClass(i, total)}`}
          >
            {item.content}
          </div>
        ))}
      </div>

      {/* Thumbnail navigator — to the right of the media, sticky, drag-to-scrub */}
      {total > 1 && (
        <nav
          ref={railRef}
          aria-label="Project media"
          onPointerDown={onRailPointerDown}
          onPointerMove={onRailPointerMove}
          onPointerUp={endRailGesture}
          onPointerCancel={endRailGesture}
          onClickCapture={onRailClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className="sticky top-[120px] hidden w-[42px] shrink-0 cursor-grab touch-none select-none flex-col gap-[3px] self-start active:cursor-grabbing min-[960px]:flex pointer-coarse:w-[60px] [&_img]:pointer-events-none [&_img]:select-none"
        >
          {/* Continuous indicator line — tracks scroll/drag position, thicker
              and sticking out slightly past the sides of the rail. */}
          <span
            aria-hidden
            style={{ top: `${progress * 100}%` }}
            className="pointer-events-none absolute -left-[5px] -right-[5px] z-10 h-[3px] -translate-y-1/2 rounded-full bg-white/75"
          />
          {items.map((item, i) => {
            const isActive = active === i
            return (
              <button
                key={item.key}
                ref={(el) => {
                  railBtnRefs.current[i] = el
                }}
                type="button"
                onClick={() => scrollToItem(i)}
                aria-label={`Go to media ${i + 1}`}
                aria-current={isActive}
                className="group relative block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[3px]"
              >
                <span
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'
                  }`}
                >
                  {item.thumbSource ? (
                    <Image
                      loader={sanityImageLoader}
                      src={urlFor(item.thumbSource).width(150).height(112).quality(70).url()}
                      alt=""
                      fill
                      draggable={false}
                      sizes="42px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-bg-elevated">
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-text-tertiary">
                        <path d="M5 3.5v9l7-4.5-7-4.5z" fill="currentColor" />
                      </svg>
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </nav>
      )}
    </div>
  )
}

