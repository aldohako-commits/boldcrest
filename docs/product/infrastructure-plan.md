# Infrastructure Plan — Clinic Platform (Next.js + Supabase)

**Date:** July 2026. What's needed to build, host, and operate the app. Companion to `security-plan.md` (Supabase security detail) and `platform-architecture-spec.md` (product architecture). Prices as researched July 2026; the flagged items need a manual check.

---

## 1. The stack (one picture in words)

```
Patients & clinic staff (browser / PWA / later Expo app)
        │
        ▼
Next.js app  ──────────────  hosted on Vercel Pro (start) → Cloudflare Workers via OpenNext (at scale)
        │ sb_publishable key (client)          │ server routes / webhooks use sb_secret key
        ▼                                      ▼
Supabase (AWS eu-central-1 Frankfurt) ── Postgres + RLS ── Auth ── Storage (private buckets) ── Edge Functions (pinned to Frankfurt)
        │                                      │
        │                                      ├── Fiscalization adapter → easyPos / fature.al API → DPT CIS (NIVF/NSLF)
        │                                      ├── Messaging service → WhatsApp Cloud API (+ Twilio SMS fallback) / Postmark or SES email
        │                                      ├── Payments → Paysera gateway (Albania) + Stripe via UK Ltd (foreign deposits)
        │                                      └── Log drain → external EEA log store (audit retention)
        ▼
Cloudflare R2 (zero-egress object storage) — bulk media: DICOM/STL scan files served to in-browser viewers (OHIF / Online3DViewer)
```

Two storage tiers on purpose: **auth-scoped patient files live in Supabase Storage** (RLS does authorization); **heavy, repeatedly-served media (scans, viewer assets) live on Cloudflare R2** because R2 egress is $0 vs Supabase's $0.09/GB — 1 TB/month of scan traffic is $90 vs $0.

## 2. Component choices & rationale

| Layer | Choice | Why / cost |
|---|---|---|
| Backend | **Supabase Pro** ($25/mo + usage), Frankfurt | See security plan §0; PITR add-on ~$100/mo before real patient data |
| Web hosting | **Vercel Pro** ($20/seat/mo, 1 TB bandwidth) to start | Fastest DX, per-PR previews; EU function regions configurable. Migration path: **OpenNext on Cloudflare Workers** (GA since Feb 2026, $5/mo + $0.30/M req, zero egress) when bandwidth bills bite |
| Mobile | **PWA first** (installable, camera access for clinic photos); **Expo/React Native later** for the patient app (EAS Free → $19 Starter → $199 Production at >1k MAU) | Avoids shipping a bad native app — the #1 competitor mobile complaint; PWA is 30–50% cheaper to build |
| Messaging | **WhatsApp-first via Meta Cloud API direct** (or Twilio while volume <10k msgs/mo; 360dialog €49 flat at scale). SMS fallback via Twilio/Plivo | WhatsApp is the dominant channel in Albania and +355 numbers are supported; appointment reminders are **utility templates** (cheap, free inside the 24h service window; service replies free). SMS to Albania costs ~$0.08–0.11/msg — 20–50× WhatsApp — fallback only |
| Email | **Postmark** (deliverability, EU option, ~$15/mo) or **SES** ($0.10/1k) at scale | Resend is fine too but EU residency unconfirmed ⚠ |
| Payments (Albania) | **Paysera** — BoA-licensed EMI, real developer docs (Checkout Modern API, OAuth2, webhooks, recurring billing) | EasyPay has no public developer portal (partnership-based) — keep as backup |
| Payments (foreign deposits) | **Stripe via a UK Ltd** (~£50–200 formation via agent — much cheaper than Stripe Atlas $500; Wise/Revolut/Tide business account for non-resident director) | Stripe doesn't support Albania; UK↔EEA Connect payouts are fee-waived; funds route to Albania via Paysera/Wise |
| Fiscalization | **easyPos or fature.al partner API** (per `fiscalization-partner-comparison.md`); public test env (fature.al) + free AKSHI developer test certificate | Legally the only route (see regulatory memo); ~7,000–15,000 ALL/yr per clinic pass-through |
| Imaging viewers | **OHIF Viewer + Cornerstone3D** (MIT — safe to embed) for DICOM via **Static DICOMweb** files on R2 (no PACS server needed); **Online3DViewer** (three.js) for STL/PLY/OBJ dental scans | All client-side — you pay only storage; the serverless static-DICOMweb pattern avoids running Orthanc until CBCT volume demands it |
| Error monitoring | **Sentry Team** ($26/mo) or self-hosted **GlitchTip** on a $5 VPS if cash-tight | Sentry-SDK-compatible either way |
| Uptime | UptimeRobot Solo ($7/mo) → Better Stack ($29/mo) when on-call/status pages matter | |
| DNS/CDN/domain | **Cloudflare Free** (DNS, SSL, WAF, DDoS) + `.al` domain (~$13–20/yr, no residency requirement for second-level .al, registered via AKEP-accredited registrar in ~3 days) | |

