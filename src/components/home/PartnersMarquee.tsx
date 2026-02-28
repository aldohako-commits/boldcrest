'use client'

import ScrollReveal from '@/components/ScrollReveal'

interface Partner {
  _id: string
  name: string
}

interface PartnersMarqueeProps {
  partners: Partner[]
}

export default function PartnersMarquee({ partners }: PartnersMarqueeProps) {
  // Fallback partners if none from Sanity yet
  const displayPartners =
    partners.length > 0
      ? partners
      : [
          { _id: '1', name: 'Vodafone' },
          { _id: '2', name: 'Raiffeisen Bank' },
          { _id: '3', name: 'Tirana Bank' },
          { _id: '4', name: 'RedBull' },
          { _id: '5', name: 'Credins Bank' },
          { _id: '6', name: 'KESH' },
          { _id: '7', name: 'Passerelle' },
          { _id: '8', name: 'Altus' },
        ]

  return (
    <ScrollReveal as="section">
      <div className="overflow-hidden border-t border-b border-border py-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)] px-[var(--gutter)]">
          <p className="mb-[var(--space-lg)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
            Our Partners in Crime
          </p>
        </div>
        <div className="overflow-hidden">
          <div
            className="flex gap-16"
            style={{ animation: 'marquee 30s linear infinite' }}
          >
            {/* Original + duplicate for seamless loop */}
            {[...displayPartners, ...displayPartners].map((partner, i) => (
              <span
                key={`${partner._id}-${i}`}
                className="shrink-0 cursor-default font-display text-[1.4rem] font-medium whitespace-nowrap text-text-tertiary transition-colors duration-200 hover:text-text-primary"
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}
