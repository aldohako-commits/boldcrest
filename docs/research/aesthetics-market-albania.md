# Albania Medical Aesthetics Market — Deep Dive

**Date:** July 2026. Supplements `market-research-report.md` with the aesthetics-vertical detail needed for the parallel dental+aesthetics build. Every fact carries a source URL and a confidence flag: [high] = corroborated/primary, [med] = single reputable secondary source, [low] = directory/marketing.

---

## Executive summary

- The visible market (directories: ~8–12 "medical aesthetics clinics") massively understates reality: the Oct 2024 raids alone covered **30 Tirana aesthetic clinics**, and investigations found injectables performed in hair salons too — Tirana has ~2,000 salons. The addressable base is a large, semi-formal, under-digitized SMB tier plus a top tier of real clinics (KEIT, Estetik International, etc.).
- **Regulatory wedge, confirmed:** botox remains unregistered (contraband by definition); only **4 specialist profiles may legally inject** (plastic surgery, dermatology, maxillofacial, ENT); the State Health Inspectorate is now actively inspecting and fining (2025–2026 accreditation push, Sigurt.gov.al complaints portal). A compliance-aware SaaS (credential tracking, audit trails, provenance) rides this formalization wave.
- **Demand is two-engine:** Italian-driven aesthetics/surgery tourism (part of the €200–250M sector; one dermatologist alone sees 750–1,000 foreign patients/year) + growing domestic social-media-driven demand (Tirana women spend ~€28–30M/year on beauty; lips and nose most requested; Instagram/TikTok are the funnel).
- **Software status quo:** paper, phone, and Instagram/WhatsApp DMs. Local leader **BeautyBooking.al** wins on WhatsApp/Instagram auto-messaging + fiscalization integration — exactly the two features our research said are table stakes.

---

## 1. Market size & structure

