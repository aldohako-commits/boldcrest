'use client'

import { PortableText, type PortableTextBlock } from '@portabletext/react'

interface ProjectSidebarProps {
  overview?: PortableTextBlock[]
  challenge?: PortableTextBlock[]
  solution?: PortableTextBlock[]
  client?: string
  industry?: string
  year?: string
  services?: string[]
}

const metaItem = (label: string, value: string | string[]) => (
  <div>
    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-text-tertiary">
      {label}
    </dt>
    <dd className="mt-1 text-[0.95rem] text-text-secondary">
      {Array.isArray(value) ? value.join(', ') : value}
    </dd>
  </div>
)

const textBlock = (title: string, content: PortableTextBlock[]) => (
  <>
    <h2 className="mb-[var(--space-sm)] text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
      {title}
    </h2>
    <div className="prose-custom text-[0.95rem] leading-[1.8] text-text-secondary">
      <PortableText value={content} />
    </div>
  </>
)

export default function ProjectSidebar({
  overview,
  challenge,
  solution,
  client,
  industry,
  year,
  services,
}: ProjectSidebarProps) {
  return (
    <aside className="top-[120px] self-start max-[959px]:static min-[960px]:sticky">
      {overview && overview.length > 0 && textBlock('Overview', overview)}

      {challenge && challenge.length > 0 && (
        <div className="mt-[var(--space-lg)]">
          {textBlock('Challenge', challenge)}
        </div>
      )}

      {solution && solution.length > 0 && (
        <div className="mt-[var(--space-lg)]">
          {textBlock('Solution', solution)}
        </div>
      )}

      {/* Divider */}
      <div className="my-[var(--space-lg)] h-px bg-border" />

      {/* Metadata */}
      <dl className="flex flex-col gap-[var(--space-md)]">
        {client && metaItem('Client', client)}
        {industry && metaItem('Industry', industry)}
        {services && services.length > 0 && metaItem('Services', services)}
      </dl>
    </aside>
  )
}
