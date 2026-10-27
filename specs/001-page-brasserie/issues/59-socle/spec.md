# Feature Specification: Socle technique La Sibra (issue #59)

**Feature Branch**: `001-page-brasserie-socle`

**Created**: 2026-09-18

**Status**: Draft

**Parent feature**: [`specs/001-page-brasserie/`](../../spec.md) — epic « Page La Sibra ». Les artefacts de l'epic (spec.md, plan.md, research.md, data-model.md, contracts/, tasks.md) font autorité ; ce document ne fait que découper le périmètre de l'issue GitHub #59 (tâches T001–T007) et n'introduit aucune décision contradictoire.

**Input**: Issue GitHub [#59](https://github.com/sylvainDNS/communile.fr/issues/59) — « Socle technique (T001–T007) : assets webp, thème charte La Sibra, page squelette ».

## Contexte

La coopérative Commun'île ouvre un nouveau lieu : **La Sibra**, microbrasserie du quartier Saint-Clément à Nantes (anciennement « Les Bières de Charlotte »). L'epic prévoit une page dédiée `/la-sibra` construite en sept incréments (issues #60–#66) plus un gate de validation (#67). Chacun de ces incréments a besoin d'un socle commun : une route, un thème de couleurs conforme à la charte fournie par la coopérative, des photos exploitables et des décorations vectorielles.

Tant que ce socle n'existe pas, aucune section de contenu ne peut être développée : c'est la phase bloquante de l'epic.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Atteindre la page du lieu (Priority: P1)

Une personne qui reçoit le lien `communile.fr/la-sibra` (bouche-à-oreille, message de la coopérative) ouvre la page et arrive sur une page valide du site Commun'île, cohérente avec le reste du site (en-tête, pied de page, titre d'onglet « La Sibra · Commun'île »), même si le contenu détaillé du lieu n'y est pas encore.

**Why this priority**: sans route servie, rien d'autre n'est démontrable ni testable ; c'est la condition d'existence de toutes les autres issues.

**Independent Test**: ouvrir `/la-sibra` sur le site lancé localement → la page répond, s'affiche sans erreur, l'onglet porte le nom du lieu et la description provisoire est présente dans les métadonnées.

**Acceptance Scenarios**:

1. **Given** le site lancé, **When** un visiteur ouvre `/la-sibra`, **Then** une page du site s'affiche avec l'en-tête et le pied de page communs, sans page d'erreur ni page 404.
2. **Given** la page ouverte, **When** on inspecte le titre de l'onglet et la description, **Then** ils annoncent « La Sibra » et une description factuelle provisoire du lieu.
3. **Given** un lien interne construit à partir des constantes de routes du site, **When** un futur écran référence le lieu, **Then** la route de La Sibra est disponible dans ces constantes (aucune URL écrite en dur ailleurs).

---

### User Story 2 - Reconnaître l'identité visuelle du lieu (Priority: P1)

Un visiteur (et la coopérative en relecture) doit percevoir que la page appartient à La Sibra : les couleurs de la charte du lieu (vert olive, rose, orange) s'appliquent à la page, distinctes des identités des cinq autres lieux du site.

**Why this priority**: la palette conditionne tout le travail visuel des sections suivantes ; l'introduire après coup obligerait à reprendre chaque section.

**Independent Test**: ouvrir `/la-sibra` et vérifier que les éléments thémés (fonds, textes de couleur, badges) prennent les couleurs de la charte, alors que les autres pages conservent les leurs.

**Acceptance Scenarios**:

1. **Given** la page de La Sibra, **When** un élément utilise la couleur principale du thème, **Then** il affiche le vert olive de la charte (`#7A9300`), la secondaire le rose (`#DC5B87`), la tertiaire l'orange (`#FEA300`).
2. **Given** une autre page du site (Wattignies, Bar'Île…), **When** on l'ouvre après La Sibra, **Then** son thème est inchangé.
3. **Given** un texte posé sur un fond de la charte, **When** on mesure le contraste, **Then** les règles d'usage documentées sont respectées : pas de texte blanc courant sur les fonds bruts vert/rose, jamais de texte blanc sur l'orange.

---

### User Story 3 - Disposer des visuels du lieu (Priority: P2)

Les personnes qui développeront les sections de contenu (issues #60–#66) ont besoin des trois photos du lieu et des deux décorations vectorielles, déjà optimisées et rangées à leur emplacement définitif, pour les intégrer sans refaire de traitement d'image.

**Why this priority**: sans les assets prêts, chaque section rejouerait la conversion des photos, avec des résultats hétérogènes et un risque de pages lourdes.

**Independent Test**: lister le dossier d'images de la feature → les trois photos au format web moderne et les deux décorations vectorielles sont présentes, à un poids compatible avec une page légère ; une décoration utilisée dans une page prend bien la couleur du thème.

**Acceptance Scenarios**:

1. **Given** les trois photos sources haute résolution fournies par la coopérative, **When** on consulte les fichiers livrés, **Then** chacune existe en version web optimisée (~1600 px de large maximum, qualité visuelle préservée) sous un nom explicite (boutique, brassage, bouteilles).
2. **Given** la future carte du lieu sur la page d'accueil, **When** on consulte l'image dédiée, **Then** il existe un recadrage **paysage** (≈ 800 × 256, source ≈ 1280 px de large) cadré sur le comptoir / tonneau, **sans déformation** du sujet.
3. **Given** une décoration vectorielle placée dans une page avec une classe de couleur du thème, **When** la page s'affiche, **Then** la décoration prend la teinte demandée (elle hérite de la couleur du texte).

---

### Edge Cases

- **Photos sources absentes du dépôt** : les originaux vivent hors versionnement (dossier ignoré par git) ; seuls les fichiers dérivés entrent dans le code. Une nouvelle personne clonant le dépôt doit obtenir un build vert sans posséder les originaux.
- **Portrait → paysage** : la photo boutique est en portrait (3472 × 4624) ; le recadrage paysage doit couper, pas étirer.
- **Contraste sur l'orange** : l'orange de la charte est trop clair pour porter du texte blanc (2,0:1). Aucun composant rendant du blanc sur fond tertiaire ne doit être introduit sur cette page.
- **Page volontairement vide** : la page squelette n'a pas encore de contenu ; elle doit malgré tout être valide, indexable et ne pas provoquer d'erreur de build.
- **Collision de noms** : le site compte déjà cinq thèmes et six lieux ; l'identifiant du nouveau thème et les noms de fichiers ne doivent entrer en collision avec aucun existant.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le site DOIT exposer la route publique `/la-sibra`, servie en 200 et indexable.
- **FR-002**: La route DOIT être déclarée dans les constantes de routes partagées du site sous la clé `LA_SIBRA`, afin que les écrans suivants (navigation, pied de page, accueil, sitemap) la référencent sans URL en dur.
- **FR-003**: La page DOIT porter le titre « La Sibra » et une description factuelle provisoire (lieu, quartier, statut d'ancienne brasserie Les Bières de Charlotte), remplaçable en issue #64 (SEO définitif).
- **FR-004**: Le site DOIT définir un thème nommé `sibra` déclarant huit couleurs (vert, rose, orange, neutre, chacune avec son accent) aux **valeurs exactes de la charte** : vert `oklch(0.6214 0.1490 120.95)`, rose `oklch(0.6469 0.1663 1.60)`, orange `oklch(0.7880 0.1707 69.98)`, neutre `oklch(0.1292 0.0415 265.15)` ; les accents dérivent de la même teinte avec une luminance abaissée de 0,10 (neutre-accent `oklch(0.0501 0.0086 264.05)`, aligné sur les autres thèmes).
- **FR-005**: Le thème `sibra` DOIT mapper vert → primaire, rose → secondaire, orange → tertiaire, neutre → quaternaire (et leurs accents), en suivant exactement la mécanique des cinq thèmes existants, sans modifier ces derniers.
- **FR-006**: Le typage du layout DOIT accepter `sibra` comme valeur de thème, de sorte que la page squelette passe la vérification de types.
- **FR-007**: Les trois photos du lieu DOIVENT être livrées en format web moderne optimisé (largeur max ≈ 1600 px, qualité ≈ 80) dans le dossier d'images de la feature, nommées `sibra-boutique`, `sibra-brassage`, `sibra-bouteilles`.
- **FR-008**: Une image paysage dédiée à la carte du lieu sur l'accueil DOIT être livrée dans le dossier d'images de la feature « accueil », nommée `la-sibra-card`, recadrée (non déformée) sur le comptoir / tonneau, ratio ≈ 800 × 256 pour une largeur source ≈ 1280 px.
- **FR-009**: Les deux décorations vectorielles proposées (`sibra-hero-decoration`, motif « bulles » ; `sibra-what-ornament`, trois disques) DOIVENT être versionnées dans le dossier d'images de la feature et DOIVENT se colorer via la couleur de texte héritée, afin d'être teintées par les classes d'accent du thème.
- **FR-010**: Le nommage DOIT suivre la convention de l'epic (research.md R1) : article **uniquement** pour ce qui dérive de l'URL (`/la-sibra`, `PATH.LA_SIBRA`, `la-sibra.astro`, `la-sibra-card.webp`) ; **sans article** ailleurs (dossier de feature `sibra/`, préfixes `sibra-*`, identifiant de thème `sibra`, tokens `--color-sibra-*`).
- **FR-011**: Les règles de contraste du contrat de thème DOIVENT être documentées et respectées par les composants introduits ici : texte courant en couleur de premier plan sur fonds bruts, blanc réservé au grand texte sur vert/rose et au texte courant sur les accents, jamais de blanc sur orange.
- **FR-012**: Seuls les fichiers dérivés entrent dans le dépôt ; les originaux (photos sources, propositions de SVG hors `src/`) restent hors versionnement.

### Non-Goals (hors périmètre de cette issue)

- Toute section de contenu de la page (hero, « c'est quoi ? », boutique, bières, tireuse, infos pratiques, Instagram) — issues #60 à #63 et #65.
- Entrées de navigation, pied de page, carte sur l'accueil, sitemap, robots.txt, JSON-LD définitif — issues #64 et #66.
- Choix ou intégration du logo de La Sibra (non fourni à ce jour).
- Confirmation des coordonnées du lieu (téléphone, email) — gate #67.

### Key Entities

- **Route du lieu** : identifiant symbolique `LA_SIBRA` → chemin `/la-sibra`, consommé par tous les écrans qui pointent vers le lieu.
- **Thème `sibra`** : jeu de huit couleurs nommées + mapping sémantique (primaire / secondaire / tertiaire / quaternaire et accents), activé par la page via son layout.
- **Asset photo** : image dérivée d'une photo source, caractérisée par son sujet (boutique, brassage, bouteilles), sa largeur cible et sa destination (page du lieu ou carte d'accueil).
- **Décoration vectorielle** : forme colorable par héritage de la couleur de texte, caractérisée par son motif (bulles du hero, trois disques) et l'accent de thème qui la teinte.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visiteur qui ouvre `/la-sibra` obtient une page du site valide (200), avec l'en-tête, le pied de page et le titre du lieu — 0 erreur de console au chargement.
- **SC-002**: Les couleurs affichées sur `/la-sibra` correspondent exactement aux trois couleurs de la charte de la coopérative (vérification par prélèvement de couleur : `#7A9300`, `#DC5B87`, `#FEA300`), et aucune des cinq autres pages de lieu ne change d'apparence.
- **SC-003**: Les quatre images livrées pèsent chacune moins de 300 Ko et restent nettes à leur taille d'affichage ; l'image de carte d'accueil respecte un ratio paysage ≈ 3,1:1 sans sujet déformé.
- **SC-004**: Les deux décorations vectorielles, insérées à titre de vérification avec une classe d'accent, s'affichent dans la teinte attendue.
- **SC-005**: Les contrôles automatisés du dépôt (vérification de types + build, lint) passent sans erreur ni avertissement nouveau.
- **SC-006**: Une personne reprenant le dépôt à partir d'un clone neuf, sans les photos originales, obtient un build vert.

## Assumptions

- Les trois photos sources fournies (`1000016867.jpg` boutique, `1000016868.jpg` salle de brassage, `1000016869.jpg` bouteilles) sont celles retenues par la coopérative et n'ont pas besoin de retouche colorimétrique.
- La description de la page est **provisoire** à ce stade ; sa version définitive (≤ 160 caractères utiles) est produite par l'issue SEO (#64), de même que l'image Open Graph et le JSON-LD.
- Le logo de La Sibra n'étant pas fourni, aucune image de logo n'est intégrée ici ; le placeholder « trois disques » est du ressort de l'issue #60 (hero).
- Les valeurs de la charte sont considérées comme mesurées et exactes : elles ne sont pas « ajustées » pour améliorer les contrastes ; le contrat de thème documente à la place des règles d'usage.
- La branche de travail est `001-page-brasserie-socle` (et non `001-page-brasserie/socle`) : git interdit qu'une référence soit à la fois une branche et le préfixe d'une autre, or la branche epic s'appelle exactement `001-page-brasserie`. La PR cible la branche epic, jamais `main`.
- Le dossier des photos sources et le dossier des SVG proposés restent volontairement hors versionnement ; la convention du projet veut qu'une image entre dans git au moment où le code l'utilise.
