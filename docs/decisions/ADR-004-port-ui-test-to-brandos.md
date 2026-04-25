# ADR-004 — Port ui-test.html Redesign to BrandOS Before Building system/

**Status:** Accepted  
**Date:** 2026-04-25  
**Author:** Romain (Art Director)

---

## Context

Before starting Phase 1A (design system scaffold), the BrandOS document itself needed to be brought up to date. A separate exploration file (`ui-test.html`) had accumulated a significant redesign that was never ported back:

- Full nav redesign (brand header, flat nav groups, ember active bar via `:has()`, nav footer)
- Hero redesign (`.hero-lower` grid, `.lbadges` strip, `.mg` metadata group)
- Layer intro replacement (`.ldiv.lintro` → `.layer-intro` with label/name/desc/ghost structure)
- Load animations (nav arrive, hero eyebrow/h1/lede/hero-lower, dot pulse)
- Scroll reveals (IntersectionObserver on `.ldiv-reveal` and `.ch-reveal`)
- Ghost parallax on layer intro (CSS custom property `--ghost-y`, scroll listener)
- Chapter, callout, and rules restyling

Building `system/` on top of an outdated document would mean the playground diverges from the current design language immediately. The port had to happen first.

---

## Options considered

**Option A — Build system/ first, port later**  
Start Phase 1A.1 immediately, port the ui-test redesign in a separate pass.  
*Rejected:* system/ would consume an outdated CSS state. Component decisions in the playground would not reflect the current visual language.

**Option B — Big-bang rewrite of index.html**  
Regenerate `index.html` from scratch incorporating all changes.  
*Rejected:* High risk of content loss. Violates the str_replace-only editing rule and the content-first rule (all text must originate from `brandOS-content.md`).

**Option C — Incremental port (str_replace, section by section)**  
Apply each change as a targeted `str_replace` operation: CSS blocks updated independently, HTML sections replaced one by one.  
*Accepted.*

---

## Decision

Port all `ui-test.html` redesign work to `brandOS-components.css` and `index.html` via incremental str_replace before any `system/` work begins. Phase 1A.0 is a hard prerequisite for Phase 1A.1.

Changes applied (completed 2026-04-25):

**`brandOS-components.css`**
- Added ANIMATIONS block: `@keyframes appear`, `nav-arrive`, `dot-pulse`; load animations on nav, hero elements, dot; scroll-reveal classes `.ldiv-reveal` / `.ch-reveal`; `prefers-reduced-motion` guard
- Full NAV block replacement: `.nav-brand-name`, `.nav-brand-sub`, `.ng-num`, `.ng-sep`, `.ngl-link`, `:has()` ember bar, `.nav-footer`, `.nav-mark`
- Full HERO block replacement: `.hero-lower` grid, `.mg` flex column
- LAYER DIVIDER replaced by LAYER INTRO: `.layer-intro`, `.li-label`, `.li-name`, `.li-desc`, `.li-ghost`
- CHAPTER updated: padding, `.cn` ember, h2 sizing, `.pr` sizing, `.cb` gap
- CALLOUT updated: transparent bg, left border only
- RULES updated: 14px, mono bold
- New components: `.access-list`, `.layer-map`
- Responsive: 960px / 720px / 480px breakpoints updated for all new structures
- **Bug fix:** `nav.side { animation: none; }` inside `@media(max-width:960px)` — prevents `fill-mode: both` from overriding `translateX(-100%)` on mobile

**`index.html`**
- Nav section replaced with new brand header + flat group structure
- Hero `.lbadges` + `.mg` wrapped in `.hero-lower`
- All 6 `.ldiv.lintro` replaced with `.layer-intro.ldiv-reveal` (li-label, li-name, li-desc, li-ghost)
- Script block updated: `.layer-intro[id]` selector, hero zone early return, IntersectionObserver, ghost parallax (`--ghost-y`), reduced-motion guard

---

## Consequences

**Positive:**
- BrandOS document is now current before system/ is built — no immediate drift
- Animation and reveal system is in the CSS source of truth, not isolated in ui-test.html
- Mobile nav bug (fill-mode / translateX conflict) discovered and fixed during port

**Negative / trade-offs:**
- `ui-test.html` is now ahead of `index.html` in some respects (minor layout experiments not worth porting)
- `ui-test.html` and `animation-test.html` remain at root until Phase 1A.2 archives them to `system/lab/`

---

## Related decisions

- ADR-001 — Design system architecture (this port is its prerequisite)
- ADR-003 — System/ skin (references nav and hero structures ported here)
