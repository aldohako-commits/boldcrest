'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DURATION = 2500 // ms
const HOLD_DELAY = 300 // ms after reaching 100 before exit

// Ease-out cubic: fast start, slow finish
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [count, setCount] = useState(0)
  const [progress, setProgress] = useState(0) // 0–1
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  const tick = useCallback((timestamp: number) => {
    if (startRef.current === null) startRef.current = timestamp
    const elapsed = timestamp - startRef.current
    const rawProgress = Math.min(elapsed / DURATION, 1)
    const easedProgress = easeOutCubic(rawProgress)

    setCount(Math.round(easedProgress * 100))
    setProgress(easedProgress)

    if (rawProgress < 1) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      // Hold briefly, then exit
      setTimeout(() => {
        setVisible(false)
        sessionStorage.setItem('boldcrest-loaded', '1')
      }, HOLD_DELAY)
    }
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem('boldcrest-loaded')) {
      setVisible(false)
      return
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [tick])

  // "unseen" fades out starting at 40% progress, fully gone by 85%
  const unseenOpacity = progress < 0.4 ? 1 : Math.max(0, 1 - (progress - 0.4) / 0.45)
  const unseenBlur = progress < 0.4 ? 0 : ((progress - 0.4) / 0.45) * 12
  const unseenScale = progress < 0.4 ? 1 : Math.max(0.3, 1 - (progress - 0.4) / 0.45 * 0.7)

  // "bold" transforms: weight increases, scale grows, gets accent glow
  const boldWeight = Math.round(400 + progress * 500) // 400 → 900
  const boldScale = 1 + progress * 0.15 // 1 → 1.15
  const boldGlow = progress > 0.3 ? (progress - 0.3) / 0.7 : 0 // 0 → 1 after 30%

  // Counter display: zero-padded
  const counterDisplay = count.toString().padStart(2, '0')

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex bg-bg"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left: Counter */}
          <div className="flex flex-1 items-center justify-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(5rem,15vw,12rem)] font-bold leading-none tracking-tighter text-text-primary"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {counterDisplay}
            </motion.span>
          </div>

          {/* Right: Tagline */}
          <div className="flex flex-1 items-center justify-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(1.5rem,4vw,3.5rem)] font-light leading-[1.2] tracking-tight text-text-primary"
            >
              <div>
                <span>Go </span>
                <span
                  className="inline-block transition-colors duration-300"
                  style={{
                    fontWeight: boldWeight,
                    transform: `scale(${boldScale})`,
                    transformOrigin: 'left center',
                    display: 'inline-block',
                    textShadow: boldGlow > 0
                      ? `0 0 ${boldGlow * 30}px rgba(230, 50, 40, ${boldGlow * 0.6}), 0 0 ${boldGlow * 60}px rgba(230, 50, 40, ${boldGlow * 0.3})`
                      : 'none',
                    color: boldGlow > 0.5 ? '#ffffff' : undefined,
                  }}
                >
                  {progress > 0.7 ? 'BOLD' : 'bold'}
                </span>
              </div>
              <div>
                <span>or go </span>
                <span
                  className="inline-block"
                  style={{
                    opacity: unseenOpacity,
                    filter: `blur(${unseenBlur}px)`,
                    transform: `scaleY(${unseenScale})`,
                    transformOrigin: 'center bottom',
                  }}
                >
                  unseen
                </span>
                <span>.</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
