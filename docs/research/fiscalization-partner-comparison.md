# Albanian Fiscalization Providers — Integration Comparison for the Clinic SaaS

**Date:** July 2026. Decision input for the fiscalization adapter in `docs/product/platform-architecture-spec.md` (§2.7). Confidence flags: [high]/[med]/[low]; vendor pricing changes often — re-verify before contracting.

## Recommendation (TL;DR)

1. **Integrate-first: easyPos (ESDP shpk)** — the only provider with a versioned, public cloud REST API explicitly built for third-party software (`POST /invoice/register` → NSLF/NIVF), Postman docs and sample code, certified for all four modules. Per-clinic cost anchor ~7,000–15,000 ALL/yr (€65–140).
2. **Co-first-choice: fature.al** — public Postman docs + a real TEST environment + per-user API tokens; cheapest published pricing (9,600 ALL/yr covers non-cash + e-invoice, which is most of what clinics need). Main risk: small/new company; its legal entity wasn't matched in the DPT registry in this pass — verify.
3. **Prototype against both in parallel** (both testable in days); choose on API ergonomics + white-label contract terms. **Fallbacks:** Bills.al (BNT Electronics — full API, transparent 1,399 ALL/mo) and devPOS (proven large integrations, sales-gated docs) for enterprise chains.
4. **Do NOT self-certify now:** DIY requires a **~10,000,000 ALL (~€100k) bank guarantee to DPT** plus re-certification on every software version. Revisit at hundreds of Albanian clinics.
5. **Watch DDD Invoices** — their Albania support is officially "Pending"; when live, one API would cover Albania + Montenegro + regional expansion. Ask them for a timeline. Also find out who powers **DenteX's** fiscalization (they advertise it but aren't in the certified registry, so they integrate someone — proof the partner-API route works for clinic software).

## Regulatory frame

Law 87/2019: every B2G/B2B/B2C invoice cleared in real time via the DPT Central Information System (CIS) — CIS assigns the **NIVF**, software generates the **NSLF**; UBL 2.1 / UN-CEFACT XML; AKSHI digital certificate per taxpayer (4,000 ALL/yr, e-Albania application). Only certified software may fiscalize; official registry: https://www.tatime.gov.al/c/424/494/lista-e-subjekteve-te-certifikuara (Jan 2024 snapshot: 49 entities). **None of DDD Invoices, Melasoft, EDICOM, or Sovos are in the registry** — foreign compliance vendors must front a certified local producer. [high]

## Comparison table

| Provider | 3rd-party API | Public docs | Pricing signals | Fit |
|---|---|---|---|---|
| **easyPos/easyInvoice** (ESDP) | YES — public cloud REST + local APIs + file | YES (easypos.al/api, Postman, v2.3.2) | easyPos 7,000 ALL/yr; easyInvoice 10,000; bundle 15,000 | **Best-documented public API** |
| **fature.al** | YES — REST, LIVE+TEST envs, per-user tokens | YES (public Postman) | 7,200 / 9,600 / 15,000 ALL/yr; 7-day trial | **Cheapest with test env** |
| **Bills.al** (BNT Electronics) | YES — cloud & on-prem API, CSV/file | Partial | Basic 399 → Full 1,399 ALL/mo (API in Full); unlimited invoices | Strong fallback, transparent monthly pricing |
| **devPOS** (dev.al) | YES (claims major enterprise integrations) | NO (sales-gated) | 4,415–17,490 ALL turnover-tiered (2021 prices) | Enterprise fallback |
| **Logical** (logic.al) | Partial — "fiscalization as a service for uncertified apps" | NO | Modular, sales-led | Possible, sales-led; 900+ customers in AL/XK/MK/ME/BA |
| **OneTech** | Unclear — MS Dynamics ERP-embedded | NO | Not published | Poor fit (ERP projects) |
| **Elif (2RM Lab) / Bilanc / Oxana** | Not productized | NO | Oxana 6,000–15,000 ALL/yr | Weak |
| **Flexie CRM** | YES — open-source .NET/PHP fiscalization SDKs (MIT, GitHub) | YES | Unknown | Wildcard; useful reference code |
| **DDD Invoices** (intl) | Global API, **Albania "Pending"** | YES | Per-invoice usage-based | Not usable today; ideal regional abstraction later |
| **Melasoft / EDICOM / Sovos** (intl) | Country guides only, no local certification | — | Enterprise | Avoid |

## Key detail per shortlisted provider

