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
  thumbnail?: {
    asset: { _ref: string }
  }
}

interface SelectedWorksProps {
  projects: Project[]
}

export default function SelectedWorks({ projects }: SelectedWorksProps) {
  return (
    <section className="px-[var(--gutter)] pt-[var(--space-3xl)] pb-[var(--space-2xl)]">
      <div className="mx-auto max-w-[var(--max-width)]">
        {/* Section Header */}
        <ScrollReveal>
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
                style={{
                  transitionTimingFunction: 'var(--ease-out-expo)',
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

        {/* Portfolio Grid */}
        <ScrollRevealStagger
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
          staggerDelay={0.1}
        >
          {projects.map((project) => (
            <ScrollRevealItem key={project._id}>
              <Link
                href={`/work/${project.slug?.current}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-bg-card"
              >
                {/* Image */}
                {project.thumbnail?.asset ? (
                  <Image
                    loader={sanityImageLoader}
                    src={urlFor(project.thumbnail)
                      .width(800)
                      .height(600)
                      .url()}
                    alt={project.name}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-[0.8s]"
                    style={{
                      transitionTimingFunction: 'var(--ease-out-expo)',
                    }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-bg-card">
                    <div className="h-[60px] w-[60px] rounded-full border-2 border-text-tertiary" />
                  </div>
                )}

                {/* Hover scale */}
                <div className="absolute inset-0 transition-transform duration-[0.8s] group-hover:scale-105" style={{ transitionTimingFunction: 'var(--ease-out-expo)' }} />

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
        </ScrollRevealStagger>
      </div>
    </section>
  )
}
