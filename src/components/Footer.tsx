'use client'

import { useRef, useEffect } from 'react'
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
  const spacerRef = useRef<HTMLDivElement>(null)
  const h2Ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    let currentY = 100
    let currentScaleY = 1
    let targetY = 100
    let targetScaleY = 1
    let velocityY = 0
    let velocityScale = 0

    const tension = 500
    const friction = 30
    const mass = 1
    const dt = 1 / 60

    const tick = () => {
      const spacer = spacerRef.current
      const h2 = h2Ref.current

      if (spacer && h2) {
        const rect = spacer.getBoundingClientRect()
        const vh = window.innerHeight

        if (rect.top >= vh) {
          targetY = 100
          targetScaleY = 1
          currentY = 100
          currentScaleY = 1
          velocityY = 0
          velocityScale = 0
        } else if (rect.bottom <= 0) {
          targetY = 0
          targetScaleY = 1
        } else {
          const progress = Math.max(0, Math.min(1, 1 - rect.top / vh))
          targetY = (1 - progress) * 100
          targetScaleY = 1 + Math.sin(progress * Math.PI) * 0.5
        }

        const springForceY = -tension * (currentY - targetY)
        const dampingForceY = -friction * velocityY
        const accelY = (springForceY + dampingForceY) / mass
        velocityY += accelY * dt
        currentY += velocityY * dt

        const springForceS = -tension * (currentScaleY - targetScaleY)
        const dampingForceS = -friction * velocityScale
        const accelS = (springForceS + dampingForceS) / mass
        velocityScale += accelS * dt
        currentScaleY += velocityScale * dt

        h2.style.transform = `translateY(${currentY}%) scaleY(${currentScaleY})`
      }
    }

    let rafId: number
    const loop = () => {
      tick()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(rafId)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (pathname?.startsWith('/studio')) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div ref={spacerRef} className="h-screen" />

      <footer
        className="sticky bottom-0 z-0 flex min-h-screen flex-col"
        style={{ background: '#EDEDED' }}
      >
        {/* Top section with links */}
        <div className="mx-auto w-full max-w-[var(--max-width)] px-[var(--gutter)] pt-[var(--space-2xl)]">
          <div className="grid grid-cols-1 gap-[var(--space-xl)] pb-[var(--space-2xl)] md:grid-cols-3">
            {/* Talk to Us */}
            <div>
              <h4
                className="mb-[var(--space-md)] text-[0.7rem] font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'rgba(0,0,0,0.35)' }}
              >
                Talk to Us
              </h4>
              <a
                href="mailto:info@boldcrest.com"
                className="group mb-2 flex items-center gap-[0.4rem] text-[0.95rem] transition-all duration-[0.5s]"
                style={{
                  color: 'rgba(0,0,0,0.6)',
                  transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.6)' }}
              >
                <span className="text-[0.75rem]">&rarr;</span>
                info@boldcrest.com
              </a>
              <Link
                href="/contact"
                className="group flex items-center gap-[0.4rem] text-[0.95rem] transition-all duration-[0.5s]"
                style={{
                  color: 'rgba(0,0,0,0.6)',
                  transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.6)' }}
              >
                <span className="text-[0.75rem]">&rarr;</span>
                Start a Project
              </Link>
            </div>

            {/* Follow Us */}
            <div>
              <h4
                className="mb-[var(--space-md)] text-[0.7rem] font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'rgba(0,0,0,0.35)' }}
              >
                Follow Us
              </h4>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mb-2 flex items-center gap-[0.4rem] text-[0.95rem] transition-all duration-[0.5s]"
                  style={{
                    color: 'rgba(0,0,0,0.6)',
                    transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.6)' }}
                >
                  <span className="text-[0.75rem]">&rarr;</span>
                  {link.label}
                </a>
              ))}
            </div>

            {/* Navigate */}
            <div>
              <h4
                className="mb-[var(--space-md)] text-[0.7rem] font-semibold uppercase tracking-[0.2em]"
                style={{ color: 'rgba(0,0,0,0.35)' }}
              >
                Navigate
              </h4>
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="mb-2 block text-[0.95rem] transition-colors duration-[0.5s]"
                  style={{
                    color: 'rgba(0,0,0,0.6)',
                    transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.6)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Animated "Climbing Mountains Together." — anchored at bottom */}
        <div className="mt-auto w-full overflow-hidden px-[var(--gutter)] pb-[var(--space-lg)]">
          <div className="mx-auto w-full max-w-[var(--max-width)] overflow-hidden">
            <h2
              ref={h2Ref}
              style={{
                transformOrigin: 'center bottom',
                transform: 'translateY(100%) scaleY(1)',
                color: '#000000',
              }}
              className="cursor-default whitespace-nowrap font-display text-[clamp(2rem,5.5vw,5.5rem)] font-bold leading-none"
            >
              Climbing Mountains Together.
            </h2>
          </div>

          {/* Bottom Bar */}
          <div
            className="mx-auto mt-[var(--space-md)] flex w-full max-w-[var(--max-width)] items-center justify-between pt-[var(--space-md)]"
            style={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}
          >
            <span className="text-[0.8rem]" style={{ color: 'rgba(0,0,0,0.35)' }}>
              &copy; {new Date().getFullYear()} BoldCrest
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-[0.4rem] text-[0.75rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-[0.5s]"
              style={{
                color: 'rgba(0,0,0,0.6)',
                transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.6)' }}
            >
              Back to top &uarr;
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
