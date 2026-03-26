'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import ScrollReveal from '@/components/ScrollReveal'

interface Project {
  _id: string
  name: string
  slug: { current: string }
  client?: string
  tagline?: string
  industry?: string
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
  index,
}: {
  project: Project
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.9,
        delay: index % 2 === 0 ? 0 : 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/work/${project.slug?.current}`} className="group block">
        {/* Image container — lifts up on hover */}
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-card transition-transform duration-[0.6s] group-hover:-translate-y-3"
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {project.thumbnailType === 'video' && project.thumbnailVideo ? (
            <iframe
              src={`https://player.vimeo.com/video/${project.thumbnailVideo.match(/vimeo\.com\/(\d+)/)?.[1]}?background=1&autoplay=1&loop=1&muted=1`}
              className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-[0.8s] group-hover:scale-[1.03]"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                border: 'none',
              }}
              allow="autoplay; fullscreen"
              loading="lazy"
            />
          ) : project.thumbnail?.asset ? (
            <Image
              loader={sanityImageLoader}
              src={urlFor(project.thumbnail).width(1200).height(900).url()}
              alt={project.name}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-[0.8s] group-hover:scale-[1.04]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-bg-card">
              <div className="h-[60px] w-[60px] rounded-full border-2 border-text-tertiary" />
            </div>
          )}
        </div>

        {/* Info below image — slides in on hover */}
        <div
          className="grid grid-rows-[0fr] transition-all duration-[0.5s] group-hover:grid-rows-[1fr]"
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <div className="overflow-hidden">
            <div className="pt-4 pb-2">
              {/* Client name */}
              {project.client && (
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
                  {project.client}
                </span>
              )}

              {/* Tagline (falls back to project name) */}
              <h3 className="mt-1 font-display text-[0.95rem] font-semibold text-text-primary">
                {project.tagline || project.name}
              </h3>

              {/* Industry pill (filled) + Services (outlined) */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {project.industry && (
                  <span className="rounded-[var(--radius-pill)] bg-white/10 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-text-secondary">
                    {project.industry}
                  </span>
                )}
                {project.services?.map((service) => (
                  <span
                    key={service}
                    className="rounded-[var(--radius-pill)] border border-border px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-text-tertiary transition-all duration-300 hover:border-white/40 hover:text-text-secondary"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function SelectedWorks({ projects }: SelectedWorksProps) {
  if (!projects.length) return null

  // Use up to 6 projects, cycling if needed
  const padded: Project[] = []
  for (let i = 0; i < Math.min(6, Math.max(projects.length, 6)); i++) {
    padded.push({
      ...projects[i % projects.length],
      _id:
        projects[i % projects.length]._id +
        (i >= projects.length ? `-dup-${i}` : ''),
    })
  }

  return (
    <section className="px-[var(--gutter)] pb-[var(--space-2xl)]">
      <div className="w-full">
        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-4 h-px bg-border" />
          <div className="mb-[var(--space-lg)] flex items-center justify-between">
            <h2 className="font-display text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Selected Works
            </h2>
            <Link
              href="/work"
              className="group/link flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-secondary transition-all duration-[0.5s] hover:gap-3 hover:text-white"
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
                  className="flex flex-col transition-transform duration-[0.5s] group-hover/link:-translate-y-1/2"
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
                className="transition-transform duration-[0.5s] group-hover/link:translate-x-1"
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

        {/* 2-column grid */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
          {padded.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
