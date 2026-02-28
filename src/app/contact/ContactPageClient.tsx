'use client'

import { useState, useActionState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'
import { submitContactForm } from './actions'

interface SocialLink {
  platform: string
  url: string
}

interface ContactPageClientProps {
  contactEmail?: string
  socialLinks?: SocialLink[]
}

const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  behance: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 11c1.38 0 2.5-1.12 2.5-2.5S8.88 6 7.5 6H3v5h4.5zM3 18h5c1.38 0 2.5-1.12 2.5-2.5S9.38 13 8 13H3v5zM14 6h6v1.5h-6V6zm3 12c1.66 0 3-1.34 3-3h-2c0 .55-.45 1-1 1s-1-.45-1-1h-2c0 1.66 1.34 3 3 3zm0-8c-1.66 0-3 1.34-3 3h2c0-.55.45-1 1-1s1 .45 1 1h2c0-1.66-1.34-3-3-3z" />
    </svg>
  ),
  vimeo: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7.42c-.09 1.95-1.45 4.62-4.08 8.01C15.2 19.14 12.87 21 10.97 21c-1.18 0-2.17-1.09-2.98-3.27-.54-1.98-1.09-3.97-1.63-5.95-.6-2.18-1.25-3.27-1.95-3.27-.15 0-.68.32-1.59.95L2 8.44c1-.88 1.98-1.76 2.95-2.65C6.2 4.64 7.22 4.04 7.95 4c1.4-.07 2.26.82 2.58 2.69.35 2.02.59 3.27.72 3.76.4 1.82.84 2.73 1.32 2.73.37 0 .93-.59 1.68-1.77.74-1.18 1.14-2.08 1.2-2.69.1-1.01-.29-1.52-1.2-1.52-.43 0-.87.1-1.32.3.87-2.87 2.55-4.26 5.01-4.18 1.83.06 2.69 1.24 2.58 3.54z" />
    </svg>
  ),
}

const serviceOptions = [
  'Brand Development',
  'Still & Motion',
  'Communications',
  'Multiple Services',
  'Not sure yet',
]

export default function ContactPageClient({
  contactEmail,
  socialLinks,
}: ContactPageClientProps) {
  const [submitted, setSubmitted] = useState(false)

  const [, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await submitContactForm(formData)
      if (result.success) setSubmitted(true)
      return result
    },
    null,
  )

  return (
    <main>
      {/* Hero */}
      <section className="relative px-[var(--gutter)] pt-40 pb-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.h1
            className="max-w-[600px] font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Let&apos;s Talk<span className="text-accent">.</span>
          </motion.h1>
        </div>
      </section>

      {/* Form + Contact Info */}
      <section className="px-[var(--gutter)] pb-[var(--space-3xl)]">
        <div className="mx-auto grid max-w-[var(--max-width)] gap-[var(--space-2xl)] md:grid-cols-[1fr_340px]">
          {/* Left — Form */}
          <ScrollReveal>
            {submitted ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[var(--radius-lg)] border border-border text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-display text-[1.5rem] font-bold">
                  Message Sent
                </h3>
                <p className="mt-2 text-[0.9rem] text-text-secondary">
                  We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-[var(--space-md)]">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-tertiary"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full rounded-[var(--radius-md)] border border-border bg-bg-card px-5 py-4 text-[0.95rem] text-white placeholder:text-text-tertiary outline-none transition-border-color duration-200 focus:border-accent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-tertiary"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="w-full rounded-[var(--radius-md)] border border-border bg-bg-card px-5 py-4 text-[0.95rem] text-white placeholder:text-text-tertiary outline-none transition-border-color duration-200 focus:border-accent"
                  />
                </div>

                {/* Service Select */}
                <div>
                  <label
                    htmlFor="service"
                    className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-tertiary"
                  >
                    Service
                  </label>
                  <div className="relative">
                    <select
                      id="service"
                      name="service"
                      required
                      defaultValue=""
                      className="w-full appearance-none rounded-[var(--radius-md)] border border-border bg-bg-card px-5 py-4 pr-12 text-[0.95rem] text-white outline-none transition-border-color duration-200 focus:border-accent"
                    >
                      <option value="" disabled className="text-text-tertiary">
                        Select a service
                      </option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-tertiary"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your project..."
                    className="w-full resize-none rounded-[var(--radius-md)] border border-border bg-bg-card px-5 py-4 text-[0.95rem] text-white placeholder:text-text-tertiary outline-none transition-border-color duration-200 focus:border-accent"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="group relative mt-2 w-full overflow-hidden rounded-[var(--radius-md)] bg-accent px-8 py-4 font-display text-[0.9rem] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:self-start"
                >
                  {isPending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </ScrollReveal>

          {/* Right — Contact Info */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col gap-[var(--space-xl)]">
              {/* Email */}
              <div>
                <h3 className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
                  Email Us
                </h3>
                <a
                  href={`mailto:${contactEmail || 'hello@boldcrest.com'}`}
                  className="text-[1rem] text-white transition-colors duration-200 hover:text-accent"
                >
                  {contactEmail || 'hello@boldcrest.com'}
                </a>
              </div>

              {/* Request a Quote */}
              <div>
                <h3 className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
                  Quick Start
                </h3>
                <a
                  href={`mailto:${contactEmail || 'hello@boldcrest.com'}?subject=Quote%20Request`}
                  className="inline-flex items-center gap-2 text-[1rem] text-accent transition-colors duration-200 hover:text-accent-hover"
                >
                  Request a Quote
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transition-transform duration-200"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* Social Links */}
              {socialLinks && socialLinks.length > 0 && (
                <div>
                  <h3 className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
                    Follow Us
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-secondary transition-all duration-300 hover:border-accent hover:text-accent"
                        aria-label={link.platform}
                      >
                        {socialIcons[link.platform.toLowerCase()] ?? (
                          <span className="text-[0.65rem] font-semibold uppercase">
                            {link.platform.slice(0, 2)}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
