# Tasks: Découverte interne de La Sibra — header, footer, carte d'accueil, maj Carte Postale (issue #62)

**Feature**: [spec.md](./spec.md) · **Plan**: [plan.md](./plan.md) · **Contrat**: [contracts/navigation.md](./contracts/navigation.md)

**Branch**: `001-page-brasserie-navigation` · **Date**: 2026-09-19

**Stack** : Astro 5, Tailwind CSS 4, TypeScript. Aucun harnais de test automatisé dans le dépôt —
aucune tâche de test n'est générée ; les gates sont `eslint`, `astro check`, `astro build` et la
**vérification navigateur**, qui est ici une tâche de premier rang et non une formalité (les 4
fichiers touchés sont rendus sur des pages en production).

⚠️ **Ne pas utiliser `pnpm`** (cassé sur ce poste, dépose un `pnpm-workspace.yaml` parasite).
Binaires directs de `./node_modules/.bin/`.

⚠️ **Ne jamais modifier** `.claude/` ni `pnpm-workspace.yaml`. Ne jamais faire `git add -A` ni
`git add .` — ajouter les fichiers explicitement.

---

## Phase 1: Setup

- [ ] T001 Vérifier que le point de départ est propre : `git status --short` ne montre que les fichiers non suivis hors mandat (`.claude/settings.json`, `pnpm-workspace.yaml`), et que la branche courante est `001-page-brasserie-navigation` partant de `001-page-brasserie` à jour
- [ ] T002 Relever l'état « avant » de référence en lançant `./node_modules/.bin/astro dev --port 4331`, puis capturer à 375 px et 1280 px : l'accueil (section « Nos lieux »), le header, le footer, `/a-la-carte-postale` et `/le-bar-ile` — base de comparaison pour la non-régression (C5.1, quickstart étape 0)

---

## Phase 2: Foundational

Aucune tâche bloquante. Tout ce dont les trois user stories ont besoin existe déjà dans le dépôt :
`PATH.LA_SIBRA` dans `src/utils/constants.ts` et l'image `src/features/home/images/la-sibra-card.webp`
ont été livrés par l'issue #59, et les composants `NavLink`, `Link`, `PlaceCard`, `Tag` et `Text`
sont en place. Les trois stories sont donc réellement indépendantes et parallélisables.

- [ ] T003 Confirmer la présence des prérequis livrés par #59, sans les modifier : `grep -n "LA_SIBRA" src/utils/constants.ts` renvoie `/la-sibra`, et `src/features/home/images/la-sibra-card.webp` existe en 1280×410

---

## Phase 3: User Story 1 — Atteindre La Sibra depuis n'importe quelle page (P2)

**Goal** : la brasserie est accessible en un clic depuis la navigation et le pied de page, sur les 8
pages publiques, en desktop comme en mobile.

**Independent Test** : depuis trois pages différentes, en desktop et en mobile, atteindre
`/la-sibra` en un seul clic via la nav, puis via le footer.

### Implementation

- [ ] T004 [US1] Dans `src/components/header.astro`, ajouter `{ label: 'La Sibra', href: PATH.LA_SIBRA }` en **dernière** position du tableau `links` du frontmatter, après l'entrée `À La Carte Postale` — ne toucher à aucune des 6 entrées existantes (C1.1, C1.2, C5.2)
- [ ] T005 [US1] Dans `src/components/header.astro`, ajouter `class="px-2 2xl:px-4"` au `<NavLink>` de la **nav desktop uniquement** (le `<nav aria-label="Navigation principale">`, celui sous `hidden xl:block`) ; laisser le `<NavLink>` du menu mobile inchangé pour préserver ses cibles tactiles (research D1/D2, C1.6, C1.9)
- [ ] T006 [P] [US1] Dans `src/components/footer.astro`, ajouter `<li><Link href={PATH.LA_SIBRA}>La Sibra</Link></li>` en dernière position du `<ul>` de la colonne des lieux, après `À La Carte Postale`, sous la forme exacte des 5 `<li>` voisins (aucune classe propre) (C2.1–C2.3)

