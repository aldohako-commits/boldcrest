import { set, unset, useFormValue, type ObjectItemProps } from 'sanity'
import { Box, Button, Flex, Text } from '@sanity/ui'
import { PlayIcon, SplitVerticalIcon } from '@sanity/icons'

/**
 * Custom array-item renderer for media items. The default row (preview, drag
 * handle, the ⋯ menu, open-on-click) is passed straight through untouched — we
 * only add one-click toggle buttons to the right of each collapsed row:
 *   • all items → "Side by side" (writes `half`); two consecutive `half` items
 *     (videos or images) render as a no-gap two-column row on the site.
 *   • videos also → "Feature player" (writes `feature`); a feature video renders
 *     as a real player with sound + controls instead of a silent background loop.
 *
 * Sanity's built-in ⋯ menu (Remove / Copy / Duplicate / Add …) is not
 * extensible via props, so the toggles live as their own row buttons. They write
 * the same fields as the in-item toggles.
 */
export function MediaArrayItem(props: ObjectItemProps) {
  const { open, readOnly, inputProps } = props
  const value = props.value as unknown as {
    _type?: string
    _key?: string
    half?: boolean
    feature?: boolean
  }
  const isVideo = value?._type === 'videoMedia'

  // 1-based position of this item within the media array, shown to the left of the
  // row so slides are easy to reference ("slide 4"). Resolved by finding this
  // item's _key in the parent array (the item component isn't given its index).
  const arrayValue = useFormValue(props.path.slice(0, -1)) as
    | Array<{ _key?: string }>
    | undefined
  const index = Array.isArray(arrayValue)
    ? arrayValue.findIndex((m) => m?._key === value?._key)
    : -1
  const number = index >= 0 ? index + 1 : null

  // When the item is open (full edit form) leave it completely alone.
  if (open || readOnly) return props.renderDefault(props)

  const toggle = (field: 'half' | 'feature', on: boolean) =>
    inputProps.onChange(on ? unset([field]) : set(true, [field]))

  const buttons: Array<{
    field: 'half' | 'feature'
    on: boolean
    icon: typeof PlayIcon
    title: string
    label: string
  }> = []

  // Videos: feature-player toggle (left of side-by-side).
  if (isVideo) {
    const on = value?.feature === true
    buttons.push({
      field: 'feature',
      on,
      icon: PlayIcon,
      title: on
        ? 'Full Player is ON — click for silent background video'
        : 'Make this a Full Player (sound & controls)',
      label: 'Toggle full player',
    })
  }

  // All items: side-by-side toggle (always rightmost, consistent position).
  {
    const on = value?.half === true
    buttons.push({
      field: 'half',
      on,
      icon: SplitVerticalIcon,
      title: on
        ? 'Side by Side is ON — click to make full width'
        : 'Make this Side by Side (pair it with the next item)',
      label: 'Toggle side by side',
    })
  }

  return (
    <Flex align="center" gap={1}>
      {number != null && (
        <Box
          paddingLeft={2}
          // pointer-events: none so the number can never intercept the drag
          // handle / row interactions next to it.
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
      {buttons.map((b) => (
        <Button
          key={b.field}
          mode="bleed"
          padding={3}
          fontSize={1}
          icon={b.icon}
          tone={b.on ? 'primary' : 'default'}
          selected={b.on}
          onClick={() => toggle(b.field, b.on)}
          title={b.title}
          aria-label={b.label}
        />
      ))}
    </Flex>
  )
}
