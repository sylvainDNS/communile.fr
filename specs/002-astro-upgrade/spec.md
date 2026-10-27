# Feature Specification: Mise à jour d'Astro et de son écosystème

**Feature Branch**: `002-astro-upgrade`

**Created**: 2026-09-26

**Status**: Draft

**Input**: User description: "mise à jour d'astro (et libs liées) à la dernière version à jour"

## Contexte

Le site repose sur un framework de génération de pages et sur un ensemble de
bibliothèques associées (adaptateur d'hébergement, vérification de types,
sitemap, outillage de lint/formatage spécifique au framework). Ces dépendances
accusent un retard important : le framework est deux versions majeures
derrière la dernière version stable publiée, l'adaptateur d'hébergement aussi.
Rester sur des versions anciennes expose à la fin du support (correctifs de
sécurité), à l'incompatibilité avec l'outillage récent et à un coût de
rattrapage croissant.

Cette évolution est une opération de maintenance : elle ne DOIT rien changer
de ce que voit un visiteur.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Le visiteur ne voit aucune différence (Priority: P1)

Un visiteur du site parcourt les pages publiques (accueil, lieux, contact,
page 404) après la mise à jour. Il retrouve exactement le même contenu, la même
mise en page, les mêmes images et les mêmes interactions (carte, animations)
qu'avant, sur mobile comme sur desktop.

**Why this priority**: c'est la garantie de non-régression ; une mise à jour
qui casse le site public n'a aucune valeur.

**Independent Test**: comparer chaque page publique avant/après la mise à jour
(captures mobile et desktop, parcours des interactions) sur un environnement de
prévisualisation.

**Acceptance Scenarios**:

1. **Given** le site mis à jour déployé en prévisualisation, **When** un visiteur ouvre chacune des pages publiques, **Then** le contenu, la mise en page et les images sont identiques à la version de production actuelle.
2. **Given** une page comportant une carte interactive ou des animations, **When** le visiteur interagit avec, **Then** le comportement est identique à la version actuelle.
3. **Given** une URL inexistante, **When** le visiteur la demande, **Then** la page 404 personnalisée s'affiche comme aujourd'hui.

---

### User Story 2 - Le mainteneur construit et déploie sans friction (Priority: P1)

Le mainteneur installe le projet, lance le serveur de développement, construit
le site et le déploie sur l'hébergeur actuel avec les mêmes commandes
qu'aujourd'hui. Les contrôles qualité (vérification de types, lint) passent
sans erreur ni avertissement de dépréciation lié à la mise à jour.

**Why this priority**: sans build ni déploiement fonctionnels, la
non-régression visiteur ne peut pas atteindre la production.

**Independent Test**: depuis une installation propre, exécuter installation,
développement local, build, lint et déploiement de prévisualisation ; tous
réussissent.

**Acceptance Scenarios**:

1. **Given** un clone propre du dépôt, **When** le mainteneur installe les dépendances et lance le build, **Then** le build réussit, vérification de types incluse.
2. **Given** le projet installé, **When** le mainteneur lance le lint, **Then** il passe sans erreur.
3. **Given** le build produit, **When** il est déployé sur l'hébergeur actuel, **Then** le site est servi sous le même domaine, avec les mêmes URLs.
4. **Given** le serveur de développement lancé, **When** le mainteneur modifie une page, **Then** la modification apparaît en local comme aujourd'hui.

---

### User Story 3 - Les versions sont à jour et le socle documenté (Priority: P2)

Après la mise à jour, le framework et les bibliothèques liées sont à leur
dernière version stable publiée à la date de réalisation. La documentation de
référence du projet (constitution, contraintes techniques) mentionne les
nouvelles versions majeures et prérequis d'environnement.

**Why this priority**: c'est l'objectif explicite de la demande, mais il n'a
de valeur que si P1 est garanti.

**Independent Test**: lister les dépendances du périmètre et vérifier qu'aucune
n'a de version stable plus récente disponible ; relire la constitution.

**Acceptance Scenarios**:

1. **Given** la mise à jour terminée, **When** on liste les dépendances obsolètes du périmètre, **Then** aucune n'apparaît.
2. **Given** la constitution du projet, **When** on lit la section stack, **Then** elle cite la version majeure effectivement utilisée.

---

### Edge Cases

