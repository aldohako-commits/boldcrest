'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion'

/**
 * Wraps children in a scroll-driven background color transition zone.
 * The page bg transitions: dark → light → dark as this zone scrolls through viewport.
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

  const applyColor = useCallback((color: string) => {
    if (color === lastColor.current) return
    lastColor.current = color
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const wrapper = document.querySelector('.bg-bg') as HTMLElement
      if (wrapper) wrapper.style.backgroundColor = color
    })
  }, [])

  useMotionValueEvent(bgColor, 'change', applyColor)

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      const wrapper = document.querySelector('.bg-bg') as HTMLElement
      if (wrapper) wrapper.style.backgroundColor = ''
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
