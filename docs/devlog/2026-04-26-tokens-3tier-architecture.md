# 2026-04-26 — Phase 1C : Architecture 3 tiers

## Ce qui a été fait

### Restructuration de tokens.json

Passage d'une structure plate (un groupe `color` mélangant primitives et sémantiques) à une architecture 3 tiers explicite :

```
primitive.*    — valeurs brutes, aucune référence
semantic.*     — aliases, référencent les primitives
component.*    — tokens scoped aux composants, référencent primitive ou semantic
```

**Comptage final :** 65 tokens (43 primitive, 10 semantic, 12 component).

### Couche primitive (1C.1)

- `primitive.color.*` — les 34 couleurs brutes : primary palette, warm gray scale (×10), IRON agents (×4), functional palette (×12) + gray-50
- `primitive.spacing.*` — s1–s9
- `primitive.font.*` — sans, mono

### Couche semantic (1C.2)

- `semantic.color.*` — 7 aliases : `bg-canvas`, `bg-paper`, `bg-surface`, `text-primary`, `text-primary-inverse`, `text-muted`, `text-on-color`. Toutes référencent `{primitive.color.*}` sauf `text-muted` (rgba littéral).
- `semantic.density.*` — `default` (1) / `comfortable` (1.15) / `compact` (0.85)

### Couche component (1C.3)

12 tokens sur 5 composants, définis à partir des valeurs réellement utilisées dans `brandOS-components.css` :

| Composant | Tokens |
|---|---|
| nav | `nav-bg`, `nav-border`, `nav-accent` |
| hero | `hero-accent`, `hero-lede`, `hero-border` |
| chapter | `chapter-accent`, `chapter-principle` |
| callout | `callout-border`, `callout-border-warn` |
| formula | `formula-bg`, `formula-text` |

Ces tokens sont **émis en CSS** (`--nav-bg: var(--white)` etc.) mais `brandOS-components.css` continue d'utiliser les primitives directement. Adoption progressive prévue — rien ne casse en attendant.

### Générateur mis à jour (scripts/build-tokens.js)

Changements clés :
- `sectionFor(t)` remplace le bloc if/else inline — détermine la sous-section `:root` d'un token à partir de son chemin (`tier.group.name`)
- `cssVarName(t)` — cas spécial `semantic.density.default` → `--density` (pas `--default`)
- `emitDensityVariants` — filtre sur `semantic.density.*` au lieu de `density.*`
- Section `COMPONENT TOKENS` ajoutée à `SECTION_ORDER`
- Log de sortie par tier : `primitive: 43, semantic: 10, component: 12`

### Résolution des aliases W3C

La fonction `resolveValue` n'a pas changé — elle extrait le dernier segment du chemin :
- `{primitive.color.ivory}` → `.pop()` → `ivory` → `var(--ivory)` ✓
- `{semantic.color.text-primary-inverse}` → `.pop()` → `text-primary-inverse` → `var(--text-primary-inverse)` ✓

## Vérification

- Diff vs CSS original : uniquement banner + `"Arial"` cosmétique + bloc COMPONENT TOKENS (attendu)
- `getComputedStyle` confirmé pour tous les tokens — primitives, sémantiques, component, density
- 0 erreur console
- Rendu visuel inchangé

## Pour la suite — Phase 2 (Figma sync)

- `tokens.json` est maintenant structuré en 3 tiers lisibles par Tokens Studio
- Les références W3C (`{primitive.color.ember}`) sont compatibles avec le format DTCG que Tokens Studio supporte depuis v2
- Point d'attention : Tokens Studio lit les sets JSON comme des groupes — la structure `primitive / semantic / component` deviendra 3 sets dans le plugin
