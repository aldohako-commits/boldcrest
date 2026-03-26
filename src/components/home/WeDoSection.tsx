'use client'

import ScrollReveal from '@/components/ScrollReveal'
import { InlineButton } from '@/components/MagneticButton'

export default function WeDoSection() {
  return (
    <section className="flex items-center justify-center px-[var(--gutter)] py-[var(--space-xl)]">
      <ScrollReveal>
        <p className="text-center font-display text-[clamp(2.8rem,8vw,8rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#0a0a0a]">
          We do many{' '}
          <InlineButton href="/work" label="View All Work" className="!text-white" />{' '}
          things very well.
        </p>
      </ScrollReveal>
    </section>
  )
}
