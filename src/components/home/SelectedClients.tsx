'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

interface Partner {
  _id: string
  name: string
}

interface SelectedClientsProps {
  partners: Partner[]
}

export default function SelectedClients({ partners }: SelectedClientsProps) {
  const [hovered, setHovered] = useState<string | null>(null)

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

  // Split into two rows for opposite-direction marquees
  const mid = Math.ceil(displayPartners.length / 2)
  const row1 = displayPartners.slice(0, mid)
  const row2 = displayPartners.slice(mid)

  // Repeat each row enough times for seamless loop
  const repeat = (arr: Partner[], times: number) => {
    const result: Partner[] = []
    for (let t = 0; t < times; t++) {
      arr.forEach((p, i) => {
        result.push({ ...p, _id: `${p._id}-r${t}-${i}` })
      })
    }
    return result
  }

  const row1Items = repeat(row1, 6)
  const row2Items = repeat(row2, 6)

  return (
    <section className="pb-[var(--space-2xl)] overflow-hidden">
      {/* Section label */}
      <div className="px-[var(--gutter)] mb-[var(--space-lg)]">
        <ScrollReveal>
          <div className="mb-4 h-px bg-[#0a0a0a]/10" />
          <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#0a0a0a]/50">
            Trusted by the ambitious<span className="text-accent">.</span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Row 1 — scrolls left */}
      <div
        className="relative mb-2"
        onMouseLeave={() => setHovered(null)}
      >
        <div className="flex animate-[marquee_35s_linear_infinite]">
          {row1Items.map((partner) => (
            <span
              key={partner._id}
              className="shrink-0 cursor-default px-6 py-4 font-display text-[clamp(1.2rem,2.5vw,2rem)] font-semibold uppercase tracking-[0.08em] transition-all duration-300"
              style={{
                opacity: hovered
                  ? hovered === partner.name
                    ? 1
                    : 0.2
                  : 0.45,
                transform: hovered === partner.name ? 'scale(1.1)' : 'scale(1)',
                color: '#0a0a0a',
              }}
              onMouseEnter={() => setHovered(partner.name)}
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (reverse) */}
      <div
        className="relative"
        onMouseLeave={() => setHovered(null)}
      >
        <div className="flex animate-[marquee-reverse_40s_linear_infinite]">
          {row2Items.map((partner) => (
            <span
              key={partner._id}
              className="shrink-0 cursor-default px-6 py-4 font-display text-[clamp(1.2rem,2.5vw,2rem)] font-semibold uppercase tracking-[0.08em] transition-all duration-300"
              style={{
                opacity: hovered
                  ? hovered === partner.name
                    ? 1
                    : 0.2
                  : 0.45,
                transform: hovered === partner.name ? 'scale(1.1)' : 'scale(1)',
                color: '#0a0a0a',
              }}
              onMouseEnter={() => setHovered(partner.name)}
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
