# Platform Architecture Spec — Shared Core vs Vertical Modules

**Purpose:** define the boundary between the shared platform core and the dental / aesthetics vertical modules so both verticals can be built **in parallel** without duplicating work or coupling their roadmaps. This is a product-level spec (entities, capabilities, boundaries), not a technical design.

**Rule of thumb used throughout:** a capability goes in the **core** if both verticals need it with the *same data model and workflow*, and in a **vertical module** if the workflow or clinical data differs. When in doubt, the core owns the entity and the vertical owns the *template/configuration* of it.

---

## 1. The one-sentence architecture

> A single platform core (patients, calendar, communications, consent, billing, roles, compliance) exposes **extension points** — chart templates, recall-protocol definitions, resource types, inventory item types, document templates — which the dental and aesthetics modules fill with their own content; the tourism module sits on top of the core and works for both verticals.

This means the two verticals are mostly **configuration + specialized UI** over shared machinery. That is what makes parallel development affordable: two small vertical teams never touch each other's code, and 70–80% of the build is one shared effort.

---

## 2. Shared core (build once, both verticals consume)

### 2.1 Identity & access
- Clinic/organization accounts, multi-location support from day one (data model only; multi-location UI can come later).
- Users with **roles**: owner, practitioner, assistant, reception, accountant, external collaborator (facilitator/partner-dentist — needed for tourism). Role-based permissions on every entity; full audit log (regulatory requirement under Law 124/2024 and a sales point given inspection pressure).

