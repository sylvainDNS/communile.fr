# Feature Specification: Découvrir La Sibra — hero, « c'est quoi ? », Instagram (issue #60)

**Feature Branch**: `001-page-brasserie-hero`

**Created**: 2026-09-19

**Status**: Draft

**Parent feature**: [`specs/001-page-brasserie/`](../../spec.md) — epic « Page La Sibra ». Les artefacts de l'epic (spec.md, plan.md, research.md, data-model.md, contracts/, tasks.md) font autorité ; ce document ne fait que découper le périmètre de l'issue GitHub #60 (tâches T008–T012) et n'introduit aucune décision contradictoire.

**Input**: Issue GitHub [#60](https://github.com/sylvainDNS/communile.fr/issues/60) — « US1 (T008–T012) : découvrir La Sibra — hero, "c'est quoi ?", Instagram ».

**Dépend de**: issue #59 (socle : route `/la-sibra`, thème `sibra`, photos et décorations vectorielles) — mergée dans la branche epic.

## Contexte

Le socle de la page `/la-sibra` existe : la route répond, le thème de la charte (vert olive, rose, orange) s'applique, les photos et les deux décorations vectorielles sont versionnées. La page n'affiche pour l'instant qu'un bloc technique de vérification des décorations, sans contenu éditorial.

Cette issue livre le **premier incrément publiable** de la page : un visiteur qui ouvre l'URL doit comprendre, sans naviguer ailleurs, quel est ce lieu, où il se trouve, ce qui distingue sa bière et pourquoi la coopérative l'a ouvert. C'est la story P1 (MVP) de l'epic : les sections suivantes (boutique, bières, tireuse, infos pratiques) viendront s'insérer entre la présentation et le fil Instagram.

Le logo du lieu n'est toujours pas fourni : le hero affiche un visuel provisoire tiré de la charte (motif des trois disques), explicitement annoté dans le code pour être remplacé dès réception.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identifier le lieu dès l'ouverture (Priority: P1)

Une personne qui ouvre `communile.fr/la-sibra` (lien partagé, résultat de recherche) doit reconnaître immédiatement le lieu : son nom, son identité visuelle et sa promesse, avant tout défilement sur grand écran.

**Why this priority**: c'est le premier écran ; sans lui, la page n'identifie pas son sujet et aucune autre section n'a de contexte.

**Independent Test**: ouvrir la page sur mobile et sur grand écran → le nom du lieu et l'accroche sont lisibles, le visuel provisoire est décoratif (non annoncé aux lecteurs d'écran), aucun élément décoratif ne recouvre le texte.

**Acceptance Scenarios**:

1. **Given** la page ouverte, **When** le premier écran s'affiche, **Then** le nom « La Sibra » et l'accroche « De l'houblon à la pression » sont visibles, l'accroche étant le titre principal de la page (un seul titre de niveau 1).
2. **Given** un grand écran, **When** la page s'affiche, **Then** deux décorations « bulles » habillent les coins opposés du premier écran, sans recouvrir ni rendre illisible le texte.
3. **Given** un écran de 375 px de large, **When** la page s'affiche, **Then** les décorations de coin sont masquées, le texte reste centré, lisible et sans défilement horizontal.
4. **Given** un lecteur d'écran, **When** il parcourt le premier écran, **Then** le visuel provisoire n'est pas annoncé (purement décoratif) et le contenu annoncé se limite au nom et à l'accroche.

---

### User Story 2 - Comprendre ce qu'est le lieu et ce qu'il représente (Priority: P1)

Un visiteur poursuit la lecture et découvre ce qu'est la microbrasserie (quartier, ancien nom, façon de brasser), ainsi que le sens du projet pour la coopérative, avec une photo du lieu.

**Why this priority**: c'est le cœur du test indépendant de la story — comprendre le lieu sans naviguer ailleurs.

**Independent Test**: lire la section de présentation → un inconnu peut redire le quartier, l'ancien nom, ce qui caractérise la bière et pourquoi la coopérative a ouvert ce lieu.

**Acceptance Scenarios**:

