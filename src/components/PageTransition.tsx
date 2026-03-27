'use client'

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'

const TransitionContext = createContext<{
  isTransitioning: boolean
}>({ isTransitioning: false })

export function usePageTransition() {
  return useContext(TransitionContext)
}

/* ── Timing (ms) ── */
const WIPE_IN = 900
const HOLD = 400
const WIPE_OUT = 800
const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)'

export default function PageTransitionProvider({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const transitioning = useRef(false)
  const prevPathname = useRef(pathname)
  const readyForWipeOut = useRef(false)

  // Force scroll to top on every pathname change
  useEffect(() => {
    window.scrollTo(0, 0)
    // Also reset Lenis if present
    const lenisEl = document.querySelector('[data-lenis-prevent]')
    if ((window as any).__lenis) {
      ;(window as any).__lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname])

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || transitioning.current) return

      transitioning.current = true
      readyForWipeOut.current = false
      setIsTransitioning(true)

      const overlay = overlayRef.current
      const logo = logoRef.current
      if (!overlay || !logo) return

      // Reset & show
      overlay.style.display = 'block'
      overlay.style.transformOrigin = 'bottom'
      overlay.style.transform = 'scaleY(0)'
      overlay.style.transition = 'none'
      logo.style.opacity = '0'
      logo.style.transform = 'translateY(20px) scale(0.9)'
      logo.style.transition = 'none'

      // Force reflow, then animate wipe-in
      void overlay.offsetHeight
      overlay.style.transition = `transform ${WIPE_IN}ms ${EASE}`
      overlay.style.transform = 'scaleY(1)'

      // Fade in logo halfway through wipe
      setTimeout(() => {
        logo.style.transition = `opacity 0.4s ease, transform 0.4s ease`
        logo.style.opacity = '1'
        logo.style.transform = 'translateY(0) scale(1)'
      }, WIPE_IN * 0.4)

      // After wipe fully covers screen, scroll to top and navigate
      setTimeout(() => {
        // Scroll to top while overlay covers the page
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0

        // Mark ready — wipe-out will only happen after both
        // the pathname changes AND the hold period passes
        readyForWipeOut.current = true

        router.push(href)
      }, WIPE_IN)
    },
    [pathname, router],
  )

  // When pathname changes after a transition, wipe the overlay out
  useEffect(() => {
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname

    if (!transitioning.current) return

    const overlay = overlayRef.current
    const logo = logoRef.current
    if (!overlay || !logo) return

    const timers: ReturnType<typeof setTimeout>[] = []

    // Ensure scroll is at top before revealing
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const doWipeOut = () => {
      // Double-ensure scroll top before reveal
      window.scrollTo(0, 0)

      requestAnimationFrame(() => {
        // Fade out logo first
        logo.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
        logo.style.opacity = '0'
        logo.style.transform = 'translateY(-15px) scale(0.95)'

        // Then wipe out
        const t2 = setTimeout(() => {
          overlay.style.transformOrigin = 'top'
          overlay.style.transition = `transform ${WIPE_OUT}ms ${EASE}`
          overlay.style.transform = 'scaleY(0)'

          const t3 = setTimeout(() => {
            overlay.style.display = 'none'
            transitioning.current = false
            setIsTransitioning(false)
          }, WIPE_OUT + 20)
          timers.push(t3)
        }, 150)
        timers.push(t2)
      })
    }

    // Wait for hold period to ensure smooth experience
    const t1 = setTimeout(doWipeOut, HOLD)
    timers.push(t1)

    return () => timers.forEach(clearTimeout)
  }, [pathname])

  // Intercept clicks on internal links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      )
        return
      if (anchor.target === '_blank') return
      // Skip studio links
      if (href.startsWith('/studio')) return

      e.preventDefault()
      navigate(href)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [navigate])

  return (
    <TransitionContext.Provider value={{ isTransitioning }}>
      {children}
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: '#0a0a0a',
          transform: 'scaleY(0)',
          transformOrigin: 'bottom',
          display: 'none',
          pointerEvents: 'none',
        }}
      >
        {/* Centered logo / wordmark */}
        <div
          ref={logoRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transform: 'translateY(20px) scale(0.9)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff',
            }}
          >
            BoldCrest
            <span style={{ color: '#DA291C' }}>.</span>
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}
