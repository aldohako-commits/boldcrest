'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// Stable anchor id for a capability, e.g. "Logo Design" → "logo-design".
// Strips accents (Albanian ë/ç etc.) so ids stay ascii and URL-safe.
function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface Outcome {
  title: string
  description: string
}

interface ServiceItem {
  name: string
  description: string
  href?: string
}

interface OutcomesServicesProps {
  outcomesLabel?: string
  outcomesHeading: string
  outcomes: Outcome[]
  servicesLabel?: string
  servicesHeading: string
  services: ServiceItem[]
  accentColor?: string
}

export default function OutcomesServices({
  outcomesLabel = 'Outcomes',
  outcomesHeading,
  outcomes,
  servicesLabel = 'Services',
  servicesHeading,
  services,
  accentColor = '#DA291C',
}: OutcomesServicesProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // On mount, if the URL points at a capability (#logo-design), open it and
  // scroll it into view. Lenis owns scrolling and intercepts window.scrollTo,
  // so use its imperative API when present; below 768px and under
  // prefers-reduced-motion Lenis is off, so fall back to native scrollIntoView.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''))
    if (!hash) return

    const index = services.findIndex((s) => slugify(s.name) === hash)
    if (index === -1) return

    setOpenIndex(index)

    const scrollToItem = () => {
      const el = document.getElementById(hash)
      if (!el) return
      const lenis = (window as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis
      if (lenis) {
        const y = el.getBoundingClientRect().top + window.scrollY
        lenis.scrollTo(y, { immediate: true })
      } else {
        el.scrollIntoView({ block: 'start' })
      }
    }

    // Lenis initialises a frame or two after mount, and the section's content
    // settles slightly later; re-assert across a few frames so the target is
    // reachable regardless of which lands first.
    const raf = requestAnimationFrame(scrollToItem)
    const t1 = setTimeout(scrollToItem, 120)
    const t2 = setTimeout(scrollToItem, 300)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section ref={ref} className="px-[var(--gutter)] pt-0 pb-[var(--space-lg)]">
      <div className="mx-auto grid max-w-[var(--max-width)] gap-10 md:grid-cols-2 md:gap-16">
        {/* LEFT — Outcomes */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
            {outcomesLabel}
          </p>
          <h2 className="mb-[var(--space-lg)] font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em]">
            {outcomesHeading}
          </h2>

          <div className="flex flex-col gap-6">
            {outcomes.map((outcome, i) => (
              <motion.div
                key={outcome.title}
                className="border-t border-border/40 pt-5"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.2 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <h3 className="mb-3 font-display text-[clamp(1.05rem,1.6vw,1.35rem)] font-bold leading-[1.15] tracking-[-0.01em] text-text-primary">
                  {outcome.title}
                </h3>
                <p className="text-[0.82rem] leading-[1.7] text-text-secondary">
                  {outcome.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — Services accordion */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
            {servicesLabel}
          </p>
          <h2 className="mb-[var(--space-lg)] font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em]">
            {servicesHeading}
          </h2>

          <div className="flex flex-col">
            {services.map((service, i) => {
              const isOpen = openIndex === i
              return (
                <div
                  key={service.name}
                  id={slugify(service.name)}
                  className="scroll-mt-24 border-t border-border/40 last:border-b"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-4 py-4 text-left"
                  >
                    <h3
                      className="font-display text-[clamp(1.05rem,1.6vw,1.35rem)] font-bold leading-[1.15] tracking-[-0.01em] transition-colors duration-300"
                      style={{ color: isOpen ? accentColor : undefined }}
                    >
                      {service.name}
                    </h3>
                    {/* plus → × toggle */}
                    <span className="relative h-4 w-4 shrink-0">
                      <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 bg-text-tertiary transition-colors duration-300 group-hover:bg-white" />
                      <span
                        className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 bg-text-tertiary transition-all duration-300 group-hover:bg-white"
                        style={{ transform: `translateY(-50%) rotate(${isOpen ? 0 : 90}deg)` }}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-[0.82rem] leading-[1.7] text-text-secondary">
                          {service.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
