import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const client = createClient({
  projectId: 'de0anuhy',
  dataset: 'boldcrest',
  apiVersion: '2026-02-27',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

// ── Service type normalization ──
const SERVICE_MAP = {
  'Branding': 'Branding',
  'Creative Advertising': 'Creative Advertising',
  'Photography': 'Photography',
  'Social Media Management': 'Social Media Management',
  'Television Commercial': 'Television Commercials',
  'Television Commercials': 'Television Commercials',
  'Videography': 'Videography',
  'Packaging': 'Packaging',
  'Packaging Design': 'Packaging',
  'Ads Management': 'Ads Management',
}

// ── Industry normalization ──
const INDUSTRY_MAP = {
  'Food & Beverage': 'Food & Beverage',
  'Health & Beauty': 'Health & Beauty',
  'Luxury': 'Services',
  'Services': 'Services',
  'Service': 'Services',
  'Construction': 'Construction',
  'Fashion': 'Fashion',
  'HoReCa': 'HoReCa',
  'HORECA': 'HoReCa',
  'NGO': 'NGO',
  'Home & Appliances': 'Home & Appliances',
  'Tech': 'Tech',
  'Finance': 'Finance',
}

// ── Clean intro text (remove Elementor CSS junk) ──
function cleanIntro(text) {
  if (!text) return ''
  // Remove elementor CSS blocks
  let clean = text.replace(/\/\*![\s\S]*?\*\//g, '')
  // Remove CSS rules
  clean = clean.replace(/\.[a-zA-Z-]+[\s\S]*?\{[^}]*\}/g, '')
  // Remove <br /> tags
  clean = clean.replace(/<br\s*\/?>/gi, '')
  // Trim whitespace
  clean = clean.trim()
  return clean
}

// ── Slugify ──
function makeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[®™©]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 96)
}

async function main() {
  const rawData = fs.readFileSync(
    path.join(process.env.HOME, 'Downloads', 'portfolio_posts.json'),
    'utf-8'
  )
  const posts = JSON.parse(rawData)

  // Step 1: Delete all existing test project documents
  console.log('Deleting existing test projects...')
  const existing = await client.fetch('*[_type == "project"]._id')
  if (existing.length > 0) {
    const tx = client.transaction()
    for (const id of existing) {
      tx.delete(id)
    }
    await tx.commit()
    console.log(`  Deleted ${existing.length} test projects`)
  } else {
    console.log('  No existing projects found')
  }

  // Step 2: Create new project documents from portfolio data
  console.log(`\nCreating ${posts.length} portfolio projects...`)

  const tx = client.transaction()

  posts.forEach((post, index) => {
    const cleanedIntro = cleanIntro(post.intro)
    const serviceType = SERVICE_MAP[post.service_types] || null
    const industry = INDUSTRY_MAP[post.industry] || null
    const slug = post.slug.startsWith('?') ? makeSlug(post.title) : makeSlug(post.slug)

    const doc = {
      _type: 'project',
      name: post.title,
      slug: { _type: 'slug', current: slug },
      client: post.client || undefined,
      industry: industry || undefined,
      year: post.year || undefined,
      services: serviceType ? [serviceType] : undefined,
      tagline: post.title.includes('|')
        ? post.title.split('|').pop().trim()
        : post.title.includes(':')
          ? post.title.split(':').pop().trim()
          : undefined,
      overview: cleanedIntro
        ? [
            {
              _type: 'block',
              _key: `intro_${index}`,
              style: 'normal',
              markDefs: [],
              children: [
                {
                  _type: 'span',
                  _key: `span_intro_${index}`,
                  text: cleanedIntro,
                  marks: [],
                },
              ],
            },
          ]
        : undefined,
      thumbnailType: 'image',
      // Leave thumbnail, thumbnailVideo, and media blank as requested
      order: index + 1,
    }

    // Remove undefined fields
    Object.keys(doc).forEach((key) => {
      if (doc[key] === undefined) delete doc[key]
    })

    tx.create(doc)
    console.log(`  ${index + 1}. ${post.client || post.title}`)
  })

  const result = await tx.commit()
  console.log(`\nDone! Created ${posts.length} projects.`)
  console.log('Transaction ID:', result.transactionId)
}

main().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
