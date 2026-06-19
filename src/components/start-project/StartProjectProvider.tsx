'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import StartProjectChat from './StartProjectChat'
import { useLenis } from '@/components/LenisProvider'

type StartProjectContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const StartProjectContext = createContext<StartProjectContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

export function useStartProject() {
  return useContext(StartProjectContext)
}

export default function StartProjectProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [chatKey, setChatKey] = useState(0)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  // Remounting the chat with a fresh key resets it to the first question.
  const restartChat = useCallback(() => setChatKey((k) => k + 1), [])
  const lenis = useLenis()

  // Esc to close.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  // Lock background scroll while the chat is open. Deliberately NOT using the
  // position:fixed-body technique: on iOS, focusing an input inside a fixed
  // panel while <body> is also position:fixed makes Safari mis-clip the panel
  // to a tiny height. Plain overflow:hidden + pausing Lenis (desktop) locks the
  // page without breaking the keyboard-open layout; the constant dark backdrop
  // covers anything behind.
  useEffect(() => {
    if (!isOpen) return
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    const prevOverscroll = document.body.style.overscrollBehavior
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.overscrollBehavior = prevOverscroll
      lenis?.start()
    }
  }, [isOpen, lenis])

  // The panel is full-height (100dvh) so its SOLID background covers the entire
  // screen — including the strip behind the on-screen keyboard. This is what
  // stops other sections of the page bleeding into the keyboard area: iOS has a
  // backdrop-filter clipping bug where the blurred backdrop doesn't render
  // between the visual viewport and the keyboard, but a solid full-height panel
  // has no such gap. The focused field is scrolled above the keyboard from
  // inside the chat (visualViewport-aware), so nothing needs to resize here.

  return (
    <StartProjectContext.Provider value={{ isOpen, open, close }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — darkened + blurred for the ENTIRE time the chat is
                open. A single stable layer that only fades on open/close, never
                toggling on focus/keyboard, so the page behind never flashes back
                into view. No box around the chat. */}
            <motion.div
              className="fixed inset-0 z-[1900] bg-black/90 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={close}
            />

            {/* Opaque backing layer — same column as the panel but extended far
                past the top and bottom edges. iOS can detach/scroll a
                position:fixed panel while the keyboard animates, which would
                briefly expose the page in the strip above the keyboard; an
                oversized solid layer behind the panel keeps that strip painted
                with the panel background no matter how far it shifts. Slides in
                with the panel so it never flashes as a bare bar. Hidden behind
                the panel on desktop (identical width), full-width on mobile. */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none fixed right-0 z-[1990] w-full max-w-[480px] bg-bg"
              style={{ top: '-60vh', bottom: '-60vh' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Side panel */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Start a new project"
              className="fixed right-0 top-0 z-[2000] flex h-[100dvh] w-full max-w-[480px] flex-col overflow-hidden bg-bg"
              style={{ borderLeft: '1px solid var(--border)', boxShadow: '-24px 0 60px rgba(0,0,0,0.45)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Panel header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
                  Start a new project
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={restartChat}
                    aria-label="Start a new conversation"
                    title="Start a new conversation"
                    className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 hover:border-white/40"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M13.6 8A5.6 5.6 0 1 1 11.9 4.0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M13.8 2.2v2.4h-2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={close}
                    aria-label="Close"
                    className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 hover:border-white/40"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3l10 10M13 3l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable chat body — keep Lenis out so it scrolls natively.
                  min-h-0 is essential: without it the flex item grows with its
                  content (and keyboard padding) and overflows the panel instead
                  of scrolling internally, which breaks the keyboard math. */}
              <div
                data-lenis-prevent
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8"
              >
                <StartProjectChat key={chatKey} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </StartProjectContext.Provider>
  )
}
