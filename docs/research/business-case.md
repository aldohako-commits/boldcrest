# Business Case — Modular Clinic Platform for Dental & Medical Aesthetic Clinics (Albania → Balkans/EU)

**Date:** July 2026
**Companion document:** `market-research-report.md` (all market claims below are sourced and confidence-flagged there).

---

## 1. Problem & opportunity

**Problem (clinic side).** Albanian dental and aesthetic clinics operate in one of Europe's most competitive local markets (~730+ dental clinics in Tirana alone) while serving a booming international patient base (~80,000 dental tourists in 2024, €200–250M/year sector). Yet their operations are almost entirely manual: the leading local software claims ~135 dentists out of 1,300+ clinics (~90% unpenetrated). Scheduling, recalls, patient records, consent, cross-border follow-up, invoices, and travel coordination run on paper, Excel, and WhatsApp — while regulators simultaneously tighten documentation requirements (1,206 dental inspections in one year; hygiene-sanitary documentation the top violation), data-protection law (GDPR-aligned Law 124/2024), and fiscal rules (real-time invoice clearance; universal POS mandate by end-2026).

**Problem (patient side).** A dental tourist's journey — quote, flights, deposit, first trip (implant placement), 3–6 months of healing, second trip (restoration), aftercare in their home country — is coordinated today by concierge agencies and clinic staff over email and WhatsApp. Existing facilitator platforms are directories with quote-request forms, not booking or care-coordination infrastructure.

**Opportunity.** No product combines: medical-grade clinical records + recall protocols + aesthetics vertical + Albanian/Italian localization + Albanian fiscalization + dental-tourism workflows + transparent pricing. Global incumbents are expensive, English-first, and carry well-documented complaints (hidden fees, commissions, lock-in, poor support). Local tools are thin — with one important exception: **DenteX (dentex.al) already sells a dental-tourism CRM (travel calendar, WhatsApp inbox, quotes, fiscalization) to Albanian clinics**, which both validates willingness to pay and defines the bar to beat. DenteX is CRM-first and dental-only; the clinical layer (EMR, recall-protocol engine, charting), the aesthetics segment, and regional multi-language scale are open. The two-trip tourism workflow is the wedge; the modular platform is the land-and-expand.

## 2. Target segments

| Segment | Size (Albania) | Willingness to pay | Priority |
|---|---|---|---|
| **A. Tourism-oriented dental clinics** (Tirana, implantology/All-on-X, Italian/UK patients) | est. 100–300 clinics (subset of ~390 Tirana-registered + boutique clinics; validate with USSH) | **Highest** — revenue per foreign patient is €3–15k; a no-show or lost follow-up costs real money | **P1 — beachhead** |
| B. Domestic dental clinics | ~1,300 clinics nationwide (directional) | Low–medium (price-sensitive; VAT-exempt so they eat 20% VAT on the fee) | P2 — volume tier |
| C. Medical aesthetic clinics / medspas | No official count; dozens+ in Tirana, growing (international chains entering) | Medium; compliance pressure post-Oct-2024 raids | P2 — compliance-led pitch |
| D. Tourism facilitators/agencies (DTA-style, local agencies) | ~5–15 active in the Albania corridor | Partnership channel more than direct revenue | P3 — channel |
| E. Regional expansion (Kosovo, N. Macedonia, Montenegro → Italy corridor) | Kosovo/NMK dental markets are structurally similar; Italy = 60% of patient origin | — | Phase 2+ |

## 3. Market sizing (deliberately conservative; assumptions explicit)

**Assumptions:** blended SaaS ARPA Albania €50/mo (€600/yr) across tiers; tourism-clinic premium tier €120/mo; regional ARPA similar; Italy ARPA €90/mo. Clinic counts per research report (directional, not official).

- **TAM (software, Albania):** ~1,700 addressable clinics (1,300 dental + est. 400 aesthetic/beauty-medical) × €600/yr ≈ **€1.0M ARR** — Albania alone is a wedge, not the prize.
- **TAM (software, Albania + Kosovo + N. Macedonia + Montenegro):** est. 4,000–5,000 clinics ≈ **€2.5–3M ARR**.
- **TAM (incl. Italy corridor dental/aesthetic segment):** Italy has ~36,000 dentists; capturing even the tourism-adjacent and small-clinic slice (5%) at €90/mo ≈ **€19M+ ARR** — the expansion story.
- **Transaction layer (tourism module):** 80,000+ dental tourists/year × avg €3,000+ treatment value ≈ **€240M+ payment flow** in the corridor. At a 1–2% payment/deposit take rate on even 10% of flow: **€240–480k/yr** incremental — plus flight/hotel affiliate revenue. This layer, not seat licenses, is what makes the Albanian beachhead financially interesting.
- **SAM (realistic 3-year reach):** tourism-oriented Tirana clinics + early domestic adopters + aesthetic clinics ≈ 400–600 clinics ≈ **€300–450k ARR** + transaction revenue.
- **SOM (24 months):** 120–180 paying clinics (≈10% of national clinic base, ≈40% of the tourism-oriented beachhead) ≈ **€90–150k ARR** + early transaction revenue.

