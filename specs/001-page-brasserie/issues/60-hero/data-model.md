# Data Model: hero, « c'est quoi ? », Instagram (issue #60)

Pas de base de données (constitution, principe II) : les « entités » sont du contenu éditorial figé dans les composants `.astro`. Ce document fixe **les textes exacts** et leur emplacement, pour qu'aucune reformulation involontaire ne s'introduise à l'implémentation.

Source de vérité éditoriale : `brasserie-assets/Texte site internet.md`, **version du 2026-09-18** (hors dépôt, cf. convention d'assets). L'écriture inclusive et la ponctuation de la source sont conservées ; seules les apostrophes sont normalisées en apostrophes typographiques (`’`), comme partout dans le dépôt.

## Entité : Hero (`sibra-hero-section.astro`)

| Champ | Valeur | Rendu | Règles |
|---|---|---|---|
| Décoration haut-gauche | `sibra-hero-decoration.svg` (bulles) | `absolute top-0 left-0 hidden w-[300px] md:block text-secondary-accent` | décorative, `aria-hidden` |
| Décoration bas-droite | `sibra-hero-decoration.svg` | `absolute bottom-0 right-0 hidden w-[300px] rotate-180 md:block text-primary-accent` | décorative, `aria-hidden` |
| Placeholder logo | motif des trois disques | SVG inline, `fill="var(--color-tertiary)"` / `var(--color-secondary)` / `var(--color-primary)` | `aria-hidden`, précédé de `TODO logo` (FR-002) |
| Nom du lieu | « La Sibra » | `<p>` en `font-pally`, gras, centré | **pas** un élément de titre (R60-4) |
| Accroche | « De l'houblon à la pression » | `h1`, `font-pally text-4xl md:text-5xl`, centré | unique `h1` de la page (FR-001) |

## Entité : Présentation (`sibra-what-section.astro`)

Fond : `Section variant="primary"` (vert de la charte). Ornement : `sibra-what-ornament.svg`, `absolute bottom-0 left-0 text-primary-accent`, `aria-hidden`.

| Bloc | Texte exact | Rendu | Couleur (contrat thème) |
|---|---|---|---|
| Titre | « La Sibra, c’est quoi ? » | `Heading as="h2" size="xl" weight="bold"` | blanc (grand texte) |
| Accroche | « Le tout nouveau lieu de la coopérative ! » | `Text size="xl" weight="semibold"` | blanc (grand texte) |
| Présentation | « Véritable monument du quartier St Clément, la microbrasserie, anciennement Les Bières de Charlotte, est un passage obligé pour les habitant.es du quartier et les autres ! La bière y est brassée de manière artisanale, avec des ingrédients locaux. Elle est non filtrée, non pasteurisée, sans conservateur ni clarifiant. De la bière simple et sans fioritures dont chaque gorgée en appelle une autre. » | `Text size="base"` | `text-foreground` — **jamais blanc** |
| Sens du projet | « À l’image du lien entre notre ferme maraîchère et nos restaurants, intégrer une brasserie permet à la coopérative d’agir de l’houblon à la pression : produire nous-même ce qui est proposé aux client·es de nos lieux, soutenir une activité artisanale locale, repenser les liens entre métiers de bar et de brassage — le tout dans le respect de nos valeurs. L’aventure Commun’île y prend tout son sens ! » | `Text font="pally" size="xl" weight="semibold"` | `text-foreground` |
| Disponibilité | « Retrouvez aussi les bières dans **les autres lieux de la coopérative** et lors des marchés de **la ferme des Landes Fertiles** ! » (les passages en gras sont les liens) | `Text size="base"` + `Link` | `text-foreground`, liens soulignés au survol |
| Photo | `sibra-boutique.webp` | `<Image widths={[640, 960, 1280, …]} class="w-full rounded-2xl object-cover">` | alt : « L’intérieur de la boutique de La Sibra : le comptoir en bois et les étagères de bouteilles de la microbrasserie » |

**Liens** (FR-005, aucune URL en dur) :

| Libellé | Constante |
|---|---|
| les autres lieux de la coopérative | `PATH.HOME` |
| la ferme des Landes Fertiles | `PATH.LES_LANDES_FERTILES` |

**Écarts de transcription assumés par rapport à la source brute**, tous sans effet sur les faits :

- « A l’image » → « À l’image » (majuscule accentuée, typographie française, principe I) ;
- le tiret simple `-` de « … de brassage - le tout dans le respect … » devient un tiret cadratin `—` (typographie française) ;
- les `\!` échappés du fichier source deviennent `!`.

## Entité : Fil social (`sibra-instagram-section.astro`)

| Champ | Valeur | Notes |
|---|---|---|
| Titre | « Retrouvez-nous sur Instagram » | `h2`, identique aux autres pages de lieux |
| Compte | `bieresdecharlotte` | prop `username` de `InstagramFeed` (FR-008) ; compte encore à l'ancien nom, à revérifier au recettage |

## Assemblage (`src/pages/la-sibra.astro`)

Ordre de rendu : `SibraHeroSection` → `SibraWhatSection` → `SibraInstagramSection`. Le bloc provisoire annoté `TODO #60` (vérification des décorations, posé par le socle) est **supprimé**, ainsi que les imports de SVG devenus inutiles à la page. Les métadonnées (`title`, `description`) restent celles du socle : leur version définitive relève de l'issue #63.

Les sections des issues suivantes s'insèreront **entre** la présentation et le fil Instagram.

## Contenus explicitement absents de cet incrément

Horaires, adresse, téléphone, email, gammes de bières, lieux revendeurs nominatifs, prêt de tireuse, carte. Ils appartiennent aux issues #61, #64, #65 — et, pour le téléphone et l'email, au gate #67 (FR-012).