### easyPos / easyInvoice (ESDP shpk, Tirana, founded 2013)
- Public REST API guide v2.3.2: `POST /invoice/register` returns NSLF/NIVF/verification link; targets "ERP, e-commerce, accounting, kiosk and business applications"; local APIs for POS sales and e-invoices (credit notes, corrective/partial invoices); JSON/TXT file integration with samples; access via "Request API Access" (https://easypos.al/api, https://help.easypos.al/api). [high]
- Certified all four modules (registry entry "Embedded Systems Design and Production"); offline module with the legal 48-hour sync window; ready WooCommerce/Shopify/Magento integrations. [high]
- Pricing per vendor blog: easyPos from 7,000 ALL/yr, bundle 15,000 ALL/yr incl. support and tax-system sync; API-tier pricing on request. [med]

### fature.al
- Public Postman docs (https://documenter.getpostman.com/view/24733898/2s8YzL4Rrq): invoices, clients, items, real-time fiscalization status; tokens in-app; **LIVE and TEST environments**. [high]
- Pricing published: 7,200 ALL/yr cash / 9,600 ALL/yr non-cash+e-invoice / 15,000 ALL/yr full; 7-day free trial. [high]
- Risk: newer/smaller; legal entity behind it not matched to the DPT registry in this pass — **verify certification before contracting**. [med]

### Bills.al (BNT Electronics)
- API page (https://bills.al/api-cloud-infrastrukture-lokale/): cloud & on-prem API, invoice create/correct/cancel, e-invoice creation & fiscalization, PDF generation, accompanying-invoice fiscalization, SelfCare integration, audit logs, digital signing. [high]
- 4 plans, Basic 399 ALL/mo → Full 1,399 ALL/mo (API included), unlimited invoices/users. Certified all four modules (registry: BNT Electronics J61817047D). [med-high]

### devPOS (Image & Communications Development shpk / dev.al)
- No public docs, but CEO-stated third-party integration capability with "some of the largest businesses in Albania"; certified all four modules; cloud, iOS/Android apps. Turnover-tiered pricing 4,415–17,490 ALL (2021-era). [med-high capability / low docs]

## DIY path (rejected for launch)

- Process: e-Albania application → AKSHI + DPT verify documentation **and test the software** → registration certificate → public registry; **re-certification required for every new version** (https://www.tatime.gov.al/d/8/45/0/1401/fillojne-aplikimet-per-certifikimin-e-prodhuesve-apo-mirembajtesve-te-zgjidhjes-software). [high]
- **Blocking cost: bank/insurance guarantee of 10,000,000 ALL (~€100,000) in favor of DPT** for the whole registration period. [med-high — re-verify current amount in the VKM text before any DIY decision]
- Technical scope: CIS XML protocol digitally signed with AKSHI certificate, NIVF request/response, NSLF generation, QR codes, offline queue (48h), UBL 2.1 e-invoice, TCR registration, SelfCare (specs: https://www.tatime.gov.al/c/424/614/622/fiskalizimi-specifikime-teknike). Open-source references exist (Flexie SDKs; an Odoo 16 module; note github.com/fiskalizimi is **Kosovo's** system — different). Realistic DIY: ~2–4 months build + agency testing + €100k locked — not rational at launch volume. [inference]
- Per-clinic costs regardless of path: AKSHI e-certificate 4,000 ALL/yr per taxpayer (5-minute e-Albania application); typical business-side fiscalization running costs ~€120–1,300/yr by size (Monitor).

## Product implications (feeds architecture spec §2.7)

1. Build the **fiscalization adapter interface** against easyPos's and fature.al's API shapes (they're similar: register invoice → receive NSLF/NIVF → render QR/verification link on the invoice).
2. Onboarding flow must include **per-clinic AKSHI certificate acquisition** (guide the clinic through the 5-minute e-Albania application; store the .pfx or its provider-side reference securely).
3. Handle **offline/queue semantics** (48-hour legal sync window) in the adapter contract.
4. Regional note: Kosovo/Montenegro/N. Macedonia each have separate fiscalization regimes — the adapter abstraction must be per-country from day one; DDD Invoices (when Albania goes live) could collapse several countries into one integration for expansion.

## Open items

- Verify fature.al's certified legal entity; get white-label/API contract terms from easyPos and fature.al.
- Re-verify the 10M ALL guarantee in the current VKM text (only matters if DIY is ever revisited).
- Ask DDD Invoices for their Albania go-live timeline; identify DenteX's fiscalization provider.
