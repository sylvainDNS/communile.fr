# Implementation Plan: Préparer sa visite à La Sibra (issue #61)

**Branch**: `001-page-brasserie-boutique` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-page-brasserie/issues/61-boutique/spec.md`

**Parent**: epic [`specs/001-page-brasserie/`](../../plan.md). Les décisions d'architecture, de palette, de nommage et de contenu sont prises **là-bas** et ne sont pas redémontrées ici ; ce plan déroule les tâches T013–T015 de `../../tasks.md`.

## Summary

Livrer la story P2 de `/la-sibra` en deux sections :

1. **`sibra-boutique-section.astro`** — fond orange (`Section variant="tertiary"`), tout le texte en `text-foreground` (9,85:1). Les horaires sont portés par une liste de définitions (`<dl>`) dans une carte blanche, en grand caractère gras : c'est le point de mire de la section. Autour, la phrase du texte source (adresse « au 121 rue du Général Buat ») et l'invitation à goûter / discuter avec le brasseur, illustrées par `sibra-bouteilles.webp`.
2. **`sibra-infos-section.astro`** — fond vert foncé (`Section variant="accent"`, `#5E7500`), tout le texte en blanc (5,25:1 → AA pour du texte courant, sans recourir à la règle « grand texte »). À gauche l'adresse postale en `<address>` et les repères vérifiés ; à droite la carte `LeafletMap` centrée sur le point géocodé, molette désactivée.

Les deux sections s'insèrent à la place prévue par l'epic : `hero → what → **boutique** → bières → tireuse → **infos** → instagram`.

**Écarts assumés avec T013–T015** (détail et alternatives dans [research.md](./research.md)) :

- **E1** — téléphone `tel:+33633015663` et email `bce.brasserie@gmail.com` **non affichés** : non confirmés, gelés par le gate #67, et la constitution (principe I) interdit de publier une coordonnée non vérifiée. Même traitement que #65. **À valider par l'humain.**
- **E2** — repère « Chronobus C1 » réduit à l'arrêt « Chanzy », seule part re-vérifiable. **À valider par l'humain.**
- **E3** — repères « églises Saint-Clément / Saint-Donatien » conservés car re-vérifiés géographiquement.

Aucune dépendance ajoutée, aucun asset ajouté, aucun composant partagé créé ou modifié, aucun JavaScript écrit (celui de la carte appartient au composant partagé existant, déjà utilisé par `contact.astro`).

## Technical Context

**Language/Version**: TypeScript 5.9, Astro 5.16, Node ≥ 21

**Primary Dependencies**: Astro 5, Tailwind CSS 4, composants partagés `src/components/{section,container,heading,text,card,icon,leaflet-map}.astro`

**Storage**: N/A — site statique

**Testing**: aucun framework de test dans le dépôt. Validation = `astro check` + `astro build` + `eslint` + vérification visuelle 375 px / ≥ 1280 px (cf. [quickstart.md](./quickstart.md))

**Target Platform**: navigateurs modernes (mobile + desktop), hébergement Cloudflare

**Project Type**: site vitrine statique organisé par features

**Performance Goals**: aucune image nouvelle (la photo existe déjà dans la feature), servie en plusieurs largeurs et en `loading="lazy"` ; la bibliothèque de carte est chargée à la demande par le composant partagé, exactement comme sur `/contact`

**Constraints**:

- contrat de thème de l'epic, **ratios recalculés** (cf. [research.md § R61-3](./research.md)) : sur `tertiary` orange, **jamais de blanc** (2,01:1) — tout le texte en `foreground` (9,85:1) ; sur `primary-accent` vert foncé, **texte blanc** (5,25:1) et **jamais** `text-foreground` (3,77:1 ✗) ;
- ajustements visuels dans les sections uniquement — interdiction de retoucher les teintes de `src/styles/global.css` ;
- aucune coordonnée téléphone/email, aucun `tel:`/`mailto:` : gate #67 ;
- aucun élément interactif sans destination ;
- périmètre : deux fichiers créés dans `src/features/sibra/sections/`, `src/pages/la-sibra.astro` modifié (deux imports, deux insertions) ; rien d'autre ;
- un seul `h1` sur la page ; chaque section ajoute exactement un `h2` ;
- la carte ne doit pas capter le défilement de la page (`scrollWheelZoom={false}`) ;
- l'information de localisation ne dépend pas de la carte.

**Scale/Scope**: 2 fichiers créés, 1 fichier modifié, 0 dépendance ajoutée, 0 asset ajouté

## Constitution Check

*GATE: passé avant Phase 0, re-vérifié après Phase 1.*

| Principe | Évaluation | Verdict |
|---|---|---|
| I. Contenu d'abord, exactitude obligatoire | Tous les textes de la boutique viennent du bloc « La Boutique » du fichier source du 2026-09-18. L'adresse est confirmée par ce même texte. Le point géocodé est produit par la Base Adresse Nationale et recoupé par Nominatim. Les repères affichés sont re-vérifiés ; le numéro de ligne de bus, non re-vérifiable, est retiré. Téléphone et email non confirmés ne sont pas publiés — application directe du principe, pas une omission. | ✅ |
| II. Statique et simple par défaut | Aucune dépendance, aucun backend, aucun état. Deux composants `.astro` statiques ; contenus en constantes locales. La carte réutilise le composant partagé déjà en production sur `/contact` — pas de nouveau mécanisme. | ✅ |
| III. Performance et SEO non négociables | Aucun asset ajouté ; la photo est servie en plusieurs largeurs, en `lazy`. La bibliothèque de carte est chargée à la demande par le composant partagé (comportement existant, non aggravé : une seule carte sur la page). Métadonnées, JSON-LD (`geo`, `openingHoursSpecification`) délégués à #63 — délégation explicite, la valeur géocodée leur est transmise par [data-model.md](./data-model.md). | ✅ |
| IV. Accessibilité et responsive | Un `h2` par section, pas de saut de niveau ; horaires en `<dl>` (relation jour ↔ plage portée par la structure) ; adresse en `<address>` ; icônes décoratives masquées ; contrastes recalculés et conformes AA ; carte non essentielle (équivalent textuel affiché) et molette désactivée pour ne pas piéger le défilement mobile ; vérification aux deux largeurs. | ✅ |
| V. Cohérence de la stack | Patron des sections déjà livrées de la feature et patron `contact.astro` pour la carte ; alias `@/` ; imports triés (`perfectionist`) ; `eslint` + `astro check` + `astro build` verts avant PR ; Conventional Commits ; PR vers la branche epic. | ✅ |