### Vérification de la story

- [ ] T007 [US1] Vérifier la nav desktop à **exactement 1280 px** (cas critique, research D1) : 7 entrées sur une ligne, logo « COMMUN'ÎLE » entier, aucun chevauchement ; mesurer en console que `document.querySelector('header nav[aria-label="Navigation principale"] ul').getBoundingClientRect().width` est ≤ 900 px et que le lien du logo n'est pas tronqué (`scrollWidth === clientWidth`) (C1.4, C1.5)
- [ ] T008 [US1] Vérifier la nav desktop à **≥ 1536 px** : le padding des entrées est revenu à 16 px et le rendu est celui de la production (C1.6) ; vérifier aussi l'absence de défilement horizontal du `<header>` (C1.7)
- [ ] T009 [US1] Vérifier le menu mobile à **375 px** : les 7 entrées présentes et atteignables, ouverture/fermeture du panneau, `aria-expanded` bascule, `Échap` referme, parcours complet au clavier, padding des entrées inchangé à 16 px (C1.8–C1.11)
- [ ] T010 [US1] Sur `/la-sibra`, vérifier que l'entrée « La Sibra » porte `aria-current="page"` et qu'aucune autre entrée ne la porte (C1.3)
- [ ] T011 [US1] Vérifier le pied de page à 375 px et 1280 px : « La Sibra » en 6ᵉ position de la colonne des lieux, lien vers `/la-sibra`, mise en forme indiscernable des 5 voisines (C2.1–C2.3)

**Checkpoint US1** : la brasserie est atteignable en un clic depuis toutes les pages.

---

## Phase 4: User Story 2 — Découvrir La Sibra parmi les lieux de l'accueil (P2)

**Goal** : la 6ᵉ carte figure dans la section « Nos lieux », et la grille redevient un 2×3 régulier.

**Independent Test** : depuis l'accueil, en mobile et en desktop, repérer la carte de la brasserie,
la survoler pour lire ses horaires, cliquer pour atteindre sa page.

### Implementation

- [ ] T012 [US2] Ouvrir `src/features/home/images/la-sibra-card.webp` et rédiger le texte alternatif à partir de **ce que montre réellement la photo** — intérieur de la boutique : comptoir en bois, étagères de bouteilles, tonneau — sur le patron des 5 cartes existantes (« La Sibra - … ») ; ne pas se contenter de répéter le nom du lieu (C3.3, FR-008)
- [ ] T013 [US2] Dans `src/features/home/sections/home-places-section.astro`, ajouter l'import `import laSibraCardImage from '../images/la-sibra-card.webp'` à sa place dans l'ordre alphabétique des imports d'images du frontmatter (après `la-carte-postale-card`, avant `le-bar-ile-card`)
- [ ] T014 [US2] Dans `src/features/home/sections/home-places-section.astro`, ajouter la 6ᵉ `<PlaceCard>` en dernière position de la grille : `href={PATH.LA_SIBRA}`, `image={laSibraCardImage}`, `imageAlt` de T012, `tagColor="green"`, `tagText="La Sibra"`, **sans attribut `class`** (C3.1–C3.4, C3.7, research D5)
- [ ] T015 [US2] Dans la même carte, renseigner le slot `hover-content` sur la forme `<span>` majoritaire (research D4) : `<span class="text-2xl font-bold"> Horaires d'ouverture </span>` puis les deux plages de la boutique — vendredi 16 h – 20 h, samedi 11 h – 20 h — recopiées depuis `src/features/sibra/sections/sibra-boutique-section.astro` mais écrites dans la notation des cinq cartes voisines (« 16h00 - 20h00 », « 11h00 - 20h00 », D8) ; **aucun téléphone, e-mail, `tel:` ni `mailto:`** (C3.5, C3.6, research D3/D7/D8)
- [ ] T016 [US2] Dans le même fichier, retirer l'attribut `class="md:mx-auto md:col-span-2 md:w-1/2"` de la `<PlaceCard>` d'À La Carte Postale — l'attribut disparaît entièrement ; ne modifier aucune autre prop de cette carte ni des 4 autres (C3.7, C5.4, research D6)
- [ ] T017 [US2] Vérifier que le conteneur de grille `class="col-span-2 grid grid-cols-1 gap-3 md:grid-cols-2"` n'a **pas** été modifié : le nombre de colonnes reste 2 en desktop (Non-Goal de la spec)

