# Contrat : assets livrés par le socle

Ce contrat définit ce que les issues suivantes (#60–#66) peuvent importer sans retraitement. Les contrats de thème et de route/SEO restent ceux de l'epic : [`../../../contracts/theme.md`](../../../contracts/theme.md), [`../../../contracts/page-et-seo.md`](../../../contracts/page-et-seo.md).

## Photos de la page du lieu

Dossier : `src/features/sibra/images/`

| Fichier | Sujet | Contrat |
|---|---|---|
| `sibra-boutique.webp` | La boutique : comptoir bois, étagères garnies, tonneau | WebP, largeur ≤ 1600 px, orientation portrait d'origine préservée, < 300 Ko |
| `sibra-brassage.webp` | La salle de brassage | idem |
| `sibra-bouteilles.webp` | Les bouteilles | idem |

Import attendu côté sections :

```astro
---
import { Image } from 'astro:assets'
import sibraBoutique from '@/features/sibra/images/sibra-boutique.webp'
---

<Image src={sibraBoutique} alt="Le comptoir en bois de la boutique de La Sibra" />
```

L'attribut `alt` est en français et descriptif (constitution, principe IV).

## Image de la carte d'accueil

Dossier : `src/features/home/images/`

| Fichier | Contrat |
|---|---|
| `la-sibra-card.webp` | WebP paysage, ratio **3,125:1** exact (cible d'affichage 800 × 256), largeur ≈ 1280 px, recadrée sans déformation sur le comptoir et le tonneau, < 300 Ko |

Raison du nom avec article : le fichier dérive du nom de la page/URL (convention R1).

## Décorations vectorielles

Dossier : `src/features/sibra/images/`

| Fichier | Contrat |
|---|---|
| `sibra-hero-decoration.svg` | 8 disques décroissants, `fill="currentColor"`, `opacity="0.13"` par disque, `viewBox="0 0 302 302"` |
| `sibra-what-ornament.svg` | 3 disques chevauchés, `fill="currentColor"`, `opacity="0.6"`, `viewBox="0 0 231 231"` |

**Invariant** : aucune couleur littérale dans ces fichiers — la teinte vient de la classe `text-*-accent` appliquée au composant. Import attendu :

```astro
---
import SibraDeco from '@/features/sibra/images/sibra-hero-decoration.svg'
---

<SibraDeco class="absolute top-0 left-0 w-[300px] text-secondary-accent" aria-hidden="true" />
```

Le fichier `fallback-hero-decoration-labo-diva-recolore.svg` reste dans `specs/…/assets/` (solution de repli non retenue) et **n'entre pas** dans `src/`.

## Invariants transverses

- Les photos sources (`brasserie-assets/`) et les propositions SVG (`specs/001-page-brasserie/assets/`) restent hors versionnement : un clone neuf sans ces dossiers doit builder.
- Aucun asset n'est référencé par une URL absolue ou un CDN tiers (constitution, section « Contraintes techniques »).
- Les conversions sont faites **hors build** et le résultat est commité ; la chaîne de build ne dépend d'aucun outil image externe.
