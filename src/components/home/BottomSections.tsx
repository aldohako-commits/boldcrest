'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { InlineButton } from '@/components/MagneticButton'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'

interface TeamMember {
  _id: string
  name: string
  role?: string
  image?: { asset: { _ref: string } }
}

interface BottomSectionsProps {
  members: TeamMember[]
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
      <div className="mx-auto flex max-w-[var(--max-width)] flex-col items-stretch gap-10 md:flex-row md:items-start md:gap-0">
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

/* ── 1. Services CTA ── */
function ServicesCTA() {
  return (
    <section className="px-[var(--gutter)] py-[var(--space-3xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        <p className="font-display text-[clamp(2.8rem,8vw,8rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          <WordReveal text="Three disciplines." />{' '}
          <InlineButton href="/services" label="Explore All" />{' '}
          <WordReveal text="One obsession." />
        </p>
      </div>
    </section>
  )
}

/* ── 2. People CTA ── */
function PeopleSection() {
  return (
    <section className="px-[var(--gutter)] pb-[var(--space-lg)] pt-[var(--space-3xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        <p className="font-display text-[clamp(2.8rem,8vw,8rem)] font-bold leading-[1.05] tracking-[-0.03em]">
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
    <section className="border-t border-border px-[var(--gutter)] py-[var(--space-3xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        <div className="flex flex-col items-center text-center">
          <p className="mb-6 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
            What are you waiting for?
          </p>
          <p className="font-display text-[clamp(2.8rem,8vw,8rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Let&apos;s drink{' '}
            <InlineButton href="/contact" label="A Coffee" showArrow />{' '}
            together<span className="text-accent">.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default function BottomSections({ members }: BottomSectionsProps) {
  return (
    <>
      <ServicesCTA />
      <PeopleSection />
      <TeamStrip members={members} />
      <CoffeeCTA />
    </>
  )
}
