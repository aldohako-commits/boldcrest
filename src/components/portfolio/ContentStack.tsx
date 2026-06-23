'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import VimeoEmbed from '@/components/VimeoEmbed'
import { useLenis } from '@/components/LenisProvider'

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
  // Native aspect ratio (w/h) of the SLIDE, so the rail thumbnail keeps the slide's
  // real proportions (square→square, tall→tall) instead of a forced/cropped box.
  aspect: number
}

// Fallback when a slide's native ratio is unknown (matches the 1800×1200 default).
const FALLBACK_ASPECT = 3 / 2

// Sanity asset refs encode dimensions, e.g. `image-abc123-1200x800-jpg` → 1200/800.
function refAspect(ref: string | undefined | null): number | null {
  if (!ref) return null
  const m = ref.match(/-(\d+)x(\d+)-/)
  if (!m) return null
  const w = Number(m[1])
  const h = Number(m[2])
  return w > 0 && h > 0 ? w / h : null
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
      aspect:
        thumbnailVideoAspect ||
        refAspect(thumbnail?.asset?._ref) ||
        FALLBACK_ASPECT,
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
      aspect: refAspect(thumbnail.asset._ref) || FALLBACK_ASPECT,
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
          aspect: video.aspect || FALLBACK_ASPECT,
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
          aspect: refAspect(ref) || FALLBACK_ASPECT,
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
  // Geometry frozen at the start of a drag-scrub. The whole gesture maps the
  // finger against THIS snapshot — never live layout — so a programmatic scroll
  // mid-gesture can't feed a stale getBoundingClientRect/scrollY read back into
  // the next target and oscillate (the iPad "weird up and down" at slow speeds).
  const scrubGeom = useRef<{
    railTop: number
    railH: number
    buttons: { top: number; h: number }[]
    snaps: number[]
  } | null>(null)
  const rafRef = useRef(0)
  const [active, setActive] = useState(0)
  // 0..1 position of the indicator line = how far we've scrolled through the media
  const [progress, setProgress] = useState(0)
  // Resolved rail width (px). Normally the responsive base width; only shrinks below
  // it — uniformly, so EVERY thumbnail keeps its native aspect — when the natural
  // column (sum of aspect-derived heights) wouldn't fit the safe vertical area.
  const [railW, setRailW] = useState<number | null>(null)
  // Desktop sticky `top` offset (px). Set so the rail PINS vertically centred in the
  // viewport: it flows aligned with the portfolio top, then sticks at centre once the
  // portfolio top scrolls past. null on touch (the rail is fixed there instead).
  const [railTop, setRailTop] = useState<number | null>(null)
  // Desktop horizontal nudge (px, ≤ 0). On wide screens the rail sits at its natural
  // gap right of the portfolio (shift 0). As the window narrows and the rail would get
  // pushed toward the screen edge, we slide it LEFT so it sits centred in the gutter
  // between the portfolio's right edge and the screen edge (equal black bars either
  // side). Never shifts right, so wide layouts are untouched.
  const [railShiftX, setRailShiftX] = useState(0)
  // Latest per-slide native aspects, read by the width effect on resize.
  const aspectsRef = useRef<number[]>([])
  aspectsRef.current = items.map((it) => it.aspect)

  // Per-item "snap" = the scroll position that CENTERS item i in the viewport,
  // clamped to the document's real scroll range. (Top-aligning to the header left
  // a near-viewport-tall slide's center well below the screen center — it read as
  // "slightly lowered".) EVERYTHING (active item, indicator line, drag-scrub) is
  // expressed against these snaps so the rail shares ONE coordinate system with the
  // thumbnails: marker on a thumbnail ⇒ that slide centered on screen.
  const getSnaps = useCallback(() => {
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    const y = window.scrollY
    const half = window.innerHeight / 2
    const snaps: number[] = []
    for (let i = 0; i < total; i++) {
      const el = itemRefs.current[i]
      const r = el?.getBoundingClientRect()
      const docCenter = r ? r.top + y + r.height / 2 : 0
      snaps[i] = Math.min(Math.max(0, docCenter - half), maxScroll)
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
    // While a drag is actively scrubbing, scrubTo owns the marker (it follows the
    // finger). Bailing here stops the scroll-driven value from fighting it every
    // frame. Gated on `active` too so the marker resumes the moment the finger
    // lifts (`moved` lingers until the next press, to suppress the drag's click).
    if (scrub.current.active && scrub.current.moved) return
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

  // Snapshot the rail + snap geometry once, at the moment a drag begins. Read
  // here (before any programmatic scroll) the values are consistent; reading them
  // again mid-gesture on iOS returns stale scroll/rect values that oscillate.
  const freezeScrubGeom = () => {
    const rail = railRef.current
    if (!rail || total === 0) return
    const y = window.scrollY
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    )
    const half = window.innerHeight / 2
    const buttons = railBtnRefs.current.slice(0, total).map((b) => ({
      top: b ? b.offsetTop : 0,
      h: b ? b.offsetHeight : 1,
    }))
    const snaps: number[] = []
    for (let i = 0; i < total; i++) {
      const el = itemRefs.current[i]
      const r = el?.getBoundingClientRect()
      const docCenter = r ? r.top + y + r.height / 2 : 0
      snaps[i] = Math.min(Math.max(0, docCenter - half), maxScroll)
    }
    scrubGeom.current = {
      railTop: rail.getBoundingClientRect().top,
      railH: rail.offsetHeight || 1,
      buttons,
      snaps,
    }
  }

  // Drag the rail to scrub: the finger maps to the thumbnail under it (+ how far
  // through it), then to that item's snap range — so dragging over a thumbnail
  // scrolls to that media, matching a click. Everything reads from the FROZEN
  // snapshot, so the target is a pure function of the finger position (no live
  // layout reads to go stale and oscillate). The marker follows the finger.
  const scrubTo = (clientY: number) => {
    const g = scrubGeom.current
    if (!g) return
    // Scrub is mouse-only, so live layout reads are safe here (the frozen snapshot
    // existed to avoid iOS touch oscillation, a path this never runs). Reading the
    // rail's LIVE top + height keeps the cursor mapped to the right thumbnail and the
    // marker exactly under the pointer whether the rail is stuck or still scrolling.
    const rail = railRef.current
    const railTop = rail ? rail.getBoundingClientRect().top : g.railTop
    const railH = rail?.offsetHeight || g.railH
    // The resting indicator (computeState) lives in thumbnail-CENTRE space: the line
    // marks the centre of the active thumbnail, interpolated toward the next as you
    // scroll. Map the cursor through that SAME space so the marker is under the pointer
    // AND already at the portfolio's position — no jump when you release. Clamp to the
    // first/last centres so the line never points where the portfolio can't scroll.
    const centers = g.buttons.map((bt) => bt.top + bt.h / 2)
    const last = centers.length - 1
    const my = Math.min(centers[last], Math.max(centers[0], clientY - railTop))
    let i = 0
    for (let k = 0; k < last; k++) {
      if (my >= centers[k]) i = k
      else break
    }
    const c0 = centers[i]
    const c1 = i < last ? centers[i + 1] : c0
    const f = c1 > c0 ? (my - c0) / (c1 - c0) : 0
    const s0 = g.snaps[i]
    const s1 = i < g.snaps.length - 1 ? g.snaps[i + 1] : s0
    const target = s0 + f * (s1 - s0)
    setActive(i) // matches the resting active item for this scroll position
    setProgress(my / railH) // marker = cursor = portfolio position → no settle
    // `force` lets the jump land even though Lenis is paused for the drag.
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true })
    else window.scrollTo(0, target)
  }

  const onRailPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    // ONLY the mouse scrubs. Driving the scroll from JS on every touch-move fights
    // iOS WebKit (Safari AND Chrome on iPad both use WebKit): it jitters and, worse,
    // blanks the large media to black because the engine can't repaint fast enough.
    // On touch the rail is `touch-pan-y`, so a finger drag scrolls the page
    // natively (smooth, no blank-outs) and a tap still jumps to a thumbnail.
    if (e.pointerType !== 'mouse') {
      // Fully reset so a touch tap is never mistaken for a drag's trailing click.
      scrub.current = { active: false, moved: false, startY: 0, captured: false }
      return
    }
    scrub.current = { active: true, moved: false, startY: e.clientY, captured: false }
  }
  const onRailPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!scrub.current.active) return
    if (!scrub.current.moved && Math.abs(e.clientY - scrub.current.startY) > DRAG_THRESHOLD) {
      // Real drag: take over the pointer (only now, so a plain click still
      // reaches a thumbnail button) and start scrubbing.
      scrub.current.moved = true
      freezeScrubGeom() // snapshot geometry BEFORE the first programmatic scroll
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
    scrubGeom.current = null
    // Resume Lenis (idempotent — safe even if this gesture was only a tap and we
    // never stopped it). Its internal position is already synced via scrubTo.
    lenis?.start()
    // Reconcile the marker to the settled scroll position (active is now false, so
    // computeState no longer bails) — snaps the line onto the final thumbnail.
    computeState()
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

  // ≥960px touch (iPad): the rail keeps a narrow 32px reservation in flow (so the
  // portfolio doesn't move) while its wider visual column is floated into the right
  // gutter via the SAME sticky-centre + transform path as desktop (see the width
  // effect below). `isTouch` only gates that 32px reservation; it's set there.
  const [isTouch, setIsTouch] = useState(false)

  // Resolve the rail width. Thumbnails are NEVER cropped or squashed — each keeps its
  // slide's native aspect, so its height is just width / aspect. The only lever we
  // have to make a long column fit the safe vertical area is the shared width: if the
  // natural column (Σ width/aspect + gaps) overflows, we reduce the width uniformly,
  // which scales every thumbnail down proportionally and preserves all aspects. When
  // it already fits, we use the full responsive base width — no shrinking.
  const lastViewport = useRef({ w: 0, h: 0 })
  useEffect(() => {
    if (total <= 1) return
    const GAP = 3 // matches the rail's gap-[3px]; kept constant so spacing is uniform
    const MIN_W = 20
    const compute = (force: boolean) => {
      const iw = window.innerWidth
      const ih = window.innerHeight
      const coarse = window.matchMedia('(pointer: coarse)').matches && iw >= 960
      // On TOUCH, ignore the small innerHeight jitter a mobile browser's toolbar emits
      // while scrolling — it would otherwise re-scale the rail (and shift its centre)
      // every time you change scroll direction. Width changes and big height changes
      // (orientation / real resize) still recompute. Desktop innerHeight is stable
      // during scroll, so it always recomputes — no width drift either way.
      if (
        !force &&
        coarse &&
        iw === lastViewport.current.w &&
        Math.abs(ih - lastViewport.current.h) < 150
      )
        return
      lastViewport.current = { w: iw, h: ih }
      setIsTouch(coarse)
      const sumInv = aspectsRef.current.reduce(
        (s, a) => s + 1 / (a || FALLBACK_ASPECT),
        0,
      )
      const gaps = (total - 1) * GAP
      // Base (max) rail width: a fixed reference scale on iPad, fluid on desktop.
      const base = coarse
        ? 44 // fixed iPad reference scale
        : Math.min(72, Math.max(44, 0.032 * iw)) // clamp(44,3.2vw,72)
      // Safe vertical band: 84px clear at top (≥ the 5rem header) + 84px at the bottom.
      const avail = ih - 168
      const naturalH = base * sumInv + gaps
      const w =
        naturalH > avail && sumInv > 0
          ? Math.max(MIN_W, (avail - gaps) / sumInv)
          : base
      setRailW(w)
      // Vertically centre the rail (floored at 84px so it clears the header). Desktop
      // AND touch use this sticky `top`: the rail flows aligned with the portfolio top,
      // pins centred while scrolling, then ends aligned with the portfolio bottom.
      const navH = w * sumInv + gaps
      setRailTop(Math.max(84, Math.round((ih - navH) / 2)))
      // Horizontally place the rail in the right gutter (portfolio right edge → screen
      // edge). Touch ALWAYS centres it there; desktop only slides left to centre once
      // the window narrows (clamped at 0 so wide screens keep the natural near-media
      // spot). The shift is a transform, so the portfolio never moves.
      const stack = mediaStackRef.current
      const row = stack?.parentElement
      if (stack && row) {
        const flexGap = parseFloat(getComputedStyle(row).columnGap) || 0
        const gutter = iw - stack.getBoundingClientRect().right
        const centred = Math.round((gutter - w) / 2 - flexGap)
        setRailShiftX(coarse ? centred : Math.min(0, centred))
      }
    }
    compute(true)
    const raf = requestAnimationFrame(() => compute(true)) // re-measure after settle
    const onResize = () => compute(false)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [total])

  // Jump to a thumbnail's media, CENTERED in the viewport (same alignment as the
  // snaps/scrub). A native `scrollIntoView` here fights Lenis's own smooth-scroll
  // and settles a little short, so clicking a far thumbnail used to land on the
  // previous item. On touch (coarse pointer) jump INSTANTLY: smooth-scrolling
  // through the big images is what iOS WebKit blanks to black, so we skip it.
  const scrollToItem = (i: number) => {
    const el = itemRefs.current[i]
    if (!el) return
    const r = el.getBoundingClientRect()
    const target =
      r.top + window.scrollY + r.height / 2 - window.innerHeight / 2
    const coarse =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(pointer: coarse)').matches
    if (lenis) lenis.scrollTo(target, { immediate: coarse })
    else el.scrollIntoView({ behavior: coarse ? 'auto' : 'smooth', block: 'start' })
  }

  if (total === 0) return null

  return (
    <div className="flex justify-center gap-[var(--space-2xl)]">
      {/* Invisible left spacer mirroring the navigator so the media stays centred.
          Matches the rail width per device (narrower on touch). */}
      {total > 1 && (
        <div
          aria-hidden
          className="hidden w-[clamp(44px,3.2vw,72px)] shrink-0 min-[960px]:block pointer-coarse:w-[32px]"
          style={!isTouch && railW != null ? { width: `${railW}px` } : undefined}
        />
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

      {/* Thumbnail navigator. Wrapper is a full-viewport-height sticky box; on
          DESKTOP it top-aligns the rail at the header offset (unchanged look), on
          TOUCH (pointer-coarse) it centers the rail on the page. The rail is capped
          to the viewport height and its thumbnails shrink to fit, so even the
          biggest project (21 slides) stays fully visible on smaller screens —
          adaptive, not edge-to-edge. */}
      {total > 1 && (
        <div
          className="sticky top-[120px] hidden shrink-0 flex-col justify-start self-start min-[960px]:flex pointer-coarse:w-[32px]"
          style={railTop != null ? { top: `${railTop}px` } : undefined}
        >
        <nav
          ref={railRef}
          aria-label="Project media"
          onPointerDown={onRailPointerDown}
          onPointerMove={onRailPointerMove}
          onPointerUp={endRailGesture}
          onPointerCancel={endRailGesture}
          onClickCapture={onRailClickCapture}
          onDragStart={(e) => e.preventDefault()}
          style={{
            width: railW != null ? `${railW}px` : undefined,
            transform: railShiftX ? `translateX(${railShiftX}px)` : undefined,
          }}
          className="relative flex w-[clamp(44px,3.2vw,72px)] shrink-0 cursor-grab touch-pan-y select-none flex-col gap-[3px] active:cursor-grabbing pointer-coarse:w-[44px] [&_img]:pointer-events-none [&_img]:select-none"
        >
          {/* Position-indicator line — DESKTOP only. It's the "rail bar that gives
              position"; on touch we navigate by tapping slides, so it's removed. */}
          <span
            aria-hidden
            style={{ top: `${progress * 100}%` }}
            className="pointer-events-none absolute -left-[5px] -right-[5px] z-10 h-[3px] -translate-y-1/2 rounded-full bg-white/75 pointer-coarse:hidden"
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
                style={{ aspectRatio: String(item.aspect) }}
                className="group relative block w-full overflow-hidden rounded-[3px]"
              >
                <span
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'
                  }`}
                >
                  {item.thumbSource ? (
                    <Image
                      loader={sanityImageLoader}
                      src={urlFor(item.thumbSource).width(220).quality(70).url()}
                      alt=""
                      fill
                      draggable={false}
                      sizes="(pointer: coarse) 44px, 72px"
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
        </div>
      )}
    </div>
  )
}

