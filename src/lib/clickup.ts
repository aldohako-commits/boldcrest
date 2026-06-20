import 'server-only'

/**
 * Create an Opportunity in ClickUp for each "Start a Project" submission.
 *
 * Posts to the BoldProject ▸ Opportunities list. The API token lives ONLY in the
 * environment (Vercel env CLICKUP_API_TOKEN) — never in the repo. If it's
 * missing the call is skipped (logged, not thrown) so a submission never 500s.
 *
 * Assignment + opportunity stage are intentionally left to a ClickUp Automation
 * ("task created in Opportunities → assign Sales Department, set stage") which is
 * more robust than hardcoding a group ID. If you'd rather assign here, set
 * CLICKUP_SALES_GROUP_ID and it'll be passed as group_assignees.
 */
const LIST_ID = '900401129016' // BoldProject ▸ Opportunities
const TOKEN = process.env.CLICKUP_API_TOKEN
const SALES_GROUP_ID = process.env.CLICKUP_SALES_GROUP_ID

// Custom field IDs (from the Opportunities list schema).
const FIELD = {
  contactEmail: '33524fd1-80ce-49a7-abd3-4389421cd6a8',
  service: '68b90b53-77bb-4dc2-9d99-3a9d10a7f900', // labels
  source: '94c907c2-82e6-4208-81c3-05e2b985f840', // dropdown
  opportunityType: 'fabea3c8-75be-40bf-adbc-188a267301f6', // dropdown
  pointOfContact: 'f0508d1e-ea58-4720-b6a8-ca52c865df9f', // short_text
  opportunityValue: 'faa549b5-2ad9-4f99-a8a5-be9fabfddad1', // currency
} as const

// Turn the budget answer into a numeric Opportunity Value. We take the first
// number in the string as a conservative (lower-bound) estimate:
//   "Under €5,000" → 5000 · "€5,000 – €15,000" → 5000 · "€50,000+" → 50000 ·
//   "Not sure yet…" → null (skip). The exact range stays in the description.
function budgetToValue(budget: string): number | null {
  const m = budget.replace(/[,\s]/g, '').match(/\d+/)
  return m ? Number(m[0]) : null
}

const SOURCE_WEBSITE = '5c7f8a3e-901b-4f76-90e7-954bafa4ea7f'
const TYPE_PROJECT = '4aff09c7-ba59-4ad4-8215-053b1a067ccb'

// Form service option -> Opportunities "Service" label option ID.
const SERVICE_LABEL: Record<string, string> = {
  Branding: '8c194e24-1e45-4804-aa14-ea2bc19c2861',
  'Packaging design': 'cf4f9cf6-6fee-4264-8a48-79b0474f4207',
  Photography: '91399466-92fd-4afa-9841-73553267b072',
  Videography: '048503b2-844c-48d6-9601-70ec42d1da31',
  'TV commercials': '124eb8d5-a8e2-4c31-b8a3-d19ffd2f6004',
  'Social media': 'da39093a-a8d5-4426-a127-fcb9ea360eeb',
  Website: 'a8b470d6-09c0-486c-92ab-3dca1a37c484',
}

export interface OpportunityInput {
  name: string
  position: string
  company: string
  email: string
  services: string // comma-joined
  message: string
  kickoff: string
  deadline: string
  budget: string
  source: string // "how did you hear", comma-joined
}

export async function createOpportunity(input: OpportunityInput) {
  if (!TOKEN) {
    console.warn('[clickup] CLICKUP_API_TOKEN not set — opportunity not created')
    return { created: false as const, reason: 'no-token' as const }
  }

  const serviceIds = input.services
    .split(',')
    .map((s) => SERVICE_LABEL[s.trim()])
    .filter(Boolean)

  const custom_fields: Array<{ id: string; value: unknown }> = [
    { id: FIELD.source, value: SOURCE_WEBSITE },
    { id: FIELD.opportunityType, value: TYPE_PROJECT },
  ]
  if (input.email) custom_fields.push({ id: FIELD.contactEmail, value: input.email })
  if (serviceIds.length) custom_fields.push({ id: FIELD.service, value: serviceIds })
  const value = budgetToValue(input.budget)
  if (value !== null) custom_fields.push({ id: FIELD.opportunityValue, value })
  const poc = [input.name, input.position].filter(Boolean).join(', ')
  if (poc) custom_fields.push({ id: FIELD.pointOfContact, value: poc })

  const rows: Array<[string, string]> = [
    ['Name', input.name],
    ['Position', input.position],
    ['Company', input.company],
    ['Email', input.email],
    ['Services', input.services],
    ['Message', input.message],
    ['Kickoff', input.kickoff],
    ['Deadline', input.deadline],
    ['Budget', input.budget],
    ['Heard about us', input.source],
  ].filter(([, v]) => v && v.trim()) as Array<[string, string]>
  const description = rows.map(([l, v]) => `**${l}:** ${v}`).join('\n\n')

  const titleSubject = input.company || input.name || 'New inquiry'

  const body: Record<string, unknown> = {
    name: `${titleSubject} — Project Inquiry (Website)`,
    markdown_description: description,
    custom_fields,
  }
  if (SALES_GROUP_ID) body.group_assignees = [SALES_GROUP_ID]

  try {
    const res = await fetch(`https://api.clickup.com/api/v2/list/${LIST_ID}/task`, {
      method: 'POST',
      headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error('[clickup] create task failed:', res.status, await res.text())
      return { created: false as const, reason: 'http-error' as const, status: res.status }
    }
    const data = (await res.json()) as { id?: string; url?: string }
    return { created: true as const, id: data.id, url: data.url }
  } catch (err) {
    console.error('[clickup] unexpected error creating task:', err)
    return { created: false as const, reason: 'exception' as const }
  }
}