### Vérification de la story

- [ ] T018 [US2] Vérifier la section à 1280 px : 6 cartes, grille 3 rangées × 2 colonnes, toutes de largeur identique, aucune carte centrée ni à demi-largeur (C3.8)
- [ ] T019 [US2] Vérifier la section à 375 px : 6 cartes empilées sur une colonne, largeurs identiques (C3.9)
- [ ] T020 [US2] Survoler la carte La Sibra : « Horaires d'ouverture » puis les deux plages, dans la même forme que les autres cartes, et rien d'autre ; puis cliquer et vérifier l'arrivée sur `/la-sibra` (C3.2, C3.5, C3.6)
- [ ] T021 [US2] Vérifier que les 5 cartes préexistantes ont conservé image, texte alternatif, teinte d'étiquette, libellé et horaires de survol (C5.4)

**Checkpoint US2** : la brasserie figure dans la grille des lieux, qui est régulière.

---

## Phase 5: User Story 3 — Présentation exacte d'À La Carte Postale (P2)

**Goal** : la page À La Carte Postale ne se présente plus comme le dernier lieu né de la coopérative.

**Independent Test** : ouvrir la page et lire « quatrième restaurant » ; aucune occurrence de
« dernier lieu » nulle part.

### Implementation

- [ ] T022 [P] [US3] Dans `src/features/la-carte-postale/sections/la-carte-postale-what-section.astro` (~l. 28), remplacer dans le dernier `<Text font="pally" size="xl" weight="semibold" class="max-w-md">` la phrase « C'est le dernier lieu né de la coopérative, … » par « C'est le quatrième restaurant de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! » — ne modifier **aucune** prop du `<Text>` (C4.1, C4.2, FR-013, FR-015)
- [ ] T023 [US3] Exécuter `grep -rn "dernier lieu" src/` et vérifier qu'il ne renvoie **rien** (C4.3, FR-014, SC-005)

### Vérification de la story

- [ ] T024 [US3] Ouvrir `/a-la-carte-postale` à 375 px et 1280 px : le paragraphe affiche la nouvelle formulation, sa police, sa taille, sa graisse et sa largeur sont inchangées, et le reste de la page est identique à la capture de T002 (C4.1, C4.2, C4.4)

**Checkpoint US3** : le site est factuellement cohérent le jour de la mise en ligne de la brasserie.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T025 Exécuter `./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css` → sortie 0 exigée
- [ ] T026 Exécuter `./node_modules/.bin/astro check` → 0 erreur
- [ ] T027 Exécuter `./node_modules/.bin/astro build` → succès
- [ ] T028 Contrôler le périmètre : `git diff --stat 001-page-brasserie -- src/` doit lister **exactement 4** fichiers (`header.astro`, `footer.astro`, `home-places-section.astro`, `la-carte-postale-what-section.astro`) — aucun composant de `src/components/` autre que header et footer, aucun asset ajouté (C5.5–C5.6, SC-007, I5, I6)
- [ ] T029 Contrôler le gate coordonnées : `grep -rnE "tel:|mailto:|06[ .]?33|bce\.brasserie" src/features/home src/components` ne renvoie rien (C3.6, FR-016)
- [ ] T030 Non-régression : ouvrir `/le-wattignies`, `/les-landes-fertiles`, `/le-labo-diva`, `/le-bar-ile`, `/a-la-carte-postale` et `/la-sibra` à 375 px et 1280 px, et comparer aux captures de T002 — aucune différence hors la 7ᵉ entrée de header et la 6ᵉ entrée de footer (C5.1)
- [ ] T031 Arrêter le serveur de dev et fermer les onglets de vérification ; vérifier que `git status --short` est propre et qu'aucun `pnpm-workspace.yaml` n'a été créé ou modifié
- [ ] T032 Commiter en Conventional Commits, artefacts de specs compris, en ajoutant les fichiers **explicitement** (jamais `git add -A` ni `git add .`), puis pousser la branche
- [ ] T033 Ouvrir la PR avec `gh pr create --base 001-page-brasserie` (jamais `main`), corps contenant `Closes #62`, et y signaler les points hors périmètre relevés : l'invalidation de l'estimation de R7 (research D1) et la duplication des horaires de la boutique (research D3)

