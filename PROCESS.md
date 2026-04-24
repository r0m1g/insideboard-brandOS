# InsideBoard AI BrandOS — File Architecture & Process

## File structure

```
insideboard-brandOS/          ← project root
├── brandOS-tokens.css        # CSS variables, palette, typography, spacing tokens
├── brandOS-components.css    # All component styles, layout, navigation, responsive rules
├── index.html              # Pure HTML structure — named index.html for GitHub Pages
├── brandOS-content.md        # Content source of truth — update this, not the HTML
├── PROCESS.md                # This file — architecture and update process
└── CLAUDE.md                 # Permanent context file — auto-read by Claude Code on session start
```

---

## Role of each file

### `brandOS-tokens.css`
CSS variables only: primary palette, warm gray scale, IRON agent colors, functional palette, semantic tokens, spacing scale, typography stacks, density variants, base reset.

**Edit when:** A color value changes, a new token is added, a spacing unit is adjusted.
**Never edit to:** Add component styles, layout rules, or anything that isn't a pure variable or base reset.

### `brandOS-components.css`
All component styles: layout shell, nav, hero, chapter, rules, callouts, formulas, audience cards, type specimens, swatches, color bars, register switcher, tweaks panel, mobile nav, all responsive breakpoints.

**Edit when:** A component's visual behavior changes, a new component is added, a responsive rule is updated.
**Never edit to:** Define token values (those live in brandOS-tokens.css).

### `index.html`
Pure HTML structure. Links to `brandOS-tokens.css` and `brandOS-components.css`. Contains inline JS (40 lines — register switcher, density tweaks, nav active state, mobile toggle). Each section is delimited by `<!-- SECTION: id -->` and `<!-- /SECTION: id -->` markers.

**Edit when:** Content changes (a section is rewritten, updated, or added).
**Never edit to:** Change visual styles — edit the CSS files instead.
**Never add:** `<style>` blocks inside this file.

### `brandOS-content.md`
The source of truth for all BrandOS content. Written in Markdown. Maps 1:1 to the HTML sections.

**Edit when:** Brand decisions evolve, sections are validated, new layers are added.
**This is the only file Claude reads to update content.**

---

## Update protocols

### Update type 1 — Content change (most frequent)
A section of `brandOS-content.md` has been updated. Regenerate the corresponding HTML section.

**Prompt to use in Claude Code:**
```
Read brandOS-components.css to understand the available classes.
Read brandOS-content.md section [SECTION ID — e.g. "2·2 Tone & voice"].
Using str_replace, update only the HTML section between <!-- SECTION: s22 --> and <!-- /SECTION: s22 --> in index.html.
Do not touch any other section. Do not rewrite the file. Use str_replace only.
```

**After any content update, also verify:**
- Nav `<li>` and hero `.lb` badge match the new section/layer name
- If a new nav item or badge was added, the corresponding `id` exists in `index.html`
- If new multi-column grids or tables were added, a responsive rule exists in `brandOS-components.css`

---

### Update type 2 — Visual token change
A color value, spacing unit, or font token has changed.

**Prompt to use in Claude Code:**
```
Open brandOS-tokens.css.
Update [TOKEN NAME] from [OLD VALUE] to [NEW VALUE].
Use str_replace. Do not touch brandOS-components.css or index.html.
```

---

### Update type 3 — Component behavior change
A component's layout or style needs to change (e.g., the audience cards need a different padding, a new callout variant is added).

**Prompt to use in Claude Code:**
```
Open brandOS-components.css.
Find the [COMPONENT NAME] section (marked with a /* COMPONENT */ comment).
Update [SPECIFIC RULE] using str_replace.
Do not rewrite the file. Do not touch brandOS-tokens.css or index.html.
```

---

### Update type 4 — New section added
A new layer or section needs to be added to the BrandOS.

**Step 1:** Add the new content to `brandOS-content.md` under the correct layer heading.

**Step 2 — Prompt to use in Claude Code:**
```
Read brandOS-components.css for available classes.
Read the new section [SECTION TITLE] from brandOS-content.md.
Add a new HTML section after <!-- /SECTION: [PREVIOUS SECTION ID] --> in index.html.
Use this structure:
<!-- SECTION: [NEW ID] -->
<section class="chapter" id="[NEW ID]">
  ...
</section>
<!-- /SECTION: [NEW ID] -->
Also add the corresponding nav item in <!-- SECTION: nav --> under the correct layer group.
Use str_replace only. Do not rewrite the file.
```

**Step 3 — mandatory after every structural change:**
Update the Section ID map below to reflect the new section. Verify that:
- The new ID matches the `<!-- SECTION: id -->` marker added to `index.html`
- The Layer name matches the `## Layer XX · Name` heading in `brandOS-content.md`
- Status is set to `✓ in HTML`

This step is not optional. Never close a structural operation with the Section ID map out of sync.

---

### Update type 5 — Full content regeneration (rare)
`brandOS-content.md` has changed significantly across multiple sections. Regenerate `index.html` from scratch.

**Prompt to use in Claude Code:**
```
Read brandOS-tokens.css and brandOS-components.css in full — these define all available classes and variables.
Read brandOS-content.md in full — this is the content source.
Regenerate index.html following exactly the structure of the current index.html:
- Link to brandOS-tokens.css and brandOS-components.css (no inline styles)
- Use the same section IDs (s00, s11, s12... s50)
- Wrap each section with <!-- SECTION: id --> and <!-- /SECTION: id --> markers
- Preserve the nav structure, tweaks panel, and inline JS block verbatim
- Do not add <style> blocks
Write the result to index.html.
```

---

## Rules for Claude Code (non-negotiable)

1. **str_replace only for targeted updates** — never rewrite an entire file when only a section has changed.
2. **One file per operation** — a content update touches `index.html` only. A token update touches `brandOS-tokens.css` only.
3. **Never add `<style>` blocks to `index.html`** — all styles live in the CSS files.
4. **Never read `brandOS-tokens.css` for content updates** — only `brandOS-components.css` (for class names) and `brandOS-content.md` (for content).
5. **Section markers are stable** — `<!-- SECTION: id -->` and `<!-- /SECTION: id -->` must be preserved in all operations.
6. **Content-first, no exception** — Before writing any visible text into `index.html` (labels, captions, mode names, demo copy — anything a user reads), verify it exists verbatim in `brandOS-content.md`. If it doesn't, add it there first, then derive the HTML from it. Never originate content directly in the HTML.

---

## Structure — source of truth

`brandOS-content.md` is the authoritative source for all structural information: layer names, section titles, section order, and what exists or is planned.

**To know what sections exist:** read `brandOS-content.md` — `## Layer` headings define layers, `### N·N Title` headings define sections.
**To know what is implemented:** scan `<!-- SECTION: id -->` markers in `index.html`.

Do not maintain a separate list. Any such list is a derived artifact and will drift.
