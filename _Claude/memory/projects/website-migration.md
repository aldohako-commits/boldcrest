# BoldCrest Website Migration

**Status:** In Progress
**Started:** March 2026

## What It Is
Full migration of BoldCrest's website from WordPress to a modern Next.js + Sanity CMS stack, deployed on Vercel at boldcrest-seven.vercel.app.

## Technical Stack
- **Frontend:** Next.js (React)
- **CMS:** Sanity (Project ID: `de0anuhy`, Dataset: `boldcrest`)
- **Hosting:** Vercel
- **Video:** Vimeo (embedded via vimeoUrl field)
- **Studio URL:** https://boldcrest-seven.vercel.app/studio/structure/project

## Content Inventory
- **51 projects** total in Sanity
- **89 Vimeo videos** across 27 projects
- Industries: Construction, Fashion, Finance, Food & Beverage, Health & Beauty, Home & Appliances, HoReCa, NGO, Our Crests, Services, Tech
- Services: Ads Management, Branding, Creative Advertising, Packaging, Photography, Social Media Management, Television Commercials, Videography

## Completed Steps

### Step 1: Video Insertion into Sanity
- Mapped all 89 Vimeo video URLs to their corresponding Sanity project documents
- Inserted videos into the `media` array of each project using the Sanity Mutations API
- Used `credentials: 'include'` from the authenticated Studio browser tab
- Videos stored as `videoMedia` type with `vimeoUrl` field inside the media array

### Step 2: Duplicate Video Cleanup
- After re-insertion, some projects (Palma Nuts, Start Oil, etc.) had duplicate videos
- Ran a deduplication pass across ALL projects removing duplicate `vimeoUrl` entries from media arrays

### Step 3: WordPress CSV Export & Parsing
- Exported content from WordPress: `Services-Export-2026-March-20-1943.csv` (51 projects, 85 columns)
- Discovered bug: CSV metadata columns (client, industry, year, services) all contained identical Hako data for every row (WordPress ACF export bug)
- Built custom parsing to extract per-project data from the HTML `Content` column:
  - **Overview:** Text before the first `<h2>` tag
  - **Challenge/Solution:** Extracted via regex matching `<h2>Heading</h2>` followed by content
  - **Client/Industry/Year/Services:** Extracted from `<h2>Label</h2><h2>Value</h2>` pairs in HTML
- Saved parsed data to `csv_parsed_v2.json`

### Step 4: Comprehensive Excel Reference File
- Created `boldcrest_complete_reference.xlsx` with 4 sheets:
  - **Master:** All projects with Sanity IDs, content texts, video URLs, metadata
  - **Video Details:** All 89 videos with project associations
  - **Content Text:** Clean text versions for easy copy/paste
  - **Notes:** Schema reference and field documentation
- Saved to Desktop for future reference

### Step 5: Sanity Document ID Verification
- Queried Sanity API for actual live document IDs (some differed from earlier cached list)
- Saved verified IDs to `actual_sanity_ids.tsv`
- Rebuilt mutation mapping from scratch using correct IDs

### Step 6: Text Content Upload to Sanity (Overview, Challenge, Solution + Metadata)
- Converted all text content to Sanity Portable Text format (block content with spans)
- Built mutations for all 51 projects setting: overview, challenge, solution, client, industry, year, services
- Pushed via authenticated browser session using Sanity Mutations API
- **Batch approach:** 3 mutations per batch, 15 batches total for the 44 remaining (after 7 initial test pushes)
- All 51 projects confirmed with complete content via API verification query

### Verification Results
All 51 projects verified with:
- overview: 51/51
- challenge: 51/51
- solution: 51/51
- client: 51/51
- industry: 51/51
- year: 51/51
- services: 51/51

## Key Files
| File | Location | Purpose |
|------|----------|---------|
| `boldcrest_complete_reference.xlsx` | Desktop | Master reference with all content |
| `Services-Export-2026-March-20-1943.csv` | uploads | Original WordPress export |
| `project.ts` | boldcrest/src/sanity/schemaTypes/ | Sanity schema definition |

## API Patterns Used

**Sanity Query:**
```
GET https://de0anuhy.api.sanity.io/v2021-10-21/data/query/boldcrest?query=...
```

**Sanity Mutation (from authenticated browser):**
```javascript
fetch('https://de0anuhy.api.sanity.io/v2021-10-21/data/mutate/boldcrest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ mutations: [...] })
})
```

**Portable Text block format:**
```json
{
  "_type": "block",
  "_key": "unique12char",
  "style": "normal",
  "markDefs": [],
  "children": [{
    "_type": "span",
    "_key": "unique12char",
    "text": "Paragraph text here",
    "marks": []
  }]
}
```

## What's Left
- Images still need to be uploaded/migrated to Sanity (currently only videos are in media arrays)
- Any remaining frontend work on the Next.js site
- DNS/domain pointing when ready to go live
