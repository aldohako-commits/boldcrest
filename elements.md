# BoldCrest — Codebase Map (`elements.md`)

Single source of truth for **where everything lives**. Read this first instead of
re-grepping the repo. Update it whenever files move, are added, or a section is
restructured. Paths are relative to the repo root
`/Users/aldohako/Desktop/BoldCrest/_Claude/projects/boldcrest-web`.

Stack: Next.js 16 (App Router, `proxy.ts` not middleware) · Sanity CMS
(`de0anuhy` / dataset `boldcrest`) · Tailwind v4 (CSS-first) · Framer Motion ·
Lenis. Deploy: Vercel (BoldProjects account, project `boldcrest`,
`boldcrest-puce.vercel.app`; canonical `www.boldcrest.com` behind a COMING_SOON gate).

---

## "Where do I change X?" cheatsheet

| Task | File(s) |
|---|---|
| **Home client-logo marquee** (Trusted by) | `src/components/home/SelectedClients.tsx` |
| **Services client-logo carousel** | `ClientLogos` fn inside `src/app/services/ServicesPageClient.tsx` |
| Marquee keyframes (`marquee`, `marquee-reverse`, 0→-50%) | `src/app/globals.css` (~line 181) |
| Home zone color/scroll vars (`--zone-*`, logo filter) | `src/components/home/ColorTransitionZone.tsx` |
| **Single-service hero + breadcrumb** (`Services / Name`) | `src/components/services/ServiceHero.tsx` |
| **Service "Outcomes + Services accordion"** (the +/− list) | `src/components/services/OutcomesServices.tsx` |
| Work-detail breadcrumb (`Work / Name`) + draggable scrub rail | `src/components/portfolio/ProjectHero.tsx`, `ContentStack.tsx` |
| **Work page filter nav** (Services/Industry, drag-to-scroll) | `InlineFilter` fn in `src/app/work/WorkPageClient.tsx` |
| Contact page (form, g.page links, SEND pill) | `src/app/contact/ContactPageClient.tsx` |
| Cookie consent banner | `src/components/CookieBanner.tsx` (mounted in `layout.tsx`) |
| Privacy Notice / Cookie Policy pages | `src/app/privacy-notice/page.tsx`, `src/app/cookie-policy/page.tsx`, shared `src/components/legal/LegalLayout.tsx` |
| Start-a-Project side panel + Megi chat | `src/components/start-project/StartProjectProvider.tsx`, `StartProjectChat.tsx` |
| Header / nav / mobile menu | `src/components/Header.tsx`, `MobileMenu.tsx` |
| Footer (socials, legal links) | `src/components/Footer.tsx` |
| CTA "Start a Project" pill button | `CTAButton` in `src/components/MagneticButton.tsx` |
| Redirects (subdomains, alt domains, coming-soon gate) | `src/proxy.ts` |
| SEO helpers (schema, OG, canonical) | `src/lib/seo.ts`, `src/components/JsonLd.tsx`, `src/components/services/JsonLd.tsx` |
| sitemap / robots | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Sanity queries (GROQ) | `src/sanity/lib/queries.ts` |
| Sanity schema (doc types) | `src/sanity/schemaTypes/*` |

---

## Routes (`src/app/`)