## 3. Messaging cost strategy (the biggest operating cost — design around it)

- Reminders/confirmations = **utility templates**; promos = marketing (5–10× dearer — meter them and bill clinics transparently, unlike Pabau's credit games).
- **Drive replies:** any patient reply opens a free 24h service window — conversational confirm/reschedule flows make most follow-up messages free. At 100 clinics, messaging is ~75% of infra cost; this is the single biggest lever.
- Compliance split from the security plan applies: WhatsApp carries scheduling + links only, never clinical content (Guideline 2/2025).
- WhatsApp onboarding lead time: Meta Business verification 3–10 working days; template approval usually minutes. The API number can't simultaneously run the WhatsApp mobile app — clinics get a dedicated number or migrate theirs.
- ⚠ Verify: exact Meta rate for the "Rest of Central & Eastern Europe" bucket (rate-card CSV), Twilio Albania alphanumeric sender-ID pre-registration.

## 4. Environments, CI/CD, and operations

- **Three Supabase projects:** `prod` (Frankfurt, PITR, network restrictions), `staging` (synthetic data only), `dev` (branch databases / local `supabase start`). Migrations via Supabase CLI in git, applied by CI; RLS test suite + Security Advisor lint as merge gates (security plan §8).
- **Vercel:** per-PR preview deployments against `staging`; production deploys outside clinic hours with instant rollback.
- Secrets: Vercel/CF env vars for app config; Supabase Vault for in-database secrets; nothing secret in `NEXT_PUBLIC_*`.
- Observability: Sentry (front+back), uptime checks on booking page + portal + fiscalization adapter health, log drain to EEA store for audit retention.
- Status page + incident comms templates (ties into the Law 124/2024 breach runbook).

## 5. What you need to set up (checklist)

**Entities & accounts**
1. Albanian company (QKB) — operates locally, contracts clinics, holds fiscalization partner agreement.
2. **UK Ltd** (agent-formed) + Wise/Revolut business account → Stripe account for foreign patient deposits.
3. Meta Business Manager (verified) → WhatsApp Business API number(s).
4. Supabase org (Frankfurt project, signed DPA), Vercel, Cloudflare (DNS + R2), Sentry, Postmark/SES, Twilio, Paysera business account, easyPos/fature.al API agreement, AKSHI developer test certificate (free, e-Albania), `.al` domain.

**Per-clinic onboarding (product must automate)**
- AKSHI fiscalization e-certificate (4,000 ALL/yr, guided e-Albania application) + TCR registration in CIS.
- WhatsApp sender setup (dedicated number or template-only via shared number initially).
- License capture (II.6.A.3 / II.6.A.5) + USSH practitioner validation (regulatory memo).

## 6. Cost model

| Stage | Monthly estimate | Dominated by |
|---|---|---|
| Build phase (design partners, ~10 clinics) | **≈ $450–600** | WhatsApp fees (~€250–350); Supabase+PITR $140; hosting $20; email/monitoring ~$60 |
| ~100 clinics | **≈ $3,700–4,800** | Messaging ~75% (≈€2,500–3,000 WhatsApp + ~$800 SMS fallback); Supabase Team tier adds ~$600–800 when triggered (security plan §11) |
| One-time | UK Ltd ~£50–200; WhatsApp verification (time); `.al` domain ~$15/yr | |

Per-clinic infra cost at scale ≈ **$37–48/mo**, of which ~$30 is messaging — which is why messaging allowances must be priced into tiers (feature catalog principle #5: transparent, no credit games) and why reply-driven free-window flows matter.

## 7. Scaling path (don't build ahead of need)

1. **Now:** Vercel + Supabase Pro + R2 + Meta Cloud API direct + Paysera + fature.al/easyPos sandbox. Everything above fits a 2-person team.
2. **At traction (~30–50 clinics):** Supabase Team plan (audit logs, SOC 2 evidence, SAML), 360dialog flat-fee WhatsApp, PITR + log drain, Better Stack on-call.
3. **At scale / bandwidth pain:** OpenNext on Cloudflare Workers, Supabase read replica (same region), Expo Production for the patient app, Orthanc server if CBCT volumes outgrow static DICOMweb.
4. **Regional expansion:** fiscalization adapter per country (Kosovo/Montenegro/N. Macedonia regimes differ — watch DDD Invoices' Albania go-live for a one-API abstraction); same Frankfurt region serves the whole Balkans+Italy footprint under adequacy rules.

## Open verifications ⚠
- Meta CEE-bucket WhatsApp rates (rate-card CSV); Twilio AL sender-ID registration; Vonage AL rate sheet.
- Resend EU data residency (if chosen over Postmark/SES).
- Paysera gateway settlement currencies/fees for ALL vs EUR; EasyPay API access terms.
- Supabase items from `security-plan.md` (PITR region, sub-processor list, Pro-plan log drains).
