'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import Lenis from 'lenis'

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // Disable Lenis on mobile for better native scroll performance
    const isMobile = window.innerWidth < 768
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (isMobile || prefersReduced) return

    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    lenisRef.current = instance
    setLenis(instance)

    function raf(time: number) {
      instance.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      instance.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
