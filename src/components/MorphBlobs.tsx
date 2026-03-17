'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

/*
  Organic morph blobs — absolutely positioned SVG shapes scattered
  throughout the page. Each blob smoothly morphs its shape driven
  by scroll position, interpolating between two organic path states.
  They pulse in scale when entering the viewport.
*/

// ── Path interpolation utility ──
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
export const BLOB_PATHS = {
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

  f1: 'M300,30C360,60,410,130,420,210C430,290,400,370,340,430C280,490,200,520,120,500C40,480,-10,410,0,320C10,230,60,150,130,90C200,30,240,0,300,30Z',
  f2: 'M280,20C350,50,400,120,420,200C440,280,420,360,360,420C300,480,220,510,140,490C60,470,-10,390,0,300C10,210,50,130,120,80C190,30,210,-10,280,20Z',

  g1: 'M350,60C400,100,440,170,430,250C420,330,370,400,310,450C250,500,170,520,100,490C30,460,-20,390,0,310C20,230,70,150,140,100C210,50,300,20,350,60Z',
  g2: 'M330,40C390,80,440,150,450,230C460,310,420,390,360,440C300,490,210,510,130,480C50,450,-20,370,10,290C40,210,90,130,160,80C230,30,270,0,330,40Z',
}

export interface BlobConfig {
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
  const [hovered, setHovered] = useState(false)
  const isInView = useInView(ref, { margin: '-5%', once: false })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const morphT = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const morphedPath = useTransform(morphT, (t) =>
    interpolatePath(config.pathA, config.pathB, t)
  )
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5])

  const baseOpacity = config.opacity ?? 0.18
  const hoverOpacity = Math.min(baseOpacity * 3, 0.55)

  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{
        ...config.style,
        width: config.size,
        height: config.size,
        rotate,
        cursor: 'default',
        pointerEvents: 'auto',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={
        isInView
          ? {
              scale: [0.75, 1.2, 0.8],
              opacity: hovered ? hoverOpacity : baseOpacity,
            }
          : { scale: 0.5, opacity: 0 }
      }
      transition={{
        opacity: { duration: hovered ? 0.4 : 1.2, ease: 'easeOut' },
        scale: {
          duration: 5,
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

/* ── Reusable component for any page ── */
export function PageMorphBlobs({ blobs }: { blobs: BlobConfig[] }) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 w-full overflow-visible"
      style={{ zIndex: 0, height: '100%', minHeight: '100vh' }}
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <ScrollBlob key={i} config={blob} />
      ))}
    </div>
  )
}

/* ── Homepage blobs (10 blobs, boosted opacity) ── */
const HOME_BLOBS: BlobConfig[] = [
  // Hero area — red top right
  {
    pathA: BLOB_PATHS.a1, pathB: BLOB_PATHS.a2,
    color: '#DA291C', size: 700, blur: 60, opacity: 0.22,
    style: { top: '-50px', right: '0px' },
  },
  // Hero area — yellow top left
  {
    pathA: BLOB_PATHS.f1, pathB: BLOB_PATHS.f2,
    color: '#f9b311', size: 500, blur: 55, opacity: 0.15,
    style: { top: '200px', left: '0px' },
  },
  // Selected Works — blue center-right
  {
    pathA: BLOB_PATHS.g1, pathB: BLOB_PATHS.g2,
    color: '#004c95', size: 450, blur: 50, opacity: 0.18,
    style: { top: '800px', right: '10%' },
  },
  // We Do section — yellow left
  {
    pathA: BLOB_PATHS.b1, pathB: BLOB_PATHS.b2,
    color: '#f9b311', size: 550, blur: 50, opacity: 0.16,
    style: { top: '1400px', left: '0px' },
  },
  // Mid-page — red center-left
  {
    pathA: BLOB_PATHS.d1, pathB: BLOB_PATHS.d2,
    color: '#DA291C', size: 400, blur: 45, opacity: 0.14,
    style: { top: '2000px', left: '15%' },
  },
  // Partners — blue right
  {
    pathA: BLOB_PATHS.c1, pathB: BLOB_PATHS.c2,
    color: '#004c95', size: 600, blur: 55, opacity: 0.2,
    style: { top: '2800px', right: '0px' },
  },
  // Testimonials area — yellow right
  {
    pathA: BLOB_PATHS.e1, pathB: BLOB_PATHS.e2,
    color: '#f9b311', size: 480, blur: 50, opacity: 0.15,
    style: { top: '3600px', right: '0px' },
  },
  // Lower page — red left
  {
    pathA: BLOB_PATHS.d1, pathB: BLOB_PATHS.d2,
    color: '#DA291C', size: 500, blur: 45, opacity: 0.16,
    style: { top: '4200px', left: '0px' },
  },
  // Diary section — yellow right
  {
    pathA: BLOB_PATHS.e1, pathB: BLOB_PATHS.e2,
    color: '#f9b311', size: 550, blur: 50, opacity: 0.18,
    style: { top: '5200px', right: '0px' },
  },
  // Bottom — blue left
  {
    pathA: BLOB_PATHS.a1, pathB: BLOB_PATHS.a2,
    color: '#004c95', size: 600, blur: 55, opacity: 0.18,
    style: { top: '6400px', left: '0px' },
  },
]

