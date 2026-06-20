/* ════════════════════════════════════════════════════
   Lightweight GA4 event helper

   gtag is only present once the visitor accepts cookies (see
   components/GoogleAnalytics.tsx — it loads gtag.js post-consent). So this is a
   no-op when analytics hasn't loaded: no consent → no event, exactly like the
   page-view tag. Safe to call from anywhere on the client.
══════════════════════════════════════════════════════ */

type Gtag = (...args: unknown[]) => void

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: Gtag }).gtag
  if (typeof gtag === 'function') gtag('event', name, params ?? {})
}

/** A form submission turned into a lead. `form` distinguishes the two forms. */
export function trackLead(form: 'contact' | 'start_project', params?: Record<string, unknown>) {
  // 'generate_lead' is GA4's recommended event for this; mark it a Key Event in
  // GA4 → Admin → Events to count it as a conversion.
  trackEvent('generate_lead', { form, ...params })
}
