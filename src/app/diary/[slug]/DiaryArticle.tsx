'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import { sanityImageLoader } from '@/sanity/lib/loader'

interface DiaryPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: string
  coverImage?: { asset: { _ref: string } }
  body?: any[]
  publishedAt?: string
}

const LOREM_PARAGRAPHS = [
  `Every brand carries weight — the weight of intention, the weight of perception, the weight of every decision that brought it here. What separates the ones that endure from the ones that fade is simple: clarity of purpose. Not aesthetics alone, not trend-chasing, but the discipline to know what you stand for and say it without apology.`,
  `We have seen it across industries and across borders. The brands that move people are not louder — they are sharper. They understand that design is not decoration. It is a language. And like any language, it only works when it communicates something real.`,
  `At BoldCrest, we approach every project as if reputation is on the line — because it is. Ours and yours. The first question is never "what does the client want to see?" but rather "what does the audience need to feel?" That distinction changes everything.`,
  `This is the work we live for: translating ambition into identity, strategy into visuals, and vision into something people remember long after they have scrolled past.`,
  `There is a reason we named ourselves BoldCrest. Bold — because safe design is invisible design. Crest — because we are always climbing, always pushing toward the peak. And that mindset does not stop at the logo. It is in every frame, every word, every pixel.`,
  `The diary exists because we believe in thinking out loud. Not every thought needs to be polished. Some of the best ideas start rough — as sketches, questions, or half-finished arguments. We share them here because the conversation matters more than the conclusion.`,
]

/* Custom Portable Text components for inline images */
const ptComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-16">
          <Image
            loader={sanityImageLoader}
            src={urlFor(value).width(1400).url()}
            alt={value.alt || ''}
            width={1400}
            height={800}
            className="w-full rounded-xl"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </figure>
      )
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-[1.15rem] leading-[1.75] text-text-primary/85">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-12 font-display text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-[1.2] tracking-[-0.02em]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-display text-[1.3rem] font-semibold leading-[1.3]">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-[3px] border-accent pl-6 text-[1.25rem] font-medium italic leading-[1.6] text-text-primary/70">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 transition-colors duration-200 hover:text-accent">
        {children}
      </a>
    ),
  },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function DiaryArticle({ post }: { post: DiaryPost }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(heroRef, { once: true })

  const hasBody = post.body && post.body.length > 0
  const hasCover = !!post.coverImage?.asset

  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} className="px-[var(--gutter)] pt-[var(--space-xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          {/* Cover image */}
          {hasCover && (
            <motion.div
              className="mb-8 overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                loader={sanityImageLoader}
                src={urlFor(post.coverImage!).width(1800).height(1000).url()}
                alt={post.title}
                width={1800}
                height={1000}
                priority
                className="w-full object-cover"
                sizes="(max-width: 768px) 100vw, 1400px"
              />
            </motion.div>
          )}

          {/* Category */}
          {post.category && (
            <motion.h3
              className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {post.category}
            </motion.h3>
          )}

          {/* Title */}
          <motion.h1
            className="max-w-[20ch] font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-text-tertiary"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {post.title}
          </motion.h1>
        </div>
      </section>

      {/* Body */}
      <section className="px-[var(--gutter)] pt-16 pb-[20vh]">
        <div className="mx-auto grid max-w-[var(--max-width)] grid-cols-1 lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-start-3 lg:col-span-8">
            {hasBody ? (
              <PortableText value={post.body!} components={ptComponents} />
            ) : (
              /* Lorem ipsum fallback */
              <>
                {LOREM_PARAGRAPHS.map((text, i) => (
                  <p key={i} className="mb-6 text-[1.15rem] leading-[1.75] text-text-primary/85">
                    {text}
                  </p>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Back to Diary */}
      <section className="border-t border-border px-[var(--gutter)] py-[var(--space-xl)]">
        <div className="mx-auto max-w-[var(--max-width)]">
          <Link
            href="/diary"
            className="group inline-flex items-center gap-3 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-text-tertiary transition-colors duration-300 hover:text-text-primary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180 transition-transform duration-300 group-hover:-translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Diary
          </Link>
        </div>
      </section>
    </main>
  )
}
