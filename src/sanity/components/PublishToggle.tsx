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
 * A real Published / Draft segmented toggle rendered at the top of the document
 * form. Sanity's built-in pill in the document header is only a *view* switcher
 * (it changes which version you're looking at, not the document's state). This
 * one actually changes state:
 *   - click "Published" → publishes the current draft (document goes live)
 *   - click "Draft"     → unpublishes (document goes offline, kept as a draft)
 *
 * Wired through Sanity's official document operations, so it behaves exactly
 * like the built-in Publish button / "Unpublish" menu action.
 */
export function PublishToggle(props: InputProps) {
  const id = (useFormValue(['_id']) as string | undefined) || ''
  // useEditState / useDocumentOperation always want the PUBLISHED id (no draft prefix)
  const publishedId = id.replace(/^drafts\./, '')
  const typeName = props.schemaType.name

  const editState = useEditState(publishedId, typeName)
  const { publish, unpublish } = useDocumentOperation(publishedId, typeName)
  const toast = useToast()

  const isPublished = Boolean(editState?.published)
  const hasDraft = Boolean(editState?.draft)

  const goPublished = useCallback(() => {
    // Nothing pending and already live → no-op
    if (isPublished && !hasDraft) return
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
  }, [isPublished, hasDraft, publish, toast])

  const goDraft = useCallback(() => {
    if (!isPublished) return
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
  }, [isPublished, unpublish, toast])

  return (
    <Box>
      <Flex
        align="center"
        style={{
          gap: 4,
          padding: 4,
          marginBottom: 20,
          width: 'fit-content',
          border: '1px solid var(--card-border-color, #2a2a2a)',
          borderRadius: 999,
        }}
      >
        <Segment
          active={isPublished}
          dotColor="#3ddc84"
          label={hasDraft && isPublished ? 'Published •' : 'Published'}
          onClick={goPublished}
        />
        <Segment
          active={!isPublished}
          dotColor="#9aa0a6"
          label="Draft"
          onClick={goDraft}
        />
      </Flex>
      {props.renderDefault(props)}
    </Box>
  )
}

function Segment({
  active,
  dotColor,
  label,
  onClick,
}: {
  active: boolean
  dotColor: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 16px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--card-muted-bg-color, #2a2a2a)' : 'transparent',
        transition: 'background 120ms ease',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: dotColor,
          opacity: active ? 1 : 0.55,
          flex: 'none',
        }}
      />
      <Text size={1} weight={active ? 'semibold' : 'regular'} muted={!active}>
        {label}
      </Text>
    </button>
  )
}
