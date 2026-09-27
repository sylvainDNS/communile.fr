# Tasks: Page « La Sibra »

**Input**: Design documents from `/specs/001-page-brasserie/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md, assets/ (SVG proposés)

**Révision 2026-09-18** : palette imposée par la charte (T004), SVG hero « bulles » (T007), nouveau texte source (T008, T009, T013, T022), liste des lieux revendeurs (T022), mise à jour Carte Postale (T018b), gate T029 réduit au téléphone/email/repères, nom du lieu tranché : « La Sibra » (T000). Correspondance issues GitHub : #59 (T001–T007), #60 (US1), #61 (US2), #62 (US5a), #63 (US5b), #64 (US3), #65 (US4), #66 (Polish), #67 (gate).

**Tests**: Aucun framework de test dans le dépôt — pas de tâches de tests automatisés. La validation repose sur `pnpm build` (astro check), `pnpm lint` et la **vérification visuelle mobile + desktop** (demande explicite : s'assurer que le design avec les illustrations/shapes est bien conçu), intégrée à chaque story et en revue finale.

**Organization**: Tâches groupées par user story (ordre de priorité : US1 P1, US2 P2, US5 P2, US3 P3, US4 P4) pour livrer des incréments indépendamment testables.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: parallélisable (fichiers différents, pas de dépendance sur une tâche inachevée)
- **[Story]**: US1–US5, mappé sur spec.md
- Chemins exacts dans chaque description

## Git Workflow (branche epic)

- Créer une **feature branch epic** `001-page-brasserie` depuis `main` avant tout travail.
- Chaque issue est implémentée sur sa propre branche, schéma **plat** (ex. `001-page-brasserie-hero`, pas `001-page-brasserie/T008-hero-section`) — git interdit qu'une référence soit à la fois une branche et le préfixe d'une autre, or la branche epic s'appelle exactement `001-page-brasserie` — et sa **PR cible la branche epic `001-page-brasserie`**, jamais `main` directement.
- La branche epic est mergée vers `main` en une seule PR finale, une fois la Phase 8 (Polish) verte — le gate T029 (confirmation des coordonnées) reste bloquant pour la mise en ligne, pas pour le merge des PRs intermédiaires vers l'epic.
- Gates constitution (build + lint verts, Conventional Commits) : à respecter sur chaque PR vers l'epic ; la relecture visuelle et Lighthouse s'appliquent au moins à la PR finale epic → `main`.

## Path Conventions

Site Astro par features : pages dans `src/pages/`, feature dans `src/features/sibra/{sections,images}/`, composants partagés dans `src/components/`, thèmes dans `src/styles/global.css`.

---

## Phase 0: Décision préalable

- [x] T000 ✅ **Nom d'usage du lieu tranché le 2026-09-18 : « La Sibra »** (research.md R11) — artefacts mis à jour (URL `/la-sibra`, feature `sibra`, thème, `PATH.LA_SIBRA`, libellés, title, JSON-LD `name` + `alternateName`) ; reste à répercuter dans les titres des issues #59–#67 lors de la passe GitHub

## Phase 1: Setup

**Purpose**: Préparer les assets et la constante de route utilisés par toutes les stories.

- [ ] T001 [P] Convertir les 3 photos `brasserie-assets/1000016867.jpg` (boutique), `1000016868.jpg` (salle de brassage), `1000016869.jpg` (bouteilles) en webp optimisés (~1600 px max, qualité ~80, cf. research.md R6) vers `src/features/sibra/images/la-sibra-{boutique,brassage,bouteilles}.webp`
- [ ] T002 [P] Créer le recadrage paysage (cadré sur le comptoir/tonneau de la photo boutique, sans déformation) `src/features/home/images/la-sibra-card.webp` pour la `PlaceCard` de l'accueil (ratio type 800×256, prévoir largeur source ~1280 px pour le retina)
- [ ] T003 [P] Ajouter `LA_SIBRA: '/la-sibra'` à l'objet `PATH` de `src/utils/constants.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Thème, layout et squelette de page — bloquants pour toutes les stories.

**⚠️ CRITICAL**: aucune story ne peut commencer avant la fin de cette phase.

