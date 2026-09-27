# Feature Specification: Polish final de l'epic « page La Sibra »

**Feature Branch**: `001-page-brasserie-polish`

**Created**: 2026-09-20

**Status**: Draft

**Issue**: [#66](https://github.com/sylvainDNS/communile.fr/issues/66) — Polish (T024–T028)

**Input**: Revue design globale mobile/desktop, passe a11y WCAG 2.1 AA, Lighthouse, gates build/lint, déroulé du quickstart — dernière issue technique de l'epic `001-page-brasserie`.

## Contexte

Les sept stories de l'epic sont mergées (#59 socle, #60 hero/what/instagram, #61 boutique/horaires/infos+carte,
#62 header/footer/accueil/Carte Postale, #63 JSON-LD/sitemap/robots, #64 bières, #65 tireuse). Chaque story a
été validée isolément ; aucune revue d'ensemble n'a eu lieu. Les revues successives ont consigné des dettes
dont plusieurs touchent des composants partagés déjà en production sur les cinq autres pages de lieux.

Cette issue est une passe de **qualité et de véracité**, pas d'ajout de fonctionnalité. Deux natures de travail
s'y mêlent et doivent rester distinguées :

1. le **rendu** du site (design, a11y, performance) ;
2. la **documentation de référence** de l'epic (`contracts/theme.md`, `research.md`), qui contient des
   affirmations démontrées fausses et guiderait à tort toute décision future.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Une visiteuse malvoyante lit la page sans obstacle (Priority: P1)

Une visiteuse qui utilise un fort grossissement, un lecteur d'écran ou qui navigue exclusivement au clavier
ouvre `/la-sibra`, parcourt les sept sections, atteint la carte et en ressort sans piège au clavier, avec tous
les textes lisibles.

**Why this priority**: c'est l'exigence constitutionnelle IV et l'objet de T025 ; c'est aussi la seule dette
qui produit aujourd'hui du contenu **non conforme AA** en production sur six pages.

**Independent Test**: parcours clavier complet de `/la-sibra` puis des cinq autres pages de lieux, mesure des
ratios de contraste au navigateur sur chaque texte posé sur fond thémé, inspection de l'arbre d'accessibilité.

**Acceptance Scenarios**:

1. **Given** `/la-sibra` ouverte, **When** on parcourt la page uniquement à la touche Tab, **Then** chaque
   élément focusable porte un nom accessible et un indicateur de focus visible, et le focus ne reste jamais
   piégé dans la carte.
2. **Given** n'importe quelle page de lieu, **When** la carte Leaflet ne parvient pas à charger, **Then** le
   message de repli est lisible à un contraste ≥ 4,5:1.
3. **Given** `/la-sibra`, **When** on inspecte la structure, **Then** il y a exactement un `h1` et chaque
   section porte un `h2`, sans saut de niveau.
4. **Given** n'importe quel texte courant de `/la-sibra`, **When** on mesure son contraste sur son fond réel,
   **Then** le ratio est ≥ 4,5:1 (≥ 3:1 pour le grand texte au sens WCAG).

---

### User Story 2 - La documentation de l'epic dit la vérité (Priority: P1)

Une personne qui reprendra le thème « sibra » ou ce dossier de specs lit `contracts/theme.md` et `research.md`
et n'y trouve que des affirmations vérifiables.

**Why this priority**: le contrat de thème autorise aujourd'hui explicitement une combinaison **non conforme
AA** (texte blanc en grand texte sur `tertiary-accent`, annoncé 3,0:1, réel 2,88:1). Un document faux est pire
qu'un document absent : il fait prendre la mauvaise décision avec confiance. Même priorité que US1 parce que
c'est la cause racine des erreurs de contraste.

**Independent Test**: recalcul indépendant de chaque ratio du tableau à partir des valeurs `oklch` réellement
présentes dans `src/styles/global.css`, et confrontation de R5/R7 aux mesures.

**Acceptance Scenarios**:

1. **Given** le tableau de contrastes de `contracts/theme.md`, **When** on recalcule chaque cellule depuis les
   tokens `oklch` du dépôt, **Then** chaque valeur affichée correspond à la mesure à ±0,05 près.
2. **Given** une combinaison dont le ratio réel est sous le seuil AA applicable, **When** on lit le contrat,
   **Then** elle est explicitement listée comme interdite, et non comme autorisée.
3. **Given** `research.md`, **When** on lit R5 et R7, **Then** leur conclusion correspond à ce qui a été
   effectivement mesuré, ou l'entrée porte une correction datée.

---

### User Story 3 - La page tient le rythme visuel des cinq autres (Priority: P2)

Une visiteuse qui connaît déjà le site ouvre `/la-sibra` à 375 px puis à 1280 px : la page se lit comme les
autres pages de lieux, sans débordement horizontal, sans illustration coupée ou chevauchant du texte, avec une
palette immédiatement distincte des cinq autres.

**Why this priority**: c'est T024. La valeur est réelle mais l'écart constaté est esthétique, non bloquant
pour l'usage ; la section « bières » (#64) n'a jamais été regardée dans un navigateur et concentre le risque.

**Independent Test**: captures à 375 px (émulation d'appareil) et ≥ 1280 px des huit pages publiques, mise
côte à côte, mesure de `scrollWidth` vs `clientWidth` sur chacune.

**Acceptance Scenarios**:

1. **Given** chacune des huit pages publiques, **When** on mesure la largeur de défilement à 375 px et à
   1280 px, **Then** `document.documentElement.scrollWidth` ne dépasse pas la largeur du viewport.
2. **Given** `/la-sibra` à 375 px, **When** on parcourt les sept sections, **Then** aucune illustration
   décorative ne chevauche un texte ni n'est coupée de façon disgracieuse.
3. **Given** `/la-sibra` posée à côté des cinq autres pages de lieux, **When** on compare les palettes,
   **Then** le vert olive et le rose de la charte la rendent non confondable.

---

### User Story 4 - Rien n'a régressé (Priority: P2)

La personne qui mergera l'epic sur `main` dispose de gates verts et d'une mesure de performance comparée.

**Why this priority**: T026/T027/T028. C'est la condition de sortie de l'epic, mais elle se vérifie en fin de
parcours et ne produit de valeur que si US1–US3 sont faites.

**Independent Test**: lancer les gates sur le dépôt entier et un audit Lighthouse mobile sur les deux pages.

**Acceptance Scenarios**:

1. **Given** le dépôt complet, **When** on lance le lint, la vérification de types et le build, **Then** les
   trois sortent en exit 0.
2. **Given** `/la-sibra` et `/a-la-carte-postale`, **When** on les audite en conditions mobiles, **Then** les
   scores performance, accessibilité et SEO de `/la-sibra` sont au moins équivalents.
3. **Given** `specs/001-page-brasserie/quickstart.md`, **When** on le déroule de bout en bout, **Then** chaque
   vérification passe ou porte une note expliquant pourquoi elle est hors de portée.

---

### Edge Cases

- **La carte ne charge pas** (réseau coupé, CDN Leaflet bloqué) : le panneau de repli doit rester lisible.
  C'est précisément le cas où le contraste compte le plus, et c'est aujourd'hui le texte le moins contrasté
  de la page.
- **Corriger un composant partagé** : `leaflet-map`, `Tag`, `Card`, `Text` servent les huit pages. Toute
  correction à la source doit être vérifiée sur les six pages de lieux, pas seulement sur `/la-sibra`.
- **Le texte courant du site fait 18 px, pas 16 px** : `Text size="base"` émet deux classes de taille
  concurrentes. Toute « correction » qui ramènerait le texte à 16 px changerait le rendu des huit pages :
  la correction doit être neutre au rendu.
- **Gate #67 encore fermé** : téléphone et email restent non confirmés. Aucune correction de polish ne doit
  les réintroduire, même sous prétexte de complétude (un CTA « appelez-nous » sans lien `tel:` est le
  comportement attendu, pas un oubli).
- **Débordement préexistant à l'accueil** : 27 px à 1280 px, mesurés avant l'epic. Il n'a pas été introduit
  par la page La Sibra mais l'accueil fait partie des pages touchées par T024.

## Requirements *(mandatory)*

### Functional Requirements

#### Véracité de la documentation (US2)

- **FR-001**: Le tableau de contrastes de `contracts/theme.md` DOIT afficher, pour chaque couple fond/texte,
  la valeur recalculée depuis les tokens `oklch` du dépôt, et non une valeur estimée.
- **FR-002**: Le contrat DOIT interdire explicitement le texte blanc sur `tertiary-accent`, y compris en grand
  texte (2,88:1 < 3:1).
- **FR-003**: Le contrat DOIT interdire explicitement `text-foreground` en texte courant sur `primary-accent`
  et sur `secondary-accent` (3,77:1 et 3,67:1 < 4,5:1), combinaisons aujourd'hui non documentées.
- **FR-004**: Le contrat DOIT documenter le ratio réel de `Tag color="tertiary"` et de `Tag color="primary"`
  et dire si ces variantes sont utilisables telles quelles.
- **FR-005**: Les entrées R5 et R7 de `specs/001-page-brasserie/research.md` DOIVENT être corrigées ou
  annotées pour refléter ce qui a été mesuré.
- **FR-006**: Toute valeur de contraste publiée dans un artefact de specs DOIT être accompagnée de la méthode
  de calcul, pour être rejouable.

#### Accessibilité du rendu (US1)

- **FR-007**: Le panneau d'erreur de `leaflet-map` DOIT atteindre un contraste ≥ 4,5:1.
- **FR-008**: Le conteneur de carte DOIT exposer un rôle et un nom accessible (WCAG 4.1.2).
- **FR-009**: Chaque marqueur de carte DOIT porter un nom accessible en français.
- **FR-010**: `/la-sibra` DOIT présenter exactement un `h1` et un `h2` par section, sans saut de niveau.
- **FR-011**: Toute image porteuse de sens DOIT avoir un `alt` français descriptif ; toute image décorative
  DOIT être masquée de l'arbre d'accessibilité.
- **FR-012**: Aucun texte courant de `/la-sibra` NE DOIT être sous 4,5:1, aucun grand texte sous 3:1.
- **FR-013**: Le parcours clavier des huit pages publiques DOIT être complet et sans piège.
- **FR-014**: Les corrections portées sur un composant partagé NE DOIVENT introduire aucune régression
  visuelle sur les cinq autres pages de lieux ni sur l'accueil.

#### Design d'ensemble (US3)

- **FR-015**: Aucune des huit pages publiques NE DOIT présenter de débordement horizontal à 375 px ni à
  1280 px.
- **FR-016**: Les illustrations et formes décoratives de `/la-sibra` NE DOIVENT ni chevaucher un texte ni être
  coupées de façon disgracieuse, aux deux largeurs de référence.
- **FR-017**: La section « bières », jamais vérifiée dans un navigateur, DOIT faire l'objet d'une vérification
  visuelle explicite aux deux largeurs.
- **FR-018**: La palette de `/la-sibra` DOIT rester fidèle aux trois couleurs de la charte et rester
  distinguable des cinq autres thèmes.

#### Gates et non-régression (US4)

- **FR-019**: Lint, vérification de types et build DOIVENT sortir en exit 0 **sur le dépôt entier**, artefacts
  de specs compris (les blocs de code des fichiers Markdown sont lintés).
- **FR-020**: `/la-sibra` NE DOIT pas régresser face à `/a-la-carte-postale` en performance, accessibilité,
  SEO ni en poids de page.
- **FR-021**: Le quickstart de l'epic DOIT être déroulé et chaque point tracé.
- **FR-022**: Aucun numéro de téléphone ni adresse email non confirmés NE DOIT être publié ; le gate #67
  reste fermé.

### Key Entities

- **Contrat de thème** (`contracts/theme.md`) : la référence normative des couleurs et de leurs usages
  autorisés pour l'epic. Son tableau de contrastes est ce que les implémenteurs consultent avant de poser une
  couleur de texte.
- **Composant partagé** : `leaflet-map`, `Tag`, `Card`, `InfoCard`, `Text`. Rayon d'impact = les huit pages
  publiques. Toute modification est un changement transverse, pas un changement de page.
- **Page de lieu** : `/la-sibra` et les cinq pages existantes, qui partagent structure, composants et grille
  mais se distinguent par leur thème.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zéro combinaison texte/fond sous son seuil WCAG AA sur les huit pages publiques, mesurée au
  navigateur et non estimée.
- **SC-002**: Zéro écart entre une valeur de contraste publiée dans les specs de l'epic et sa mesure
  (tolérance ±0,05).
- **SC-003**: Zéro débordement horizontal sur les huit pages publiques, à 375 px et à 1280 px.
- **SC-004**: `/la-sibra` obtient des scores Lighthouse mobile au moins égaux à ceux de
  `/a-la-carte-postale` sur performance, accessibilité et SEO.
- **SC-005**: Les trois gates (lint, types, build) passent sur le dépôt entier.
- **SC-006**: Chaque dette héritée des issues #59–#65 est soit corrigée, soit explicitement laissée avec sa
  raison écrite — aucune n'est passée sous silence.

## Assumptions

- Les trois couleurs de la charte sont **imposées** et ne peuvent pas être ajustées pour gagner du contraste.
  Les corrections de contraste passent donc par le choix de la couleur de **texte** et par les variantes
  `-accent`, jamais par la retouche des couleurs de marque.
- Les seuils retenus sont ceux de WCAG 2.1 AA : 4,5:1 en texte courant, 3:1 pour le grand texte (≥ 24 px, ou
  ≥ 18,66 px en graisse 700 — la graisse 600 ne qualifie pas).
- Firefox est indisponible sur le poste de vérification ; les mesures navigateur sont faites sous Chrome. Le
  vrai 375 px s'obtient par émulation d'appareil, l'outil de redimensionnement se clampant à 500 px.
- Le rendu actuel du texte courant (18 px) est le rendu voulu : la correction de `Text size="base"` doit être
  neutre au pixel près.
- Les dettes purement structurelles dont la correction régresserait le rendu des huit pages (fond des cartes
  sans bordure, sémantique `<article>` systématique) relèvent d'un lot de refonte du design system, pas de
  cette passe de polish. Elles sont documentées, pas corrigées.
- La notation des horaires (« 16h00 - 20h00 » vs « 16 h – 20 h ») est une décision **éditoriale** de la
  coopérative portant sur les six cartes de lieux : elle est signalée, pas tranchée ici.
- La dépendance `@astrojs/sitemap` déclarée sans être utilisée n'est pas retirée dans cette passe : la retirer
  modifie le lockfile, que la CI installe en `--frozen-lockfile`, pour un gain nul sur les critères de succès.
- Le périmètre s'arrête à une PR verte vers la branche epic `001-page-brasserie`. Le merge de l'epic vers
  `main` et la levée du gate #67 restent des décisions humaines.
