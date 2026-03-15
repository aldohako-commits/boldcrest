'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const contactLinks = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '#' },
]

const socialLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Behance', href: '#' },
  { label: 'Vimeo', href: '#' },
  { label: 'Facebook', href: '#' },
]

/* ── Spring-physics hook (matches react-spring defaults from Wolff Olins) ── */
function useSpringReveal(triggered: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!triggered) {
      el.style.transform = 'translateY(100%)'
      return
    }

    /* Spring parameters — tension:170, friction:26, mass:1 (react-spring defaults) */
    const tension = 170
    const friction = 26
    const mass = 1
    const dt = 1 / 60

    let position = 100   // start at 100% (below, hidden)
    let velocity = 0
    const target = 0     // animate to 0% (fully visible)

    let rafId: number

    const tick = () => {
      const springForce = -tension * (position - target)
      const dampingForce = -friction * velocity
      const acceleration = (springForce + dampingForce) / mass

      velocity += acceleration * dt
      position += velocity * dt

      // Settle when close enough
      if (Math.abs(position - target) < 0.01 && Math.abs(velocity) < 0.01) {
        position = target
        velocity = 0
        el.style.transform = `translateY(${target}%)`
        return // stop the loop
      }

      el.style.transform = `translateY(${position}%)`
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [triggered])

  return ref
}

export default function Footer() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const spacerRef = useRef<HTMLDivElement>(null)

  /* Trigger spring when the spacer enters viewport (= footer starts revealing).
     Uses both IntersectionObserver AND a scroll listener for reliability. */
  useEffect(() => {
    const spacer = spacerRef.current
    if (!spacer) return

    let fired = false

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fire() },
      { threshold: 0 },
    )
    observer.observe(spacer)

    const onScroll = () => {
      const rect = spacer.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) fire()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    function cleanup() {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }

    function fire() {
      if (fired) return
      fired = true
      setVisible(true)
      cleanup()
    }

    // Check immediately in case we're already scrolled there
    onScroll()

    return cleanup
  }, [])

  const wordmarkRef = useSpringReveal(visible)

  if (pathname?.startsWith('/studio')) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Spacer — content scrolls over the sticky footer below */}
      <div ref={spacerRef} className="h-screen" />

      <footer
        className="sticky bottom-0 z-0 flex min-h-screen flex-col overflow-hidden"
        style={{ background: '#EDEDED' }}
      >
        {/* ── Top grid  ─────────────────────────────────────── */}
        <div className="mx-auto grid w-full max-w-[var(--max-width)] grid-cols-12 gap-5 px-[var(--gutter)] pt-8 md:gap-y-16">

          {/* Left — Copyright */}
          <div className="col-span-12 md:col-span-5">
            <span
              className="text-[0.85rem]"
              style={{ color: 'rgba(0,0,0,0.45)' }}
            >
              &copy; {new Date().getFullYear()} BoldCrest
            </span>
          </div>

          {/* Centre — Talk to us */}
          <div className="col-span-12 flex flex-col gap-0 md:col-span-5">
            <p
              className="mb-3 text-[0.95rem] leading-snug"
              style={{ color: 'rgba(0,0,0,0.85)' }}
            >
              Talk to us or ask us anything.
            </p>

            <a
              href="mailto:info@boldcrest.com"
              className="mb-1 flex items-center gap-[0.35rem] text-[0.85rem] transition-colors duration-[0.4s]"
              style={{ color: 'rgba(0,0,0,0.55)', transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.55)' }}
            >
              <span style={{ fontSize: '0.7rem' }}>&rarr;</span>
              info@boldcrest.com
            </a>

            {contactLinks.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="mb-1 flex items-center gap-[0.35rem] text-[0.85rem] transition-colors duration-[0.4s]"
                style={{ color: 'rgba(0,0,0,0.55)', transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.55)' }}
              >
                <span style={{ fontSize: '0.7rem' }}>&rarr;</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Social links */}
          <ul className="col-span-12 md:col-span-1 lg:-ml-5">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-1 flex items-center gap-[0.35rem] text-[0.85rem] transition-colors duration-[0.4s]"
                  style={{ color: 'rgba(0,0,0,0.55)', transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.55)' }}
                >
                  <span style={{ fontSize: '0.7rem' }}>&rarr;</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Far right — Back to top */}
          <div className="hidden md:col-span-1 md:flex md:justify-end">
            <button
              onClick={scrollToTop}
              className="group flex flex-col items-center gap-1 pt-0 transition-colors duration-[0.4s]"
              style={{ color: 'rgba(0,0,0,0.55)', transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0,0,0,0.55)' }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="transition-transform duration-[0.4s] group-hover:-translate-y-1"
                style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
              >
                <path
                  d="M10 16V4M10 4l-5 5M10 4l5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[0.7rem] font-medium">
                Back to top
              </span>
            </button>
          </div>
        </div>

        {/* ── Giant wordmark at bottom ──────────────────────── */}
        <div className="mt-auto flex w-full flex-auto items-end px-[var(--gutter)] pb-8 md:pb-16">
          <div className="mx-auto w-full max-w-[var(--max-width)] overflow-hidden">
            <div
              ref={wordmarkRef}
              style={{ transform: 'translateY(100%)' }}
            >
              <h2
                style={{ color: '#000000' }}
                className="cursor-default select-none whitespace-nowrap font-display font-bold leading-[0.85]"
              >
                <span style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}>
                  BoldCrest
                </span>
              </h2>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
