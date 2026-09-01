# Contrat : thème « bieres-de-charlotte »

Tokens CSS ajoutés à `src/styles/global.css`, suivant exactement la mécanique des 5 thèmes existants (couleurs nommées dans `@theme`, mapping `--theme-*` dans `@layer base`). Les composants (`Section variant`, `Badge variant`, `Tag color="primary|secondary|tertiary"`, `text-primary`…) consomment ces tokens sans modification.

## Couleurs nommées (`@theme`)

| Token | Rôle visuel | Valeur indicative (ajustée au contraste à l'implémentation) |
|---|---|---|
| `--color-bieres-de-charlotte-amber` | Ambre/cuivre — dominante | `oklch(0.62 0.13 60)` |
| `--color-bieres-de-charlotte-amber-accent` | Accent foncé | `oklch(0.52 0.13 60)` |
| `--color-bieres-de-charlotte-gold` | Jaune paille/doré | `oklch(0.85 0.15 90)` |
| `--color-bieres-de-charlotte-gold-accent` | Accent | `oklch(0.78 0.15 88)` |
| `--color-bieres-de-charlotte-brown` | Brun malt foncé | `oklch(0.35 0.07 55)` |
| `--color-bieres-de-charlotte-brown-accent` | Accent | `oklch(0.28 0.07 55)` |

## Mapping thème (`@layer base`)

```css
[data-theme='bieres-de-charlotte'] {
  --theme-primary: var(--color-bieres-de-charlotte-amber);
  --theme-primary-accent: var(--color-bieres-de-charlotte-amber-accent);
  --theme-secondary: var(--color-bieres-de-charlotte-gold);
  --theme-secondary-accent: var(--color-bieres-de-charlotte-gold-accent);
  --theme-tertiary: var(--color-bieres-de-charlotte-brown);
  --theme-tertiary-accent: var(--color-bieres-de-charlotte-brown-accent);
  --theme-quaternary: oklch(0.1292 0.0415 265.15);          /* neutre commun aux autres thèmes */
  --theme-quaternary-accent: oklch(0.0501 0.0086 264.05);
}
```

## Exigences

- **Distinctivité (SC-005)** : dominante ambre/cuivre — aucune des 5 palettes existantes n'utilise cette teinte en primaire.
- **Contraste (FR-012, WCAG 2.1 AA)** : texte blanc sur `--theme-primary` et `--theme-tertiary` ≥ 4.5:1 ; `--theme-secondary` (clair) réservé aux fonds sous texte foncé et aux décorations. Vérification outillée (ex. contrast checker sur les valeurs oklch finales) avant merge.
- **Déclaration TypeScript** : `'bieres-de-charlotte'` ajouté à l'union `Props['theme']` de `src/layouts/main.astro:16`.
- Les dérivés `-light`/`-dark` (color-mix) sont produits automatiquement par le bloc `@theme inline` existant — rien à ajouter.