- `layout.tsx` — root: fonts, global `<Metadata>` (title template `%s — BoldCrest`), JSON-LD (LocalBusiness + WebSite), providers (Lenis, PageTransition, StartProject), `Header`, `Footer`, `CookieBanner`, analytics.
- `page.tsx` — **Home**. Order: `Hero` → `SelectedWorks` → `ColorTransitionZone`{ `WeDoSection`, `SelectedClients`, `ServiceCards`, `HomeDiary` } → `BottomSections`. Fetches `homepagePartnersQuery`, projects, members, diary, settings.
- `robots.ts`, `sitemap.ts` — SEO endpoints (sitemap fetches projects + diary, adds image entries).
- `work/page.tsx` + `WorkPageClient.tsx` — portfolio grid + `InlineFilter` (Services/Industry, drag-scroll).
- `work/[slug]/page.tsx` — project detail (`generateMetadata`, breadcrumb + CreativeWork JSON-LD; renders `ProjectHero`, `ContentStack`, etc.).
- `services/page.tsx` + `ServicesPageClient.tsx` — services index (hero, `ServiceShowcase`, `ProcessSection`, `Stats`, **`ClientLogos`** carousel, FAQ). Fetches `allServicesByCategoryQuery` + `servicesPartnersQuery`.
- `services/{brand-development,communication,still-motion}/page.tsx` + `*Client.tsx` — single service pages. Each `page.tsx` emits Breadcrumb/Service/FAQ JSON-LD; each `*Client.tsx` holds the OUTCOMES/SERVICES/PROCESS/WHY_US arrays and renders shared service components.
- `diary/page.tsx` + `DiaryPageClient.tsx` — blog index ("Diary"). `diary/[slug]/page.tsx` + `DiaryArticle.tsx` — post (Article JSON-LD).
- `people/page.tsx` + `PeoplePageClient.tsx` — UNIFIED single-slide deck on desktop AND mobile (wheel on desktop, touch-swipe on mobile; wrapper translates `-current*100svh/dvh`; body locked until the last slide → footer). Tall slides scroll internally then advance from the top/bottom edge (`touchStartEdges` ref, mobile only); sections use `grid [align-content:safe_center]` on mobile / `md:flex md:items-center` on desktop.
- `contact/page.tsx` + `ContactPageClient.tsx` — contact form.
- `privacy-notice/`, `cookie-policy/`, `careers/`, `coming-soon/`, `start-a-new-project/`, `button-preview/`, `services-sample/` — standalone pages. `studio/[[...tool]]/` — embedded Sanity Studio. `api/seed-diary/route.ts` — one-off seeding (uses write token).
- `forms/[slug]/page.tsx` + `forms.config.ts` — **embedded ClickUp forms** (iframe in site layout, same pattern as `careers/`). `forms.config.ts` maps slug→{url,title,description} for `branding`/`timeoff`/`employee`/`client`; each served on its vanity subdomain via a REWRITE in `proxy.ts` (noindex). `careers` keeps its own `/careers` route.

---

## Components (`src/components/`)

**Top level:** `Header`, `Footer`, `MobileMenu`, `MagneticButton` (exports `CTAButton`, `InlineButton`), `CookieBanner`, `JsonLd` (generic `<script type=ld+json>`), `LenisProvider` (`useLenis`), `PageTransition`, `ScrollReveal`, `LoadingScreen`, `VimeoEmbed`, `GravityOverlay`, `ui/gravity.tsx` (both unused — "Gravity Tags" is a still-pending feature per `structure.md`; pulls in `matter-js`/`lodash`/`svg-path-commander`).

**`home/`:** `Hero` (animated headline), `SelectedWorks`, `WeDoSection`, **`SelectedClients`** (Trusted-by 2-row logo marquee), `ServiceCards`, `ColorTransitionZone` (sets `--zone-*` for its children), `BottomSections`.

**`portfolio/`:** `ProjectHero` (detail hero + `Work /` breadcrumb), `ContentStack` (media stack + sticky draggable scrub rail), `ProjectDetails`, `NextProject`, `RelatedProjects`.

**`services/`:** `ServiceHero` (single-service hero + `Services /` breadcrumb), **`OutcomesServices`** (left Outcomes + right Services accordion), `ProcessTable`, `WhyUsSection`, `FAQSection`, `OtherServices`, `ProjectMarquee` (project-thumbnail marquee, auto + drag scroll), `JsonLd` (Breadcrumb/Service/FAQ schema builders), `ServicesList`, `SocialProof`, `OutcomesSection`.

