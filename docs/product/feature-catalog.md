# Feature Catalog — What We Build, What Competitors Do, What We Improve

**Date:** July 2026. Feature-level synthesis of the competitor research (`competitor-teardowns.md`, `market-research-report.md` appendices) into a build catalog. Every feature lists: the competitor benchmark, the documented user complaint or gap, and our improvement. Priority tags: **[MVP]** first paid release, **[V2]** fast-follow, **[LATER]** post-traction.

Legend of the four most-referenced competitors: **PB** = Pabau, **DX** = DenteX, **BB** = BeautyBooking.al, **ZN** = Zenoti.

---

## 1. Scheduling & booking

| Feature | Benchmark | Documented complaint / gap | Our improvement |
|---|---|---|---|
| Multi-resource calendar (provider + chair/room + device) **[MVP]** | PB has rooms + equipment; ZN multi-location; DX per doctor/chair/room | ZN: "scheduling complicated, double-bookings, syncing issues"; PB: "calendar malfunctions" | Conflict detection across all three resources as a hard invariant, not a warning. Reliability is the feature — competitors' calendars break, ours cannot. |
| Online booking page + deposits **[MVP]** | PB (deposits, promo codes, Reserve-with-Google); BB (marketplace) | **DX has none** — tourism clinics using it still take bookings by hand. Fresha/Booksy tie booking to marketplace commissions clinics hate | Commission-free booking page per clinic, deposit-at-booking (no-show defense), embeddable widget + standalone link for Instagram bio. |
| Patient portal **[V2]** | PB client portal | DX/BB: none | Multilingual (sq/it/en) portal: upcoming visits, documents, payments, secure messages. For tourism patients this is the itinerary home. |
| Waitlist + gap-filling **[V2]** | PB waitlist | Setmore/Timely users complain about missing waitlists | Auto-offer freed slots to waitlisted patients via SMS with one-tap confirm — directly monetizes cancellations. |
| Recurring/series appointments **[MVP]** | PB classes; ZN memberships | Generic tools can't book multi-visit treatment plans | Series bound to treatment plans (dental phases, laser courses) with travel-window pinning for tourism sets. |
| Working-hours/rosters, time-off **[MVP]** | All three have basic versions | BB shallow, no payroll link | Roster + commission-ready hours export (DX has commission reports — parity). |

## 2. Patient records & clinical

| Feature | Benchmark | Complaint / gap | Our improvement |
|---|---|---|---|
| Patient timeline (every visit/payment/message/document on one screen) **[MVP]** | DX patient card + timeline (its best idea); PB client card | PB Pabau-2 client card praised in concept, buggy in practice | Adopt DX's one-screen patient card concept; make the timeline the app's spine (see architecture spec §2.2). |
| Form builder + e-consent **[MVP]** | PB conditional forms, auto-chained to bookings (their most-loved feature) | PB: can't add text boxes on e-papers; heavy learning curve | Match "consent chained to booking type" exactly; ship pre-built Albanian+Italian legal-reviewed template packs so clinics never build forms from scratch. Click-to-sign with tamper-evident audit trail; QES option for high-risk procedures (per regulatory memo). |
| Anamnesis / medical history **[MVP]** | DX, PB (medical-condition + allergy components, SNOMED/ICD) | — | Structured allergy/condition fields from day one (drives safety alerts at charting); SNOMED/ICD lookup **[LATER]** — overkill for Albania v1. |
| Odontogram (dental) **[MVP-dental]** | Open Dental/Dentrix standard; **DX has none** | DX stores x-rays as files only | Interactive tooth chart driving treatment plans and quotes — the single clearest clinical differentiator vs DX. |
| Face/body charting (aesthetics) **[MVP-aesthetics]** | PB injection plotting with **auto stock deduction** (loved); ZN 200+ body guides | ANS/BB: nothing comparable in-region | Match PB's plot-on-face → auto-deduct-units flow; add per-zone dose history over time (patients ask "what did I get last time?"). |
| Before/after photos **[MVP-aesthetics, V2-dental]** | PB stencils for consistent angles (loved) | Photos on personal phones = compliance violation; generic consent insufficient | Stencil-guided capture from the browser/mobile, consent-per-use flags (clinical/marketing/social), side-by-side compare. Sell it as "get the photos off your injector's phone." |
| Treatment plans & phased quotes **[MVP]** | DX branded signable PDF quotes (its flagship); PB quotes | Quote-only pricing everywhere; DX quotes not linked to clinical chart depth | Quotes generated *from* the odontogram/charting, multi-currency (EUR/GBP/ALL), signable, versioned. One click from accepted quote → booked visit series. |
| e-Prescriptions **[LATER]** | PB (UK integrations) | Albania has no private e-Rx rail | Print/PDF prescriptions from templates now; national integration when it exists. |
| Imaging: X-ray/DICOM + STL scan import & viewer **[V2]** | Nobody in-region; global PMSs bridge to imaging suites | DX = file storage only | Drag-and-drop STL/PLY/DICOM viewer on the patient record (per scanner research: file-based first, Medit API next). Tourism killer feature: patient scans viewable by the home-country dentist through the portal. |
| Lab-work tracking (dental) **[V2]** | **DX unique feature** (stage tracking impression→delivery) | Not in any global small-clinic product | Match DX (parity), add lab-side login link (they built clinic→lab; we add lab→clinic status updates). |

