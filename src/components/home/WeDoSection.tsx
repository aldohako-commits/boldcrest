'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { InlineButton } from '@/components/MagneticButton'

export default function WeDoSection() {
  return (
    <section className="flex items-center justify-center px-[var(--gutter)] py-[var(--space-lg)] md:py-[var(--space-xl)]">
      <ScrollReveal>
        {/* Desktop — inline button */}
        <p className="hidden text-center font-display text-[clamp(2.8rem,8vw,8rem)] font-bold leading-[1.05] tracking-[-0.03em] md:block" style={{ color: 'var(--zone-fg)' }}>
          We do many{' '}
          <InlineButton href="/work" label="View All Work" className="!text-white" lineColor="#000000" />{' '}
          things very well.
        </p>

        {/* Mobile — text + full-width button below */}
        <div className="md:hidden">
          <p className="font-display text-[clamp(2.8rem,12vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em]" style={{ color: 'var(--zone-fg)' }}>
            We do many things very well.
          </p>
          <Link
            href="/work"
            // Half-width ghost pill — same outlined look as the "Meet the People"
            // button (transparent-on-dark fill, light text, faint border) instead of
            // the old solid white fill.
            className="mt-8 flex w-1/2 items-center justify-between rounded-full border px-6 py-5 text-[0.85rem] font-semibold uppercase tracking-[0.1em]"
            style={{ backgroundColor: 'var(--zone-bg, #0a0a0a)', color: 'var(--zone-contrast, #EDEDED)', borderColor: 'var(--zone-contrast-faint, rgba(237,237,237,0.3))' }}
          >
            View All Work
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  )
}
