# Data Model: section bières de La Sibra (issue #64)

Pas de base de données (constitution, principe II) : les « entités » sont des constantes locales de `src/features/sibra/sections/sibra-bieres-section.astro`, selon le patron `infoCards` de `landes-find-section.astro`. Ce document fixe les valeurs exactes et leur origine dans le texte source `brasserie-assets/Texte site internet.md` (version du 2026-09-18).

## Entité : Bloc de gamme (`infoCards`)

```ts
interface InfoCardType {
  icon: keyof typeof icons
  title: string
  description: string
}
```

| Champ | Bloc 1 | Bloc 2 |
|---|---|---|
| `icon` | `glass-water` | `sparkles` |
| `title` | Des recettes classiques indémodables | Des brassins éphémères saisonniers |
| `description` | Blonde, Ambrée, Triple, Blanche. La brasserie propose une gamme permanente de bières classiques. De la blonde de soif à l'emblématique Carlota dont la recette (héritée de Charlotte elle-même) est inchangée depuis 15 ans. Il y en a pour tous les goûts. | Notre brasseur Simon n'hésite pas à faire preuve d'une créativité débordante pour brasser des bières inédites, surprenantes mais toujours délicieuses ! |

**Origine** : les deux titres et les deux descriptions sont repris **mot à mot** du texte source (puces « Des recettes classiques indémodables » et « Des brassins éphémères saisonniers »). Seules adaptations : apostrophes typographiques `’`, et suppression de l'échappement markdown du texte source (`délicieuses \!` → `délicieuses !`), conformément au principe I de la constitution. Les espaces avant `!` et `?` sont des espaces ordinaires, comme dans les trois sections voisines de la page ; l'espace fine insécable n'est utilisée nulle part sur le site et n'est pas introduite ici.

**Règles** :
- aucun nom de bière hors de ceux listés (Blonde, Ambrée, Triple, Blanche, Carlota) ;
- aucune caractéristique technique (degré, amertume, format, prix) : non fournie par la source ;
- l'orthographe « Carlota » (et non « Charlotta ») et « Charlotte » pour la personne sont celles de la source.

## Entité : Lieu revendeur (`revendeurs`)

```ts
interface Revendeur {
  name: string
  href?: string // uniquement pour les lieux de la coopérative
}
```

| `name` | `href` | Rendu |
|---|---|---|
| Le Wattignies | `PATH.LE_WATTIGNIES` | `Tag color="primary"` enveloppé dans `Link` |
| L'industrie | — | `Tag color="neutral"` |
| Ohmtown | — | `Tag color="neutral"` |
| Pioche | — | `Tag color="neutral"` |

**Origine** : « Retrouvez nos bières dans les lieux suivants : Le Wattignies, L'industrie, Ohmtown, Pioche, … ». L'orthographe est celle de la source, y compris la minuscule de « L'industrie ».

**Règles** :
- ordre de la source, préservé ;
- `href` absent ⇒ aucun élément interactif : pas de `<a>`, pas de `cursor-pointer`, pas de `hover` trompeur ;
- aucune URL externe, quelle qu'en soit la source (site officiel, réseaux sociaux, carte) — décision de la coopérative du 2026-09-18 ;
- aucune entrée ajoutée : le « … » de la source est rendu par une phrase, pas par une cinquième entrée (voir `research.md` R64-6) ;
- le lien interne est construit depuis `PATH` (`src/utils/constants.ts`), jamais en URL littérale.

## Textes rédigés de la section

| Emplacement | Texte | Origine |
|---|---|---|
| Titre de section (`h2`) | Nos bières | Rédigé — voir `spec.md`, Assumptions |
| Titre du bloc revendeurs (`h3`) | Où retrouver nos bières ? | Formulation de l'issue #64 / T022 de l'epic |
| Mention de non-exhaustivité | … et bien d'autres | Rend le « … » du texte source (FR-014 de l'epic) |
| `alt` de la photo | La salle de brassage de La Sibra : les cuves de brassage en inox de la microbrasserie | Rédigé — description factuelle de la photo `1000016868.jpg` |

## Relations / points d'intégration

```text
src/utils/constants.ts (PATH.LE_WATTIGNIES)
  └── sibra-bieres-section.astro (revendeurs[0].href)

src/features/sibra/images/sibra-brassage.webp   ← livré par #59, non modifié
  └── sibra-bieres-section.astro (<Image>)

src/pages/la-sibra.astro
  └── <SibraBieresSection /> entre <SibraWhatSection /> et <SibraInstagramSection />
```

## Transitions d'état

Contenu statique — pas d'état, aucune transition.
