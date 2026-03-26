import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const client = createClient({
  projectId: 'de0anuhy',
  dataset: 'boldcrest',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const posts = [
  {
    _type: 'diaryPost' as const,
    _id: 'diary-brand-point-of-view',
    title: 'Why Your Brand Needs a Point of View',
    slug: { _type: 'slug' as const, current: 'brand-point-of-view' },
    excerpt: 'A logo is not a brand. A brand is the feeling people carry after every interaction.',
    category: 'Branding',
    publishedAt: '2026-03-10T10:00:00Z',
    body: [
      { _type: 'block' as const, _key: 'b1', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's1', marks: [], text: 'Every brand carries weight — the weight of intention, the weight of perception, the weight of every decision that brought it here. What separates the ones that endure from the ones that fade is simple: clarity of purpose.' }] },
      { _type: 'block' as const, _key: 'b2', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's2', marks: [], text: 'Not aesthetics alone, not trend-chasing, but the discipline to know what you stand for and say it without apology. The brands that move people are not louder — they are sharper. They understand that design is not decoration. It is a language.' }] },
      { _type: 'block' as const, _key: 'b3', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's3', marks: [], text: 'At BoldCrest, we approach every project as if reputation is on the line — because it is. Ours and yours. The first question is never what does the client want to see, but what does the audience need to feel. That distinction changes everything.' }] },
      { _type: 'block' as const, _key: 'b4', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's4', marks: [], text: 'This is the work we live for: translating ambition into identity, strategy into visuals, and vision into something people remember long after they have scrolled past.' }] },
    ],
  },
  {
    _type: 'diaryPost' as const,
    _id: 'diary-death-of-safe-design',
    title: 'The Death of Safe Design',
    slug: { _type: 'slug' as const, current: 'death-of-safe-design' },
    excerpt: 'Playing it safe is the riskiest move in a crowded market.',
    category: 'Design',
    publishedAt: '2026-02-28T10:00:00Z',
    body: [
      { _type: 'block' as const, _key: 'b1', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's1', marks: [], text: 'Safe design is invisible design. It blends into the background noise of a market saturated with sameness. When every brand looks like every other brand, none of them stand out.' }] },
      { _type: 'block' as const, _key: 'b2', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's2', marks: [], text: 'The irony is that playing it safe feels responsible. It feels professional. But in reality, it is the riskiest move you can make. Because forgettable brands do not survive.' }] },
      { _type: 'block' as const, _key: 'b3', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's3', marks: [], text: 'Bold creative is not about being loud or provocative for its own sake. It is about having the conviction to express something genuine, something that only your brand can say, in a way that only your brand can say it.' }] },
      { _type: 'block' as const, _key: 'b4', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's4', marks: [], text: 'The brands we admire most — the ones that have shaped culture and built loyalty over decades — all share one trait: they refused to be safe. They chose clarity over compromise.' }] },
    ],
  },
  {
    _type: 'diaryPost' as const,
    _id: 'diary-motion-new-typography',
    title: 'Motion Is the New Typography',
    slug: { _type: 'slug' as const, current: 'motion-new-typography' },
    excerpt: 'Static brands are invisible brands. Motion design is the most important layer of modern identity.',
    category: 'Motion',
    publishedAt: '2026-02-15T10:00:00Z',
    body: [
      { _type: 'block' as const, _key: 'b1', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's1', marks: [], text: 'Typography defined the 20th century of brand design. Color defined the early digital era. But motion — the way a brand moves, transitions, and breathes — is what defines this moment.' }] },
      { _type: 'block' as const, _key: 'b2', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's2', marks: [], text: 'Static brands are invisible brands. In a feed that moves at the speed of a thumb, stillness is death. Motion is not decoration — it is communication.' }] },
      { _type: 'block' as const, _key: 'b3', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's3', marks: [], text: 'At BoldCrest, every identity system we build includes motion principles. How does the brand enter a space? How does it transition between states? These are foundational design decisions.' }] },
      { _type: 'block' as const, _key: 'b4', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's4', marks: [], text: 'The brands that will dominate the next decade are the ones that move with intention. Every frame, every ease, every duration — deliberate.' }] },
    ],
  },
  {
    _type: 'diaryPost' as const,
    _id: 'diary-campaigns-outlive-algorithm',
    title: 'Campaigns That Outlive the Algorithm',
    slug: { _type: 'slug' as const, current: 'campaigns-outlive-algorithm' },
    excerpt: 'Social platforms change daily. We build strategies anchored to human truths, not trending formats.',
    category: 'Strategy',
    publishedAt: '2026-02-01T10:00:00Z',
    body: [
      { _type: 'block' as const, _key: 'b1', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's1', marks: [], text: 'Social platforms change daily. We build communication strategies anchored to human truths, not trending formats. The algorithm rewards consistency, but culture rewards authenticity.' }] },
      { _type: 'block' as const, _key: 'b2', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's2', marks: [], text: 'The campaigns that last are not the ones that chase the latest trend. They are the ones rooted in something deeper — an insight about human behavior that remains true regardless of which platform is dominant.' }] },
      { _type: 'block' as const, _key: 'b3', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's3', marks: [], text: 'We have seen brands pour budgets into format-first thinking — designing for the algorithm rather than for people. It works for a week. Then the rules change and everything crumbles.' }] },
      { _type: 'block' as const, _key: 'b4', style: 'normal' as const, markDefs: [], children: [{ _type: 'span' as const, _key: 's4', marks: [], text: 'Our approach is different. Start with the human truth. Build the narrative. Then adapt the expression to whatever format serves it best. The truth stays constant. The format is just a vehicle.' }] },
    ],
  },
]

export async function GET() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: 'SANITY_API_WRITE_TOKEN not set in .env.local' }, { status: 500 })
  }

  try {
    const tx = client.transaction()
    for (const post of posts) {
      tx.createOrReplace(post)
    }
    const result = await tx.commit()
    return NextResponse.json({ success: true, ids: result.documentIds })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
