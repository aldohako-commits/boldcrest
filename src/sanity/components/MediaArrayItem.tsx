import { useCallback } from 'react'
import { set, unset, type ObjectItemProps } from 'sanity'
import { Box, Button, Flex } from '@sanity/ui'
import { SplitVerticalIcon } from '@sanity/icons'

/**
 * Custom array-item renderer for media images. The default row (preview, drag
 * handle, the ⋯ menu, open-on-click) is passed straight through untouched — we
 * only add a one-click "side by side" toggle button to the right of each
 * collapsed row, so you can pair/unpair two images without opening them.
 *
 * Sanity's built-in ⋯ menu (Remove / Copy / Duplicate / Add before/after) is
 * not extensible via props, so the toggle lives as its own row button instead.
 * It writes the same `half` field as the in-image toggle; two consecutive
 * `half` images render as a no-gap two-column row on the site.
 */
export function MediaArrayItem(props: ObjectItemProps) {
  const { open, readOnly, inputProps } = props
  const isHalf = (props.value as unknown as { half?: boolean })?.half === true

  const toggleHalf = useCallback(() => {
    inputProps.onChange(isHalf ? unset(['half']) : set(true, ['half']))
  }, [isHalf, inputProps])

  // When the item is open (full edit form) leave it completely alone.
  if (open || readOnly) return props.renderDefault(props)

  return (
    <Flex align="center" gap={1}>
      <Box flex={1} style={{ minWidth: 0 }}>
        {props.renderDefault(props)}
      </Box>
      <Button
        mode="bleed"
        padding={3}
        fontSize={1}
        icon={SplitVerticalIcon}
        tone={isHalf ? 'primary' : 'default'}
        selected={isHalf}
        onClick={toggleHalf}
        title={
          isHalf
            ? 'Side by side is ON — click to make full width'
            : 'Make this image side by side (pair it with the next one)'
        }
        aria-label="Toggle side by side"
      />
    </Flex>
  )
}