**`legal/`:** `LegalLayout` (shared shell for privacy-notice + cookie-policy).
**`start-project/`:** `StartProjectProvider` (side panel + open/close context `useStartProject`), `StartProjectChat` (Megi chat flow), `replies.ts` (single-source map of Megi's per-selection contextual replies: `OPENERS` pool + `CLAUSES[step][value]` + `botReply()` — edit chat copy here).

---

## Sanity (`src/sanity/`)

- `env.ts` (projectId/dataset), `lib/client.ts`, `lib/live.ts` (`sanityFetch`, published-only without server token), `lib/image.ts` (`urlFor`), `lib/loader.ts` (`sanityImageLoader` for next/image), `structure.ts`.
- **Schema** `schemaTypes/`: `project`, `service`, `partner`, `teamMember`, `siteSettings`, `diaryPost`, `index.ts` (registers all).
  - `partner`: `name`, `logo` (image), `website`, `showOn` (`['homepage','services']`), `order`.
  - `diaryPost`: `title`, `slug`, `coverImage`, `excerpt`, `category` (Insights/Branding/Design/Motion/Culture/Strategy), `body` (Portable Text + images w/ alt+caption), `publishedAt`, `order`.
- **Queries** `lib/queries.ts`: `featuredProjectsQuery`, `allProjectsQuery`, `projectBySlugQuery`, `nextProjectQuery`, `allServicesByCategoryQuery`, `allPartnersQuery`, `homepagePartnersQuery`, `servicesPartnersQuery`, `projectsByServicesQuery`, `allTeamMembersQuery`, `latestDiaryPostsQuery`, `allDiaryPostsQuery`, `diaryPostBySlugQuery`, `siteSettingsQuery`, `relatedProjectsQuery`, `moreProjectsQuery`.
- **Write/upload (Mutations API):** token at `~/.config/sanity/config.json` (`authToken`). Upload asset → `POST https://de0anuhy.api.sanity.io/v2021-06-07/assets/images/boldcrest?filename=...` (`Content-Type` per type) → use returned `document._id` as `{_type:'image',asset:{_type:'reference',_ref:id}}`. Mutate → `POST .../data/mutate/boldcrest`. Pattern used to bulk-create `partner` docs from `public/Logo Klient/` SVGs.

---

## Infra / config

- `src/proxy.ts` — Next 16 `proxy` export. `SUBDOMAIN_EMBEDS` (careers/branding/timeoff/employee/client.boldcrest.com → REWRITE to on-site `/careers` or `/forms/<slug>`, URL stays on the subdomain, form embedded in site chrome), `SUBDOMAIN_REDIRECTS` (drive/archive.boldcrest.com → Synology, 307), `DOMAIN_REDIRECTS` (boldreactor.com/boldworkshops.com → www.boldcrest.com, 308), `COMING_SOON` gate (rewrites canonical hosts to `/coming-soon`; flip to `false` to launch). Embeds run before the gate so the forms work pre-launch.
- `src/lib/seo.ts` — `SITE_URL`, `DEFAULT_OG`, `absUrl`, `ogImageFrom`, `imageUrlFrom`, `websiteSchema`, `breadcrumbSchema`, `articleSchema`, `creativeWorkSchema`.
- `src/lib/marks.tsx` (`withSmallMarks` ® handling), `src/lib/utils.ts`.
- `src/app/globals.css` — Tailwind v4 theme + `--zone-*` defaults + keyframes (`marquee`, `marquee-reverse`, `wordReveal`). Contains the **global resets** noted in Gotchas.
- Root: `next.config.ts` (image remotePatterns cdn.sanity.io; `redirects()` incl. `/privacy-policy`→`/privacy-notice`), `sanity.config.ts`, `sanity.cli.ts`, `.claude/launch.json` (preview server configs).

---

## Gotchas (hard-won — don't relearn these)

1. **Global `button { border:none; background:none; color:inherit }`** in `globals.css` (~line 128) strips Tailwind border/color utilities from every `<button>`. That's why the site's CTA pills render as `<a>` (`CTAButton`). For a real `<button>` (e.g. Contact SEND), set border/color **inline** (drive hover via React state).
2. **Global `img,video { max-width:100% }`** overrides Tailwind `max-w-[…]` on images. Use inline style if you truly need a hard cap.
3. **SVG logos via `next/image`** must use `unoptimized` + the direct `urlFor(img).url()` (no `dangerouslyAllowSVG` configured). Sanity serves SVGs fine.
4. **Logo assets are uniform 400×200 (2:1)** → height alone sets size and they stay optically balanced.
5. **Home logo order** is `HOME_ORDER` in `SelectedClients.tsx`, **independent of Sanity `order`** (unknown names sort to the end). Services uses Sanity `order` via `servicesPartnersQuery`. Both pages render the same `partner` docs; `showOn` controls which page.
6. **Seamless marquee** = duplicate each row exactly **2×** + keyframe `0 → -50%`; one set must be wider than the viewport. Speed via responsive `--mq` CSS var.
7. **Framer-motion entrance animations freeze** when the tab is backgrounded (rAF-throttled), leaving content stuck invisible. Make important above-the-fold/nav content **static** (this bit the Contact hero and is why service breadcrumbs are static).
8. **Logos serve from Sanity, not `/public`.** `public/Logo Klient/` (source SVGs) is intentionally untracked.
9. Dev server: `npm run dev -- --port 3201` (3000 is often the Diagonal project). Production gate: localhost/preview = full site; canonical host = coming-soon until `COMING_SOON=false`.
10. **Horizontal-scroll suppression must use `overflow-x: clip`, NEVER `hidden`, on `html`/`body`** (`globals.css`). `overflow-x: hidden` turns the element into a scroll container (computed `overflow-y` → `auto`), which silently breaks EVERY `position: sticky` pin on the page — most visibly the homepage **`ServiceCards` "What We Do"** horizontal-scroll section (sticky panel stops holding → heading scrolls off, content scatters with huge gaps on mobile). `clip` suppresses the same overflow without a scroll container, so sticky survives. Both `html` and `body` carry `overflow-x: clip` for Safari.
