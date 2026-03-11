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

  return (
    <motion.span
      className="relative inline-block cursor-default"
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {text}
      {dotAfter && <span className="text-accent">.</span>}
    </motion.span>
  )
}

export default function Hero() {
  return (
    <section className="relative flex h-[60vh] flex-col justify-center overflow-hidden px-[var(--gutter)] pt-32 pb-16">
      <div className="w-full">
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
      </div>
    </section>
  )
}
