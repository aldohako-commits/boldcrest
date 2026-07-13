# Data Security Plan — Clinic Platform on Supabase

**Date:** July 2026. Concrete security design for building the platform on **Supabase**, mapped to Albania's Law 124/2024 + Commissioner Guideline 2/2025 (see `docs/research/regulatory-compliance-memo.md`) and GDPR (for Italy/EU expansion). Facts about Supabase are sourced from July 2026 research (`agent research`, key claims cited); items flagged ⚠ need verification with Supabase before being load-bearing.

---

## 0. Decisions up front

| Decision | Choice | Why |
|---|---|---|
| Region | **Supabase on AWS eu-central-1 (Frankfurt)** — a *specific* region, not a "general region" | EEA hosting = adequacy transfer under Law 124/2024 (Commissioner Decision 01/2025); region can't be changed later without migration; general regions lack read-replica support ([regions doc](https://supabase.com/docs/guides/platform/regions)) |
| Plan path | **Pro ($25/mo + usage) now → Team ($599/mo) before onboarding real patient data at scale** | Team unlocks platform audit logs, SOC 2 report access, SAML SSO, 14-day backups, project-scoped roles ([pricing](https://supabase.com/pricing)) |
| Legal docs | **Sign Supabase's DPA from the dashboard on day one**; keep the TIA on file | DPA incorporates EU SCCs (2021/914) + UK addendum ([supabase.com/legal/dpa](https://supabase.com/legal/dpa)); our Art. 27 record lists Supabase (US entity, EU region) as sub-processor with SCC basis |
| API keys | **New key system only**: `sb_publishable_...` client-side, `sb_secret_...` server-side | Secret keys are browser-blocked (401 on browser User-Agent), independently rotatable; legacy anon/service_role deprecated end-2026 ([migration doc](https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys)) |
| Security boundary | **RLS is THE boundary.** The publishable key is public by design; every table ships with RLS enabled + tested policies before exposure | Every documented "Supabase breach" (CVE-2025-48757: 170 apps, 13k users; Moltbook 1.5M tokens) was missing RLS, not platform failure |
| Field-level crypto | **Do not build on pgsodium/TCE (deprecated).** Disk-level AES-256 at rest (platform default) + **app-layer encryption via pgcrypto/libsodium for the highest-sensitivity fields**; secrets in Supabase Vault | Supabase deprecated pgsodium/TCE ([doc](https://supabase.com/docs/guides/database/extensions/pgsodium)); Vault is the supported secrets store |
| HIPAA add-on | Not needed (no US PHI), but **mirror its checklist** as our baseline: PITR, SSL enforcement, network restrictions, MFA on all dashboard accounts, connection logging on, resolve all Security Advisor warnings | It is Supabase's own definition of a high-compliance project ([hipaa-projects doc](https://supabase.com/docs/guides/platform/hipaa-projects)) |

---

## 1. Multi-tenancy & RLS design

**Model:** every tenant-owned table carries `clinic_id` (org) — patients, appointments, notes, photos, invoices, inventory, messages. One Postgres schema, RLS-partitioned.

**Policy pattern:**
- `clinic_id` + the user's role are injected as **custom JWT claims via the Custom Access Token Auth Hook** (not per-row subqueries) — claims sourced from a `memberships` table (user × clinic × role), never from `raw_user_meta_data` (user-editable — a known privilege-escalation vector).
- Every policy: `USING (clinic_id = (select auth.jwt()->>'clinic_id')::uuid)` **and a `WITH CHECK` clause on INSERT/UPDATE** (omitting WITH CHECK allows cross-tenant writes).
- Wrap auth functions as `(select auth.uid())` and **index every column used in policies** — the documented RLS performance traps.
- Role-layered policies on top of tenant isolation: reception can read demographics/schedule but not clinical notes; accountant sees invoices, not records; practitioners see clinical data for their clinic. External collaborators (facilitators, home-country dentists) get scoped grants via share records, never clinic-wide claims.

**Known bypass vectors — standing rules:**
1. **Views:** always `security_invoker = true` (views otherwise run as owner and bypass RLS).
2. **SECURITY DEFINER functions:** never in API-exposed schemas; `search_path` pinned; EXECUTE granted narrowly.
3. **Secret key:** server-side only (Edge Functions / server routes); never `NEXT_PUBLIC_`; GitHub secret-scanning auto-revocation is a backstop, not a control.
4. **Every migration is linted:** Security Advisor / Splinter clean (`rls_disabled_in_public`, security-definer views, mutable search_path) as a CI gate, not a dashboard afterthought.
5. **RLS test suite:** for each table, automated tests attempt cross-tenant read/write with a second tenant's JWT and with the publishable key unauthenticated — failing tests block deploy. This is the control that would have prevented every incident in the research.

## 2. Authentication & access

- **Patients (portal):** email/OTP + optional social login; PKCE flow; short-lived JWTs with refresh-token rotation (platform default).
- **Clinic staff:** email+password with mandatory **TOTP MFA** (free on all plans) for roles that can read clinical data; enforce in-database via `aal` claims in RLS (Supabase's documented MFA-via-RLS pattern) so a stolen password without second factor cannot read patient rows.
- **Supabase dashboard accounts** (our team): MFA mandatory, project-scoped roles when on Team plan; production access limited to 2 named engineers.
- **RBAC:** roles (owner, practitioner, assistant, reception, accountant, external) in `memberships`, projected into JWT claims by the auth hook; permission checks in RLS + UI. Role changes force token refresh.
- **SAML SSO** for clinic chains: later, Team plan ($0.015/SSO-MAU) — not an MVP need.

## 3. Storage (photos, x-rays, scans, documents)

- **All patient media in private buckets** — public buckets bypass access control and are CDN-cached. Separate buckets: `clinical-photos`, `imaging` (DICOM/STL), `documents` (consents/quotes), each with **RLS policies on `storage.objects`** mirroring the table-side tenant+role model (path convention `clinic_id/patient_id/...` validated in policy).
- **Signed URLs are bearer tokens** — anyone with the link can access. Rules: TTL ≤ 5 minutes for clinical media rendered in-app; no signed URLs in emails/SMS ever (links go to the authenticated portal which fetches fresh signed URLs); watermark/audit on export.
- Uploads validated server-side (type/size), EXIF GPS stripped from photos, virus-scan pipeline for patient-uploaded documents (tourism inquiries include photo uploads from unknown parties).
- Photo **consent flags (clinical/marketing/social) enforced at read time**: the API that lists photos for any non-clinical surface filters on consent state — marketing uses cannot even query unconsented objects.

## 4. Encryption

- **In transit:** TLS everywhere; **SSL enforcement ON** for direct Postgres connections; HSTS on the app. Mobile access requires authenticated identity + TLS — explicitly required by Guideline 2/2025 Art. 10.
- **At rest:** platform AES-256 (AWS-managed) as baseline.
- **App-layer field encryption** for a narrow set: national ID numbers, anything payment-adjacent — encrypted in the application with keys held in **Supabase Vault** (not in env vars), so a SQL-level leak of those columns yields ciphertext. Do NOT app-encrypt broadly (kills search/reporting); tenant isolation + access control is the primary control for clinical text.
- **Backups/PITR:** native backups are region-pinned snapshots (same AWS region). ⚠ Confirm WAL/PITR archive residency with Supabase support in writing (secondary-sourced today).

## 5. Audit & logging (Guideline 2/2025 makes this a legal requirement)

Guideline 2 requires data-entry/access control: **who accessed/entered what and when**. Three layers:
1. **Application audit table** (the compliance surface clinics see): every read of a patient's clinical record and every create/update/delete is written to an append-only `audit_log` (actor, patient, action, timestamp, context), rendered in the product's compliance dashboard. Postgres triggers for writes; explicit logging in the data-access layer for reads. This is a product feature, not just ops.
2. **pgAudit** at the database layer (available on the platform) for session/object-level DDL+DML auditing of privileged access.
3. **Platform logs:** Postgres **connection logging kept ON** (new projects default it off since July 2026); auth audit logs; on Team plan, platform audit logs; **log drain** to an external store (~$60/mo per drain + usage) once on Team ⚠ (Pro-plan drain availability is secondary-sourced) so logs survive independently of Supabase and satisfy retention (Pro retains only 7 days natively).

## 6. Backups & disaster recovery

- Daily automated backups (Pro: 7-day retention; Team: 14-day). Add **PITR (~$100/mo per 7-day window, requires ≥ Small compute)** before real clinical data — daily granularity is not acceptable for a system of record.
- **Quarterly restore drills** into a scratch project; documented RTO/RPO targets: RPO ≤ 2 min (PITR), RTO ≤ 4 h.
- Weekly logical `pg_dump` to a **separate EEA-located, separately-credentialed object store** (protects against account-level compromise). Storage buckets replicated likewise.
- No cross-region replica initially (all EU expansion targets are adequacy-covered; add EU-internal read replica for performance later — replica auto-promotion is Enterprise-only ⚠).

## 7. Network & platform hardening

- **Network restrictions (IP allowlist)** on Postgres + pooler: only CI and the two production engineers' egress; the app talks through PostgREST/Edge Functions, not direct SQL.
- Edge Functions: secrets via Supabase secrets manager (they can read `SUPABASE_DB_URL` and secret keys — treat every function as trusted code, review accordingly); **regional invocation pinned to Frankfurt** for functions touching patient data.
- Supavisor transaction-mode pooling (port 6543) for serverless connections.
- No PrivateLink initially (Enterprise; DB-only coverage anyway).

## 8. Secure SDLC & operations

- CI gates: RLS test suite (cross-tenant fuzz), Security Advisor lint, dependency audit, secret scanning, migration review by second engineer.
- Staging project with **synthetic data only** — real patient data never leaves the production project.
- Access reviews quarterly; offboarding checklist (dashboard, GitHub, log drain, Vault).
- **Deployments outside clinic hours** (a top Pabau complaint is office-hours breakage) with instant rollback.
- Annual external penetration test before regional expansion; fix-window SLAs by severity.
- Vendor watch: legacy key deprecation (end-2026), pgsodium removal, sub-processor list changes (DPA notice → update our Art. 27 record).

## 9. Incident response (wired to Law 124/2024)

1. Detect (log drain alerts, Security Advisor, auth anomaly alerts) → triage severity.
2. **As processor: notify affected clinic controllers immediately** (Art. 29(2)) with facts template (nature, categories, approximate counts, measures).
3. Support the clinic's **≤72h notification to the IDP Commissioner** — in-product breach-report generator prefilled from the audit log (this is also a sellable feature).
4. Contain (key rotation — independent secret keys and JWT signing keys rotate without downtime), eradicate, restore (PITR), post-mortem in the register.
5. From ~Jan 2027 (deferred Art. 29(3)) support subject notification workflows.

## 10. Compliance mapping (control ↔ obligation)

| Obligation (Law 124/2024 / Guideline 2/2025) | Control in this plan |
|---|---|
| Art. 28 security (pseudonymization/encryption, CIA, testing) | §4 encryption, §1 RLS, §8 CI gates, pen test |
| Guideline 2 access/use/data-entry control + audit trail | §5 three-layer audit; per-record read logging |
| Guideline 2 "no WhatsApp for health data" | Architecture spec §2.4 compliance split; portal messaging (§3 no signed URLs in messages) |
| Guideline 2 mobile: identity + encryption in transit | §2 auth, §4 TLS/HSTS |
| Art. 26 processor duties / DPA with clinics | Our clinic DPA templates; sub-processor register incl. Supabase (SCC basis) |
| Art. 27 records of processing | Transfer + processing register maintained; log drain evidence |
| Art. 29 breach ≤72h | §9 runbook + in-product breach-report generator |
| Arts. 39–42 transfers | Frankfurt region (adequacy); "share abroad" flow logs recipient+basis |
| Retention/anonymization (Guideline 2 Art. 5) | Retention engine (architecture spec §8); crypto-shredding for app-encrypted fields |
| DPIA readiness (~Jan 2027) | This document + audit evidence = DPIA input pack |

## 11. Cost of this posture (Supabase side)

| Stage | Monthly |
|---|---|
| Build/design partners (Pro + Small compute + PITR) | ~$25 + ~$15 + ~$100 ≈ **$140** |
| Paying clinics at scale (Team + compute + PITR + log drain) | $599 + compute + $100 + ~$60+ ≈ **$800–1,000** |

The Team-plan jump is the real decision point; take it when clinic count (or an enterprise/chain deal requiring SOC 2 evidence and SAML) justifies it.

## Open verifications ⚠
1. PITR/WAL archive region residency — written confirmation from Supabase.
2. Current sub-processor list from the signed DPA (for our Art. 27 register and clinic DPAs).
3. Log-drain availability on Pro plan (secondary-sourced March 2026 rollout).
4. CLOUD-Act posture: Supabase Inc. is a US company operating EU regions on AWS — acceptable under SCCs for Albania/EU today, but have counsel bless it and document in the TIA; if a future customer demands EU-sovereign hosting, the exit path is self-hosted Supabase or EU Postgres (the RLS/Postgres design ports).
