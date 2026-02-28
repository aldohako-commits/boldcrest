'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  if (pathname?.startsWith('/studio')) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border bg-bg pb-[var(--space-lg)] pt-[var(--space-2xl)]">
      <div className="mx-auto max-w-[var(--max-width)] px-[var(--gutter)]">
        {/* Top 3-column */}
        <div className="grid grid-cols-1 gap-[var(--space-xl)] pb-[var(--space-2xl)] md:grid-cols-3">
          {/* Talk to Us */}
          <div>
            <h4 className="mb-[var(--space-md)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
              Talk to Us
            </h4>
            <a
              href="mailto:info@boldcrest.com"
              className="group mb-2 flex items-center gap-[0.4rem] text-[0.95rem] text-text-secondary transition-all duration-200 hover:gap-[0.6rem] hover:text-white"
            >
              <span className="text-[0.75rem]">&rarr;</span>
              info@boldcrest.com
            </a>
            <Link
              href="/contact"
              className="group flex items-center gap-[0.4rem] text-[0.95rem] text-text-secondary transition-all duration-200 hover:gap-[0.6rem] hover:text-white"
            >
              <span className="text-[0.75rem]">&rarr;</span>
              Start a Project
            </Link>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="mb-[var(--space-md)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
              Follow Us
            </h4>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-2 flex items-center gap-[0.4rem] text-[0.95rem] text-text-secondary transition-all duration-200 hover:gap-[0.6rem] hover:text-white"
              >
                <span className="text-[0.75rem]">&rarr;</span>
                {link.label}
              </a>
            ))}
          </div>

          {/* Navigate */}
          <div>
            <h4 className="mb-[var(--space-md)] text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
              Navigate
            </h4>
            {pageLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mb-2 block text-[0.95rem] text-text-secondary transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Big Text */}
        <div className="overflow-hidden border-t border-border pb-[var(--space-lg)] pt-[var(--space-xl)]">
          <h2 className="cursor-default font-display text-[clamp(3rem,10vw,8rem)] font-bold leading-none text-text-tertiary transition-colors duration-[0.8s] hover:text-text-secondary">
            Climbing Mountains Together.
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between border-t border-border pt-[var(--space-md)]">
          <span className="text-[0.8rem] text-text-tertiary">
            &copy; {new Date().getFullYear()} BoldCrest
          </span>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-[0.4rem] text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-text-secondary transition-colors duration-200 hover:text-white"
          >
            Back to top &uarr;
          </button>
        </div>
      </div>
    </footer>
  )
}
