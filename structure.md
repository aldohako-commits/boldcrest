# BoldCrest — Creative Structure

> Living reference doc for the site's creative direction.
> Updated as pages are redesigned. Inspired by Reform Collective + Wolff Olins.

---

## Design References
- **Reform Collective** — dark aesthetic, mixed typography (editorial serif + grotesque sans), snappy cubic-bezier transitions, multi-step contact forms, strong manifesto copy
- **Wolff Olins** — confident belief-led copy, transformative language, colored team tiles, staggered asymmetric grids, video-first case studies

## Voice & Tone
- Short sentences. Punchy. Opinionated.
- Lead with a point of view, not a feature list.
- Every heading should make someone feel something — curiosity, confidence, or tension.
- Body copy: conversational, direct, no corporate filler.
- Red accent period `.` on all major headings.

---

## Pages

### HOME `/`
**Status:** Pending redesign

| Section | Current | Proposed |
|---------|---------|----------|
| Hero | "Build identities and shape perceptions. Go bold or go unseen." | "Every brand has a nerve. We find it." |
| Showreel | (none) | NEW — full-bleed video loop + "This is what conviction looks like." |
| Selected Works | Label: "Selected Works" | Label: "Proof." |
| Philosophy | "We do many things very well." | Split: "Strategy without soul is a spreadsheet." / "We bring the conviction..." |
| Clients | Static 4-col grid, label: "Selected Clients" | Marquee (2 rows, opposite scroll), label: "Trusted by the ambitious." |
| Service Cards | Label: "What We Do" | Label: "Three disciplines. One obsession." |

**Animation ideas:**
- Hero: word-by-word reveal on scroll, "nerve" snaps in with red glow pulse
- Showreel: video expands from 80% width to full-bleed on scroll
- Selected Works: cards enter from alternating directions, parallax crop shift on hover
- Clients: marquee speed tied to scroll velocity

---

### WORK `/work`
**Status:** Pending redesign

| Section | Current | Proposed |
|---------|---------|----------|
| Hero | "Our creations, skillfully forged through the years." | "The work doesn't whisper." |
| Count | (none) | NEW — "24 projects and counting" with counter animation |
| Grid | Stacked full-width cards | Keep, add alternating entry directions |

**Animation ideas:**
- Heading: typewriter effect (60ms/char), period slams in with micro screen-shake
- Project count: number animates from 0

---

### SERVICES `/services`
**Status:** IMPLEMENTED

| Section | Current | Proposed |
|---------|---------|----------|
| Hero | "Meeting Challenges Head-On." + "Crafting exceptional solutions" | "What gets us out of bed." (no subtitle) |
| Accordion | Generic descriptions | Narrative descriptions with personality |

**Copy:**
- Brand Dev: "The foundation. Before the ad, before the post, before the pitch deck — there's the identity. We build the ones that don't need to explain themselves."
- Still & Motion: "The evidence. Still frames that hold attention. Moving images that move people. Every shoot, every cut, every grade — deliberate."
- Communications: "The amplifier. A great brand in silence is a waste. We put yours where it belongs — in front of the right people, saying the right thing, at the right time."

**Animation details:**
- Hero: fade-up + underline draws left→right (0.6s delay, 1s duration)
- Category numbers: 01, 02, 03 labels
- Service pills: staggered cascade (40ms stagger, slight random rotation settling to 0)

---

### PEOPLE `/people`
**Status:** Pending redesign

| Section | Current | Proposed |
|---------|---------|----------|
| Hero | "It's Not About Us, It's About You." | "Small team. Unreasonable standards." |
| Values | "Driven by craft, guided by purpose." | "We'd rather lose the pitch than fake the passion." |
| Process | Discover, Strategize, Create, Deliver | Listen, Frame, Make, Ship (with new copy) |
| Team Grid | Standard grid | Card-dealing animation (stacked → spread with spring physics) |

**Process copy:**
- 01 Listen: "Before we design anything, we shut up. Your brand lives in your head. Our job is to extract it, not impose ours."
- 02 Frame: "Raw insights become a sharp brief. One page. No fluff. This is the compass everything else follows."
- 03 Make: "Concepts, drafts, prototypes — fast and fearless. We'd rather show you ten rough ideas than one safe one."
- 04 Ship: "Polished, tested, delivered. But we don't disappear — we stay close through launch and beyond."

---

### CONTACT `/contact`
**Status:** Pending redesign

| Section | Current | Proposed |
|---------|---------|----------|
| Hero | "Let's Talk." | "Got a nerve to hit? Let's go." |
| Form | Standard fields | Fields with typewriter label animation (40ms/char) |

---

## Global Animation Ideas (Not Yet Implemented)

| Feature | Description | Status |
|---------|-------------|--------|
| Page Transitions | Red accent bar wipes across screen (scaleX 0→1→0). Component exists at `src/components/PageTransition.tsx` | Pending |
| Loading Screen | Counter 00→100, "bold" grows/"unseen" fades. Component exists at `src/components/LoadingScreen.tsx` | Pending |
| Cursor Trail | Small red dot (6px) with 3-4 fading ghost dots. Desktop only. | Pending |
| Scroll-Velocity Type | Letter-spacing compresses on fast scroll, expands on slow | Pending |
| Gravity Tags | Matter.js floating discipline words on Services page bg. Component exists at `src/components/GravityOverlay.tsx` | Pending |

---

## Metadata Reference

| Page | Title | Description |
|------|-------|-------------|
| Home | BoldCrest — Creative Agency | We build identities and shape perceptions. Go bold or go unseen. |
| Work | Work | The work doesn't whisper. Portfolio by BoldCrest. |
| Services | Services | What gets us out of bed. Brand development, still & motion, and communications — three disciplines, one obsession. |
| People | People | Small team. Unreasonable standards. Meet BoldCrest. |
| Contact | Contact | Got a nerve to hit? Let's go. Get in touch with BoldCrest. |
