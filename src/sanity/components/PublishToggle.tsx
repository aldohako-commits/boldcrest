'use client'

import { Box, Flex, Text } from '@sanity/ui'
import { useEditState, useFormValue, type InputProps } from 'sanity'

/**
 * Read-only status pill shown once at the top of every content document form.
 * A SINGLE indicator reflecting the document's actual state:
 *   • green  "Published"  → a published (live) version exists
 *   • orange "Draft"      → no published version yet (offline / unpublished)
 *
 * Sanity's built-in two-option perspective switcher in the pane header is hidden
 * via CSS (src/app/studio/studio.css) so this is the only status shown.
 * Publishing / unpublishing is done with the built-in Publish button and the
 * "Unpublish" item in the ⋯ menu.
 */
export function PublishToggle(props: InputProps) {
  const id = (useFormValue(['_id']) as string | undefined) || ''
  const publishedId = id.replace(/^drafts\./, '')
  const typeName = props.schemaType.name

  const editState = useEditState(publishedId, typeName)
  const isPublished = Boolean(editState?.published)

  const color = isPublished ? '#3ddc84' : '#f5a623' // green / orange
  const label = isPublished ? 'Published' : 'Draft'

  return (
    <Box>
      <Flex
        align="center"
        style={{
          gap: 8,
          padding: '7px 16px',
          marginBottom: 20,
          width: 'fit-content',
          border: '1px solid var(--card-border-color, #2a2a2a)',
          borderRadius: 999,
        }}
      >
        <span
          style={{ width: 8, height: 8, borderRadius: 999, background: color, flex: 'none' }}
        />
        <Text size={1} weight="semibold" style={{ color }}>
          {label}
        </Text>
      </Flex>
      {props.renderDefault(props)}
    </Box>
  )
}