export default function MorphBlobs() {
  return <PageMorphBlobs blobs={HOME_BLOBS} />
}

/* ── Preset blob configs for other pages ── */

export const WORK_BLOBS: BlobConfig[] = [
  {
    pathA: BLOB_PATHS.c1, pathB: BLOB_PATHS.c2,
    color: '#DA291C', size: 600, blur: 55, opacity: 0.2,
    style: { top: '-50px', right: '0px' },
  },
  {
    pathA: BLOB_PATHS.f1, pathB: BLOB_PATHS.f2,
    color: '#004c95', size: 500, blur: 50, opacity: 0.16,
    style: { top: '800px', left: '0px' },
  },
  {
    pathA: BLOB_PATHS.b1, pathB: BLOB_PATHS.b2,
    color: '#f9b311', size: 450, blur: 50, opacity: 0.15,
    style: { top: '1800px', right: '0px' },
  },
  {
    pathA: BLOB_PATHS.g1, pathB: BLOB_PATHS.g2,
    color: '#DA291C', size: 400, blur: 45, opacity: 0.14,
    style: { top: '3000px', left: '0px' },
  },
  {
    pathA: BLOB_PATHS.e1, pathB: BLOB_PATHS.e2,
    color: '#004c95', size: 500, blur: 50, opacity: 0.16,
    style: { top: '4200px', right: '0px' },
  },
]

export const SERVICES_BLOBS: BlobConfig[] = [
  {
    pathA: BLOB_PATHS.a1, pathB: BLOB_PATHS.a2,
    color: '#f9b311', size: 650, blur: 55, opacity: 0.16,
    style: { top: '0px', left: '0px' },
  },
  {
    pathA: BLOB_PATHS.d1, pathB: BLOB_PATHS.d2,
    color: '#DA291C', size: 550, blur: 50, opacity: 0.18,
    style: { top: '1200px', right: '0px' },
  },
  {
    pathA: BLOB_PATHS.c1, pathB: BLOB_PATHS.c2,
    color: '#004c95', size: 500, blur: 50, opacity: 0.16,
    style: { top: '2400px', left: '0px' },
  },
  {
    pathA: BLOB_PATHS.f1, pathB: BLOB_PATHS.f2,
    color: '#f9b311', size: 450, blur: 45, opacity: 0.14,
    style: { top: '3800px', right: '0px' },
  },
  {
    pathA: BLOB_PATHS.b1, pathB: BLOB_PATHS.b2,
    color: '#DA291C', size: 500, blur: 50, opacity: 0.16,
    style: { top: '5000px', left: '0px' },
  },
]

export const CONTACT_BLOBS: BlobConfig[] = [
  {
    pathA: BLOB_PATHS.e1, pathB: BLOB_PATHS.e2,
    color: '#004c95', size: 550, blur: 55, opacity: 0.18,
    style: { top: '0px', right: '0px' },
  },
  {
    pathA: BLOB_PATHS.g1, pathB: BLOB_PATHS.g2,
    color: '#DA291C', size: 400, blur: 45, opacity: 0.14,
    style: { top: '400px', left: '0px' },
  },
  {
    pathA: BLOB_PATHS.a1, pathB: BLOB_PATHS.a2,
    color: '#f9b311', size: 450, blur: 50, opacity: 0.16,
    style: { top: '800px', right: '0px' },
  },
]

export const DIARY_BLOBS: BlobConfig[] = [
  {
    pathA: BLOB_PATHS.b1, pathB: BLOB_PATHS.b2,
    color: '#DA291C', size: 600, blur: 55, opacity: 0.18,
    style: { top: '0px', right: '0px' },
  },
  {
    pathA: BLOB_PATHS.c1, pathB: BLOB_PATHS.c2,
    color: '#f9b311', size: 500, blur: 50, opacity: 0.15,
    style: { top: '1000px', left: '0px' },
  },
  {
    pathA: BLOB_PATHS.f1, pathB: BLOB_PATHS.f2,
    color: '#004c95', size: 450, blur: 50, opacity: 0.16,
    style: { top: '2200px', right: '0px' },
  },
  {
    pathA: BLOB_PATHS.d1, pathB: BLOB_PATHS.d2,
    color: '#DA291C', size: 400, blur: 45, opacity: 0.14,
    style: { top: '3400px', left: '0px' },
  },
]

export const START_PROJECT_BLOBS: BlobConfig[] = [
  {
    pathA: BLOB_PATHS.a1, pathB: BLOB_PATHS.a2,
    color: '#004c95', size: 600, blur: 55, opacity: 0.18,
    style: { top: '0px', left: '0px' },
  },
  {
    pathA: BLOB_PATHS.e1, pathB: BLOB_PATHS.e2,
    color: '#DA291C', size: 450, blur: 50, opacity: 0.15,
    style: { top: '500px', right: '0px' },
  },
  {
    pathA: BLOB_PATHS.g1, pathB: BLOB_PATHS.g2,
    color: '#f9b311', size: 500, blur: 50, opacity: 0.16,
    style: { top: '1200px', left: '0px' },
  },
]