- [ ] T004 Déclarer les 8 couleurs nommées (`--color-sibra-{green,pink,orange,neutral}` + accents — valeurs **exactes** de la charte : vert `oklch(0.6214 0.1490 120.95)`, rose `oklch(0.6469 0.1663 1.60)`, orange `oklch(0.7880 0.1707 69.98)`, accents L −0,10) dans le bloc `@theme` et le mapping `[data-theme='sibra']` (`--theme-primary`=vert, `secondary`=rose, `tertiary`=orange, `quaternary`=neutre + accents) dans `@layer base` de `src/styles/global.css`, selon `contracts/theme.md` ; ne pas modifier les teintes de base — respecter les règles d'usage du contrat (texte courant `foreground` sur fonds bruts, blanc sur `-accent`, jamais de blanc sur orange)
- [ ] T005 [P] Ajouter `'sibra'` à l'union `Props['theme']` de `src/layouts/main.astro` (ligne ~16)
- [ ] T006 Créer la page squelette `src/pages/la-sibra.astro` : `Layout theme="sibra"` avec `content={{ title: 'La Sibra', description }}` (description factuelle provisoire) ; vérifier que `/la-sibra` rend en 200 via `pnpm dev`
- [ ] T007 [P] Déplacer les SVG proposés `specs/001-page-brasserie/assets/sibra-hero-decoration.svg` (motif « bulles », research.md R3-bis) et `sibra-what-ornament.svg` (trois disques) vers `src/features/sibra/images/` ; vérifier qu'ils s'importent comme composants Astro (`import Deco from '../images/….svg'` puis `<Deco class="… text-primary-accent" />`, patron `la-carte-postale-hero-section.astro`) et que `currentColor` prend bien la teinte des classes `text-*-accent`

**Checkpoint**: page vide accessible avec son thème — les stories peuvent démarrer.

---

## Phase 3: User Story 1 - Découvrir la brasserie (Priority: P1) 🎯 MVP

**Goal**: un visiteur comprend immédiatement ce qu'est le lieu, où il est, ce qui distingue sa bière — hero + « c'est quoi ? » + Instagram, avec l'identité visuelle propre.

**Independent Test**: ouvrir `/la-sibra` sans connaître la coopérative et comprendre le lieu, sa localisation (quartier St-Clément) et sa philosophie de brassage sans naviguer ailleurs (spec US1).

### Implementation for User Story 1

