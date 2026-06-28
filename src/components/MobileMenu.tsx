'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useStartProject } from './start-project/StartProjectProvider'
import { useFormEmbed } from '@/lib/embed'

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/people', label: 'People' },
  { href: '/diary', label: 'Diary' },
  { href: '/contact', label: 'Contact' },
]

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  // Whether the header is in its scrolled/pill state. When scrolled, the menu
  // panel is geometrically identical to (and co-located with) the frosted pill,
  // so it EXPANDS out of the pill height (no fade) for a seamless morph; from the
  // top there's no pill, so it just unrolls from 0.
  scrolled?: boolean
  // Fired once the panel has FULLY exited/unmounted. Header uses this to reveal
  // the resting pill at the exact moment this panel is gone, so the two surfaces
  // never overlap (no blend, no double-darkening) during a scrolled close.
  onExitComplete?: () => void
}

export default function MobileMenu({ open, onClose, scrolled = false, onExitComplete }: MobileMenuProps) {
  const { open: openStartProject } = useStartProject()
  // On a vanity form subdomain, point links at the absolute canonical site so
  // they escape the form (relative paths get rewritten back to it).
  const { linkBase } = useFormEmbed()
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <>
          {/* Blurred overlay behind menu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[1000]"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
            onClick={onClose}
          />

          {/* Menu panel — frosted glass dropdown */}
          <motion.nav
            // Pure GEOMETRIC expansion — NO opacity fade (the fade read as a glitch
            // against the frosted pill). When scrolled, the panel starts at the pill
            // height (3.5rem) and, being visually identical and co-located with the
            // pill, simply grows downward — the pill appears to expand into the menu.
            // From the top there's no pill, so it unrolls from 0. The header's solid
            // logo + morphing hamburger ride above, so nothing needs to fade.
            // Close is the EXACT geometric REVERSE of open: the panel stays the one
            // solid 0.88 surface and simply shrinks back to the pill height (no bg
            // crossfade — that introduced a lightening dip that read as a glitch and
            // never matched the single-layer open). The separate header pill (z-999)
            // stays HIDDEN through the whole collapse and is only revealed once this
            // panel has fully unmounted (Header's onExitComplete), so there are never
            // two translucent layers blending at once. From the top there's no pill,
            // so we collapse to 0 and fade the panel out (kills the lingering border).
            initial={{ height: scrolled ? '3.5rem' : 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: scrolled ? '3.5rem' : 0, opacity: scrolled ? 1 : 0 }}
            transition={{
              height: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.3, ease: 'easeOut' },
            }}
            className="fixed left-[var(--gutter)] right-[var(--gutter)] top-4 z-[1001] overflow-clip rounded-[1.75rem]"
            style={{
              transformOrigin: 'top',
              backgroundColor: 'rgba(10, 10, 10, 0.88)',
              backdropFilter: 'blur(24px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
              // Longhand (not the `border` shorthand): framer-motion writes longhand
              // style props onto this element, and mixing shorthand + longhand makes
              // React warn about conflicting style updates on rerender.
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            {/* Spacer for the header zone. The logo and the hamburger↔X now live in
                the real <Header>, which is raised above this panel while open — so
                this panel renders no logo/X of its own (no duplicates, no crossfade).
                This empty row just reserves the same height so the nav starts below
                the floating header logo/X. */}
            <div className="h-[3.5rem]" aria-hidden />

            {/* Links */}
            <ul className="flex flex-col gap-1" style={{ paddingTop: 20, paddingLeft: 26, paddingRight: 26, paddingBottom: 24 }}>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.08 + i * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={`${linkBase}${link.href}`}
                    onClick={onClose}
                    className="block py-0.5 font-display text-[1.85rem] font-normal leading-[1.2] text-white/60 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}

              {/* Start a Project — opens the chat panel */}
              <motion.li
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 + navLinks.length * 0.045, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  onClick={() => { onClose(); openStartProject() }}
                  className="flex w-full items-center justify-between gap-3 py-0.5 text-left font-display text-[1.85rem] font-normal leading-[1.2] text-white transition-colors duration-200 hover:text-accent"
                >
                  Start a Project
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/35">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
              </motion.li>
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
