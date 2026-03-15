'use client'

import { useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

/*
  Organic morph blobs — absolutely positioned SVG shapes scattered
  throughout the page. Each blob smoothly morphs its shape driven
  by scroll position, interpolating between two organic path states.
  They pulse in scale when entering the viewport.
*/

// ── Path interpolation utility ──
// Extracts all numbers from an SVG path string, lerps them, and
// reconstructs the path with the interpolated values.
function extractNumbers(path: string): number[] {
  const nums: number[] = []
  path.replace(/-?\d+\.?\d*/g, (match) => {
    nums.push(parseFloat(match))
    return match
  })
  return nums
}

function extractTemplate(path: string): string {
  return path.replace(/-?\d+\.?\d*/g, '@@')
}

function interpolatePath(pathA: string, pathB: string, t: number): string {
  const numsA = extractNumbers(pathA)
  const numsB = extractNumbers(pathB)
  const template = extractTemplate(pathA)

  let i = 0
  return template.replace(/@@/g, () => {
    const a = numsA[i] ?? 0
    const b = numsB[i] ?? 0
    i++
    const val = a + (b - a) * t
    return val % 1 === 0 ? String(val) : val.toFixed(2)
  })
}

// ── Blob path pairs ──
const BLOB_PATHS = {
  a1: 'M380,50C420,90,450,160,440,240C430,320,390,400,340,460C290,520,220,560,150,550C80,540,20,480,5,400C-10,320,20,220,70,150C120,80,190,30,260,15C330,0,340,10,380,50Z',
  a2: 'M360,30C410,70,460,140,460,220C460,300,410,380,350,440C290,500,210,540,140,530C70,520,10,460,0,380C-10,300,30,200,80,130C130,60,200,10,270,5C340,0,310,-10,360,30Z',

  b1: 'M50,80C100,30,180,0,250,20C320,40,370,110,380,190C390,270,360,360,300,420C240,480,150,510,80,480C10,450,-20,360,10,280C40,200,0,130,50,80Z',
  b2: 'M70,60C130,10,200,-10,270,20C340,50,390,130,390,210C390,290,340,370,280,430C220,490,140,520,70,490C0,460,-30,370,10,290C50,210,10,110,70,60Z',

  c1: 'M320,40C380,80,430,150,430,230C430,310,380,400,310,450C240,500,150,510,90,470C30,430,-10,350,10,270C30,190,100,110,170,60C240,10,260,0,320,40Z',
  c2: 'M340,20C400,60,450,130,450,210C450,290,400,370,330,430C260,490,170,520,100,490C30,460,-20,380,0,290C20,200,80,120,150,70C220,20,280,-20,340,20Z',

  d1: 'M250,10C310,30,370,90,400,170C430,250,430,350,380,420C330,490,240,530,160,510C80,490,20,410,5,320C-10,230,20,130,80,70C140,10,190,-10,250,10Z',
  d2: 'M270,20C340,50,390,120,410,200C430,280,410,370,360,430C310,490,230,520,150,490C70,460,10,380,0,290C-10,200,30,110,90,60C150,10,200,-10,270,20Z',

  e1: 'M200,5C280,20,350,80,380,160C410,240,400,340,350,410C300,480,210,520,130,500C50,480,-10,400,0,310C10,220,60,140,120,80C180,20,120,-10,200,5Z',
  e2: 'M220,15C300,40,360,110,380,190C400,270,380,360,330,430C280,500,190,530,110,500C30,470,-20,380,0,290C20,200,70,120,140,70C210,20,140,-10,220,15Z',
}

interface BlobConfig {
  pathA: string
  pathB: string
  color: string
  size: number
  style: React.CSSProperties
  blur?: number
  opacity?: number
}

function ScrollBlob({ config }: { config: BlobConfig }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '-5%', once: false })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Smooth scroll-driven morph: 0→1→0 as element scrolls through viewport
  // This creates a forward-and-back morph cycle per scroll pass
  const morphT = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  // Generate the interpolated path reactively
  const morphedPath = useTransform(morphT, (t) =>
    interpolatePath(config.pathA, config.pathB, t)
  )

  // Slight rotation driven by scroll for organic movement
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5])

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none absolute"
      style={{
        ...config.style,
        width: config.size,
        height: config.size,
        zIndex: 0,
        rotate,
      }}
      animate={
        isInView
          ? {
              scale: [0.9, 1.05, 0.95],
              opacity: config.opacity ?? 0.12,
            }
          : { scale: 0.7, opacity: 0 }
      }
      transition={{
        opacity: { duration: 1.2, ease: 'easeOut' },
        scale: {
          duration: 6,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        },
      }}
    >
      <svg
        viewBox="0 0 500 550"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        style={{ filter: `blur(${config.blur ?? 50}px)` }}
      >
        <motion.path
          fill={config.color}
          fillOpacity={1}
          style={{ d: morphedPath }}
        />
      </svg>
    </motion.div>
  )
}

const BLOBS: BlobConfig[] = [
  {
    pathA: BLOB_PATHS.a1,
    pathB: BLOB_PATHS.a2,
    color: '#DA291C',
    size: 700,
    blur: 60,
    opacity: 0.15,
    style: { top: '-100px', right: '-100px' },
  },
  {
    pathA: BLOB_PATHS.b1,
    pathB: BLOB_PATHS.b2,
    color: '#f9b311',
    size: 550,
    blur: 50,
    opacity: 0.1,
    style: { top: '1400px', left: '-80px' },
  },
  {
    pathA: BLOB_PATHS.c1,
    pathB: BLOB_PATHS.c2,
    color: '#004c95',
    size: 600,
    blur: 55,
    opacity: 0.15,
    style: { top: '2800px', right: '-80px' },
  },
  {
    pathA: BLOB_PATHS.d1,
    pathB: BLOB_PATHS.d2,
    color: '#DA291C',
    size: 500,
    blur: 45,
    opacity: 0.1,
    style: { top: '4200px', left: '-60px' },
  },
  {
    pathA: BLOB_PATHS.e1,
    pathB: BLOB_PATHS.e2,
    color: '#f9b311',
    size: 550,
    blur: 50,
    opacity: 0.12,
    style: { top: '5200px', right: '-80px' },
  },
  {
    pathA: BLOB_PATHS.a1,
    pathB: BLOB_PATHS.a2,
    color: '#004c95',
    size: 600,
    blur: 55,
    opacity: 0.13,
    style: { top: '6400px', left: '-100px' },
  },
]

export default function MorphBlobs() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {BLOBS.map((blob, i) => (
        <ScrollBlob key={i} config={blob} />
      ))}
    </div>
  )
}
