'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import ScrollReveal from '@/components/ScrollReveal'
import {
  ScrollRevealStagger,
  ScrollRevealItem,
} from '@/components/ScrollReveal'

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

/* ── Parallax pull-quote ── */
function ParallaxQuote({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

/* ── Horizontal rule with accent dot ── */
function AccentDivider() {
  return (
    <div className="mx-auto flex max-w-[var(--max-width)] items-center gap-4 px-[var(--gutter)] py-[var(--space-lg)]">
      <div className="h-px flex-1 bg-border" />
      <div className="h-2 w-2 rounded-full bg-accent" />
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

/* ── Word-by-word reveal for big statements ── */
function BigStatement({ text, accent }: { text: string; accent?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.3'],
  })
  const words = text.split(' ')

  return (
    <div ref={ref} className="overflow-hidden">
      <p className="font-display text-[clamp(1.8rem,4vw,3.5rem)] font-bold leading-[1.15]">
        {words.map((word, i) => {
          const start = i / words.length
          const end = Math.min(start + 1.5 / words.length, 1)
          return <RevealWord key={i} word={word} range={[start, end]} progress={scrollYProgress} />
        })}
        {accent && <span className="text-accent">{accent}</span>}
      </p>
    </div>
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
  const opacity = useTransform(progress, range, [0.15, 1])
  const y = useTransform(progress, range, [8, 0])

  return (
    <motion.span
      style={{ opacity, y }}
      className="mr-[0.3em] inline-block"
    >
      {word}
    </motion.span>
  )
}

export default function PeoplePageClient({ members }: PeoplePageClientProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0])
  const heroY = useTransform(heroProgress, [0, 0.5], [0, -80])

  return (
    <main>
      {/* ═══════════════════════════════════════════
          HERO — Origin story opening
      ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[85vh] overflow-hidden px-[var(--gutter)] pt-40 pb-[var(--space-3xl)]">
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="mx-auto max-w-[var(--max-width)]"
        >
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
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          THE PROBLEM — What we saw
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] py-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <div className="grid gap-[var(--space-xl)] md:grid-cols-2 md:items-start">
            <div>
              <ScrollReveal>
                <p className="mb-[var(--space-sm)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
                  What we saw
                </p>
              </ScrollReveal>
              <BigStatement text="A copy of a copy of a copy." />
            </div>

            <div className="md:pt-10">
              <ScrollReveal delay={0.15}>
                <p className="text-[1rem] leading-[1.85] text-text-secondary">
                  Albania&apos;s creative landscape was — and in many ways still is — a copy of a copy of a copy. Brands without identity. Campaigns that belonged to no one. Work that could have been made anywhere, for anyone, meaning nothing to nobody.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.25}>
                <p className="mt-[var(--space-md)] text-[1.15rem] font-semibold leading-[1.6] text-text-primary">
                  We knew it could be different.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <AccentDivider />

      {/* ═══════════════════════════════════════════
          THE FOUNDERS — Xhulio & Aldo
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] py-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <div className="grid gap-[var(--space-xl)] md:grid-cols-[1fr_1fr] md:items-start">
            {/* Image placeholder — can add founder photos later */}
            <ScrollReveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-bg-elevated">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-display text-[4rem] font-bold leading-none text-text-tertiary" style={{ opacity: 0.15 }}>
                      X + A
                    </p>
                  </div>
                </div>
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 h-20 w-20">
                  <div className="absolute top-4 right-4 h-px w-10 bg-accent" />
                  <div className="absolute top-4 right-4 h-10 w-px bg-accent" />
                </div>
              </div>
            </ScrollReveal>

            <div className="flex flex-col gap-[var(--space-lg)]">
              <ScrollReveal>
                <p className="mb-[var(--space-sm)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
                  The equation
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <p className="text-[1rem] leading-[1.85] text-text-secondary">
                  Xhulio is a superstar in everything visual. Aldo builds relationships that last. When the two of us became friends, the equation was simple: his eye, his instinct, his creativity — matched with the trust, the conversations, the partnerships that turn a single project into a decade-long journey.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <p className="text-[1rem] leading-[1.85] text-text-secondary">
                  We didn&apos;t merge dreams. We merged what we were each already best at. And that combination became BoldCrest.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-[1rem] leading-[1.85] text-text-secondary">
                  We took our first team from the same university halls we were still sitting in. We were 22. We were probably not ready. We did it anyway. And what we brought to the market — at a time when no one else was bringing it — was real creative thinking to social media. Not content. <em className="not-italic font-semibold text-text-primary">Ideas.</em>
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE NAME — Full-width statement
      ═══════════════════════════════════════════ */}
      <section className="bg-bg-elevated px-[var(--gutter)] py-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <ParallaxQuote className="mb-[var(--space-xl)]">
            <BigStatement text="The name was chosen with intention." />
          </ParallaxQuote>

          <div className="grid gap-[var(--space-xl)] md:grid-cols-3">
            <ScrollReveal>
              <div className="border-t border-border pt-[var(--space-md)]">
                <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-accent">
                  Bold
                </p>
                <p className="text-[0.95rem] leading-[1.8] text-text-secondary">
                  Because that&apos;s what we do to brands.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="border-t border-border pt-[var(--space-md)]">
                <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-[#f9b311]">
                  Crest
                </p>
                <p className="text-[0.95rem] leading-[1.8] text-text-secondary">
                  The peak you climb, and the mark you leave.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="border-t border-border pt-[var(--space-md)]">
                <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-[#004c95]">
                  .com
                </p>
                <p className="text-[0.95rem] leading-[1.8] text-text-secondary">
                  No _al. No _agency. A clean .com. From the beginning, we refused to be a local story with local ambitions.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.15}>
            <p className="mt-[var(--space-xl)] text-[1.1rem] font-semibold leading-[1.7] text-text-primary">
              We believed — and still believe — that our market is the world.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE MOTTO — Climbing mountains together
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] py-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <ScrollReveal>
            <p className="mb-[var(--space-md)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
              Our motto
            </p>
          </ScrollReveal>

          <BigStatement text="Climbing mountains together." />

          <div className="mt-[var(--space-xl)] grid gap-[var(--space-lg)] md:grid-cols-2">
            <ScrollReveal delay={0.1}>
              <p className="text-[1rem] leading-[1.85] text-text-secondary">
                It means we don&apos;t hand you a deliverable and disappear. We sit in your meetings. We learn your operations. We understand your problems before we try to solve them.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="text-[1rem] leading-[1.85] text-text-secondary">
                We push back when we think you&apos;re wrong — not to be difficult, but because that&apos;s what real partners do. And when we&apos;re wrong, we listen.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <p className="mt-[var(--space-lg)] border-l-2 border-accent pl-[var(--space-md)] text-[1.05rem] leading-[1.8] text-text-primary italic">
              We&apos;ve been told we&apos;re too involved. We consider that a compliment.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <AccentDivider />

      {/* ═══════════════════════════════════════════
          THE TEAM CULTURE — The glitch
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] py-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <ScrollReveal>
            <p className="mb-[var(--space-md)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
              The team
            </p>
          </ScrollReveal>

          <div className="grid gap-[var(--space-xl)] md:grid-cols-[1.2fr_1fr] md:items-start">
            <div>
              <BigStatement text="Every person has a glitch in their system." />
              <ScrollReveal delay={0.1}>
                <p className="mt-[var(--space-lg)] text-[1rem] leading-[1.85] text-text-secondary">
                  Something slightly off, slightly unusual, slightly theirs. And that&apos;s exactly what makes them belong here. We are different people who are somehow made of the same thing.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <p className="mt-[var(--space-md)] text-[1rem] leading-[1.85] text-text-secondary">
                  We bully each other. We cook together. We have traditions that make no sense to anyone outside this room. And when someone is sick, we show up.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="mt-[var(--space-md)] text-[1.05rem] font-semibold leading-[1.7] text-text-primary">
                  It is, honestly, harder to find someone who won&apos;t disturb our peace than someone who has a great portfolio.
                </p>
              </ScrollReveal>
            </div>

            {/* Image placeholder for team culture photo */}
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-bg-elevated">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-display text-[1.5rem] font-bold text-text-tertiary" style={{ opacity: 0.15 }}>
                    Team photo
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 h-20 w-20">
                  <div className="absolute bottom-4 left-4 h-px w-10 bg-[#f9b311]" />
                  <div className="absolute bottom-4 left-4 h-10 w-px bg-[#f9b311]" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TEAM GRID — Preserved from original
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] py-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <ScrollReveal>
            <div className="mb-[var(--space-xl)] flex items-end justify-between border-b border-border pb-[var(--space-md)]">
              <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
                The Faces
              </h2>
              <span className="text-[0.75rem] tracking-[0.1em] text-text-tertiary">
                {members.length > 0 ? `${members.length} people` : ''}
              </span>
            </div>
          </ScrollReveal>

          <ScrollRevealStagger
            className="grid grid-cols-2 gap-[var(--space-md)] sm:grid-cols-3 lg:grid-cols-4"
            staggerDelay={0.08}
          >
            {members.map((member) => (
              <ScrollRevealItem key={member._id}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] bg-bg-card">
                  {member.image?.asset ? (
                    <Image
                      loader={sanityImageLoader}
                      src={urlFor(member.image).width(500).height(667).url()}
                      alt={member.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-[0.8s] group-hover:scale-105"
                      style={{
                        transitionTimingFunction: 'var(--ease-out-expo)',
                      }}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="h-16 w-16 rounded-full border-2 border-text-tertiary" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-[var(--space-md)] opacity-0 transition-opacity duration-[0.4s] group-hover:opacity-100"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.75) 100%)',
                      transitionTimingFunction: 'var(--ease-out-expo)',
                    }}
                  >
                    <h3 className="translate-y-3 font-display text-[1rem] font-semibold transition-transform duration-[0.4s] group-hover:translate-y-0"
                      style={{
                        transitionTimingFunction: 'var(--ease-out-expo)',
                      }}
                    >
                      {member.name}
                    </h3>
                    {member.role && (
                      <span
                        className="mt-1 translate-y-3 text-[0.75rem] uppercase tracking-[0.1em] text-text-secondary transition-transform duration-[0.4s] group-hover:translate-y-0"
                        style={{
                          transitionTimingFunction: 'var(--ease-out-expo)',
                          transitionDelay: '0.04s',
                        }}
                      >
                        {member.role}
                      </span>
                    )}
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealStagger>

          {members.length === 0 && (
            <p className="py-20 text-center text-text-tertiary">
              Team members coming soon.
            </p>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE WORK PHILOSOPHY
      ═══════════════════════════════════════════ */}
      <section className="bg-bg-elevated px-[var(--gutter)] py-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <div className="mx-auto max-w-[700px] text-center">
            <ScrollReveal>
              <p className="mb-[var(--space-md)] text-[0.75rem] font-semibold uppercase tracking-[0.25em] text-text-tertiary">
                The work
              </p>
            </ScrollReveal>

            <BigStatement text="The work we're most proud of, most people will never know we made." />

            <ScrollReveal delay={0.15}>
              <p className="mt-[var(--space-lg)] text-[1rem] leading-[1.85] text-text-secondary">
                That&apos;s not false modesty. That&apos;s the goal. When a brand becomes so real, so lived-in, so theirs — when people carry it, wear it, post it, and believe in it without a second thought — the agency behind it disappears. And it should.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mt-[var(--space-md)] text-[1.1rem] font-semibold leading-[1.7] text-text-primary">
                The best thing we can do is make something bigger than ourselves, then step back and watch it belong to the world.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <p className="mt-[var(--space-sm)] text-[0.95rem] text-text-tertiary italic">
                That&apos;s why we exist.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CLOSING — Let's climb
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] py-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <div className="mx-auto max-w-[650px]">
            <ScrollReveal>
              <p className="text-[1rem] leading-[1.85] text-text-secondary">
                If you&apos;ve read this far, we hope you felt something. A small warmth. A little confidence. Maybe a smile at the chaos of two kids building something real in a country still figuring out what &ldquo;brand&rdquo; means.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="mt-[var(--space-md)] text-[1rem] leading-[1.85] text-text-secondary">
                We&apos;re still figuring things out too. We always will be.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <p className="mt-[var(--space-md)] text-[1rem] leading-[1.85] text-text-secondary">
                But your project — your brand, your idea, your mountain — is in the safest hands we know how to offer.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mt-[var(--space-xl)] font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1]">
                Let&apos;s climb<span className="text-accent">.</span>
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  )
}
