# Contrat : thème « sibra »

Tokens CSS ajoutés à `src/styles/global.css`, suivant exactement la mécanique des 5 thèmes existants (couleurs nommées dans `@theme`, mapping `--theme-*` dans `@layer base`). Les composants (`Section variant`, `Badge variant`, `Tag color="primary|secondary|tertiary"`, `text-primary`…) consomment ces tokens sans modification.

**Révision 2026-09-18** : palette imposée par la charte graphique fournie par la coopérative (trois disques orange / rose / vert olive). Les valeurs de base sont **exactes** (mesurées sur la charte) et ne doivent pas être « ajustées » ; seuls les accents sont dérivés.

## Couleurs nommées (`@theme`)

| Token | Rôle visuel | Valeur | Hex équivalent |
|---|---|---|---|
| `--color-sibra-green` | Vert olive — dominante (charte) | `oklch(0.6214 0.1490 120.95)` | `#7A9300` |
| `--color-sibra-green-accent` | Accent foncé (L −0,10) | `oklch(0.5214 0.1490 120.95)` | ≈ `#5E7500` |
| `--color-sibra-pink` | Rose (charte) | `oklch(0.6469 0.1663 1.60)` | `#DC5B87` |
| `--color-sibra-pink-accent` | Accent foncé (L −0,10) | `oklch(0.5469 0.1663 1.60)` | ≈ `#B93B6A` |
| `--color-sibra-orange` | Orange (charte) | `oklch(0.7880 0.1707 69.98)` | `#FEA300` |
| `--color-sibra-orange-accent` | Accent foncé (L −0,10) | `oklch(0.6880 0.1707 69.98)` | ≈ `#DC8300` |
| `--color-sibra-neutral` | Neutre foncé commun | `oklch(0.1292 0.0415 265.15)` | — |
| `--color-sibra-neutral-accent` | Accent | `oklch(0.0501 0.0086 264.05)` | — |

## Mapping thème (`@layer base`)

```css
[data-theme='sibra'] {
  --theme-primary: var(--color-sibra-green);
  --theme-primary-accent: var(--color-sibra-green-accent);
  --theme-secondary: var(--color-sibra-pink);
  --theme-secondary-accent: var(--color-sibra-pink-accent);
  --theme-tertiary: var(--color-sibra-orange);
  --theme-tertiary-accent: var(--color-sibra-orange-accent);
  --theme-quaternary: var(--color-sibra-neutral);
  --theme-quaternary-accent: var(--color-sibra-neutral-accent);
}
```

## Contrastes mesurés (WCAG 2.1) et règles d'usage

| Fond | Texte blanc | Texte `foreground` (neutre foncé) | Usage autorisé |
|---|---|---|---|
| `primary` vert `#7A9300` | 3,5:1 | 5,1:1 | blanc en **grand texte** (≥ 24 px ou ≥ 18,66 px **en graisse 700** : `Heading`, `Text size="xl" weight="bold"`) ; texte courant en `foreground`. ⚠️ `weight="semibold"` (600) ne qualifie **pas** : sous `md`, `size="xl"` rend 20 px, donc du texte courant au sens WCAG (cf. `issues/60-hero/research.md` R60-6) |
| `primary-accent` `#5E7500` | 5,2:1 | — | blanc en texte courant (`Section variant="accent"`, `Badge variant="primary"` sur `-accent` si besoin) |
| `secondary` rose `#DC5B87` | 3,6:1 | 5,0:1 | idem primary : blanc en grand texte, courant en `foreground` |
| `secondary-accent` `#B93B6A` | 5,4:1 | — | blanc en texte courant |
| `tertiary` orange `#FEA300` | **2,0:1 ✗** | 8,9:1 | **jamais de texte blanc** ; fonds sous texte `foreground`, `Tag color="tertiary"` (texte coloré sur fond clair), ornements |
| `tertiary-accent` `#DC8300` | 3,0:1 | 7,0:1 | décorations, filets ; texte blanc en grand texte uniquement |

- **Interdits sur cette page** : `Badge variant="tertiary"` (rend `bg-tertiary text-white`) ; `Text size="base" color="white"` directement sur `Section variant="primary|secondary"`.
- **Distinctivité (SC-005)** : vert olive + rose en dominantes — aucun thème existant n'utilise ces teintes ; l'orange voisin du Bar'Île reste tertiaire.
- **Décorations** : `sibra-hero-decoration.svg` en `text-secondary-accent` (coin haut-gauche) et `text-primary-accent` (coin bas-droit, `rotate-180`) ; `sibra-what-ornament.svg` en `text-primary-accent` sur fond `primary`. Motif « trois disques » du hero en couleurs de marque brutes, via les classes Tailwind `fill-tertiary` / `fill-secondary` / `fill-primary` — **pas** `fill="var(--color-…)"` en attribut de présentation SVG, qui ne substitue pas les `var()` (cf. `issues/60-hero/research.md` R60-1).
- **Déclaration TypeScript** : `'sibra'` ajouté à l'union `Props['theme']` de `src/layouts/main.astro:16`.
- Les dérivés `-light`/`-dark` (color-mix) sont produits automatiquement par le bloc `@theme inline` existant — rien à ajouter.
- Vérification outillée des valeurs finales (contrast checker) avant merge ; les ratios ci-dessus ont été calculés sur les hex de la charte (formule WCAG relative luminance).
