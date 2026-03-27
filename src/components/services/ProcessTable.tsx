'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Step {
  number: string
  title: string
  description: string
}

interface ProcessTableProps {
  label?: string
  heading: string
  intro?: string
  steps: Step[]
}

export default function ProcessTable({
  label = 'Process',
  heading,
  intro,
  steps,
}: ProcessTableProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="px-[var(--gutter)] py-[var(--space-3xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        <motion.p
          className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {label}
        </motion.p>

        <motion.h2
          className="mb-4 max-w-[700px] font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {heading}
        </motion.h2>

        {intro && (
          <motion.p
            className="mb-[var(--space-xl)] max-w-[600px] text-[0.95rem] leading-[1.7] text-text-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {intro}
          </motion.p>
        )}

        <div className="mt-[var(--space-xl)]">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="group grid grid-cols-[60px_1fr] gap-6 border-t border-border/40 py-8 last:border-b md:grid-cols-[80px_200px_1fr]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="font-display text-[0.75rem] font-semibold text-text-tertiary">
                {step.number}
              </span>
              <h3 className="text-[0.95rem] font-semibold text-text-primary md:col-span-1">
                {step.title}
              </h3>
              <p className="col-span-2 text-[0.85rem] leading-[1.7] text-text-secondary md:col-span-1">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
