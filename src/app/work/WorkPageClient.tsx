'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import ScrollReveal from '@/components/ScrollReveal'
import {
  ScrollRevealStagger,
  ScrollRevealItem,
} from '@/components/ScrollReveal'

interface Project {
  _id: string
  name: string
  slug: { current: string }
  tagline?: string
  client?: string
  industry?: string
  services?: string[]
  thumbnailType?: string
  thumbnail?: {
    asset: { _ref: string }
  }
  thumbnailVideo?: string
}

interface WorkPageClientProps {
  projects: Project[]
}

export default function WorkPageClient({ projects }: WorkPageClientProps) {
  const [serviceFilter, setServiceFilter] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')

  // Extract unique values for filters
  const allServices = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => p.services?.forEach((s) => set.add(s)))
    return ['All', ...Array.from(set)]
  }, [projects])

  const allIndustries = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.industry) set.add(p.industry)
    })
    return ['All', ...Array.from(set)]
  }, [projects])

  // Filter projects
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchService =
        serviceFilter === 'All' || p.services?.includes(serviceFilter)
      const matchIndustry =
        industryFilter === 'All' || p.industry === industryFilter
      return matchService && matchIndustry
    })
  }, [projects, serviceFilter, industryFilter])

  return (
    <main>
      {/* Hero */}
      <section className="relative px-[var(--gutter)] pt-40 pb-[var(--space-2xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <h1 className="max-w-[700px] font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.1] text-text-secondary">
            Our creations, skillfully forged through the years
            <span className="text-accent">.</span>
          </h1>

          {/* Filters */}
          <div className="mt-[var(--space-xl)] flex flex-wrap gap-4">
            {/* Service filter */}
            <div className="relative">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="cursor-pointer appearance-none rounded-[var(--radius-pill)] border border-border bg-transparent px-5 py-[0.6rem] pr-10 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-text-secondary transition-all duration-200 hover:border-text-secondary hover:text-white focus:border-text-secondary focus:text-white focus:outline-none"
              >
                {allServices.map((s) => (
                  <option key={s} value={s} className="bg-bg text-text-primary">
                    {s === 'All' ? 'Service: All' : s}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 5l3 3 3-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Industry filter */}
            <div className="relative">
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="cursor-pointer appearance-none rounded-[var(--radius-pill)] border border-border bg-transparent px-5 py-[0.6rem] pr-10 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-text-secondary transition-all duration-200 hover:border-text-secondary hover:text-white focus:border-text-secondary focus:text-white focus:outline-none"
              >
                {allIndustries.map((ind) => (
                  <option
                    key={ind}
                    value={ind}
                    className="bg-bg text-text-primary"
                  >
                    {ind === 'All' ? 'Industry: All' : ind}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 5l3 3 3-3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid — Stacked */}
      <section className="px-[var(--gutter)] pb-[var(--space-3xl)] pt-[var(--space-xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <ScrollRevealStagger
            className="flex flex-col gap-8"
            staggerDelay={0.12}
          >
            {filtered.map((project) => (
              <ScrollRevealItem key={project._id}>
                <Link
                  href={`/work/${project.slug?.current}`}
                  className="group relative block aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] bg-bg-card max-md:aspect-[4/3]"
                >
                  {/* Thumbnail */}
                  {project.thumbnailType === 'video' && project.thumbnailVideo ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${project.thumbnailVideo.match(/vimeo\.com\/(\d+)/)?.[1]}?background=1&autoplay=1&loop=1&muted=1`}
                      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.2] object-cover transition-transform duration-[0.8s] group-hover:scale-[1.3]"
                      style={{ transitionTimingFunction: 'var(--ease-out-expo)', border: 'none' }}
                      allow="autoplay; fullscreen"
                      loading="lazy"
                    />
                  ) : project.thumbnail?.asset ? (
                    <Image
                      loader={sanityImageLoader}
                      src={urlFor(project.thumbnail)
                        .width(1400)
                        .height(788)
                        .url()}
                      alt={project.name}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-[0.8s] group-hover:scale-105"
                      style={{
                        transitionTimingFunction: 'var(--ease-out-expo)',
                      }}
                      sizes="100vw"
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
              </ScrollRevealItem>
            ))}

            {filtered.length === 0 && (
              <div className="py-20 text-center text-text-tertiary">
                No projects match the selected filters.
              </div>
            )}
          </ScrollRevealStagger>
        </div>
      </section>
    </main>
  )
}