## 3. Recall & retention (the differentiator)

| Feature | Benchmark | Complaint / gap | Our improvement |
|---|---|---|---|
| Protocol-driven recall engine **[MVP]** | DX "recall reminders by treatment type"; PB recalls; Dentrix/Open Dental recall is famously manual | Open Dental: "weak patient tracking/recall, manual queries"; 25–40% of patients overdue at any time; 57% botox 6-month return rate | Rule-based protocols shipped as content (hygiene 6-mo, implant 2-trip, botox 3–4-mo, filler review 2–3-wk, laser series) with escalation ladders (SMS → WhatsApp → call task) and stop conditions. The demo: "here's the revenue sitting in your overdue list." |
| Overdue/reactivation dashboard **[MVP]** | Nobody does this well at SMB tier | Reactivation decays 28–34% → 8–15% past 12 months | Sort the call list by decay curve — oldest-first is provably wrong; rank by expected recovery value. |
| Pre-booking nudge at checkout **[MVP]** | — | Pre-booked patients reattend 80–90% vs 35–45% | Checkout flow requires an explicit "next visit" decision (book/decline/protocol default) before payment closes. |
| No-show deposit policies **[MVP]** | PB deposits; BB DEPOSIT_PAID status | Fresha's deposit tooling tied to their processor | Per-service deposit rules with local payment rails; SMS reminder cadence proven by the Cochrane evidence (48h + 3h). |

## 4. Communications

| Feature | Benchmark | Complaint / gap | Our improvement |
|---|---|---|---|
| Automated reminders (SMS/WhatsApp/email) **[MVP]** | All competitors; PB meters SMS via credits | PB/Phorest: hidden SMS charges — top complaint theme | Transparent bundled message allowance, overage at cost + margin shown in the price list. No credit games. |
| Unified inbox on patient timeline **[MVP]** | DX WhatsApp/email/call in one interface (its core sell) | **Compliance flaw: Guideline 2/2025 prohibits WhatsApp for health data — DX/BB route clinical content through it** | Match the unified inbox, but enforce the compliance split: WhatsApp/SMS = scheduling + links only; clinical content auto-routes to secure portal messages. Sell the split as inspection-proofing. |
| Two-way messaging with templates (sq/it/en) **[MVP]** | DX localized quote templates | Pabau English-only | Language auto-selected per patient; tourism patients get Italian/English, domestic get Albanian. |
| Click-to-call with logging **[V2]** | DX (calls logged/timed per patient) | — | Parity via VoIP integration; call outcomes feed the lead pipeline. |

## 5. Tourism module

| Feature | Benchmark | Complaint / gap | Our improvement |
|---|---|---|---|
| Lead pipeline + auto-assignment **[MVP-tourism]** | DX (flagship: capture → assign → KPI per agent) | DX has no patient-facing side | Parity on pipeline + agent KPIs; add web lead-capture forms and Instagram/WhatsApp entry points. |
| Travel calendar (flights/hotels/transfers per patient) **[MVP-tourism]** | **DX unique** | Manual entry only | Parity first (manual + links); flight-status API enrichment **[LATER]**. |
| Journey timeline (quote→deposit→trip1→healing→trip2→aftercare) **[MVP-tourism]** | Nobody — DX tracks logistics, not the clinical journey | Facilitators run this on WhatsApp/spreadsheets | The journey object ties visits, payments, documents, and the home-dentist handoff into one shareable view — patient sees it in the portal. This is the category-defining feature. |
| Cross-border deposits **[MVP-tourism]** | Nobody in-region | Stripe unavailable to Albanian entities | Stripe via foreign entity for EUR/GBP deposits + local rails for balance (per infra plan). |
| Home-dentist document exchange **[V2]** | Nobody | DTA does this by email | Consent-gated share-abroad flow (adequacy-logged per regulatory memo), scans/plans viewable in-browser. |
| Affiliate/facilitator tracking **[V2]** | DX unique links per affiliate | — | Parity + facilitator collaboration seats (free) to make agencies a channel. |

