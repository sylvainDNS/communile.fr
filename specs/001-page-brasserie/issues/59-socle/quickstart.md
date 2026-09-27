# Quickstart — Vérifier le socle La Sibra (issue #59)

## Prérequis

- Node ≥ 21, pnpm ≥ 9, dépendances installées (`pnpm install`)
- Pour **refaire** les images uniquement : ImageMagick (`magick`) et les photos sources dans `brasserie-assets/` (dossier hors dépôt). Inutile pour valider le socle : les fichiers dérivés sont commités.

## 1. Contrôles automatisés

```bash
pnpm lint     # ESLint @antfu sur js/ts/astro/css
pnpm build    # astro check (types) + astro build
```

Attendu : les deux verts, sans avertissement nouveau. `astro check` valide notamment que `theme="sibra"` est une valeur acceptée par le layout.

## 2. La route répond avec son thème

```bash
pnpm dev
```

Puis ouvrir `http://localhost:4321/la-sibra`.

Attendu :
- page servie en **200** (pas de 404), en-tête et pied de page communs présents ;
- onglet intitulé **« La Sibra · Commun'île »** ;
- `<meta name="description">` renseignée avec la description provisoire ;
- **0 erreur** dans la console du navigateur.

Vérifier le thème dans l'inspecteur, sur l'élément portant `data-theme="sibra"` :

```js
getComputedStyle(document.querySelector('[data-theme="sibra"]')).getPropertyValue('--theme-primary')
// → oklch(0.6214 0.149 120.95)  (vert #7A9300)
```

Idem pour `--theme-secondary` (rose `#DC5B87`) et `--theme-tertiary` (orange `#FEA300`).

## 3. Non-régression des autres thèmes

Ouvrir `/le-wattignies`, `/les-landes-fertiles`, `/le-labo-diva`, `/le-bar-ile`, `/a-la-carte-postale` : aucune couleur ne doit avoir bougé (le socle n'ajoute que des tokens, il n'en modifie aucun).

## 4. Les assets sont livrés et conformes

```bash
ls -l src/features/sibra/images/ src/features/home/images/la-sibra-card.webp
magick identify src/features/sibra/images/*.webp src/features/home/images/la-sibra-card.webp
```

Attendu :
- `sibra-boutique.webp`, `sibra-brassage.webp`, `sibra-bouteilles.webp` : largeur ≤ 1600 px, < 300 Ko chacun ;
- `la-sibra-card.webp` : ≈ 1280 × 410, soit un ratio **3,125:1**, < 300 Ko ;
- `sibra-hero-decoration.svg` et `sibra-what-ornament.svg` présents.

Vérifier qu'aucune couleur littérale ne s'est glissée dans les SVG :

```bash
grep -E 'fill="#|stroke="#' src/features/sibra/images/*.svg   # attendu : aucun résultat
```

## 5. Les décorations prennent la couleur du thème

Sur la page `/la-sibra` en dev, les deux décorations sont insérées à titre de vérification avec `text-secondary-accent` et `text-primary-accent`. Attendu : la première se dessine en **rose foncé**, la seconde en **vert foncé**. Si elles apparaissent noires, un `fill` littéral subsiste dans le SVG.

## 6. Clone neuf (assets sources absents)

```bash
git clone <repo> /tmp/check && cd /tmp/check && pnpm install && pnpm build
```

Attendu : build vert **sans** `brasserie-assets/` ni `specs/001-page-brasserie/assets/`.

## Refaire les images (référence)

```bash
# Photos de la page
magick brasserie-assets/1000016867.jpg -auto-orient -resize 1600x -quality 80 \
  src/features/sibra/images/sibra-boutique.webp
magick brasserie-assets/1000016868.jpg -auto-orient -resize 1600x -quality 80 \
  src/features/sibra/images/sibra-brassage.webp
magick brasserie-assets/1000016869.jpg -auto-orient -resize 1600x -quality 80 \
  src/features/sibra/images/sibra-bouteilles.webp

# Carte d'accueil (recadrage paysage validé, cf. research.md S2)
magick brasserie-assets/1000016867.jpg -auto-orient -crop 3472x1111+0+2350 +repage \
  -resize 1280x -quality 80 src/features/home/images/la-sibra-card.webp
```
