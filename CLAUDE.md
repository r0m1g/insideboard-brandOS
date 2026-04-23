# CLAUDE.md — InsideBoard AI BrandOS

This file is read automatically by Claude Code at the start of every session.
It defines the project architecture, constraints, and behavioral rules.

---

## Project

InsideBoard AI Brand OS — a living HTML document that serves as the single source of truth for the brand identity system. Built and maintained by the Art Director.

---

## File architecture

| File                   | Role                                                              |
|------------------------|-------------------------------------------------------------------|
| `brandOS-tokens.css`     | CSS variables only: palette, typography, spacing, density tokens  |
| `brandOS-components.css` | All component styles, layout, navigation, responsive breakpoints  |
| `index.html`           | Pure HTML — named index.html for GitHub Pages (required by web servers) |
| `brandOS-content.md`           | Content source of truth — maps 1:1 to HTML sections              |
| `PROCESS.md`           | Full update protocols and prompt-types for all operation types    |

---

## Behavioral rules — non-negotiable

### Editing rules
- **str_replace only** for all modifications. Never rewrite a complete file when a section has changed.
- **One file per operation.** A content update targets `index.html` only. A token update targets `brandOS-tokens.css` only. A component update targets `brandOS-components.css` only.
- **Never add `<style>` blocks to `index.html`.** All styles live in the CSS files.
- **Section markers must be preserved.** Every `<!-- SECTION: id -->` and `<!-- /SECTION: id -->` comment must remain intact after any edit.

### Reading rules
- For content updates: read `brandOS-components.css` (class names only) + `brandOS-content.md` (content). Do not read `brandOS-tokens.css`.
- For token updates: read `brandOS-tokens.css` only.
- For component updates: read `brandOS-components.css` only.
- For full regeneration: read all three files.

### Never do
- Never rewrite `index.html` in full unless explicitly instructed with the regeneration prompt from `PROCESS.md`.
- Never add inline styles to `index.html` sections (inline styles already present on specific elements are intentional — do not remove them, but do not add new ones).
- Never modify `brandOS-tokens.css` or `brandOS-components.css` during a content-only operation.

---

## Section structure

Each section in `index.html` follows this pattern:

```html
<!-- SECTION: s22 -->
<section class="chapter" id="s22">
  <div class="ch"><div class="cn">2·2</div><div>
    <h2>Section title</h2>
    <p class="pr">Principle with <em>highlight</em>.</p>
  </div></div>
  <div class="cb">
    <!-- section content -->
  </div>
</section>
<!-- /SECTION: s22 -->
```

The `<!-- SECTION -->` and `<!-- /SECTION -->` markers are the anchor points for all `str_replace` operations.

---

## Key classes — quick reference

| Class          | Component                        |
|----------------|----------------------------------|
| `.chapter`     | Section container                |
| `.ch`          | Chapter header (number + title)  |
| `.cb`          | Chapter body content             |
| `.cn`          | Section number (mono)            |
| `.pr`          | Chapter principle (large body)   |
| `.sub`         | h3 subsection title              |
| `.mi`          | h4 micro label (mono uppercase)  |
| `ul.rules`     | Do / Don't / Note rule list      |
| `.callout`     | Callout box (add `.warn` variant)|
| `.fd`          | Formula dark block               |
| `.pc`          | Posture card (large Ink block)   |
| `.agrid`       | Audience card grid               |
| `.acard`       | Audience card                    |
| `.dtbl`        | Differentiation table            |
| `.vtbl`        | Verbal architecture table        |
| `.atbl`        | Anti-patterns table              |
| `.refc`        | Reference card (dark mono)       |
| `.ldiv`        | Layer divider                    |
| `.rsw`         | Register switcher                |
| `.rdemo`       | Register demo block              |

---

## JS — do not modify

The inline `<script>` block at the bottom of `index.html` handles:
- Register switcher (`applyReg()`)
- Density tweaks panel
- Nav active state via IntersectionObserver
- Mobile nav toggle

These 40 lines are stable. Do not modify, move, or rewrite them.

---

## Content source

`brandOS-content.md` is the authoritative content source. Its structure maps to `index.html` sections:

- `## Layer 0` → `#s00`
- `## Layer 1` → `#s11` through `#s17`
- `## Layer 2` → `#s21` through `#s27`
- `## Layer 3` → `#s01` through `#s10`
- `## Section 04` → `#s40`
- `## Section 05` → `#s50`

When in doubt about update protocols, read `PROCESS.md`.
