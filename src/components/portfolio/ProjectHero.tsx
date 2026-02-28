'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProjectHeroProps {
  name: string
  tagline?: string
}

export default function ProjectHero({ name, tagline }: ProjectHeroProps) {
  return (
    <section className="px-[var(--gutter)] pt-40 pb-[var(--space-xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        {/* Breadcrumb */}
        <motion.nav
          className="mb-[var(--space-md)] flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.15em] text-text-tertiary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/work"
            className="transition-colors duration-200 hover:text-white"
          >
            Work
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{name}</span>
        </motion.nav>

        {/* Title */}
        <motion.h1
          className="max-w-[900px] font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.1]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {name}
          <span className="text-accent">.</span>
        </motion.h1>

        {/* Tagline */}
        {tagline && (
          <motion.p
            className="mt-[var(--space-md)] max-w-[600px] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.7] text-text-secondary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {tagline}
          </motion.p>
        )}
      </div>
    </section>
  )
}
