'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
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

const processSteps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We immerse ourselves in your world — your brand, your audience, your ambitions. Every great project starts with listening.',
  },
  {
    number: '02',
    title: 'Strategize',
    description:
      'Insights become direction. We map out a clear plan that aligns creativity with your business objectives.',
  },
  {
    number: '03',
    title: 'Create',
    description:
      'Ideas take shape. Our team crafts compelling visuals, stories, and experiences that resonate and stand out.',
  },
  {
    number: '04',
    title: 'Deliver',
    description:
      'We launch, measure, and refine. Every detail is polished to ensure maximum impact and lasting results.',
  },
]

export default function PeoplePageClient({ members }: PeoplePageClientProps) {
  return (
    <main>
      {/* Hero */}
      <section className="relative px-[var(--gutter)] pt-40 pb-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.h1
            className="max-w-[800px] font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.1] text-text-secondary"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            It&apos;s Not About Us,
            <br />
            It&apos;s About You<span className="text-accent">.</span>
          </motion.h1>
        </div>
      </section>

      {/* Values */}
      <section className="bg-bg-elevated px-[var(--gutter)] py-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <ScrollReveal>
            <div className="grid gap-[var(--space-xl)] md:grid-cols-2">
              <h2 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-bold leading-[1.15]">
                Driven by craft,
                <br />
                guided by purpose<span className="text-accent">.</span>
              </h2>
              <p className="text-[1rem] leading-[1.8] text-text-secondary">
                We believe in the power of bold ideas and meticulous execution.
                Every project we take on is an opportunity to push boundaries,
                challenge conventions, and create work that truly matters. Our
                team brings together diverse perspectives united by a shared
                obsession with quality and impact.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Process */}
      <section className="px-[var(--gutter)] py-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <ScrollReveal>
            <h2 className="mb-[var(--space-xl)] text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Our Process
            </h2>
          </ScrollReveal>

          <div className="border-t border-border">
            {processSteps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.08}>
                <div className="grid grid-cols-[auto_1fr] gap-x-[var(--space-lg)] gap-y-2 border-b border-border py-[var(--space-lg)] md:grid-cols-[60px_200px_1fr]">
                  {/* Number */}
                  <span className="font-display text-[0.8rem] tracking-[0.15em] text-text-tertiary">
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="font-display text-[1.3rem] font-semibold">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="col-span-full text-[0.9rem] leading-[1.7] text-text-secondary md:col-span-1">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="px-[var(--gutter)] pb-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <ScrollReveal>
            <h2 className="mb-[var(--space-xl)] text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
              The Team
            </h2>
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
    </main>
  )
}
