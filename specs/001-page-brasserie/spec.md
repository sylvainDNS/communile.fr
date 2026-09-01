# Feature Specification: Page « Les Bières de Charlotte »

**Feature Branch**: `001-page-brasserie`

**Created**: 2026-09-01

**Status**: Draft

**Input**: User description: "Création d'une nouvelle page pour un nouveau lieu (une brasserie de bière). Pas de designeuse pour faire des maquettes : s'inspirer de toutes les pages existantes pour en créer une nouvelle, avec une palette de couleurs qui lui sera propre (comme les autres pages). Ressources fournies : contenu texte + 3 photos dans `brasserie-assets/`. À l'issue de cette session, découpage en tâches pour créer diverses issues (pas d'implémentation dans cette session)."

## Vue d'ensemble

Commun'ile ouvre un nouveau lieu : la microbrasserie **Les Bières de Charlotte** (121 rue du Général Buat, quartier Saint-Clément, Nantes), rachetée par la coopérative. La brasserie existait avant le rachat (14 ans de brassage) et conserve son nom, ses recettes et son savoir-faire, transmis par Charlotte elle-même. Le site vitrine doit présenter ce lieu au même titre que les cinq autres (Le Wattignies, Les Landes Fertiles, Le Labo Diva, Le Bar'Île, À La Carte Postale) : une page dédiée avec sa propre identité visuelle, intégrée à la navigation et à la découverte des lieux sur l'ensemble du site.

Contenu source : `brasserie-assets/Texte site internet.md` (texte de présentation, boutique et horaires, gammes de bières, prêt de tireuses) et 3 photos (intérieur de la boutique, salle de brassage avec cuves inox, bouteilles en rayon).

Contexte complémentaire : l'ancien site `lesbieresdecharlotte.fr` n'appartient plus à la brasserie (domaine expiré, récupéré par un tiers). Son contenu historique reste consultable via la Wayback Machine (snapshot d'avril 2025) et a servi à retrouver les coordonnées factuelles ; son texte NE DOIT PAS être réutilisé tel quel (droits d'auteur) — seuls les faits (adresse, contact) en sont repris.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Découvrir la brasserie (Priority: P1)

Un visiteur (habitant du quartier, curieux, client d'un autre lieu de la coopérative) arrive sur la page de la brasserie et comprend immédiatement ce qu'est ce lieu : une microbrasserie artisanale de la coopérative, son histoire (anciens locaux des Bières de Charlotte, quartier Saint-Clément), sa philosophie de brassage (artisanal, ingrédients locaux, bière non filtrée, non pasteurisée, sans conservateur ni clarifiant).

**Why this priority**: C'est la raison d'être de la page — sans présentation du lieu, rien d'autre n'a de sens. Une page réduite à ce seul contenu constitue déjà un MVP publiable.

**Independent Test**: Ouvrir l'URL de la page et vérifier qu'un visiteur qui ne connaît pas la coopérative comprend ce qu'est le lieu, où il se situe et ce qui distingue sa bière, sans avoir à naviguer ailleurs.

**Acceptance Scenarios**:

1. **Given** un visiteur sur la page de la brasserie, **When** la page se charge, **Then** il voit un écran d'accueil (hero) identifiant clairement le lieu, avec l'identité visuelle propre à la brasserie.
2. **Given** un visiteur sur la page, **When** il fait défiler la première section de présentation, **Then** il lit le texte « c'est quoi ? » fourni (lieu de la coopérative, quartier Saint-Clément, brassage artisanal et local, bière non filtrée/non pasteurisée) accompagné d'au moins une photo du lieu.
3. **Given** un visiteur sur la page, **When** il parcourt la présentation, **Then** il est informé que les bières sont aussi disponibles dans les autres lieux de la coopérative.

---

### User Story 2 - Préparer sa visite à la boutique (Priority: P2)

Un visiteur veut acheter de la bière ou goûter les nouveautés : il cherche les horaires d'ouverture de la boutique et l'adresse pour s'y rendre.

**Why this priority**: C'est l'action concrète attendue du visiteur (venir acheter). Les horaires sont le contenu le plus consulté d'une page de lieu.

**Independent Test**: Sur la page publiée, vérifier que les horaires (vendredi 16 h–20 h, samedi 11 h–20 h) et les informations de localisation sont visibles et exacts.

**Acceptance Scenarios**:

1. **Given** un visiteur sur la page, **When** il cherche les horaires, **Then** il trouve les horaires de la boutique : vendredi 16 h à 20 h, samedi 11 h à 20 h.
2. **Given** un visiteur sur la page, **When** il consulte la section boutique, **Then** il comprend qu'il peut y déguster les bières et échanger avec le brasseur (« il y a toujours quelques bouteilles d'ouvertes dans le frigo »).
3. **Given** un visiteur sur la page, **When** il cherche où se trouve la brasserie, **Then** il trouve l'adresse exacte (121 rue du Général Buat, 44000 Nantes) et une localisation sur carte, cohérentes avec les autres pages de lieux.

