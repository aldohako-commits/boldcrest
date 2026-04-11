'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const serviceLinks = [
  { label: 'Branding', href: '/work?service=Branding' },
  { label: 'Packaging', href: '/work?service=Packaging+Design' },
  { label: 'Photography', href: '/work?service=Photography' },
  { label: 'Videography', href: '/work?service=Videography' },
  { label: 'Creative Advertising', href: '/work?service=Creative+Advertising' },
  { label: 'Social Media', href: '/work?service=Social+Media+Management' },
]

const companyLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'People', href: '/people' },
  { label: 'Diary', href: '/diary' },
  { label: 'Contact', href: '/contact' },
]

const socialLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Behance', href: '#' },
  { label: 'Vimeo', href: '#' },
  { label: 'Facebook', href: '#' },
]

/* ── Spring-physics hook ── */
function useSpringReveal(triggered: boolean) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!triggered) {
      el.style.transform = 'translateY(100%)'
      return
    }

    const tension = 170
    const friction = 26
    const mass = 1
    const dt = 1 / 60

    let position = 100
    let velocity = 0
    const target = 0

    let rafId: number

    const tick = () => {
      const springForce = -tension * (position - target)
      const dampingForce = -friction * velocity
      const acceleration = (springForce + dampingForce) / mass

      velocity += acceleration * dt
      position += velocity * dt

      if (Math.abs(position - target) < 0.01 && Math.abs(velocity) < 0.01) {
        position = target
        velocity = 0
        el.style.transform = `translateY(${target}%)`
        return
      }

      el.style.transform = `translateY(${position}%)`
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [triggered])

  return ref
}

const linkClass = 'block py-1 text-[0.85rem] transition-colors duration-300 text-black/50 hover:text-black'

