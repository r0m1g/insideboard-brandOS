# ADR-005 — 3-Tier Token Architecture

**Status:** Implemented  
**Date:** 2026-04-26  
**Author:** Romain (Art Director)

---

## Context

After Phase 1B, `tokens.json` was a flat structure with all tokens grouped by type (`color`, `spacing`, `font`, `density`). The `color` group mixed primitive values (raw hex) and semantic aliases (`bg-canvas`, `text-primary`) in the same flat list.

This structure works for generation but has two problems:

1. **No legible intent layer.** Reading `tokens.json` doesn't tell you whether a token is a raw value or an alias. The relationship between `ivory` and `bg-canvas` is only visible if you read the `$value` field.
2. **Blocks Phase 2 Figma sync.** Tokens Studio for Figma expects token sets with distinct roles. Mixing primitives and semantics in one set makes it impossible to configure correct Figma Variables (primitives → color styles, semantics → variable modes).

Phase 1C was planned to address this before Phase 2 begins.

---

## Options considered

**Option A — Flat with `$extensions` metadata**  
Keep the flat structure; tag each token with `$extensions.role: primitive | semantic | component`.  
*Rejected:* Non-standard. Tokens Studio and other tools ignore custom extensions. Doesn't fix the Figma problem.

**Option B — 2-tier (primitive / semantic)**  
Split into two top-level groups. No component layer.  
*Considered:* Cleaner than flat, covers the immediate Figma need. But defers the component question, which would require a third restructure later.

**Option C — 3-tier (primitive / semantic / component)**  
Three explicit top-level groups in `tokens.json`. Each tier references only the tier above it.  
*Accepted.*

---

## Decision

Adopt a **3-tier architecture** in `tokens.json`:

```
primitive.*    — raw values, no references
semantic.*     — intent-based aliases, reference primitives
component.*    — component-scoped tokens, reference primitive or semantic
```

**Naming convention:** leaf key = CSS variable name. The generator emits `--<leafkey>` regardless of nesting depth. No rename of existing CSS variables.

**Reference resolution:** W3C alias path → last segment → CSS var name.  
`{primitive.color.ivory}` → `ivory` → `var(--ivory)`. Works at any tier depth.

**Component tokens (1C.3):** Defined for nav, hero, chapter, callout, formula — the five components with the clearest semantic role for their color values. Emitted as CSS custom properties in `:root`. `brandOS-components.css` continues to use primitive/semantic vars directly; component token adoption is a future incremental step with no deadline.

---

## Consequences

**Positive:**
- `tokens.json` is readable at a glance — tier signals intent without reading `$value`
- Tokens Studio Phase 2 setup: `primitive` set maps to Figma color styles, `semantic` set maps to Variable modes
- Component tokens document design intent that was previously implicit in `brandOS-components.css`
- Generator change is minimal: path-based routing replaces type-based routing

**Negative / trade-offs:**
- `tokens.json` is larger and more nested — scrolling required
- `semantic.density.default` requires a special case in the generator (`--density`, not `--default`)
- Component tokens are currently emitted but unused in `brandOS-components.css` — dead CSS until adoption
- W3C alias paths are longer (`{primitive.color.ivory}` vs `{color.ivory}`) — more verbose

---

## Related decisions

- ADR-002 — W3C Design Tokens format (format choice that this builds on)
- ADR-001 — Design system architecture (system/ playground that documents these tokens)