> Honest read: a pure-SaaS Albania-only business is too small to venture-scale. The case rests on (a) the tourism transaction layer, (b) regional/Italy expansion once the product is proven in the most demanding workflow (cross-border), and (c) the fiscalization/compliance moat making Albania defensible.

## 4. Product macro-concept (modular)

**Base platform (every clinic):**
- Multi-provider calendar (provider + chair/room + device conflict resolution), online booking page, SMS/WhatsApp/email reminders (Cochrane-proven no-show lever)
- Patient records: treatment notes, medical history, document storage, e-consent with audit trail
- Recall/follow-up protocol engine: rule-based (hygiene 6-mo, implant 2-trip, botox 3–4-mo, filler review 2–3-wk) with automated outreach — *the headline feature; directly monetizes the 57%-Botox-return and 25–40%-overdue-recall gaps*
- Multi-user access with roles/permissions (dentist, assistant, reception, accountant), full audit log
- GDPR/Law-124-2024 tooling: consent registry, data-subject requests, breach workflow, DPA templates, role-based access — sold as "be inspection-ready"
- Albanian + Italian + English UI

**Add-on modules (per-module pricing):**
1. **Tourism module (flagship):** patient-journey timeline (quote → deposit → trip 1 → healing → trip 2 → aftercare), travel-window-aware scheduling, multi-currency deposits/payments from abroad, document/photo exchange portal for the patient and their home-country dentist, translation-ready templates, agency/facilitator collaboration seats, flight/hotel booking links (affiliate; API integration later — start with links, not a GDS integration)
2. **Fiscalization & billing:** certified e-invoice issuance via CIS (partner API first — devPOS/easyPos — own certification later), POS/card integration via Paysera/EasyPay/bank acquiring (no Stripe in Albania), VAT-exempt handling
3. **Imaging & scans:** file-based STL/PLY/DICOM import + viewer attached to patient record (works with all scanners, day one) → Medit Link Open API → VDDS/OPP → 3Shape/iTero partner programs when volume justifies
4. **Aesthetics clinical pack:** injectable charting (units/zones, face-mapping), before/after photo management with per-use consent, **lot-number/expiry inventory with provenance records** (directly answers the post-raid compliance environment)
5. **Marketing/CRM:** campaigns, reviews, referral tracking, packages/memberships — later; competitors' weakest complaints are not here

**Anti-features (deliberate, mapped to competitor complaints):** no marketplace commission on the clinic's own clients; no mandatory payment processor; monthly billing with data export; published pricing; local-language human support.

## 5. Pricing strategy

| Tier | Price (excl. VAT) | Contents |
|---|---|---|
| Solo / Starter | **€19–29/mo** | 1–2 users, base platform — undercuts ANS (£25–50), way under Pabau ($62+); sized for ~€870 avg-wage economy and the 20% irrecoverable VAT |
| Clinic | **€49–69/mo** | Full base, unlimited users, fiscalization add-on included |
| Tourism Pro | **€119–149/mo** | Clinic + tourism module + imaging import + priority support |
| Transaction fees | **1–1.5%** on cross-border deposits/payments (optional rail, never mandatory) |
| Modules à la carte | €15–39/mo each (aesthetics pack, marketing, advanced imaging) |

Anchors: Dentalino (Serbia) €20–30/mo = regional dental price floor; ANS £25–50 = aesthetic medical-grade floor; Pabau $62 / Dentally £50/surgery = closest analog entries; AlfaDocs €109+ = Italian cloud benchmark (with its "modular trap" complaint as a warning: bundle honestly); Zenoti/PatientNow $200–500 = ceiling. Annual prepay −15–20%. Founding-clinic lifetime discount for the first 20–30 design partners. Publishing prices is itself a differentiator — DenteX, Dentrix, Zenoti, CareStack are all quote-only, a documented complaint theme.

## 6. Go-to-market (Albania first)