---

## Dependencies & Execution Order

```text
Phase 1 (T001–T002)  ──►  Phase 2 (T003)  ──┬──►  US1 (T004–T011)  ──┐
                                             ├──►  US2 (T012–T021)  ──┼──►  Phase 6 (T025–T033)
                                             └──►  US3 (T022–T024)  ──┘
```

- **Phase 1 → Phase 2 → stories** : séquentiel. T002 (captures « avant ») doit précéder toute
  modification, sinon la non-régression de T030 n'a plus de référence.
- **US1, US2, US3 sont mutuellement indépendantes** : elles touchent des fichiers disjoints
  (`header.astro` + `footer.astro` / `home-places-section.astro` /
  `la-carte-postale-what-section.astro`). Aucune ne bloque les autres.
- **Phase 6 après les trois stories** : les gates et la non-régression portent sur l'ensemble.

### À l'intérieur des stories

- **US1** : T004 et T005 touchent le même fichier → séquentiels. T006 est sur un autre fichier → `[P]`.
  T007–T011 après T004–T006.
- **US2** : T012 précède T014 (le texte alternatif en est une entrée). T013 → T014 → T015 → T016
  touchent tous `home-places-section.astro` → séquentiels. T017–T021 après.
- **US3** : T022 puis T023 puis T024.

### Opportunités de parallélisme

- Les trois stories peuvent être menées de front par trois exécutants.
- `[P]` explicites : T006 (footer, isolé) et T022 (Carte Postale, isolé).
- Le parallélisme réel est faible ici, et c'est voulu : le périmètre tient en 4 fichiers.

---

## Implementation Strategy

**MVP** : US1 seule livre déjà l'essentiel du SC-003 de l'epic — la brasserie devient atteignable
depuis les 8 pages. US2 et US3 complètent la découverte éditoriale et l'exactitude.

**Incrément conseillé** : US3 en premier si l'on veut un gain immédiat à risque nul (une chaîne de
caractères, un fichier), puis US1, puis US2. L'ordre retenu ci-dessus suit en revanche les priorités
de la spec.

**Règle qui prime sur toutes les autres** : les 4 fichiers touchés sont en production. En cas de
doute entre « faire mieux » et « faire le strict nécessaire », faire le strict nécessaire — FR-017.
Toute amélioration repérée en chemin se signale dans le rapport de PR, elle ne s'implémente pas ici.

---

## Format validation

33 tâches, toutes au format `- [ ] Tnnn [P?] [Story?] description avec chemin de fichier` :

| Phase | Tâches | Étiquette de story |
|-------|--------|--------------------|
| 1 — Setup | T001–T002 | aucune (correct) |
| 2 — Foundational | T003 | aucune (correct) |
| 3 — US1 | T004–T011 | `[US1]` |
| 4 — US2 | T012–T021 | `[US2]` |
| 5 — US3 | T022–T024 | `[US3]` |
| 6 — Polish | T025–T033 | aucune (correct) |
