'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { InlineButton } from '@/components/MagneticButton'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'

interface TeamMember {
  _id: string
  name: string
  role?: string
  image?: { asset: { _ref: string } }
}

interface DiaryPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: string
  publishedAt?: string
}

interface BottomSectionsProps {
  members: TeamMember[]
  diaryPosts: DiaryPost[]
}

const ACCENT_COLORS = ['#DA291C', '#f9b311', '#004c95', '#DA291C']

/* ── Word-by-word reveal ── */
function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.35'],
  })
  const words = text.split(' ')
  return (
    <span ref={ref}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return <RevealWord key={i} word={word} range={[start, end]} progress={scrollYProgress} />
      })}
    </span>
  )
}

function RevealWord({
  word,
  range,
  progress,
}: {
  word: string
  range: [number, number]
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.3em] inline-block">
      {word}
    </motion.span>
  )
}

/* ── Team strip: stacked portraits (left 40%) + pull quote (right 60%) ── */
function TeamStrip({ members }: { members: TeamMember[] }) {
  const faces = members.slice(0, 4)
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'start 0.3'],
  })
  const textX = useTransform(scrollYProgress, [0, 1], [40, 0])
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || faces.length === 0) return
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % faces.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [mounted, faces.length])

  // Stacked rotations & offsets — mimicking ServiceCards' fanned state
  const rotations = [-8, -3, 3, 8]
  const offsets = [-40, -14, 14, 40]

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  return (
    <section ref={sectionRef} className="px-[var(--gutter)] pb-[var(--space-md)] pt-0">
      <div className="mx-auto flex max-w-[var(--max-width)] flex-col items-center gap-8 md:flex-row md:items-start md:gap-0">
        {/* Left: stacked portrait cards — 40% */}
        <div className="flex w-full justify-center md:w-[40%] md:justify-start">
          {mounted && faces.length > 0 ? (
            <div
              className="relative"
              style={{ width: 260, height: 320 }}
            >
              {faces.map((face, i) => {
                const isActive = i === active
                const isHovered = hovered === i
                const hasImage = !!face.image?.asset?._ref
                const color = ACCENT_COLORS[i % ACCENT_COLORS.length]

                return (
                  <motion.div
                    key={face._id}
                    className="absolute left-1/2 top-0 h-[300px] w-[200px] cursor-pointer overflow-hidden rounded-2xl border-2 border-white/[0.06]"
                    style={{ marginLeft: -100 }}
                    animate={{
                      rotate: rotations[i] ?? 0,
                      x: offsets[i] ?? 0,
                      scale: isActive ? 1.05 : 0.95,
                      zIndex: isActive ? 10 : faces.length - i,
                    }}
                    whileHover={{
                      scale: 1.1,
                      zIndex: 20,
                      rotate: 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {hasImage ? (
                      <Image
                        src={urlFor(face.image!).width(400).height(600).url()}
                        alt={face.name}
                        width={200}
                        height={300}
                        loader={sanityImageLoader}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center text-[1.2rem] font-bold tracking-wider text-white"
                        style={{ backgroundColor: color }}
                      >
                        {getInitials(face.name)}
                      </div>
                    )}

                    {/* Name overlay on hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pb-3 pt-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-[0.75rem] font-semibold text-white">
                            {face.name}
                          </p>
                          {face.role && (
                            <p className="text-[0.6rem] uppercase tracking-[0.1em] text-white/60">
                              {face.role}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div style={{ width: 260, height: 320 }} />
          )}
        </div>

        {/* Right: pull quote — 60%, bottom-aligned */}
        <motion.div
          className="w-full md:w-[60%] md:pl-[var(--space-xl)]"
          style={{ x: textX, opacity: textOpacity }}
        >
          <p className="text-[1rem] leading-[1.75] text-text-secondary">
            Strategists, designers, filmmakers, and communicators who
            care about the work as much as you do. No egos — just
            craft and conviction.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ── 1. Services CTA (on dark background, before diary) ── */
function ServicesCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="px-[var(--gutter)] pb-[var(--space-lg)] pt-0 md:pb-[var(--space-xl)]">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-display text-[clamp(2rem,6vw,6rem)] font-bold leading-[1.1] tracking-[-0.03em]">
          <WordReveal text="Three disciplines." />{' '}
          <InlineButton href="/services" label="Explore All" />{' '}
          <WordReveal text="One obsession." />
        </p>
      </motion.div>
    </section>
  )
}

/* ── Diary — two posts visible, slide to next two ── */
const PLACEHOLDER_POSTS: DiaryPost[] = [
  {
    _id: 'p1',
    title: 'Why your brand needs a point of view',
    slug: { current: 'brand-point-of-view' },
    excerpt: 'A logo isn\'t a brand. A brand is the feeling people carry after every interaction. Here\'s how we build that feeling from scratch.',
    category: 'Branding',
    publishedAt: '2026-03-10',
  },
  {
    _id: 'p2',
    title: 'The death of safe design',
    slug: { current: 'death-of-safe-design' },
    excerpt: 'Playing it safe is the riskiest move in a crowded market. We break down why bold creative consistently outperforms the forgettable.',
    category: 'Design',
    publishedAt: '2026-02-28',
  },
  {
    _id: 'p3',
    title: 'Motion is the new typography',
    slug: { current: 'motion-new-typography' },
    excerpt: 'Static brands are invisible brands. How motion design became the most important layer of modern identity systems.',
    category: 'Motion',
    publishedAt: '2026-02-15',
  },
  {
    _id: 'p4',
    title: 'Campaigns that outlive the algorithm',
    slug: { current: 'campaigns-outlive-algorithm' },
    excerpt: 'Social platforms change daily. We build communication strategies anchored to human truths, not trending formats.',
    category: 'Strategy',
    publishedAt: '2026-01-30',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Branding: '#DA291C',
  Design: '#DA291C',
  Motion: '#f9b311',
  Strategy: '#004c95',
  Culture: '#f9b311',
}

/* ── Diary card with circle-reveal hover on image ── */
function DiaryCardImage({ post, index }: { post: DiaryPost; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const color = CATEGORY_COLORS[post.category || ''] || '#DA291C'

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <Link href={`/diary/${post.slug.current}`} className="group block">
      {/* Image container with circle-reveal hover */}
      <div
        ref={cardRef}
        className="relative aspect-square overflow-hidden rounded-2xl bg-[#1a1a1a]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Placeholder image */}
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-[1.2rem] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-white/10 text-center px-4 md:text-[3rem] md:px-8">
            {post.title}
          </span>
        </div>

        {/* Circle reveal overlay on hover — "Read More" marquee */}
        <motion.div
          className="pointer-events-none absolute flex items-center justify-center overflow-hidden rounded-full"
          style={{
            left: mouse.x,
            top: mouse.y,
            x: '-50%',
            y: '-50%',
            backgroundColor: '#0a0a0a',
          }}
          animate={{
            width: hovering ? 600 : 0,
            height: hovering ? 600 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Marquee text */}
          <div className="flex shrink-0 animate-[marquee_4s_linear_infinite] items-center gap-8 whitespace-nowrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="text-[1.2rem] font-semibold tracking-[0.1em] text-white"
              >
                Read More
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Info below image */}
      <div className="mt-3 px-0.5 md:mt-5 md:px-1">
        {/* Category pill — neutral by default, colored on hover */}
        {post.category && (
          <span
            className="category-pill mb-2 inline-block rounded-[var(--radius-pill)] border border-[#0a0a0a]/15 px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-[#0a0a0a]/50 transition-all duration-200 md:mb-3 md:px-3 md:py-1 md:text-[0.6rem]"
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = color
              el.style.borderColor = color
              el.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = 'transparent'
              el.style.borderColor = ''
              el.style.color = ''
            }}
          >
            {post.category}
          </span>
        )}

        {/* Title */}
        <h3 className="font-display text-[0.7rem] font-bold uppercase leading-[1.3] tracking-[0.02em] text-[#0a0a0a] transition-colors duration-200 group-hover:text-accent md:text-[clamp(1rem,1.5vw,1.3rem)]">
          {post.title}
        </h3>

        {/* Excerpt — hidden on mobile */}
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 hidden text-[0.8rem] leading-[1.6] text-[#0a0a0a]/45 md:block">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}

function DiarySection({ posts }: { posts: DiaryPost[] }) {
  const entries = posts.length > 0 ? posts.slice(0, 4) : PLACEHOLDER_POSTS
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Smooth scroll-driven color change on the layout wrapper
  // Starts when diary section top reaches 30% of viewport (ServicesCTA already scrolled off)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.3', 'end 0.7'],
  })
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.04, 0.96, 1],
    ['#0a0a0a', '#EDEDED', '#EDEDED', '#0a0a0a']
  )

  useMotionValueEvent(bgColor, 'change', (color) => {
    const wrapper = document.querySelector('.bg-bg') as HTMLElement
    if (wrapper) wrapper.style.backgroundColor = color
  })

  useEffect(() => {
    return () => {
      const wrapper = document.querySelector('.bg-bg') as HTMLElement
      if (wrapper) wrapper.style.backgroundColor = ''
    }
  }, [])

  return (
    <div ref={sectionRef} className="relative pt-[var(--space-2xl)] pb-[var(--space-2xl)]">
      {/* Header row */}
      <div className="px-[var(--gutter)]">
        <motion.div
          className="flex items-end justify-between pb-[var(--space-xl)]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#0a0a0a]">
            The Diary<span className="text-accent">.</span>
          </h2>
          <Link
            href="/diary"
            className="group mb-2 flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-[#0a0a0a]/60 transition-all duration-200 hover:gap-3 hover:text-[#0a0a0a]"
          >
            See All
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-[0.4s] group-hover:translate-x-1"
              style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Full-width divider */}
      <div className="h-px w-full bg-[#0a0a0a]/10" />

      {/* Full-width post grid — newspaper style with images */}
      <div className="grid grid-cols-2 gap-4 px-[var(--gutter)] py-[var(--space-lg)] md:gap-6 md:py-[var(--space-xl)] lg:grid-cols-4">
        {entries.map((post, i) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.15 + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <DiaryCardImage post={post} index={i} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── 2. People CTA ── */
function PeopleSection() {
  return (
    <section className="px-[var(--gutter)] pb-[var(--space-lg)] pt-[var(--space-lg)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        <p className="font-display text-[clamp(2rem,8vw,8rem)] font-bold leading-[1.1] tracking-[-0.03em]">
          <WordReveal text="No egos, just" />{' '}
          <InlineButton href="/people" label="The Team" showArrow />{' '}
          <WordReveal text="behind the bold." />
        </p>
      </div>
    </section>
  )
}


/* ── 4. Coffee CTA ── */
function CoffeeCTA() {
  return (
    <section className="border-t border-border px-[var(--gutter)] py-[var(--space-2xl)] md:py-[var(--space-3xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        <div className="flex flex-col items-center text-center">
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary md:mb-6 md:text-[0.75rem]">
            What are you waiting for?
          </p>
          <p className="font-display text-[clamp(2rem,8vw,8rem)] font-bold leading-[1.1] tracking-[-0.03em]">
            Let&apos;s drink{' '}
            <InlineButton href="/contact" label="A Coffee" showArrow />{' '}
            together<span className="text-accent">.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default function BottomSections({ members, diaryPosts }: BottomSectionsProps) {
  return (
    <>
      <ServicesCTA />
      <DiarySection posts={diaryPosts} />
      <PeopleSection />
      <TeamStrip members={members} />
      <CoffeeCTA />
    </>
  )
}
