import { set, unset, type ObjectItemProps } from 'sanity'
import { Box, Button, Flex } from '@sanity/ui'
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
    half?: boolean
    feature?: boolean
  }
  const isVideo = value?._type === 'videoMedia'

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