### 2.2 Patient record (the spine)
- Core demographics, contact channels + channel consents (SMS/WhatsApp/email — marketing consent separate from care communications, per GDPR/Law 124/2024).
- **Timeline model**: every interaction (appointment, note, document, photo, payment, message, consent) is a timeline event on the patient. Both verticals and the tourism module render from the same timeline.
- Document store: uploads, generated PDFs, e-signed consents; per-document access rules.
- **Photo store with consent flags per use** (clinical / internal / marketing / social) — aesthetics needs this hardest, dental tourism needs it too (smile before/afters); it's core.
- Data-subject rights tooling: export, erasure workflow, consent registry (one build satisfies both verticals' GDPR/124-2024 duties).

### 2.3 Scheduling engine
- Multi-resource booking: appointment = patient × provider × **room/chair** × optional **device**, with conflict detection across all three. (Dental needs chair; aesthetics needs room + laser device; same engine, different resource types.)
- Online booking page per clinic; deposits at booking (no-show defense); waitlists; recurring/series appointments (aesthetics treatment courses, dental multi-visit plans).
- Working-hours/rosters, blocking, and **travel-window constraints** as a first-class concept (an appointment set can be pinned to a date range — the tourism module uses this; domestic recalls ignore it).

### 2.4 Communications & reminders
- Template-based messaging over SMS / WhatsApp / email with delivery tracking, in Albanian/Italian/English; automated reminder schedules per appointment type (the Cochrane-proven no-show lever).
- Two-way inbox on the patient timeline (DenteX's WhatsApp-unification is table stakes for tourism clinics).
- **Compliance boundary (regulatory memo, Guideline 2/2025):** WhatsApp and personal apps are prohibited for exchanging *health data*. Design rule: WhatsApp/SMS carry scheduling, reminders, and links only; clinical content (records, x-rays, treatment plans, photos) travels exclusively through the secure patient portal, with the message templates enforcing this split. This is a differentiator — DenteX and BeautyBooking route clinical conversations through WhatsApp.

### 2.5 Recall / protocol engine ⭐ (the differentiating core asset)
- A generic **protocol definition**: trigger (treatment performed / time since visit / manual) → schedule of follow-up actions (message, task, booking prompt) with escalation and stop conditions.
- The engine is core; the **protocol library is vertical content**: dental ships hygiene-recall (6-mo default, risk-based option), implant two-trip, post-extraction check; aesthetics ships botox 3–4-mo, filler 2–3-wk review + 6–18-mo retouch, laser series. Clinics can clone/edit.
- KPI surface: overdue-recall list, reactivation-decay reporting (the 25–40%-overdue and 57%-botox-return numbers from the research are the sales demo).

### 2.6 Consent & forms engine
- Form builder + e-signature with tamper-evident audit trail; forms attach to appointment types (auto-send before visit). Vertical modules ship **form template packs** (dental: anamnesis, implant consent, GDPR notices; aesthetics: per-treatment consents, photo-use consents).
- E-signature must satisfy Albanian AKSHI e-signature rules (verify in compliance memo).

### 2.7 Billing, fiscalization & payments
- Quotes/treatment-plan pricing → invoices → payments (cash, card/POS, bank transfer, online deposit), installment tracking (local clinics run debtor books — DentalSoft sells this today).
- **Fiscalization adapter interface**: one abstraction, first implementation = certified partner API (per workstream #9 comparison), later optionally own certification. VAT-exempt medical handling built in.
- Payment-provider abstraction: Paysera/EasyPay/bank acquiring locally; foreign-entity Stripe rail for cross-border tourism deposits.

### 2.8 Inventory engine
- Generic stock: items, suppliers, purchase, stock levels, **batch/lot + expiry tracking**, consumption linked to an appointment/charting event, low-stock and expiry alerts.
- Vertical content: aesthetics ships injectable item types where **lot→patient traceability is mandatory UX** (recall-readiness, provenance documentation — the post-raid compliance pitch); dental ships consumables/implant components (implant batch traceability is an EU MDR-adjacent selling point for tourism clinics).

### 2.9 Reporting core
- Revenue, utilization, no-show rate, recall performance, per-provider production; vertical modules add their own KPIs on the same engine.

---

## 3. Dental module (vertical team A)

Owns only what is dental-specific:
1. **Odontogram / tooth chart** — per-tooth/per-surface status and history; the one UI component with no aesthetics equivalent. Treatment plans reference teeth.
2. **Dental treatment catalog & plan builder** — staged plans (phase 1 surgery / phase 2 prosthetics) that drive quotes and the two-trip tourism timeline.
3. **Imaging attachments** — X-ray/CBCT (DICOM) and scan (STL/PLY/OBJ) import + viewer on the patient record (file-based first, Medit API next, per scanner research). Shared file infrastructure, dental-specific viewers.
4. **Protocol pack**: hygiene recall, implant two-trip, post-op checks.
5. **Form pack**: dental anamnesis, procedure consents.
6. **Lab-work tracking** (impressions/scan sent → lab → fitted) — dental-only workflow.

## 4. Aesthetics module (vertical team B)

Owns only what is aesthetics-specific:
1. **Face/body charting** — annotate injection points, units per zone, product per zone on face/body maps; laser settings per session; SOAP-style treatment notes.
2. **Treatment-series management** — packages/courses (6-session laser), session progress notes, series-completion tracking.
3. **Before/after photo workflows** — standardized capture guidance (fixed views), side-by-side comparison UI, marketing-consent gating (uses core photo store).
4. **Injectable inventory UX** — lot-per-patient administration flow on top of core inventory (select vial/lot at charting; auto-deduct units).
5. **Protocol pack**: botox 3–4-mo recall, filler review + retouch, series reminders.
6. **Form pack**: per-treatment consents, photo-use consents, medical-history screeners.
7. **Compliance dashboard** (Albania-specific): product provenance register — the answer to the Oct-2024 enforcement environment.

## 5. Tourism module (cross-vertical, one team or core team phase 2)

Vertical-agnostic by design — a dental implant journey and an aesthetics procedure trip share the same skeleton:
1. **Journey timeline**: inquiry → quote → deposit → trip 1 (treatment) → remote healing/recovery period → trip 2 (completion) → aftercare; each stage with tasks, documents, payments, and travel-window-pinned appointment sets (uses core scheduling constraint).
2. **Lead/quote CRM**: inquiry capture (web form/WhatsApp), photo-based remote assessment request, branded multi-currency quotes (DenteX parity).
3. **Patient portal** (web, multilingual): itinerary, documents, payments, messaging — the patient-facing surface.
4. **External collaborator access**: facilitator/agency seats; home-country dentist/doctor document exchange (consent-gated record sharing — per compliance memo).
5. **Travel logistics**: manual entries + affiliate links first (flights/hotels); API integrations later. Do not build a GDS integration in v1.
6. **Cross-border payments**: deposit collection abroad (Stripe via foreign entity), balance locally (fiscalized).

## 6. What is deliberately NOT shared

- Odontogram ↔ face-mapping: superficially similar ("annotate a diagram"), but per-tooth clinical semantics vs zone/unit dosing semantics differ enough that a generic "body chart engine" would be an over-abstraction. Build separately; share only the drawing/annotation UI toolkit if convenient.
- Vertical protocol/form/catalog content — always vertical-owned, even though the engines are core.
- Lab-work tracking (dental) and treatment-series packages (aesthetics) — distinct workflows; no forced common model.

## 7. Parallel-build operating model

- **Team shape:** 1 core team (largest), 2 small vertical teams (can be 1–2 people each early), tourism joins after core scheduling/patients are stable. Vertical teams never modify core directly — they request extension points; core team owns the extension-point contracts.
- **Contracts before code:** the five extension points (chart templates, protocol definitions, resource types, inventory item types, form/document templates) get their interfaces specced first; that's the only coordination the vertical teams need.
- **Sequencing reality check:** core 2.1–2.4 + 2.6 must exist before either vertical demos; protocol engine (2.5) is the first differentiator to ship; fiscalization (2.7) must be in the first paid release for Albania; inventory (2.8) can trail by one cycle for dental but not for aesthetics (it's their compliance pitch).
- **Design partners per vertical:** recruit separately (tourism-dental clinics ≠ medspas); one shared design-partner pool would bias the core toward whichever vertical shouts louder.
- **Definition of "parallel" success:** both verticals demo on the same core build, and a mixed clinic (dental + aesthetics under one roof — common in Tirana) runs both modules on one account. That mixed-clinic case is also a sales wedge no competitor covers.

## 8. Resolved inputs from the research workstreams

- **Fiscalization adapter:** integrate-first via easyPos or fature.al (public API docs, test environments); self-certification is legally unavailable to a startup (10-employee/30M-ALL-turnover/1-year-history criteria + 10M ALL guarantee — see `regulatory-compliance-memo.md`). Adapter must handle: NSLF/NIVF, QR rendering, offline queue with UII invoices + re-fiscalization, corrective invoices (no deletes), cash-deposit events, UBL 2.1 e-invoices. Onboarding must walk each clinic through its AKSHI e-certificate (4,000 ALL/yr).
- **Injectables (aesthetics):** botox remains unregistered in Albania; only 4 specialist profiles may inject. Aesthetics module leads with legal treatments (fillers/lasers), practitioner-credential tracking, and provenance documentation; injectable inventory UX frames around CE-marked/registered products.
- **E-signature:** click-to-sign with robust audit trail suffices for routine consent demonstrability under Law 124/2024; support QES (AKCESK/EU-qualified) for high-risk procedures. Wet-ink requirements still open with counsel.
- **Teardown reconciliation:** the aesthetics parity bar (from Pabau's most-loved features) = consent forms auto-chained to bookings, before/after photos with capture stencils, injection plotting with automatic stock deduction, automated reminders. The tourism parity bar (from DenteX) = unified lead inbox, branded signable PDF quotes, travel calendar with flights/hotels per patient, affiliate tracking. Our additions neither has: patient online booking + portal, mobile apps, odontogram, imaging integrations, public API.
- **Compliance features promoted to core** (Guideline 2/2025 requirements): per-record access audit trail (who/what/when), encrypted transit incl. mobile identity verification, retention/anonymization engine, "share abroad" flow with prior-information capture and Art. 27 transfer logging, breach-escalation runbook (processor→controller immediately, controller→Commissioner ≤72h), clinic license + technical-director credential capture at onboarding (II.6.A.3 dental / II.6.A.5 aesthetics), practitioner validation against the USSH register.

## 9. Remaining open questions

- DPO threshold ("large-scale") and standard DPA clauses — ask the IDP Commissioner.
- Wet-ink consent requirements and telemedicine status for cross-border pre-consults — health-law counsel.
- easyPos vs fature.al — decide after prototyping both APIs and reviewing white-label contract terms.
- Dental-record retention periods under Albanian sector law (drives the retention engine defaults).
