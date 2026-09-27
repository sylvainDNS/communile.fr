# Feature Specification: Préparer sa visite à La Sibra — boutique, horaires, infos pratiques et carte (issue #61)

**Feature Branch**: `001-page-brasserie-boutique`

**Created**: 2026-09-19

**Status**: Draft

**Parent feature**: [`specs/001-page-brasserie/`](../../spec.md) — epic « Page La Sibra ». Les artefacts de l'epic (spec.md, plan.md, research.md, data-model.md, contracts/, tasks.md) font autorité ; ce document ne fait que découper le périmètre de l'issue GitHub #61 (tâches T013–T015) et n'introduit aucune décision contradictoire, à l'exception — documentée et signalée — du traitement du téléphone, de l'email et du repère de ligne de bus (cf. « Écarts assumés » et Assumptions).

**Input**: Issue GitHub [#61](https://github.com/sylvainDNS/communile.fr/issues/61) — « US2 (T013–T015) : préparer sa visite — boutique, horaires, infos pratiques + carte ».

**Dépend de**: issues #59 (socle : route `/la-sibra`, `PATH.LA_SIBRA`, thème `sibra`, images de la feature), #60 (hero, « c'est quoi ? », Instagram), #64 (section bières) et #65 (section tireuse) — toutes mergées dans la branche epic (`d5f4a02`).

## Contexte

La page `/la-sibra` raconte aujourd'hui le lieu, sa gamme de bières, où les retrouver et le prêt de tireuse. Il lui manque l'essentiel pour **venir** : quand la boutique est ouverte, où elle se trouve, et à quoi ressemble le quartier autour.

Cette issue livre la **story P2** de l'epic, en deux sections :

1. **Boutique** — les horaires, mis en avant, avec l'adresse telle que le texte source la formule, et ce qu'on y fait (goûter les nouveautés et les classiques, discuter avec le brasseur, les bouteilles ouvertes dans le frigo), illustrée par la photo `sibra-bouteilles.webp`.
2. **Infos pratiques** — l'adresse postale complète, les repères d'accès et une carte interactive centrée sur le lieu.

Le texte source (`brasserie-assets/Texte site internet.md`, version du 2026-09-18) est la seule source éditoriale du bloc boutique :

> **La Boutique** — La boutique de la brasserie est ouverte le vendredi de 16h à 20h et le samedi de 11h à 20h au 121 rue du Général Buat. N'hésitez pas à venir goûter les nouveautés et les classiques de la brasserie et à en discuter avec le brasseur. Il y a toujours quelques bouteilles d'ouvertes dans le frigo.

Les horaires de l'archive Wayback (mer–ven 17 h 30–19 h 30) sont périmés et ne doivent pas être utilisés.

### Écarts assumés avec l'énoncé des tâches T013–T015

**E1 — Téléphone et email retirés du périmètre.** T014 prévoit d'afficher `tel:+33633015663` et `bce.brasserie@gmail.com`. Ces deux coordonnées proviennent de l'archive Wayback d'avril 2025 et restent **non confirmées**, sous gate humain [#67](https://github.com/sylvainDNS/communile.fr/issues/67). La constitution (principe I) interdit de publier une information de contact non vérifiée. Cet incrément **n'affiche donc ni téléphone, ni email, ni lien `tel:` / `mailto:`**, et n'introduit aucun élément interactif sans destination pour les remplacer — même traitement que celui retenu par #65 pour son CTA. **À valider par l'humain** (Assumption A1).

**E2 — Repère « Chronobus C1 » réduit au nom de l'arrêt.** T014 prévoit le repère « Chronobus C1 arrêt Chanzy », issu de la même archive. L'existence d'un arrêt nommé « Chanzy » à environ 200 m de l'adresse est vérifiable sur une source publique indépendante ; le **numéro de la ligne**, lui, n'a pas pu être re-vérifié. Cet incrément cite donc l'arrêt sans affirmer la ligne. **À valider par l'humain** (Assumption A2).

**E3 — Repères « églises » conservés, car vérifiés.** Les deux églises citées par l'archive encadrent bien l'adresse (Saint-Clément ≈ 500 m au sud-ouest, Saint-Donatien ≈ 445 m au nord-est) : ce sont des faits géographiques re-vérifiés à l'implémentation, et non plus une reprise d'archive. Ils sont conservés (Assumption A3).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Savoir quand venir (Priority: P2)

Un habitant du quartier, ou quelqu'un qui passe à Nantes, veut acheter de la bière à la brasserie et cherche d'abord **quand** c'est ouvert.

**Why this priority**: c'est la première moitié du test indépendant de l'US2 de l'epic (SC-002) et l'information la plus recherchée sur la page d'un commerce.

**Independent Test**: ouvrir la page et parcourir jusqu'à la section boutique → le visiteur peut énoncer les deux jours et les deux plages horaires sans relire, sans zoomer et sans quitter la page.

**Acceptance Scenarios**:

1. **Given** la section boutique affichée, **When** le visiteur la survole du regard, **Then** les horaires (vendredi 16 h–20 h, samedi 11 h–20 h) ressortent typographiquement du texte courant de la section.
2. **Given** la même section, **When** le visiteur cherche les autres jours, **Then** rien ne laisse croire que la boutique est ouverte hors de ces deux créneaux, et aucun horaire absent du texte source n'est affiché.
3. **Given** la même section, **When** le visiteur cherche ce qu'il peut y faire, **Then** il lit qu'il peut goûter les nouveautés et les classiques, en discuter avec le brasseur, et qu'il y a toujours quelques bouteilles ouvertes dans le frigo.
4. **Given** un utilisateur de lecteur d'écran, **When** il parcourt les horaires, **Then** chaque jour est associé à sa plage horaire de manière non ambiguë (relation portée par la structure, pas seulement par la mise en page).

---

### User Story 2 - Savoir où aller (Priority: P2)

Le même visiteur, décidé, veut localiser la brasserie et savoir comment s'y rendre.

**Why this priority**: seconde moitié du test indépendant de l'US2 ; sans localisation, les horaires ne servent à rien.

**Independent Test**: ouvrir la page, atteindre la section infos pratiques → le visiteur peut relever l'adresse postale complète et situer le lieu sur une carte, sans quitter la page.

**Acceptance Scenarios**:

1. **Given** la section infos pratiques affichée, **When** le visiteur cherche l'adresse, **Then** il lit « 121 rue du Général Buat, 44000 Nantes » en entier (numéro, voie, code postal, ville).
2. **Given** la même section, **When** la carte se charge, **Then** un repère est posé sur l'adresse et le niveau de zoom permet d'identifier les rues alentour.
3. **Given** la même section, **When** le visiteur cherche à s'orienter, **Then** il trouve des repères de quartier et de transport en commun, formulés comme des repères et non comme des instructions d'itinéraire.
4. **Given** la carte indisponible (script tiers bloqué ou hors ligne), **When** la page s'affiche, **Then** l'adresse reste lisible en texte et la page reste utilisable — la carte n'est pas le seul porteur de la localisation.
5. **Given** un utilisateur de lecteur d'écran ou de clavier, **When** il atteint la carte, **Then** celle-ci ne piège pas le focus et n'est pas annoncée comme une information essentielle manquante, l'adresse textuelle en étant l'équivalent.

---

### User Story 3 - Trouver les deux informations en un seul parcours (Priority: P2)

Le test indépendant de l'US2 de l'epic : horaires **et** localisation trouvables en une seule traversée de page.

**Why this priority**: c'est le critère de succès SC-002 de l'epic ; il porte sur l'agencement, pas sur chaque section isolée.

**Independent Test**: charger `/la-sibra` à 375 px puis à 1280 px et faire défiler une seule fois de haut en bas → horaires et localisation sont tous deux rencontrés, dans cet ordre, sans retour en arrière.

**Acceptance Scenarios**:

1. **Given** la page complète, **When** on la parcourt de haut en bas, **Then** la section boutique puis la section infos pratiques apparaissent après la présentation du lieu et avant le fil Instagram.
2. **Given** la page à 375 px de large, **When** on la parcourt, **Then** aucun débordement horizontal n'apparaît et les horaires restent lisibles sans zoom.
3. **Given** la page complète, **When** on regarde l'enchaînement des fonds de section, **Then** les deux nouvelles sections s'insèrent dans l'alternance existante sans deux fonds de marque identiques consécutifs.

### Edge Cases

- **Coordonnées non confirmées** : publier un numéro ou un email issus d'une archive de 2025 exposerait la coopérative à diffuser un contact erroné (constitution I). Aucun n'est affiché ; aucun faux bouton « nous contacter » ne les remplace.
- **Carte absente ou lente** : le composant de carte charge une bibliothèque tierce depuis un CDN ; l'adresse textuelle doit rester la source primaire de la localisation.
- **Carte et défilement mobile** : une carte qui capte le défilement à la molette ou au doigt peut bloquer la lecture de la page sur mobile.
- **Horaires ambigus** : « vendredi 16 h–20 h, samedi 11 h–20 h » ne doit pas pouvoir se lire comme « du vendredi 16 h au samedi 20 h ».
- **Contrastes de la charte** : jamais de texte blanc sur l'orange ; blanc réservé au grand texte (≥ 24 px, ou ≥ 18,66 px en graisse **700**) sur le vert et le rose ; `weight="semibold"` (600) ne qualifie pas. Les ratios du contrat de thème de l'epic sont connus pour être optimistes : les couples réellement utilisés doivent être recalculés.
- **Ornements semi-transparents** : ne doivent pas passer sous du texte courant, sous peine de faire chuter le contraste en dessous du seuil (incident constaté sur #65).
- **Photo en portrait** : les photos livrées sont en 1600 × 2131 alors que les patrons de sections supposent du paysage ; la colonne image doit être bornée pour ne pas écraser le texte.
- **Redondance d'adresse** : l'adresse apparaît deux fois (formulation du texte source en boutique, adresse postale complète en infos pratiques) ; les deux occurrences doivent rester cohérentes et ne pas se contredire.

## Requirements *(mandatory)*

### Functional Requirements

#### Section boutique

- **FR-001**: La page DOIT comporter une section dédiée à la boutique, dotée d'un titre de section de niveau 2 cohérent avec les autres titres de section de la page.
- **FR-002**: La section boutique DOIT afficher les horaires d'ouverture — vendredi 16 h–20 h et samedi 11 h–20 h — et **uniquement** ceux-ci.
- **FR-003**: Les horaires DOIVENT être **proéminents** : plus grands et/ou plus contrastés que le texte courant de la section, repérables sans lire le paragraphe.
- **FR-004**: Chaque jour DOIT être associé à sa plage horaire par une structure explicite, de façon que la relation jour ↔ horaire soit restituée hors mise en page (technologies d'assistance).
- **FR-005**: La section boutique DOIT citer l'adresse sous la formulation du texte source (« au 121 rue du Général Buat »).
- **FR-006**: La section boutique DOIT reprendre les trois propositions du texte source : goûter les nouveautés et les classiques, en discuter avec le brasseur, quelques bouteilles toujours ouvertes dans le frigo.
- **FR-007**: La section boutique DOIT afficher la photo `sibra-bouteilles.webp` avec un texte alternatif en français, descriptif du contenu de l'image.
- **FR-008**: La photo DOIT être servie en plusieurs largeurs et chargée en différé, selon le patron des sections déjà livrées de la feature.

#### Section infos pratiques

- **FR-009**: La page DOIT comporter une section « infos pratiques », dotée d'un titre de section de niveau 2.
- **FR-010**: La section DOIT afficher l'adresse postale complète : 121 rue du Général Buat, 44000 Nantes.
- **FR-011**: L'adresse DOIT être balisée sémantiquement comme une adresse postale.
- **FR-012**: La section DOIT afficher des repères d'orientation vérifiés : les deux églises encadrant le lieu et le nom d'un arrêt de transport en commun proche, choisi pour sa valeur de repère (notoriété, desserte) et non pour sa seule distance — la distance annoncée devant, elle, être exacte.
- **FR-013**: La section DOIT afficher une carte interactive centrée sur le point géocodé de l'adresse, avec un repère posé sur ce point et une infobulle nommant le lieu.
- **FR-014**: Le point géocodé DOIT provenir d'un service de géocodage faisant autorité et DOIT être recoupé par une seconde source avant d'être écrit dans le code ; la valeur retenue et ses sources sont consignées dans les artefacts de la feature.
- **FR-015**: La carte NE DOIT PAS capter le défilement de la page à la molette ; la navigation dans la carte reste possible par ses propres commandes.
- **FR-016**: L'information de localisation NE DOIT PAS dépendre du chargement de la carte : l'adresse textuelle en est l'équivalent accessible et reste affichée si la carte échoue.
- **FR-017**: La carte DOIT rester dans les limites de son conteneur à toutes les largeurs, sans provoquer de défilement horizontal de la page.

#### Coordonnées et gate

- **FR-018**: Aucun numéro de téléphone, aucune adresse email, aucun lien `tel:` ou `mailto:` NE DOIT apparaître dans le code livré par cet incrément.
- **FR-019**: Aucun élément interactif sans destination (bouton ou lien factice) NE DOIT être introduit pour compenser l'absence de coordonnées.
- **FR-020**: Aucune information d'accès NE DOIT être affirmée sans vérification : un repère issu de l'archive et non re-vérifié est soit écarté, soit réduit à sa part vérifiable.

#### Intégration et qualité transverse

- **FR-021**: Les deux sections DOIVENT être insérées dans `/la-sibra` après la section « c'est quoi ? » et avant le fil Instagram, dans l'ordre prévu par l'epic.
- **FR-022**: L'enchaînement des fonds de section DOIT rester alterné : pas deux fonds de marque identiques consécutifs.
- **FR-023**: Les données éditoriales des sections (horaires, repères) DOIVENT être portées par des constantes locales aux sections, selon le patron des sections existantes — pas de constante globale, pas de fichier de données.
- **FR-024**: Les règles de contraste du contrat de thème de l'epic DOIVENT être respectées, ratios **recalculés** sur les couples réellement employés : texte courant en couleur de premier plan, blanc réservé au grand texte (≥ 24 px ou ≥ 18,66 px en graisse 700) sur le vert et le rose, jamais de blanc sur l'orange.
- **FR-025**: Le nommage DOIT suivre la convention de l'epic : sans article pour les fichiers de la feature (`sibra-boutique-section`, `sibra-infos-section`), article conservé uniquement pour ce qui dérive de l'URL.
- **FR-026**: Les sections NE DOIVENT introduire aucun composant partagé nouveau ni modifier un composant partagé existant.
- **FR-027**: Le rendu DOIT être vérifié à 375 px et à ≥ 1280 px ; les ajustements se font dans les sections de la feature, jamais sur les teintes de base du thème.
- **FR-028**: La page DOIT continuer à ne comporter qu'un seul titre de niveau 1, et la hiérarchie des titres DOIT rester sans saut de niveau.

### Non-Goals (hors périmètre de cette issue)

- Confirmation des coordonnées, ajout du téléphone, de l'email et de la ligne de bus (#67).
- Entrées de navigation, pied de page, carte du lieu sur l'accueil (#62) — y compris l'affichage des horaires au survol de la carte d'accueil.
- Métadonnées SEO, image Open Graph, JSON-LD (`geo`, `openingHoursSpecification`, `address`), sitemap (#63) — la valeur géocodée est produite ici et consignée, mais n'est pas injectée dans des données structurées.
- Polish final, revue design d'ensemble et passe Lighthouse (#66).
- Itinéraire, calcul de trajet, lien d'ouverture vers une application de navigation tierce.
- Toute information de parking, d'accessibilité PMR ou de moyens de paiement : absente du texte source et non vérifiée.
- Modification du composant de carte partagé (self-hosting de la bibliothèque, changement de fond de carte).

### Key Entities

- **Horaire de boutique** : un jour de la semaine, une heure d'ouverture, une heure de fermeture. Deux occurrences seulement (vendredi, samedi). Source de vérité : le texte source du 2026-09-18.
- **Localisation** : l'adresse postale (confirmée par le texte source) et son point géocodé (produit et recoupé à l'implémentation).
- **Repère d'accès** : un point de reconnaissance du quartier ou un arrêt de transport, avec son statut de vérification. Seuls les repères vérifiés sont affichés.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Une personne qui parcourt la page une seule fois, de haut en bas, peut énoncer les deux créneaux d'ouverture **et** situer la brasserie, sans revenir en arrière (test indépendant de l'US2 / SC-002 de l'epic).
- **SC-002**: 100 % des faits affichés par la section boutique proviennent du texte source du 2026-09-18 — zéro horaire, zéro service inventé (vérifiable par relecture croisée section ↔ texte source).
- **SC-003**: Le point géocodé est recoupé par au moins deux sources indépendantes et retombe sur le bon numéro de voie (vérifiable en rejouant les requêtes consignées).
- **SC-004**: À 375 px de large, la page ne présente aucun défilement horizontal et les horaires sont lisibles sans zoom ; à ≥ 1280 px, les deux sections conservent le rythme visuel de la page.
- **SC-005**: Aucun couple texte/fond introduit par les deux sections ne descend sous le seuil WCAG 2.1 AA applicable (4,5:1 pour le texte courant, 3:1 pour le grand texte), ratios recalculés et non repris du contrat de thème.
- **SC-006**: Zéro occurrence d'un numéro de téléphone, d'un `tel:`, d'un `mailto:` ou d'une adresse email dans le code livré (vérifiable par recherche textuelle sur le diff).
- **SC-007**: Zéro élément interactif sans destination introduit par les deux sections.
- **SC-008**: Avec le chargement de la carte empêché, l'adresse complète reste lisible et la page reste navigable au clavier de bout en bout.

## Assumptions

- **A1 — Téléphone et email gelés (à valider par l'humain)** : l'epic (T014, data-model) prévoit de les afficher. Non confirmés et sous gate #67, ils sont exclus de cet incrément. Leur ajout, une fois confirmés, est une modification locale à la section infos pratiques.
- **A2 — Ligne de bus non affirmée (à valider par l'humain)** : l'arrêt « Chanzy » est cité sans numéro de ligne, le « Chronobus C1 » de l'archive n'ayant pas pu être re-vérifié depuis une source publique. Si la coopérative confirme la ligne, c'est un ajout d'un mot.
- **A3 — Repères « églises » conservés** : re-vérifiés géographiquement à l'implémentation, ils cessent d'être une reprise d'archive et deviennent un fait contrôlé ; ils restent affichés.
- **Deux sections plutôt qu'une** : l'epic prévoit deux sections distinctes (T013, T014). Elles sont conservées distinctes — la boutique relève de l'éditorial, les infos pratiques du factuel — et sont placées à l'emplacement que leur donne l'ordre de sections de l'epic (boutique après « c'est quoi ? », infos entre « tireuse » et « instagram », cf. [research.md § R61-7](./research.md) et [contracts/sections.md](./contracts/sections.md)). Elles ne se suivent donc **pas** immédiatement : le parcours unique de l'US3 est satisfait par l'ordre relatif (horaires rencontrés avant la localisation), pas par l'adjacence.
- **Formulation des horaires** : le texte source écrit « de 16h à 20h » ; l'affichage proéminent peut recomposer cette information (par exemple en paire jour / plage) sans en changer le sens, comme l'epic l'autorise pour la mise en forme.
- **Zoom de la carte** : un niveau de zoom « rue » (comparable au patron `contact.astro`) est retenu ; le réglage exact est un détail de mise en forme.
- **Défilement molette** : désactivé sur la carte pour ne pas piéger le défilement de la page, choix d'ergonomie non tranché par l'epic, documenté ici.
- **Hauteur de la carte** : fixée en dur par le composant partagé ; une valeur unique responsive est retenue plutôt qu'une modification du composant partagé (hors périmètre, FR-026).
- Le texte source est adapté à la marge (titres, ponctuation, majuscules, typographie française) sans en changer le sens ni les faits, comme autorisé par l'epic.