export default function Footer() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const spacerRef = useRef<HTMLDivElement>(null)

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

    onScroll()
    return cleanup
  }, [])

  const wordmarkRef = useSpringReveal(visible)

  if (pathname?.startsWith('/studio')) return null

  return (
    <>
      <div ref={spacerRef} className="h-[50vh]" />

      <footer
        className="sticky bottom-0 z-0 flex flex-col justify-between"
        style={{ background: '#EDEDED', color: '#000000' }}
      >
        {/* Top section — columns */}
        <div className="mx-auto w-full max-w-[var(--max-width)] px-[var(--gutter)] pt-12 pb-16">

          {/* Columns */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Services */}
            <div>
              <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-black/30">Services</h3>
              {serviceLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-black/30">Company</h3>
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-black/30">Contact</h3>
              <p className="py-1 text-[0.85rem] text-black/50">
                Talk to us or ask us anything.
              </p>
              <a href="mailto:info@boldcrest.com" className={linkClass}>
                &rarr; info@boldcrest.com
              </a>
              <Link href="/contact" className={linkClass}>
                &rarr; Contact Us
              </Link>
            </div>

            {/* Social */}
            <div>
              <h3 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-black/30">Social</h3>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  &rarr; {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar — copyright */}
        <div className="border-t border-black/10 px-[var(--gutter)]">
          <div className="mx-auto flex max-w-[var(--max-width)] items-center justify-between py-5">
            <span className="text-[0.75rem] text-black/40">
              &copy; {new Date().getFullYear()} BoldCrest. All rights reserved.
            </span>
            <div className="flex gap-4">
              <Link href="#" className="text-[0.75rem] text-black/40 transition-colors duration-200 hover:text-black/70">
                Privacy Policy
              </Link>
              <Link href="#" className="text-[0.75rem] text-black/40 transition-colors duration-200 hover:text-black/70">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Giant wordmark SVG — constrained to content width, bottom half clipped */}
        <div className="flex w-full items-end overflow-hidden px-[var(--gutter)] pt-5">
          <div className="mx-auto w-full max-w-[var(--max-width)] overflow-hidden" style={{ height: 'clamp(3rem, 8vw, 7rem)' }}>
            <div ref={wordmarkRef} style={{ transform: 'translateY(100%)' }}>
              <svg viewBox="0 0 430.12 48.96" className="w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g>
                  <path fill="#000" d="M0,0h24.65c8.72,0,14.76,5.2,14.76,12.33,0,4.85-2.4,8.77-6.52,10.9,5.42,2.49,8.65,7.13,8.65,12.47,0,7.84-6.66,13.26-16,13.26H0V0ZM21.77,19.38c3.23,0,5.56-1.92,5.56-4.56s-2.33-4.49-5.56-4.49h-10.09v9.05h10.09ZM23.55,38.63c3.43,0,5.91-2.07,5.91-4.92s-2.47-4.92-5.91-4.92h-11.88v9.83h11.88Z"/>
                  <path fill="#000" d="M46.42,24.45C46.42,11.19,58.02.07,71.76.07s25.41,11.12,25.41,24.38-11.6,24.45-25.41,24.45-25.34-11.19-25.34-24.45ZM85.08,24.45c0-7.42-6.11-13.73-13.32-13.73s-13.32,6.32-13.32,13.73,6.11,13.8,13.32,13.8,13.32-6.32,13.32-13.8Z"/>
                  <path fill="#000" d="M138.29,38.02v10.87h-34.4V.07h11.67v37.95h22.73Z"/>
                  <path fill="#000" d="M144.68.07h17.24c16.21,0,27.6,10.09,27.6,24.38s-11.4,24.45-27.6,24.45h-17.24V.07ZM163.7,37.88c8.03,0,13.8-5.61,13.8-13.43s-5.77-13.36-13.8-13.36h-7.28v26.79h7.28Z"/>
                  <path fill="#000" d="M195.83,24.45C195.83,11.19,206.96.07,220,.07c6.52,0,12.57,2.75,16.96,7.21l-3.64,3.71c-3.43-3.64-8.17-5.97-13.32-5.97-10.16,0-18.75,8.93-18.75,19.43s8.58,19.5,18.75,19.5c5.15,0,9.89-2.33,13.32-5.97l3.64,3.71c-4.39,4.39-10.44,7.21-16.96,7.21-13.05,0-24.17-11.19-24.17-24.45Z"/>
                  <path fill="#000" d="M268.07,30.8l12.22,17.92h-6.11l-11.95-17.43h-12.5v17.43h-5.36V.24h19.16c9.75,0,17.37,6.42,17.37,15.52,0,7.62-5.36,13.41-12.84,15.03ZM249.73,26.07h12.84c7.69,0,12.91-3.81,12.91-10.3s-5.22-10.3-12.91-10.3h-12.84v20.6Z"/>
                  <path fill="#000" d="M294.43,5.27v16.11h25.61v5.27h-25.61v17.03h28.43v5.27h-33.85V0h33.85v5.27h-28.43Z"/>
                  <path fill="#000" d="M329.8,41.34l3.36-4.19c3.98,3.98,8.86,6.8,15.45,6.8,7.28,0,10.99-3.98,10.99-8.24,0-5.01-4.46-7-12.7-8.93-9.48-2.2-15.45-5.15-15.45-13.32,0-7.55,6.73-13.46,15.79-13.46,7,0,12.22,2.75,16.55,6.73l-3.3,4.19c-3.91-3.78-8.58-6.04-13.53-6.04-5.84,0-10.09,3.85-10.09,8.17,0,4.88,4.67,6.59,12.7,8.52,9,2.13,15.45,5.36,15.45,13.67,0,7.48-5.63,13.6-16.62,13.6-7.76,0-13.87-2.82-18.61-7.48Z"/>
                  <path fill="#000" d="M387.68,5.27h-15.86V0h37.08v5.27h-15.86v43.69h-5.36V5.27Z"/>
                </g>
                <g>
                  <path fill="#000" d="M421.46,17.32c-1.17,0-2.3-.23-3.37-.68-1.03-.44-1.96-1.06-2.75-1.86-.8-.8-1.42-1.72-1.86-2.75-.45-1.07-.68-2.2-.68-3.37s.23-2.3.68-3.37c.44-1.03,1.06-1.96,1.86-2.75.8-.8,1.72-1.42,2.75-1.86,1.07-.45,2.2-.68,3.37-.68s2.3.23,3.37.68c1.03.44,1.96,1.06,2.75,1.86.8.8,1.42,1.72,1.86,2.75.45,1.07.68,2.2.68,3.37s-.23,2.3-.68,3.37c-.44,1.03-1.06,1.96-1.86,2.75-.8.8-1.72,1.42-2.75,1.86-1.07.45-2.2.68-3.37.68ZM421.46,1.67c-.94,0-1.86.18-2.72.55-.83.35-1.58.86-2.22,1.5-.64.64-1.15,1.39-1.5,2.22-.36.86-.55,1.78-.55,2.72s.18,1.86.55,2.72c.35.83.86,1.58,1.5,2.22.64.64,1.39,1.15,2.22,1.5.86.36,1.78.55,2.72.55s1.86-.18,2.72-.55c.83-.35,1.58-.86,2.22-1.5s1.15-1.39,1.5-2.22c.36-.86.55-1.78.55-2.72s-.18-1.86-.55-2.72c-.35-.83-.86-1.58-1.5-2.22-.64-.64-1.39-1.15-2.22-1.5-.86-.36-1.78-.55-2.72-.55Z"/>
                  <path fill="#000" d="M423.09,13.19l-1.99-2.84h-1.11v2.84h-2.26V4.13h4.21c1.99,0,3.44,1.28,3.44,3.11,0,1.32-.75,2.36-1.93,2.84l2.19,3.11h-2.56ZM419.99,8.3h1.74c.78,0,1.33-.42,1.33-1.06s-.55-1.06-1.33-1.06h-1.74v2.11Z"/>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
