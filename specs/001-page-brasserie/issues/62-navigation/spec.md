# Feature Specification: Découverte interne de La Sibra — header, footer, carte d'accueil et mise à jour À La Carte Postale (issue #62)

**Feature Branch**: `001-page-brasserie-navigation`

**Created**: 2026-09-19

**Status**: Draft

**Input**: User description: "US5a (issue #62, T016–T018b) : découverte interne de La Sibra depuis le reste du site — 7ᵉ entrée de nav dans le header et le footer, 6ᵉ carte de lieu sur l'accueil, et remplacement du libellé « dernier lieu né » sur la page À La Carte Postale (FR-015)."

## Contexte

La page `/la-sibra` est complète et fonctionnelle (issues #59, #60, #61, #64, #65 mergées dans l'epic
`001-page-brasserie`), mais **aucun chemin ne permet encore de l'atteindre depuis le reste du site**.
Cette issue ouvre ces chemins.

Particularité déterminante : contrairement aux issues précédentes de l'epic, **toutes les surfaces
touchées ici sont déjà en production** — le header et le footer sont présents sur les 8 pages du site,
la section « Nos lieux » est sur la page d'accueil, et la page À La Carte Postale est publique. Le
risque principal n'est donc pas l'absence de fonctionnalité mais **la régression sur l'existant**.
La spec impose en conséquence un périmètre fermé de 4 fichiers et une interdiction explicite de
refactoring opportuniste.

