'use client'

import { useState, useActionState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { submitProjectForm } from './actions'
import { SubmitButton } from '@/components/MagneticButton'

const serviceOptions = [
  { label: 'Branding', value: 'Branding' },
  { label: 'TV - Commercials', value: 'TV - Commercials' },
  { label: 'Social Media Management', value: 'Social Media Management' },
  { label: 'Packaging', value: 'Packaging' },
  { label: 'Marketing Campaigns', value: 'Marketing Campaigns' },
  { label: 'Website', value: 'Website' },
  { label: 'Other', value: 'Other' },
]

const budgetOptions = [
  '< €5,000',
  '€5,000 – €15,000',
  '€15,000 – €50,000',
  '€50,000+',
]

const recentWork = [
  {
    name: "WECA's Evolution",
    slug: 'wecas-evolution',
    category: 'Branding',
  },
  {
    name: 'Tirana Home Store',
    slug: 'tirana-home-store',
    category: 'Social Media Management',
  },
]

export default function StartProjectClient() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    )
  }

  const [, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      formData.set('service', selectedServices.join(', '))
      const result = await submitProjectForm(formData)
      if (result.success) setSubmitted(true)
      return result
    },
    null,
  )

  return (
    <main>
      {/* ═══════════════════════════════════════════
          HERO — Start a New Project
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] px-[var(--gutter)] pt-40 pb-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.p
            className="mb-6 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Start A New Project
          </motion.p>

          <motion.h1
            className="max-w-[900px] font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[1.05]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Let&apos;s Work
            <br />
            Together<span className="text-[#004c95]">.</span>
          </motion.h1>

          <motion.p
            className="mt-[var(--space-lg)] max-w-[650px] text-[1.1rem] leading-[1.7] text-[#004c95]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            It doesn&apos;t matter how big your business is or weird your questions are, there&apos;re worth asking, and we will get back to you shortly.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FORM — Two-column layout
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] pb-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          {submitted ? (
            <motion.div
              className="flex min-h-[400px] flex-col items-center justify-center text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="font-display text-[2rem] font-bold">Message Sent</h3>
              <p className="mt-3 text-[1rem] text-text-secondary">
                We&apos;ll get back to you shortly.
              </p>
            </motion.div>
          ) : (
            <form action={formAction}>
              <div className="grid gap-[var(--space-2xl)] md:grid-cols-2">
                {/* ── Left Column: Contact Info ── */}
                <motion.div
                  className="flex flex-col gap-[var(--space-md)]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="border-b border-border pb-4">
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Full Name*"
                      className="w-full bg-transparent text-[1rem] text-white placeholder:text-text-tertiary outline-none"
                    />
                  </div>

                  <div className="border-b border-border pb-4">
                    <input
                      name="company"
                      type="text"
                      placeholder="Company*"
                      className="w-full bg-transparent text-[1rem] text-white placeholder:text-text-tertiary outline-none"
                    />
                  </div>

                  <div className="border-b border-border pb-4">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="Email*"
                      className="w-full bg-transparent text-[1rem] text-white placeholder:text-text-tertiary outline-none"
                    />
                  </div>

                  <div className="border-b border-border pb-4">
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Phone*"
                      className="w-full bg-transparent text-[1rem] text-white placeholder:text-text-tertiary outline-none"
                    />
                  </div>

                  <p className="mt-2 text-[0.8rem] text-text-tertiary">
                    By clicking Send you are agreeing to our Privacy Policy
                  </p>
                </motion.div>

                {/* ── Right Column: Services + Budget + Message ── */}
                <motion.div
                  className="flex flex-col gap-[var(--space-lg)]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div>
                    <p className="mb-4 text-[0.85rem] font-medium text-text-secondary">
                      I&apos;m looking for
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {serviceOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleService(opt.value)}
                          className={`rounded-[var(--radius-pill)] border px-4 py-2 text-[0.8rem] font-medium transition-all duration-200 ${
                            selectedServices.includes(opt.value)
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border text-text-secondary hover:border-text-secondary hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <select
                        name="budget"
                        defaultValue=""
                        className="w-full appearance-none border-b border-border bg-transparent pb-4 text-[1rem] text-white outline-none"
                      >
                        <option value="" disabled className="bg-bg">
                          Budget
                        </option>
                        {budgetOptions.map((b) => (
                          <option key={b} value={b} className="bg-bg">
                            {b}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="pointer-events-none absolute right-0 top-1 text-text-tertiary"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div className="border-b border-border pb-4">
                      <input
                        name="deadline"
                        type="text"
                        placeholder="Deadline"
                        className="w-full bg-transparent text-[1rem] text-white placeholder:text-text-tertiary outline-none"
                      />
                    </div>
                  </div>

                  <div className="border-b border-border pb-4">
                    <textarea
                      name="message"
                      required
                      rows={3}
                      placeholder="Message*"
                      className="w-full resize-none bg-transparent text-[1rem] text-white placeholder:text-text-tertiary outline-none"
                    />
                  </div>
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div
                className="mt-[var(--space-xl)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <SubmitButton
                  label="Submit"
                  pendingLabel="Sending..."
                  isPending={isPending}
                />
              </motion.div>
            </form>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NOT SURE YET — Recent Work
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] pb-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
              Not sure yet?
            </p>
            <h2 className="mb-[var(--space-xl)] font-display text-[clamp(1.5rem,3vw,2.5rem)] font-bold">
              Check some more work
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {recentWork.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-bg-card"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <h3 className="font-display text-[1.4rem] font-semibold transition-transform duration-500 group-hover:-translate-y-1">
                      {project.name}
                    </h3>
                    <span className="mt-3 inline-block rounded-[var(--radius-pill)] bg-white/10 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-text-secondary">
                      {project.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-[var(--space-lg)] text-center">
              <Link
                href="/work"
                className="group inline-flex items-center gap-2 text-[0.9rem] font-medium text-text-secondary transition-colors duration-300 hover:text-white"
              >
                Discover Our Work
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M4 10h12M12 6l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
