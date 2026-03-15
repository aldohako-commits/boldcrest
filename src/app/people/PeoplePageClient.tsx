'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import { InlineButton } from '@/components/MagneticButton'

interface TeamMember {
  _id: string
  name: string
  role?: string
  image?: {
    asset: { _ref: string }
  }
}

interface PeoplePageClientProps {
  members: TeamMember[]
}

/* ══════════════════════════════════════════════════════
   Morph blob paths
══════════════════════════════════════════════════════ */
const BLOB_PATHS = {
  a1: 'M380,50C420,90,450,160,440,240C430,320,390,400,340,460C290,520,220,560,150,550C80,540,20,480,5,400C-10,320,20,220,70,150C120,80,190,30,260,15C330,0,340,10,380,50Z',
  a2: 'M360,30C410,70,460,140,460,220C460,300,410,380,350,440C290,500,210,540,140,530C70,520,10,460,0,380C-10,300,30,200,80,130C130,60,200,10,270,5C340,0,310,-10,360,30Z',
  b1: 'M50,80C100,30,180,0,250,20C320,40,370,110,380,190C390,270,360,360,300,420C240,480,150,510,80,480C10,450,-20,360,10,280C40,200,0,130,50,80Z',
  b2: 'M70,60C130,10,200,-10,270,20C340,50,390,130,390,210C390,290,340,370,280,430C220,490,140,520,70,490C0,460,-30,370,10,290C50,210,10,110,70,60Z',
  c1: 'M320,40C380,80,430,150,430,230C430,310,380,400,310,450C240,500,150,510,90,470C30,430,-10,350,10,270C30,190,100,110,170,60C240,10,260,0,320,40Z',
  c2: 'M340,20C400,60,450,130,450,210C450,290,400,370,330,430C260,490,170,520,100,490C30,460,-20,380,0,290C20,200,80,120,150,70C220,20,280,-20,340,20Z',
  d1: 'M250,10C310,30,370,90,400,170C430,250,430,350,380,420C330,490,240,530,160,510C80,490,20,410,5,320C-10,230,20,130,80,70C140,10,190,-10,250,10Z',
  d2: 'M270,20C340,50,390,120,410,200C430,280,410,370,360,430C310,490,230,520,150,490C70,460,10,380,0,290C-10,200,30,110,90,60C150,10,200,-10,270,20Z',
}

function extractNumbers(path: string): number[] {
  const nums: number[] = []
  path.replace(/-?\d+\.?\d*/g, (m) => { nums.push(parseFloat(m)); return m })
  return nums
}
function extractTemplate(path: string): string {
  return path.replace(/-?\d+\.?\d*/g, '@@')
}
function interpolatePath(pathA: string, pathB: string, t: number): string {
  const numsA = extractNumbers(pathA)
  const numsB = extractNumbers(pathB)
  const template = extractTemplate(pathA)
  let i = 0
  return template.replace(/@@/g, () => {
    const a = numsA[i] ?? 0; const b = numsB[i] ?? 0; i++
    const val = a + (b - a) * t
    return val % 1 === 0 ? String(val) : val.toFixed(2)
  })
}

/* ── Morph blob that pulses based on active state ── */
function MorphBlob({
  pathA, pathB, color, size, blur = 50, opacity = 0.12, style, active,
}: {
  pathA: string; pathB: string; color: string; size: number
  blur?: number; opacity?: number; style: React.CSSProperties; active: boolean
}) {
  const [morphT, setMorphT] = useState(0)

  useEffect(() => {
    if (!active) return
    let raf: number
    let start: number | null = null
    const duration = 3000
    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = (ts - start) % (duration * 2)
      const t = elapsed < duration ? elapsed / duration : 2 - elapsed / duration
      setMorphT(t)
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [active])

  const d = interpolatePath(pathA, pathB, morphT)

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ ...style, width: size, height: size, zIndex: 0 }}
      animate={active
        ? { scale: [0.92, 1.06, 0.92], opacity, rotate: [0, 3, -3, 0] }
        : { scale: 0.7, opacity: 0 }
      }
      transition={{
        opacity: { duration: 1, ease: 'easeOut' },
        scale: { duration: 6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
        rotate: { duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
      }}
    >
      <svg viewBox="0 0 500 550" fill="none" className="h-full w-full" style={{ filter: `blur(${blur}px)` }}>
        <path fill={color} fillOpacity={1} d={d} />
      </svg>
    </motion.div>
  )
}

