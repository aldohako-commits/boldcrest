'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import { CTAButton } from '@/components/MagneticButton'
import FAQSection from '@/components/services/FAQSection'

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

interface FAQItem {
  question: string
  answer: string
}

interface ServicesPageClientProps {
  categories: CategoryGroup[]
  faqItems?: FAQItem[]
}

const capabilities = [
  {
    category: 'Brand Dev',
    number: '01',
    color: '#DA291C',
    heading: 'Brand\nDevelopment',
    abbr: 'BRND DEV',
    href: '/services/brand-development',
    ctaLabel: 'Explore',
    tags: [
      'Visual Identity',
      'Packaging Design',
      'Creative Advertising',
      'Brand Strategy',
      'Logo Design',
      'Brand Guidelines',
    ],
    description:
      "From brand architecture to visual identity, we create systems that clarify who you are and amplify how you're seen. Whether it's a startup's first logo or a national brand's complete identity overhaul.",
  },
  {
    category: 'Still & Motion',
    number: '02',
    color: '#f9b311',
    heading: 'Still &\nMotion',
    abbr: 'STL & MTN',
    href: '/services/still-motion',
    ctaLabel: 'Explore',
    tags: [
      'Photography',
      'Videography',
      'Animation',
      'Motion Graphics',
      'Post-Production',
      'Color Grading',
    ],
    description:
      'Still frames that hold attention. Moving images that move people. Every shoot, every cut, every grade, deliberate. We handle the full production cycle, all in-house.',
  },
  {
    category: 'Communications',
    number: '03',
    color: '#004c95',
    heading: 'Communication',
    abbr: 'COMMS',
    href: '/services/communication',
    ctaLabel: 'Explore',
    tags: [
      'Social Media',
      'Digital Marketing',
      'Public Relations',
      'Content Strategy',
      'Campaign Management',
      'Media Planning',
    ],
    description:
      "A great brand in silence is a waste. We put yours where it belongs, in front of the right people, saying the right thing, at the right moment.",
  },
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

/* ── Expandable Service Cards ── */
function ServiceShowcase({ categories }: { categories: CategoryGroup[] }) {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section
      ref={ref}
      className="px-[var(--gutter)] pt-20 pb-[120px]"
    >
      <div>
      {/* Section header */}
      <motion.p
        className="mb-10 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        Disciplines
      </motion.p>

      {/* Cards */}
      <motion.div
        className="flex h-[480px] gap-4 md:h-[540px]"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {capabilities.map((cap, i) => {
          const isActive = active === i
          const sanityServices =
            categories.find((c) => c.category === cap.category)?.services || []
          const tags =
            sanityServices.length > 0
              ? sanityServices.map((s) => s.name)
              : cap.tags

          return (
            <motion.div
              key={cap.category}
              className="relative cursor-pointer rounded-xl"
              style={{
                background: '#0a0a0a',
              }}
              animate={{
                flex: isActive ? 5 : 0.8,
                borderColor: isActive ? cap.color : 'rgba(163,163,163,0.3)',
                borderWidth: 1,
                borderStyle: 'solid',
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActive(i)}
            >
              {/* Collapsed state — vertical label */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-between py-8"
                animate={{ opacity: isActive ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                style={{ pointerEvents: isActive ? 'none' : 'auto' }}
              >
                <span className="sr-only">{cap.number}</span>
                <span
                  className="font-display text-[0.8rem] font-bold uppercase tracking-[0.18em] text-white/90"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {cap.category}
                </span>
                <span
                  className="text-[1.1rem] font-light"
                  style={{ color: 'rgba(163,163,163,0.5)' }}
                >
                  +
                </span>
              </motion.div>

              {/* Expanded state — full content */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-between p-8 md:p-10"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.4, delay: isActive ? 0.2 : 0 }}
                style={{ pointerEvents: isActive ? 'auto' : 'none' }}
              >
                {/* Top row: title left, tags right */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <h3 className="font-display text-[clamp(1.6rem,2.5vw,2.2rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
                    {cap.heading.replace('\n', ' ')}
                  </h3>
                  <div className="flex flex-wrap gap-2 md:max-w-[55%] md:justify-end">
                    {tags.slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.06em]"
                        style={{ borderColor: `${cap.color}50`, color: 'rgba(255,255,255,0.55)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom: description + CTA */}
                <div>
                  <p className="mb-6 max-w-[500px] text-[0.85rem] leading-[1.7] text-text-secondary">
                    {cap.description}
                  </p>
                  <Link
                    href={cap.href}
                    className="group inline-flex w-fit items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-70"
                    style={{ color: cap.color }}
                  >
                    <span>{cap.ctaLabel}</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
      </div>
    </section>
  )
}

/* ── Stats + Testimonial (combined section per Option 2) ── */
const INDUSTRY_TAGS = ['Tech', 'F&B', 'Finance', 'Real Estate', 'Hospitality', 'Healthcare', 'Retail', 'Education', 'Automotive', 'Non-Profit']

function StatsTestimonial() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let frame: number
    const duration = 1800
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * 300))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isInView])

  return (
    <section ref={ref} className="px-[var(--gutter)] py-[120px]">
      <div>
        <motion.div
          className="grid items-center gap-16 md:grid-cols-2"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left: Stat + industries */}
          <div>
            <div
              className="mb-2 font-display font-bold leading-[1] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(4rem, 8vw, 6rem)' }}
            >
              {count}+
            </div>
            <p className="mb-10 text-[0.85rem] font-medium text-text-secondary">
              Projects delivered across industries
            </p>
            <p className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
              Industries
            </p>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-4 py-1.5 text-[0.75rem] font-medium text-text-secondary transition-colors duration-300 hover:text-text-primary"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Testimonial card */}
          <div
            className="rounded-2xl border p-12"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
          >
            <div className="mb-4 text-[3rem] font-bold leading-[1] text-accent">
              &ldquo;
            </div>
            <p className="mb-8 text-[1.1rem] font-normal leading-[1.65] text-text-primary">
              {testimonials[0].quote}
            </p>
            <p className="text-[0.85rem] font-semibold text-text-primary">
              {testimonials[0].name}
            </p>
            <p className="mt-1 text-[0.8rem] text-text-secondary">
              {testimonials[0].company}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Client Logos (centered flex-wrap names) ── */
const CLIENT_NAMES = [
  'Hako', 'JokaDent', 'AK Invest', 'Magniflex', 'Palma',
  'Tepelene', 'LoriCaffe', 'Tirana Home Store', 'Fentimans', 'Diamond',
  'Akses', 'ExpertCloud', 'Anmetal', 'Wienna', 'Baboon',
  'Berdica', 'Perfect Fashion', 'Alisadudaj', 'Matrix', 'Red Bull',
]

function ClientLogos() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="px-[var(--gutter)] pt-20 pb-[120px]">
      <div>
        <motion.p
          className="mb-12 text-center text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Trusted By
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center gap-0"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {CLIENT_NAMES.map((name) => (
            <span
              key={name}
              className="px-7 py-4 text-[0.8rem] font-medium tracking-[0.04em] text-text-tertiary transition-colors duration-300 hover:text-text-secondary"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const PROCESS_STEPS = [
  { number: '01', title: 'Discovery & Brief', description: 'We listen before we create. Deep immersion into your brand, audience, competitors, and goals to build a brief worth building from.' },
  { number: '02', title: 'Strategy & Direction', description: 'Insights become a strategic foundation — positioning, messaging hierarchy, creative direction, and a clear plan of action.' },
  { number: '03', title: 'Creative Development', description: 'Concepts, iterations, and refinement. We present, collaborate, and push until the work is something we\'re both proud of.' },
  { number: '04', title: 'Production & Delivery', description: 'Pixel-perfect execution across every deliverable. Print, digital, motion — everything ships production-ready, on time.' },
  { number: '05', title: 'Ongoing Partnership', description: 'Great brands evolve. We stay close to help you adapt, grow, and keep the work as sharp as the day it launched.' },
]

/* ── Horizontal Timeline Process ── */
function ProcessSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="px-[var(--gutter)] py-[120px]">
      <div>
        <motion.p
          className="mb-6 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Process
        </motion.p>
        <motion.h2
          className="mb-[72px] max-w-[600px] font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.03em]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          How Every BoldCrest<br />Project Works
        </motion.h2>

        {/* Horizontal scrollable timeline */}
        <motion.div
          className="flex gap-0 overflow-x-auto pb-6"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.12) transparent',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {PROCESS_STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative shrink-0 pr-6"
              style={{ flex: '0 0 260px' }}
            >
              {/* Circle + connecting line */}
              <div className="relative mb-7 flex items-center">
                <div
                  className="z-[2] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[0.8rem] font-bold"
                  style={{ borderColor: 'var(--accent)', background: 'var(--bg)', color: 'var(--text-primary)' }}
                >
                  {step.number}
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="ml-0 h-px flex-1" style={{ background: 'var(--border)' }} />
                )}
              </div>
              <h4 className="mb-2.5 text-[1rem] font-bold tracking-[-0.02em] text-text-primary">
                {step.title}
              </h4>
              <p className="max-w-[220px] text-[0.85rem] leading-[1.65] text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default function ServicesPageClient({
  categories,
  faqItems,
}: ServicesPageClientProps) {
  return (
    <main className="relative">
      {/* ── Hero (Manifesto) ── */}
      <section className="flex flex-col px-[var(--gutter)] pt-[120px] pb-0">
        <div>
          <motion.p
            className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Services
          </motion.p>
          <motion.h1
            className="max-w-[1000px] font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <WordReveal text="We Design Brands, Craft Stories, and Build Campaigns That Don't Just Inform. They Pull People In." />
          </motion.h1>
        </div>
        {/* Divider */}
        <div className="mt-10 md:mt-12 lg:mt-16">
          <div className="h-px w-full bg-border" />
        </div>
      </section>

      {/* ── Service Showcase Cards ── */}
      <ServiceShowcase categories={categories} />

      {/* ── Process Timeline ── */}
      <ProcessSection />

      {/* Divider */}
      <div className="px-[var(--gutter)]">
        <div className="h-px w-full bg-border" />
      </div>

      {/* ── Stats + Testimonial ── */}
      <StatsTestimonial />

      {/* Divider */}
      <div className="px-[var(--gutter)]">
        <div className="h-px w-full bg-border" />
      </div>

      {/* ── Client Logos ── */}
      <ClientLogos />

      {/* ── FAQ ── */}
      {faqItems && faqItems.length > 0 && (
        <FAQSection
          heading="Questions We Hear Most"
          items={faqItems}
          ctaLabel="Start a Project"
        />
      )}
    </main>
  )
}