Seconde particularité : l'ajout de La Sibra rend **factuellement faux** un paragraphe déjà publié sur
la page À La Carte Postale (« C'est le dernier lieu né de la coopérative »). La constitution
(principe I — exactitude obligatoire) interdit de laisser cette phrase en ligne une fois La Sibra
publiée. La correction est donc livrée dans la **même** unité de travail, non dans une issue
ultérieure.

### Décomposition des tâches de l'epic

| Tâche | Portée |
|-------|--------|
| T016 | 7ᵉ entrée « La Sibra » dans les `links` du header (nav desktop `xl` + menu mobile) |
| T017 | Entrée « La Sibra » dans la colonne des lieux du footer |
| T018 | 6ᵉ carte de lieu sur l'accueil + retrait de la classe de centrage de la carte À La Carte Postale |
| T018b | Remplacement du paragraphe « dernier lieu né » → « quatrième restaurant » (FR-015, research R10) |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Atteindre La Sibra depuis n'importe quelle page (Priority: P2)

Une visiteuse arrive sur le site par n'importe quelle page (accueil, un autre lieu, la page concept).
Elle a entendu parler de la brasserie de la coopérative et veut la trouver. Elle doit pouvoir y
accéder en un clic depuis la navigation, sur mobile comme sur desktop, sans avoir à revenir à
l'accueil ni à connaître l'adresse de la page.

**Why this priority**: P2 — la page existe déjà et délivre sa valeur, mais reste orpheline. Sans ce
chemin d'accès, le travail des issues #59–#65 est invisible pour le public.

**Independent Test**: depuis trois pages différentes du site, en desktop et en mobile, ouvrir la
navigation et atteindre la page de la brasserie en un seul clic.

**Acceptance Scenarios**:

1. **Given** un visiteur sur n'importe quelle page du site en desktop large, **When** il regarde la
   navigation principale, **Then** une entrée « La Sibra » y figure en dernière position et mène à la
   page de la brasserie.
2. **Given** un visiteur sur n'importe quelle page en mobile, **When** il ouvre le menu, **Then**
   l'entrée « La Sibra » est visible dans la liste et mène à la page de la brasserie.
3. **Given** un visiteur déjà sur la page de la brasserie, **When** il regarde la navigation,
   **Then** l'entrée « La Sibra » est marquée comme active, comme le sont les autres lieux sur leur
   propre page.
4. **Given** un visiteur qui parcourt le bas de n'importe quelle page, **When** il consulte la colonne
   des lieux du pied de page, **Then** « La Sibra » y figure aux côtés des cinq autres lieux et mène à
   la page de la brasserie.

---

### User Story 2 - Découvrir La Sibra parmi les lieux de la coopérative (Priority: P2)

Une visiteuse découvre la coopérative depuis la page d'accueil et parcourt la section « Nos lieux »
pour comprendre ce que Commun'île propose. La brasserie doit y figurer au même rang que les autres
lieux, avec une photo, son nom et ses horaires d'ouverture au survol — sans traitement visuel
particulier qui la distinguerait ou la reléguerait.

**Why this priority**: P2 — la section « Nos lieux » de l'accueil est le principal point d'entrée
éditorial vers les pages de lieux. Une brasserie absente de cette grille apparaît comme ne faisant
pas partie de la coopérative.

**Independent Test**: depuis la page d'accueil, en mobile et en desktop, repérer la carte de la
brasserie dans la section des lieux, la survoler pour lire ses horaires, puis cliquer pour atteindre
sa page.

**Acceptance Scenarios**:

1. **Given** un visiteur sur la page d'accueil, **When** il atteint la section des lieux, **Then**
   six cartes de lieux sont présentes, dont celle de la brasserie, chacune avec une photo, un nom et
   un lien vers sa page.
2. **Given** un visiteur en desktop sur la section des lieux, **When** il observe la grille, **Then**
   les six cartes forment une grille régulière de deux colonnes sur trois rangées, sans carte isolée,
   centrée ou de largeur différente des autres.
3. **Given** un visiteur qui survole la carte de la brasserie, **When** le contenu de survol
   apparaît, **Then** il affiche les horaires d'ouverture de la boutique, dans la même forme que les
   cinq autres cartes.
4. **Given** un visiteur en mobile sur la section des lieux, **When** il fait défiler, **Then** les
   six cartes s'empilent sur une seule colonne, toutes de même largeur.

---

### User Story 3 - Lire une présentation exacte d'À La Carte Postale (Priority: P2)

Une visiteuse consulte la page À La Carte Postale. Le texte de présentation ne doit pas affirmer que
ce restaurant est le dernier lieu né de la coopérative, puisque la brasserie est désormais publiée.
La formulation fournie par la coopérative situe le restaurant dans l'histoire du projet sans
prétendre à une antériorité devenue fausse.

**Why this priority**: P2 — exigence d'exactitude (constitution principe I). La mise en ligne de la
brasserie rend le paragraphe faux au moment même où elle a lieu ; les deux changements sont
indissociables.

**Independent Test**: ouvrir la page À La Carte Postale et vérifier que le paragraphe de présentation
emploie la formulation « quatrième restaurant » et qu'aucune formulation « dernier lieu » ne subsiste
nulle part sur le site.

**Acceptance Scenarios**:

1. **Given** un visiteur sur la page À La Carte Postale, **When** il lit le paragraphe de
   présentation final de la section « c'est quoi ? », **Then** il lit « C'est le quatrième restaurant
   de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une
   alimentation plus végétale et locale ! ».
2. **Given** l'ensemble du contenu publié du site, **When** on recherche la formulation « dernier
   lieu », **Then** aucune occurrence ne subsiste.
3. **Given** un visiteur sur la page À La Carte Postale, **When** il parcourt le reste de la page,
   **Then** la mise en forme, la typographie et la mise en page du paragraphe sont inchangées par
   rapport à la version précédente : seul le texte diffère.

---

### Edge Cases

- **Débordement de la navigation desktop** : la nav passe de 6 à 7 entrées. Au point de bascule où
  la nav desktop apparaît (grand écran), les sept entrées doivent tenir sur une seule ligne sans
  débordement, chevauchement ni retour à la ligne. Si elles ne tiennent pas, la réduction des
  espacements ou des marges internes des entrées est le levier prévu ; le raccourcissement du
  libellé est un dernier recours à signaler.
- **Menu mobile à 7 entrées** : le menu mobile est une liste verticale dans un panneau à hauteur
  limitée. La septième entrée ne doit pas rendre la dernière entrée inatteignable ; le panneau doit
  rester défilable et toutes les entrées accessibles au clavier.
- **Grille des lieux à un nombre pair** : la carte À La Carte Postale portait un traitement de
  centrage qui n'existait que parce que cinq cartes ne remplissent pas une grille à deux colonnes.
  Avec six cartes, ce traitement doit disparaître, sans quoi la dernière rangée reste déséquilibrée.
- **Contenu de survol d'une carte sur écran tactile** : le survol n'existe pas au toucher ; la carte
  doit rester entièrement cliquable et mener à la page du lieu, comme les cinq cartes existantes.
- **Format de l'image de la carte** : l'illustration de la brasserie destinée à cette grille est déjà
  recadrée au format paysage utilisé par les cinq autres cartes ; elle ne doit pas subir de
  recadrage supplémentaire qui couperait le sujet.

## Requirements *(mandatory)*

### Functional Requirements

#### Navigation principale (T016)

- **FR-001**: La navigation principale DOIT comporter une entrée « La Sibra » pointant vers la page
  de la brasserie, en **dernière position**, après « À La Carte Postale ».
- **FR-002**: Cette entrée DOIT apparaître à la fois dans la navigation desktop et dans le menu
  mobile, sans duplication de la liste des entrées : une source unique alimente les deux rendus.
- **FR-003**: L'entrée DOIT adopter le même état actif que les autres entrées lorsque le visiteur se
  trouve sur la page correspondante.
- **FR-004**: Les sept entrées DOIVENT tenir sur une seule ligne dans la navigation desktop, sans
  débordement horizontal ni chevauchement, au point de bascule où celle-ci s'affiche.
- **FR-005**: Le menu mobile DOIT rester fonctionnel avec sept entrées : ouverture, fermeture,
  fermeture au clavier, et accès à chacune des sept entrées.

#### Pied de page (T017)

- **FR-006**: La colonne des lieux du pied de page DOIT comporter une entrée « La Sibra » pointant
  vers la page de la brasserie, en dernière position, dans la même forme que les cinq entrées
  existantes.

#### Section des lieux de l'accueil (T018)

- **FR-007**: La section des lieux de la page d'accueil DOIT comporter une sixième carte de lieu
  pour la brasserie, en dernière position.
- **FR-008**: Cette carte DOIT utiliser l'illustration de la brasserie déjà présente dans les assets
  du site, accompagnée d'un texte alternatif en français décrivant ce que montre la photo.
- **FR-009**: L'étiquette de la carte DOIT afficher « La Sibra » dans la teinte verte, en rappel de
  la charte de la brasserie, en réutilisant une teinte déjà supportée par le site.
- **FR-010**: Le contenu de survol de la carte DOIT afficher les horaires d'ouverture de la boutique
  de la brasserie — vendredi 16 h – 20 h et samedi 11 h – 20 h — dans la même forme que les autres
  cartes (intitulé « Horaires d'ouverture » puis la plage).
- **FR-011**: Le traitement de centrage spécifique appliqué à la carte À La Carte Postale (carte
  isolée sur la dernière rangée) DOIT être retiré, afin que les six cartes forment une grille
  régulière de deux colonnes sur trois rangées en desktop et une colonne en mobile.
- **FR-012**: Les cinq cartes existantes DOIVENT rester inchangées quant à leur ordre, leur image,
  leur texte alternatif, leur teinte d'étiquette et leurs horaires de survol — le seul changement
  autorisé est le retrait de la classe de centrage sur la carte À La Carte Postale.

#### Page À La Carte Postale (T018b)

- **FR-013**: Le paragraphe de présentation final de la section « À La Carte Postale, c'est quoi ? »
  DOIT énoncer exactement : « C'est le quatrième restaurant de la coopérative, une brique
  supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et
  locale ! ».
- **FR-014**: Aucune occurrence de la formulation « dernier lieu » NE DOIT subsister dans le contenu
  publié du site.
- **FR-015**: Le reste de la page À La Carte Postale — mise en forme du paragraphe comprise — DOIT
  rester strictement inchangé.

#### Contraintes transverses

- **FR-016**: Aucun numéro de téléphone ni adresse e-mail de la brasserie NE DOIT être introduit par
  cette évolution, sous quelque forme que ce soit (texte, lien d'appel, lien de courriel) — ces
  coordonnées restent non confirmées et sous gate humain.
- **FR-017**: Les surfaces touchées étant publiées, le périmètre des modifications DOIT rester limité
  aux quatre fichiers concernés ; aucun refactoring, renommage, réorganisation ou « amélioration »
  non demandée NE DOIT accompagner cette évolution.
- **FR-018**: Les autres pages de lieux (Le Wattignies, Les Landes Fertiles, Le Labo Diva, Le Bar'Île,
  À La Carte Postale) DOIVENT rester fonctionnellement et visuellement inchangées, hors le seul
  paragraphe de FR-013.

### Non-Goals (hors périmètre de cette issue)

- Métadonnées SEO, données structurées, sitemap et fichier d'indexation de la page de la brasserie
  (issue #63).
- Polish visuel, passes d'accessibilité globales, ajustements de contraste hors de ce qui est
  nécessaire aux ajouts de cette issue (issue #66).
- Confirmation du téléphone, de l'e-mail et des repères d'accès (issue #67).
- Toute modification du contenu de la page `/la-sibra` elle-même.
- Toute refonte de la navigation (menu déroulant « Nos lieux », regroupements, etc.) : rejetée en
  research R7 comme hors périmètre.
- Toute modification du nombre de colonnes de la grille des lieux : la grille reste à deux colonnes
  en desktop.

### Key Entities

- **Entrée de navigation** : un libellé et une destination ; la liste ordonnée de ces entrées
  alimente à l'identique la navigation desktop et le menu mobile.
- **Carte de lieu** : une illustration avec son texte alternatif, un nom affiché sur une étiquette
  colorée, une destination, et un contenu de survol portant les horaires d'ouverture.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Depuis n'importe laquelle des huit pages publiques du site, un visiteur atteint la page
  de la brasserie en **un seul clic** via la navigation, en desktop comme en mobile (SC-003 de la
  spec de l'epic).
- **SC-002**: Depuis la page d'accueil, un visiteur atteint la page de la brasserie en un seul clic
  depuis la section des lieux.
- **SC-003**: La section des lieux présente **six** cartes, disposées en trois rangées de deux en
  desktop et en une colonne en mobile, toutes de largeur identique.
- **SC-004**: Aux deux largeurs de référence du projet — 375 px et 1280 px — aucune des quatre
  surfaces touchées (navigation, pied de page, section des lieux, page À La Carte Postale) ne
  présente de débordement horizontal, de chevauchement ni de texte tronqué.
- **SC-005**: Une recherche de la formulation « dernier lieu » sur l'ensemble du contenu publié
  retourne **zéro** occurrence.
- **SC-006**: Les cinq pages de lieux préexistantes et la page d'accueil s'affichent sans différence
  visuelle par rapport à avant l'évolution, à l'exception de l'ajout de la septième entrée de
  navigation, de l'entrée de pied de page, de la sixième carte, du repositionnement de la carte À La
  Carte Postale dans la grille, et du paragraphe de FR-013.
- **SC-007**: Le nombre de fichiers du site modifiés par cette évolution est de **quatre** :
  navigation, pied de page, section des lieux de l'accueil, section de présentation d'À La Carte
  Postale.

## Assumptions

- L'illustration de la brasserie destinée à la carte d'accueil (`la-sibra-card.webp`) a été livrée
  par l'issue #59 et est déjà recadrée au format paysage attendu par les cartes de lieux ; aucun
  nouvel asset n'est requis.
- Le chemin de la page de la brasserie et sa constante de routage existent déjà (issue #59) ; cette
  évolution ne fait que les référencer.
- Les horaires de la boutique affichés au survol de la carte reprennent ceux déjà publiés sur la
  page de la brasserie (issue #61), source unique de vérité : vendredi 16 h – 20 h, samedi
  11 h – 20 h. Ils sont volontairement recopiés plutôt que factorisés, par cohérence avec les cinq
  cartes existantes qui portent elles aussi leurs horaires en clair (le principe de moindre
  modification prime sur la factorisation ici).
- La teinte verte demandée pour l'étiquette est déjà utilisée par la carte du Labo Diva en
  production ; son contraste est donc celui d'un usage existant et validé, et l'ajout d'une teinte
  dédiée à la charte de la brasserie n'est pas requis (research R8).
- Le libellé « La Sibra » compte huit caractères, soit le plus court de la navigation après « Le
  Bar'Île » ; le risque de débordement de la navigation desktop est jugé faible, mais la vérification
  visuelle reste obligatoire (research R7, edge case de la spec de l'epic).
- Conformément à la règle de nommage de l'epic (research R1), l'article ne figure que dans ce qui
  dérive de l'URL ; le libellé affiché « La Sibra » est le nom propre du lieu et s'écrit ainsi
  partout.
