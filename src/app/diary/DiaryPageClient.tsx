'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'
import ScrollReveal from '@/components/ScrollReveal'
import {
  ScrollRevealStagger,
  ScrollRevealItem,
} from '@/components/ScrollReveal'
import { PageMorphBlobs, DIARY_BLOBS } from '@/components/MorphBlobs'

interface DiaryPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: string
  coverImage?: { asset: { _ref: string } }
  publishedAt?: string
}

interface DiaryPageClientProps {
  posts: DiaryPost[]
}

const categoryColors: Record<string, string> = {
  Branding: '#DA291C',
  Design: '#f9b311',
  Motion: '#004c95',
  Culture: '#DA291C',
  Strategy: '#f9b311',
}

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function DiaryPageClient({ posts }: DiaryPageClientProps) {
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return ['All', ...Array.from(set)]
  }, [posts])

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return posts
    return posts.filter((p) => p.category === activeFilter)
  }, [posts, activeFilter])

  return (
    <main className="relative">
      <PageMorphBlobs blobs={DIARY_BLOBS} />
      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative px-[var(--gutter)] pt-40 pb-[var(--space-xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.p
            className="mb-6 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Diary
          </motion.p>

          <motion.h1
            className="max-w-[900px] font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[1.05]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            The latest from
            <br />
            our world<span className="text-accent">.</span>
          </motion.h1>

          <motion.p
            className="mt-[var(--space-lg)] max-w-[550px] text-[1.1rem] leading-[1.7] text-text-secondary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            Read deeper into what we do, think, and create at BoldCrest.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FILTERS + COUNT
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] pb-[var(--space-lg)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <motion.div
            className="flex flex-wrap items-center gap-6 border-b border-border pb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="text-[0.85rem] text-text-tertiary">
              {filtered.length} {filtered.length === 1 ? 'Result' : 'Results'}
            </span>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`rounded-[var(--radius-pill)] border px-4 py-[0.4rem] text-[0.75rem] font-semibold uppercase tracking-[0.1em] transition-all duration-200 ${
                    activeFilter === cat
                      ? 'border-white bg-white text-bg'
                      : 'border-border text-text-secondary hover:border-text-secondary hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          POSTS GRID
      ═══════════════════════════════════════════ */}
      <section className="px-[var(--gutter)] pb-[var(--space-3xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          {filtered.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-[1rem] text-text-tertiary">
                No posts yet. Check back soon.
              </p>
            </div>
          ) : (
            <ScrollRevealStagger
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              staggerDelay={0.08}
            >
              {filtered.map((post) => (
                <ScrollRevealItem key={post._id}>
                  <Link
                    href={`/diary/${post.slug?.current}`}
                    className="group block"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-bg-card">
                      {post.coverImage?.asset ? (
                        <Image
                          loader={sanityImageLoader}
                          src={urlFor(post.coverImage)
                            .width(800)
                            .height(600)
                            .url()}
                          alt={post.title}
                          fill
                          loading="lazy"
                          className="object-cover transition-transform duration-[0.8s] group-hover:scale-105"
                          style={{
                            transitionTimingFunction: 'var(--ease-out-expo)',
                          }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="h-[60px] w-[60px] rounded-full border-2 border-text-tertiary" />
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="mt-5">
                      {post.category && (
                        <span
                          className="mb-2 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.15em]"
                          style={{
                            color:
                              categoryColors[post.category] ?? 'var(--accent)',
                          }}
                        >
                          {post.category}
                        </span>
                      )}

                      <h2 className="font-display text-[1.3rem] font-bold leading-[1.3] transition-colors duration-300 group-hover:text-accent">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 text-[0.85rem] leading-[1.6] text-text-secondary">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-text-secondary transition-colors duration-300 group-hover:text-accent">
                          Read
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          >
                            <path
                              d="M4 10h12M12 6l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollRevealItem>
              ))}
            </ScrollRevealStagger>
          )}
        </div>
      </section>
    </main>
  )
}
