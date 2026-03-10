'use client'

import { motion } from 'framer-motion'

const LINE_1 = [
  { text: 'Build', effect: null },
  { text: 'identities', effect: 'identities' },
  { text: 'and', effect: null },
]

const LINE_2 = [
  { text: 'shape', effect: null },
  { text: 'perceptions', effect: 'perceptions' },
]

const LINE_3 = [
  { text: 'Go', effect: null },
  { text: 'bold', effect: 'bold' },
  { text: 'or', effect: null },
  { text: 'go', effect: null },
  { text: 'unseen', effect: 'unseen' },
]

const lines = [LINE_1, LINE_2, LINE_3]

// Flatten for stagger delay calculation
function getWordDelay(lineIndex: number, wordIndex: number): number {
  let total = 0
  for (let i = 0; i < lineIndex; i++) {
    total += lines[i].length
  }
  total += wordIndex
  return 0.1 + total * 0.1
}

function IdentitiesShapes() {
  return (
    <span className="pointer-events-none absolute -inset-x-6 -inset-y-5 opacity-0 transition-opacity duration-300 group-hover/identities:opacity-100">
      {/* Circle — top-left */}
      <span className="absolute -top-3 -left-2 h-[22px] w-[22px] scale-0 rounded-full border-2 border-accent transition-all duration-500 group-hover/identities:scale-100" style={{ transitionTimingFunction: 'var(--ease-out-expo)' }} />
      {/* Triangle — top-right */}
      <span className="absolute -top-4 right-[20%] scale-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-accent transition-all duration-500 group-hover/identities:scale-100 group-hover/identities:rotate-[15deg]" style={{ transitionTimingFunction: 'var(--ease-out-expo)', transitionDelay: '0.06s' }} />
      {/* Square — bottom-left */}
      <span className="absolute -bottom-[10px] left-[15%] h-4 w-4 scale-0 border-2 border-white transition-all duration-500 group-hover/identities:scale-100 group-hover/identities:rotate-45" style={{ transitionTimingFunction: 'var(--ease-out-expo)', transitionDelay: '0.12s' }} />
      {/* Diamond — bottom-right */}
      <span className="absolute -bottom-2 right-[5%] h-[14px] w-[14px] scale-0 bg-accent transition-all duration-500 group-hover/identities:scale-100 group-hover/identities:rotate-45" style={{ transitionTimingFunction: 'var(--ease-out-expo)', transitionDelay: '0.18s' }} />
    </span>
  )
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

  let hoverClasses = ''
  let groupClass = ''

  switch (effect) {
    case 'identities':
      groupClass = 'group/identities'
      break
    case 'perceptions':
      hoverClasses =
        'transition-all duration-[0.4s] hover:skew-x-[-12deg] hover:text-transparent'
      break
    case 'bold':
      hoverClasses =
        'transition-all duration-[0.35s] hover:uppercase hover:font-black hover:tracking-[0.02em]'
      break
    case 'unseen':
      hoverClasses =
        'transition-all duration-[0.6s] hover:opacity-0 hover:blur-[12px] hover:translate-y-[10px] hover:scale-95'
      break
  }

  return (
    <motion.span
      className={`relative inline-block cursor-default ${groupClass} ${hoverClasses}`}
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
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
          : effect === 'unseen'
            ? { transitionTimingFunction: 'var(--ease-out-expo)' }
            : effect === 'bold'
              ? { transitionTimingFunction: 'var(--ease-out-expo)' }
              : undefined
      }
      onMouseEnter={
        effect === 'perceptions'
          ? (e) => {
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
      {effect === 'identities' && <IdentitiesShapes />}
      {text}
      {dotAfter && <span className="text-accent">.</span>}
    </motion.span>
  )
}

interface HeroProps {
  subtitle?: string
}

export default function Hero({ subtitle }: HeroProps) {
  const defaultSubtitle =
    "We don't just navigate the landscape of advertising, we sculpt it. Breathing life into your brand, we embark on a journey together."

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-[var(--gutter)] pt-32 pb-16">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        {/* Mountain BG */}
        <div className="pointer-events-none absolute top-0 right-[-5%] h-full w-[55%] opacity-[0.04]">
          <svg viewBox="0 0 800 600" className="h-full w-full" fill="none">
            <path
              d="M0 600L200 200L350 400L500 100L650 350L800 50V600H0Z"
              fill="white"
            />
          </svg>
        </div>

        <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          {lines.map((line, lineIndex) => (
            <span key={lineIndex} className="block overflow-hidden">
              {line.map((word, wordIndex) => (
                <span key={wordIndex}>
                  {wordIndex > 0 && ' '}
                  <Word
                    text={word.text}
                    effect={word.effect}
                    delay={getWordDelay(lineIndex, wordIndex)}
                    isLastInLine={wordIndex === line.length - 1}
                  />
                </span>
              ))}
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-[var(--space-xl)] max-w-[500px] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.7] text-text-secondary"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {subtitle || defaultSubtitle}
        </motion.p>
      </div>
    </section>
  )
}
