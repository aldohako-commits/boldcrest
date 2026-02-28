'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const socialLinks = [
  { label: 'Instagram', href: '#' },
  { label: 'Behance', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'Vimeo', href: '#' },
]

const pageLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'People', href: '/people' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  const pathname = usePathname()
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    if (hasRevealed) return
    let rafId: number
    const check = () => {
      const scrollBottom = window.scrollY + window.innerHeight
      const pageHeight = document.body.scrollHeight
      if (pageHeight - scrollBottom < 300) {
        setHasRevealed(true)
        return
      }
      rafId = requestAnimationFrame(check)
    }
    rafId = requestAnimationFrame(check)
    return () => cancelAnimationFrame(rafId)
  }, [hasRevealed])

  if (pathname?.startsWith('/studio')) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Spacer so the sticky footer has room to reveal */}
      <div className="h-screen" />

      <footer className="sticky bottom-0 z-0 flex min-h-screen flex-col bg-accent">
        {/* Top section with links */}
        <div className="mx-auto w-full max-w-[var(--max-width)] px-[var(--gutter)] pt-[var(--space-2xl)]">
          <div className="grid grid-cols-1 gap-[var(--space-xl)] pb-[var(--space-2xl)] md:grid-cols-3">
            {/* Talk to Us */}
            <div>
              <h4 className="mb-[var(--space-md)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/40">
                Talk to Us
              </h4>
              <a
                href="mailto:info@boldcrest.com"
                className="group mb-2 flex items-center gap-[0.4rem] text-[0.95rem] text-white/70 transition-all duration-200 hover:gap-[0.6rem] hover:text-white"
              >
                <span className="text-[0.75rem]">&rarr;</span>
                info@boldcrest.com
              </a>
              <Link
                href="/contact"
                className="group flex items-center gap-[0.4rem] text-[0.95rem] text-white/70 transition-all duration-200 hover:gap-[0.6rem] hover:text-white"
              >
                <span className="text-[0.75rem]">&rarr;</span>
                Start a Project
              </Link>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="mb-[var(--space-md)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/40">
                Follow Us
              </h4>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mb-2 flex items-center gap-[0.4rem] text-[0.95rem] text-white/70 transition-all duration-200 hover:gap-[0.6rem] hover:text-white"
                >
                  <span className="text-[0.75rem]">&rarr;</span>
                  {link.label}
                </a>
              ))}
            </div>

            {/* Navigate */}
            <div>
              <h4 className="mb-[var(--space-md)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/40">
                Navigate
              </h4>
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mb-2 block text-[0.95rem] text-white/70 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Big Text — fills remaining space */}
        <div className="mt-auto flex items-end overflow-hidden px-[var(--gutter)] pb-[var(--space-lg)]">
          <div className="mx-auto w-full max-w-[var(--max-width)]">
            <motion.h2
              initial={{ scaleY: 4, scaleX: 0.5, opacity: 0 }}
              animate={
                hasRevealed
                  ? { scaleY: 1, scaleX: 1, opacity: 1 }
                  : { scaleY: 4, scaleX: 0.5, opacity: 0 }
              }
              transition={{
                scaleY: {
                  type: 'spring',
                  stiffness: 120,
                  damping: 12,
                  mass: 1,
                },
                scaleX: {
                  type: 'spring',
                  stiffness: 120,
                  damping: 12,
                  mass: 1,
                },
                opacity: { duration: 0.3 },
              }}
              style={{ transformOrigin: 'center bottom' }}
              className="cursor-default whitespace-nowrap font-display text-[clamp(2rem,5.5vw,5.5rem)] font-bold leading-none text-white"
            >
              Climbing Mountains Together.
            </motion.h2>

            {/* Bottom Bar */}
            <div className="mt-[var(--space-md)] flex items-center justify-between border-t border-white/20 pt-[var(--space-md)]">
              <span className="text-[0.8rem] text-white/40">
                &copy; {new Date().getFullYear()} BoldCrest
              </span>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-[0.4rem] text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white/70 transition-colors duration-200 hover:text-white"
              >
                Back to top &uarr;
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