---

### User Story 3 - Découvrir les bières (Priority: P3)

Un amateur de bière veut savoir ce que brasse la brasserie : la gamme permanente (Blonde, Ambrée, Triple, Blanche, dont l'emblématique Carlota à la recette inchangée depuis 15 ans) et les brassins éphémères saisonniers du brasseur Simon.

**Why this priority**: Enrichit la page et donne envie de venir, mais la page est déjà utile sans ce détail des gammes.

**Independent Test**: Vérifier que la page présente distinctement la gamme permanente et les brassins éphémères, avec les contenus du texte source.

**Acceptance Scenarios**:

1. **Given** un visiteur sur la page, **When** il consulte la section des bières, **Then** il voit la gamme permanente (Blonde, Ambrée, Triple, Blanche) et la mise en avant de la Carlota (recette héritée de Charlotte, inchangée depuis 15 ans).
2. **Given** un visiteur sur la page, **When** il consulte la section des bières, **Then** il découvre l'existence des brassins éphémères saisonniers créés par le brasseur Simon.

---

### User Story 4 - Réserver une tireuse (Priority: P4)

Un particulier ou une entreprise (anniversaire, séminaire, week-end entre ami·es) découvre le service de prêt de tireuse pour l'achat d'un fût et sait comment le réserver (appeler la brasserie).

**Why this priority**: Service différenciant mais secondaire par rapport à la présentation du lieu et de la boutique.

**Independent Test**: Vérifier que la page décrit le service de prêt de tireuse et son mode de réservation.

**Acceptance Scenarios**:

1. **Given** un visiteur intéressé par une tireuse, **When** il consulte la section dédiée, **Then** il comprend le principe (prêt de tireuse pour l'achat d'un fût, occasions visées) et l'action à faire (appeler la brasserie pour réserver).

---

### User Story 5 - Trouver la page depuis le reste du site (Priority: P2)

Un visiteur qui navigue sur communile.fr (accueil, autre page de lieu) découvre l'existence de la brasserie et accède à sa page.

**Why this priority**: Sans intégration à la navigation, la page n'a aucun trafic ; c'est indissociable de la mise en ligne. Priorité haute mais dépendante de l'existence de la page (US1).

**Independent Test**: Depuis la page d'accueil et depuis n'importe quelle page, vérifier que la brasserie apparaît dans la navigation (desktop et mobile) et dans la présentation des lieux de la page d'accueil, et que les liens mènent à la page.

**Acceptance Scenarios**:

1. **Given** un visiteur sur n'importe quelle page du site, **When** il ouvre la navigation principale (desktop ou mobile), **Then** la brasserie y figure au même titre que les autres lieux et le lien fonctionne.
2. **Given** un visiteur sur la page d'accueil, **When** il consulte la section des lieux de la coopérative, **Then** la brasserie y est présentée avec une carte de lieu cohérente avec les autres.
3. **Given** un moteur de recherche, **When** il explore le site, **Then** la page figure dans le sitemap et expose ses métadonnées.

---

### Edge Cases

- Navigation : l'ajout d'un 7ᵉ élément de menu (6 lieux + « Qui sommes-nous ? ») ne doit pas casser la mise en page du header desktop ni du menu mobile.
- Écrans étroits : les horaires et les listes de bières restent lisibles sans débordement horizontal.
- Photos sources au format portrait (3472×4624 JPEG) : elles doivent être recadrées/optimisées pour les usages en paysage (hero, cartes) sans déformation ni poids excessif.
- Lieu repris récemment par la coopérative : pas de section « avis » pour cette v1 — la page ne doit pas afficher de section vide ou de contenu factice pour « faire comme les autres pages ».
- Ancien site toujours en ligne sous le même nom de domaine mais au contenu détourné (casino) : la nouvelle page doit s'imposer comme la référence pour les recherches sur « Les Bières de Charlotte » (métadonnées soignées, données structurées).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le site DOIT proposer une page dédiée à la brasserie « Les Bières de Charlotte », accessible à sa propre URL stable dérivée de ce nom, au même niveau que les autres pages de lieux.
- **FR-002**: La page DOIT porter une identité visuelle (palette de couleurs) qui lui est propre, distincte de celles des cinq autres lieux, tout en restant cohérente avec la charte globale du site (mêmes gabarits de sections, typographies et composants que les autres pages de lieux).
- **FR-003**: La page DOIT présenter le lieu avec le contenu texte fourni : nouveau lieu de la coopérative, quartier Saint-Clément, anciens locaux des Bières de Charlotte, brassage artisanal avec ingrédients locaux, bière non filtrée, non pasteurisée, sans conservateur ni clarifiant.
- **FR-004**: La page DOIT afficher les horaires exacts de la boutique (vendredi 16 h–20 h, samedi 11 h–20 h) et décrire l'expérience proposée (dégustation, échange avec le brasseur).
- **FR-005**: La page DOIT présenter la gamme permanente (Blonde, Ambrée, Triple, Blanche, avec mise en avant de la Carlota) et les brassins éphémères saisonniers.
- **FR-006**: La page DOIT présenter le service de prêt de tireuse (principe, occasions, réservation par téléphone).
- **FR-007**: La page DOIT mentionner que les bières sont disponibles dans les autres lieux de la coopérative.
- **FR-008**: La page DOIT utiliser les 3 photos fournies (`brasserie-assets/`), optimisées (format moderne, dimensions adaptées) et dotées de textes alternatifs descriptifs en français.
- **FR-009**: La brasserie DOIT être intégrée aux points de découverte existants : navigation principale (desktop et mobile), section « lieux » de la page d'accueil, et tout autre inventaire des lieux du site (pied de page, page contact) si ceux-ci listent les lieux.
- **FR-010**: La page DOIT exposer ses métadonnées de référencement (titre, description) et des données structurées de type établissement local, et figurer dans le sitemap — au même niveau d'exigence que les pages de lieux existantes.
- **FR-011**: La page DOIT afficher les informations pratiques exactes : adresse 121 rue du Général Buat, 44000 Nantes (entre les églises Saint-Clément et Saint-Donatien, arrêt Chronobus C1 « Chanzy »), téléphone 06 33 01 56 63, email bce.brasserie@gmail.com. Ces coordonnées, retrouvées via l'archive de l'ancien site (avril 2025), DOIVENT être confirmées par la coopérative avant mise en ligne ; aucune coordonnée inventée ou approximative NE DOIT être publiée (constitution, principe I).
- **FR-013**: La page DOIT intégrer une section Instagram pointant vers le compte de la brasserie (https://www.instagram.com/bieresdecharlotte/), cohérente avec les sections Instagram des autres pages de lieux. Aucune section « avis » n'est prévue pour cette v1.
- **FR-012**: La page DOIT être utilisable sur mobile comme sur desktop, avec un HTML sémantique (hiérarchie de titres, contrastes, navigation clavier) conforme aux exigences du site (WCAG 2.1 AA en référence).

### Key Entities

- **Lieu (la brasserie)**: nom, description, quartier/adresse, identité visuelle propre, photos, informations de contact, horaires de la boutique.
- **Gamme de bières**: bières permanentes (Blonde, Ambrée, Triple, Blanche, Carlota) et brassins éphémères ; nom, courte description, caractère permanent ou saisonnier.
- **Service (prêt de tireuse)**: principe, condition (achat d'un fût), mode de réservation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un visiteur qui découvre la page comprend en moins de 30 secondes ce qu'est le lieu, où il se trouve et ce qui distingue sa bière (vérifiable par test utilisateur informel sur les contenus au-dessus et juste sous la ligne de flottaison).
- **SC-002**: Les horaires de la boutique sont trouvables en un seul parcours de page, sans clic supplémentaire, sur mobile comme sur desktop.
- **SC-003**: La page est accessible en un clic depuis la navigation de n'importe quelle page du site et depuis la section lieux de l'accueil, en desktop comme en mobile.
- **SC-004**: La page atteint des scores de performance, d'accessibilité et de SEO équivalents à ceux des pages de lieux existantes (aucune régression mesurable Lighthouse ; poids de page du même ordre).
- **SC-005**: L'identité visuelle de la page est distincte : mise côte à côte avec chacune des cinq autres pages de lieux, la palette n'est confondue avec aucune d'elles.
- **SC-006**: 100 % des informations factuelles publiées (horaires, adresse, contacts, noms) proviennent des ressources fournies ou validées par la coopérative — zéro contenu factice en production.

## Assumptions

- Le nom du lieu est « Les Bières de Charlotte » (confirmé par l'utilisateur) : brasserie préexistante rachetée par la coopérative, qui conserve nom, recettes et savoir-faire.
- Les coordonnées (adresse, téléphone, email) proviennent de l'archive Wayback Machine de l'ancien site (snapshot d'avril 2025, déjà signé « l'équipe de la brasserie communale extraordinaire », donc postérieur à la reprise) ; elles sont présumées toujours valides mais seront confirmées par la coopérative avant mise en ligne.
- Règle de priorité des sources (confirmée par l'utilisateur) : en cas de contradiction entre le document d'assets (`brasserie-assets/Texte site internet.md`) et l'ancien site archivé, c'est le document d'assets qui a raison. Exemple : les horaires de la boutique du texte source (vendredi 16 h–20 h, samedi 11 h–20 h) priment sur les anciens horaires visibles dans l'archive (mercredi–vendredi 17 h 30–19 h 30). L'archive ne sert qu'à combler les informations absentes du document (adresse, téléphone, email).
- Le texte `brasserie-assets/Texte site internet.md` est la source de vérité éditoriale ; il pourra être légèrement adapté (titres, accroches) sans en changer le sens ni les faits. Le contenu rédactionnel de l'ancien site n'est pas réutilisé (droits d'auteur) ; seuls les faits en sont extraits.
- Les 3 photos fournies suffisent pour la v1 ; d'autres visuels (logo du lieu, décorations) pourront être ajoutés ultérieurement s'ils sont fournis.
- La structure de la page reprend le patron éprouvé des pages de lieux existantes (hero, « c'est quoi ? », sections thématiques, informations pratiques) — pas de maquette : les pages existantes servent de référence de composition.
- La palette propre au lieu s'inspirera de l'univers de la brasserie visible sur les photos (tons ambrés/cuivre de la bière, bois chaud de la boutique) ; le choix final des couleurs relève de la phase de plan/implémentation, dans le respect des contrastes (FR-012).
- Aucune section FAQ n'est prévue : aucun contenu FAQ n'a été fourni (contrairement aux autres lieux) ; elle pourra être ajoutée plus tard si un contenu est rédigé.
- Pas de vente en ligne ni de réservation en ligne : le site reste vitrine (constitution, principe II) ; la réservation de tireuse se fait par téléphone.
