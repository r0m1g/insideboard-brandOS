# 2026-04-25 — From One-Pager to Design System

**Session duration:** ~3h  
**Phase:** 1A.0 (port) + documentation infrastructure  
**Status at close:** Phase 1A.0 complete. ADR-001–004 backfilled. Docs structure established.

---

## What happened

The project reached a turning point today. What started as a single HTML brand document is now officially becoming a design system — with a playground, a token pipeline, and a Figma sync on the roadmap.

The session had two distinct halves.

### First half — planning the architecture

Before touching any code, we needed to answer the structural question: what does this project become? The answer came through a set of decisions made in sequence:

1. **Separate the document from the playground.** `index.html` stays the curated brand reference. A new `system/` directory becomes the scratchpad — same CSS, no content pressure.

2. **Adopt W3C Design Tokens format.** The current hand-maintained `brandOS-tokens.css` works, but it's a dead end for tooling. Moving to `tokens.json` (W3C Community Group format) unblocks Figma Variables sync via Tokens Studio. A minimal Node generator produces the CSS — no framework, no build system.

3. **Give `system/` a distinct skin.** The product register (white background, Steel accent) immediately signals "workbench, not document." It reuses the register concept already in the BrandOS, models the real product context, and costs zero new CSS files.

4. **Port first, then build.** Building the playground on top of an outdated document would create immediate drift. The `ui-test.html` redesign had to land in brandOS before Phase 1A.1 begins.

### Second half — porting the redesign (Phase 1A.0)

The port was the main technical work. `ui-test.html` had accumulated a full redesign that had never made it back to the document. Everything was applied via str_replace — no full rewrites.

**What landed:**

- **Animations.** Three keyframes (`appear`, `nav-arrive`, `dot-pulse`) with staggered load sequence on nav and hero elements. Full `prefers-reduced-motion` guard.
- **Scroll reveals.** IntersectionObserver on `.ldiv-reveal` and `.ch-reveal` classes. Layer intros and chapter headers fade up as you scroll.
- **Ghost parallax.** The oversized layer name in `.li-ghost` shifts on scroll via `--ghost-y` CSS custom property. Subtle, adds depth.
- **Nav redesign.** Brand header with name + sub, flat nav groups using `:has()` for the ember active bar, nav footer with mark.
- **Hero redesign.** `.hero-lower` grid holds badges and metadata side by side. Cleaner hierarchy.
- **Layer intro.** Replaced `.ldiv.lintro` with `.layer-intro` — label, name, description, ghost. More structured, more animatable.
- **Chapter, callout, rules.** Tighter spacing, cleaner callout (left border only), rules at 14px mono bold.

**One bug found and fixed during port.**

Adding `animation: nav-arrive ... fill-mode: both` caused the nav to stay visible on mobile — the final keyframe (`translateX(0)`) persisted and overrode the media query's `translateX(-100%)`. Fix: `nav.side { animation: none; }` inside the `@media(max-width:960px)` block. Classic fill-mode trap.

### Documentation infrastructure

We established the full docs structure this session:

```
docs/
├── ROADMAP.md              — status tracker, authoritative "what's next"
├── decisions/              — ADR files
│   ├── ADR-001-design-system-architecture.md
│   ├── ADR-002-w3c-design-tokens.md
│   ├── ADR-003-system-skin.md
│   └── ADR-004-port-ui-test-to-brandos.md
├── devlog/                 — this file
│   └── 2026-04-25-from-onepager-to-design-system.md
└── backlog/                — ideas, bugs, feedback (pending)
```

Automation settled at two levels:
- **Level 1** — proactive memory: Claude proposes documentation at natural moments (milestone, decision, bug) without being asked
- **Level 2** — `/capture` skill: user-triggered shorthand to log a decision or note mid-session

No hooks. Lightweight and low-friction.

---

## Decisions made

| # | Decision |
|---|---|
| ADR-001 | Two-consumer, one-source architecture: `system/` + `index.html` both consume root CSS |
| ADR-002 | W3C Design Tokens format for `tokens.json` → Node generator → `brandOS-tokens.css` |
| ADR-003 | Product register skin (white + Steel) for `system/` workbench |
| ADR-004 | Port ui-test.html redesign before building system/ — Phase 1A.0 is a hard prerequisite |

---

## What's next

- `docs/backlog/` — create ideas.md, bugs.md, feedback.md with templates
- `/capture` skill — create in `~/.claude/skills/`
- `PROCESS.md` — add Update type 6 (System playground protocol)
- `CLAUDE.md` — add pointer to `docs/` and system/ rules
- **Phase 1A.1** — build `system/` scaffold (foundations, components, patterns, assets pages)
