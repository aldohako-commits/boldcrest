'use client'

import ScrollReveal from '@/components/ScrollReveal'
import {
  ScrollRevealStagger,
  ScrollRevealItem,
} from '@/components/ScrollReveal'

interface Partner {
  _id: string
  name: string
}

interface SelectedClientsProps {
  partners: Partner[]
}

export default function SelectedClients({ partners }: SelectedClientsProps) {
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

  // Pad to at least 16 for a full grid
  const logos: Partner[] = []
  for (let i = 0; i < Math.max(16, displayPartners.length); i++) {
    logos.push({
      ...displayPartners[i % displayPartners.length],
      _id: displayPartners[i % displayPartners.length]._id + (i >= displayPartners.length ? `-dup-${i}` : ''),
    })
  }

  return (
    <section className="px-[var(--gutter)] pb-[var(--space-2xl)]">
      <div className="w-full">
        <ScrollReveal>
          <div className="mb-[var(--space-xl)]">
            <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Selected Clients
            </h2>
          </div>
        </ScrollReveal>

        <ScrollRevealStagger
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          staggerDelay={0.04}
        >
          {logos.map((partner) => (
            <ScrollRevealItem key={partner._id}>
              <div className="flex items-center justify-center border-[0.5px] border-border px-6 py-10 md:px-10 md:py-14">
                <span className="font-display text-[clamp(0.9rem,1.4vw,1.2rem)] font-semibold tracking-[0.02em] text-text-secondary/70 transition-colors duration-300 hover:text-text-primary">
                  {partner.name}
                </span>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  )
}
