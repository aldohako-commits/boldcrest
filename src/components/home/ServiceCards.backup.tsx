'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

interface ServiceCardData {
  title: string
  color: string
  services: string[]
}

const cards: ServiceCardData[] = [
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

/* Placeholder SVG — replace later */
function PlaceholderIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="8" width="14" height="14" rx="2" fill="currentColor" />
      <rect x="26" y="8" width="14" height="14" rx="2" fill="currentColor" opacity="0.5" />
      <rect x="8" y="26" width="14" height="14" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="26" y="26" width="14" height="14" rx="2" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

function Card({
  card,
  index,
  scrollYProgress,
}: {
  card: ServiceCardData
  index: number
  scrollYProgress: MotionValue<number>
}) {
  // Phase 1 (0–0.35): Fan → straighten
  // Phase 2 (0.35–0.8): Flip to back, staggered per card
  const fanRotations = [-12, 0, 12]
  const fanOffsets = [-60, 0, 60] // horizontal pixel offset when fanned
  const spreadPositions = [-110, 0, 110] // % offset when spread into row

  // Fan rotation → 0
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.3],
    [fanRotations[index], 0]
  )

  // Fan horizontal offset → spread into columns
  const x = useTransform(
    scrollYProgress,
    [0, 0.3],
    [`${fanOffsets[index]}px`, `${spreadPositions[index]}%`]
  )

  // Flip (staggered per card index)
  const flipStart = 0.35 + index * 0.08
  const flipEnd = 0.6 + index * 0.08

  const rotateY = useTransform(
    scrollYProgress,
    [flipStart, flipEnd],
    [0, 180]
  )

  // Opacity crossfade at the 90° mark
  const midFlip = (flipStart + flipEnd) / 2

  const frontOpacity = useTransform(
    scrollYProgress,
    [flipStart, midFlip - 0.01, midFlip, flipEnd],
    [1, 1, 0, 0]
  )

  const backOpacity = useTransform(
    scrollYProgress,
    [flipStart, midFlip, midFlip + 0.01, flipEnd],
    [0, 0, 1, 1]
  )

  // Scale: start slightly smaller when fanned, grow to full
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1])

  // Z-index: left card on top when fanned
  const zIndex = 3 - index

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-[380px] w-[280px] md:h-[440px] md:w-[320px]"
      style={{
        x,
        rotate,
        scale,
        marginLeft: '-140px',
        marginTop: '-220px',
        zIndex,
        perspective: 1200,
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Face — Colored */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl p-6"
          style={{
            backgroundColor: card.color,
            backfaceVisibility: 'hidden',
            opacity: frontOpacity,
          }}
        >
          <div className="flex items-start justify-between">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/80">
              {card.title}
            </span>
            <span className="text-white/60">
              <PlaceholderIcon />
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 py-8">
            <div className="text-white/90">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="12" y="12" width="24" height="24" rx="3" fill="currentColor" />
                <rect x="44" y="12" width="24" height="24" rx="3" fill="currentColor" opacity="0.6" />
                <rect x="12" y="44" width="24" height="24" rx="3" fill="currentColor" opacity="0.4" />
                <rect x="44" y="44" width="24" height="24" rx="3" fill="currentColor" opacity="0.8" />
              </svg>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <span className="text-[0.6rem] uppercase tracking-wider text-white/50">
              0{index + 1}
            </span>
            <span className="text-[0.6rem] uppercase tracking-wider text-white/50">
              {card.title.split(' ').pop()}
            </span>
          </div>
        </motion.div>

        {/* Back Face — Service list */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161616] p-6"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            opacity: backOpacity,
          }}
        >
          <div>
            <div className="mb-6 flex items-start justify-between">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/60">
                {card.title}
              </span>
              <span className="text-white/30">
                <PlaceholderIcon />
              </span>
            </div>

            <div className="flex flex-col">
              {card.services.map((service, i) => (
                <div
                  key={service}
                  className={`py-3 text-[0.85rem] text-white/70 ${
                    i < card.services.length - 1
                      ? 'border-b border-white/[0.06]'
                      : ''
                  }`}
                >
                  {service}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <span className="text-white/20">
              <PlaceholderIcon />
            </span>
            <span className="rotate-180 text-[0.6rem] uppercase tracking-wider text-white/30">
              {card.title}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function ServiceCards() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      {/* Sticky inner — stays pinned while we scroll through 300vh */}
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-[var(--gutter)] pt-[var(--space-lg)]">
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
            What We Do
          </h2>
        </div>

        {/* Cards area */}
        <div className="relative flex-1">
          {cards.map((card, i) => (
            <Card
              key={card.title}
              card={card}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
