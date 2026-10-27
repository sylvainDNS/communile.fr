# Feature Specification: Tarifs et plaquette du Labo Diva

**Feature Branch**: `004-labo-diva-tarifs-plaquette`

**Created**: 2026-10-27

**Status**: Draft

**Input**: User description: "https://github.com/sylvainDNS/communile.fr/issues/87" (issue « Changement Labo Diva »)

## Contexte

Le Labo Diva demande deux modifications de la section « Privatisation et location » de sa page (`/le-labo-diva`), transmises le 08/10/2026 :

1. dans « Location d'une salle au Labo », retirer les tarifs demi-journée et journée et ne garder que « À partir de 20€ HT / heure » ;
2. remplacer la plaquette proposée par le lien « Télécharger notre plaquette détaillée ! » par la nouvelle plaquette commerciale 2026, jointe à l'issue (`PLAQUETTE COMMERCIALE 2026.pdf`, ~3,4 Mo).

État actuel constaté :

- trois badges tarifaires s'affichent : « À partir de >20€ HT/heure » (avec un `>` parasite), « À partir de 75€ HT/ demi-journée », « À partir de 140€ HT/ journée » ;
- le lien de téléchargement pointe vers la plaquette du 11/06/2026, hébergée hors dépôt sur l'espace de fichiers publics de la coopérative (même emplacement que la plaquette de La Carte Postale) ;
- la description de la carte « Location d'une salle au Labo » contient une phrase dupliquée (« …ou tout autre projet !s évènements réguliers (cours de danse, session de chant,...) ou tout autre projet ! »).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Voir le tarif horaire à jour (Priority: P1)

Une personne qui envisage de louer la salle du Labo Diva consulte la section « Privatisation et location » et voit un seul tarif indicatif : « À partir de 20€ HT / heure ». Les anciens tarifs demi-journée et journée n'apparaissent plus.

**Why this priority**: c'est une information tarifaire publiée. Les anciens tarifs ne sont plus proposés par le Labo Diva : les laisser en ligne expose la coopérative à des demandes sur des prix qu'elle ne pratique plus (principe I de la constitution).

**Independent Test**: ouvrir `/le-labo-diva` et lire les badges de la carte « Location d'une salle au Labo ».

**Acceptance Scenarios**:

1. **Given** la page `/le-labo-diva`, **When** une personne lit la carte « Location d'une salle au Labo », **Then** elle voit exactement un badge tarifaire, libellé « À partir de 20€ HT / heure ».
2. **Given** la page `/le-labo-diva`, **When** on cherche « demi-journée », « 75€ » ou « 140€ » dans la page, **Then** aucun résultat n'est trouvé.
3. **Given** la carte « Location d'une salle au Labo », **When** on la lit, **Then** les badges d'équipement et de services (45m2, vidéo-projecteur, paperboard, wifi, petit déjeuner, collation, déjeuner) restent affichés sans changement.

---

### User Story 2 - Télécharger la nouvelle plaquette (Priority: P1)

Une personne intéressée clique sur « Télécharger notre plaquette détaillée ! » et récupère la plaquette commerciale 2026 du Labo Diva.

**Why this priority**: la plaquette est le support commercial détaillé. Distribuer l'ancienne version (qui contient vraisemblablement les anciens tarifs) contredirait la correction de la story 1.

**Independent Test**: cliquer sur le lien depuis la page en production et comparer le fichier obtenu avec celui joint à l'issue #87.

**Acceptance Scenarios**:

1. **Given** la page `/le-labo-diva`, **When** une personne clique sur « Télécharger notre plaquette détaillée ! », **Then** le fichier téléchargé est identique (même contenu, octet pour octet) à la plaquette jointe à l'issue #87.
2. **Given** le lien de la plaquette, **When** on l'ouvre, **Then** il répond avec succès et un document PDF, sans erreur ni redirection vers une page introuvable.
3. **Given** le libellé du lien, **When** on le lit, **Then** il reste « Télécharger notre plaquette détaillée ! » et le fichier reste proposé au téléchargement, comme aujourd'hui.

---

### User Story 3 - Lire une description sans doublon (Priority: P3)

La personne lit la description de la carte « Location d'une salle au Labo » sans la phrase répétée.

**Why this priority**: correction de contenu mineure, dans la même carte que la story 1. Elle ne fait pas partie de la demande du Labo Diva mais relève du principe I (exactitude et français correct). Retenue le 2026-10-27 ; elle reste indépendante des stories 1 et 2.

**Independent Test**: lire la description de la carte sur `/le-labo-diva`.

**Acceptance Scenarios**:

1. **Given** la carte « Location d'une salle au Labo », **When** on lit sa description, **Then** la mention des évènements réguliers (cours de danse, session de chant…) et « ou tout autre projet ! » n'apparaissent qu'une fois, et le fragment « !s » a disparu.

