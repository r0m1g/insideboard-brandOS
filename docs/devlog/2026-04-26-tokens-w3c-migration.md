# 2026-04-26 — Phase 1B : W3C Design Tokens migration

## Ce qui a été fait

### 1B.1 — tokens.json

Authoring de `tokens.json` à la racine du projet, au format W3C Design Tokens Community Group.

Structure retenue : feuilles plates dont la clé = nom de la variable CSS (ex. `white`, `gray-50`, `bg-canvas`). Groupes par catégorie (`color`, `spacing`, `font`, `density`) pour l'organisation, pas pour le nommage — le générateur utilise uniquement la clé feuille pour émettre `--<clé>`.

Résultat : 53 feuilles → 51 variables CSS distinctes (les 3 entrées `density.*` collapent en un seul `--density` émis dans des sélecteurs différents).

Couverture vérifiée : 51/51 variables CSS couvertes, aucun oubli, aucun extra.

**Décisions de structure**
- Aliases W3C (`{color.ivory}`) pour toutes les sémantiques sauf `text-muted` qui reste en rgba littéral (ivory@55% — le type composite W3C pour alpha n'est pas encore stabilisé).
- `density.default | comfortable | compact` : cas spécial traité par le générateur (voir 1B.2).
- `@font-face` et base reset exclus des tokens — ce sont des déclarations CSS, pas des données de design.

### 1B.2 — scripts/build-tokens.js

Générateur Node minimal (~70 lignes de logique + preamble statique `@font-face` / base reset).

Fonctionnement :
1. Lit `tokens.json`, parcourt les feuilles récursivement.
2. Résout les aliases W3C : `{color.ivory}` → extrait le segment feuille → `var(--ivory)`.
3. Classe les tokens couleur en sous-sections (PRIMARY PALETTE, WARM GRAY SCALE, IRON AGENTS, FUNCTIONAL PALETTE, SEMANTIC) via un config explicite dans le script — classement stable, pas de pattern matching fragile.
4. Émet `:root { ... }` avec les commentaires de sous-section.
5. Émet les variantes density comme sélecteurs séparés : `[data-density="comfortable"] { --density: 1.15; }`.
6. Wraps le tout avec le preamble statique (banner "GENERATED" + @font-face) et le footer (base reset).

Diff vs fichier manuscrit : uniquement le banner + guillemets autour de `Arial` (cosmétique, CSS-équivalent). Toutes les valeurs résolues sont identiques — vérifié avec `getComputedStyle` sur le preview.

**`brandOS-tokens.css` est désormais un fichier généré.** Ne jamais l'éditer à la main.

### Documentation mise à jour

- `PROCESS.md` — structure de fichiers, rôles, Update type 2 (nouvelle procédure tokens.json + générateur), Update type 5, règles non-négociables (numérotation 1–7).
- `CLAUDE.md` — tableau des fichiers (tokens.json + scripts/ ajoutés), règles d'édition, règles de lecture, never-do.
- `docs/ROADMAP.md` — 1B.1 et 1B.2 marqués `✓`.

## Workflow token à partir de maintenant

```
# Modifier une valeur
vim tokens.json          # changer $value du token concerné
node scripts/build-tokens.js   # régénérer brandOS-tokens.css

# Ajouter un nouveau token
# → ajouter une feuille sous le bon groupe dans tokens.json
# → clé feuille = nom de la variable CSS (sans --)
# → node scripts/build-tokens.js
```

## Ce qui reste (Phase 1B)

- `1B.3` — Documenter les tokens dans `system/foundations.html`

## Points de vigilance pour la suite (Phase 1C)

Phase 1C restructure tokens.json en 3 couches (Primitives → Semantic → Component). Aujourd'hui tout est plat dans `color`. La migration impliquera :
- Renommer les chemins de référence (`{color.ivory}` → `{primitive.color.ivory}` ou similaire)
- Mettre à jour le générateur (classement des sections, résolution des aliases)
- `brandOS-components.css` ne sera pas touché — il consomme les noms CSS (`--ivory`), pas les chemins JSON
