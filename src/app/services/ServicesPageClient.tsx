'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import MagneticBase, { CTAButton } from '@/components/MagneticButton'

interface Service {
  _id: string
  name: string
  slug: { current: string }
  category: string
  order: number
}

interface CategoryGroup {
  category: string
  services: Service[]
}

interface ServicesPageClientProps {
  categories: CategoryGroup[]
}

const capabilities = [
  {
    category: 'Brand Dev',
    number: '01',
    color: '#DA291C',
    heading: 'Branding',
    abbr: 'BRND DEV',
    tags: [
      'Visual Identity',
      'Packaging Design',
      'Creative Advertising',
      'Brand Strategy',
      'Logo Design',
      'Brand Guidelines',
    ],
    description:
      "From brand architecture to visual identity, we create systems that clarify who you are and amplify how you're seen.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4L4 14v12l16 10 16-10V14L20 4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 14v12M12 19l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    category: 'Still & Motion',
    number: '02',
    color: '#f9b311',
    heading: 'Still & Motion',
    abbr: 'STL & MTN',
    tags: [
      'Photography',
      'Videography',
      'Animation',
      'Motion Graphics',
      'Post-Production',
      'Color Grading',
    ],
    description:
      'Still frames that hold attention. Moving images that move people. Every shoot, every cut, every grade — deliberate.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="10" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    category: 'Communications',
    number: '03',
    color: '#004c95',
    heading: 'Comms',
    abbr: 'COMMS',
    tags: [
      'Social Media',
      'Digital Marketing',
      'Public Relations',
      'Content Strategy',
      'Campaign Management',
      'Media Planning',
    ],
    description:
      "A great brand in silence is a waste. We put yours where it belongs — in front of the right people, saying the right thing.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M8 10h24v16H22l-6 4v-4H8V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="16" cy="18" r="1.5" fill="currentColor" />
        <circle cx="20" cy="18" r="1.5" fill="currentColor" />
        <circle cx="24" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
]

const marqueeItems = [
  'branding',
  'still & motion',
  'communications',
  'branding',
  'still & motion',
  'communications',
  'branding',
  'still & motion',
  'communications',
  'branding',
  'still & motion',
  'communications',
]

const testimonials = [
  {
    quote:
      'BoldCrest completely transformed how we present ourselves to the world. The rebrand exceeded every expectation we had.',
    name: 'Sarah Mitchell',
    company: 'Apex Ventures',
    avatar: 'SM',
  },
  {
    quote:
      'Working with BoldCrest felt like having an in-house team that truly understood our vision. The results speak for themselves.',
    name: 'James Rodriguez',
    company: 'Meridian Group',
    avatar: 'JR',
  },
  {
    quote:
      'The campaign they built drove a 200% increase in engagement within the first quarter. Incredible attention to detail.',
    name: 'Priya Sharma',
    company: 'NovaTech',
    avatar: 'PS',
  },
  {
    quote:
      'From photography to brand identity, they handled everything with precision. Our brand has never looked stronger.',
    name: 'David Kim',
    company: 'Forge Studio',
    avatar: 'DK',
  },
  {
    quote:
      'They don\'t just deliver projects — they deliver results. BoldCrest is the partner every ambitious brand needs.',
    name: 'Amara Osei',
    company: 'Luminary Co.',
    avatar: 'AO',
  },
]

/* ── Gallery placeholder images ── */
const galleryImages = [
  { width: 330, color: '#DA291C' },
  { width: 500, color: '#f9b311' },
  { width: 350, color: '#004c95' },
  { width: 420, color: '#DA291C' },
  { width: 460, color: '#f9b311' },
  { width: 380, color: '#004c95' },
  { width: 440, color: '#DA291C' },
  { width: 360, color: '#f9b311' },
]

/* ── Word-by-word reveal ── */
function WordReveal({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.4'],
  })

  const words = text.split(' ')

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <WordItem
            key={i}
            word={word}
            range={[start, end]}
            progress={scrollYProgress}
          />
        )
      })}
    </span>
  )
}

