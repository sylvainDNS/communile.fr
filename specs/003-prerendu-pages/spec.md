# Feature Specification: Prérendu des pages

**Feature Branch**: `003-prerendu-pages`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "prérendu des pages (voir le handoff /var/folders/t8/8w6x338s73344h53yg9mgrqh0000gn/T/communile-prerendu-handoff.md)"

## Contexte

Depuis la mise à jour du framework (spec 002), toutes les pages du site sont
calculées à chaque visite, alors que leur contenu est identique pour tous les
visiteurs : ni compte, ni panier, ni donnée dépendant de la requête. Cet écart
au principe II de la constitution (« Chaque page DOIT être générée statiquement
sauf besoin démontré ») a été accepté temporairement sous forme de dérogations
documentées dans `specs/002-astro-upgrade/plan.md` :

- **D1** : les pages sont rendues à la demande sans besoin démontré ;
- **D2** : les images ne sont pas redimensionnées. Chaque visiteur reçoit le
  fichier source, y compris en mobile : l'illustration de la page d'accueil
  pèse 1,3 Mo ;
- **D3** : le sitemap exigé par le principe III n'est pas publié.

Cette évolution génère les pages une fois pour toutes, au moment de la
construction du site, et les sert directement comme des fichiers. Elle résorbe
D1, D2 et D3.

Gains attendus : pages servies sans calcul ni démarrage à froid, images
adaptées à la taille d'écran (page plus légère, surtout en 3G), et visites qui
ne consomment plus le quota de requêtes de l'hébergeur.

## Clarifications

### Session 2026-09-27

- Q: Site entièrement statique ou adaptateur conservé avec pages prérendues ? → A: adaptateur conservé, toutes les pages prérendues (FR-012). Pas d'amendement de la constitution.
- Q: Le sitemap (D3) fait-il partie de cette évolution ? → A: oui (FR-015).
- Q: L'image de partage et le logo par défaut, en 404, sont-ils corrigés ici ? → A: oui (FR-016).
- Q (implémentation) : que faire de `/contact`, qui contient un numéro factice et des horaires génériques, et qu'aucune page ne lie ? → A: la supprimer. C'est un reliquat du développement initial (commit `3801584`, 2025-09-08), jamais rempli, contraire au principe I. `/contact` répond désormais 404. Il reste 7 pages publiques, 404 comprise, dont 6 indexables.
- Changements hors tâches initiales, issus de la revue de code : pas de canonique ni d'`og:url` sur les pages `noindex`, car une page prérendue ne connaît pas l'URL demandée (FR-007) ; filtre de sitemap exact sur `/404` ; `getLogoUrl` mémoïsé (commit `6557f7d`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Le visiteur mobile reçoit des pages plus légères (Priority: P1)

Un visiteur ouvre le site sur son téléphone, souvent avec une connexion lente.
Les images qu'il reçoit sont dimensionnées pour son écran, et non plus les
fichiers sources pleine taille. La page s'affiche plus vite, avec le même
contenu et le même rendu qu'avant.

**Why this priority**: c'est le gain le plus visible pour le public et le cœur
du principe III (images optimisées, pages légères). La dérogation D2 pénalise
aujourd'hui surtout les visiteurs mobiles.

**Independent Test**: sur un déploiement de prévisualisation, charger chaque
page publique en largeur mobile (390 px) et desktop (1440 px), relever le poids
des images transférées et comparer les captures à la référence de production.

**Acceptance Scenarios**:

1. **Given** le site prérendu en prévisualisation, **When** un visiteur mobile ouvre la page d'accueil, **Then** chaque image reçue a une largeur adaptée à son affichage et non la largeur du fichier source.
2. **Given** le site prérendu, **When** un visiteur ouvre chacune des pages publiques en mobile et en desktop, **Then** le contenu, la mise en page et le rendu visuel sont identiques à la production actuelle.
3. **Given** une page avec carte interactive ou animations, **When** le visiteur interagit avec, **Then** le comportement est identique à la production actuelle.

---

### User Story 2 - Les pages sont servies sans calcul à la demande (Priority: P1)

Chaque page publique est produite une seule fois, lors de la construction du
site. Une visite ne déclenche plus aucun calcul côté hébergeur : la page est
livrée telle quelle, sans délai de démarrage et sans consommer le quota de
requêtes.

**Why this priority**: c'est la mise en conformité avec le principe II
(résorption de D1). C'est aussi le prérequis technique de l'optimisation des
images (US1).

**Independent Test**: après construction, vérifier que chaque page publique
existe sous forme de fichier généré. Après déploiement, vérifier que les pages
répondent sans que l'hébergeur ne comptabilise d'exécution de code.

**Acceptance Scenarios**:

1. **Given** le site construit, **When** on inspecte le résultat de la construction, **Then** chacune des 7 pages publiques (page 404 comprise) est présente sous forme de page générée.
2. **Given** le site déployé, **When** un visiteur demande une page publique, **Then** elle est servie sans exécution de code côté hébergeur.
3. **Given** une URL inexistante, **When** un visiteur la demande, **Then** la page 404 personnalisée s'affiche avec un statut 404.

---

### User Story 3 - Les moteurs de recherche découvrent toutes les pages (Priority: P2)

Un moteur de recherche qui explore le site trouve la liste de toutes les pages
publiques dans un sitemap, et chaque page annonce son URL canonique et son image
de partage, qui s'affiche correctement.

**Why this priority**: le principe III impose le sitemap et les métadonnées
SEO. La découvrabilité locale est le principal canal d'acquisition. Moins
urgent que US1 et US2, car le référencement actuel fonctionne déjà sans
sitemap.

**Independent Test**: demander le sitemap du site déployé et vérifier qu'il
liste exactement les pages publiques indexables, aux URL canoniques. Pour
chaque page, vérifier que l'image de partage déclarée répond.

**Acceptance Scenarios**:

1. **Given** le site déployé, **When** un robot demande le sitemap, **Then** il reçoit la liste des pages publiques indexables, à leurs URL canoniques, sans la page 404.
2. **Given** une page publique, **When** un réseau social récupère son image de partage, **Then** l'image déclarée existe et est servie (aujourd'hui, l'image par défaut de `/contact` et de la 404, le logo des données structurées par défaut et l'image des données structurées des 5 pages lieux répondent 404).

