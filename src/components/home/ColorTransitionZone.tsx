'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/** Parse any CSS color string (hex, rgb, rgba) to [r,g,b] */
function parseColor(color: string): [number, number, number] {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (m) return [+m[1], +m[2], +m[3]]
  // hex
  const hex = color.replace('#', '')
  if (hex.length === 6) {
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
  }
  return [10, 10, 10]
}

function luminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

/**
 * Wraps children in a scroll-driven background color transition zone.
 * The page bg transitions: dark → light → dark as this zone scrolls through viewport.
 * Also sets --zone-fg and alpha-variant CSS vars so child text inverts with the bg.
 */
export default function ColorTransitionZone({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const lastColor = useRef('')

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.05'],
  })

  // The page bg transitions dark → light → dark as this zone scrolls through.
  // On MOBILE the portfolio sits just above the zone and shares this global bg,
  // so the bg is held DARK for the first stretch (while the portfolio scrolls
  // off the top) and then snaps to light quickly — this keeps the portfolio's
  // white text readable and still avoids the slow 50/50 mid-grey state, without
  // boxing the portfolio in its own background. Desktop is unchanged (its taller
  // sections mean the portfolio is already gone before the bg lightens).
  // Covers mobile + iPad (where the portfolio shares this scroll); true desktop
  // (>1024px) keeps its original transition.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const D = '#0a0a0a'
  const L = '#EDEDED'
  // Mobile: hold DARK through the portfolio, then the dark→light flip starts a
  // bit further down (0.22) — landing around the middle of the clients logos —
  // and is 0.03 wide so it runs at the SAME speed as the light→dark flip
  // (0.95→0.98, also 0.03). Desktop unchanged.
  const stops = isMobile ? [0, 0.29, 0.32, 0.95, 0.98] : [0, 0.035, 0.92, 0.96]
  const bgRange = isMobile ? [D, D, L, L, D] : [D, L, L, D]
  const fgRange = isMobile ? [L, L, D, D, L] : [L, D, D, L]

  const bgColor = useTransform(scrollYProgress, stops, bgRange)
  const fgColor = useTransform(scrollYProgress, stops, fgRange)

  const applyColor = useCallback((color: string) => {
    if (color === lastColor.current) return
    lastColor.current = color
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const wrapper = document.querySelector('.bg-bg') as HTMLElement
      if (wrapper) wrapper.style.backgroundColor = color

      const zone = ref.current
      if (!zone) return
      const fg = fgColor.get()
      const [r, g, b] = parseColor(fg)
      const lum = luminance(r, g, b)
      // If fg luminance > 128, it's a light foreground (on dark bg)
      const isLight = lum > 128

      zone.style.setProperty('--zone-fg', fg)
      zone.style.setProperty('--zone-fg-half', `rgba(${r},${g},${b},0.5)`)
      zone.style.setProperty('--zone-fg-muted', `rgba(${r},${g},${b},0.45)`)
      zone.style.setProperty('--zone-fg-faint', `rgba(${r},${g},${b},0.15)`)
      zone.style.setProperty('--zone-fg-subtle', `rgba(${r},${g},${b},0.1)`)
      zone.style.setProperty('--zone-border', `rgba(${r},${g},${b},${isLight ? 0.15 : 0.1})`)
      zone.style.setProperty('--zone-logo-filter', isLight ? 'brightness(0) invert(1)' : 'brightness(0)')
      zone.style.setProperty('--zone-bg', color)
    })
  }, [fgColor])

  useMotionValueEvent(bgColor, 'change', applyColor)

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      const wrapper = document.querySelector('.bg-bg') as HTMLElement
      if (wrapper) wrapper.style.backgroundColor = ''
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        '--zone-fg': '#EDEDED',
        '--zone-fg-half': 'rgba(237,237,237,0.5)',
        '--zone-fg-muted': 'rgba(237,237,237,0.45)',
        '--zone-fg-faint': 'rgba(237,237,237,0.15)',
        '--zone-fg-subtle': 'rgba(237,237,237,0.1)',
        '--zone-border': 'rgba(237,237,237,0.15)',
        '--zone-logo-filter': 'brightness(0) invert(1)',
        '--zone-bg': '#0a0a0a',
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
