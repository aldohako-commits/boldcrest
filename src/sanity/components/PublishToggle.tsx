'use client'

import { useCallback } from 'react'
import { Box, Flex, Text, useToast } from '@sanity/ui'
import {
  useDocumentOperation,
  useEditState,
  useFormValue,
  type InputProps,
} from 'sanity'

/**
 * Clickable status pill at the top of the document form. Shows the current state
 * and flips it on click:
 *   • green  "Published"  → click "Move to draft" to unpublish (go offline)
 *   • orange "Draft"      → click "Publish" to publish (go live)
 *
 * Uses Sanity's official document operations, so it matches the built-in Publish
 * button / "Unpublish" menu action. Sanity's own perspective switcher is hidden
 * via studio.css, so this is the single status control.
 */
export function PublishToggle(props: InputProps) {
  const id = (useFormValue(['_id']) as string | undefined) || ''
  const publishedId = id.replace(/^drafts\./, '')
  const typeName = props.schemaType.name

  const editState = useEditState(publishedId, typeName)
  const { publish, unpublish } = useDocumentOperation(publishedId, typeName)
  const toast = useToast()

  const isPublished = Boolean(editState?.published)
  const color = isPublished ? '#3ddc84' : '#f5a623' // green / orange
  const label = isPublished ? 'Published' : 'Draft'
  const actionLabel = isPublished ? 'Move to draft' : 'Publish'
  const actionHint = isPublished
    ? 'Click to unpublish — take it offline (draft)'
    : 'Click to publish — make it live'

  const toggle = useCallback(() => {
    if (isPublished) {
      if (unpublish.disabled) {
        toast.push({
          status: 'warning',
          title: 'Can’t move to draft',
          description: String(unpublish.disabled),
        })
        return
      }
      unpublish.execute()
      toast.push({ status: 'success', title: 'Moved to draft — now offline' })
    } else {
      if (publish.disabled) {
        toast.push({
          status: 'warning',
          title: 'Can’t publish yet',
          description: String(publish.disabled),
        })
        return
      }
      publish.execute()
      toast.push({ status: 'success', title: 'Published — now live' })
    }
  }, [isPublished, publish, unpublish, toast])

  return (
    <Box>
      <Flex align="center" style={{ gap: 10, marginBottom: 20 }}>
        <button
          type="button"
          onClick={toggle}
          title={actionHint}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 16px',
            borderRadius: 999,
            border: '1px solid var(--card-border-color, #2a2a2a)',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <span
            style={{ width: 8, height: 8, borderRadius: 999, background: color, flex: 'none' }}
          />
          <Text size={1} weight="semibold" style={{ color }}>
            {label}
          </Text>
        </button>

        <button
          type="button"
          onClick={toggle}
          title={actionHint}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '4px 6px',
          }}
        >
          <Text size={1} muted>
            {actionLabel} →
          </Text>
        </button>
      </Flex>
      {props.renderDefault(props)}
    </Box>
  )
}
