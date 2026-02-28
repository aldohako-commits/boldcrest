'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

const serviceCards = [
  {
    number: '01',
    title: 'Brand Dev',
    description:
      'Visual identity, packaging, creative advertising, and brand strategy that makes you impossible to ignore.',
  },
  {
    number: '02',
    title: 'Still & Motion',
    description:
      'Photography, videography, animation, and motion graphics that tell your story with emotion and craft.',
  },
  {
    number: '03',
    title: 'Communications',
    description:
      'Social media, digital marketing, PR, and content strategy that turns attention into action.',
  },
]

export default function ServicesPreview() {
  return (
    <section className="px-[var(--gutter)] py-[var(--space-3xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-[var(--space-xl)] flex items-center justify-between">
            <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
              What We Do
            </h2>
            <Link
              href="/services"
              className="group flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-secondary transition-all duration-200 hover:gap-3 hover:text-white"
            >
              Explore All Services
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-[0.4s] group-hover:translate-x-1"
                style={{
                  transitionTimingFunction: 'var(--ease-out-expo)',
                }}
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
          </div>
        </ScrollReveal>

        {/* Services Grid */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {serviceCards.map((card) => (
              <Link
                key={card.number}
                href="/services"
                className="group relative cursor-pointer overflow-hidden border-b border-border px-0 py-[var(--space-lg)] transition-colors duration-[0.4s] hover:bg-bg-card md:border-r md:border-b-0 md:px-[var(--space-lg)] md:py-[var(--space-xl)] md:last:border-r-0"
              >
                {/* Number */}
                <div className="mb-[var(--space-md)] font-display text-[0.7rem] tracking-[0.15em] text-text-tertiary">
                  {card.number}
                </div>

                {/* Title */}
                <h3 className="mb-[var(--space-sm)] font-display text-[clamp(1.5rem,2.5vw,2.2rem)] font-semibold transition-colors duration-200 group-hover:text-accent">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-[0.9rem] leading-[1.7] text-text-secondary">
                  {card.description}
                </p>

                {/* Arrow */}
                <div
                  className="mt-[var(--space-lg)] flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-[0.4s] group-hover:rotate-[-45deg] group-hover:border-accent group-hover:bg-accent"
                  style={{
                    transitionTimingFunction: 'var(--ease-out-expo)',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
