'use client'

import { useEffect, useState } from 'react'
import { blockedCount, playAll, subscribe } from './vimeoPlayAll'

// One floating control that plays every frozen Vimeo clip on the page. Appears only
// while at least one clip is blocked (autoplay denied — typically iOS Low Power
// Mode); tapping plays them all and it hides itself as they start.
export default function VideoPlayAllButton() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const update = () => setCount(blockedCount())
    update()
    return subscribe(update)
  }, [])

  if (count === 0) return null

  return (
    <button
      type="button"
      onClick={playAll}
      aria-label="Play all videos"
      className="group fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-black/65 py-1.5 pl-4 pr-1.5 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/80"
    >
      <span className="whitespace-nowrap text-[12px] font-medium leading-none tracking-wide">
        Tap to play
      </span>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-black transition-transform group-active:scale-95">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path d="M5 3.5v9l7-4.5-7-4.5z" />
        </svg>
      </span>
    </button>
  )
}
