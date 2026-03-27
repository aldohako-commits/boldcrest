'use client'

import { motion } from 'framer-motion'
import { CTAButton } from '@/components/MagneticButton'

interface ServiceHeroProps {
  label: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref?: string
}

export default function ServiceHero({
  label,
  title,
  subtitle,
  ctaLabel,
  ctaHref = '/start-a-new-project',
}: ServiceHeroProps) {
  return (
    <section className="relative px-[var(--gutter)] pt-40 pb-[var(--space-xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        <motion.p
          className="mb-6 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {label}
        </motion.p>

        <motion.h1
          className="max-w-[900px] font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="mt-8 max-w-[560px] text-[1.05rem] leading-[1.7] text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <CTAButton href={ctaHref} label={ctaLabel} showArrow />
        </motion.div>
      </div>
    </section>
  )
}
