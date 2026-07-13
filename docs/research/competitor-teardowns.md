# Competitor Teardowns — DenteX, Pabau, BeautyBooking.al

**Date:** July 2026. Deep teardowns of the three most relevant competitors (closest local dental-tourism rival, closest global analog, closest local aesthetics rival), ending with a feature-parity matrix and exploitable gaps. Sources: live site HTML (dentex.al, pabau.com incl. support KB, beautybooking.al incl. reverse-engineered app bundles), registries, review platforms.

---

## A. DenteX (dentex.al) — "The CRM Built for Dental Tourism"

### Company reality check (important downgrade vs prior assessment)
- Brand "DenteX by NEXORA TECH", Lake View Residences Tirana; founder presented as **Denis Qatipi** ("15+ years in HealthTech") — but **no LinkedIn profile, no company LinkedIn/social presence, no QKB registry entity findable** (only a loosely-similar "NEXORA VENTURES" SHPK, Durrës, founded Feb 2026, different owner). "Edition 2026" branding + "0+ clinics served" placeholder counters ⇒ **very new, likely pre-traction**.
- The three testimonial clinics ("Smile Clinic Tirana", "DentaCare Albania", "Premier Dental") **could not be verified as existing Tirana clinics** — testimonials appear illustrative.
- **No reviews anywhere** (Trustpilot/Capterra/G2/Reddit: zero), no demo videos, no app-store presence, no public API, **no published pricing** (custom quote after a 15-min call; free trial; month-to-month, data export on cancel).
- **Net: DenteX validates the concept and defines the feature bar for tourism-CRM, but it is not an entrenched incumbent.** Track it; don't fear it.

### Feature map (five modules, per site)
1. **Leads:** WhatsApp/email/referral inquiries → one pipeline, auto-assign to operators, click-to-call with logging, **branded PDF quotes** (digitally signable), SMS+WhatsApp reminders, cold-lead surfacing, **flights & hotel management per patient + travel calendar**.
2. **Performance:** per-agent targets/KPIs (quote-to-close, time-to-first-contact), leaderboards, funnel analytics, bottleneck detection, commission-ready payout reports.
3. **Patients:** anamnesis, one-screen patient card (demographics, consents, x-rays, plan, finances), searchable full timeline, segmentation campaigns (birthday/recall/reactivation), document templates (consents, prescriptions) digitally signed, recall reminders by treatment type.
4. **Clinic:** inventory with thresholds, purchase orders + margin per treatment, **fiscal-device integration ("every invoice compliant, numbered, archived")**, operational cost tracking, calendar per doctor/chair/room.
5. **Laboratory:** doctor orders from patient card → lab sees instantly, tooth references/shade/material, stage tracking (impression→delivery), audit trail. Plus affiliate tracking with unique links.
- Languages: EN + SQ full, IT marketing toggle. Onboarding claim: operational within a week, data import included. Security claims: GDPR, "secure European servers".

### What DenteX does NOT have
No patient online booking or portal, no mobile app, no before/after photo tooling or stencils, no odontogram/tooth charting, no imaging integrations (x-ray file storage only), no e-prescriptions, no public API, no published pricing, no verifiable customers.

---

## B. Pabau (pabau.com) — closest global analog

### Company
Founded 2012, London; bootstrapped; offices in **Skopje and Prishtina** (Albanian-speaking staff exist — watch for regional moves); ~3,500 practices, ~40 countries. UK entity PABAU LTD #08695668.

### Feature tree (from site + support KB)
- **Scheduling:** calendar with rooms + **equipment**, waitlists, classes, client portal, online booking (deposits, promo codes, Reserve-with-Google).
- **Clinical:** full EMR; form builder with conditional rules, photo/video components, **SNOMED + ICD lookup**; **before/after photos with stencils** (consistent angles); **injection plotting that auto-deducts injectable units from stock**; ePrescriptions (CloudRx/SignatureRx/Pharmacierge, BNF); labs (TDL); telehealth (free unlimited); **AI Scribe** notes.
- **Finance:** quotes, invoices, Pabau Pay, terminals, Klarna, insurance billing (Healthcode, UK).
- **Stock:** retail/consumables/injectables with movement tracking tied to treatment records.
- **Marketing:** lead pipeline, campaigns, automations, loyalty, vouchers, review redirects, recalls.
- **Platform:** roles/permissions, timesheets, commissions; dashboards + Insights Plus; **documented public REST API + webhooks + private apps**; 30+ integrations, Zapier/Make; multi-account orgs; Pabau GO iOS app (new; mobile criticized as feature-poor).

### Pricing (fetched July 2026)
Starter **£50/$62/mo** (1 user, ≤100 clients); Solo/Team/Medium/Group/Enterprise **demo-gated**; add-ons (Marketing Plus, Care Plus, Insights Plus) unpublished; SMS/telehealth/AI consume **credits**; training/data-transfer fees reported. Booking-portal patients don't count as users.

### Review mining (Capterra 4.7/600+; Trustpilot ~4.0/~300)
- **Loved (the parity bar for our aesthetics module):** consent forms auto-chained to bookings; before/after photos with stencils; injection plotting with auto stock deduction; automated reminders; all-in-one consolidation; onboarding team.
- **Hated:** Pabau 2 migration ("clear downgrade… clunky… never-ending stream of glitches and outages", 2 days unusable in week one — Pabau publicly admitted spending "$5M+, 100+ developers" post-launch on bugs); updates shipped during office hours; calendar malfunctions; weak mobile app; add-on/credit cost creep; overwhelm.
- **Albania-relevant absences:** no Albanian language, **no Albanian fiscalization** (legally required), GBP/EUR pricing, demo-gated tiers.