1. **Given** la section de présentation, **When** un visiteur la lit, **Then** il y trouve l'accroche « Le tout nouveau lieu de la coopérative ! », le quartier Saint-Clément, la mention « anciennement Les Bières de Charlotte », le brassage artisanal avec des ingrédients locaux et le caractère non filtré / non pasteurisé / sans conservateur ni clarifiant de la bière.
2. **Given** la même section, **When** le visiteur poursuit, **Then** un paragraphe distinctif explique le lien ferme maraîchère ↔ restaurants ↔ brasserie (« de l'houblon à la pression », produire soi-même, soutenir une activité artisanale locale, repenser les liens entre métiers de bar et de brassage) et conclut sur « L'aventure Commun'île y prend tout son sens ! ».
3. **Given** la même section, **When** le visiteur cherche où trouver les bières, **Then** il lit qu'elles sont aussi disponibles dans les autres lieux de la coopérative et lors des marchés de la ferme des Landes Fertiles, avec des liens vers les pages concernées du site.
4. **Given** la photo du lieu, **When** elle est chargée, **Then** elle porte une description alternative en français décrivant la scène.
5. **Given** les fonds colorés de la charte, **When** on mesure le contraste des textes, **Then** aucun texte courant blanc ne repose sur un fond brut et aucun texte blanc ne repose sur l'orange.

---

### User Story 3 - Prolonger la découverte sur Instagram (Priority: P2)

Un visiteur intéressé veut voir l'actualité du lieu (nouveautés, brassins) : un fil Instagram clôt la page, comme sur les autres pages de lieux.

**Why this priority**: complète la découverte mais n'est pas nécessaire pour comprendre le lieu.

**Independent Test**: dérouler la page jusqu'en bas → un fil Instagram du compte de la brasserie s'affiche, avec un titre de section explicite.

**Acceptance Scenarios**:

1. **Given** le bas de la page, **When** le visiteur y arrive, **Then** une section annonce « Retrouvez-nous sur Instagram » et intègre le fil du compte de la brasserie.
2. **Given** les autres pages de lieux du site, **When** on compare, **Then** la présentation de cette section est cohérente avec elles.

---

### Edge Cases

- **Décorations vs texte** : les bulles occupent les coins ; sur les largeurs intermédiaires (tablette), elles ne doivent ni chevaucher le texte ni créer de débordement horizontal.
- **Absence de logo** : le visuel provisoire doit rester convaincant esthétiquement tout en étant identifiable comme provisoire dans le code (annotation explicite).
- **Contraste sur la charte** : le vert et le rose ne portent du blanc qu'en grand texte ; l'orange ne porte jamais de blanc. Le texte courant de la section de présentation est donc en couleur de premier plan, pas en blanc — ce qui diffère du patron copié (La Carte Postale), dont le thème le permettait.
- **Fil Instagram indisponible** : l'intégration tierce peut ne rien afficher (compte privé, blocage du navigateur) ; la page doit rester lisible et ne pas casser sa mise en page.
- **Compte Instagram à l'ancien nom** : le compte est encore `bieresdecharlotte` ; s'il était renommé, la section afficherait un fil vide — à revérifier au recettage.
- **Coordonnées** : téléphone et email sont sous gate de confirmation (#67) et ne doivent apparaître nulle part dans cet incrément.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le premier écran de la page DOIT afficher le nom « La Sibra » et l'accroche « De l'houblon à la pression », cette dernière étant le titre principal (niveau 1) et unique de la page.
- **FR-002**: Le premier écran DOIT afficher, à la place du logo non fourni, le motif des trois disques de la charte (orange, rose, vert de la charte), purement décoratif et non annoncé aux technologies d'assistance, accompagné dans le code d'une annotation de remplacement dès réception du logo.
- **FR-003**: Le premier écran DOIT reprendre la décoration « bulles » du socle en deux exemplaires, teintée par les accents du thème (rose en haut à gauche, vert pivoté en bas à droite), masquée sur petit écran.
- **FR-004**: La page DOIT présenter le lieu avec le texte source du 2026-09-18 : accroche « Le tout nouveau lieu de la coopérative ! », paragraphe de présentation (quartier St Clément, « anciennement Les Bières de Charlotte », passage obligé pour les habitant.es, brassage artisanal aux ingrédients locaux, bière non filtrée / non pasteurisée / sans conservateur ni clarifiant, « chaque gorgée en appelle une autre ») et paragraphe sur le sens du projet pour la coopérative (« de l'houblon à la pression », jusqu'à « L'aventure Commun'île y prend tout son sens ! »).
- **FR-005**: La section de présentation DOIT mentionner que les bières sont aussi disponibles dans les autres lieux de la coopérative et lors des marchés de la ferme des Landes Fertiles, avec des liens internes construits à partir des constantes de routes partagées (aucune URL écrite en dur).
- **FR-006**: La section de présentation DOIT afficher la photo de la boutique livrée par le socle, avec une description alternative en français décrivant la scène, servie en plusieurs largeurs pour ne pas pénaliser les petits écrans.
- **FR-007**: La section de présentation DOIT porter l'ornement « trois disques » du socle en bas à gauche, teinté par l'accent primaire, sans gêner la lecture.
- **FR-008**: La page DOIT se terminer par une section Instagram intégrant le fil du compte de la brasserie (`bieresdecharlotte`), cohérente avec les sections Instagram des autres pages de lieux.
- **FR-009**: La page DOIT assembler les sections dans l'ordre : premier écran → présentation → Instagram, en remplaçant le bloc provisoire de vérification des décorations issu du socle.
- **FR-010**: Les règles de contraste du contrat de thème DOIVENT être respectées : texte courant en couleur de premier plan sur les fonds bruts, blanc réservé au grand texte sur le vert et le rose, jamais de blanc sur l'orange ; aucun composant rendant du blanc sur fond tertiaire n'est introduit.
- **FR-011**: Le nommage DOIT suivre la convention de l'epic : sans article pour les fichiers de la feature (`sibra-hero-section`, `sibra-what-section`, `sibra-instagram-section`), article conservé uniquement pour ce qui dérive de l'URL.
- **FR-012**: Aucune coordonnée du lieu (téléphone, email) NE DOIT apparaître dans cet incrément ; elles restent soumises au gate de confirmation (#67).
- **FR-013**: Le rendu DOIT être vérifié visuellement à 375 px et à ≥ 1280 px ; les ajustements se font dans les sections de la feature, jamais sur les teintes de base du thème.

### Non-Goals (hors périmètre de cette issue)

- Sections boutique et horaires (#61), gammes de bières et lieux revendeurs (#64 côté contenu bières), prêt de tireuse (#65), infos pratiques et carte.
- Entrées de navigation et de pied de page, carte du lieu sur l'accueil (#62).
- Métadonnées SEO définitives, image Open Graph, JSON-LD, sitemap (#63).
- Polish final et passe Lighthouse (#66).
- Intégration du logo définitif (non fourni) et confirmation des coordonnées (#67).

### Key Entities

- **Premier écran (hero)** : nom du lieu, accroche, visuel provisoire de marque, décorations de coin.
- **Bloc de présentation** : accroche, paragraphe factuel, paragraphe de sens, photo, ornement, mention de disponibilité avec liens internes.
- **Fil social** : compte Instagram du lieu, intégré en fin de page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Une personne ne connaissant pas le lieu peut, après une seule lecture de la page et sans naviguer ailleurs, citer le quartier, l'ancien nom et au moins deux caractéristiques de la bière.
- **SC-002**: À 375 px comme à 1280 px, aucun élément décoratif ne chevauche un texte et la page ne défile pas horizontalement.
- **SC-003**: Tous les textes de la page respectent les seuils du contrat de thème (≥ 4,5:1 en texte courant, ≥ 3:1 en grand texte) — vérifié par prélèvement des couples texte/fond utilisés.
- **SC-004**: La page ne comporte qu'un seul titre de niveau 1 et une hiérarchie de titres sans saut de niveau.
- **SC-005**: Aucun numéro de téléphone ni adresse email n'apparaît dans le rendu de la page.
- **SC-006**: Les contrôles automatisés du dépôt (vérification de types + build, lint) passent sans erreur ni avertissement nouveau.

## Assumptions

- Le texte source `brasserie-assets/Texte site internet.md` (version du 2026-09-18) est la source de vérité éditoriale ; l'écriture inclusive qu'il emploie (« habitant.es », « client·es ») est conservée telle quelle, et les titres/accroches peuvent être adaptés sans changer les faits.
- L'accroche « De l'houblon à la pression » est validée au 2026-09-18 et pourra évoluer ; elle est portée par le titre principal.
- Les « autres lieux de la coopérative » renvoyés par la mention de disponibilité sont ceux exposés par les constantes de routes existantes ; aucun lieu revendeur tiers n'est cité ici (ils relèvent de la section bières).
- Le compte Instagram reste `bieresdecharlotte` tant que la coopérative ne le renomme pas ; à revérifier au recettage.
- La branche de travail est `001-page-brasserie-hero` (schéma plat) : git interdit qu'une référence soit à la fois une branche et le préfixe d'une autre, or la branche epic s'appelle exactement `001-page-brasserie`. La PR cible la branche epic, jamais `main`.
- La vérification visuelle est humaine (aucun outil de test de rendu dans le dépôt) ; elle s'appuie sur le build local et la relecture aux deux largeurs de référence.
