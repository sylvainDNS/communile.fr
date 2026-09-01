# Research: Page « Les Bières de Charlotte »

**Date**: 2026-09-01 — Toutes les inconnues du Technical Context sont résolues ci-dessous.

## R1. URL et identifiants du lieu

- **Decision**: URL `/les-bieres-de-charlotte` ; nom de feature `bieres-de-charlotte` (dossier `src/features/bieres-de-charlotte/`, préfixe de fichiers `bieres-de-charlotte-*`) ; thème `data-theme="bieres-de-charlotte"` ; constante `PATH.LES_BIERES_DE_CHARLOTTE`.
- **Rationale**: aligné sur la convention existante (`/les-landes-fertiles` ↔ `features/landes-fertiles`, constantes SCREAMING_SNAKE dans `src/utils/constants.ts:13-24`). Slug dérivé du nom complet du lieu (FR-001), sans accents ni apostrophes.
- **Alternatives considered**: `/la-brasserie` (rejeté : nom générique, le lieu conserve son nom propre) ; `/bieres-de-charlotte` (rejeté : les autres slugs gardent l'article).

## R2. Palette de couleurs du thème

- **Decision**: palette « ambre & cuivre » dérivée des photos (bois chaud de la boutique, bière ambrée, capsules dorées) :
  - `--color-bieres-de-charlotte-amber` ≈ `oklch(0.62 0.13 60)` + accent plus foncé → `--theme-primary` (fonds de sections avec texte blanc) ;
  - `--color-bieres-de-charlotte-gold` ≈ `oklch(0.85 0.15 90)` + accent → `--theme-secondary` (badges, décorations) ;
  - `--color-bieres-de-charlotte-brown` ≈ `oklch(0.35 0.07 55)` (brun malt foncé) + accent → `--theme-tertiary` ;
  - neutre foncé commun `oklch(0.1292 0.0415 265.15)` → `--theme-quaternary` (comme bar-ile / labo-diva / carte-postale).
  Valeurs indicatives : l'implémentation ajuste finement en vérifiant le contraste (texte blanc sur `primary` ≥ 4.5:1 ; `secondary` clair réservé aux fonds avec texte foncé).
- **Rationale**: FR-002 exige une palette distincte des 5 existantes — aucune n'utilise le brun/cuivre/ambre comme dominante (watt = bleu/rouge/jaune/vert, landes = gris/rouge/vert sombre, labo-diva = vert d'eau/jaune, bar-ile = bleu nuit/orange, carte-postale = bleu violacé/jaune). L'orange du Bar'Île (`oklch(0.772 0.1738 64.55)`) est un secondaire clair ; l'ambre profond en primaire reste non confondable (SC-005). Mécanique identique aux autres thèmes : 3 couleurs nommées + accents dans `@theme`, mappées sur `--theme-*` dans `[data-theme='bieres-de-charlotte']` (`global.css`).
- **Alternatives considered**: dominante « inox/gris » des cuves (rejetée : trop proche du gris des Landes Fertiles et peu chaleureuse) ; dominante verte « houblon » (rejetée : collision avec Labo Diva et Landes Fertiles).

## R3. Composition de la page (pas de maquette)