**Aucune violation** → section Complexity Tracking sans objet. Les écarts E1/E2 aux tâches T013–T015 sont une **application** du principe I, non une dérogation ; ils sont documentés en spec, en research, et signalés pour validation humaine.

## Project Structure

### Documentation (this feature)

```text
specs/001-page-brasserie/            # epic — source de vérité
├── spec.md, plan.md, research.md, data-model.md, tasks.md, quickstart.md
├── contracts/{theme.md,page-et-seo.md}
└── issues/
    ├── 59-socle/
    ├── 60-hero/
    ├── 64-bieres/
    ├── 65-tireuse/
    └── 61-boutique/                 # cette sous-feature
        ├── spec.md
        ├── plan.md                  # ce fichier
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        ├── contracts/sections.md
        ├── checklists/requirements.md
        └── tasks.md                 # produit par /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── features/sibra/
│   ├── images/sibra-bouteilles.webp                  # existant (1600×2131, portrait)
│   └── sections/
│       ├── sibra-boutique-section.astro              # NOUVEAU (T013)
│       └── sibra-infos-section.astro                 # NOUVEAU (T014)
└── pages/la-sibra.astro                              # MODIFIÉ (T015) — 2 imports + 2 insertions
```

**Aucun autre fichier n'est touché.** En particulier : pas de `src/components/**`, pas de `src/styles/global.css`, pas de `src/utils/constants.ts`, pas de `package.json`.

## Ordre des sections et alternance des fonds

| # | Section | `Section variant` | Fond | Couleur du texte | Ratio |
|---|---|---|---|---|---|
| 1 | hero | (classe `bg-white`) | blanc | `foreground` | 19,79:1 |
| 2 | what | `primary` | vert `#7A9300` | `foreground` + grand texte blanc gras | 5,66:1 / 3,50:1 |
| 3 | **boutique** | **`tertiary`** | **orange `#FEA300`** | **`foreground` exclusivement** | **9,85:1** |
| 4 | bières | `default` | blanc | `foreground` | 19,79:1 |
| 5 | tireuse | `secondary` | rose `#DC5B87` | `foreground` + grand texte blanc gras | 5,55:1 / 3,57:1 |
| 6 | **infos** | **`accent`** | **vert foncé `#5E7500`** | **blanc exclusivement** | **5,25:1** |
| 7 | instagram | `default` | blanc | `foreground` | 19,79:1 |

Aucun fond de marque n'est répété consécutivement ; la page utilise enfin les trois couleurs de la charte.

## Approche par section

### `sibra-boutique-section.astro` (T013)

- `Section variant="tertiary"` — l'orange est la seule teinte de la charte qui offre 9,85:1 avec la couleur de premier plan : c'est le meilleur support possible pour des horaires « proéminents », et elle interdit d'elle-même le blanc (donc pas de piège « grand texte ».)
- Grille deux colonnes (texte / photo) alignée sur le patron de `sibra-bieres-section.astro`, avec la même contrainte de colonne image (`md:items-stretch`, `h-full max-h-[560px] max-w-[460px] object-cover`) puisque la photo est en portrait.
- Les horaires sont dans une `Card` blanche (contraste maximal avec l'orange) contenant un `<dl>` : `<dt>` jour / `<dd>` plage, en `text-2xl font-bold` — la relation est portée par le balisage, pas par la mise en page (FR-004).
- Constante locale `horaires: { jour, plage }[]` — deux entrées, pas une de plus.

### `sibra-infos-section.astro` (T014)

- `Section variant="accent"` — vert foncé ; **tout** le texte en blanc, 5,25:1, AA pour du texte courant sans dépendre du seuil « grand texte ». C'est le choix le plus sûr pour une section qui contient de l'adresse et des repères en petit corps.
- Grille deux colonnes : à gauche `<address class="not-italic">` (l'adresse postale complète) + une `<ul>` de repères (icône décorative + libellé) ; à droite la carte.
- `LeafletMap` sur le patron `contact.astro` : `center` et `markers[0].position` = le point géocodé, `zoom={16}`, `scrollWheelZoom={false}`, popup nommant le lieu et répétant l'adresse, `errorText` francisé mentionnant que l'adresse reste lisible dans la section.
- Constante locale `reperes: { icon, label }[]` — deux entrées vérifiées.

### `la-sibra.astro` (T015)

Deux imports (triés alphabétiquement par `perfectionist`) et deux insertions, sans autre modification :

```text
<SibraHeroSection />
<SibraWhatSection />
<SibraBoutiqueSection />     ← nouveau
<SibraBieresSection />
<SibraTireuseSection />
<SibraInfosSection />        ← nouveau
<SibraInstagramSection />
```

## Complexity Tracking

*Sans objet — aucune violation de la constitution à justifier.*