---

### Edge Cases

- **URL avec slash final** (`/le-wattignies/`) : aujourd'hui elle répond 200. Après
  prérendu, elle redirige vers l'URL canonique sans slash (`/le-wattignies`). Ce
  changement est accepté : il aligne les URL servies sur les URL canoniques
  déclarées.
- **Page 404** : elle doit garder son statut 404 et ne pas être servie en 200
  (ce qui serait un « soft 404 » pour les moteurs de recherche).
- **Lien de navigation actif** : l'en-tête met en évidence la page courante.
  Ce repère doit rester correct sur chaque page, puisque la page n'est plus
  calculée au moment de la requête.
- **URL absolues** (image de partage, URL canonique, données structurées) :
  elles doivent pointer vers `https://communile.fr` et jamais vers l'adresse de
  la machine de construction.
- **Proxy d'analytics** (`/mix/*`) : il est servi par un autre service, qu'on
  ne modifie jamais. Il doit continuer à répondre après le changement de mode
  de service. La vérification se limite au script
  (`/mix/load/script.js` → 200), sans jamais envoyer d'événement de test.
- **En-têtes existants** (`public/_headers`, dont le `noindex` des URL de
  prévisualisation) : ils doivent continuer à s'appliquer aux pages servies
  comme fichiers.
- **Page en cours sur un autre epic** (La Sibra, `001-page-brasserie`) : elle
  n'est pas dans le périmètre de vérification. Une fois rebasée, elle devra
  être prérendue elle aussi, et les conflits prévisibles sont signalés.
- **Mesures de performance en connexion lente** : les mesures locales sont
  bruitées. Les comparaisons avant/après alternent les mesures ou reposent sur
  le poids transféré, plus stable que les temps.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Chaque page publique existante (7 pages, 404 comprise, après suppression de `/contact`, voir Clarifications) DOIT être générée au moment de la construction du site et servie telle quelle, sans calcul à la demande.
