# ADR-002 — W3C Design Tokens Format

**Status:** Accepted  
**Date:** 2026-04-25  
**Author:** Romain (Art Director)

---

## Context

`brandOS-tokens.css` is currently a hand-maintained CSS custom properties file. It works, but it is a dead end for tooling:

- Figma Variables cannot read CSS files directly
- Tokens Studio (the Figma plugin that syncs design tokens to code) requires JSON input in the W3C Design Tokens format
- A proprietary JSON schema would require custom parsers on every tool boundary

The project roadmap includes Figma Variables sync (Phase 2). The token format decision must be made before that work begins, and it constrains how Phase 1B (token migration) is structured.

---

## Options considered

**Option A — Stay with hand-maintained CSS variables**  
No migration. Continue editing `brandOS-tokens.css` directly.  
*Rejected:* Blocks Figma sync permanently. CSS variables are not machine-readable across tools.

**Option B — Proprietary JSON (custom schema)**  
Define a custom `tokens.json` structure and write a bespoke CSS generator.  
*Rejected:* Every tool integration requires a custom adapter. No ecosystem support.

**Option C — Style Dictionary format**  
Use Salesforce Style Dictionary's JSON schema with a Node pipeline.  
*Considered:* Mature tooling, good CSS output. But the schema is Style Dictionary-specific, not an open standard. Adds a framework dependency that may not align with Tokens Studio.

**Option D — W3C Design Tokens Community Group format**  
Use the draft W3C standard (`tokens.json` with `$type`, `$value`, `$description`). Generate CSS via a minimal Node script.  
*Accepted.*

---

## Decision

Adopt the **W3C Design Tokens Community Group** format as the token source of truth, with a minimal Node generator producing `brandOS-tokens.css`.

```
tokens.json              ← source of truth (W3C format)
    │
    └── [node script]
            │
            └── brandOS-tokens.css   ← generated, not hand-edited after migration
```

Token structure mirrors the current CSS variable groups:

```json
{
  "color": {
    "white":  { "$type": "color", "$value": "#FFFFFF" },
    "ivory":  { "$type": "color", "$value": "#FAFAF9" },
    "ink":    { "$type": "color", "$value": "#1B1712" }
  },
  "spacing": {
    "s1": { "$type": "dimension", "$value": "4px" }
  }
}
```

The Node generator is intentionally minimal — no framework dependency, no build system. A single script (~50 lines) reads `tokens.json` and writes `brandOS-tokens.css`.

---

## Consequences

**Positive:**
- `tokens.json` is directly readable by Tokens Studio → enables Phase 2 Figma sync
- W3C format is tool-agnostic — not locked to any single vendor
- Generator script is trivial to maintain or replace
- `tokens.json` becomes documentable in `system/foundations.html` (Phase 1B.3)

**Negative / trade-offs:**
- W3C Design Tokens spec is still a draft (Community Group, not final standard) — minor schema changes possible
- After migration, `brandOS-tokens.css` must not be hand-edited — requires discipline
- Migration requires authoring `tokens.json` to match the current 50+ CSS variables exactly (Phase 1B.1)
- Adds a Node script to the project — first tooling dependency

---

## Related decisions

- ADR-001 — Design system architecture (system/ scaffold that will document tokens)
- ADR-003 — Product register skin for system/ workbench
