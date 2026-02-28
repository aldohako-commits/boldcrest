'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

interface Service {
  _id: string
  name: string
  slug: { current: string }
  category: string
  order: number
}

interface CategoryGroup {
  category: string
  services: Service[]
}

interface ServicesPageClientProps {
  categories: CategoryGroup[]
}

const descriptions: Record<string, string> = {
  'Brand Dev':
    'Visual identity, packaging, creative advertising, and brand strategy that makes you impossible to ignore.',
  'Still & Motion':
    'Photography, videography, animation, and motion graphics that tell your story with emotion and craft.',
  Communications:
    'Social media, digital marketing, PR, and content strategy that turns attention into action.',
}

export default function ServicesPageClient({
  categories,
}: ServicesPageClientProps) {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative px-[var(--gutter)] pt-40 pb-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.h1
            className="max-w-[800px] font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Meeting Challenges
            <br />
            Head-On<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            className="mt-[var(--space-md)] max-w-[500px] text-[clamp(1.1rem,1.8vw,1.3rem)] leading-[1.6] text-accent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Crafting exceptional solutions
          </motion.p>
        </div>
      </section>

      {/* Accordion */}
      <section className="px-[var(--gutter)] pb-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <ScrollReveal>
            <div className="border-t border-border">
              {categories.map((group, index) => {
                const isOpen = openIndex === index
                return (
                  <div key={group.category} className="border-b border-border">
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggle(index)}
                      className="group flex w-full cursor-pointer items-center justify-between py-[var(--space-lg)] text-left transition-colors duration-200"
                    >
                      <div>
                        <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-bold transition-colors duration-300 group-hover:text-accent">
                          {group.category}
                        </h2>
                        <p className="mt-1 max-w-[500px] text-[0.9rem] leading-[1.6] text-text-tertiary">
                          {descriptions[group.category]}
                        </p>
                      </div>

                      {/* + / × Icon */}
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-[0.4s] group-hover:border-accent"
                        style={{
                          transitionTimingFunction: 'var(--ease-out-expo)',
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          className="transition-transform duration-[0.4s]"
                          style={{
                            transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                            transitionTimingFunction: 'var(--ease-out-expo)',
                          }}
                        >
                          <path
                            d="M10 4v12M4 10h12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.3, ease: 'easeOut' },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-x-[var(--space-lg)] gap-y-[var(--space-md)] pb-[var(--space-xl)] sm:grid-cols-3 lg:grid-cols-4">
                            {group.services.length > 0 ? (
                              group.services.map((service) => (
                                <div
                                  key={service._id}
                                  className="flex items-center gap-3 rounded-[var(--radius-md)] bg-bg-card px-5 py-4 transition-colors duration-200 hover:bg-surface"
                                >
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                                  <span className="text-[0.9rem] font-medium text-text-secondary">
                                    {service.name}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="col-span-full text-[0.9rem] text-text-tertiary">
                                Services coming soon.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
