'use client'

import { useState } from 'react'
import { Box, Card, Flex, Text } from '@sanity/ui'
import { useClient } from 'sanity'
import { OrderableDocumentList } from '@sanity/orderable-document-list'

type View = 'both' | 'published' | 'drafts'

// GROQ status filters applied on top of the orderable list.
//  - both:      default — every document (drag-orderable, this is the default)
//  - published: documents that have a published (live) version
//  - drafts:    documents that currently have a draft (offline / unpublished)
const FILTERS: Record<View, string | undefined> = {
  both: undefined,
  published: '!(_id in path("drafts.**"))',
  drafts: '_id in path("drafts.**")',
}

const TABS: { key: View; label: string; dot?: string }[] = [
  { key: 'both', label: 'Both' },
  { key: 'published', label: 'Published', dot: '#3ddc84' },
  { key: 'drafts', label: 'Drafts', dot: '#f5a623' },
]

/**
 * A Published / Drafts / Both filter bar rendered above a drag-orderable list.
 * "Both" is the default and keeps full drag-to-reorder; the other two views
 * filter by publish status. Mounted from the structure via
 *   S.component(OrderableListWithStatusFilter).options({ type })
 */
export function OrderableListWithStatusFilter(props: {
  options?: { type?: string }
}) {
  const type = props?.options?.type as string
  const client = useClient({ apiVersion: '2024-01-01' })
  const [view, setView] = useState<View>('both')

  return (
    <Flex direction="column" style={{ height: '100%', minHeight: 0 }}>
      <Card paddingX={3} paddingY={2} borderBottom tone="default" style={{ flex: 'none' }}>
        <Flex align="center" style={{ gap: 6 }}>
          {TABS.map((tab) => {
            const active = view === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setView(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  background: active
                    ? 'var(--card-muted-bg-color, #2a2a2a)'
                    : 'transparent',
                  transition: 'background 120ms ease',
                }}
              >
                {tab.dot && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: tab.dot,
                      opacity: active ? 1 : 0.5,
                      flex: 'none',
                    }}
                  />
                )}
                <Text size={1} weight={active ? 'semibold' : 'regular'} muted={!active}>
                  {tab.label}
                </Text>
              </button>
            )
          })}
        </Flex>
      </Card>

      <Box style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {/* key forces a clean remount when the filter changes.
            currentVersion:'drafts' = the standard merged (draft-over-published)
            view; required so the plugin's query doesn't fall back to its
            release-perspective branch (sanity::partOfRelease + an undefined
            $currentVersion param), which errors with releases disabled. Our
            Both/Published/Drafts filter then layers on top of that. */}
        <OrderableDocumentList
          key={view}
          options={{ type, client, filter: FILTERS[view], currentVersion: 'drafts' }}
        />
      </Box>
    </Flex>
  )
}