1. **Design-partner phase (months 0–6):** 15–25 Tirana tourism-oriented clinics recruited via direct outreach; free/discounted in exchange for weekly feedback. Validate the two-trip workflow and pricing before scaling. (Also: mystery-shop DentalSoft.al/DentalonWeb pricing; get real dentist counts from USSH.)
2. **Channel via facilitators:** DTA-style agencies and local facilitators get free collaboration seats — they push their partner clinics onto the platform because it reduces their own WhatsApp chaos. The research shows facilitators have zero booking infrastructure; being their rails is cheaper than competing with them.
3. **Compliance-timed marketing:** ride three regulatory deadlines — universal POS mandate (Dec 2026), Law 124/2024 DPIA wave (~2027), ongoing hygiene-documentation inspections. "Get compliant + get paid digitally + fill your recall book."
4. **Community & language:** Albanian-language content, USSH/dental-association events, the 400–500 new graduates/year as a bottom-up funnel (free student/first-year tier).
5. **Expansion sequencing:** Kosovo + N. Macedonia (language/market adjacency, Pabau's own back office is in Skopje — move before they look south) → Montenegro → Italian small clinics via the corridor relationships.

## 7. Competitive positioning

**One-liner:** *The only clinic platform built for Balkan clinics and their international patients — medical-grade records, automated recalls, Albanian fiscalization, and the entire dental-tourism journey in one place, in your language, at a local price, with no commissions.*

| Against | Their weakness (documented in reviews) | Our counter |
|---|---|---|
| **DenteX (dentex.al) — closest competitor**: Albanian dental-tourism CRM (travel calendar, WhatsApp inbox, quotes, fiscalization) | CRM-first, not a clinical EMR (no recall-protocol engine/charting depth); dental-only; quote-only pricing; single-market | Full clinical platform + aesthetics vertical + published transparent pricing + multi-language regional scale. Track closely — also proof clinics here pay for software |
| Fresha/Booksy (free/low-end) | 20–30% marketplace commissions, withheld payouts, no clinical records | No commissions; real EMR; local payments |
| Pabau (closest global analog) | Bugs/reliability, English-only, no fiscalization/tourism | Reliability + localization + regulatory fit |
| Zenoti/PatientNow (upmarket) | $200–600/mo, opaque pricing, lock-in, support complaints | 5–10× cheaper, transparent, monthly |
| AlfaDocs (Italy — expansion phase) | Modular fee-stacking "trap" (top Trustpilot complaint: totals hit €1,500–2,000/yr) | Transparent bundles; tourism corridor features Italy-side |
| DentalSoft.al & other local/Balkan tools (Dentalino €20–30/mo is the regional price floor) | Thin features, no tourism/compliance depth, no review presence | Full modular platform; still local-priced |
| Facilitator platforms (DTA, Booking Dentist €99+15%/patient) | Directories + quote forms, commissions, no clinic software | We power the clinic side; partner, not fight |

## 8. Risks & mitigations

| Risk | Likelihood/impact | Mitigation |
|---|---|---|
| Fiscalization certification proves slow/costly | Med / High | Launch via certified partner API (devPOS/easyPos); certify own stack later; confirm DPT requirements in month 1 |
| Albania-only revenue too small | High / Med | Tourism transaction layer + regional expansion are core to the plan, not options; gate hiring to expansion milestones |
| Price sensitivity worse than modeled (VAT drag, cash habits) | Med / Med | Solo tier at €19; annual prepay discounts; transaction-funded economics on tourism tier |
| **DenteX entrenches as the default tourism CRM before we launch** | Low–Med / Med (downgraded after teardown: no verifiable customers, no registry entity, no reviews, no patient-side product — see `competitor-teardowns.md`) | Differentiate on clinical depth + aesthetics + patient booking/portal + published pricing; move fast on design partners |
| Pabau or Fresha localizes for the Balkans | Low–Med / High | Move fast on fiscalization + tourism workflows (they won't build Albanian tax integration for a small market); lock in facilitator channel |
| Aesthetics regulatory shock (Botox status, further raids) | Med / Med (aesthetics module only) | Lead aesthetics with compliance/traceability; keep dental as revenue backbone |
| Health-data breach / Law 124-2024 enforcement | Low / Severe | GDPR-grade architecture from day one; DPO; EEA hosting; audit trails — also a selling point |
| Key-person / small-team execution risk on a broad modular scope | High / High | Strict module sequencing (see roadmap); base + tourism before everything else |
| Facilitators see us as competition | Low / Med | Free seats, white-label patient portal, never operate our own patient-acquisition marketplace in phase 1 |

## 9. Roadmap (high-level, business framing)

- **Phase 0 (months 0–2) — Validate:** 20+ clinic interviews (Tirana), USSH data, DPT fiscalization requirements, facilitator partnerships signed as LOIs. Kill/adjust pricing here.
- **Phase 1 (months 2–8) — Base + beachhead:** base platform (calendar, records, consent, recalls, reminders, roles) in sq/it/en; fiscalization via partner API; 15–25 design-partner clinics live.
- **Phase 2 (months 8–14) — Tourism module:** patient-journey timeline, cross-border deposits (Paysera/EasyPay + foreign-entity Stripe for abroad), document portal, facilitator seats; file-based scan/DICOM import. Target: 60–100 paying clinics, first transaction revenue.
- **Phase 3 (months 14–24) — Aesthetics pack + region:** injectable charting, photo consent, lot-number inventory; Kosovo/N. Macedonia launch; Medit Open API integration; 120–180 paying clinics, €90–150k ARR + transactions.
- **Phase 4 (24+ months) — Italy corridor & depth:** Italian small-clinic entry via corridor clinics and patient-side brand; 3Shape/iTero partner applications; marketing/CRM module; evaluate own fiscalization certification.

## 10. The headline

**A €200–250M/year cross-border patient economy runs on WhatsApp, while 90% of Albania's ~1,300 dental clinics have no software at all — and every regulatory trend (fiscalization, GDPR-aligned data law, POS mandate, inspections) is pushing them to digitize now.** The winning move is not "another booking app": it is owning the two-trip dental-tourism workflow that no global or local player serves, wrapped in a modular, Albanian-and-Italian, compliance-native platform priced for the market — with the transaction layer and Balkans/Italy expansion turning a small-country wedge into a real business.
