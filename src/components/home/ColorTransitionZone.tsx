'use client'

import { useRef, useEffect, useCallback } from 'react'
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
    offset: ['start 0.8', 'end 0.3'],
  })

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.05, 0.85, 0.95],
    ['#0a0a0a', '#EDEDED', '#EDEDED', '#0a0a0a']
  )

  const fgColor = useTransform(
    scrollYProgress,
    [0, 0.05, 0.85, 0.95],
    ['#EDEDED', '#0a0a0a', '#0a0a0a', '#EDEDED']
  )

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
