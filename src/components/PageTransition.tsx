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
const WIPE_IN = 1200     // overlay slides up to cover the screen
const HOLD = 600          // pause while fully covered (new page loads)
const WIPE_OUT = 1000     // overlay slides away to reveal new page
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

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || transitioning.current) return

      transitioning.current = true
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

      // After wipe covers screen, navigate
      setTimeout(() => {
        window.scrollTo(0, 0)
        router.push(href)
      }, WIPE_IN + 50)
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

    // Hold briefly so the new page renders behind the overlay
    const t1 = setTimeout(() => {
      // Fade out logo first
      logo.style.transition = `opacity 0.3s ease, transform 0.3s ease`
      logo.style.opacity = '0'
      logo.style.transform = 'translateY(-15px) scale(0.95)'

      // Then wipe out
      setTimeout(() => {
        overlay.style.transformOrigin = 'top'
        overlay.style.transition = `transform ${WIPE_OUT}ms ${EASE}`
        overlay.style.transform = 'scaleY(0)'

        const t2 = setTimeout(() => {
          overlay.style.display = 'none'
          transitioning.current = false
          setIsTransitioning(false)
        }, WIPE_OUT + 20)

        return () => clearTimeout(t2)
      }, 200)
    }, HOLD)

    return () => clearTimeout(t1)
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
      if (e.metaKey || e.ctrlKey || e.shiftKey) return
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
