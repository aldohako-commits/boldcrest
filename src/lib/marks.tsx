import { Fragment, type ReactNode } from 'react'

// Trademark / registered / copyright / service-mark glyphs render at the full
// font size, which looks huge in large headings. Wrap them so they shrink and
// sit as a small superscript instead.
const MARK = /[®™©℠]/

export function withSmallMarks(text?: string | null): ReactNode {
  if (!text) return text ?? null
  return text.split(/([®™©℠])/g).map((part, i) =>
    MARK.test(part) ? (
      // Smaller than before (0.42em) and pinned so its TOP aligns with the
      // cap-top of the surrounding text. We override <sup>'s default `super`
      // (which sat the mark a touch low) with an explicit relative lift tuned to
      // the font's cap height. `inline-block` makes the lift measure cleanly.
      <sup
        key={i}
        className="inline-block align-baseline text-[0.38em] font-normal tracking-normal"
        style={{ transform: 'translateY(-0.62em)' }}
      >
        {part}
      </sup>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}
