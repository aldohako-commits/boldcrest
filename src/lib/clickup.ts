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
  month: '5960d802-03da-4316-882e-faed48679928', // dropdown
  year: '208a6081-5b54-408b-b7fb-82eaf3189afa', // dropdown
} as const

// Month/Year dropdown option IDs (from the Opportunities list schema). Set from
// the submission moment so each opportunity is stamped with when it came in.
const MONTH_OPTION: Record<string, string> = {
  January: '2e00d792-037c-433f-97e6-2cb9b34e909a',
  February: '3c3aa16f-125b-43c1-a5e1-3c2f5499f1b8',
  March: 'ed55c09f-9c62-468e-963e-5be612c196a4',
  April: 'b8cf092f-4352-41ef-9444-498b8c8a0677',
  May: '13a4e6f9-5886-48bf-8198-8234543e58ce',
  June: '1c35935e-7418-408c-b638-abb0043e1742',
  July: '1955b069-7fb0-4ce8-9e5b-09976fd8805c',
  August: '8b997e84-b1cc-4fc4-a0fd-b0f79a2eef19',
  September: '279b08d6-4ee2-4729-bc3c-a90825a52f9a',
  October: '6fc184a5-1bf8-4156-be0f-6ffcbeb8e578',
  November: '16f65487-405e-412b-961e-ed0ae8f04623',
  December: '19484932-6807-4ff3-b41a-aa10e7a369b3',
}
// The Year field only has a fixed list of options — add new years here as the
// list grows in ClickUp, otherwise a future year is just skipped (no error).
const YEAR_OPTION: Record<string, string> = {
  '2022': '4f70f4bb-b987-498d-a5b7-3aae6d432d45',
  '2023': '84710594-b546-4be7-96bb-1da397156ab3',
  '2024': '6f1dafe2-bcb1-43ab-8ffd-da923c349ae7',
  '2025': 'bdca145f-426d-4893-a4ad-93ddcad475d6',
  '2026': 'd6836f7c-b532-4e14-b113-6c01fd6479d8',
}

// Current month name + year, in Albania time (so a submission near midnight is
// stamped with Tirana's calendar date, not the server's UTC one).
function nowMonthYear(): { month: string; year: string } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Tirane',
    month: 'long',
    year: 'numeric',
  }).formatToParts(new Date())
  return {
    month: parts.find((p) => p.type === 'month')?.value ?? '',
    year: parts.find((p) => p.type === 'year')?.value ?? '',
  }
}

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

  // NOTE: Source is deliberately NOT set here. A ClickUp automation assigns the
  // Sales Department off "Custom Field Source changes to Website", and a
  // "Task created" trigger with a field condition does NOT reliably match a
  // field set in the SAME create call (ClickUp evaluates the condition before
  // the value commits). So we create the task first, then set Source in a
  // SEPARATE call below — that fires a real field-change event the automation
  // catches. (Verified Jun 2026: setting Source inline left the task unassigned.)
  const custom_fields: Array<{ id: string; value: unknown }> = [
    { id: FIELD.opportunityType, value: TYPE_PROJECT },
  ]
  if (input.email) custom_fields.push({ id: FIELD.contactEmail, value: input.email })
  if (serviceIds.length) custom_fields.push({ id: FIELD.service, value: serviceIds })
  const value = budgetToValue(input.budget)
  if (value !== null) custom_fields.push({ id: FIELD.opportunityValue, value })
  const poc = [input.name, input.position].filter(Boolean).join(', ')
  if (poc) custom_fields.push({ id: FIELD.pointOfContact, value: poc })
  // Stamp the submission month + year (Albania time).
  const { month, year } = nowMonthYear()
  if (MONTH_OPTION[month]) custom_fields.push({ id: FIELD.month, value: MONTH_OPTION[month] })
  if (YEAR_OPTION[year]) custom_fields.push({ id: FIELD.year, value: YEAR_OPTION[year] })

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

  // Task name = company (falls back to contact name, then a generic) + suffix.
  const titleSubject = input.company || input.name || 'New inquiry'

  const body: Record<string, unknown> = {
    name: `${titleSubject} - WebsiteForm`,
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

    // Set Source = Website as a SEPARATE field update so it registers as a
    // field-change event (see note above) — this is what triggers the
    // Sales-Department auto-assignment automation. Best-effort: a failure here
    // must not fail the submission (the task already exists + is correct).
    if (data.id) {
      try {
        await fetch(
          `https://api.clickup.com/api/v2/task/${data.id}/field/${FIELD.source}`,
          {
            method: 'POST',
            headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: SOURCE_WEBSITE }),
          },
        )
      } catch (err) {
        console.error('[clickup] failed to set Source field:', err)
      }
    }

    return { created: true as const, id: data.id, url: data.url }
  } catch (err) {
    console.error('[clickup] unexpected error creating task:', err)
    return { created: false as const, reason: 'exception' as const }
  }
}
