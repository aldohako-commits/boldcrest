'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import ScrollReveal from '@/components/ScrollReveal'

interface Project {
  _id: string
  name: string
  slug: { current: string }
  services?: string[]
  thumbnailType?: string
  thumbnail?: {
    asset: { _ref: string }
  }
  thumbnailVideo?: string
}

interface SelectedWorksProps {
  projects: Project[]
}

/* ── Project card with parallax-on-hover crop shift ── */
function ProjectCard({
  project,
  index,
  total,
  aspect = 'aspect-[4/3]',
  sizes = '(max-width: 768px) 100vw, 50vw',
  direction = 'bottom',
}: {
  project: Project
  index: number
  total: number
  aspect?: string
  sizes?: string
  direction?: 'left' | 'right' | 'bottom'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const directionMap = {
    left: { x: -60, y: 0 },
    right: { x: 60, y: 0 },
    bottom: { x: 0, y: 60 },
  }

  const counter = `${String(index + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: directionMap[direction].x,
        y: directionMap[direction].y,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : {
              opacity: 0,
              x: directionMap[direction].x,
              y: directionMap[direction].y,
            }
      }
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/work/${project.slug?.current}`}
        className={`group relative block ${aspect} overflow-hidden rounded-[var(--radius-lg)] bg-bg-card`}
      >
        {/* Thumbnail with parallax crop shift on hover */}
        {project.thumbnailType === 'video' && project.thumbnailVideo ? (
          <iframe
            src={`https://player.vimeo.com/video/${project.thumbnailVideo.match(/vimeo\.com\/(\d+)/)?.[1]}?background=1&autoplay=1&loop=1&muted=1`}
            className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-[0.8s]"
            style={{
              transitionTimingFunction: 'var(--ease-out-expo)',
              border: 'none',
            }}
            allow="autoplay; fullscreen"
            loading="lazy"
          />
        ) : project.thumbnail?.asset ? (
          <Image
            loader={sanityImageLoader}
            src={urlFor(project.thumbnail).width(1200).height(800).url()}
            alt={project.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-[1s] group-hover:scale-[1.03] group-hover:translate-x-[2%]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            sizes={sizes}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-card">
            <div className="h-[60px] w-[60px] rounded-full border-2 border-text-tertiary" />
          </div>
        )}

        {/* Counter — top right corner */}
        <span className="absolute top-4 right-4 z-10 font-display text-[0.65rem] font-medium tracking-[0.15em] text-white/50 transition-colors duration-300 group-hover:text-white/80">
          {counter}
        </span>

        {/* Overlay — enhanced from gradient to subtle parallax feel */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-[var(--space-lg)] opacity-0 transition-opacity duration-[0.4s] group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)',
            transitionTimingFunction: 'var(--ease-out-expo)',
          }}
        >
          <h3 className="font-display text-[1.4rem] font-semibold">
            {project.name}
          </h3>
          {project.services?.[0] && (
            <span className="mt-2 inline-block w-fit rounded-[var(--radius-pill)] bg-white/10 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-text-secondary">
              {project.services[0]}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default function SelectedWorks({ projects }: SelectedWorksProps) {
  if (!projects.length) return null

  const padded: Project[] = []
  for (let i = 0; i < 6; i++) {
    padded.push({
      ...projects[i % projects.length],
      _id:
        projects[i % projects.length]._id +
        (i >= projects.length ? `-dup-${i}` : ''),
    })
  }

  const total = padded.length

  return (
    <section className="px-[var(--gutter)] pt-[var(--space-lg)] pb-[var(--space-2xl)]">
      <div className="w-full">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-4 h-px bg-border" />
          <div className="mb-[var(--space-xl)] flex items-center justify-between">
            <h2 className="font-display text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Proof<span className="text-accent">.</span>
            </h2>
            <Link
              href="/work"
              className="group flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-secondary transition-all duration-[0.5s] hover:gap-3 hover:text-white"
              style={{
                transitionTimingFunction:
                  'cubic-bezier(0.645, 0.045, 0.355, 1)',
              }}
            >
              <span
                className="inline-flex overflow-hidden"
                style={{ height: '1.2em' }}
              >
                <span
                  className="flex flex-col transition-transform duration-[0.5s] group-hover:-translate-y-1/2"
                  style={{
                    transitionTimingFunction:
                      'cubic-bezier(0.645, 0.045, 0.355, 1)',
                  }}
                >
                  <span className="leading-[1.2]">See All</span>
                  <span className="leading-[1.2]">See All</span>
                </span>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-[0.5s] group-hover:translate-x-1"
                style={{
                  transitionTimingFunction:
                    'cubic-bezier(0.645, 0.045, 0.355, 1)',
                }}
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
        </ScrollReveal>

        {/* Alternating Grid with varied entry directions */}
        <div className="flex flex-col gap-6">
          {/* Row 1 — Full width, enters from left */}
          <ProjectCard
            project={padded[0]}
            index={0}
            total={total}
            aspect="aspect-[16/7]"
            sizes="100vw"
            direction="left"
          />

          {/* Row 2 — Two columns: left enters from right, right enters from bottom */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProjectCard
              project={padded[1]}
              index={1}
              total={total}
              direction="right"
            />
            <ProjectCard
              project={padded[2]}
              index={2}
              total={total}
              direction="bottom"
            />
          </div>

          {/* Row 3 — Full width, enters from right */}
          <ProjectCard
            project={padded[3]}
            index={3}
            total={total}
            aspect="aspect-[16/7]"
            sizes="100vw"
            direction="right"
          />

          {/* Row 4 — Two columns: left enters from bottom, right enters from left */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ProjectCard
              project={padded[4]}
              index={4}
              total={total}
              direction="bottom"
            />
            <ProjectCard
              project={padded[5]}
              index={5}
              total={total}
              direction="left"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
