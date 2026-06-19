'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useStartProject } from '@/components/start-project/StartProjectProvider'

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
  const { open: openStartProject } = useStartProject()

  // Geometry is measured in pixels so that on MOBILE the pinned section lasts
  // exactly the horizontal pan distance (+ a hold), instead of an arbitrary
  // `200vh`. With `200vh` the section height (large viewport) and the sticky
  // `svh` height disagreed, so the pin released — and vertical scrolling resumed
  // — before the horizontal pan finished, dropping the last panel early and
  // cutting the bottom. Desktop keeps the CSS `200vh` + linear pan (untouched).
  const [maxScroll, setMaxScroll] = useState(0)
  const [mobileSectionH, setMobileSectionH] = useState(0) // 0 → desktop: CSS 200vh
  const [holdPoint, setHoldPoint] = useState(1) // 1 → desktop: linear pan

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const iw = window.innerWidth
      const ih = window.innerHeight
      const ms = Math.max(0, track.scrollWidth - iw)
      setMaxScroll(ms)
      if (iw < 768 && ms > 0) {
        // Pin lasts: one screen of pan room is implicit; add the pan distance so
        // 1px of vertical scroll ≈ 1px of horizontal pan (natural feel), then a
        // half-screen HOLD so the spring fully settles before the pin releases.
        const hold = Math.round(ih * 0.5)
        setMobileSectionH(ih + ms + hold)
        setHoldPoint(ms / (ms + hold))
      } else {
        setMobileSectionH(0)
        setHoldPoint(1)
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

  // Pan to the end by `holdPoint` of the pinned scroll, then HOLD the final frame
  // for the remainder. The hold lets the smoothing spring settle on the "Start a
  // Project" panel, so the horizontal pan is fully complete and locked before the
  // pin releases and vertical scrolling resumes. (Desktop holdPoint=1 → linear.)
  const xRaw = useTransform(scrollYProgress, (v) => {
    const t = holdPoint < 1 ? Math.min(v / holdPoint, 1) : v
    return -t * maxScroll
  })
  // Smooth the scroll-linked transform: iOS throttles scroll events during
  // momentum, which makes the raw mapping stutter. A light spring interpolates
  // between the sparse samples so the horizontal track glides.
  const x = useSpring(xRaw, { stiffness: 220, damping: 40, mass: 0.25 })

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh]"
      style={mobileSectionH ? { height: mobileSectionH } : undefined}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Label — top padding clears the fixed menu pill at every breakpoint
            (the section pins under the menu while it scrolls); the gap from the
            menu to the heading matches the gap below it (pb-6). */}
        <div className="flex items-center px-[var(--gutter)] pt-[6rem] pb-6">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--zone-fg-half)' }}>
            What We Do
          </p>
        </div>

        {/* Top separator */}
        <div className="mx-[var(--gutter)] h-px" style={{ backgroundColor: 'var(--zone-fg-subtle)' }} />

        {/* Horizontal panels */}
        <motion.div
          ref={trackRef}
          className="flex h-[calc(100dvh-150px)] will-change-transform [transform:translateZ(0)]"
          style={{ x }}
        >
          {capabilities.map((cap, i) => (
            <div
              key={cap.category}
              className="relative flex h-full w-screen shrink-0 flex-col justify-between md:w-[33.333vw] md:min-w-[400px]"
              style={{ borderRight: '1px solid var(--zone-fg-subtle)' }}
            >
              <div
                className="flex h-full flex-col justify-between py-8 lg:py-10"
                style={{
                  paddingLeft: i === 0 ? 'var(--gutter)' : 'clamp(1.5rem, 2vw, 2.5rem)',
                  paddingRight: 'clamp(1.5rem, 2vw, 2.5rem)',
                }}
              >
                {/* Top: heading + description */}
                <div>
                  <h2 className="mb-4 font-display text-[clamp(2.5rem,5vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em]" style={{ color: 'var(--zone-fg)' }}>
                    {cap.heading}
                  </h2>
                  <p className="max-w-[320px] text-[0.85rem] leading-[1.6]" style={{ color: 'var(--zone-fg-muted)' }}>
                    {cap.description}
                  </p>
                </div>

                {/* Bottom: service tags */}
                <div className="flex flex-wrap gap-2">
                  {cap.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/work?service=${encodeURIComponent(tag)}`}
                      className="rounded-full border px-3.5 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.05em] transition-all duration-200"
                      style={{
                        borderColor: 'var(--zone-fg-faint)',
                        color: 'var(--zone-fg-half)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = cap.color
                        e.currentTarget.style.backgroundColor = `${cap.color}15`
                        e.currentTarget.style.color = 'var(--zone-fg)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--zone-fg-faint)'
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--zone-fg-half)'
                      }}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* CTA Panel — on mobile it fills the screen and its left padding is
              the page gutter, so "Start a Project" starts at the same x as the
              diary/other sections once the pan lands it flush at the left. */}
          <div className="relative flex h-full w-screen shrink-0 flex-col justify-between bg-[#0a0a0a] py-10 pl-[var(--gutter)] pr-[var(--gutter)] md:w-[33.333vw] md:min-w-[400px] md:px-10 lg:px-16">
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
              <button
                type="button"
                onClick={openStartProject}
                className="group/chat flex items-center gap-2 self-start text-[0.85rem] font-semibold uppercase tracking-[0.15em] text-white transition-all duration-[0.5s] hover:gap-3"
                style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
              >
                <span className="inline-flex overflow-hidden" style={{ height: '1.2em' }}>
                  <span
                    className="flex flex-col transition-transform duration-[0.5s] group-hover/chat:-translate-y-1/2"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
                  >
                    <span className="leading-[1.2]">Let&apos;s Chat</span>
                    <span className="leading-[1.2]">Let&apos;s Chat</span>
                  </span>
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform duration-[0.5s] group-hover/chat:translate-x-1"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)' }}
                >
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
