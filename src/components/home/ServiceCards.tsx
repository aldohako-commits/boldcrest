'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

interface ServiceCard {
  title: string
  color: string
  services: string[]
}

const cards: ServiceCard[] = [
  {
    title: 'Brand Development',
    color: '#DA291C',
    services: [
      'Visual Identity',
      'Packaging Design',
      'Creative Advertising',
      'Brand Strategy',
      'Logo Design',
      'Brand Guidelines',
    ],
  },
  {
    title: 'Still & Motion',
    color: '#f9b311',
    services: [
      'Photography',
      'Videography',
      'Animation',
      'Motion Graphics',
      'Post-Production',
      'Color Grading',
    ],
  },
  {
    title: 'Communications',
    color: '#004c95',
    services: [
      'Social Media',
      'Digital Marketing',
      'Public Relations',
      'Content Strategy',
      'Campaign Management',
      'Media Planning',
    ],
  },
]

/* Placeholder SVG icon — replace later */
function PlaceholderIcon({ color }: { color: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.4"
      />
      <circle cx="32" cy="32" r="8" fill={color} opacity="0.3" />
    </svg>
  )
}

function FlipCard({
  card,
  index,
}: {
  card: ServiceCard
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  })

  // Stagger each card's flip slightly
  const flipStart = index * 0.08
  const flipEnd = 0.5 + index * 0.08

  // Start at 180 (showing back) → flip to 0 (showing front)
  const rotateY = useTransform(
    scrollYProgress,
    [flipStart, flipEnd],
    [180, 0]
  )

  // Front (colored) starts hidden, becomes visible as card flips to 0
  const frontOpacity = useTransform(
    scrollYProgress,
    [flipStart, (flipStart + flipEnd) / 2, flipEnd],
    [0, 0, 1]
  )

  // Back (service list) starts visible, hides as card flips
  const backOpacity = useTransform(
    scrollYProgress,
    [flipStart, (flipStart + flipEnd) / 2, flipEnd],
    [1, 1, 0]
  )

  return (
    <div ref={cardRef} className="h-[420px] md:h-[480px]" style={{ perspective: 1200 }}>
      <motion.div
        className="relative h-full w-full"
        style={{
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Face — Colored with title + icon (visible after flip) */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-8 rounded-[var(--radius-lg)] p-8"
          style={{
            backgroundColor: card.color,
            backfaceVisibility: 'hidden',
            opacity: frontOpacity,
          }}
        >
          <PlaceholderIcon color="rgba(255,255,255,0.9)" />
          <h3 className="text-center font-display text-[clamp(1.6rem,2.5vw,2.2rem)] font-bold leading-tight text-white">
            {card.title}
          </h3>
          <div className="mt-2 h-[3px] w-12 rounded-full bg-white/30" />
        </motion.div>

        {/* Back Face — Service list with line separators (visible initially) */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-between rounded-[var(--radius-lg)] border border-border bg-bg-card p-8"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            opacity: backOpacity,
          }}
        >
          <div>
            <span
              className="mb-6 inline-block rounded-[var(--radius-pill)] px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-white"
              style={{ backgroundColor: card.color }}
            >
              {card.title}
            </span>

            <div className="mt-6 flex flex-col">
              {card.services.map((service, i) => (
                <div
                  key={service}
                  className={`flex items-center py-3.5 text-[0.95rem] text-text-secondary transition-colors duration-200 hover:text-white ${
                    i < card.services.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  {service}
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-6 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-[0.4s] hover:scale-110"
            style={{ borderColor: card.color }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke={card.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function ServiceCards() {
  return (
    <section className="px-[var(--gutter)] py-[var(--space-2xl)]">
      <ScrollReveal>
        <div className="mb-[var(--space-xl)]">
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
            What We Do
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card, i) => (
          <FlipCard key={card.title} card={card} index={i} />
        ))}
      </div>
    </section>
  )
}
