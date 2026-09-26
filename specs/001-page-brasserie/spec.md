# Feature Specification: Page « La Sibra » (ex-Les Bières de Charlotte)

**Feature Branch**: `001-page-brasserie`

**Created**: 2026-09-01

**Updated**: 2026-09-18 — renommage du lieu en « La Sibra », placeholder logo, nouveau texte source, charte graphique fournie (orange/rose/vert), décoration hero, mise à jour de la page À La Carte Postale

**Status**: Draft

**Input**: User description: "Création d'une nouvelle page pour un nouveau lieu (une brasserie de bière). Pas de designeuse pour faire des maquettes : s'inspirer de toutes les pages existantes pour en créer une nouvelle, avec une palette de couleurs qui lui sera propre (comme les autres pages). Ressources fournies : contenu texte + 3 photos dans `brasserie-assets/`. À l'issue de cette session, découpage en tâches pour créer diverses issues (pas d'implémentation dans cette session)."

## Vue d'ensemble

Commun'ile ouvre un nouveau lieu : la microbrasserie **La Sibra** (121 rue du Général Buat, quartier Saint-Clément, Nantes), anciennement **Les Bières de Charlotte**, rachetée par la coopérative. La brasserie existait avant le rachat (14 ans de brassage) et conserve ses recettes et son savoir-faire, transmis par Charlotte elle-même. Le lieu est renommé **La Sibra** (décision du 2026-09-18) ; « Les Bières de Charlotte » reste son ancien nom, cité dans le texte de présentation (« anciennement Les Bières de Charlotte ») et conservé en `alternateName` pour le référencement, car c'est encore le nom que cherchent les visiteurs. La Carlota et les recettes historiques gardent leurs noms. Le site vitrine doit présenter ce lieu au même titre que les cinq autres (Le Wattignies, Les Landes Fertiles, Le Labo Diva, Le Bar'Île, À La Carte Postale) : une page dédiée avec sa propre identité visuelle, intégrée à la navigation et à la découverte des lieux sur l'ensemble du site.

Contenu source : `brasserie-assets/Texte site internet.md` — **version du 2026-09-18** (texte de présentation enrichi d'un paragraphe sur le lien ferme ↔ restaurants ↔ brasserie « de l'houblon à la pression », boutique avec horaires **et adresse**, gammes de bières, prêt de tireuses, liste des lieux revendeurs) et 3 photos (intérieur de la boutique, salle de brassage avec cuves inox, bouteilles en rayon).

Charte graphique fournie (2026-09-18) : trois disques qui se chevauchent — orange `#FEA300`, rose `#DC5B87`, vert olive `#7A9300`. Ces trois couleurs constituent la palette du lieu ; les nuances complémentaires (accents foncés, neutre) en sont dérivées. Aucun logo n'a été fourni à ce jour : le hero utilise un visuel provisoire (placeholder) à remplacer dès réception du logo.

Contexte complémentaire : l'ancien site `lesbieresdecharlotte.fr` n'appartient plus à la brasserie (domaine expiré, récupéré par un tiers). Son contenu historique reste consultable via la Wayback Machine (snapshot d'avril 2025) et a servi à retrouver les coordonnées factuelles ; son texte NE DOIT PAS être réutilisé tel quel (droits d'auteur) — seuls les faits (adresse, contact) en sont repris.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Découvrir la brasserie (Priority: P1)

Un visiteur (habitant du quartier, curieux, client d'un autre lieu de la coopérative) arrive sur la page de la brasserie et comprend immédiatement ce qu'est ce lieu : une microbrasserie artisanale de la coopérative, son histoire (anciennement Les Bières de Charlotte, quartier Saint-Clément), sa philosophie de brassage (artisanal, ingrédients locaux, bière non filtrée, non pasteurisée, sans conservateur ni clarifiant).

**Why this priority**: C'est la raison d'être de la page — sans présentation du lieu, rien d'autre n'a de sens. Une page réduite à ce seul contenu constitue déjà un MVP publiable.

**Independent Test**: Ouvrir l'URL de la page et vérifier qu'un visiteur qui ne connaît pas la coopérative comprend ce qu'est le lieu, où il se situe et ce qui distingue sa bière, sans avoir à naviguer ailleurs.

**Acceptance Scenarios**:

1. **Given** un visiteur sur la page de la brasserie, **When** la page se charge, **Then** il voit un écran d'accueil (hero) identifiant clairement le lieu (nom « La Sibra », accroche « De l'houblon à la pression »), avec l'identité visuelle propre à la brasserie ; en l'absence de logo, un visuel provisoire (motif des trois disques de la charte) tient lieu de logo.
2. **Given** un visiteur sur la page, **When** il fait défiler la première section de présentation, **Then** il lit le texte « c'est quoi ? » fourni (lieu de la coopérative, quartier Saint-Clément, « anciennement Les Bières de Charlotte », brassage artisanal et local, bière non filtrée/non pasteurisée) accompagné d'au moins une photo du lieu.
3. **Given** un visiteur sur la page, **When** il poursuit la présentation, **Then** il comprend le sens du projet pour la coopérative : à l'image du lien ferme maraîchère ↔ restaurants, la brasserie permet d'agir « de l'houblon à la pression » (produire soi-même ce qui est servi dans les lieux, soutenir une activité artisanale locale, repenser les liens entre métiers de bar et de brassage, dans le respect des valeurs de la coopérative).
4. **Given** un visiteur sur la page, **When** il parcourt la présentation, **Then** il est informé que les bières sont aussi disponibles dans les autres lieux de la coopérative et lors des marchés de la ferme des Landes Fertiles.

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
3. **Given** un amateur qui veut boire ces bières ailleurs qu'à la brasserie, **When** il consulte la page, **Then** il trouve la liste des lieux où elles sont servies ou vendues (Le Wattignies, L'industrie, Ohmtown, Pioche, …), sans que la liste prétende être exhaustive.

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
- Liste des lieux revendeurs volontairement ouverte (« … » dans le texte source) : afficher uniquement les lieux nommés, sans entrée inventée ni lien externe (confirmé le 2026-09-18 : pas de liens vers les lieux tiers) ; la formulation doit laisser entendre que d'autres lieux existent.
- Charte à trois couleurs vives : l'orange `#FEA300` ne supporte pas de texte blanc (contraste 2,0:1) — il ne doit jamais servir de fond à du texte blanc ; le rose et le vert ne l'acceptent qu'en grand texte ou via leurs accents foncés (règle validée le 2026-09-18, voir contrat thème).
- Ancien site toujours en ligne sous le même nom de domaine mais au contenu détourné (casino) : la nouvelle page doit s'imposer comme la référence pour les recherches sur « Les Bières de Charlotte » comme sur « La Sibra » (métadonnées soignées, données structurées, ancien nom en `alternateName` et dans la description).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le site DOIT proposer une page dédiée à la brasserie « La Sibra », accessible à sa propre URL stable dérivée de ce nom avec son article (`/la-sibra`), au même niveau que les autres pages de lieux. L'ancien nom « Les Bières de Charlotte » DOIT rester trouvable (mention dans le texte, `alternateName` dans les données structurées).
- **FR-002**: La page DOIT porter l'identité visuelle fournie par la coopérative — palette à trois couleurs orange `#FEA300`, rose `#DC5B87`, vert olive `#7A9300` (charte du 2026-09-18), complétée de nuances dérivées — distincte de celles des cinq autres lieux, tout en restant cohérente avec la charte globale du site (mêmes gabarits de sections, typographies et composants que les autres pages de lieux). Le hero DOIT comporter, comme les pages Landes Fertiles, Labo Diva, Bar'Île et Carte Postale, une décoration SVG géométrique monochrome dans les coins, teintée aux couleurs du thème.
- **FR-003**: La page DOIT présenter le lieu avec le contenu texte fourni (version du 2026-09-18) : nouveau lieu de la coopérative, quartier Saint-Clément, « anciennement Les Bières de Charlotte », brassage artisanal avec ingrédients locaux, bière non filtrée, non pasteurisée, sans conservateur ni clarifiant, et le paragraphe sur le sens du projet pour la coopérative (« de l'houblon à la pression », lien ferme ↔ restaurants ↔ brasserie, valeurs).
- **FR-004**: La page DOIT afficher les horaires exacts de la boutique (vendredi 16 h–20 h, samedi 11 h–20 h) et décrire l'expérience proposée (dégustation, échange avec le brasseur).
- **FR-005**: La page DOIT présenter la gamme permanente (Blonde, Ambrée, Triple, Blanche, avec mise en avant de la Carlota) et les brassins éphémères saisonniers.
- **FR-006**: La page DOIT présenter le service de prêt de tireuse (principe, occasions, réservation par téléphone).
- **FR-007**: La page DOIT mentionner que les bières sont disponibles dans les autres lieux de la coopérative et lors des marchés de la ferme des Landes Fertiles.
- **FR-014**: La page DOIT lister les lieux où retrouver les bières tels que fournis dans le texte source (Le Wattignies, L'industrie, Ohmtown, Pioche), en indiquant que la liste n'est pas exhaustive ; seuls les lieux de la coopérative reçoivent un lien interne, les lieux tiers sont nommés sans lien tant qu'aucune URL n'est fournie.
- **FR-015** (transverse) : la page À La Carte Postale DOIT cesser de se présenter comme « le dernier lieu né de la coopérative » ; le paragraphe devient : « C'est le quatrième restaurant de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! » Cette modification est livrée avec la page de la brasserie (même mise en ligne).
- **FR-008**: La page DOIT utiliser les 3 photos fournies (`brasserie-assets/`), optimisées (format moderne, dimensions adaptées) et dotées de textes alternatifs descriptifs en français.
- **FR-009**: La brasserie DOIT être intégrée aux points de découverte existants : navigation principale (desktop et mobile), section « lieux » de la page d'accueil, et tout autre inventaire des lieux du site (pied de page, page contact) si ceux-ci listent les lieux.
- **FR-010**: La page DOIT exposer ses métadonnées de référencement (titre, description) et des données structurées de type établissement local, et figurer dans le sitemap — au même niveau d'exigence que les pages de lieux existantes.
- **FR-011**: La page DOIT afficher les informations pratiques exactes : adresse 121 rue du Général Buat, 44000 Nantes (confirmée par le texte source du 2026-09-18 ; repères « entre les églises Saint-Clément et Saint-Donatien, arrêt Chronobus C1 « Chanzy » » issus de l'archive), téléphone 06 33 01 56 63, email bce.brasserie@gmail.com. Le téléphone, l'email et les repères, retrouvés via l'archive de l'ancien site (avril 2025), DOIVENT être confirmés par la coopérative avant mise en ligne ; aucune coordonnée inventée ou approximative NE DOIT être publiée (constitution, principe I).
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
- **SC-005**: L'identité visuelle de la page est distincte : mise côte à côte avec chacune des cinq autres pages de lieux, la palette n'est confondue avec aucune d'elles, et les trois couleurs de la charte fournie sont reconnaissables telles quelles (pas de dérive de teinte).
- **SC-006**: 100 % des informations factuelles publiées (horaires, adresse, contacts, noms) proviennent des ressources fournies ou validées par la coopérative — zéro contenu factice en production.

## Assumptions

- Le nom du lieu est **« La Sibra »** (décision de la coopérative, 2026-09-18) ; « Les Bières de Charlotte » est l'ancien nom, conservé comme mention historique et `alternateName`. L'hypothèse initiale du 2026-09-01 (nom conservé) est caduque. Le lieu se dit « La Sibra » (article confirmé le 2026-09-18) : slug `/la-sibra`, libellé de navigation « La Sibra », comme les autres lieux qui gardent leur article.
- L'adresse (121 rue du Général Buat) figure désormais dans le texte source (paragraphe Boutique) : elle est considérée confirmée. Le téléphone, l'email et les repères d'accès proviennent de l'archive Wayback Machine de l'ancien site (snapshot d'avril 2025, déjà signé « l'équipe de la brasserie communale extraordinaire », donc postérieur à la reprise) ; ils sont présumés toujours valides mais seront confirmés par la coopérative avant mise en ligne.
- Règle de priorité des sources (confirmée par l'utilisateur) : en cas de contradiction entre le document d'assets (`brasserie-assets/Texte site internet.md`) et l'ancien site archivé, c'est le document d'assets qui a raison. Exemple : les horaires de la boutique du texte source (vendredi 16 h–20 h, samedi 11 h–20 h) priment sur les anciens horaires visibles dans l'archive (mercredi–vendredi 17 h 30–19 h 30). L'archive ne sert qu'à combler les informations absentes du document (adresse, téléphone, email).
- Le texte `brasserie-assets/Texte site internet.md` (version du 2026-09-18) est la source de vérité éditoriale ; il pourra être légèrement adapté (titres, accroches) sans en changer le sens ni les faits. Deux corrections orthographiques ont été appliquées au texte reçu (« dans le respect », virgule parasite) ; l'écriture inclusive du texte (« habitant.es », « client·es », « copaines ») est conservée telle quelle. L'accroche du hero (`h1`) est « De l'houblon à la pression » (validée le 2026-09-18, susceptible d'évoluer) ; « Le tout nouveau lieu de la coopérative ! » ouvre la section « c'est quoi ? ». Le contenu rédactionnel de l'ancien site n'est pas réutilisé (droits d'auteur) ; seuls les faits en sont extraits.
- Les 3 photos fournies suffisent pour la v1. Pas encore de logo (confirmé le 2026-09-18) : le hero utilise un **placeholder** — motif des trois disques de la charte en SVG inline + nom « La Sibra » en `Heading` — signalé par un commentaire `TODO logo` dans le code ; le logo, une fois fourni, le remplacera (patron logo + tagline des autres pages).
- La structure de la page reprend le patron éprouvé des pages de lieux existantes (hero, « c'est quoi ? », sections thématiques, informations pratiques) — pas de maquette : les pages existantes servent de référence de composition.
- La palette est imposée par la charte fournie le 2026-09-18 (orange `#FEA300`, rose `#DC5B87`, vert `#7A9300`) — l'hypothèse initiale « ambre/cuivre » inspirée des photos est abandonnée. Les nuances dérivées (accents foncés pour les fonds sous texte blanc, neutre commun) sont fixées dans le contrat thème, dans le respect des contrastes (FR-012).
- Aucune section FAQ n'est prévue : aucun contenu FAQ n'a été fourni (contrairement aux autres lieux) ; elle pourra être ajoutée plus tard si un contenu est rédigé.
- Pas de vente en ligne ni de réservation en ligne : le site reste vitrine (constitution, principe II) ; la réservation de tireuse se fait par téléphone.
