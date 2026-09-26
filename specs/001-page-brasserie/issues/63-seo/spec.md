# Feature Specification: Découvrabilité moteurs de La Sibra (JSON-LD, sitemap, robots.txt)

**Feature Branch**: `001-page-brasserie-seo`

**Created**: 2026-09-19

**Status**: Draft

**Issue**: [#63](https://github.com/sylvainDNS/communile.fr/issues/63) — US5b (T019–T021), epic `001-page-brasserie`

**Input**: User description: "Issue #63 — US5b (T019–T021) : découvrabilité moteurs de La Sibra. JSON-LD Brewery complet sur /la-sibra (name « La Sibra », alternateName « Les Bières de Charlotte », adresse postale confirmée, geo 47.225406/-1.543878, horaires ven 16–20 h et sam 11–20 h, sameAs Instagram — sans telephone ni email, non confirmés et sous gate humain #67), description de page définitive ≤ 160 caractères mentionnant les horaires boutique, image OG ; endpoint /sitemap.xml maison listant les 8 pages publiques ; public/robots.txt référençant le sitemap."

## Contexte

La page `/la-sibra` est complète côté contenu (issues #59, #60, #61, #64, #65 mergées dans l'epic). Elle n'est en revanche pas encore découvrable par les moteurs de recherche : ses métadonnées sont provisoires (pas de données structurées, pas d'image de partage), et le site **entier** n'expose aujourd'hui ni sitemap ni `robots.txt`.

Enjeu métier (edge case de la spec de l'epic) : l'ancien domaine `lesbieresdecharlotte.fr` est détourné. Le site doit s'imposer comme la référence pour les recherches sur « Les Bières de Charlotte » **comme** sur « La Sibra ».

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Retrouver la brasserie via un moteur de recherche (Priority: P1)

Une personne cherche « Les Bières de Charlotte Nantes » ou « La Sibra brasserie Nantes » sur un moteur de recherche. Le résultat pointe vers `/la-sibra` avec un titre et un résumé exacts, et le moteur dispose des données structurées (type brasserie, adresse, position, horaires d'ouverture de la boutique) lui permettant d'afficher un encart enrichi et de placer le lieu sur ses cartes.

**Why this priority**: c'est la raison d'être de l'issue — la découvrabilité externe face à l'ancien domaine détourné.

**Independent Test**: ouvrir le code source de `/la-sibra`, vérifier `title`, `description`, balises Open Graph et bloc de données structurées ; passer le bloc dans un validateur schema.org et constater 0 erreur.

**Acceptance Scenarios**:

1. **Given** la page `/la-sibra` publiée, **When** un moteur lit son code source, **Then** il y trouve un bloc de données structurées de type brasserie portant le nom « La Sibra » et le nom alternatif « Les Bières de Charlotte ».
2. **Given** ce bloc de données structurées, **When** il est soumis au validateur schema.org, **Then** aucune erreur n'est remontée.
3. **Given** ce bloc, **When** on l'inspecte, **Then** il contient l'adresse postale, les coordonnées géographiques, les deux plages d'ouverture de la boutique (vendredi et samedi) et le lien Instagram du lieu.
4. **Given** ce bloc, **When** on y cherche un numéro de téléphone ou une adresse e-mail, **Then** aucun n'est présent (coordonnées non confirmées, gate humain #67).

---

### User Story 2 - Partager le lien de la page (Priority: P2)

Une personne partage `https://communile.fr/la-sibra` dans une conversation ou sur un réseau social. L'aperçu affiche une photo du lieu, le nom de la page et un résumé exact mentionnant les horaires de la boutique.

**Why this priority**: le partage social est un canal d'acquisition secondaire mais immédiat ; il s'appuie sur les mêmes métadonnées que US1.

**Independent Test**: inspecter les balises `og:*` / `twitter:*` du code source de `/la-sibra` et vérifier que l'image pointe vers une photo du lieu (et non le logo par défaut).

**Acceptance Scenarios**:

1. **Given** la page `/la-sibra`, **When** un agrégateur lit ses métadonnées de partage, **Then** l'image est une photo du lieu optimisée et non le logo générique du site.
2. **Given** la description de la page, **When** on la mesure, **Then** elle fait au plus 160 caractères, mentionne « anciennement Les Bières de Charlotte » et les horaires de la boutique.

---

### User Story 3 - Explorer l'ensemble du site (Priority: P2)

Un robot d'indexation arrive sur `https://communile.fr`. Il lit `/robots.txt`, y trouve l'autorisation d'indexer et l'adresse du sitemap, puis récupère `/sitemap.xml` qui lui donne la liste complète des pages publiques du site.

**Why this priority**: le site n'a aujourd'hui **aucun** sitemap ni `robots.txt` ; c'est un manque global qui dépasse la seule page La Sibra et que la constitution (principe III) exige de combler.

**Independent Test**: requêter `/robots.txt` et `/sitemap.xml` sur le site servi et vérifier codes de statut, types de contenu et contenus attendus.

**Acceptance Scenarios**:

1. **Given** le site servi, **When** on requête `/robots.txt`, **Then** la réponse autorise l'indexation et contient une ligne pointant vers `https://communile.fr/sitemap.xml`.
2. **Given** le site servi, **When** on requête `/sitemap.xml`, **Then** la réponse a un statut 200, un type de contenu XML, et liste exactement les 8 pages publiques en URLs absolues.
3. **Given** le sitemap, **When** on y cherche la page d'erreur 404 ou une URL avec ancre (`/#...`), **Then** aucune n'est présente.
4. **Given** le sitemap et les balises canoniques des pages, **When** on compare les URLs, **Then** elles sont identiques caractère pour caractère (pas de barre oblique finale d'un côté et pas de l'autre).

---

### Edge Cases

- **Ajout d'une page publique ultérieure** : le sitemap doit se mettre à jour depuis la source de vérité des routes du site, sans duplication manuelle d'une liste d'URLs.
- **Entrées de navigation avec ancre** (`/#qui-sommes-nous`, etc.) : elles partagent la même page que l'accueil et ne doivent pas produire de doublons dans le sitemap.
- **Coordonnées non confirmées** : téléphone et e-mail issus d'une archive web ne sont pas vérifiés ; les publier violerait le principe I de la constitution. Ils sont donc omis, y compris des données structurées, jusqu'à levée du gate #67.
- **Page 404** : ne doit jamais figurer dans le sitemap.
- **Ancien nom** : les visiteurs cherchent encore « Les Bières de Charlotte » ; ce nom doit rester présent dans les métadonnées sans usurper le nom actuel.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La page `/la-sibra` DOIT exposer des données structurées de type brasserie décrivant le lieu.
- **FR-002**: Ces données DOIVENT porter « La Sibra » comme nom principal et « Les Bières de Charlotte » comme nom alternatif.
- **FR-003**: Ces données DOIVENT inclure l'adresse postale confirmée (121 rue du Général Buat, 44000 Nantes, France), les coordonnées géographiques vérifiées (latitude 47.225406, longitude −1.543878) et l'adresse de la page.
- **FR-004**: Ces données DOIVENT décrire les horaires d'ouverture de la boutique : vendredi 16 h–20 h et samedi 11 h–20 h.
- **FR-005**: Ces données DOIVENT référencer le compte Instagram du lieu comme profil associé.
- **FR-006**: Ces données NE DOIVENT PAS contenir de numéro de téléphone ni d'adresse e-mail tant que ces coordonnées ne sont pas confirmées (gate #67, constitution principe I).
- **FR-007**: Ces données DOIVENT être valides au sens de schema.org — 0 erreur au validateur (FR-010 de la spec de l'epic).
- **FR-008**: La description de `/la-sibra` DOIT faire au plus 160 caractères, être factuelle, mentionner l'ancien nom et les horaires de la boutique.
- **FR-009**: La page DOIT déclarer une photo du lieu comme image de partage.
- **FR-010**: Le site DOIT servir un sitemap à l'adresse `/sitemap.xml`, avec un type de contenu XML.
- **FR-011**: Le sitemap DOIT lister exactement les 8 pages publiques du site (accueil, les 6 pages de lieux, contact), en URLs absolues, sans la page 404 ni les entrées à ancre.
- **FR-012**: Les URLs du sitemap DOIVENT être dérivées de la source de vérité des routes déjà utilisée par le site, et non recopiées à la main.
- **FR-013**: Les URLs du sitemap DOIVENT coïncider exactement avec les URLs canoniques déclarées par les pages.
- **FR-014**: Le site DOIT servir un `/robots.txt` autorisant l'indexation et déclarant l'adresse du sitemap.
- **FR-015**: Les modifications NE DOIVENT PAS toucher au contenu, à la mise en page ni à la navigation existants (périmètre strictement métadonnées + fichiers de découvrabilité).

### Key Entities

- **Fiche lieu structurée (La Sibra)** : représentation lisible par machine du lieu — nom, nom alternatif, description, adresse de page, image, adresse postale, position géographique, plages d'ouverture, profils sociaux. Publie uniquement des faits vérifiés.
- **Page publique** : une adresse du site destinée aux visiteurs et à l'indexation. Exclut la page d'erreur et les ancres internes.
- **Sitemap** : liste des pages publiques exposée aux robots d'indexation, dérivée des routes du site.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Les données structurées de `/la-sibra` passent le validateur schema.org avec 0 erreur.
- **SC-002**: `/sitemap.xml` répond en 200 avec un type de contenu XML et contient exactement 8 adresses.
- **SC-003**: `/robots.txt` répond en 200 et sa ligne de sitemap pointe vers une adresse qui répond elle-même en 200.
- **SC-004**: La description de `/la-sibra` fait au plus 160 caractères et contient à la fois l'ancien nom et les deux plages horaires de la boutique.
- **SC-005**: Aucune des coordonnées sous gate humain (téléphone, e-mail) n'apparaît dans le code source publié de la page.
- **SC-006**: 100 % des URLs du sitemap correspondent à une page qui déclare la même URL comme canonique.
- **SC-007**: Le build et le lint du projet restent verts ; aucune page existante n'est modifiée visuellement.

## Assumptions

- L'adresse postale du lieu est confirmée (issue #61) ; les coordonnées géographiques proviennent de la Base Adresse Nationale (identifiant `44109_3556_00121`) et sont vérifiées.
- Les horaires de boutique retenus sont ceux déjà affichés sur la page : vendredi 16 h – 20 h, samedi 11 h – 20 h.
- Le compte Instagram de référence est celui déjà utilisé par la page (`bieresdecharlotte`) : le compte n'a pas été renommé.
- Le site est servi sur `https://communile.fr` ; les URLs canoniques n'ont pas de barre oblique finale (comportement actuel du layout partagé).
- Le contrat `contracts/page-et-seo.md` de l'epic fait foi pour la structure des données, **à l'exception** des champs `telephone` et `email` qu'il annote lui-même « à confirmer avant mise en ligne » et que le gate #67 n'a pas levés.
- La liste des pages publiques est stable à 8 entrées au moment de la livraison.

## Out of Scope

- Navigation, pied de page et section « nos lieux » de l'accueil (issue #62, en cours).
- Passe de polish final et revue design (issue #66).
- Publication du téléphone et de l'e-mail (gate humain #67).
- Modification du mode de rendu du site ou de sa configuration de build.
- Données structurées des autres pages du site (déjà en place, non revues ici).
