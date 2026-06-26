import type { PreviewProps } from 'sanity'
import { Box, Flex, Text } from '@sanity/ui'

/**
 * Custom list-row preview that adds a position-number COLUMN to the left of the
 * normal row (thumbnail + title + subtitle stay exactly as Sanity renders them —
 * the title is NOT modified). Mirrors the number column on media items.
 *
 * The number comes from the document's `order` field, passed through the
 * schema's `preview.prepare` as `order`. If it's missing the row renders normally
 * with no number, so this can never break the list.
 */
export function NumberedListItem(props: PreviewProps) {
  const order = (props as PreviewProps & { order?: number }).order
  return (
    <Flex align="center" gap={2}>
      {typeof order === 'number' && (
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
            {order}
          </Text>
        </Box>
      )}
      <Box flex={1} style={{ minWidth: 0 }}>
        {props.renderDefault(props)}
      </Box>
    </Flex>
  )
}