- [ ] T008 [US1] Créer `src/features/sibra/sections/sibra-hero-section.astro` (patron `la-carte-postale-hero-section.astro`, `Section class="relative overflow-hidden bg-white"`) : deux décorations `sibra-hero-decoration.svg` (`absolute top-0 left-0 hidden w-[300px] md:block text-secondary-accent` et `absolute bottom-0 right-0 hidden w-[300px] rotate-180 md:block text-primary-accent`) ; au centre, en placeholder du logo pas encore fourni, le motif des trois disques de la charte en SVG inline (`fill="var(--color-tertiary)"`, `var(--color-secondary)`, `var(--color-primary)`, `aria-hidden`) ; nom « La Sibra » en `Heading` + `h1` accroche « De l'houblon à la pression » en `font-pally text-4xl md:text-5xl` (validée, research.md R3) ; le bloc disques + nom est un **placeholder logo** : l'annoter `<!-- TODO logo : remplacer par le logo de La Sibra dès réception -->`
- [ ] T009 [P] [US1] Créer `src/features/sibra/sections/sibra-what-section.astro` (`Section variant="primary"`, patron `la-carte-postale-what-section.astro`) avec le texte source **du 2026-09-18** : accroche « Le tout nouveau lieu de la coopérative ! » (`Text size="xl" weight="semibold" color="white"`), paragraphe de présentation (« Véritable monument du quartier St Clément, la microbrasserie, anciennement Les Bières de Charlotte… chaque gorgée en appelle une autre. ») en texte courant couleur `foreground` (contraste, contrat thème), paragraphe « A l'image du lien entre notre ferme maraîchère et nos restaurants… L'aventure Commun'île y prend tout son sens ! » en `Text font="pally" size="xl" weight="semibold"` (FR-003), photo `sibra-boutique.webp` (`<Image>` responsive, alt FR descriptif), ornement `sibra-what-ornament.svg` (`absolute bottom-0 left-0 text-primary-accent`), et mention « Retrouvez aussi les bières dans les autres lieux de la coopérative et lors des marchés de la ferme des Landes Fertiles ! » avec liens `PATH.*` (FR-007)
- [ ] T010 [P] [US1] Créer `src/features/sibra/sections/sibra-instagram-section.astro` : `InstagramFeed username="bieresdecharlotte"` sur le patron `la-carte-postale-instagram-section.astro` (FR-013)
- [ ] T011 [US1] Assembler hero → what → instagram dans `src/pages/la-sibra.astro` (les sections des phases suivantes s'inséreront entre what et instagram)
- [ ] T012 [US1] **Vérification visuelle mobile (375 px) + desktop (≥ 1280 px)** du hero et du what : les bulles et les trois disques ne chevauchent pas le texte, sont masqués ou repositionnés proprement en mobile (`hidden md:block` si besoin), la palette vert/rose/orange rend bien avec les photos, contrastes conformes au contrat thème (pas de texte courant blanc sur fond brut) — ajuster positions/tailles dans les sections (pas les teintes de base de `global.css`) jusqu'à un rendu soigné

**Checkpoint**: MVP publiable — la page présente le lieu avec son identité propre.

---

## Phase 4: User Story 2 - Préparer sa visite à la boutique (Priority: P2)

**Goal**: horaires exacts (vendredi 16 h–20 h, samedi 11 h–20 h), expérience boutique, adresse et carte.

**Independent Test**: sur la page, trouver en un seul parcours les horaires exacts et la localisation (121 rue du Général Buat, carte) — spec US2, SC-002.

### Implementation for User Story 2

- [ ] T013 [US2] Créer `src/features/sibra/sections/sibra-boutique-section.astro` : horaires proéminents (vendredi 16 h–20 h, samedi 11 h–20 h — source `brasserie-assets/Texte site internet.md`, PAS l'archive) avec l'adresse « au 121 rue du Général Buat » comme dans le texte source, texte dégustation/« bouteilles ouvertes dans le frigo »/échange avec le brasseur (FR-004), photo `sibra-bouteilles.webp` avec alt FR
- [ ] T014 [US2] Géocoder « 121 rue du Général Buat, 44000 Nantes » (vérifier le point sur une carte) puis créer `src/features/sibra/sections/sibra-infos-section.astro` : adresse, repères (églises Saint-Clément/Saint-Donatien, Chronobus C1 « Chanzy »), téléphone `tel:+33633015663`, email `bce.brasserie@gmail.com` (FR-011, valeurs de data-model.md) + `LeafletMap` (center/marker/popup, patron `contact.astro`)
- [ ] T015 [US2] Intégrer boutique + infos pratiques dans `src/pages/la-sibra.astro` (après what) puis **vérification visuelle mobile + desktop** : horaires lisibles sans débordement horizontal à 375 px, carte responsive, décorations de sections bien placées

**Checkpoint**: US1 + US2 fonctionnelles — un visiteur peut préparer sa visite.

---

## Phase 5: User Story 5 - Trouver la page depuis le reste du site (Priority: P2)

**Goal**: la brasserie apparaît dans la navigation (desktop + mobile), l'accueil, le footer, le sitemap et les métadonnées/JSON-LD.

**Independent Test**: depuis l'accueil et n'importe quelle page, atteindre la brasserie en un clic (nav + carte de lieu) ; `/sitemap.xml` liste la page ; JSON-LD valide — spec US5, SC-003.

### Implementation for User Story 5

- [ ] T016 [P] [US5] Ajouter `{ label: 'La Sibra', href: PATH.LA_SIBRA }` en fin de `links` dans `src/components/header.astro`, puis **vérification visuelle** : nav desktop à 7 entrées sur une ligne au breakpoint `xl` (1280 px) sans débordement (sinon réduire `gap`/padding des `NavLink` ; libellé court « La Brasserie » en dernier recours, cf. research.md R7) et menu mobile fonctionnel (edge case spec)
- [ ] T017 [P] [US5] Ajouter le `<li><Link href={PATH.LA_SIBRA}>La Sibra</Link></li>` dans la colonne des lieux de `src/components/footer.astro` (FR-009)
- [ ] T018 [US5] Dans `src/features/home/sections/home-places-section.astro` : ajouter la 6ᵉ `PlaceCard` (image `la-sibra-card.webp`, alt FR descriptif, `tagColor="green"` de préférence — rappel du vert de la charte — ou autre parmi `yellow|red|blue` si illisible sur la photo, horaires boutique dans `hover-content`) et retirer la classe `md:mx-auto md:col-span-2 md:w-1/2` de la carte À La Carte Postale pour une grille 2×3 régulière (research.md R8) ; **vérification visuelle mobile + desktop** de la grille
- [ ] T018b [P] [US5] Dans `src/features/la-carte-postale/sections/la-carte-postale-what-section.astro` (~l. 28), remplacer « C'est le dernier lieu né de la coopérative, … » par « C'est le quatrième restaurant de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! » (FR-015, research.md R10) ; `grep -rn "dernier lieu" src/` pour vérifier qu'aucune autre occurrence ne subsiste
- [ ] T019 [P] [US5] Finaliser le SEO de `src/pages/la-sibra.astro` : description définitive (≤ 160 car. utiles, patron des autres pages), `image` OG = photo du lieu, JSON-LD `@type: 'Brewery'` complet selon `contracts/page-et-seo.md` (`name: 'La Sibra'`, `alternateName: 'Les Bières de Charlotte'`, adresse, geo de T014, horaires ven/sam, telephone, email, sameAs Instagram) ; valider sur https://validator.schema.org (0 erreur, FR-010)
- [ ] T020 [P] [US5] Créer l'endpoint `src/pages/sitemap.xml.ts` : XML listant les 8 pages publiques (routes `PATH` sans ancres `/#` + `/contact`) en URLs absolues sur `SITE_URL`, `Content-Type: application/xml` (research.md R5, contrat page-et-seo.md)
- [ ] T021 [P] [US5] Créer `public/robots.txt` : indexation autorisée + ligne `Sitemap: https://communile.fr/sitemap.xml`

**Checkpoint**: la page a du trafic potentiel — découverte interne (nav/accueil/footer) et externe (SEO) en place.

---

## Phase 6: User Story 3 - Découvrir les bières (Priority: P3)

**Goal**: gamme permanente (Blonde, Ambrée, Triple, Blanche, focus Carlota) et brassins éphémères de Simon.

**Independent Test**: la page distingue clairement gamme permanente et brassins éphémères avec les contenus du texte source — spec US3.

### Implementation for User Story 3

- [ ] T022 [US3] Créer `src/features/sibra/sections/sibra-bieres-section.astro` : deux blocs `InfoCard` (patron `landes-find-section.astro`) — « recettes classiques indémodables » (Blonde, Ambrée, Triple, Blanche ; mise en avant Carlota : recette héritée de Charlotte, inchangée depuis 15 ans) et « brassins éphémères saisonniers » (créativité du brasseur Simon) — + photo `sibra-brassage.webp` avec alt FR ; en pied de section, bloc « Où retrouver nos bières ? » : `Tag` par lieu depuis une constante locale (Le Wattignies → lien `PATH.LE_WATTIGNIES`, `color="primary"` ; L'industrie, Ohmtown, Pioche sans lien — décision du 2026-09-18 —, `color="neutral"`) + « … et bien d'autres » (FR-014, data-model « Lieu revendeur » — aucune entrée inventée) ; intégrer entre boutique et tireuse dans `src/pages/la-sibra.astro` ; **vérification visuelle mobile + desktop** (listes lisibles à 375 px, FR-005)

**Checkpoint**: le contenu « produit » de la page est complet.

---

## Phase 7: User Story 4 - Réserver une tireuse (Priority: P4)

**Goal**: présenter le prêt de tireuse (principe, occasions) et l'action de réservation (téléphone).

**Independent Test**: la page décrit le service et le mode de réservation — spec US4.

### Implementation for User Story 4

- [ ] T023 [US4] Créer `src/features/sibra/sections/sibra-tireuse-section.astro` : principe (prêt pour l'achat d'un fût), occasions (anniversaire, séminaire, week-end entre copaines), CTA « Appelez la brasserie » en lien `tel:+33633015663` (FR-006) ; intégrer avant les infos pratiques dans `src/pages/la-sibra.astro` ; **vérification visuelle mobile + desktop** de la section

**Checkpoint**: tout le contenu fonctionnel de la spec est en place.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: qualité globale, gates constitutionnels et de mise en ligne.

- [ ] T024 **Revue design d'ensemble mobile (375 px) + desktop (≥ 1280 px)** de la page complète et des pages touchées (accueil, header/footer partout, paragraphe Carte Postale) : rythme visuel entre sections, cohérence et placement de toutes les illus/shapes (aucun chevauchement, débordement ou coupure disgracieuse), alternance des variantes de `Section` ; mise côte à côte avec les 5 autres pages de lieux pour confirmer la distinctivité de la palette et la fidélité aux trois couleurs de la charte (SC-005) — ajuster jusqu'à un rendu au niveau des pages existantes
- [ ] T025 [P] Passe accessibilité sur `/la-sibra` : navigation clavier complète, hiérarchie de titres (h1 unique, h2 par section), alt FR sur toutes les images porteuses de sens, contrastes AA sur fonds thémés (FR-012)
- [ ] T026 [P] Lighthouse mobile sur `/la-sibra` vs `/a-la-carte-postale` : perf/a11y/SEO équivalents, poids de page du même ordre (SC-004) — corriger toute régression avant merge (constitution III)
- [ ] T027 `pnpm build` (inclut `astro check`) et `pnpm lint` verts (constitution V)
- [ ] T028 Dérouler `specs/001-page-brasserie/quickstart.md` de bout en bout et cocher chaque vérification
- [ ] T029 🚦 **GATE mise en ligne** : faire confirmer par la coopérative le téléphone, l'email et les repères d'accès (églises, Chronobus C1 « Chanzy ») publiés — issus de l'archive Wayback d'avril 2025 (FR-011, SC-006, constitution I) ; l'adresse et les horaires sont déjà confirmés par le texte source du 2026-09-18 ; corriger la page et le JSON-LD si écart

---

## Dependencies & Execution Order

### Phase Dependencies

- **Décision (Phase 0)**: T000 résolue (« La Sibra ») — plus de bloqueur
- **Setup (Phase 1)**: après T000
- **Foundational (Phase 2)**: après Setup (T004–T007 ; T006 dépend de T003 et T005) — **bloque toutes les stories**
- **User Stories (Phases 3–7)**: après Phase 2, dans l'ordre de priorité P1 → P2 (US2 puis US5) → P3 → P4 ; en parallèle si plusieurs personnes
- **Polish (Phase 8)**: après toutes les stories retenues ; T029 est le seul bloqueur de mise en production (pas de merge)

### User Story Dependencies

- **US1 (P1)**: après Phase 2 uniquement — MVP autonome
- **US2 (P2)**: après Phase 2 ; indépendante de US1 (sections distinctes ; T015 insère dans la page créée en T006)
- **US5 (P2)**: après Phase 2 ; T018 requiert T002 (image card) ; T019 requiert la geo de T014 (sinon la compléter en différé) — testable indépendamment (liens vers la page squelette)
- **US3 (P3) / US4 (P4)**: après Phase 2 ; indépendantes entre elles et des autres

### Within Each User Story

- Sections créées avant intégration dans la page ; intégration avant vérification visuelle
- La vérification visuelle mobile + desktop clôt chaque story (exigence explicite de cette feature)

### Parallel Opportunities

- Phase 1 : T001, T002, T003 en parallèle
- Phase 2 : T005 et T007 en parallèle de T004 ; T006 après T003+T005
- US1 : T009 et T010 en parallèle (T008 aussi — fichiers distincts)
- US5 : T016, T017, T018b, T019, T020, T021 en parallèle ; T018 seul sur home-places-section
- Après Phase 2, les 5 stories peuvent avancer en parallèle (fichiers de sections distincts ; seule `src/pages/la-sibra.astro` est un point de contention — intégrations à sérialiser)
- Phase 8 : T025 et T026 en parallèle

---

## Parallel Example: User Story 1

```bash
# Lancer les 3 sections de US1 en parallèle (fichiers distincts) :
Task: "Créer sibra-hero-section.astro (T008)"
Task: "Créer sibra-what-section.astro (T009)"
Task: "Créer sibra-instagram-section.astro (T010)"
# Puis séquentiellement : T011 (assemblage page) → T012 (vérification visuelle mobile/desktop)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 (Setup) + Phase 2 (Foundational)
2. Phase 3 (US1) : hero + what + instagram
3. **STOP & VALIDATE** : test indépendant US1 + vérification visuelle T012 — page publiable en l'état (sans nav : accessible par URL directe)

### Incremental Delivery

1. Setup + Foundational → page squelette thémée
2. US1 → MVP (le lieu se présente)
3. US2 → visite préparable (horaires + carte)
4. US5 → page découvrable (nav, accueil, footer, SEO/sitemap) — **première livraison qui a du sens en production**
5. US3 → gammes de bières ; US4 → tireuse
6. Polish → gates qualité ; T029 avant mise en ligne

### Parallel Team Strategy

Après la Phase 2 : une personne par story (sections indépendantes) ; sérialiser uniquement les éditions de `src/pages/la-sibra.astro` et la revue design finale (T024) faite par une seule personne pour la cohérence.

---

## Notes

- [P] = fichiers différents, aucune dépendance inachevée
- Chaque story se termine par sa vérification visuelle mobile + desktop (demande utilisateur) ; T024 fait la passe design globale
- Contenu : uniquement le texte source et les faits validés (constitution I) — jamais le texte de l'ancien site archivé
- Commits au format Conventional Commits, par tâche ou groupe logique
- Workflow git : branche epic `001-page-brasserie` ; chaque issue → branche dédiée → PR vers l'epic (cf. section « Git Workflow » ci-dessus)
- S'arrêter à n'importe quel checkpoint pour valider la story indépendamment