- Une bibliothèque liée n'a pas encore publié de version compatible avec la dernière version du framework : on retient la plus récente version compatible et on documente l'écart.
- La nouvelle version de l'adaptateur d'hébergement impose un changement de mode de déploiement chez le même hébergeur (ex. changement de produit ou de format de configuration) : la migration est incluse tant que le domaine, les URLs et l'hébergeur restent identiques.
- La nouvelle version du framework exige une version d'environnement d'exécution plus récente que celle déclarée : le prérequis du projet est relevé et documenté.
- Une API utilisée par le site (optimisation d'images, rendu des pages, configuration) est supprimée ou renommée : le code est adapté pour conserver un rendu identique.
- La dernière version majeure du vérificateur de types n'est pas encore prise en charge par l'outil de vérification du framework : on retient la plus récente version prise en charge et on documente l'écart (FR-012).
- Une dépendance incluse exige une version plus récente d'une dépendance exclue (ex. plugin de lint du framework exigeant un linter plus récent) : la dépendance exclue est montée au minimum requis et l'écart est documenté.
- Le changement d'outillage de lint/formatage fait apparaître de nouvelles règles : le code est mis en conformité ou les règles sont explicitement ajustées, sans modification du rendu.
- Un travail en cours sur une autre branche (page brasserie) devra être rebasé sur le socle mis à jour : les conflits prévisibles sont signalés.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le framework du site DOIT être mis à jour vers sa dernière version stable publiée à la date de réalisation.
- **FR-002**: Les bibliothèques liées au framework, la bibliothèque de styles et le vérificateur de types (voir Périmètre) DOIVENT être mises à jour vers leur dernière version stable compatible.
- **FR-003**: Toutes les pages publiques existantes DOIVENT rester accessibles aux mêmes URLs, avec un contenu et un rendu visuel identiques.
- **FR-004**: Les images DOIVENT être servies de façon identique à la référence : mêmes formats, mêmes dimensions déclarées, poids de page ≤ +5 % (SC-003).
- **FR-005**: Les interactions existantes (carte, animations, navigation) DOIVENT fonctionner à l'identique.
- **FR-006**: Les métadonnées SEO existantes (titres, descriptions, données structurées) DOIVENT être préservées à l'identique.
- **FR-007**: Le build complet, vérification de types incluse, et le lint DOIVENT passer sans erreur.
- **FR-008**: Le site DOIT rester déployable sur l'hébergeur actuel, sous le même domaine.
- **FR-009**: Les commandes de travail du mainteneur (installation, développement, build, prévisualisation, lint) DOIVENT rester les mêmes.
- **FR-010**: Les prérequis d'environnement (version minimale de l'environnement d'exécution, du gestionnaire de paquets) DOIVENT être mis à jour dans le projet s'ils changent.
- **FR-011**: La constitution DOIT être amendée pour refléter la nouvelle version majeure du framework.
- **FR-012**: Toute bibliothèque du périmètre qui ne peut pas atteindre sa dernière version DOIT faire l'objet d'une justification écrite (raison, version retenue).
- **FR-013**: Aucune nouvelle fonctionnalité visible ni nouvelle dépendance non nécessaire à la mise à jour ne DOIT être introduite.

### Périmètre

- **Inclus** :
  - écosystème Astro : `astro`, `@astrojs/check`, `@astrojs/cloudflare`, `@astrojs/sitemap`, `eslint-plugin-astro`, `prettier-plugin-astro` ;
  - Tailwind CSS : `tailwindcss`, `@tailwindcss/vite`, `prettier-plugin-tailwindcss` ;
  - TypeScript : `typescript`.
- **Exclu** : `eslint`, `@antfu/eslint-config`, `eslint-plugin-format`, `animejs`, `leaflet`, `tailwind-merge`, `class-variance-authority`, `clsx` — sauf si une dépendance incluse impose leur montée de version (cas documenté, FR-012) ; refonte visuelle, ajout de pages ou de fonctionnalités, changement d'hébergeur.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % des pages publiques existantes (8 pages) s'affichent à l'identique avant/après, vérifié par comparaison visuelle mobile et desktop.
- **SC-002**: 0 erreur au build, à la vérification de types et au lint.
- **SC-003**: Le poids total de chaque page publique n'augmente pas de plus de 5 %.
- **SC-004**: Les scores de performance, accessibilité et SEO mesurés par audit sur chaque page publique ne baissent pas de plus de 2 points.
- **SC-005**: 0 dépendance du périmètre signalée comme ayant une version stable plus récente disponible, hors exceptions justifiées (FR-012).
- **SC-006**: Le site mis à jour est en ligne en production sans interruption de service perceptible par les visiteurs.

## Assumptions

- « Dernière version à jour » = dernière version stable publiée (pas de version bêta ni release candidate) à la date de réalisation.
- La mise à jour saute potentiellement plusieurs versions majeures du framework : les guides de migration de chaque version intermédiaire sont suivis.
- L'hébergeur reste Cloudflare (constitution) ; un changement de produit ou de configuration chez Cloudflare imposé par l'adaptateur est acceptable s'il préserve domaine et URLs.
- L'intégration sitemap, déclarée comme dépendance mais aujourd'hui non branchée dans la configuration, est mise à jour sans changer son état d'activation (son activation relève d'une autre évolution).
- La version de référence avant/après est la production actuelle (branche `main`).
- La page brasserie en cours sur l'epic `001-page-brasserie` n'est pas dans le périmètre de vérification ; elle sera rebasée sur le nouveau socle ultérieurement.
- La migration vers pnpm 12 est mergée sur `main` (2026-09-26) : cette évolution part de ce socle.