- **FR-002**: Toutes les pages publiques DOIVENT rester accessibles à leurs URL canoniques actuelles (sans slash final), avec un contenu et un rendu visuel identiques à la production actuelle, en mobile comme en desktop.
- **FR-003**: Une URL de page avec slash final DOIT rediriger vers l'URL canonique sans slash final.
- **FR-004**: Une URL inexistante DOIT afficher la page 404 personnalisée avec un statut HTTP 404.
- **FR-005**: Les images DOIVENT être servies en versions redimensionnées aux largeurs déjà déclarées par les pages. Un visiteur ne DOIT plus recevoir le fichier source pleine taille quand une largeur plus petite est déclarée.
- **FR-006**: Les images DOIVENT conserver leur format moderne actuel et leurs dimensions déclarées, pour éviter tout décalage de mise en page.
- **FR-007**: Les métadonnées SEO existantes (titres, descriptions, URL canoniques, données structurées) DOIVENT être préservées. Toutes les URL absolues DOIVENT pointer vers le domaine de production.
- **FR-008**: Les interactions existantes (carte, animations, navigation et repère de page active) DOIVENT fonctionner à l'identique.
- **FR-009**: Les en-têtes HTTP aujourd'hui appliqués aux pages (dont le `noindex` des URL de prévisualisation) DOIVENT continuer à s'appliquer.
- **FR-010**: Le proxy d'analytics DOIT continuer à répondre après déploiement, sans aucune modification de sa configuration.
- **FR-011**: Le site DOIT rester déployé sur l'hébergeur actuel, sous le même domaine, avec les mêmes commandes de travail pour le mainteneur (installation, développement, build, prévisualisation, lint, déploiement automatique depuis `main`).
- **FR-012**: L'adaptateur d'hébergement actuel DOIT être conservé, avec toutes les pages prérendues. Le site reste ainsi conforme aux contraintes techniques de la constitution sans amendement, et une future page dynamique reste possible sans changer de mode d'hébergement.
- **FR-013**: Les dérogations D1, D2 et D3 de la spec 002 DOIVENT être marquées comme résorbées, avec un renvoi vers cette spec.
- **FR-014**: Toute dépendance ajoutée DOIT être justifiée par un besoin de cette évolution (principe II). Aucune nouvelle fonctionnalité visible ne DOIT être introduite hors du périmètre ci-dessous.
- **FR-015**: Le site DOIT publier un sitemap listant toutes les pages publiques indexables, à leurs URL canoniques, sans la page 404. Le sitemap DOIT être annoncé aux robots.
- **FR-016**: L'image de partage par défaut, ainsi que toute image ou tout logo déclaré dans les données structurées (par défaut et par page), DOIVENT pointer vers une image qui existe et répond 200.

### Périmètre

- **Inclus** :
  - génération au build de toutes les pages publiques existantes ;
  - optimisation des images au build, avec les largeurs, formats et
    tailles d'affichage déjà déclarés ;
  - adaptation de la configuration d'hébergement au service de fichiers
    générés ;
  - comportement du slash final et de la page 404 ;
  - publication du sitemap (D3) ;
  - correction de l'image de partage et du logo par défaut, aujourd'hui en
    404.
- **Exclu** :
  - révision des largeurs et tailles d'affichage déclarées, changement de
    format d'image (par exemple avif) ;
  - refonte visuelle, ajout de pages ou de contenu ;
  - changement d'hébergeur ou de domaine ;
  - toute modification du proxy d'analytics ;
  - la page La Sibra (epic `001-page-brasserie`), traitée lors de son rebase.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % des pages publiques existantes (7 pages) s'affichent à l'identique de la production actuelle, vérifié par comparaison de captures en 390 px et 1440 px.
- **SC-002**: 100 % des pages publiques sont servies sans calcul à la demande.
- **SC-003**: Le poids des images transférées sur la page d'accueil en mobile (390 px) baisse d'au moins 50 % par rapport à la production actuelle.
- **SC-004**: Aucune page publique ne pèse plus lourd qu'aujourd'hui (poids total transféré, en mobile comme en desktop).
- **SC-005**: Les scores d'audit de performance, d'accessibilité et de SEO de chaque page publique ne baissent pas de plus de 2 points.
- **SC-006**: 0 erreur au build, à la vérification de types et au lint.
- **SC-007**: Après la mise en production, le proxy d'analytics répond (script en 200), la page 404 répond avec un statut 404, et aucune interruption de service n'est perceptible par les visiteurs.
- **SC-008**: Le sitemap liste 100 % des pages publiques indexables (6 pages, hors 404), et 100 % des images de partage et logos déclarés répondent 200.

## Assumptions

- La référence avant/après est la production actuelle (Astro 7), capturée dans
  `tmp/astro-upgrade/current/prod/`. Le HTML change forcément (adresses des
  images), donc la validation est visuelle et par poids, pas un diff HTML
  strict.
- Aucune page existante n'a besoin de données propres à la requête : le
  contenu est identique pour tous les visiteurs. Le prérendu de toutes les
  pages est donc sans perte fonctionnelle.
- La redirection de l'URL avec slash final vers l'URL canonique est un
  changement de comportement accepté. Elle est favorable au référencement.
- La qualité de compression par défaut de l'outil d'optimisation d'images est
  acceptable. Seule la parité visuelle est exigée, sans cible de qualité
  chiffrée.
- Les visites de pages servies comme fichiers ne sont pas facturées par
  l'hébergeur et ne comptent pas dans le quota de requêtes (vérifié dans sa
  documentation le 2026-09-27).
- Le réglage de cache à l'exécution de l'hébergeur reste désactivé : il est
  sans objet pour des fichiers statiques.
- Les mesures de temps en connexion lente sont bruitées. Les critères reposent
  donc surtout sur le poids transféré et sur la parité visuelle.