## 6. Inventory & billing

| Feature | Benchmark | Complaint / gap | Our improvement |
|---|---|---|---|
| Stock with batch/lot + expiry **[MVP-aesthetics, V2-dental]** | ZN lot-linked charting; PB injectables auto-deduct; DX thresholds + POs | AmSpa: inventory = "hidden profit killer"; Oct-2024 raids make provenance existential in Albania | Lot→patient traceability with a one-click "recall trace" and a **provenance register** (supplier, CE/AKBPM status) — the inspection-defense feature nobody local has. |
| Fiscalized invoicing **[MVP]** | DX ("compliant, numbered, archived"); BB claimed | Global players: none | Certified-partner API (easyPos/fature.al per comparison doc), offline queue per VKM 239, corrective invoices, VAT-exempt handling. |
| Payments **[MVP]** | PB Pay/terminals/Klarna | No Stripe in Albania | Paysera/EasyPay/bank acquiring + payment links; never mandate our rail (anti-Fresha positioning). |
| Installments/debtor book **[MVP]** | DentalSoft sells this locally | Global tools assume insurance rails | First-class installment plans + debtor aging — matches how Albanian clinics actually get paid. |
| Cost & margin per treatment **[V2]** | DX (margin per treatment, opex tracking) | — | Parity later; needs clean inventory data first. |

## 7. Marketing/CRM & platform

| Feature | Benchmark | Complaint / gap | Our improvement |
|---|---|---|---|
| Segmented campaigns (recall/reactivation/birthday) **[V2]** | DX segments; PB campaigns (+paid add-on) | PB add-on cost creep | Included in the tier, not an add-on — pricing honesty as positioning. |
| Reviews/reputation **[V2]** | PB Google-review redirect; ZN reputation tools | — | Post-visit review request with routing (happy→Google, unhappy→private feedback). |
| Roles/permissions + audit log **[MVP]** | PB roles; DX audit trail per order | Required by Guideline 2/2025 (who/what/when) | Per-record access audit as a core compliance feature, surfaced in a "compliance dashboard". |
| Reporting **[MVP-basic]** | ZN complained "overly complex, inflexible" | — | Five reports done well (revenue, utilization, no-shows, recall performance, provider production); export everything. |
| Public API + webhooks **[LATER]** | PB has it; DX/BB don't | — | After product-market fit; needed for facilitator/lab integrations eventually. |
| Mobile apps **[V2]** | PB iOS-only + criticized; BB Android consumer | PB mobile "lacks key scheduling/chart features" | PWA first (installable, camera access for photos), native later — avoids shipping a bad app, the #1 competitor mobile complaint. |
| Multi-location **[V2]** | ZN strong; PB Enterprise | ZN per-location price stacking complaint | Data model multi-location from day one (spec §2.1); UI when first chain customer needs it. |
| Onboarding/data import **[MVP]** | PB 7–10-day data ops (praised); DX week-one operational claim | CareStack/Dentally migration pain is a churn moment | Import from Excel/CSV + DentalSoft/paper photo-of-book workflows; white-glove for design partners. |

## 8. Cross-cutting product principles (each mapped to a documented complaint)

1. **Published transparent pricing** (vs Dentrix/ZN/CareStack/DX quote-only).
2. **No commissions on the clinic's own clients** (vs Fresha 20%, Booksy Boost 30%, Booking Dentist 15%).
3. **No payment-processor lock-in** (vs Fresha mandatory processing/withheld payouts).
4. **Monthly billing, easy export, no data hostage** (vs PatientNow/Phorest annual lock-in).
5. **No add-on/credit nickel-and-diming** (vs PB credits, ZN add-ons, AlfaDocs "modular trap", tab32 per-use AI fees).
6. **Reliability + out-of-hours deployments** (vs PB office-hours breaking updates, ZN glitchy app).
7. **Local-language human support** (vs "AI bot only" ZN, 9-week Fresha silence).
8. **Compliance-native** (audit trails, consent, provenance, fiscalization — no competitor combines them).

## MVP cut (first paid release, both verticals)

Core: multi-resource calendar, online booking + deposits, patient timeline + anamnesis, form builder + consent packs, protocol recall engine + overdue dashboard, reminders (transparent pricing), unified inbox with compliance split, fiscalized invoicing + local payments + installments, roles/audit, basic reports, Excel import.
Dental: odontogram + phased treatment plans/quotes.
Aesthetics: face charting + lot-traced injectable inventory + stencil photos + consent-per-use.
Tourism (fast-follow within MVP window): lead pipeline, journey timeline, travel calendar, cross-border deposits.
