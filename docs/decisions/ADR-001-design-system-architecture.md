# ADR-001 — Design System Architecture

**Status:** Accepted  
**Date:** 2026-04-25  
**Author:** Romain (Art Director)

---

## Context

The BrandOS started as a single HTML document (`index.html`) that serves both as a brand reference and as a visual exploration space. As the project matures, these two roles are in tension:

- The document must be stable, curated, and presentable to stakeholders
- Component exploration requires a scratchpad with fake content, no production pressure

Additionally, the project needs to eventually connect to a token pipeline (Figma Variables sync) and potentially extract a public component library for the InsideBoard Platform. These goals require a more structured foundation than a single file.

---

## Options considered

**Option A — Single file, growing in place**  
Keep everything in `index.html`. Add a hidden "playground" section at the bottom.  
*Rejected:* Playground content would pollute the document. No clean separation of concerns.

**Option B — Separate repo**  
Create a second repository for `system/`.  
*Rejected:* Adds sync overhead between two repos sharing the same CSS. Increases drift risk.

**Option C — Subdirectory scaffold sharing the same CSS**  
Add a `system/` directory with standalone HTML pages. Both `index.html` (document) and `system/*.html` (playground) consume `brandOS-components.css` and `brandOS-tokens.css` from the root.  
*Accepted.*

---

## Decision

Adopt a **two-consumer, one-source architecture**:

```
brandOS-tokens.css      ← source of truth (variables only)
brandOS-components.css  ← source of truth (all component styles)
        │
        ├── index.html          (brand document, GitHub Pages root)
        └── system/
            ├── foundations.html
            ├── components.html
            ├── patterns.html
            ├── assets.html
            └── lab/            (archived experiments)
```

Rules:
- CSS is never duplicated. `system/` pages link to `../brandOS-components.css` and `../brandOS-tokens.css`.
- New components are prototyped in `system/components.html` with fake text before appearing in `index.html`.
- `system/` uses the **product register skin**: white background, `border-left: 2px solid var(--fn-steel)`, dot accent in Steel. This visually distinguishes the workbench from the final document.
- `lab/` archives experiments (`ui-test.html`, `animation-test.html`) without deleting them.

---

## Consequences

**Positive:**
- Clean separation between curated document and live playground
- Single CSS to maintain; changes propagate to both consumers automatically
- Playground is browsable on GitHub Pages at `/system/`
- Foundation for the token pipeline (Phase 1B) and Figma sync (Phase 2)

**Negative / trade-offs:**
- `system/` HTML pages need to be created from scratch (Phase 1A.1)
- Relative paths (`../`) in `system/` links must be kept consistent
- No build step yet — any token tooling added in Phase 1B must still produce flat CSS files

---

## Related decisions

- ADR-002 — W3C Design Tokens format for token source
- ADR-003 — Product register skin for system/ workbench
- ADR-004 — Port ui-test.html redesign to brandOS (prerequisite to this)
