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
      <div ref={spacerRef} className="h-screen" />

      <footer
        className="sticky bottom-0 z-0 flex min-h-screen flex-col justify-between"
        style={{ background: '#EDEDED', color: '#000000' }}
      >
        {/* Top section — logo + columns */}
        <div className="mx-auto w-full max-w-[var(--max-width)] px-[var(--gutter)] pt-12 pb-16">
          {/* Logo */}
          <div className="mb-12">
            <svg
              viewBox="0 0 384.09 384"
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#000"
                d="M321.01,81.6v-2.75c-.93-.36-1.75-.71-2.59-.99-8.55-2.85-17.11-5.71-25.67-8.52-26.48-8.7-52.96-17.4-79.43-26.11h0s-2.56-.84-2.56-.84l-11.78-3.92-6.23-2.08-2.65.89s0,0,0,0c-2.13.72-4.26,1.43-6.39,2.14h0s-14.07,4.73-14.07,4.73h-.02c-27.79,9.32-55.59,18.64-83.38,27.95-6.55,2.19-13.08,4.42-19.69,6.66v2.61c0,45.43.01,90.86,0,136.28,0,13.38,2.79,26.12,8.44,38.25,8.64,18.55,22.04,33.2,37.91,45.71,22.54,17.77,47.81,30.42,74.74,39.82,1.51.53,6.13,2.14,6.13,2.14l5.03-1.78c.5-.17,1-.34,1.51-.52,1.29-.45,2.58-.91,3.87-1.38,14.85-5.43,29.16-12.08,42.9-19.98,18.41-10.59,35.35-23.05,49.24-39.32,16.32-19.11,24.99-40.88,24.78-66.35-.37-44.22-.1-88.44-.1-132.66ZM297.55,238.3c-17.69-24.61-35.31-49.27-52.91-73.95-6.98-9.78-15.27-9.84-22.23-.1-15.56,21.78-31.08,43.6-46.75,65.3-5.93,8.2-13.86,8.15-19.82.08-4.45-6.01-8.72-12.16-13.05-18.25-7.01-9.85-15.04-9.91-22.15-.04-8.87,12.31-17.56,24.76-26.56,36.98-.39-.78-.78-1.57-1.15-2.36-4.8-10.3-7.17-21.12-7.17-32.48.02-38.57,0-77.15,0-115.72v-2.22c5.61-1.9,11.16-3.79,16.72-5.65,21.05-7.06,42.1-14.11,63.15-21.17h0s25.8-8.61,25.8-8.61l1.47-.49,108.92,35.99v2.33c0,37.55-.23,75.1.09,112.65.08,9.86-1.41,19.06-4.36,27.7Z"
              />
            </svg>
          </div>

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
              <Link href="/privacy-policy" className={linkClass}>
                &rarr; Privacy Policy
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

        {/* Giant wordmark — centered, bottom half clipped */}
        <div className="mt-auto flex w-full flex-auto items-end overflow-hidden">
          <div className="mx-auto w-full overflow-hidden" style={{ height: 'clamp(4rem, 12vw, 12rem)' }}>
            <div ref={wordmarkRef} className="flex justify-center" style={{ transform: 'translateY(100%)' }}>
              <h2
                style={{ color: '#000000', fontSize: 'clamp(6rem, 22vw, 22rem)' }}
                className="cursor-default select-none whitespace-nowrap font-display font-bold leading-[0.85]"
              >
                BoldCrest
              </h2>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
