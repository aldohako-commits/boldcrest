import 'server-only'
import { Resend } from 'resend'

/**
 * Transactional email for site forms (contact + start-a-project).
 *
 * Sends via Resend. The API key lives ONLY in the environment (Vercel env var
 * RESEND_API_KEY) — never in the repo. If the key is missing (e.g. local dev or
 * before it's been provisioned), we log instead of throwing so a submission
 * never 500s; the visitor still gets the success state. The `from` address must
 * be on a domain verified in Resend; override via FORM_FROM_EMAIL if needed.
 */
const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null

const FROM = process.env.FORM_FROM_EMAIL || 'BoldCrest Website <website@boldcrest.com>'

export interface FormEmail {
  to: string
  subject: string
  /** The visitor's address — set as Reply-To so the team can reply directly. */
  replyTo?: string
  html: string
  text: string
}

export async function sendFormEmail({ to, subject, replyTo, html, text }: FormEmail) {
  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping send to ${to} (subject: ${subject})`,
    )
    return { sent: false as const, reason: 'no-api-key' as const }
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    })
    if (error) {
      console.error('[email] Resend returned an error:', error)
      return { sent: false as const, reason: 'send-error' as const, error }
    }
    return { sent: true as const, id: data?.id }
  } catch (err) {
    console.error('[email] Unexpected error sending mail:', err)
    return { sent: false as const, reason: 'exception' as const }
  }
}

/** Escape user-supplied strings before interpolating into the HTML email. */
export function esc(value: string | undefined | null): string {
  return (value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Build a simple labelled HTML + text body from field rows (skips empty ones). */
export function buildBody(rows: Array<[label: string, value: string | undefined]>) {
  const present = rows.filter(([, v]) => v && v.trim())
  const html = present
    .map(
      ([label, v]) =>
        `<p style="margin:0 0 12px"><strong style="display:block;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#888">${esc(
          label,
        )}</strong><span style="font-size:15px;color:#111;white-space:pre-wrap">${esc(
          v,
        )}</span></p>`,
    )
    .join('')
  const text = present.map(([label, v]) => `${label}: ${v}`).join('\n')
  return { html, text }
}
