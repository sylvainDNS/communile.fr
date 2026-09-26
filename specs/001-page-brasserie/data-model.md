# Data Model: Page « La Sibra »

Pas de base de données (constitution, principe II) : les « entités » sont du contenu structuré porté par les sections `.astro` (constantes locales, comme dans les pages existantes) et par les fichiers partagés (`constants.ts`, `global.css`). Ce document fixe les valeurs et leur emplacement.

## Entité : Lieu (la brasserie)

| Champ | Valeur | Emplacement | Règles |
|---|---|---|---|
| Nom | La Sibra (ancien nom : Les Bières de Charlotte) | header, footer, home card, `Heading` hero, title SEO, JSON-LD `name` ; ancien nom dans le texte « what », la description et JSON-LD `alternateName` | Décision du 2026-09-18 ; orthographe exacte « La Sibra » partout |
| Slug / URL | `/la-sibra` | `PATH.LA_SIBRA` (`src/utils/constants.ts`) | Stable, dérivé du nom (FR-001) ; unique source des liens internes |
| Thème | `sibra` | union `theme` de `main.astro`, `[data-theme]` dans `global.css` | Charte fournie : vert `#7A9300` primary, rose `#DC5B87` secondary, orange `#FEA300` tertiary (FR-002, SC-005), contrastes AA selon contrat thème |
| Accroche hero | « De l'houblon à la pression » | `h1` du hero | Validée le 2026-09-18 (pourra évoluer) ; « Le tout nouveau lieu de la coopérative ! » ouvre la section « what » |
| Logo | aucun — placeholder trois disques + nom | hero | `TODO logo` dans le code, à remplacer dès réception |
| Description courte | quartier St-Clément, microbrasserie artisanale de la coopérative, horaires | `description` de la page (SEO + JSON-LD) | ≤ 160 caractères utiles, faits du texte source uniquement |
| Adresse | 121 rue du Général Buat, 44000 Nantes | section boutique (texte source), section infos pratiques, JSON-LD `address` | ✅ confirmée par le texte source du 2026-09-18 (FR-011) |
| Repères | entre les églises Saint-Clément et Saint-Donatien ; Chronobus C1 arrêt « Chanzy » | section infos pratiques | ⚠️ issus de l'archive — à confirmer par la coopérative avant mise en ligne |
| Géolocalisation | lat/lng géocodées de l'adresse | `LeafletMap` (center + marker), JSON-LD `geo` | Vérifiée visuellement sur la carte ; jamais approximée à la louche |
| Téléphone | 06 33 01 56 63 (`tel:+33633015663`) | infos pratiques, section tireuse (CTA), JSON-LD `telephone` | ⚠️ issu de l'archive — à confirmer |
| Email | bce.brasserie@gmail.com | infos pratiques, JSON-LD `email` | ⚠️ issu de l'archive — à confirmer |
| Lien coopérative | « à l'image du lien entre notre ferme maraîchère et nos restaurants… de l'houblon à la pression… L'aventure Commun'île y prend tout son sens ! » | section « what », paragraphe `font-pally` | Texte source intégral, liens `PATH.LES_LANDES_FERTILES` possible sur « ferme maraîchère » |
| Disponibilité | autres lieux de la coopérative + marchés de la ferme des Landes Fertiles | section « what » | FR-007, liens `PATH.*` |
| Instagram | https://www.instagram.com/bieresdecharlotte/ | section Instagram (`username="bieresdecharlotte"`), JSON-LD `sameAs` | FR-013 |
| Photos | boutique, salle de brassage, bouteilles | `src/features/sibra/images/*.webp` + card home | webp optimisé, alt FR descriptif (FR-008) |

### Horaires de la boutique (source de vérité : `brasserie-assets/Texte site internet.md`)

| Jour | Ouverture | Fermeture |
|---|---|---|
| Vendredi | 16:00 | 20:00 |
| Samedi | 11:00 | 20:00 |

Affichés dans : section boutique (proéminents, SC-002, avec l'adresse « au 121 rue du Général Buat » comme dans le texte source), hover de la `PlaceCard` d'accueil, JSON-LD `openingHoursSpecification`. Les horaires de l'archive Wayback (mer–ven 17 h 30–19 h 30) sont périmés et NE DOIVENT PAS être utilisés (spec, Assumptions).

## Entité : Gamme de bières

Constantes locales de `sibra-bieres-section.astro` (patron `infoCards` de `landes-find-section.astro:19-31`).

| Champ | Type | Notes |
|---|---|---|
| nom | string | Blonde, Ambrée, Triple, Blanche, Carlota |
| description | string | Depuis le texte source uniquement |
| caractère | permanente \| éphémère | Deux blocs distincts (US3) |

Contenus :
- **Gamme permanente** : Blonde, Ambrée, Triple, Blanche — « de la blonde de soif à l'emblématique Carlota » ; mise en avant Carlota : recette héritée de Charlotte, inchangée depuis 15 ans.
- **Brassins éphémères** : créations saisonnières du brasseur Simon — « inédites, surprenantes mais toujours délicieuses ».

## Entité : Lieu revendeur (« Où retrouver nos bières ? », FR-014)

Constante locale de `sibra-bieres-section.astro`.

| Champ | Type | Notes |
|---|---|---|
| nom | string | Le Wattignies, L'industrie, Ohmtown, Pioche — orthographe du texte source |
| href | string \| undefined | `PATH.LE_WATTIGNIES` pour le lieu de la coopérative ; `undefined` pour les lieux tiers (pas de lien, décision du 2026-09-18) |
| coopérative | boolean | permet de distinguer visuellement (Tag `primary` vs `neutral`) |

La liste est **ouverte** (« … » dans la source) : la formulation affichée doit l'indiquer (« … et bien d'autres »). Aucune entrée ne doit être inventée.

## Entité : Service (prêt de tireuse)

Contenu de `sibra-tireuse-section.astro` :

| Champ | Valeur |
|---|---|
| Principe | prêt de tireuse pour l'achat d'un fût |
| Occasions | anniversaire, séminaire d'entreprise, week-end entre copaines |
| Réservation | appeler la brasserie (lien `tel:+33633015663`) |

## Relations / points d'intégration

```text
constants.ts (PATH.LA_SIBRA)
  ├── header.astro (links[])            — nav desktop + mobile (FR-009)
  ├── footer.astro (colonne lieux)      — FR-009
  ├── home-places-section.astro (PlaceCard) — FR-009, horaires au hover
  ├── what-section (liens vers les autres lieux) — FR-007
  └── sitemap.xml.ts                    — FR-010
global.css ([data-theme='sibra']) ← main.astro (Props.theme)
```

## Transitions d'état

Contenu statique — pas d'état. Jalons : **téléphone/email/repères non confirmés → confirmés par la coopérative** (condition de mise en production, SC-006) — l'adresse est déjà confirmée par le texte source.

## Modification transverse : page À La Carte Postale (FR-015)

| Fichier | Avant | Après |
|---|---|---|
| `src/features/la-carte-postale/sections/la-carte-postale-what-section.astro` (~l. 28) | C'est le dernier lieu né de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! | C'est le quatrième restaurant de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! |
