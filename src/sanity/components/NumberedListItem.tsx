import type { PreviewProps } from 'sanity'
import { Box, Flex, Text } from '@sanity/ui'
import { useOrderPosition } from './useOrderPositions'

/**
 * Custom list-row preview that adds a position-number COLUMN to the left of the
 * normal row (thumbnail + title + subtitle stay exactly as Sanity renders them —
 * the title is NOT modified). Mirrors the number column on media items.
 *
 * The number is the LIVE position in the drag-and-drop (orderRank) order, so it
 * updates right after you reorder. Falls back to the static `order` field while
 * the live order loads, so the column is never blank. `id`/`docType`/`order`
 * are passed through the schema's `preview.prepare`.
 */
export function NumberedListItem(props: PreviewProps) {
  const { order, id, docType } = props as PreviewProps & {
    order?: number
    id?: string
    docType?: string
  }
  const live = useOrderPosition(docType, id)
  const number = live ?? (typeof order === 'number' ? order : null)
  return (
    <Flex align="center" gap={2}>
      {number != null && (
        <Box
          paddingLeft={1}
          // pointer-events:none so the number never intercepts the drag handle.
          style={{
            minWidth: '2.5ch',
            textAlign: 'right',
            flexShrink: 0,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <Text size={1} muted weight="medium">
            {number}
          </Text>
        </Box>
      )}
      <Box flex={1} style={{ minWidth: 0 }}>
        {props.renderDefault(props)}
      </Box>
    </Flex>
  )
}
