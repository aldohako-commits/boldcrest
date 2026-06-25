import { useCallback } from 'react'
import { set, unset, type ObjectItemProps } from 'sanity'
import { Box, Button, Flex } from '@sanity/ui'
import { PlayIcon, SplitVerticalIcon } from '@sanity/icons'

/**
 * Custom array-item renderer for media items. The default row (preview, drag
 * handle, the ⋯ menu, open-on-click) is passed straight through untouched — we
 * only add a one-click toggle button to the right of each collapsed row:
 *   • images → "Side by side" (writes `half`); two consecutive half images
 *     render as a no-gap two-column row on the site.
 *   • videos → "Feature player" (writes `feature`); a feature video renders as
 *     a real player with sound + controls instead of a silent background loop.
 *
 * Sanity's built-in ⋯ menu (Remove / Copy / Duplicate / Add …) is not
 * extensible via props, so the toggle lives as its own row button instead. It
 * writes the same field as the in-item toggle.
 */
export function MediaArrayItem(props: ObjectItemProps) {
  const { open, readOnly, inputProps } = props
  const value = props.value as unknown as { _type?: string; half?: boolean; feature?: boolean }
  const isVideo = value?._type === 'videoMedia'
  const field = isVideo ? 'feature' : 'half'
  const isOn = value?.[field] === true

  const toggle = useCallback(() => {
    inputProps.onChange(isOn ? unset([field]) : set(true, [field]))
  }, [isOn, field, inputProps])

  // When the item is open (full edit form) leave it completely alone.
  if (open || readOnly) return props.renderDefault(props)

  const title = isVideo
    ? isOn
      ? 'Feature player is ON — click for silent background video'
      : 'Make this a feature player (sound & controls)'
    : isOn
      ? 'Side by side is ON — click to make full width'
      : 'Make this image side by side (pair it with the next one)'

  return (
    <Flex align="center" gap={1}>
      <Box flex={1} style={{ minWidth: 0 }}>
        {props.renderDefault(props)}
      </Box>
      <Button
        mode="bleed"
        padding={3}
        fontSize={1}
        icon={isVideo ? PlayIcon : SplitVerticalIcon}
        tone={isOn ? 'primary' : 'default'}
        selected={isOn}
        onClick={toggle}
        title={title}
        aria-label={isVideo ? 'Toggle feature player' : 'Toggle side by side'}
      />
    </Flex>
  )
}
