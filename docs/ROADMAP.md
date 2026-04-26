# Roadmap — InsideBoard AI Brand OS

> Single-page status of where we are and where we're going.
> Updated whenever a phase changes state. Authoritative source for "what's next."

**Last updated:** 2026-04-26

---

## Status legend

- `✓` Done — shipped, validated
- `◔` In progress — actively being worked on
- `○` Planned — committed, not started
- `…` Future — on the radar, not committed
- `✗` Cancelled / Superseded

---

## Active phase

### Phase 2 · Figma sync

Bidirectional sync between Figma Variables and `tokens.json` via Tokens Studio plugin.

| Step | Status | Description |
|---|---|---|
| 2.1 | `○` | Install and configure Tokens Studio in Figma |
| 2.2 | `○` | Connect to GitHub (this repo) |
| 2.3 | `○` | Validate sync workflow (Figma → repo, repo → Figma) |

**Prerequisite (manual):** GitHub personal access token with repo read/write scope.

---

## Completed

### Phase 1A · Design system foundation

| Step | Status | Description |
|---|---|---|
| 1A.0 | `✓` | Port redesigned nav, layer-intro, animations, scroll reveals from `ui-test.html` to brandOS |
| 1A.1 | `✓` | Build `system/` scaffold (foundations · components · patterns · assets) consuming existing CSS |
| 1A.2 | `✓` | Archive `ui-test.html` and `animation-test.html` into `system/lab/` |
| 1A.3 | `✓` | Extend `PROCESS.md` with "Update type 6 — System (playground)" protocol |

**Decisions:** ADR-001, ADR-003, ADR-004

### Phase 1B · Tokens W3C migration

| Step | Status | Description |
|---|---|---|
| 1B.1 | `✓` | Author `tokens.json` mirroring current CSS variables |
| 1B.2 | `✓` | Build minimal Node generator (`tokens.json` → `brandOS-tokens.css`) |
| 1B.3 | `✓` | Document tokens in `system/foundations.html` |

**Decisions:** ADR-002

### Phase 1C · 3-tier token architecture

| Step | Status | Description |
|---|---|---|
| 1C.1 | `✓` | Define primitive layer (raw values) |
| 1C.2 | `✓` | Define semantic layer (intent-based, references primitives) |
| 1C.3 | `✓` | Define component-scoped tokens for major components |

**Decisions:** ADR-005


---

## Future (uncommitted)

- `…` Layer 6–9 content (Do/Don't, Design Language, Component System, Automation Layer) — currently shown as "in progress" in the brandOS but not authored
- `…` AI generation pipeline — automate creation of brand assets that respect tokens and components
- `…` Public component library extracted from brandOS-components.css for reuse in InsideBoard Platform
- `…` Visual regression testing (Percy / Chromatic) once `system/` pages are stable

---

## Recent changes

- **2026-04-26** — Phase 1C complete. tokens.json restructured to 3-tier (primitive/semantic/component). Generator updated. 65 tokens (43 primitive, 10 semantic, 12 component). 12 new component CSS vars emitted (--nav-*, --hero-*, --chapter-*, --callout-*, --formula-*). All existing vars unchanged — no visual regression. Next: Phase 2 (Figma sync).
- **2026-04-26** — Phase 1B complete. `system/foundations.html` documenting semantic tokens (alias rows) + density section + W3C source note in header. New CSS: `.alias-list / .alias-row / .alias-chip / .alias-name / .alias-ref / .alias-val`.
- **2026-04-26** — Phase 1B.2 complete. `scripts/build-tokens.js` generates `brandOS-tokens.css` from `tokens.json`. Diff vs hand-written original: banner replaced + cosmetic font quoting; all 51 CSS variables resolve to identical values, density variants verified, no visual change. `brandOS-tokens.css` is now generated — edit `tokens.json` and re-run. Next: 1B.3 documentation.
- **2026-04-26** — Phase 1B.1 complete. `tokens.json` authored at root (W3C Design Tokens format), 51/51 CSS variables mirrored.
- **2026-04-26** — Phase 1A complete. `system/` scaffold live. Lab files archived. Update type 6 added to `PROCESS.md`.
- **2026-04-25** — Phase 1A.0 completed (nav/layer-intro/animations port). ADR-001 to ADR-004 backfilled. Documentation structure (`docs/`) established.
