'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
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
          {/* Image — translates UP on hover (desktop only) */}
          {project.thumbnailType === 'video' && project.thumbnailVideo ? (
            <iframe
              src={`https://player.vimeo.com/video/${project.thumbnailVideo.match(/vimeo\.com\/(\d+)/)?.[1]}?background=1&autoplay=1&loop=1&muted=1`}
              className="pointer-events-none absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 md:transition-transform md:duration-[250ms] md:ease-[cubic-bezier(0.4,0,0.2,1)] md:group-hover:-translate-y-[calc(50%+48px)]"
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
              className="object-cover md:transition-transform md:duration-[250ms] md:ease-[cubic-bezier(0.4,0,0.2,1)] md:will-change-transform md:group-hover:-translate-y-12"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-bg-card">
              <div className="h-[60px] w-[60px] rounded-full border-2 border-text-tertiary" />
            </div>
          )}

          {/* Info panel — grows up from bottom on hover (desktop only) */}
          <div
            className="absolute bottom-0 left-0 z-20 hidden w-full origin-bottom scale-y-0 bg-[#0a0a0a] px-5 pt-4 pb-4 transition-transform duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-y-100 md:block"
          >
            {project.client && (
              <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
                {project.client}
              </span>
            )}
            <h3 className="mt-1.5 font-display text-[1.15rem] font-semibold text-text-primary">
              {project.tagline || project.name}
            </h3>
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

        {/* Mobile info — always visible below card */}
        <div className="mt-3 md:hidden">
          {project.client && (
            <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
              {project.client}
            </span>
          )}
          <h3 className="mt-1 font-display text-[1rem] font-semibold text-text-primary">
            {project.tagline || project.name}
          </h3>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {project.industry && (
              <span className="rounded-[var(--radius-pill)] bg-white/10 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-text-secondary">
                {project.industry}
              </span>
            )}
            {project.services?.map((service) => (
              <span
                key={service}
                className="rounded-[var(--radius-pill)] border border-border px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-text-tertiary"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function InlineFilter({
  openFilter,
  setOpenFilter,
  serviceFilter,
  setServiceFilter,
  industryFilter,
  setIndustryFilter,
  allServices,
  allIndustries,
}: {
  openFilter: 'services' | 'industry' | null
  setOpenFilter: (v: 'services' | 'industry' | null) => void
  serviceFilter: string
  setServiceFilter: (v: string) => void
  industryFilter: string
  setIndustryFilter: (v: string) => void
  allServices: string[]
  allIndustries: string[]
}) {
  const labelClass =
    'text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-text-secondary cursor-pointer transition-colors duration-200 hover:text-white'
  const itemClass =
    'text-[0.7rem] font-medium uppercase tracking-[0.1em] text-text-tertiary cursor-pointer transition-colors duration-200 hover:text-white whitespace-nowrap'

  const items = openFilter === 'services'
    ? allServices.filter((s) => s !== 'All')
    : allIndustries.filter((s) => s !== 'All')

  const handleSelect = (value: string) => {
    if (openFilter === 'services') {
      setServiceFilter(value === serviceFilter ? 'All' : value)
    } else {
      setIndustryFilter(value === industryFilter ? 'All' : value)
    }
    setOpenFilter(null)
  }

  return (
    <motion.div
      className="mt-6 flex items-center gap-5 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {openFilter === null ? (
          /* ── Collapsed: show both labels ── */
          <motion.div
            key="collapsed"
            className="flex items-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => setOpenFilter('services')}
              className={labelClass}
            >
              Services{serviceFilter !== 'All' ? `: ${serviceFilter}` : ''}
            </button>
            <span className="text-[0.5rem] text-text-tertiary">/</span>
            <button
              onClick={() => setOpenFilter('industry')}
              className={labelClass}
            >
              Industry{industryFilter !== 'All' ? `: ${industryFilter}` : ''}
            </button>
          </motion.div>
        ) : (
          /* ── Expanded: label + items + X ── */
          <motion.div
            key={`expanded-${openFilter}`}
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-[0.75rem] font-semibold uppercase tracking-[0.15em] text-white whitespace-nowrap">
              {openFilter === 'services' ? 'Services' : 'Industry'}
            </span>
            <span className="h-3 w-px bg-border" />
            <div className="flex items-center gap-3 overflow-x-auto">
              {items.map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => handleSelect(item)}
                  className={itemClass}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {item}
                </motion.button>
              ))}
              <motion.button
                onClick={() => setOpenFilter(null)}
                className="ml-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-border text-text-tertiary transition-colors duration-200 hover:border-text-secondary hover:text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: items.length * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function WorkPageClient({ projects, initialService, initialIndustry }: WorkPageClientProps) {
  const [serviceFilter, setServiceFilter] = useState(initialService || 'All')
  const [industryFilter, setIndustryFilter] = useState(initialIndustry || 'All')
  const [openFilter, setOpenFilter] = useState<'services' | 'industry' | null>(null)

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
      <section className="flex h-[65vh] min-h-[500px] flex-col justify-end px-[var(--gutter)]">
        <div>
          <motion.p
            className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Our Work
          </motion.p>

          {/* Title row — h1 left, description right-aligned to bottom of h1 */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.h1
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1] tracking-[-0.03em] text-white"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Bold<br />
              Builds<br />
              Brands<span className="text-accent">.</span>
            </motion.h1>

            <motion.p
              className="max-w-[400px] text-[0.95rem] leading-[1.7] text-text-secondary md:text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              A curated collection of brand identities, campaigns, and visual systems built for ambitious brands. Every project is a partnership — crafted with intention, delivered with precision.
            </motion.p>
          </div>

          {/* Filters */}
          <InlineFilter
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            serviceFilter={serviceFilter}
            setServiceFilter={setServiceFilter}
            industryFilter={industryFilter}
            setIndustryFilter={setIndustryFilter}
            allServices={allServices}
            allIndustries={allIndustries}
          />
        </div>

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-border" />
      </section>

      {/* ── Project Grid ── */}
      <section className="px-[var(--gutter)] pt-[var(--space-xl)] pb-[var(--space-3xl)]">
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
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
