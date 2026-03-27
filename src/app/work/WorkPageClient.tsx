'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import { PageMorphBlobs, WORK_BLOBS } from '@/components/MorphBlobs'

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
  initialService?: string
  initialIndustry?: string
}

function useInViewOnce(margin = '-50px') {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: margin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [margin])

  return { ref, isVisible }
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { ref, isVisible } = useInViewOnce()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.7,
        delay: Math.min(index % 4, 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={`/work/${project.slug?.current}`}
        className="group block"
      >
        {/* Card container — fixed aspect, overflow hidden */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-card">
          {/* Image — translates UP on hover */}
          {project.thumbnailType === 'video' && project.thumbnailVideo ? (
            <iframe
              src={`https://player.vimeo.com/video/${project.thumbnailVideo.match(/vimeo\.com\/(\d+)/)?.[1]}?background=1&autoplay=1&loop=1&muted=1`}
              className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-[calc(50%+48px)]"
              style={{ border: 'none' }}
              allow="autoplay; fullscreen"
              loading="lazy"
            />
          ) : project.thumbnail?.asset ? (
            <Image
              loader={sanityImageLoader}
              src={urlFor(project.thumbnail)
                .width(1400)
                .height(1050)
                .url()}
              alt={project.name}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform group-hover:-translate-y-12"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-bg-card">
              <div className="h-[60px] w-[60px] rounded-full border-2 border-text-tertiary" />
            </div>
          )}

          {/* Info panel — grows up from bottom on hover */}
          <div
            className="absolute bottom-0 left-0 z-20 w-full origin-bottom scale-y-0 bg-[#0a0a0a] px-5 pt-4 pb-4 transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-y-100"
          >
            {/* Client name */}
            {project.client && (
              <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
                {project.client}
              </span>
            )}

            {/* Tagline */}
            <h3 className="mt-1.5 font-display text-[1.15rem] font-semibold text-text-primary">
              {project.tagline || project.name}
            </h3>

            {/* Industry pill + Services */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {project.industry && (
                <span className="rounded-[var(--radius-pill)] bg-white/10 px-3.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-text-secondary">
                  {project.industry}
                </span>
              )}
              {project.services?.map((service) => (
                <span
                  key={service}
                  className="rounded-[var(--radius-pill)] border border-border px-3.5 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.1em] text-text-tertiary"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function WorkPageClient({ projects, initialService, initialIndustry }: WorkPageClientProps) {
  const [serviceFilter, setServiceFilter] = useState(initialService || 'All')
  const [industryFilter, setIndustryFilter] = useState(initialIndustry || 'All')

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
    <main className="relative">
      <PageMorphBlobs blobs={WORK_BLOBS} />

      {/* ── Hero ── */}
      <section className="px-[var(--gutter)] pt-40 pb-[var(--space-xl)]">
        <div className="flex flex-col gap-[var(--space-xl)] md:flex-row md:items-end md:justify-between">
          <motion.h1
            className="font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Bold Builds Brands<span className="text-accent">.</span>
          </motion.h1>

          {/* Filters */}
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="cursor-pointer appearance-none rounded-[var(--radius-pill)] border border-border bg-transparent px-5 py-[0.6rem] pr-10 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-text-secondary transition-all duration-200 hover:border-text-secondary hover:text-white focus:border-text-secondary focus:text-white focus:outline-none"
              >
                {allServices.map((s) => (
                  <option key={s} value={s} className="bg-bg text-text-primary">
                    {s === 'All' ? 'Service: All' : s}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                width="10" height="10" viewBox="0 0 12 12" fill="none"
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="relative">
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="cursor-pointer appearance-none rounded-[var(--radius-pill)] border border-border bg-transparent px-5 py-[0.6rem] pr-10 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-text-secondary transition-all duration-200 hover:border-text-secondary hover:text-white focus:border-text-secondary focus:text-white focus:outline-none"
              >
                {allIndustries.map((ind) => (
                  <option key={ind} value={ind} className="bg-bg text-text-primary">
                    {ind === 'All' ? 'Industry: All' : ind}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
                width="10" height="10" viewBox="0 0 12 12" fill="none"
              >
                <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-[var(--space-xl)] h-px w-full bg-border" />
      </section>

      {/* ── Project Grid ── */}
      <section className="px-[var(--gutter)] pb-[var(--space-3xl)]">
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:gap-x-8">
          {filtered.map((project, i) => (
            <ProjectCard key={project._id} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-text-tertiary">
            No projects match the selected filters.
          </div>
        )}
      </section>
    </main>
  )
}
