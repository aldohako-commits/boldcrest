'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { InlineButton } from '@/components/MagneticButton'

export default function WeDoSection() {
  return (
    <section className="flex items-center justify-center px-[var(--gutter)] py-[var(--space-xl)]">
      <ScrollReveal>
        {/* Desktop — inline button */}
        <p className="hidden text-center font-display text-[clamp(2.8rem,8vw,8rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#0a0a0a] md:block">
          We do many{' '}
          <InlineButton href="/work" label="View All Work" className="!text-white" />{' '}
          things very well.
        </p>

        {/* Mobile — text + big button below */}
        <div className="md:hidden">
          <p className="text-center font-display text-[clamp(2.8rem,12vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#0a0a0a]">
            We do many things very well.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/work"
              className="inline-flex items-center gap-3 rounded-full bg-[#0a0a0a] px-8 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white transition-opacity duration-300 hover:opacity-80"
            >
              View All Work
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