---

## C. BeautyBooking.al — Albanian aesthetics booking platform

- **Company:** startup-grade; co-founder **Lejdi Prifti** (full-stack engineer, day job at Links Management & Technology); distributed team (USA/Austria/Kosovo); no QKB entity identified; Business Magazine interview Mar 2025.
- **Consumer side:** marketplace + Android app (`com.ans.beautybooking`); verified reviews, transparent prices, WhatsApp buttons.
- **Business portal** (reverse-engineered from the Angular bundle): calendar (FullCalendar) with real-time websocket notifications; reservations with statuses incl. **DEPOSIT_PAID**; clients; services; staff scheduling/time-off/blocked time; equipment; gift cards; shallow inventory; analytics. Per-booking SMS toggle + reminder flag confirmed in code. UI Albanian-first.
- **Claims ahead of shipped product:** WhatsApp+Instagram auto-messages, integrated online payments, fiscal-system connection, AI assistant — none visible in the business-app bundle (may be server-side or aspirational).
- **Traction:** ~4 named venues with landing pages (Your Space Albania, Light Clinic, Gania's Center, Estetik Plus/Esthederm); Trustpilot 4.0 from **4 reviews**. No published pricing (onboarding via Google Form).
- **Context:** Fresha has only ~7 Tirana venues; **Booksy does not operate in Albania**; Setmore invisible. The Albanian aesthetics-booking market is essentially unserved.

---

## Feature-parity matrix

| Feature area | DenteX | Pabau | BeautyBooking.al |
|---|---|---|---|
| Scheduling/calendar | Yes (doctor/chair/room) | Yes (rooms, equipment, sync) | Yes (staff/equipment, real-time) |
| Patient online booking / portal | **No** | Yes (deposits, portal, RwG) | Yes (marketplace + app) |
| Reminders | Yes (SMS+WhatsApp, recalls) | Yes (credits-metered) | Partial (SMS toggle; WA/IG claimed) |
| EMR / charting | Partial (anamnesis, patient card; no tooth chart) | **Yes** (forms, SNOMED/ICD, ePrescribe, AI Scribe) | No |
| Consent forms | Yes (templates, e-sign) | **Yes** (conditional, auto-chained) | No |
| Before/after photos | Partial (file storage) | **Yes** (galleries, stencils, plotting) | No |
| Inventory | Yes (thresholds, POs, margins) | **Yes** (injectables auto-deduct) | Partial (shallow) |
| Quotes / CRM pipeline | **Yes** (flagship; affiliates, agent KPIs) | Yes (generalist) | No |
| Tourism / travel logistics | **Yes — unique** (travel calendar, flights/hotels) | No | No |
| Albanian fiscalization | **Yes — unique vs Pabau** | No | Claimed, not visible |
| Payments | Partial (unnamed) | Yes (Pay, terminals, Klarna) | Partial (deposits in code) |
| Marketing campaigns | Yes (segments, recall/reactivation) | Yes (+paid add-on) | No (gift cards only) |
| Multi-location | Yes (pricing dimension) | Yes (Enterprise) | No evidence |
| Public API / integrations | No | **Yes** (REST, webhooks, 30+) | No |
| Languages | EN+SQ (+IT marketing) | EN only | SQ-first |
| Mobile apps | No | iOS (limited) | Android consumer |
| Dental lab workflow | **Yes — unique** | Partial (pathology only) | No |
| Vendor social proof | **None** | Strong (600+ reviews) | Minimal (4 reviews) |

## Gaps we can exploit

1. **DenteX lacks the patient side entirely** — no online booking, portal, or app. Tourism-CRM strengths + patient self-service outflanks it.
2. **DenteX is unproven and opaque** — unverifiable testimonials, no registry entity, no reviews, hidden pricing. Transparent pricing + real named reference clinics + self-serve trial is a direct credibility wedge.
3. **Pabau is non-compliant and unlocalized for Albania** — no Albanian language, no fiscalization, £/$ pricing plus credit-metering. This moat holds unless they staff it from Prishtina — monitor.
4. **Pabau's soft spots:** migration instability, office-hours breaking updates, weak mobile, cost creep, demo-gated pricing → position as stable, simple, flat-priced, everything included.
5. **Pabau's loved features are the aesthetics parity bar:** consent-chained-to-booking, B/A stencils, injection plotting with auto stock deduction, automated reminders. Match these four before launching the aesthetics module.
6. **BeautyBooking is a booking tool, not clinic software** — no EMR/consents/photos/campaigns; ~4 venues. Clinic-grade product leapfrogs it for medical aesthetics.
7. **Nobody covers the cross-vertical case:** DenteX = dental-tourism only; Pabau = aesthetics-first, no dental; BeautyBooking = salons. Dental + aesthetics + tourism + fiscalization overlaps none of them.
8. **Clinical whitespace even vs DenteX:** odontogram, imaging integrations, e-prescriptions.
9. **Distribution open ground:** none of the three do Albanian-language content marketing, YouTube demos, or full app-store presence.
10. **Compliance angle none of them can claim:** per the regulatory memo, the Commissioner's health-data guideline **prohibits WhatsApp for health-data exchange** — DenteX and BeautyBooking lead with WhatsApp flows. A compliant secure-messaging design is both a differentiator and a defensible talking point with inspection-wary clinics.
