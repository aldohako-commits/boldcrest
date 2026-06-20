'use server'

import { sendFormEmail, buildBody } from '@/lib/email'

const TO = 'info@boldcrest.com'

export async function submitContactForm(formData: FormData) {
  const data = {
    name: (formData.get('name') as string) || '',
    email: (formData.get('email') as string) || '',
    company: (formData.get('company') as string) || '',
    message: (formData.get('message') as string) || '',
  }

  const { html, text } = buildBody([
    ['Name', data.name],
    ['Email', data.email],
    ['Company', data.company],
    ['Message', data.message],
  ])

  await sendFormEmail({
    to: TO,
    subject: `New contact form message${data.name ? ` — ${data.name}` : ''}`,
    replyTo: data.email || undefined,
    html: `<h2 style="font-family:Arial,sans-serif;font-size:18px">New contact form submission</h2>${html}`,
    text: `New contact form submission\n\n${text}`,
  })

  // Always report success to the visitor; delivery failures are logged
  // server-side (and a missing API key degrades gracefully).
  return { success: true }
}
