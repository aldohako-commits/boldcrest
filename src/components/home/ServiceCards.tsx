'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'

const capabilities = [
  {
    category: 'Brand Dev',
    number: '01',
    color: '#DA291C',
    heading: 'Brand Dev',
    abbr: 'BRND DEV',
    tags: [
      'Visual Identity',
      'Packaging Design',
      'Creative Advertising',
      'Brand Strategy',
      'Logo Design',
      'Brand Guidelines',
    ],
    description:
      "From brand architecture to visual identity, we create systems that clarify who you are and amplify how you're seen.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4L4 14v12l16 10 16-10V14L20 4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 14v12M12 19l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    category: 'Still & Motion',
    number: '02',
    color: '#f9b311',
    heading: 'Still & Motion',
    abbr: 'STL & MTN',
    tags: [
      'Photography',
      'Videography',
      'Animation',
      'Motion Graphics',
      'Post-Production',
      'Color Grading',
    ],
    description:
      'Still frames that hold attention. Moving images that move people. Every shoot, every cut, every grade — deliberate.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="10" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    category: 'Communications',
    number: '03',
    color: '#004c95',
    heading: 'Comms',
    abbr: 'COMMS',
    tags: [
      'Social Media',
      'Digital Marketing',
      'Public Relations',
      'Content Strategy',
      'Campaign Management',
      'Media Planning',
    ],
    description:
      'Strategy, content, and distribution — orchestrated to reach the right audience at the right moment.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M8 12h24v16H22l-6 4v-4H8V12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="16" cy="20" r="1.5" fill="currentColor" />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        <circle cx="24" cy="20" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
]

export default function ServiceCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const maxScroll = useRef(0)

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        maxScroll.current = trackRef.current.scrollWidth - window.innerWidth
      }
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, (v) => -v * maxScroll.current)

  return (
    <section ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Label */}
        <div className="flex items-center px-[var(--gutter)] pt-8 pb-6">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#0a0a0a]/50">
            What We Do
          </p>
        </div>

        {/* Top separator */}
        <div className="mx-[var(--gutter)] h-px bg-[#0a0a0a]/10" />

        {/* Horizontal panels */}
        <motion.div
          ref={trackRef}
          className="flex h-[calc(100vh-82px)]"
          style={{ x }}
        >
          {capabilities.map((cap, i) => (
            <div
              key={cap.category}
              className="relative flex h-full shrink-0 flex-col justify-between"
              style={{
                width: '33.333vw',
                minWidth: '400px',
                borderRight: '1px solid #0a0a0a10',
              }}
            >
              <div
                className="flex h-full flex-col justify-between py-8 lg:py-10"
                style={{
                  paddingLeft: i === 0 ? 'var(--gutter)' : 'clamp(1.5rem, 2vw, 2.5rem)',
                  paddingRight: 'clamp(1.5rem, 2vw, 2.5rem)',
                }}
              >
                {/* Top: heading + tags */}
                <div>
                  <h2 className="mb-6 font-display text-[clamp(2.5rem,5vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#0a0a0a]">
                    {cap.heading}
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {cap.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/work?service=${encodeURIComponent(tag)}`}
                        className="rounded-full border px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.05em] transition-all duration-200"
                        style={{
                          borderColor: '#0a0a0a20',
                          color: '#0a0a0a99',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = cap.color
                          e.currentTarget.style.backgroundColor = `${cap.color}15`
                          e.currentTarget.style.color = '#0a0a0a'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#0a0a0a20'
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = '#0a0a0a99'
                        }}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bottom: icon + abbreviation + description */}
                <div className="flex items-end gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border"
                      style={{
                        borderColor: `${cap.color}25`,
                        color: `${cap.color}`,
                      }}
                    >
                      {cap.icon}
                    </div>
                    <span
                      className="text-[0.55rem] font-semibold uppercase tracking-[0.1em]"
                      style={{ color: `${cap.color}80` }}
                    >
                      {cap.abbr}
                    </span>
                  </div>
                  <p className="max-w-[280px] text-[0.8rem] leading-[1.5] text-[#0a0a0a]/40">
                    {cap.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* CTA Panel */}
          <div
            className="relative flex h-full shrink-0 flex-col justify-between bg-[#0a0a0a] px-10 py-10 lg:px-16"
            style={{
              width: '33.333vw',
              minWidth: '400px',
            }}
          >
            <div>
              <h2 className="mb-8 font-display text-[clamp(2.5rem,5vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
                Start a<br />Project
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              <p className="max-w-[320px] text-[0.85rem] leading-[1.7] text-white/80">
                We live in the details. The pixels, the strategy, the
                timing. If you&apos;re building something real, we&apos;ll
                meet you there.
              </p>
              <Link
                href="/start-a-new-project"
                className="inline-flex w-fit items-center gap-3 rounded-[var(--radius-pill)] border border-white/30 px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-[0.5s] hover:border-white/60"
                style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
              >
                Let&apos;s Chat
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Bottom separator */}
        <div className="mx-[var(--gutter)] h-px bg-[#0a0a0a]/10" />
      </div>
    </section>
  )
}
