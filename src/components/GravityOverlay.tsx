'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Gravity, MatterBody, type GravityRef } from '@/components/ui/gravity'

const gravityTags = [
  { label: 'Branding', x: '8%', y: '2%', angle: -5 },
  { label: 'Strategy', x: '25%', y: '8%', angle: 8 },
  { label: 'Motion', x: '50%', y: '3%', angle: -3 },
  { label: 'Photography', x: '72%', y: '6%', angle: 12 },
  { label: 'Identity', x: '18%', y: '15%', angle: -8 },
  { label: 'Digital', x: '42%', y: '12%', angle: 5 },
  { label: 'Advertising', x: '62%', y: '10%', angle: -10 },
  { label: 'Social Media', x: '85%', y: '5%', angle: 6 },
  { label: 'Packaging', x: '12%', y: '20%', angle: -12 },
  { label: 'Videography', x: '55%', y: '18%', angle: 3 },
]

export default function GravityOverlay() {
  const gravityRef = useRef<GravityRef>(null)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    lastScrollY.current = window.scrollY

    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true

      requestAnimationFrame(() => {
        const currentY = window.scrollY
        const delta = currentY - lastScrollY.current
        lastScrollY.current = currentY

        if (gravityRef.current && Math.abs(delta) > 2) {
          // Apply force proportional to scroll speed
          // Positive delta = scrolling down = push tags down/sideways
          const forceMagnitude = Math.min(Math.abs(delta) * 0.00015, 0.05)
          const direction = delta > 0 ? 1 : -1

          gravityRef.current.applyForceToAll({
            x: direction * forceMagnitude * 0.3, // slight horizontal scatter
            y: direction * forceMagnitude,
          })
        }

        ticking.current = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  if (!mounted) return null

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[2]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <Gravity
        ref={gravityRef}
        gravity={{ x: 0, y: 0.4 }}
        grabCursor={false}
        addTopWall={false}
        resetOnResize={true}
        className="w-full h-full"
      >
        {gravityTags.map((tag) => (
          <MatterBody
            key={tag.label}
            matterBodyOptions={{
              friction: 0.3,
              restitution: 0.4,
              density: 0.0008,
              frictionAir: 0.01,
            }}
            x={tag.x}
            y={tag.y}
            angle={tag.angle}
          >
            <div className="select-none rounded-full border border-border bg-bg-card/80 px-5 py-2.5 font-display text-[clamp(0.7rem,1.1vw,0.9rem)] font-medium tracking-wide text-text-secondary backdrop-blur-sm">
              {tag.label}
            </div>
          </MatterBody>
        ))}
      </Gravity>
    </motion.div>
  )
}
