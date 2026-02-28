'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import MobileMenu from './MobileMenu'

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/people', label: 'People' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isStudio = pathname?.startsWith('/studio')

  useEffect(() => {
    if (isStudio) return
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isStudio])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (isStudio) return null

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[1000] transition-[padding] duration-[0.8s]"
        style={{
          padding: scrolled
            ? '0.75rem var(--gutter)'
            : '1.5rem var(--gutter)',
          transitionTimingFunction: 'var(--ease-out-expo)',
        }}
      >
        <div
          className="mx-auto flex max-w-[var(--max-width)] items-center justify-between transition-all duration-[0.8s]"
          style={{
            padding: scrolled ? '0.6rem 1.5rem' : '0.75rem 1rem',
            borderRadius: scrolled ? 'var(--radius-pill)' : '0',
            background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
            WebkitBackdropFilter: scrolled
              ? 'blur(20px) saturate(1.5)'
              : 'none',
            border: scrolled
              ? '1px solid var(--border)'
              : '1px solid transparent',
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
            transitionTimingFunction: 'var(--ease-out-expo)',
          }}
        >
          {/* Logo */}
          <Link href="/" className="z-10 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-white transition-transform duration-[0.4s] hover:rotate-[-5deg] hover:scale-105" style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 8.5V15.5L12 22L22 15.5V8.5L12 2Z"
                  fill="#0a0a0a"
                />
                <path
                  d="M8 12L10.5 14.5L16 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-8">
                {i > 0 && (
                  <span className="select-none text-[0.75rem] text-text-tertiary">
                    /
                  </span>
                )}
                <Link
                  href={link.href}
                  className={`group relative text-[0.8rem] font-medium uppercase tracking-[0.12em] transition-colors duration-[0.2s] ${
                    pathname === link.href
                      ? 'text-accent'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-[1.5px] bg-accent transition-[width] duration-[0.4s]"
                    style={{
                      width:
                        pathname === link.href ? '100%' : '0%',
                      transitionTimingFunction: 'var(--ease-out-expo)',
                    }}
                  />
                  <span
                    className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-accent transition-[width] duration-[0.4s] group-hover:w-full"
                    style={{
                      transitionTimingFunction: 'var(--ease-out-expo)',
                      display: pathname === link.href ? 'none' : 'block',
                    }}
                  />
                </Link>
              </span>
            ))}
          </nav>

          {/* CTA Button */}
          <Link
            href="/contact"
            className="group relative hidden overflow-hidden rounded-[var(--radius-pill)] border border-border-hover px-6 py-[0.7rem] text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-all duration-[0.4s] hover:border-accent hover:text-white md:inline-flex"
            style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
          >
            <span
              className="absolute inset-0 origin-right scale-x-0 rounded-[inherit] bg-accent transition-transform duration-[0.4s] group-hover:origin-left group-hover:scale-x-100"
              style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
            />
            <span className="relative z-10">Start a Project</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="z-10 flex flex-col gap-[5px] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="h-[2px] w-7 rounded-[2px] bg-white transition-all duration-[0.4s]"
              style={{
                transform: mobileOpen
                  ? 'rotate(45deg) translateY(3.5px)'
                  : 'none',
                transitionTimingFunction: 'var(--ease-out-expo)',
              }}
            />
            <span
              className="h-[2px] rounded-[2px] bg-white transition-all duration-[0.4s]"
              style={{
                width: mobileOpen ? '28px' : '60%',
                marginLeft: mobileOpen ? '0' : 'auto',
                transform: mobileOpen
                  ? 'rotate(-45deg) translateY(-3.5px)'
                  : 'none',
                transitionTimingFunction: 'var(--ease-out-expo)',
              }}
            />
          </button>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
