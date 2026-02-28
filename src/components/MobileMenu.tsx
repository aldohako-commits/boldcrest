'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/people', label: 'People' },
  { href: '/contact', label: 'Contact' },
]

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8 bg-bg"
        >
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="font-display text-[clamp(2rem,8vw,4rem)] font-bold text-text-secondary transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.5,
              delay: 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Link
              href="/contact"
              onClick={onClose}
              className="mt-8 inline-flex rounded-[var(--radius-pill)] bg-accent px-8 py-4 text-[1rem] font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-accent-hover"
            >
              Start a Project
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