- WhatClinic lists 8 "Medical Aesthetics" clinics in Albania and 12 dermal-filler clinics in Tirana [med] (https://www.whatclinic.com/beauty-clinics/albania); Intently lists 11 botox clinics in Tirana [low]. Directory counts drastically understate the market.
- Oct 2024 police operation raided **30 aesthetic clinics/centers in Tirana**; raids also hit neighborhood hair salons offering injectables [high] (https://top-channel.tv/2024/10/17/botoks-kontrabande-ne-tirane-zbulohen-emrat-e-klinikave-ne-paligjshmeri-cilet-jane-administratoret-ne-kerkim-mes-tyre-edhe-skerdi-faria-e/).
- Adjacent salon base: **~2,000 hairdressing salons in Tirana**; average salon turnover ~5,000 lek/day, well-known salons 20,000–30,000 lek/day [med] (https://monitor.al/miliardat-e-bukurise/).
- Clinic revenue benchmarks (dated, 2017): 4 major aesthetic clinics combined >200M lek (~€1.6M); KEIT alone 164M lek (+40% over 2 years) [med] (https://monitor.al/miliardat-e-bukurise/). KEIT reportedly performs >8,000 procedures/month now [low] (https://dosja.al/zmadhojne-gjoksin-dhe-zvogelojne-hunden-biznesi-i-milionave-dhe-instagrami-qe-fiksoi-shqiptaret-sa-perdoret-botoxi/).
- Notable players: **KEIT** (Italian-branded, largest; its Dr. Skerdi Faria declared wanted in the botox case), **Estetik International** (Turkish chain, first Tirana clinic Mar 2025 — clearest chain-entry signal [high], https://www.estetikinternational.com/news-detail/estetik-international-clinic-in-albania), Amra Medical Aesthetics, Medical Hill(s), Onyx Dermo Care, Allure Beauty (all named in the investigation), plus Glam House, Deas, Better Me, Arsi Medical, La Beauty, Begas, Bellisera, Luar Clinic [high] (top-channel.tv dossier), and mixed dental+aesthetic tourism clinics (Lavender, DaVINCI, Cronos, Este Medical, Family Beauty, Silur, Dermolife, Skin'Or, La Lune, Diva, Joy's Touch) [med].
- No official INSTAT count of aesthetic clinics surfaced; NACE-code registry query remains an open item (https://www.instat.gov.al/al/temat/industria-tregtia-dhe-sherbimet/regjistrat-e-biznesit/).

## 2. Legal & regulatory detail

### Botulinum toxin
- **Never registered in Albania; no registration application ever filed with AKBPM** — all botox in the country is legally contraband; supply routes: Turkey, Korea, Italy [high] (https://monitor.al/en/rrudhat-e-nje-tregu-qe-nuk-po-i-fshin-dot-botoksi-2/, https://www.voxnews.al/english/aktualitet/si-u-zbulua-botoksi-qe-vinte-kontrabande-nga-turqia-dhe-korea-perla-e-i76827).
- **No status change through 2025–2026**; registration is uneconomical for the small market, so no company applies [med]. Aesthetic use has been widespread for ~10 years despite illegality [med] (https://kallxo.com/gjate/bukuria-qe-injektohet-ne-hije/).

### Fillers & devices
- Dermal fillers and lasers are **medical devices requiring AKBPM registry entry before import**; CE-mark-based, EU-aligned. Registry has ~25,436 device records but ~50% with poor metadata [med] (https://meddeviceguide.com/blog/albania-akbpm-medical-device-registry-teardown). Fillers are legal if CE-marked/registered — unlike botox. Investigations found permanent fillers/silicone injected in salons without disclosure [med] (https://americaneye.al/skandali-ne-parukerite-e-tiranes-si-mashtrohen-pacientet-kliente/).

### Who may legally inject — the critical rule
- Ministry of Health licensing permits aesthetic injectables (botox, fillers, hair transplants) **only for 4 specialist profiles: plastic surgery, dermatology, maxillofacial surgery, ENT** [high] (https://shqiptarja.com/lajm/licencimi-inspektoratit-shteteror-shendetesor-kontrolle-me-te-forta-per-spitalet-private-ne-fokus-kirurgjia-plastike-nga-prilli-denoncime-dhe-online).
- Nurses, non-specialized dentists, cosmetologists, and beauticians injecting are in violation; enforcement was historically near-absent (documented salon injectors with no diploma; a visiting unnamed Italian doctor) [high].
- The sector has **no dedicated law** — a draft law has repeatedly failed to reach Parliament [high] (https://demokracia.com/as-licenca-as-kontrolle-shteti-nuk-ka-asnje-mbikeqyrje-per-biznesin-e-majme-te-botoksit/).

### Oct 2024 raids — aftermath
- Investigation from May 2024 (undercover agent "339"); raids 16–17 Oct 2024 on 30 clinics. Main supplier **Mildon Kumaraku (Capo-Al)** arrested; 3 administrators arrested, 5 investigated, 3 declared wanted (incl. Dr. Skerdi Faria/KEIT) [high] (https://www.panorama.com.al/kontrabandonin-botox-te-paligjshem-policia-kontrolle-ne-30-klinika-estetike-arrestohen-3-administratore-dhe-procedohen-5-te-tjere/).
- **Charges subsequently softened** — arrested administrators released to reporting obligations; no convictions reported yet [med] (https://euronews.al/botoksi-kontrabande-ne-qendrat-estetike-lirohen-3-administratoret/).

### 2025–2026 enforcement climate (the tailwind)
- State Health Inspectorate (ISH) announced **stronger inspections with plastic surgery/aesthetics as special focus**; physician-licensing scrutiny (trigger case: Italian surgeon Marco Procopio, suspended in Italy, operating in Albania) [high] (shqiptarja.com, above).
- New complaints portal **Sigurt.gov.al**; 2025–2026 inspection priority = basic-standards compliance of private health institutions as phase one of accreditation [med].
- **Fines are real now:** Klinika "Hermosa" — two doctors fined €3,000 each (decisions 05-1240/05-1241, 23 Jul 2025) for unlicensed dermatology services [high] (https://veriu.info/u-zbuluan-duke-ofruar-sherbime-dermatologjike-pa-license-inspektorati-gjobiti-rende-doktoret-e-klinikes-hermosa-dokument/).

## 3. Aesthetic & cosmetic-surgery tourism

- Part of the €200–250M/year medical-tourism sector; ≥50,000 Italians/year (AFP "Lips, teeth and breasts") [high]. Popular: breast augmentation, rhinoplasty, facelifts, liposuction, hyaluronic lip injections.
- Single-clinic volume proof: dermatologist **Monika Fida sees 750–1,000 foreign patients/year** [high] (AFP).
- Prices ~50–70% below Western Europe: rhinoplasty €1,899–2,500 all-inclusive; breast augmentation + lift €3,600 incl. 10 nights [med] (https://familybeautyal.com/plastic-surgery-in-albania-prices/, https://silurclinic.com/rhinoplasty-in-tirana/).
- Facilitators: Bookimed, WhatClinic, albmedtour.it (Italy-focused), Family Beauty, Health Tourism Albania, Cosmedic Express — strong Italian-language funnel [med].
- Dental tourism dwarfs aesthetics in patient count (80k+ vs low tens of thousands), but the two are jointly the engine of Albanian health tourism; many clinics are mixed dental+aesthetic — **the mixed-clinic case from the architecture spec is real and common**.

## 4. Domestic demand

- Tirana women spend ~3 billion lek/year (~€28–30M) on personal beauty care; core demographic ~70,000 women aged 25–40; average ~5,000 lek/month [med] (https://monitor.al/miliardat-e-bukurise/). Albanians spend 5–15% of household budget on personal care [med].
- Trend toward non-invasive/"natural" procedures; nose and lips most requested; taboos breaking among younger customers; Instagram (millennials) and TikTok (Gen Z) drive demand; raid-named clinics were promoted by celebrities [med].
- Domestic price points (Tirana): lip filler ~€200, fillers €150–250/syringe, botox ~€250/treatment, 10-session slimming packages ~26,000 lek [med]. Lip-filler refresh cadence 3–9 months — the recall-protocol upsell.

## 5. Software usage (competitive whitespace)

- **BeautyBooking.al** — local leader: reservations, client CRM, fees, automatic reminders, **auto-messages on WhatsApp & Instagram, integrated online payments, and Albanian fiscal-system connection**; building an AI auto-booking assistant; expanding to Kosovo; Google Play + Trustpilot presence [high] (https://beautybooking.al/your-space, https://businessmag.al/nje-aplikacion-qe-kursen-kohe-dhe-rrit-te-ardhurat-ne-fushen-e-bukurise-po-quhet-beautybooking/).
- **Bukora.al** — consumer booking marketplace (beauty/wellness/fitness) [med]. **Voop.al** — booking + business management for salons/aesthetic centers, "affordable, adapted for the Albanian market" [med].
- **Fresha** has an Albania marketplace presence (20% new-client commission model) [med]; Setmore globally available, no confirmed Albanian footprint [low].
- Status quo: **paper, phone, Instagram/WhatsApp DMs** — BeautyBooking's whole pitch is displacing them [high].

## 6. Strategic implications for the aesthetics module

1. **WhatsApp/Instagram messaging is not optional** — it's the actual booking channel; BeautyBooking already automates it. Our communications core must include it at parity or better.
2. **Fiscalization is table stakes even at the salon tier** — BeautyBooking leads with it. Confirms the platform decision to put fiscalization in the core.
3. **Compliance is the differentiator vs BeautyBooking:** practitioner-credential tracking mapped to the 4 permitted specialties, license/inspection readiness, consent + photo-consent trails, device/product provenance registers (CE/AKBPM), audit logs. BeautyBooking is a booking tool; none of this exists locally. The ISH enforcement wave (fines, accreditation, Sigurt.gov.al) creates urgency we can sell into.
4. **Do not build injectable-inventory features that facilitate contraband:** inventory/provenance UX should be framed around *legal* products (CE-marked fillers, registered devices) and documentation that protects the clinic in an inspection. Injectable-revenue assumptions for Albania stay conservative until botox registration changes.
5. **Aesthetics-tourism sub-segment is real** (Italian funnel, all-inclusive surgery packages, 750–1,000 foreign patients at a single dermatology clinic) — the tourism module applies to aesthetics nearly unchanged (journey timeline, quotes, travel windows, aftercare), validating the vertical-agnostic tourism design.
6. **Mixed dental+aesthetic clinics are common in Tirana** — the one-account-two-modules capability is a genuine local differentiator.

## Open items

- INSTAT NACE-code query for an official aesthetic-business count.
- Track botox registration status at AKBPM (a registration decision would transform the injectables segment overnight).
- Monitor the draft aesthetics law — if it reaches Parliament, licensing requirements (and our compliance feature set) become law-driven rather than inspection-driven.
- BeautyBooking.al pricing (not public) — mystery-shop.