function WordItem({
  word,
  range,
  progress,
}: {
  word: string
  range: [number, number]
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const opacity = useTransform(progress, range, [0.15, 1])
  const y = useTransform(progress, range, [4, 0])

  return (
    <motion.span
      style={{ opacity, y }}
      className="mr-[0.3em] inline-block"
    >
      {word}
    </motion.span>
  )
}

/* ── Horizontal scroll capabilities ── */
function HorizontalCapabilities({
  categories,
}: {
  categories: CategoryGroup[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%'])

  return (
    <section ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Label */}
        <div className="flex items-center px-[var(--gutter)] pt-8 pb-6">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
            Our capabilities
          </p>
        </div>

        {/* Top separator line */}
        <div className="mx-[var(--gutter)] h-px bg-border" />

        {/* Horizontal panels */}
        <motion.div
          className="flex h-[calc(100vh-82px)]"
          style={{ x }}
        >
          {capabilities.map((cap) => {
            const sanityServices =
              categories.find((c) => c.category === cap.category)
                ?.services || []
            const tags =
              sanityServices.length > 0
                ? sanityServices.map((s) => s.name)
                : cap.tags

            return (
              <div
                key={cap.category}
                className="relative flex h-full shrink-0 flex-col justify-between"
                style={{
                  width: '33.333vw',
                  minWidth: '400px',
                  borderRight: `1px solid ${cap.color}15`,
                }}
              >
                {/* Panel — dark background matching page */}
                <div className="flex h-full flex-col justify-between bg-[var(--bg-primary)] px-6 py-8 lg:px-10 lg:py-10">
                  {/* Top: heading + tags */}
                  <div>
                    <h2 className="mb-6 font-display text-[clamp(2.5rem,5vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
                      {cap.heading}
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/work?service=${encodeURIComponent(tag)}`}
                          className="rounded-full border px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.05em] transition-all duration-200"
                          style={{
                            borderColor: `${cap.color}30`,
                            color: 'rgba(255,255,255,0.65)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = cap.color
                            e.currentTarget.style.backgroundColor = `${cap.color}18`
                            e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = `${cap.color}30`
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                          }}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: icon + abbreviation + description */}
                  <div className="flex items-end gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-2xl border"
                        style={{
                          borderColor: `${cap.color}25`,
                          color: `${cap.color}90`,
                        }}
                      >
                        {cap.icon}
                      </div>
                      <span
                        className="text-[0.55rem] font-semibold uppercase tracking-[0.1em]"
                        style={{ color: `${cap.color}60` }}
                      >
                        {cap.abbr}
                      </span>
                    </div>
                    <p className="max-w-[280px] text-[0.8rem] uppercase leading-[1.5] tracking-[0.02em] text-white/40">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* CTA Panel — accent color */}
          <div
            className="relative flex h-full shrink-0 flex-col justify-between px-10 py-10 lg:px-16"
            style={{
              width: '33.333vw',
              minWidth: '400px',
              backgroundColor: '#DA291C',
            }}
          >
            <div>
              <h2 className="mb-8 font-display text-[clamp(2.5rem,5vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
                Start a<br />Project
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <p className="max-w-[320px] text-[0.85rem] leading-[1.7] text-white/80">
                We live in the details. The pixels, the strategy, the
                timing. If you&apos;re building something real, we&apos;ll
                meet you there.
              </p>
              <MagneticBase
                href="/start-a-new-project"
                className="inline-flex w-fit items-center gap-3 rounded-[var(--radius-pill)] border border-white/30 px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-[0.5s] hover:border-white/60"
                style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
              >
                <span className="relative z-10 inline-flex items-center gap-3">
                  Let&apos;s Chat
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </MagneticBase>
            </div>
          </div>
        </motion.div>

        {/* Bottom separator line */}
        <div className="mx-[var(--gutter)] h-px bg-border" />
      </div>
    </section>
  )
}

/* ── Sliding gallery ── */
function SlidingGallery() {
  return (
    <section className="py-[var(--space-3xl)]">
      <div className="px-[var(--gutter)] pb-[var(--space-xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <p className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
            Our People
          </p>
          <h2 className="max-w-[600px] font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-light leading-[1.1] tracking-[-0.02em] text-text-primary">
            We brand, film, strategize, and have fun doing it.
          </h2>
        </div>
      </div>

      {/* Infinite sliding gallery */}
      <div className="relative overflow-hidden">
        <div className="flex animate-[marquee_40s_linear_infinite] gap-3">
          {[...galleryImages, ...galleryImages].map((img, i) => (
            <div
              key={i}
              className="relative shrink-0 overflow-hidden rounded-xl"
              style={{
                width: `${img.width}px`,
                height: '420px',
              }}
            >
              {/* Placeholder — gradient block with subtle pattern */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${img.color}15 0%, ${img.color}08 100%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white/8"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <circle
                    cx="8.5"
                    cy="8.5"
                    r="1.5"
                    fill="currentColor"
                  />
                  <path
                    d="M3 16l5-5 4 4 3-3 6 6"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div
                className="absolute right-0 bottom-0 left-0 h-[1px] opacity-20"
                style={{ backgroundColor: img.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Testimonials ── */
function Testimonials() {
  const [current, setCurrent] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  // Auto-advance every 6s
  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="border-t border-border px-[var(--gutter)] py-[var(--space-3xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        {/* Header row */}
        <div className="mb-[var(--space-xl)] flex items-center justify-between">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
            (Some) clients love us
          </p>
          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-text-secondary transition-all duration-[0.5s] hover:border-white/60 hover:text-white"
            style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
            aria-label="Next testimonial"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Testimonial cards */}
        <div className="relative overflow-hidden" ref={trackRef}>
          <motion.div
            className="flex"
            animate={{ x: `${-current * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="flex w-full shrink-0 flex-col justify-between pr-12"
                style={{ minHeight: '340px' }}
              >
                {/* Quote */}
                <p className="max-w-[900px] font-display text-[clamp(1.6rem,3.5vw,3.2rem)] font-light leading-[1.15] tracking-[-0.02em] text-text-primary">
                  {t.quote}
                </p>

                {/* Attribution */}
                <div className="mt-10 flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-[0.65rem] font-bold tracking-wider text-accent">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-[0.6rem] uppercase tracking-[0.05em] text-text-tertiary">
                      {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Progress dots */}
          <div className="mt-8 flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: current === i ? '24px' : '8px',
                  backgroundColor:
                    current === i
                      ? 'var(--accent)'
                      : 'var(--text-tertiary)',
                  opacity: current === i ? 1 : 0.3,
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   Worked On 200+ — Industries + Client Logos
═══════════════════════════════════════════ */

const INDUSTRIES = [
  'Construction',
  'Fashion',
  'Finance',
  'Food & Beverage',
  'Health & Beauty',
  'Home & Appliances',
  'HoReCa',
  'NGO',
  'Tech',
  'Services',
]

const CLIENT_LOGOS = [
  { name: 'Hako', src: '/logos/hako.svg' },
  { name: 'JokaDent', src: '/logos/jokadent.svg' },
  { name: 'AK Invest', src: '/logos/ak-invest.svg' },
  { name: 'Magniflex', src: '/logos/magniflex.svg' },
  { name: 'Palma', src: '/logos/palma.svg' },
  { name: 'Tepelene', src: '/logos/tepelene.svg' },
  { name: 'LoriCaffe', src: '/logos/loricaffe.svg' },
  { name: 'Tirana Home Store', src: '/logos/tirana-home-store.svg' },
  { name: 'Fentimans', src: '/logos/fentimans.svg' },
  { name: 'Diamond', src: '/logos/diamond.svg' },
  { name: 'Akses', src: '/logos/akses.svg' },
  { name: 'ExpertCloud', src: '/logos/expertcloud.svg' },
  { name: 'Anmetal', src: '/logos/anmetal.svg' },
  { name: 'Wienna', src: '/logos/wienna.svg' },
  { name: 'Baboon', src: '/logos/baboon.svg' },
  { name: 'Berdica', src: '/logos/berdica.svg' },
  { name: 'Perfect Fashion', src: '/logos/perfect-fashion.svg' },
  { name: 'Alisadudaj', src: '/logos/alisadudaj.svg' },
  { name: 'Matrix', src: '/logos/matrix.svg' },
  { name: 'Red Bull', src: '/logos/redbull.svg' },
]

function WorkedOn() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { margin: '-15%', once: true })
  const counterRef = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)

  // Animate counter from 0 → 200
  useEffect(() => {
    if (!isInView) return
    let frame: number
    const duration = 1800
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * 200))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      className="px-[var(--gutter)] py-[var(--space-3xl)]"
    >
      <div className="mx-auto max-w-[var(--max-width)]">
        <div className="grid gap-[var(--space-2xl)] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start">
          {/* ── Left: Stat + Industries ── */}
          <div>
            <motion.p
              className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              Worked On
            </motion.p>

            <motion.div
              className="mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                ref={counterRef}
                className="font-display text-[clamp(5rem,12vw,9rem)] font-bold leading-[0.9] text-accent"
              >
                {count}+
              </span>
            </motion.div>

            <motion.p
              className="mb-[var(--space-xl)] text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Projects for a variety of industries
            </motion.p>

            {/* Industry list */}
            <div className="flex flex-col">
              {INDUSTRIES.map((industry, i) => (
                <motion.div
                  key={industry}
                  className="group flex items-center justify-between border-t border-border/40 py-3 last:border-b"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span className="text-[0.9rem] font-medium text-text-secondary transition-colors duration-300 group-hover:text-text-primary">
                    {industry}
                  </span>
                  <svg
                    className="h-3.5 w-3.5 text-text-tertiary/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: Client Logos Grid ── */}
          <div className="grid grid-cols-3 gap-x-[var(--space-lg)] gap-y-[var(--space-xl)] sm:grid-cols-4 lg:grid-cols-5">
            {CLIENT_LOGOS.map((logo, i) => (
              <motion.div
                key={logo.name}
                className="flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 0.5, scale: 1 } : {}}
                whileHover={{ opacity: 1, scale: 1.08 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Placeholder — swap with <Image> when SVGs are added to /public/logos/ */}
                <div
                  className="flex h-16 w-full items-center justify-center"
                  title={logo.name}
                >
                  <span className="text-center font-display text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-text-secondary">
                    {logo.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function ServicesPageClient({
  categories,
}: ServicesPageClientProps) {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative px-[var(--gutter)] pt-40 pb-[var(--space-xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.p
            className="mb-6 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            what we do
          </motion.p>

          <motion.h1
            className="max-w-[900px] font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            What gets us
            <br />
            out of bed<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            className="mt-8 max-w-[520px] text-[1.05rem] leading-[1.7] text-text-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Three disciplines, one obsession. From first concept to final
            build, we handle the details.
          </motion.p>
        </div>
      </section>

      {/* ── Marquee strip ── */}
      <div className="relative overflow-hidden border-y border-border py-5">
        <div className="flex animate-[marquee_25s_linear_infinite]">
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-4 pr-4"
            >
              <span className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
                {item}
              </span>
              <span className="text-[0.5rem] text-text-tertiary/50">
                ·
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Statement with word-by-word reveal ── */}
      <section className="px-[var(--gutter)] py-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <h2 className="max-w-[800px] font-display text-[clamp(1.8rem,4vw,3.5rem)] font-bold leading-[1.15] tracking-[-0.02em]">
            <WordReveal text="We design brands, craft stories, and build campaigns that don't just inform — they pull people in." />
          </h2>
        </div>
      </section>

      {/* ── Horizontal Scroll Capabilities ── */}
      <HorizontalCapabilities categories={categories} />

      {/* ── Worked On 200+ ── */}
      <WorkedOn />

      {/* ── Testimonials ── */}
      <Testimonials />
    </main>
  )
}