---

### Edge Cases

- **Ancien lien de plaquette** : des personnes ont pu enregistrer ou partager l'URL de l'ancienne plaquette. Le fichier existant reste en place (pas de suppression) ; seul le lien du site change.
- **Cache navigateur ou CDN** : la nouvelle plaquette est publiée sous un nom de fichier nouveau (daté), pour qu'aucun visiteur ne reçoive l'ancienne version depuis un cache.
- **Poids du fichier** : la plaquette pèse environ 3,4 Mo. C'est un téléchargement explicite, sans effet sur le poids de la page ; aucune optimisation n'est exigée.
- **Ordre de publication** : si le site est mis en ligne avant le fichier, le lien est cassé. Le fichier DOIT être disponible avant le déploiement du site.
- **Affichage mobile** : retirer deux badges raccourcit la liste ; la mise en forme des badges restants ne doit pas se dégrader (retour à la ligne, alignement) sur mobile comme sur desktop.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La carte « Location d'une salle au Labo » DOIT afficher un seul badge tarifaire, au libellé exact « À partir de 20€ HT / heure ».
- **FR-002**: Les tarifs « À partir de 75€ HT/ demi-journée » et « À partir de 140€ HT/ journée » DOIVENT disparaître de la page.
- **FR-003**: Les autres badges des cartes « Location d'une salle au Labo » et « Privatisation du Labo Diva » NE DOIVENT PAS changer.
- **FR-004**: Le lien « Télécharger notre plaquette détaillée ! » DOIT pointer vers `https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf`, la plaquette commerciale 2026 jointe à l'issue #87.
- **FR-005**: La nouvelle plaquette DOIT être accessible publiquement avant la mise en ligne du lien qui y renvoie. *(Fait le 2026-10-27 : le fichier répond 200, `application/pdf`, et son empreinte MD5 `ae9e5d479f015d9490e91e96b877460c` est celle de la pièce jointe.)*
- **FR-006**: L'ancienne plaquette NE DOIT PAS être supprimée de l'espace de fichiers.
- **FR-007**: Le libellé du lien et son comportement (téléchargement, ouverture dans un nouvel onglet) NE DOIVENT PAS changer.
- **FR-008**: La phrase dupliquée de la description « Location d'une salle au Labo » DOIT être corrigée (story 3, P3).

### Key Entities

- **Badge tarifaire** : mention de prix indicatif affichée dans la carte de location ; un seul après la modification.
- **Plaquette commerciale** : document PDF de présentation détaillée du Labo Diva, hébergé hors dépôt et référencé par le lien de la section.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Sur `/le-labo-diva` en production, 0 occurrence de « demi-journée », « 75€ » et « 140€ » ; 1 occurrence de « À partir de 20€ HT / heure ».
- **SC-002**: Le fichier obtenu en cliquant sur le lien de la plaquette est identique à celui joint à l'issue #87 (même empreinte de contenu).
- **SC-003**: Le lien de la plaquette répond avec succès dans 100 % des essais après mise en ligne.
- **SC-004**: La relecture visuelle de la section, sur mobile et sur desktop, ne montre aucune régression de mise en page.
- **SC-005**: Le Labo Diva (via Sarah) valide la page en ligne sans demande de correction supplémentaire sur ces deux points.

## Assumptions

- Le contenu de la nouvelle plaquette est validé par le Labo Diva ; il est publié tel quel, sans relecture de fond ni retouche. La cohérence de ses tarifs avec le badge « 20€ HT / heure » n'a pas été vérifiée lors de la rédaction de cette spec (PDF non lu) : elle est à contrôler à l'œil avant publication.
- La typographie « 20€ HT / heure » (sans espace avant €, espaces autour de la barre) reprend la formulation de la demande, avec un espacement harmonisé par rapport aux badges actuels.
- La plaquette reste hébergée sur l'espace de fichiers publics existant (pratique déjà en place pour Le Labo Diva et La Carte Postale). Le fichier a été publié manuellement le 2026-10-27.

## Clarifications

### Session 2026-10-27

- Q : On garde la correction du doublon de texte (story 3) ? → R : Oui ; FR-008 devient obligatoire.
- Q : Quel nom de fichier pour la nouvelle plaquette ? → R : `LABO_DIVA_2026_10_27.pdf`, déjà en ligne à `https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf`.

### Hors périmètre

- Le nouveau nom et le nouveau logo de la brasserie évoqués dans le même message : travail distinct, à cadrer séparément.
- Toute autre modification de la page du Labo Diva (textes, images, coworking, privatisation).
- La suppression de l'ancienne plaquette de l'espace de fichiers.
