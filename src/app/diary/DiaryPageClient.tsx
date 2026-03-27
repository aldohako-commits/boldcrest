'use client'

import { useState, useMemo, useRef } from 'react'
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

const CATEGORY_COLORS: Record<string, string> = {
  Branding: '#DA291C',
  Design: '#f9b311',
  Motion: '#004c95',
  Culture: '#DA291C',
  Strategy: '#f9b311',
}

function DiaryCard({ post }: { post: DiaryPost }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const color = CATEGORY_COLORS[post.category || ''] || '#DA291C'

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <Link href={`/diary/${post.slug?.current}`} className="group block">
      {/* Image container with circle-reveal hover */}
      <div
        ref={cardRef}
        className="relative aspect-square overflow-hidden rounded-2xl bg-[#1a1a1a]"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {post.coverImage?.asset ? (
          <Image
            loader={sanityImageLoader}
            src={urlFor(post.coverImage).width(800).height(800).url()}
            alt={post.title}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="px-4 text-center text-[1.2rem] font-bold uppercase leading-[1.1] tracking-[-0.02em] text-white/10 md:px-8 md:text-[3rem]">
              {post.title}
            </span>
          </div>
        )}

        {/* Circle reveal overlay on hover — "Read More" marquee */}
        <motion.div
          className="pointer-events-none absolute flex items-center justify-center overflow-hidden rounded-full"
          style={{
            left: mouse.x,
            top: mouse.y,
            x: '-50%',
            y: '-50%',
            backgroundColor: '#0a0a0a',
          }}
          animate={{
            width: hovering ? 600 : 0,
            height: hovering ? 600 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex shrink-0 animate-[marquee_4s_linear_infinite] items-center gap-8 whitespace-nowrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="text-[1.2rem] font-semibold tracking-[0.1em] text-white"
              >
                Read More
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Info below image */}
      <div className="mt-3 md:mt-5">
        {post.category && (
          <span
            className="mb-2 inline-block rounded-[var(--radius-pill)] border border-white/15 px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-text-tertiary transition-all duration-200 md:mb-3 md:px-3 md:py-1 md:text-[0.6rem]"
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = color
              el.style.borderColor = color
              el.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = 'transparent'
              el.style.borderColor = ''
              el.style.color = ''
            }}
          >
            {post.category}
          </span>
        )}

        <h3 className="font-display text-[0.85rem] font-bold uppercase leading-[1.3] tracking-[0.02em] text-white transition-colors duration-200 group-hover:text-text-tertiary md:text-[clamp(1rem,1.5vw,1.3rem)]">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-2 hidden text-[0.8rem] leading-[1.6] text-text-secondary md:block">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
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

      {/* Hero */}
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

      {/* Filters */}
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

      {/* Posts Grid */}
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
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              staggerDelay={0.08}
            >
              {filtered.map((post) => (
                <ScrollRevealItem key={post._id}>
                  <DiaryCard post={post} />
                </ScrollRevealItem>
              ))}
            </ScrollRevealStagger>
          )}
        </div>
      </section>
    </main>
  )
}