/* ── Word-by-word reveal triggered by active state ── */
function BigStatement({ text, accent, active, className = '' }: {
  text: string; accent?: string; active: boolean; className?: string
}) {
  const words = text.split(' ')
  return (
    <div className={className}>
      <p className="font-display text-[clamp(1.8rem,4vw,3.5rem)] font-bold leading-[1.15]">
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="mr-[0.3em] inline-block"
            initial={{ opacity: 0.15, y: 8 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 8 }}
            transition={{ duration: 0.5, delay: active ? i * 0.06 : 0, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        ))}
        {accent && <span className="text-accent">{accent}</span>}
      </p>
    </div>
  )
}

/* ── Fade-up child triggered by active ── */
function FadeUp({ children, delay = 0, active, className = '' }: {
  children: React.ReactNode; delay?: number; active: boolean; className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: active ? delay : 0, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}


/* ══════════════════════════════════════════════════════
   TOTAL SECTIONS = 9
══════════════════════════════════════════════════════ */
const TOTAL_SECTIONS = 10
const TRANSITION_DURATION = 700

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

export default function PeoplePageClient({ members }: PeoplePageClientProps) {
  const [current, setCurrent] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  const goTo = useCallback((index: number) => {
    if (isLocked) return
    const clamped = Math.max(0, Math.min(TOTAL_SECTIONS - 1, index))
    if (clamped === current) return
    setIsLocked(true)
    setCurrent(clamped)
    setTimeout(() => setIsLocked(false), TRANSITION_DURATION + 100)
  }, [current, isLocked])

  // Wheel handler
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isLocked) return
      if (Math.abs(e.deltaY) < 15) return // ignore tiny scroll
      if (e.deltaY > 0) goTo(current + 1)
      else goTo(current - 1)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [current, isLocked, goTo])

  // Touch handler
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (isLocked) return
      const diff = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(diff) < 50) return
      if (diff > 0) goTo(current + 1)
      else goTo(current - 1)
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [current, isLocked, goTo])

  // Keyboard handler
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goTo(current + 1) }
      if (e.key === 'ArrowUp') { e.preventDefault(); goTo(current - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goTo])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const active = (i: number) => current === i

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-bg" style={{ zIndex: 10 }}>
      {/* Sliding wrapper */}
      <motion.div
        className="relative will-change-transform"
        animate={{ y: `${-current * 100}dvh` }}
        transition={{ duration: TRANSITION_DURATION / 1000, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* ═══════════════ MORPH BLOBS ═══════════════ */}
        <div className="pointer-events-none absolute inset-0" style={{ zIndex: 0, height: `${TOTAL_SECTIONS * 100}dvh` }} aria-hidden="true">
          <MorphBlob pathA={BLOB_PATHS.a1} pathB={BLOB_PATHS.a2} color="#DA291C" size={700} blur={60} opacity={0.14} active={current <= 1} style={{ top: '5vh', right: '-120px' }} />
          <MorphBlob pathA={BLOB_PATHS.b1} pathB={BLOB_PATHS.b2} color="#f9b311" size={550} blur={50} opacity={0.1} active={current >= 1 && current <= 3} style={{ top: '130dvh', left: '-100px' }} />
          <MorphBlob pathA={BLOB_PATHS.c1} pathB={BLOB_PATHS.c2} color="#004c95" size={600} blur={55} opacity={0.14} active={current >= 3 && current <= 5} style={{ top: '320dvh', right: '-80px' }} />
          <MorphBlob pathA={BLOB_PATHS.d1} pathB={BLOB_PATHS.d2} color="#DA291C" size={500} blur={45} opacity={0.1} active={current >= 5 && current <= 7} style={{ top: '520dvh', left: '-60px' }} />
          <MorphBlob pathA={BLOB_PATHS.a1} pathB={BLOB_PATHS.a2} color="#f9b311" size={550} blur={50} opacity={0.12} active={current >= 7} style={{ top: '700dvh', right: '-80px' }} />
        </div>

        {/* ═══════════════════════════════════════════
            0. HERO
        ═══════════════════════════════════════════ */}
        <section className="relative flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto max-w-[var(--max-width)]">
            <motion.p
              className="mb-[var(--space-md)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-accent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Est. 2020 — Tirana, Albania
            </motion.p>

            <motion.h1
              className="max-w-[900px] font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.08]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              Two earthquakes,{' '}
              <br className="hidden md:block" />
              a pandemic, and{' '}
              <br className="hidden md:block" />
              a decision<span className="text-accent">.</span>
            </motion.h1>

            <motion.p
              className="mt-[var(--space-lg)] max-w-[520px] text-[1.05rem] leading-[1.8] text-text-secondary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              The ground shook twice. The world shut down. And somewhere in the middle of all of that, two 22-year-olds decided it was a good time to build an agency.
            </motion.p>

            <motion.p
              className="mt-[var(--space-sm)] max-w-[520px] text-[0.95rem] leading-[1.8] text-text-tertiary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Looking back, it might have been the perfect time. Because from day one, we learned that things fall apart — and that you build anyway.
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: current === 0 ? 0.4 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="h-12 w-px bg-text-secondary"
                animate={{ scaleY: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: 'top' }}
              />
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            1. WHAT WE SAW
        ═══════════════════════════════════════════ */}
        <section className="flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <div className="grid gap-[var(--space-xl)] md:grid-cols-2 md:items-start">
              <div>
                <FadeUp active={active(1)}>
                  <p className="mb-[var(--space-sm)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
                    What we saw
                  </p>
                </FadeUp>
                <BigStatement text="A copy of a copy of a copy." active={active(1)} />
              </div>

              <div className="md:pt-10">
                <FadeUp delay={0.15} active={active(1)}>
                  <p className="text-[1rem] leading-[1.85] text-text-secondary">
                    Albania&apos;s creative landscape was — and in many ways still is — a copy of a copy of a copy. Brands without identity. Campaigns that belonged to no one. Work that could have been made anywhere, for anyone, meaning nothing to nobody.
                  </p>
                </FadeUp>
                <FadeUp delay={0.3} active={active(1)}>
                  <p className="mt-[var(--space-md)] text-[1.15rem] font-semibold leading-[1.6] text-text-primary">
                    We knew it could be different.
                  </p>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            2. THE FOUNDERS
        ═══════════════════════════════════════════ */}
        <section className="flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <div className="grid gap-[var(--space-xl)] md:grid-cols-[1fr_1fr] md:items-start">
              <FadeUp active={active(2)}>
                <div className="relative aspect-[4/5] max-h-[60dvh] overflow-hidden rounded-[var(--radius-lg)] bg-bg-elevated">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="font-display text-[4rem] font-bold leading-none text-text-tertiary" style={{ opacity: 0.15 }}>
                      X + A
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 h-20 w-20">
                    <div className="absolute top-4 right-4 h-px w-10 bg-accent" />
                    <div className="absolute top-4 right-4 h-10 w-px bg-accent" />
                  </div>
                </div>
              </FadeUp>

              <div className="flex flex-col gap-[var(--space-lg)]">
                <FadeUp active={active(2)}>
                  <p className="mb-[var(--space-sm)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
                    The equation
                  </p>
                </FadeUp>

                <FadeUp delay={0.1} active={active(2)}>
                  <p className="text-[1rem] leading-[1.85] text-text-secondary">
                    Xhulio is a superstar in everything visual. Aldo builds relationships that last. When the two of us became friends, the equation was simple: his eye, his instinct, his creativity — matched with the trust, the conversations, the partnerships that turn a single project into a decade-long journey.
                  </p>
                </FadeUp>

                <FadeUp delay={0.15} active={active(2)}>
                  <p className="text-[1rem] leading-[1.85] text-text-secondary">
                    We didn&apos;t merge dreams. We merged what we were each already best at. And that combination became BoldCrest.
                  </p>
                </FadeUp>

                <FadeUp delay={0.2} active={active(2)}>
                  <p className="text-[1rem] leading-[1.85] text-text-secondary">
                    We took our first team from the same university halls we were still sitting in. We were 22. We were probably not ready. We did it anyway. And what we brought to the market — at a time when no one else was bringing it — was real creative thinking to social media. Not content. <em className="not-italic font-semibold text-text-primary">Ideas.</em>
                  </p>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            3. THE NAME
        ═══════════════════════════════════════════ */}
        <section className="flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <div className="mb-[var(--space-xl)]">
              <BigStatement text="The name was chosen with intention." active={active(3)} />
            </div>

            <div className="grid gap-[var(--space-xl)] md:grid-cols-3">
              <FadeUp active={active(3)}>
                <div className="border-t border-border pt-[var(--space-md)]">
                  <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-accent">Bold</p>
                  <p className="text-[0.95rem] leading-[1.8] text-text-secondary">Because that&apos;s what we do to brands.</p>
                </div>
              </FadeUp>

              <FadeUp delay={0.1} active={active(3)}>
                <div className="border-t border-border pt-[var(--space-md)]">
                  <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-[#f9b311]">Crest</p>
                  <p className="text-[0.95rem] leading-[1.8] text-text-secondary">The peak you climb, and the mark you leave.</p>
                </div>
              </FadeUp>

              <FadeUp delay={0.2} active={active(3)}>
                <div className="border-t border-border pt-[var(--space-md)]">
                  <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-[#004c95]">.com</p>
                  <p className="text-[0.95rem] leading-[1.8] text-text-secondary">No _al. No _agency. A clean .com. From the beginning, we refused to be a local story with local ambitions.</p>
                </div>
              </FadeUp>
            </div>

            <FadeUp delay={0.15} active={active(3)}>
              <p className="mt-[var(--space-xl)] text-[1.1rem] font-semibold leading-[1.7] text-text-primary">
                We believed — and still believe — that our market is the world.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            4. THE MOTTO
        ═══════════════════════════════════════════ */}
        <section className="flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <FadeUp active={active(4)}>
              <p className="mb-[var(--space-md)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
                Our motto
              </p>
            </FadeUp>

            <BigStatement text="Climbing mountains together." active={active(4)} />

            <div className="mt-[var(--space-xl)] grid gap-[var(--space-lg)] md:grid-cols-2">
              <FadeUp delay={0.1} active={active(4)}>
                <p className="text-[1rem] leading-[1.85] text-text-secondary">
                  It means we don&apos;t hand you a deliverable and disappear. We sit in your meetings. We learn your operations. We understand your problems before we try to solve them.
                </p>
              </FadeUp>

              <FadeUp delay={0.15} active={active(4)}>
                <p className="text-[1rem] leading-[1.85] text-text-secondary">
                  We push back when we think you&apos;re wrong — not to be difficult, but because that&apos;s what real partners do. And when we&apos;re wrong, we listen.
                </p>
              </FadeUp>
            </div>

            <FadeUp delay={0.25} active={active(4)}>
              <p className="mt-[var(--space-lg)] border-l-2 border-accent pl-[var(--space-md)] text-[1.05rem] leading-[1.8] text-text-primary italic">
                We&apos;ve been told we&apos;re too involved. We consider that a compliment.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            5. THE TEAM CULTURE
        ═══════════════════════════════════════════ */}
        <section className="flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <FadeUp active={active(5)}>
              <p className="mb-[var(--space-md)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
                The team
              </p>
            </FadeUp>

            <div className="max-w-[700px]">
              <BigStatement text="Every person has a glitch in their system." active={active(5)} />

              <FadeUp delay={0.1} active={active(5)}>
                <p className="mt-[var(--space-lg)] text-[1rem] leading-[1.85] text-text-secondary">
                  Something slightly off, slightly unusual, slightly theirs. And that&apos;s exactly what makes them belong here. We are different people who are somehow made of the same thing.
                </p>
              </FadeUp>

              <FadeUp delay={0.15} active={active(5)}>
                <p className="mt-[var(--space-md)] text-[1rem] leading-[1.85] text-text-secondary">
                  We bully each other. We cook together. We have traditions that make no sense to anyone outside this room. And when someone is sick, we show up.
                </p>
              </FadeUp>

              <FadeUp delay={0.2} active={active(5)}>
                <p className="mt-[var(--space-md)] text-[1.05rem] font-semibold leading-[1.7] text-text-primary">
                  It is, honestly, harder to find someone who won&apos;t disturb our peace than someone who has a great portfolio.
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            6. TEAM GRID
        ═══════════════════════════════════════════ */}
        <section className="flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <FadeUp active={active(6)}>
              <div className="mb-[var(--space-lg)] flex items-end justify-between border-b border-border pb-[var(--space-md)]">
                <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                  The Faces
                </h2>
                <span className="text-[0.75rem] tracking-[0.1em] text-text-tertiary">
                  {members.length > 0 ? `${members.length} people` : ''}
                </span>
              </div>
            </FadeUp>

            <div className="grid grid-cols-2 gap-[var(--space-md)] sm:grid-cols-3 lg:grid-cols-4">
              {members.map((member, idx) => (
                <FadeUp key={member._id} delay={idx * 0.06} active={active(6)}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-bg-card">
                    {member.image?.asset ? (
                      <Image
                        loader={sanityImageLoader}
                        src={urlFor(member.image).width(500).height(667).url()}
                        alt={member.name}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-[0.8s] group-hover:scale-105"
                        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="h-16 w-16 rounded-full border-2 border-text-tertiary" />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-[var(--space-md)] opacity-0 transition-opacity duration-[0.4s] group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.75) 100%)',
                        transitionTimingFunction: 'var(--ease-out-expo)',
                      }}
                    >
                      <h3
                        className="translate-y-3 font-display text-[1rem] font-semibold transition-transform duration-[0.4s] group-hover:translate-y-0"
                        style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
                      >
                        {member.name}
                      </h3>
                      {member.role && (
                        <span
                          className="mt-1 translate-y-3 text-[0.75rem] uppercase tracking-[0.1em] text-text-secondary transition-transform duration-[0.4s] group-hover:translate-y-0"
                          style={{ transitionTimingFunction: 'var(--ease-out-expo)', transitionDelay: '0.04s' }}
                        >
                          {member.role}
                        </span>
                      )}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {members.length === 0 && (
              <p className="py-20 text-center text-text-tertiary">Team members coming soon.</p>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            7. THE WORK PHILOSOPHY
        ═══════════════════════════════════════════ */}
        <section className="flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <div className="mx-auto max-w-[700px] text-center">
              <FadeUp active={active(7)}>
                <p className="mb-[var(--space-md)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
                  The work
                </p>
              </FadeUp>

              <BigStatement text="The work we're most proud of, most people will never know we made." active={active(7)} className="text-center" />

              <FadeUp delay={0.15} active={active(7)}>
                <p className="mt-[var(--space-lg)] text-[1rem] leading-[1.85] text-text-secondary">
                  That&apos;s not false modesty. That&apos;s the goal. When a brand becomes so real, so lived-in, so theirs — when people carry it, wear it, post it, and believe in it without a second thought — the agency behind it disappears. And it should.
                </p>
              </FadeUp>

              <FadeUp delay={0.2} active={active(7)}>
                <p className="mt-[var(--space-md)] text-[1.1rem] font-semibold leading-[1.7] text-text-primary">
                  The best thing we can do is make something bigger than ourselves, then step back and watch it belong to the world.
                </p>
              </FadeUp>

              <FadeUp delay={0.25} active={active(7)}>
                <p className="mt-[var(--space-sm)] text-[0.95rem] text-text-tertiary italic">
                  That&apos;s why we exist.
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            8. CLOSING TEXT — First part
        ═══════════════════════════════════════════ */}
        <section className="flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <div className="mx-auto max-w-[650px]">
              <FadeUp active={active(8)}>
                <p className="text-[1rem] leading-[1.85] text-text-secondary">
                  If you&apos;ve read this far, we hope you felt something. A small warmth. A little confidence. Maybe a smile at the chaos of two kids building something real in a country still figuring out what &ldquo;brand&rdquo; means.
                </p>
              </FadeUp>
            </div>

            {/* Sliding Gallery */}
            <FadeUp delay={0.2} active={active(8)}>
              <div className="relative mt-[var(--space-xl)] overflow-hidden">
                <div className="flex animate-[marquee_40s_linear_infinite] gap-3">
                  {[...galleryImages, ...galleryImages].map((img, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 overflow-hidden rounded-xl"
                      style={{ width: `${img.width}px`, height: '320px' }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(135deg, ${img.color}15 0%, ${img.color}08 100%)` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white/8">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1" />
                          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                          <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="absolute right-0 bottom-0 left-0 h-[1px] opacity-20" style={{ backgroundColor: img.color }} />
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            9. CLOSING — Let's climb
        ═══════════════════════════════════════════ */}
        <section className="flex h-[100dvh] items-center px-[var(--gutter)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <div className="mx-auto max-w-[650px]">
              <FadeUp active={active(9)}>
                <p className="text-[1rem] leading-[1.85] text-text-secondary">
                  We&apos;re still figuring things out too. We always will be.
                </p>
              </FadeUp>

              <FadeUp delay={0.1} active={active(9)}>
                <p className="mt-[var(--space-md)] text-[1rem] leading-[1.85] text-text-secondary">
                  But your project — your brand, your idea, your mountain — is in the safest hands we know how to offer.
                </p>
              </FadeUp>

              <FadeUp delay={0.2} active={active(9)}>
                <div className="mt-[var(--space-xl)]" style={{ fontSize: 'clamp(3rem,8vw,6rem)' }}>
                  <InlineButton href="/contact" label="Let's climb" showArrow />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  )
}
