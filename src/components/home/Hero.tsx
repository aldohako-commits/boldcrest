'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

/* Desktop lines (md+) */
const DESKTOP_LINES = [
  [
    { text: 'Build', effect: null },
    { text: 'identities', effect: 'identities' },
    { text: 'and', effect: null },
  ],
  [
    { text: 'shape', effect: null },
    { text: 'perceptions', effect: 'perceptions' },
  ],
  [
    { text: 'Go', effect: null },
    { text: 'bold', effect: 'bold' },
    { text: 'or', effect: null },
    { text: 'go', effect: null },
    { text: 'unseen', effect: 'unseen' },
  ],
]

/* Mobile lines — "and" drops to line 2, "go unseen." gets its own line */
const MOBILE_LINES = [
  [
    { text: 'Build', effect: null },
    { text: 'identities', effect: 'identities' },
  ],
  [
    { text: 'and', effect: null },
    { text: 'shape', effect: null },
    { text: 'perceptions', effect: 'perceptions' },
  ],
  [
    { text: 'Go', effect: null },
    { text: 'bold', effect: 'bold' },
    { text: 'or', effect: null },
  ],
  [
    { text: 'go', effect: null },
    { text: 'unseen', effect: 'unseen' },
  ],
]

const lines = DESKTOP_LINES

function getWordDelay(lineSet: typeof DESKTOP_LINES, lineIndex: number, wordIndex: number): number {
  let total = 0
  for (let i = 0; i < lineIndex; i++) {
    total += lineSet[i].length
  }
  total += wordIndex
  return 0.1 + total * 0.1
}

function Word({
  text,
  effect,
  delay,
  isLastInLine,
}: {
  text: string
  effect: string | null
  delay: number
  isLastInLine: boolean
}) {
  const dotAfter =
    (effect === 'perceptions' || effect === 'unseen') && isLastInLine

  // The hover effect is enabled only AFTER the entrance animation finishes. The
  // hover classes carry `transition-all`, which otherwise CSS-transitions the
  // very transform/opacity that framer-motion is driving frame-by-frame during
  // the entrance — the two fight each other and the word flickers/jumps on load
  // (most visibly on mobile). Holding the transition back until entrance
  // completes lets framer animate cleanly, then restores the hover behavior
  // unchanged. `hover-fine:` (see globals.css) gates the hover on `any-hover`
  // so it works with a mouse/trackpad on iPad/iPhone but never sticks on touch.
  const [hoverReady, setHoverReady] = useState(false)

  let hoverClasses = ''

  switch (effect) {
    case 'perceptions':
      hoverClasses =
        'transition-all duration-[0.4s] hover-fine:skew-x-[-12deg] hover-fine:text-transparent'
      break
    case 'bold':
      hoverClasses =
        'transition-all duration-[0.35s] hover-fine:uppercase hover-fine:font-black hover-fine:tracking-[0.02em]'
      break
    case 'unseen':
      // Blur restored. The crop in the screenshot is a Safari bug: it clips a
      // `filter: blur` element's halo to the element's OWN border-box when an
      // ancestor has `overflow-x: clip` (our html/body — load-bearing for the
      // sticky sections), so the soft edges got sliced into hard vertical lines on
      // the left/right of "unseen". Fix = the `boxPad` below (`px-[0.5em]`) widens
      // the box so the 10px halo lands INSIDE it instead of at the clipped edge.
      hoverClasses =
        'transition-all duration-[0.6s] hover-fine:opacity-0 hover-fine:blur-[10px] hover-fine:translate-y-[16px] hover-fine:scale-90'
      break
  }

  // Always-on horizontal breathing room for the blurred word, NOT gated on the
  // hover transition — so the box is already wide enough the instant the blur
  // applies (no wobble) and the halo is never clipped. `-mx` cancels the padding
  // width so resting layout / letter-spacing is pixel-identical.
  const boxPad = effect === 'unseen' ? 'px-[0.5em] -mx-[0.5em]' : ''

  return (
    <motion.span
      className={`relative inline-block cursor-default select-none [-webkit-tap-highlight-color:transparent] ${boxPad} ${hoverReady ? hoverClasses : ''}`}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      onAnimationComplete={() => setHoverReady(true)}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={
        effect === 'perceptions'
          ? {
              WebkitTextStroke: '0px transparent' as never,
              transitionTimingFunction: 'var(--ease-out-expo)',
            }
          : effect === 'unseen' || effect === 'bold'
            ? { transitionTimingFunction: 'var(--ease-out-expo)' }
            : undefined
      }
      onMouseEnter={
        effect === 'perceptions'
          ? (e) => {
              // Touch taps emit a synthetic mouseenter on iOS; without this guard
              // the stroke would apply and STICK on tap. Only react to a real
              // hover-capable pointer (mouse/trackpad), matching the CSS gate.
              if (!window.matchMedia('(any-hover: hover)').matches) return
              const el = e.currentTarget as HTMLElement
              ;(el.style as unknown as Record<string, string>).webkitTextStroke = '1.5px white'
            }
          : undefined
      }
      onMouseLeave={
        effect === 'perceptions'
          ? (e) => {
              const el = e.currentTarget as HTMLElement
              ;(el.style as unknown as Record<string, string>).webkitTextStroke = '0px transparent'
              el.style.color = ''
            }
          : undefined
      }
    >
      {text}
      {dotAfter && <span className="text-accent">.</span>}
    </motion.span>
  )
}

export default function Hero() {
  return (
    <section className="px-[var(--gutter)] pt-[clamp(8rem,17vh,14rem)] pb-[var(--space-2xl)]">
      {/* Desktop lines */}
      <h1 className="hidden cursor-default select-none [-webkit-tap-highlight-color:transparent] font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[1.05] tracking-[-0.03em] md:block">
        {DESKTOP_LINES.map((line, lineIndex) => (
          <span key={lineIndex} className={`block ${lineIndex < DESKTOP_LINES.length - 1 ? 'overflow-hidden' : ''}`}>
            {line.map((word, wordIndex) => (
              <span key={wordIndex}>
                {wordIndex > 0 && ' '}
                <Word
                  text={word.text}
                  effect={word.effect}
                  delay={getWordDelay(DESKTOP_LINES, lineIndex, wordIndex)}
                  isLastInLine={wordIndex === line.length - 1}
                />
              </span>
            ))}
          </span>
        ))}
      </h1>

      {/* Mobile lines */}
      <h1 className="cursor-default select-none [-webkit-tap-highlight-color:transparent] font-display text-[clamp(3rem,12vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] md:hidden">
        {MOBILE_LINES.map((line, lineIndex) => (
          <span key={lineIndex} className={`block ${lineIndex < MOBILE_LINES.length - 1 ? 'overflow-hidden' : ''}`}>
            {line.map((word, wordIndex) => (
              <span key={wordIndex}>
                {wordIndex > 0 && ' '}
                <Word
                  text={word.text}
                  effect={word.effect}
                  delay={getWordDelay(MOBILE_LINES, lineIndex, wordIndex)}
                  isLastInLine={wordIndex === line.length - 1}
                />
              </span>
            ))}
          </span>
        ))}
      </h1>
    </section>
  )
}
