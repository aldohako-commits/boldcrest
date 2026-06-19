'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
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

  // Lock the page behind the panel using the position:fixed-body technique
  // (pin <body> and offset it by the current scroll). On iOS Safari plain
  // overflow:hidden does NOT stop the page from scrolling when the keyboard
  // opens — Safari scrolls the document to bring the focused field into view,
  // which drags the page out from behind the panel and shows it through the
  // strip above the keyboard. Pinning the body stops that entirely. The panel
  // is given an explicit pixel height (from visualViewport, below) — never a %
  // height — so a fixed body can't collapse it to a sliver.
  useEffect(() => {
    if (!isOpen) return
    lenis?.stop()
    const body = document.body
    const scrollY = window.scrollY
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overscrollBehavior: body.style.overscrollBehavior,
    }
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overscrollBehavior = 'none'
    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      body.style.overscrollBehavior = prev.overscrollBehavior
      window.scrollTo(0, scrollY)
      lenis?.start()
    }
  }, [isOpen, lenis])

  // Hide the page content behind the overlay while the chat is open (mobile).
  // iOS Safari clips position:fixed elements to the visual viewport when the
  // keyboard is up, leaving a strip above the keyboard where the page bleeds
  // through no matter how we size the panel. Making the page content invisible
  // means that strip shows the uniform body background (#0a0a0a) instead — the
  // same colour as the panel, so there is nothing left to bleed. visibility
  // (not display:none) keeps layout + scroll position intact. Desktop keeps its
  // blurred-page backdrop (no keyboard there, so no gap).
  const pageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen) return
    const el = pageRef.current
    if (!el || window.innerWidth >= 768) return
    const prev = el.style.visibility
    el.style.visibility = 'hidden'
    return () => {
      el.style.visibility = prev
    }
  }, [isOpen])

  // Size + position the overlay (backdrop AND panel) to the visual viewport with
  // DIRECT DOM writes — not React state. State updates land a frame late, and
  // during the keyboard animation that one-frame lag is exactly when the page
  // flashes through. Writing top/height straight to the elements keeps the panel
  // pinned to the visible band above the keyboard every frame. Explicit pixel
  // height means the fixed panel covers exactly that band with no gap. With no
  // keyboard (desktop/iPad) this resolves to the full window.
  const panelRef = useRef<HTMLElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen) return
    const vv = window.visualViewport
    const apply = () => {
      const top = vv ? vv.offsetTop : 0
      const height = vv ? vv.height : window.innerHeight
      for (const el of [panelRef.current, backdropRef.current] as HTMLElement[]) {
        if (!el) continue
        el.style.top = `${top}px`
        el.style.height = `${height}px`
      }
    }
    apply()
    // Re-apply next frame too, in case the panel is still mounting/animating in.
    const raf = requestAnimationFrame(apply)
    vv?.addEventListener('resize', apply)
    vv?.addEventListener('scroll', apply)
    window.addEventListener('resize', apply)
    return () => {
      cancelAnimationFrame(raf)
      vv?.removeEventListener('resize', apply)
      vv?.removeEventListener('scroll', apply)
      window.removeEventListener('resize', apply)
    }
  }, [isOpen])

  return (
    <StartProjectContext.Provider value={{ isOpen, open, close }}>
      <div ref={pageRef}>{children}</div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* TEMP diagnostic — only when the URL contains ?kbdebug. Shows what
                iOS actually reports for the viewport + where the panel really
                renders, so we can stop guessing about the keyboard bleed. */}
            <KbDebug panelRef={panelRef} />

            {/* Backdrop — darkened + blurred for the ENTIRE time the chat is
                open. A single stable layer that only fades on open/close, never
                toggling on focus/keyboard, so the page behind never flashes back
                into view. No box around the chat. */}
            <motion.div
              ref={backdropRef}
              className="fixed left-0 top-0 z-[1900] h-[100dvh] w-full bg-black/90 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={close}
            />

            {/* Side panel — top/height are written from the visual viewport (see
                effect above) so the panel covers exactly the visible band above
                the keyboard, with no gap for the page to bleed through. */}
            <motion.aside
              ref={panelRef}
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

/* TEMP diagnostic overlay. Renders only when the page URL contains "kbdebug"
   (e.g. /?kbdebug=1). Shows, live, what iOS reports for the layout + visual
   viewport and where the panel actually paints — so we can see the real numbers
   during a keyboard-open instead of inferring them. Remove once the keyboard
   bleed is resolved. */
function KbDebug({ panelRef }: { panelRef: RefObject<HTMLElement | null> }) {
  const [on, setOn] = useState(false)
  const [text, setText] = useState('')
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.location.search.includes('kbdebug')) return
    setOn(true)
    const fmt = (n: number | undefined) => (n == null ? '–' : Math.round(n))
    const update = () => {
      const vv = window.visualViewport
      const r = panelRef.current?.getBoundingClientRect()
      const ae = document.activeElement as HTMLElement | null
      setText(
        [
          `inner  H=${window.innerHeight} W=${window.innerWidth} scrollY=${window.scrollY}`,
          `vv     h=${fmt(vv?.height)} w=${fmt(vv?.width)} top=${fmt(vv?.offsetTop)} pageTop=${fmt(vv?.pageTop)} scale=${vv?.scale?.toFixed(2) ?? '–'}`,
          `panel  top=${fmt(r?.top)} h=${fmt(r?.height)} bottom=${fmt(r?.bottom)}`,
          `kbGap  innerH-vvH=${vv ? window.innerHeight - Math.round(vv.height) : '–'}  active=${ae?.tagName ?? '–'}`,
        ].join('\n'),
      )
    }
    update()
    const vv = window.visualViewport
    vv?.addEventListener('resize', update)
    vv?.addEventListener('scroll', update)
    const iv = window.setInterval(update, 200)
    return () => {
      vv?.removeEventListener('resize', update)
      vv?.removeEventListener('scroll', update)
      window.clearInterval(iv)
    }
  }, [panelRef])
  if (!on) return null
  return (
    <pre
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        margin: 0,
        padding: '6px 8px',
        background: 'rgba(200,0,0,0.9)',
        color: '#fff',
        font: '10px/1.35 ui-monospace, monospace',
        whiteSpace: 'pre-wrap',
        pointerEvents: 'none',
      }}
    >
      {text}
    </pre>
  )
}