- **Decision**: 7 sections, dans cet ordre :
  1. **Hero** — identité typographique (pas de logo fourni) : titre `h1` « Les Bières de Charlotte » + accroche « Le tout nouveau lieu de la coopérative ! », décoration SVG aux couleurs du thème (patron `*-hero-section.astro`).
  2. **What** (« La brasserie, c'est quoi ? ») — `Section variant="primary"`, texte source intégral (quartier St-Clément, brassage artisanal/local, non filtrée/non pasteurisée…) + photo boutique ; mention « Retrouvez aussi les bières dans les autres lieux de la coopérative » avec liens internes (FR-003, FR-007).
  3. **Boutique** — horaires (vendredi 16 h–20 h, samedi 11 h–20 h) mis en évidence + texte dégustation/échange avec le brasseur + photo bouteilles (FR-004).
  4. **Bières** — deux blocs (`InfoCard` ou cartes) : gamme permanente (Blonde, Ambrée, Triple, Blanche, focus Carlota) et brassins éphémères de Simon + photo salle de brassage (FR-005).
  5. **Tireuse** — principe, occasions, appel à réserver par téléphone (lien `tel:`) (FR-006).
  6. **Infos pratiques** — adresse, téléphone, email, repères (églises, Chronobus C1 « Chanzy ») + carte `LeafletMap` (FR-011, US2).
  7. **Instagram** — `InstagramFeed username="bieresdecharlotte"` (FR-013), même patron que les autres pages.
  Pas de section avis ni FAQ (edge case spec : pas de contenu factice).
- **Rationale**: reprend l'ordre éprouvé des pages existantes (hero → what → sections thématiques → instagram, cf. `a-la-carte-postale.astro:67-75`) ; les horaires apparaissent dès la section boutique, en un seul parcours (SC-002).
- **Alternatives considered**: fusionner boutique + infos pratiques (rejeté : les horaires méritent la proéminence US2 ; la carte alourdirait la section) ; hero avec photo plein écran (rejeté : les heros existants sont logo/typo sur fond blanc — cohérence de composition).

## R4. Données structurées et SEO

- **Decision**: JSON-LD `@type: 'Brewery'` (schema.org, sous-type de FoodEstablishment), calqué sur le schéma Restaurant de `a-la-carte-postale.astro:23-64` : name, description, url, image, telephone (+33633015663), email, address complète (121 rue du Général Buat, 44000 Nantes), geo (coordonnées géocodées de l'adresse, à vérifier sur carte à l'implémentation), openingHoursSpecification (Friday 16:00–20:00, Saturday 11:00–20:00), `sameAs: [instagram]`. Title « Les Bières de Charlotte », description ≤ 160 car. reprenant lieu/quartier/horaires (patron emoji des autres pages accepté).
- **Rationale**: FR-010 + edge case « s'imposer comme la référence » face à l'ancien domaine détourné : le type le plus précis + horaires + geo maximisent l'éligibilité aux résultats enrichis locaux.
- **Alternatives considered**: `LocalBusiness` générique (rejeté : `Brewery` existe et est plus précis) ; `Store` (rejeté : l'activité première est la brasserie).

## R5. Sitemap (manque existant du site)

- **Decision**: créer `src/pages/sitemap.xml.ts`, endpoint qui génère le XML à partir des routes publiques (constantes `PATH` sans ancres + `/contact`), et `public/robots.txt` le référençant. Pas d'usage de `@astrojs/sitemap`.
- **Rationale**: FR-010 et la constitution (principe III) exigent le sitemap, or le site n'en a aucun (la dépendance `@astrojs/sitemap` est installée mais non configurée). Avec `output: 'server'` sans pages prérendues, l'intégration `@astrojs/sitemap` ne produirait rien (elle n'inclut que les routes prérendues). Un endpoint maintenu depuis `PATH` est la solution la plus simple (principe II), testable et sans changement de configuration de rendu.
- **Alternatives considered**: `@astrojs/sitemap` + passage des pages en prérendu (rejeté ici : changement transverse du mode de rendu, hors périmètre — pourra faire l'objet d'une amélioration séparée) ; sitemap statique dans `public/` (rejeté : doublon manuel du XML, l'endpoint TS reste au plus près des constantes).

## R6. Optimisation des 3 photos (portrait 3472×4624, ~3,5 Mo)

- **Decision**: convertir en webp qualité ~80, redimensionnées à 1600 px max de large, stockées dans `src/features/bieres-de-charlotte/images/` et servies via `astro:assets` (`<Image widths={[...]}>`) comme partout ailleurs. Recadrage paysage dédié (~800×256 focalisé sur le comptoir/tonneau de la photo boutique) pour `les-bieres-de-charlotte-card.webp` dans `src/features/home/images/`. Usage : boutique → what/hero, brassage → section bières, bouteilles → section boutique. Alt FR descriptifs (FR-008).
- **Rationale**: toutes les images du dépôt sont des webp pré-optimisées dans `features/<lieu>/images/` ; `PlaceCard` affiche en 800×256 paysage (`place-card.astro:26-30`) d'où le recadrage dédié (edge case portrait→paysage sans déformation).
- **Alternatives considered**: laisser les JPEG et déléguer à `astro:assets` (rejeté : 3,5 Mo dans le repo et pipeline plus lourd ; la convention du dépôt est le webp pré-optimisé) ; `object-cover` sur le portrait pour la carte (rejeté : cadrage non maîtrisé, risque de couper le sujet).

## R7. Navigation à 7 entrées et libellé

- **Decision**: libellé « Les Bières de Charlotte » ajouté en dernière position des `links` du header et du footer. Vérification visuelle obligatoire au breakpoint `xl` (nav desktop cachée en dessous) : si la ligne déborde, réduire `gap`/padding des `NavLink` ; le libellé court « La Brasserie » n'est que le dernier recours (perte du nom propre).
- **Rationale**: FR-009 « au même titre que les autres lieux » — les 6 entrées actuelles utilisent les noms complets ; edge case spec : le 7ᵉ item ne doit casser ni le header desktop ni le menu mobile (le menu mobile est une liste verticale, sans risque).
- **Alternatives considered**: menu déroulant « Nos lieux » (rejeté : refonte de navigation hors périmètre, YAGNI).

## R8. Section lieux de l'accueil (6 cartes)

- **Decision**: ajouter la 6ᵉ `PlaceCard` (horaires boutique au survol, comme les autres) et retirer la classe spéciale `md:mx-auto md:col-span-2 md:w-1/2` de la carte À La Carte Postale : la grille `md:grid-cols-2` redevient un 2×3 régulier. `tagColor` : réutiliser une couleur supportée par `Tag` (`yellow|red|green|blue`) — `red` ou `yellow` selon rendu sur la photo ; l'ajout d'une couleur `amber` à `Tag` est optionnel et non requis.
- **Rationale**: la carte centrée seule n'existait que parce que 5 est impair (`home-places-section.astro:94-106`) ; 6 cartes remplissent la grille naturellement.
- **Alternatives considered**: grille 3 colonnes (rejeté : changement de composition de l'accueil non demandé).

## R9. Coordonnées factuelles (gate de publication)

- **Decision**: intégrer adresse/téléphone/email issus de l'archive (spec, Assumptions) avec une tâche explicite de confirmation par la coopérative **avant mise en ligne** ; les coordonnées geo du JSON-LD sont géocodées depuis l'adresse et vérifiées visuellement sur la carte Leaflet.
- **Rationale**: constitution principe I (exactitude obligatoire) + FR-011. La confirmation est un jalon de publication, pas un bloqueur de développement.
- **Alternatives considered**: publier sans téléphone/email en attendant (rejeté : dégrade US2/US4 ; la confirmation est peu coûteuse).
