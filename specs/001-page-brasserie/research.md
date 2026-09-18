# Research: Page « La Sibra »

**Date**: 2026-09-01, révisé le 2026-09-18 (R1 renommage « La Sibra », R2 palette imposée, R3 nouveau texte + décoration hero, R10 Carte Postale, R11 nom du lieu) — toutes les inconnues du Technical Context sont résolues ci-dessous.

## R1. URL et identifiants du lieu

- **Decision** (révisée le 2026-09-18, nom « La Sibra ») : URL `/la-sibra` ; nom de feature `sibra` (dossier `src/features/sibra/`, préfixe de fichiers `sibra-*`) ; thème `data-theme="sibra"` ; constante `PATH.LA_SIBRA`. Libellé de navigation « La Sibra ». JSON-LD : `name: "La Sibra"`, `alternateName: "Les Bières de Charlotte"`.
- **Rationale**: aligné sur la convention existante (`/les-landes-fertiles` ↔ `features/landes-fertiles`, constantes SCREAMING_SNAKE dans `src/utils/constants.ts:13-24`). Slug dérivé du nouveau nom avec son article (FR-001), comme `/le-labo-diva` ou `/les-landes-fertiles`. **Convention de nommage retenue** (le dépôt est mixte : `features/la-carte-postale` garde l'article, `features/bar-ile` et `features/landes-fertiles` non) : article **uniquement** dans ce qui dérive de l'URL — `src/pages/la-sibra.astro`, `PATH.LA_SIBRA`, `src/features/home/images/la-sibra-card.webp` (les autres cartes d'accueil suivent déjà le slug : `le-wattignies-card.webp`, `la-carte-postale-card.webp`) ; **sans article** pour le dossier de feature, les préfixes de fichiers et le thème — `src/features/sibra/`, `sibra-*-section.astro`, `sibra-*.webp`, `data-theme="sibra"`, `--color-sibra-*` (précédent `bar-ile` / `labo-diva`).
- **Alternatives considered**: `/les-bieres-de-charlotte` (décision du 2026-09-01, **abandonnée** le 2026-09-18 : le lieu est renommé) ; `/sibra` sans article (rejeté le 2026-09-18 : le lieu se dit « La Sibra », les autres slugs gardent l'article) ; `/la-brasserie` (rejeté : nom générique) ; redirection depuis `/les-bieres-de-charlotte` (inutile : cette URL n'a jamais existé sur communile.fr).

## R2. Palette de couleurs du thème

- **Decision** (révisée le 2026-09-18) : palette **imposée par la charte fournie** — trois disques orange / rose / vert olive. Valeurs mesurées sur l'image de charte et converties en oklch :

  | Couleur | Hex | oklch | Rôle thème |
  |---|---|---|---|
  | Vert olive | `#7A9300` | `oklch(0.6214 0.1490 120.95)` | `--theme-primary` — dominante (houblon, ferme) : fonds de sections « c'est quoi ? », liens, décoration hero coin bas-droit |
  | Rose | `#DC5B87` | `oklch(0.6469 0.1663 1.60)` | `--theme-secondary` — badges, fonds de sections secondaires, décoration hero coin haut-gauche |
  | Orange | `#FEA300` | `oklch(0.7880 0.1707 69.98)` | `--theme-tertiary` — accents, tags, ornements, fonds sous texte **sombre uniquement** |
  | Neutre foncé | — | `oklch(0.1292 0.0415 265.15)` | `--theme-quaternary` — commun aux thèmes bar-ile / labo-diva / carte-postale |

  Accents (même teinte et chroma, luminance −0,10 : l'écart utilisé sur les autres thèmes) : vert `oklch(0.5214 0.1490 120.95)` ≈ `#5E7500`, rose `oklch(0.5469 0.1663 1.60)` ≈ `#B93B6A`, orange `oklch(0.6880 0.1707 69.98)` ≈ `#DC8300`.
- **Contrastes mesurés (WCAG 2.1)** : blanc sur vert 3,5:1, sur rose 3,6:1, sur orange **2,0:1** ; neutre foncé sur vert 5,1:1, sur rose 5,0:1, sur orange 8,9:1 ; blanc sur vert-accent 5,2:1, sur rose-accent 5,4:1. Règle retenue : texte blanc autorisé sur `primary`/`secondary` **en grand texte seulement** (titres `Heading`, `Text size="xl" weight="semibold"` — seuil AA grand texte 3:1) ou sur les fonds `-accent` (AA texte courant) ; texte courant sur fond brut → couleur `foreground`. L'orange n'est jamais un fond sous texte blanc (`Badge variant="tertiary"` — `bg-tertiary text-white` — est donc proscrit sur cette page ; utiliser `Tag color="tertiary"` qui rend le texte dans la couleur sur fond clair).
- **Rationale**: FR-002 révisée — la coopérative fournit sa charte, il n'y a plus de couleur à inventer. Distinctivité (SC-005) vérifiée : aucun thème existant n'a de vert olive ni de rose en primaire/secondaire ; l'orange existe chez Bar'Île (`oklch(0.772 0.1738 64.55)`, quasi identique) mais y est secondaire sur fond bleu nuit — ici il est tertiaire dans un trio vert/rose, l'ensemble reste non confondable. Les dérivés `-light`/`-dark` sont produits par le bloc `@theme inline` existant.
- **Alternatives considered**: palette « ambre & cuivre » dérivée des photos (décision du 2026-09-01, **abandonnée** : la charte prime) ; assombrir les trois couleurs de marque pour atteindre 4,5:1 sous texte blanc (rejeté : dénature la charte, SC-005 exige les couleurs telles quelles — on joue sur la couleur du texte et les accents à la place) ; rose en primaire (rejeté : le vert relie visuellement la brasserie à la ferme des Landes Fertiles et aux ingrédients locaux, cohérent avec le paragraphe « de l'houblon à la pression »).

## R3. Composition de la page (pas de maquette)

- **Decision**: 7 sections, dans cet ordre :
  1. **Hero** — patron `la-carte-postale-hero-section.astro` (SVG en composant Astro, teinté par `text-*-accent`) : deux occurrences de `sibra-hero-decoration.svg` (haut-gauche en `text-secondary-accent` rose, bas-droit en `rotate-180 text-primary-accent` vert, `hidden md:block`, `w-[300px]`) ; au centre, en **placeholder** du logo pas encore fourni, le **motif des trois disques de la charte** (SVG inline, couleurs de marque brutes) surmontant le nom « La Sibra » en `Heading` (commentaire `TODO logo` dans le code) ; `h1` = accroche « De l'houblon à la pression » en `font-pally` (**validée le 2026-09-18**, susceptible d'évoluer ; tirée du nouveau texte, dans l'esprit des taglines « Cantine-café et midi timbré ! », « Bistrot pas chic et bar dé-branché »). Voir R3-bis pour la décoration.
  2. **What** (« La brasserie, c'est quoi ? ») — `Section variant="primary"` (vert), patron `la-carte-postale-what-section.astro` : accroche « Le tout nouveau lieu de la coopérative ! » en `Text size="xl" weight="semibold" color="white"` (grand texte), paragraphe de présentation (quartier St-Clément, « anciennement Les Bières de Charlotte », artisanal/local, non filtrée/non pasteurisée…) en texte courant **couleur `foreground`** (contraste 5,1:1, cf. R2), paragraphe « de l'houblon à la pression » en `Text font="pally" size="xl" weight="semibold"` (équivalent du paragraphe final de la Carte Postale), photo boutique, ornement `sibra-what-ornament.svg` (trois disques, `text-primary-accent`, bas-gauche) ; mention « Retrouvez aussi les bières dans les autres lieux de la coopérative et lors des marchés de la ferme des Landes Fertiles ! » avec liens `PATH.*` (FR-003, FR-007).
  3. **Boutique** — horaires (vendredi 16 h–20 h, samedi 11 h–20 h) mis en évidence + texte dégustation/échange avec le brasseur + photo bouteilles (FR-004).
  4. **Bières** — deux blocs (`InfoCard` ou cartes) : gamme permanente (Blonde, Ambrée, Triple, Blanche, focus Carlota) et brassins éphémères de Simon + photo salle de brassage (FR-005) ; en pied de section, bloc « Où retrouver nos bières ? » : liste `Tag` des lieux fournis — Le Wattignies (lien `PATH.LE_WATTIGNIES`), L'industrie, Ohmtown, Pioche (sans lien) — suivie de « … et bien d'autres » pour traduire le « … » du texte source (FR-014).
  5. **Tireuse** — principe, occasions, appel à réserver par téléphone (lien `tel:`) (FR-006).
  6. **Infos pratiques** — adresse, téléphone, email, repères (églises, Chronobus C1 « Chanzy ») + carte `LeafletMap` (FR-011, US2).
  7. **Instagram** — `InstagramFeed username="bieresdecharlotte"` (FR-013), même patron que les autres pages.
  Pas de section avis ni FAQ (edge case spec : pas de contenu factice).
- **Rationale**: reprend l'ordre éprouvé des pages existantes (hero → what → sections thématiques → instagram, cf. `a-la-carte-postale.astro:67-75`) ; les horaires apparaissent dès la section boutique, en un seul parcours (SC-002).
- **Alternatives considered**: fusionner boutique + infos pratiques (rejeté : les horaires méritent la proéminence US2 ; la carte alourdirait la section) ; hero avec photo plein écran (rejeté : les heros existants sont logo/typo sur fond blanc — cohérence de composition) ; section dédiée « Où trouver nos bières » (rejetée : quatre noms ne justifient pas une section, le bloc en pied de la section bières suffit et évite un rythme de page haché).

## R3-bis. Décoration SVG du hero et ornement « what »

- **Analyse des décorations existantes** (`src/features/*/images/*-hero-decoration.svg`) : toutes partagent le même langage — **forme géométrique monochrome, centrée sur un coin** (coordonnées négatives, seul un quart/une moitié est visible), viewBox ~300×300, **opacité 0,1–0,15**, posée deux fois dans le hero (un coin en position normale, le coin opposé en `rotate-180`, `w-[300px] hidden md:block`). Motifs : Bar'Île et Carte Postale = quatre anneaux concentriques (cible/ondes) ; Landes Fertiles = éclat de fines pointes (étoile) ; Labo Diva = demi-roue crantée / soleil. Les plus récentes (Carte Postale) utilisent `fill="currentColor"` et sont importées comme composant Astro pour être teintées par une classe `text-*`. Le Wattignies est l'exception (ornement webp).
- **Decision** : nouveau motif **« bulles »** — `specs/001-page-brasserie/assets/sibra-hero-decoration.svg` (302×302, `currentColor`) : huit disques de tailles décroissantes qui s'échappent du coin en diagonale, chacun à `opacity="0.13"` de sorte que les chevauchements s'assombrissent légèrement (~0,24) — clin d'œil direct aux **trois disques qui se chevauchent** de la charte, et évocation de la mousse/l'effervescence. Ornement de section « what » : `sibra-what-ornament.svg` (231×231, trois disques chevauchés à 60 % en `currentColor`, posé en `text-primary-accent` bas-gauche du fond vert — même gabarit que les ornements 231×231 existants). Les deux fichiers seront déplacés vers `src/features/sibra/images/` par T007.
- **Rationale**: même grammaire que les quatre décorations existantes (géométrie simple, monochrome, coin, opacité faible, deux teintes de thème via `currentColor`) tout en étant propre au lieu (bulles) et à sa charte (disques). Rendu vérifié en maquette : lisible en haut-gauche rose-accent et bas-droit vert-accent sur fond blanc, sans concurrencer le titre.
- **Sources** (copie versionnée — le dossier `specs/*/assets/` est ignoré par git jusqu'au déplacement dans `src/` par T007) :

  `sibra-hero-decoration.svg`

  ```svg
  <svg width="302" height="302" viewBox="0 0 302 302" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor">
  <circle cx="30" cy="30" r="120" opacity="0.13"/>
  <circle cx="158" cy="72" r="66" opacity="0.13"/>
  <circle cx="78" cy="176" r="54" opacity="0.13"/>
  <circle cx="196" cy="178" r="38" opacity="0.13"/>
  <circle cx="252" cy="96" r="22" opacity="0.13"/>
  <circle cx="146" cy="252" r="18" opacity="0.13"/>
  <circle cx="256" cy="242" r="12" opacity="0.13"/>
  <circle cx="290" cy="170" r="8" opacity="0.13"/>
  </g>
  </svg>
  ```

  `sibra-what-ornament.svg`

  ```svg
  <svg width="231" height="231" viewBox="0 0 231 231" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor">
  <circle cx="88" cy="78" r="78" opacity="0.6"/>
  <circle cx="158" cy="118" r="72" opacity="0.6"/>
  <circle cx="96" cy="164" r="66" opacity="0.6"/>
  </g>
  </svg>
  ```
  Repli : `le-labo-diva-hero-decoration.svg` avec `fill="currentColor"` à la place de `#00968D`, teinté `text-secondary-accent`.
- **Alternatives considered**: réutiliser `le-labo-diva-hero-decoration.svg` recoloré (variante conservée dans `assets/fallback-hero-decoration-labo-diva-recolore.svg` — rejetée en premier choix : le soleil cranté est l'identité du Labo Diva, deux pages partageraient le même motif) ; houblon ou grain d'orge stylisé (rejeté : formes figuratives, en rupture avec le langage abstrait des autres pages) ; anneaux concentriques (rejeté : déjà utilisés par deux pages).

## R4. Données structurées et SEO

- **Decision**: JSON-LD `@type: 'Brewery'` (schema.org, sous-type de FoodEstablishment), calqué sur le schéma Restaurant de `a-la-carte-postale.astro:23-64` : `name: "La Sibra"`, `alternateName: "Les Bières de Charlotte"` (ancien nom, encore recherché), description, url, image, telephone (+33633015663), email, address complète (121 rue du Général Buat, 44000 Nantes), geo (coordonnées géocodées de l'adresse, à vérifier sur carte à l'implémentation), openingHoursSpecification (Friday 16:00–20:00, Saturday 11:00–20:00), `sameAs: [instagram]`. Title « La Sibra », description ≤ 160 car. reprenant lieu/« anciennement Les Bières de Charlotte »/quartier/horaires (patron emoji des autres pages accepté).
- **Rationale**: FR-010 + edge case « s'imposer comme la référence » face à l'ancien domaine détourné : le type le plus précis + horaires + geo maximisent l'éligibilité aux résultats enrichis locaux.
- **Alternatives considered**: `LocalBusiness` générique (rejeté : `Brewery` existe et est plus précis) ; `Store` (rejeté : l'activité première est la brasserie).

## R5. Sitemap (manque existant du site)

- **Decision**: créer `src/pages/sitemap.xml.ts`, endpoint qui génère le XML à partir des routes publiques (constantes `PATH` sans ancres + `/contact`), et `public/robots.txt` le référençant. Pas d'usage de `@astrojs/sitemap`.
- **Rationale**: FR-010 et la constitution (principe III) exigent le sitemap, or le site n'en a aucun (la dépendance `@astrojs/sitemap` est installée mais non configurée). Avec `output: 'server'` sans pages prérendues, l'intégration `@astrojs/sitemap` ne produirait rien (elle n'inclut que les routes prérendues). Un endpoint maintenu depuis `PATH` est la solution la plus simple (principe II), testable et sans changement de configuration de rendu.
- **Alternatives considered**: `@astrojs/sitemap` + passage des pages en prérendu (rejeté ici : changement transverse du mode de rendu, hors périmètre — pourra faire l'objet d'une amélioration séparée) ; sitemap statique dans `public/` (rejeté : doublon manuel du XML, l'endpoint TS reste au plus près des constantes).

## R6. Optimisation des 3 photos (portrait 3472×4624, ~3,5 Mo)

- **Decision**: convertir en webp qualité ~80, redimensionnées à 1600 px max de large, stockées dans `src/features/sibra/images/` et servies via `astro:assets` (`<Image widths={[...]}>`) comme partout ailleurs. Recadrage paysage dédié (~800×256 focalisé sur le comptoir/tonneau de la photo boutique) pour `la-sibra-card.webp` dans `src/features/home/images/`. Usage : boutique → what/hero, brassage → section bières, bouteilles → section boutique. Alt FR descriptifs (FR-008).
- **Rationale**: toutes les images du dépôt sont des webp pré-optimisées dans `features/<lieu>/images/` ; `PlaceCard` affiche en 800×256 paysage (`place-card.astro:26-30`) d'où le recadrage dédié (edge case portrait→paysage sans déformation).
- **Alternatives considered**: laisser les JPEG et déléguer à `astro:assets` (rejeté : 3,5 Mo dans le repo et pipeline plus lourd ; la convention du dépôt est le webp pré-optimisé) ; `object-cover` sur le portrait pour la carte (rejeté : cadrage non maîtrisé, risque de couper le sujet).

## R7. Navigation à 7 entrées et libellé

- **Decision**: libellé « La Sibra » ajouté en dernière position des `links` du header et du footer. Libellé court (8 caractères) : le risque de débordement de la nav desktop à 7 entrées au breakpoint `xl` est faible, vérification visuelle tout de même obligatoire (edge case spec).
- **Rationale**: FR-009 « au même titre que les autres lieux » — les 6 entrées actuelles utilisent les noms complets ; edge case spec : le 7ᵉ item ne doit casser ni le header desktop ni le menu mobile (le menu mobile est une liste verticale, sans risque).
- **Alternatives considered**: menu déroulant « Nos lieux » (rejeté : refonte de navigation hors périmètre, YAGNI).

## R8. Section lieux de l'accueil (6 cartes)

- **Decision**: ajouter la 6ᵉ `PlaceCard` (horaires boutique au survol, comme les autres) et retirer la classe spéciale `md:mx-auto md:col-span-2 md:w-1/2` de la carte À La Carte Postale : la grille `md:grid-cols-2` redevient un 2×3 régulier. `tagColor` : réutiliser une couleur supportée par `Tag` (`yellow|red|green|blue`) — `green` de préférence (rappel du vert de la charte), sinon la plus lisible sur la photo ; l'ajout d'une couleur dédiée à `Tag` est optionnel et non requis.
- **Rationale**: la carte centrée seule n'existait que parce que 5 est impair (`home-places-section.astro:94-106`) ; 6 cartes remplissent la grille naturellement.
- **Alternatives considered**: grille 3 colonnes (rejeté : changement de composition de l'accueil non demandé).

## R9. Coordonnées factuelles (gate de publication)

- **Decision**: intégrer adresse/téléphone/email issus de l'archive (spec, Assumptions) avec une tâche explicite de confirmation par la coopérative **avant mise en ligne** ; les coordonnées geo du JSON-LD sont géocodées depuis l'adresse et vérifiées visuellement sur la carte Leaflet.
- **Rationale**: constitution principe I (exactitude obligatoire) + FR-011. La confirmation est un jalon de publication, pas un bloqueur de développement.
- **Alternatives considered**: publier sans téléphone/email en attendant (rejeté : dégrade US2/US4 ; la confirmation est peu coûteuse).
- **Mise à jour 2026-09-18** : l'adresse figure dans le nouveau texte source (« au 121 rue du Général Buat ») et n'a plus besoin de confirmation ; le gate T029 ne porte plus que sur le téléphone, l'email et les repères d'accès (églises, Chronobus).

## R10. Mise à jour de la page À La Carte Postale (FR-015)

- **Decision**: remplacer, dans `src/features/la-carte-postale/sections/la-carte-postale-what-section.astro` (paragraphe `Text font="pally"` final, ligne ~28), « C'est le dernier lieu né de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! » par « C'est le quatrième restaurant de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! » (formulation fournie par la coopérative). Livré dans la même PR que l'intégration nav/footer/accueil (US5a, issue #62) pour que le site soit cohérent le jour de la mise en ligne.
- **Rationale**: constitution principe I (exactitude) — dès que la brasserie est publiée, la Carte Postale n'est plus « le dernier lieu né ».
- **Alternatives considered**: supprimer la phrase (rejeté : la coopérative a fourni le remplacement) ; grep « dernier » sur tout le site pour d'autres occurrences — à faire dans la tâche (aucune autre trouvée le 2026-09-18 pour « dernier lieu né »).

## R11. Nom d'usage du lieu — RÉSOLU (2026-09-18)

- **Decision**: le lieu s'appelle **« La Sibra »**. « Les Bières de Charlotte » devient l'ancien nom : cité dans le texte de présentation (« anciennement Les Bières de Charlotte »), conservé en JSON-LD `alternateName` et dans la meta description pour le référencement. Impacts répercutés dans R1, R4, R7, data-model, contracts, tasks : URL `/la-sibra`, dossier `src/features/sibra/`, thème `sibra`, `PATH.LA_SIBRA`, libellés « La Sibra », title « La Sibra », fichiers `sibra-*`. Les titres des issues #59–#67 seront mis à jour lors de la passe GitHub.
- **Rationale**: décision de la coopérative transmise le 2026-09-18.
- **Alternatives considered**: conserver « Les Bières de Charlotte » (caduc) ; « La Brasserie » (titre du texte source — n'était qu'un intitulé de rubrique).
