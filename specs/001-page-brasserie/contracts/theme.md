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

> **Révision 2026-09-20 (issue #66)** — ce tableau contenait six valeurs estimées, dont une
> (`tertiary-accent` sur blanc, annoncée 3,0:1) autorisait explicitement une combinaison **non conforme
> AA**. Les valeurs ci-dessous sont recalculées depuis les tokens `oklch` de `src/styles/global.css`, et
> rejouables : `node specs/001-page-brasserie/issues/66-polish/contracts/contrastes.mjs`. Détail des écarts
> et de leur gravité : [`issues/66-polish/contracts/contrastes.md`](../issues/66-polish/contracts/contrastes.md).

| Fond | Texte blanc | Texte `foreground` (neutre foncé) | Usage autorisé |
|---|---|---|---|
| `primary` vert `#7A9300` | 3,50:1 | 5,66:1 | blanc en **grand texte** (≥ 24 px ou ≥ 18,66 px **en graisse 700** : `Heading`, `Text size="xl" weight="bold"`) ; texte courant en `foreground`. ⚠️ `weight="semibold"` (600) ne qualifie **pas** : sous `md`, `size="xl"` rend 20 px, donc du texte courant au sens WCAG (cf. `issues/60-hero/research.md` R60-6) |
| `primary-accent` `#5E7500` | 5,25:1 | **3,77:1 ✗** | blanc en texte courant (`Section variant="accent"`, `Badge variant="primary"` sur `-accent` si besoin) ; **`text-foreground` interdit en texte courant** |
| `secondary` rose `#DC5B87` | 3,57:1 | 5,55:1 | idem primary : blanc en grand texte, courant en `foreground` |
| `secondary-accent` `#B93B6A` | 5,39:1 | **3,67:1 ✗** | blanc en texte courant ; **`text-foreground` interdit en texte courant** |
| `tertiary` orange `#FEA300` | **2,01:1 ✗** | 9,85:1 | **jamais de texte blanc** ; fonds sous texte `foreground`, ornements |
| `tertiary-accent` `#DC8300` | **2,88:1 ✗** | 6,87:1 | décorations, filets ; **jamais de texte blanc, y compris en grand texte** (2,88 < 3,00) |

- **Interdits sur cette page** : `Badge variant="tertiary"` (rend `bg-tertiary text-white`) ; `Text size="base" color="white"` directement sur `Section variant="primary|secondary"`.
- **Jamais de texte blanc sur `tertiary` ni `tertiary-accent`**, quelle que soit la taille. La version
  précédente de ce tableau autorisait le grand texte blanc sur `tertiary-accent` en s'appuyant sur un ratio
  de 3,0:1 ; la mesure donne **2,88:1**, sous le seuil.
- **Jamais de `text-foreground` en texte courant sur `primary-accent` ni `secondary-accent`** (3,77 et
  3,67). Ces deux cellules étaient **vides** dans la version précédente : une cellule vide se lit « non
  applicable », alors qu'elle signifiait ici « non mesuré ». Sur ces deux fonds, c'est le **blanc** qui est
  la bonne réponse.
- **`Tag` avec une couleur thémée** : le composant pose la couleur pleine du thème sur un dégradé clair de
  cette même couleur, ce qui donne `primary` **2,51:1**, `secondary` **2,55:1**, `tertiary` **1,65:1** — la
  version précédente présentait `Tag color="tertiary"` comme un usage valide, il ne l'est pas. Le défaut
  n'est d'ailleurs pas propre à ce thème : il touche 4 des 6 thèmes du site. Depuis #66, `tag.astro` rend
  `text-foreground` pour les variantes thémées (≥ 14:1), et aucune surcharge locale n'est plus nécessaire.
- **Distinctivité (SC-005)** : vert olive + rose en dominantes — aucun thème existant n'utilise ces teintes ; l'orange voisin du Bar'Île reste tertiaire.
- **Décorations** : `sibra-hero-decoration.svg` en `text-secondary-accent` (coin haut-gauche) et `text-primary-accent` (coin bas-droit, `rotate-180`) ; `sibra-what-ornament.svg` en `text-primary-accent` sur fond `primary`. Motif « trois disques » du hero en couleurs de marque brutes, via les classes Tailwind `fill-tertiary` / `fill-secondary` / `fill-primary` — **pas** `fill="var(--color-…)"` en attribut de présentation SVG, qui ne substitue pas les `var()` (cf. `issues/60-hero/research.md` R60-1).
- **Déclaration TypeScript** : `'sibra'` ajouté à l'union `Props['theme']` de `src/layouts/main.astro:16`.
- Les dérivés `-light`/`-dark` (color-mix) sont produits automatiquement par le bloc `@theme inline` existant — rien à ajouter.
- Vérification outillée des valeurs finales avant merge. Les ratios ci-dessus sont produits par
  `issues/66-polish/contracts/contrastes.mjs`, qui convertit `oklch` → Oklab → sRGB puis applique la
  luminance relative WCAG, et reproduit `color-mix(in oklab, …)` comme le fait le navigateur. Toute valeur
  ajoutée à ce tableau doit être rejouable par ce script — c'est la leçon des six estimations qu'il a
  fallu corriger en #66.
