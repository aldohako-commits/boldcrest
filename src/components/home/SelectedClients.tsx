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

  // Pad to at least 16 for a full 4x4 grid
  const logos: Partner[] = []
  for (let i = 0; i < Math.max(16, displayPartners.length); i++) {
    logos.push({
      ...displayPartners[i % displayPartners.length],
      _id:
        displayPartners[i % displayPartners.length]._id +
        (i >= displayPartners.length ? `-dup-${i}` : ''),
    })
  }

  return (
    <section className="px-[var(--gutter)] pb-[var(--space-2xl)]">
      <div className="flex flex-col gap-[var(--space-lg)] md:flex-row md:gap-0">
        {/* Heading — pinned to the left on desktop */}
        <div className="md:w-[20%] md:shrink-0 md:pt-[var(--space-md)]">
          <ScrollReveal>
            <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Selected
              <br />
              Clients
            </h2>
          </ScrollReveal>
        </div>

        {/* 4×4 Grid — right side */}
        <div className="md:w-[80%]">
          <ScrollRevealStagger
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
            staggerDelay={0.03}
          >
            {logos.map((partner) => (
              <ScrollRevealItem key={partner._id}>
                <div className="flex items-center justify-center py-8 md:py-10">
                  <span className="font-display text-[clamp(0.8rem,1.1vw,1rem)] font-medium tracking-[-0.01em] text-text-secondary/50 transition-colors duration-[0.5s] hover:text-text-primary" style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}>
                    {partner.name}
                  </span>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealStagger>
        </div>
      </div>
    </section>
  )
}
