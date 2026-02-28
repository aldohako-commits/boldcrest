'use client'

import { PortableText, type PortableTextBlock } from '@portabletext/react'

interface ProjectSidebarProps {
  overview?: PortableTextBlock[]
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

export default function ProjectSidebar({
  overview,
  client,
  industry,
  year,
  services,
}: ProjectSidebarProps) {
  return (
    <aside className="top-[120px] self-start max-[959px]:static min-[960px]:sticky">
      {/* Overview */}
      {overview && overview.length > 0 && (
        <>
          <h2 className="mb-[var(--space-sm)] text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-text-tertiary">
            Overview
          </h2>
          <div className="prose-custom text-[0.95rem] leading-[1.8] text-text-secondary">
            <PortableText value={overview} />
          </div>
        </>
      )}

      {/* Divider */}
      <div className="my-[var(--space-lg)] h-px bg-border" />

      {/* Metadata */}
      <dl className="flex flex-col gap-[var(--space-md)]">
        {client && metaItem('Client', client)}
        {industry && metaItem('Industry', industry)}
        {year && metaItem('Year', year)}
        {services && services.length > 0 && metaItem('Services', services)}
      </dl>
    </aside>
  )
}
