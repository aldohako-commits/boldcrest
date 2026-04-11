# Memory

## Me
Aldo, Founder of BoldCrest — a creative agency based in Tirana, Albania. We do branding, packaging, photography, TVCs, social media management, and creative advertising for Albanian and international clients.

## Key Systems
| System | What | Details |
|--------|------|---------|
| **Sanity CMS** | Headless CMS for new website | Project ID: `de0anuhy`, Dataset: `boldcrest` |
| **Next.js** | Frontend framework | Deployed on Vercel |
| **Vercel** | Hosting | boldcrest-seven.vercel.app |
| **WordPress** | Old website (migrating from) | Content exported as CSV |
| **Vimeo** | Video hosting | 89 videos across 27 projects |

## Projects
| Name | What |
|------|------|
| **Website Migration** | Moving BoldCrest from WordPress to Next.js + Sanity CMS |
→ Details: memory/projects/website-migration.md

## Terms
| Term | Meaning |
|------|---------|
| **Portable Text** | Sanity's rich text format (block content with _type, _key, style, markDefs, children) |
| **Mutations API** | Sanity's API for creating/updating documents (`/data/mutate/boldcrest`) |
| **Studio** | Sanity Studio — the CMS admin at boldcrest-seven.vercel.app/studio/ |
| **TVC** | Television Commercial |
| **BTL** | Below The Line (campaign type) |

## Sanity Schema Quick Ref
| Field | Type | Notes |
|-------|------|-------|
| overview | array of blocks | Project overview text |
| challenge | array of blocks | The Challenge section |
| solution | array of blocks | The Solution section |
| client | string | Client name |
| industry | string | From predefined list (11 options) |
| year | string | Project year |
| services | array of strings | From predefined list (8 options) |
| media | array | Mix of videoMedia (vimeoUrl) and image types |

## Preferences
- Working language: English (also Albanian for copywriting)
- Prefers comprehensive reference files (Excel) for content management
- Uses browser-authenticated Sanity Studio for API mutations
