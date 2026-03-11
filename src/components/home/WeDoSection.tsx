'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

export default function WeDoSection() {
  return (
    <section className="px-[var(--gutter)] py-[var(--space-2xl)]">
      <ScrollReveal>
        <p className="font-display text-[clamp(2.8rem,8vw,8rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          We do many{' '}
          <Link
            href="/work"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-[var(--radius-pill)] border border-border-hover px-[1em] py-[0.15em] align-middle text-[0.35em] font-semibold uppercase tracking-[0.15em] text-text-secondary transition-all duration-[0.5s] hover:border-accent hover:text-white"
            style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
          >
            <span
              className="absolute inset-0 origin-bottom scale-y-0 rounded-[inherit] bg-accent transition-transform duration-[0.5s] group-hover:origin-top group-hover:scale-y-100"
              style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
            />
            <span className="relative z-10 inline-flex overflow-hidden" style={{ height: '1.2em' }}>
              <span
                className="flex flex-col transition-transform duration-[0.5s] group-hover:-translate-y-1/2"
                style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
              >
                <span className="leading-[1.2]">View All Work</span>
                <span className="leading-[1.2]">View All Work</span>
              </span>
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="relative z-10 transition-transform duration-[0.5s] group-hover:translate-x-1"
              style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>{' '}
          things very well.
        </p>
      </ScrollReveal>
    </section>
  )
}
