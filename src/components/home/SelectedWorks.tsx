'use client'

import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import {
  ScrollRevealStagger,
  ScrollRevealItem,
} from '@/components/ScrollReveal'
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

function ProjectCard({
  project,
  aspect = 'aspect-[4/3]',
  sizes = '(max-width: 768px) 100vw, 50vw',
}: {
  project: Project
  aspect?: string
  sizes?: string
}) {
  return (
    <Link
      href={`/work/${project.slug?.current}`}
      className={`group relative block ${aspect} overflow-hidden rounded-[var(--radius-lg)] bg-bg-card`}
    >
      {/* Thumbnail */}
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
          className="object-cover transition-transform duration-[0.8s] group-hover:scale-105"
          style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
          sizes={sizes}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-bg-card">
          <div className="h-[60px] w-[60px] rounded-full border-2 border-text-tertiary" />
        </div>
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-[var(--space-lg)] opacity-0 transition-opacity duration-[0.4s] group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)',
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
  )
}

export default function SelectedWorks({ projects }: SelectedWorksProps) {
  // Need at least 1 project to render
  if (!projects.length) return null

  // Duplicate projects to always have at least 6 for the layout
  const padded: Project[] = []
  for (let i = 0; i < 6; i++) {
    padded.push({
      ...projects[i % projects.length],
      _id: projects[i % projects.length]._id + (i >= projects.length ? `-dup-${i}` : ''),
    })
  }

  return (
    <section className="px-[var(--gutter)] pt-[var(--space-lg)] pb-[var(--space-2xl)]">
      <div className="w-full">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-4 h-px bg-border" />
          <div className="mb-[var(--space-xl)] flex items-center justify-between">
            <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Selected Works
            </h2>
            <Link
              href="/work"
              className="group flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-secondary transition-all duration-200 hover:gap-3 hover:text-white"
            >
              See All
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-[0.4s] group-hover:translate-x-1"
                style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
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

        {/* Alternating Grid: full / 2-col / full / 2-col */}
        <ScrollRevealStagger className="flex flex-col gap-6" staggerDelay={0.1}>
          {/* Row 1 — Full width */}
          <ScrollRevealItem>
            <ProjectCard
              project={padded[0]}
              aspect="aspect-[16/7]"
              sizes="100vw"
            />
          </ScrollRevealItem>

          {/* Row 2 — Two columns */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ScrollRevealItem>
              <ProjectCard project={padded[1]} />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ProjectCard project={padded[2]} />
            </ScrollRevealItem>
          </div>

          {/* Row 3 — Full width */}
          <ScrollRevealItem>
            <ProjectCard
              project={padded[3]}
              aspect="aspect-[16/7]"
              sizes="100vw"
            />
          </ScrollRevealItem>

          {/* Row 4 — Two columns */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ScrollRevealItem>
              <ProjectCard project={padded[4]} />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ProjectCard project={padded[5]} />
            </ScrollRevealItem>
          </div>
        </ScrollRevealStagger>
      </div>
    </section>
  )
}
