# Roadmap — InsideBoard AI Brand OS

> Single-page status of where we are and where we're going.
> Updated whenever a phase changes state. Authoritative source for "what's next."

**Last updated:** 2026-04-25

---

## Status legend

- `✓` Done — shipped, validated
- `◔` In progress — actively being worked on
- `○` Planned — committed, not started
- `…` Future — on the radar, not committed
- `✗` Cancelled / Superseded

---

## Active phase

### Phase 1A · Design system foundation

Splitting the project into a brand document (`index.html`) and a design system playground (`system/`) that share a single CSS source of truth.

| Step | Status | Description |
|---|---|---|
| 1A.0 | `✓` | Port redesigned nav, layer-intro, animations, scroll reveals from `ui-test.html` to brandOS |
| 1A.1 | `✓` | Build `system/` scaffold (foundations · components · patterns · assets) consuming existing CSS |
| 1A.2 | `✓` | Archive `ui-test.html` and `animation-test.html` into `system/lab/` |
| 1A.3 | `✓` | Extend `PROCESS.md` with "Update type 6 — System (playground)" protocol |

**Owner:** Romain (Art Director)
**Target:** End of week 2026-04-30
**Decisions covering this phase:** ADR-001, ADR-003, ADR-004

---

## Planned

### Phase 1B · Tokens W3C migration

Move `brandOS-tokens.css` source-of-truth from hand-maintained CSS variables to W3C Design Tokens format (`tokens.json`), with a Node script generating the CSS. No visual change.

| Step | Status | Description |
|---|---|---|
| 1B.1 | `○` | Author `tokens.json` mirroring current CSS variables |
| 1B.2 | `○` | Build minimal Node generator (`tokens.json` → `brandOS-tokens.css`) |
| 1B.3 | `○` | Document tokens in `system/foundations.html` |

**Decisions covering this phase:** ADR-002

### Phase 1C · 3-tier token architecture

Restructure tokens into Primitives → Semantic → Component layers. Refactor invisible from the rendering side.

| Step | Status | Description |
|---|---|---|
| 1C.1 | `○` | Define primitive layer (raw values) |
| 1C.2 | `○` | Define semantic layer (intent-based, references primitives) |
| 1C.3 | `○` | Define component-scoped tokens for major components |

### Phase 2 · Figma sync

Bidirectional sync between Figma Variables and `tokens.json` via Tokens Studio plugin. Enables design changes in Figma to flow to code and vice versa.

| Step | Status | Description |
|---|---|---|
| 2.1 | `○` | Install and configure Tokens Studio in Figma |
| 2.2 | `○` | Connect to GitHub (this repo) |
| 2.3 | `○` | Validate sync workflow (Figma → repo, repo → Figma) |

---

## Future (uncommitted)

- `…` Layer 6–9 content (Do/Don't, Design Language, Component System, Automation Layer) — currently shown as "in progress" in the brandOS but not authored
- `…` AI generation pipeline — automate creation of brand assets that respect tokens and components
- `…` Public component library extracted from brandOS-components.css for reuse in InsideBoard Platform
- `…` Visual regression testing (Percy / Chromatic) once `system/` pages are stable

---

## Recent changes

- **2026-04-26** — Phase 1A complete. `system/` scaffold live. Lab files archived. Update type 6 added to `PROCESS.md`.
- **2026-04-25** — Phase 1A.0 completed (nav/layer-intro/animations port). ADR-001 to ADR-004 backfilled. Documentation structure (`docs/`) established.
