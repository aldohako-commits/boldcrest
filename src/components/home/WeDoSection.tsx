'use client'

import ScrollReveal from '@/components/ScrollReveal'
import { InlineButton } from '@/components/MagneticButton'

export default function WeDoSection() {
  return (
    <section className="px-[var(--gutter)] py-[var(--space-2xl)]">
      <ScrollReveal>
        <p className="font-display text-[clamp(2.8rem,8vw,8rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          We do many{' '}
          <InlineButton href="/work" label="View All Work" />{' '}
          things very well.
        </p>
      </ScrollReveal>
    </section>
  )
}
