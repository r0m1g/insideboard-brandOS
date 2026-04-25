# ADR-003 — System/ Workbench Skin

**Status:** Accepted  
**Date:** 2026-04-25  
**Author:** Romain (Art Director)

---

## Context

The `system/` playground shares the same CSS as `index.html`. Without visual differentiation, opening a `system/` page looks identical to the brand document — creating risk of confusion about which environment is being viewed or edited.

A distinct visual identity for the workbench serves two purposes:
1. Immediately signals "this is a tool, not the final document"
2. Models the product register (white background, functional palette) that the design system will eventually produce components for

---

## Options considered

**Option A — No differentiation**  
`system/` pages look like `index.html`.  
*Rejected:* No clear signal that you're in the playground. Risk of confusing tool output with brand output.

**Option B — Dark / developer theme**  
Black background, monospace everything, terminal aesthetic.  
*Rejected:* Disconnected from the actual product context. Doesn't model anything real.

**Option C — Brand document register (Ink background)**  
`system/` uses the same dark Ink background as `index.html`.  
*Rejected:* Identical to the document — same confusion risk as Option A.

**Option D — Product register (white background, Steel accent)**  
White background, `border-left: 2px solid var(--fn-steel)` on component cards, dot accent in Steel. Mirrors the "product mode" of the Register switcher already in `index.html`.  
*Accepted.*

---

## Decision

All `system/` pages use the **product register skin**:

| Property | Value |
|---|---|
| Background | `var(--white)` — `#FFFFFF` |
| Body text | `var(--ink)` — `#1B1712` |
| Accent / border | `var(--fn-steel)` — `#4A7FBF` |
| Dot marker | Steel (`#4A7FBF`) |
| Nav / chrome | Minimal — no brand nav, lightweight utility header |

Implementation: a single `<body class="sys">` attribute triggers the skin via a scoped rule in `brandOS-components.css`:

```css
body.sys {
  background: var(--white);
  /* component cards get border-left: 2px solid var(--fn-steel) via .sys .card */
}
```

The skin does not introduce a new CSS file — it is an additive override within the existing source of truth.

---

## Consequences

**Positive:**
- Instant visual distinction between document and workbench
- Reuses an already-defined register (product) and an already-defined color (Steel)
- No new CSS file — stays within the one-source-of-truth constraint from ADR-001
- Models the real product context, making component decisions more ecologically valid

**Negative / trade-offs:**
- Requires adding `.sys` rules to `brandOS-components.css` during Phase 1A.1
- If the product register skin evolves in `index.html`, the `system/` skin may need a manual update to stay in sync

---

## Related decisions

- ADR-001 — Design system architecture (defines system/ scaffold)
- ADR-004 — Port ui-test.html redesign (prerequisite — port first, then build system/)
