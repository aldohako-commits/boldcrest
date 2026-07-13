# Regulatory Compliance Memo — Clinic SaaS (Dental + Aesthetics), Albania

**Date:** July 2026. Unlike the other research documents, most of this memo is verified against **primary sources read in full**: Law 124/2024 (Commissioner's official English translation), Commissioner Guideline No. 2/2025 on health data, Commissioner Decision No. 01/2025 on adequate countries, VKM 239/2020 (fiscalization software requirements), VKM 538/2009 (health licensing). Flags: **[primary]** = read from official text; **[secondary]** = reputable source, not confirmed against primary; **[uncertain]** = needs lawyer/authority confirmation.

---

## Headlines that change product decisions

1. **A startup cannot self-certify for fiscalization.** VKM 239/2020 requires a certified producer to have **≥10 employees (employed ≥6 months), ≥1 year of company history, average turnover ≥30,000,000 ALL over 3 years, an Albanian-registered entity, and a 10,000,000 ALL (~€97k) bank guarantee to DPT** — plus re-certification on every software version. **[primary]** → The partner-API route (see `fiscalization-partner-comparison.md`) is not just cheaper, it is the only available route at launch.
2. **WhatsApp is explicitly prohibited for health-data exchange.** Guideline 2/2025 Art. 4: "personal addresses or applications (such as WhatsApp) must not be used" for exchanging health data. **[primary]** → Our secure in-product patient messaging is not a nice-to-have; it is the compliant alternative every clinic legally needs. WhatsApp can remain a booking/notification channel for non-health content only. (Also note: DenteX and BeautyBooking both lead with WhatsApp inboxes — their flows arguably cross this line; ours must be designed not to.)
3. **Italy and the UK are adequacy-listed** (Commissioner Decision 01/2025, Annex 1 — all EU/EEA states, UK, and EU-adequacy holders). **[primary]** → Cross-border aftercare record sharing with Italian/UK dentists needs no SCCs; only prior patient information + secure transmission + logging.
4. **DPIA becomes mandatory ~17 January 2027** (Art. 31/32 deferred two years from publication). **[primary]** → "DPIA-ready before your competitors" is a real, dated selling point.
5. **The SaaS itself must appoint a DPO** (Art. 33(1)(c): core activity = large-scale processing of sensitive data applies to controller AND processor). **[primary; "large-scale" threshold uncertain]**

---

## 1. Fiscalization (Law 87/2019 + VKM 239/2020) **[primary unless noted]**

### What certified software must do (VKM 239 §2.1)
Cloud/SaaS applications are explicitly allowed. Required capabilities: invoice creation with all mandatory elements; secure transmission to the CIS using the taxpayer's electronic certificate; e-invoice issue/receive; per-invoice confirmation; storage; **NSLF/KSLF security-code generation** (+ KSLFSH for accompanying invoices); **QR code generation**; cash-deposit (opening balance) registration; and the software must **disable any process that circumvents fiscalization**.

### Technical mechanics
- **XML request messages (e.g. RegisterInvoiceRequest) signed with XMLDSig using the taxpayer certificate, sent as SOAP over one-way TLS**; SOAP 1.1 fault + numeric error codes. **[primary — VKM 239 Annex 1]**
- Software computes the IIC/NSLF (cryptographic code over key invoice fields with the certificate's private key); CIS returns the NIVF. Both must appear on the invoice and in the QR, verifiable on the central platform. **[primary for obligation; secondary for hash mechanics]**
- **Test environment WSDLs are public**: `https://efiskalizimi-test.tatime.gov.al/FiscalizationService-v3/FiscalizationService.wsdl` (+ FiscalizationDataService-v1). Production self-care: `https://efiskalizimi-app.tatime.gov.al/`. Free developer **test certificate** via e-Albania (service 13691, AKSHI, 1-year validity). **[primary URLs]**
- **Offline mode** (Annex 1 scenarios 4/8/10): print offline invoice with UII code (no NSLF), queue in an "unfiscalized invoices" table, re-fiscalize all pending on reconnection; export/import via self-service portal as fallback; 48-hour transmission deadline **[secondary]**. **Invoices can never be deleted — only corrected via corrective-invoice messages.**
- E-invoice format: UBL 2.1 or UN/CEFACT CII per EN 16931 / Directive 2014/55/EU. **[secondary, concordant]**

### Producer certification (why we integrate instead)
Registration in AKSHI's producer/maintainer register **before** selling: ≥10 staff incl. certified server/network/app developers + 2 support staff; ≥1 year active with similar prior work; ≥30M ALL average 3-year turnover with audited statements; clean records; **10M ALL guarantee to DPT**; all documents in Albanian, notarized; **foreign producers must register an Albanian entity**; JV route (§3.7) requires notarized union-of-operators contract with ALL members meeting criteria. Application via e-Albania; joint AKSHI+DPT commission tests against Annex 1 scenarios; certificate contains producer + software codes embedded in every fiscalization message; **re-certification per version** (15/45-day submission windows for changes). Certified list: https://www.tatime.gov.al/c/424/494/lista-e-subjekteve-te-certifikuara.

### Per-clinic obligations (regardless of path)
Each clinic taxpayer needs its own **AKSHI fiscalization e-certificate (4,000 ALL/yr, 3–5 working days via e-Albania)** and TCR (cash register) registration in the CIS. Build this into onboarding.

---

## 2. Data protection — Law 124/2024 **[primary]**

In force 31 Jan 2025; GDPR-aligned; repeals Law 9887/2008.

| Topic | Article | What it requires of us |
|---|---|---|
| Processor contract | Art. 26 | GDPR-Art-28-style DPA with each clinic: documented instructions, confidentiality, security per Art. 28, sub-processor authorization + objection right, assist with rights/breaches, delete/return at end, allow audits. Ship a standard Albanian-law DPA; keep a sub-processor register (hosting, SMS, email). Commissioner may publish standard clauses (26(7)). |
| Records of processing | Art. 27 | Processor record required: our + DPO contacts, each controller, processing categories, transfers + legal basis, security description. **Small-company exemption does NOT apply to sensitive data (27(4))** — applies to us and to every clinic. |
| Security | Arts. 28, 30 | Pseudonymization/encryption, CIA + resilience, restore, regular testing; confidentiality clauses surviving contract end in DPAs and employment contracts. |
| Breach | Art. 29 | **Processor → controller immediately**; controller → Commissioner ≤72h; controller → subjects on high risk (29(3) — deferred to ~Jan 2027). Build the incident runbook + in-product breach-notification support for clinics. |
| DPO | Arts. 33–34 | Mandatory for processor whose core activity is large-scale sensitive-data processing → appoint one; publish contacts; notify Commissioner. |
| Transfers | Arts. 39–42 + Decision 01/2025 | **EEA hosting = adequacy transfer, nothing further needed. Italy & UK adequacy-listed.** Absent adequacy: Commissioner-approved BCRs/standard clauses, or explicit informed consent (41(3)(a)). Record every transfer basis in the Art. 27 register. |
| Deferred provisions | Art. 101(2) | Art. 29(3), 31 (DPIA), 32 (prior consultation), 35–36, 64–65, 67(2,3,5) in force **~17 Jan 2027**. Prepare DPIA templates now; DPIA will be mandatory for large-scale sensitive processing (31(6)(b)) — exactly this product. |
| Health-data basis | Art. 9 | Routine treatment records ride on **9(2)(ë)** (provision/management of health care under contract with a health professional, by persons under professional secrecy) — NOT consent. Consent is the add-on basis for marketing, photos beyond the record, and any sharing beyond care. |
| Fines | Arts. 93–94 | Up to 1bn ALL / 2% global turnover (processor duties); up to **2bn ALL / 4%** (principles, rights, unlawful transfers). Sanction methodology: Guideline 6/2025. |

### Guideline No. 2 of 30.04.2025 on health data (applies directly to processors) **[primary]**
Concrete build list it imposes:
- Processing only by professionals under **professional secrecy**; access controls at facility/system/use/communication/data-entry levels; **audit trail of who accessed/entered what and when**; transmission control; backups; internal regulations for anyone handling medical documentation.
- **Prior information to the patient before professional-to-professional sharing** (unless urgent); consent-based sharing must be withdrawable; rules explicitly cover electronic medical files.
- **No personal apps (e.g., WhatsApp) for health-data exchange** → secure in-product messaging is the compliant channel.
- Mobile access requires **identity verification + encryption in transit**.
- Retention per sector legislation; after expiry **destroy or anonymize** → retention/anonymization engine.
- Insurers access only per law/consent; employees are not authorized recipients by default.

---

## 3. Licensing **[primary for categories; secondary/uncertain where noted]**

- **Facility licenses (VKM 538/2009, Group II via QKB/e-Albania, no expiry):**
  - **II.6.A.3 "Shërbime stomatologjike"** — dental clinics/cabinets → the dental license.
  - **II.6.A.5 "Other health and curative services"** — includes *"qendra estetike ku ofrohet shërbim mjekësor"* (aesthetic centers providing medical services) → the aesthetic-clinic license.
  - Criteria: certified **technical director** (per specialty) with proof of employment; adequacy of premises/equipment. A combined dental+aesthetic clinic may need both codes. → Onboarding should capture license number/category + technical-director credentials.
- **Dentists:** USSH (Order of Dentists) issues individual practice licenses AND technical-director licenses; public register at https://ussh.org.al/regjistri-i-stomatologeve/ → validate practitioner license numbers against it. Governing law cited as 127/2014 **[secondary]**.
- **Aesthetic practitioners:** no dedicated regulator; physicians under the Order of Physicians (Law 123/2014). Ministry licensing permits injectables only for plastic surgery / dermatology / maxillofacial / ENT specialists (see `aesthetics-market-albania.md`). Botulinum toxin has no AKBPM marketing authorization → treatment-catalog templates must not assume legal botox supply. **[secondary/uncertain — verify with AKBPM]**
- **Telemedicine:** no dedicated statute found; national telemedicine program exists (hospital-to-hospital). Private cross-border video pre-consults are neither expressly authorized nor prohibited → treat as documented triage/information sessions with consent; fully subject to Law 124/2024 + Guideline 2 (encryption, identity verification). **[uncertain — health-law counsel]**

---

## 4. Cross-border records & e-signatures

- **Aftercare sharing with Italian/UK dentists:** adequacy transfer (Decision 01/2025) + Art. 9(2)(ë) basis + Guideline 2 Art. 4 duties (prior patient information, secure channel, professional-secrecy recipient). → Product "share abroad" flow: record recipient + country, capture prior information/consent, log legal basis in the Art. 27 register, transmit encrypted. **[primary]**
- **E-signatures:** Law 9880/2008 (e-signature) + Law 10273/2010 (e-document) + Law 107/2015 (trust services, partial eIDAS alignment). **Qualified e-signature (QES)** from an AKCESK/NAECCS-registered or EU-qualified provider = equivalent to handwritten. Simple/advanced signatures admissible but evidentially weaker. Consent under Law 124/2024 needs demonstrability, not QES → click-to-sign with robust audit trail for routine consents; support QES for high-risk procedures. Note: e-signature regulator is **AKCESK** (aksk.gov.al), distinct from AKSHI. A draft eIDAS2-alignment law (incl. digital wallet) is in public consultation — watch it. **[primary for 9880 text; secondary for synthesis]** **Open item:** whether any medical consent requires wet ink. **[uncertain]**

---

## 5. Consolidated open items (lawyer / authority contact)

1. **DPT/AKSHI:** consolidated current VKM 239 text + fees; viability of the §3.7 JV route or maintainer-only registration; pull the full technical spec bundle from tatime.gov.al (bot-blocked); confirm the 48h offline deadline in the current DPT regulation.
2. **IDP Commissioner:** does this SaaS meet the Art. 33(1)(c) "large-scale" DPO threshold; timing of DPIA lists (Art. 31(7)); availability of standard DPA clauses (Art. 26(7)).
3. **Ministry of Health/QKB:** II.6.A.3 vs A.5 for combined clinics; post-2009 amendments to VKM 538.
4. **AKBPM:** current registration status of botulinum toxin and injectable portfolio.
5. **Health-law counsel:** telemedicine for private cross-border pre-consults; dental-record retention periods under sector law; wet-ink consent requirements.

## Primary sources

[Law 124/2024 EN (idp.al)](https://idp.al/wp-content/uploads/2025/04/Law-no.124-2024-DP.pdf) · [Guideline 2/2025 health data](https://idp.al/wp-content/uploads/2025/09/Guideline-No.02-30.04.2025-Health-Data-Protection.pdf) · [Decision 01/2025 adequate countries](https://idp.al/wp-content/uploads/2025/09/Decision-No.01-30.04.2025-Adequate-Data-Protection-Countries.pdf) · [Guideline 6/2025 sanctions](https://idp.al/wp-content/uploads/2025/09/Guideline-No.06-16.07.2025-Administrative-Sanctions.pdf) · [VKM 239/2020](https://alprofitconsult.al/wp-content/uploads/2020/09/VKM-MBI-K%C3%8BRKESAT-TEKNIKE-DHE-FUNKSIONALE-T%C3%8B-ZGJIDHJES-SOFTUERIKE-P%C3%8BR-PROCEDUR%C3%8BN-E-FATURIMIT-DHE-FISKALIZIMIT.pdf) · [VKM 538/2009 (Faolex)](https://faolex.fao.org/docs/pdf/alb144472.pdf) · [tatime.gov.al tech specs](https://www.tatime.gov.al/c/424/614/622/fiskalizimi-specifikime-teknike) · [certified producers list](https://www.tatime.gov.al/c/424/494/lista-e-subjekteve-te-certifikuara) · [test WSDL](https://efiskalizimi-test.tatime.gov.al/FiscalizationService-v3/FiscalizationService.wsdl) · [USSH register](https://ussh.org.al/regjistri-i-stomatologeve/) · [Law 9880/2008 e-signature](https://aksk.gov.al/wp-content/uploads/2023/06/ligji9880.pdf) · [Law 123/2014 Order of Physicians](https://www.qsut.gov.al/wp-content/uploads/2025/12/ligj-2014-09-25-123-Per-Urdhrin-e-Mjekesve-ne-RSH.pdf)
