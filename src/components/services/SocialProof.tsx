'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SocialProofProps {
  heading: string
  brands: string[]
}

export default function SocialProof({ heading, brands }: SocialProofProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const repeated = [...brands, ...brands, ...brands, ...brands]

  return (
    <section ref={ref} className="overflow-hidden border-y border-border py-[var(--space-xl)]">
      <div className="px-[var(--gutter)]">
        <motion.h2
          className="mb-8 text-center font-display text-[clamp(1.2rem,2.5vw,1.8rem)] font-bold leading-[1.1] tracking-[-0.02em]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {heading}
        </motion.h2>
      </div>

      <div className="flex animate-[marquee_30s_linear_infinite]">
        {repeated.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="shrink-0 px-6 py-2 font-display text-[clamp(0.8rem,1.5vw,1rem)] font-semibold uppercase tracking-[0.1em] text-text-tertiary/50"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  )
}
