# Tasks: Polish final de l'epic « page La Sibra » (issue #66)

**Input**: Design documents from `specs/001-page-brasserie/issues/66-polish/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/contrastes.md](./contracts/contrastes.md),
[quickstart.md](./quickstart.md)

**Tests**: aucune suite automatisée dans le dépôt. Les « tests » de cette passe sont des **mesures au
navigateur** et les trois gates. Aucune tâche de test unitaire n'est générée — ce serait inventer une
pratique absente du projet.

## Format

`- [ ] [TaskID] [P?] [Story?] Description avec chemin de fichier`

`[P]` = parallélisable (fichiers distincts, aucune dépendance inachevée).

---

## Phase 1: Setup — établir la ligne de base

**Purpose**: mesurer l'état **avant** toute modification. Sans ces relevés, on ne peut pas distinguer une
régression introduite d'un défaut préexistant.

- [x] T001 Lancer les trois gates sur le dépôt entier et consigner le résultat : `./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css`, `./node_modules/.bin/astro check`, `./node_modules/.bin/astro build`
- [x] T002 [P] Démarrer `./node_modules/.bin/astro dev` et relever, pour les 8 pages publiques, `scrollWidth - clientWidth` à 375 px (émulation d'appareil) et à 1280 px — la valeur de référence connue est 27 px sur `/` à 1280 px
- [x] T003 [P] Capturer l'état visuel de référence de `/la-sibra` aux deux largeurs, section par section, en priorisant la section bières (`src/features/sibra/sections/sibra-bieres-section.astro`) jamais vue dans un navigateur
- [x] T004 [P] Vérifier que le gate #67 tient : `grep -rn "tel:\|mailto:" src/` ne renvoie aucune occurrence du téléphone ni de l'email non confirmés, et le JSON-LD de `src/pages/la-sibra.astro` n'expose ni `telephone` ni `email`

**Checkpoint**: on sait ce qui est déjà cassé et ce qui ne l'est pas.

---

## Phase 2: Foundational — la référence de contraste

**Purpose**: produire le tableau de ratios fiable dont dépend toute correction de couleur. **Bloquant pour
US1 et US3.**

⚠️ Aucune correction de contraste ne doit être écrite avant T006.

- [x] T005 Exécuter `node specs/001-page-brasserie/issues/66-polish/contracts/contrastes.mjs` et vérifier que sa sortie est reproductible et que le fichier passe `eslint` (pièges rencontrés : `no-console`, `node/prefer-global/process`, `import/first`)
- [x] T006 Confronter la sortie de T005 aux mesures de l'onglet Accessibility de Chrome sur le rendu réel de `/la-sibra`, pour confirmer que le calcul décrit bien ce que le navigateur affiche (tolérance ±0,02)

**Checkpoint**: les ratios publiés sont des mesures, plus des estimations.

---

## Phase 3: User Story 2 — La documentation de l'epic dit la vérité (P1)

**Goal**: qu'aucune affirmation fausse ne subsiste dans les artefacts de l'epic.

**Independent Test**: recalculer chaque cellule du tableau de `theme.md` depuis les tokens du dépôt et
n'obtenir aucun écart > 0,02 ; relire R5 et R7 et n'y trouver que des conclusions conformes aux mesures.

**Pourquoi en premier**: c'est la cause racine. Corriger le rendu sans corriger le contrat reproduirait
l'erreur à la prochaine issue.

- [x] T007 [US2] Corriger les six lignes du tableau de contrastes de `specs/001-page-brasserie/contracts/theme.md` avec les valeurs mesurées (`primary` 3,50 / 5,66 · `primary-accent` 5,25 / 3,77 · `secondary` 3,57 / 5,55 · `secondary-accent` 5,39 / 3,67 · `tertiary` 2,01 / 9,85 · `tertiary-accent` 2,88 / 6,87)
- [x] T008 [US2] Dans `specs/001-page-brasserie/contracts/theme.md`, remplacer la règle « `tertiary-accent` : texte blanc en grand texte uniquement » par une **interdiction franche** — 2,88 est sous le seuil de 3:1 (FR-002)
- [x] T009 [US2] Dans `specs/001-page-brasserie/contracts/theme.md`, ajouter l'interdiction de `text-foreground` en texte courant sur `primary-accent` (3,77) et `secondary-accent` (3,67), aujourd'hui non documentée, et remplir les cellules vides de la colonne `foreground` (FR-003)
- [x] T010 [US2] Dans `specs/001-page-brasserie/contracts/theme.md`, corriger la mention de `Tag color="tertiary"` présentée comme valide : le ratio réel est 1,65 ; documenter que toute couleur thémée de `Tag` exige `text-foreground` (FR-004)
- [x] T011 [US2] Dans `specs/001-page-brasserie/contracts/theme.md`, référencer `issues/66-polish/contracts/contrastes.mjs` comme méthode de calcul rejouable (FR-006)
- [x] T012 [P] [US2] Ajouter à R5 de `specs/001-page-brasserie/research.md` un bloc « Correction (2026-09-20, issue #66) » disant ce qui a été effectivement constaté — sans réécrire le texte d'origine (FR-005)
- [x] T013 [P] [US2] Ajouter le même type de bloc à R7 de `specs/001-page-brasserie/research.md` (débordement de nav à 7 entrées annoncé « risque faible »). ⚠️ **La mesure a confirmé la conclusion de R7, pas démenti** : aucun débordement de 1280 à 1920 px. C'est le *critère* qui était mauvais, pas le verdict — le bloc ajouté dit cela, et non l'inverse

**Checkpoint**: le dossier de specs de l'epic ne contient plus d'affirmation démentie.

---

## Phase 4: User Story 1 — Une visiteuse malvoyante lit la page sans obstacle (P1)

**Goal**: zéro non-conformité AA sur le rendu, et un parcours clavier complet.

**Independent Test**: parcours clavier de `/la-sibra` puis des 5 autres pages de lieux ; mesure des ratios
au navigateur ; inspection de l'arbre d'accessibilité.

⚠️ T014 à T016 touchent un composant de **cercle A** : partagé par les 6 pages de lieux **et** `/contact`.
T017 en vérifie les 7.

- [x] T014 [US1] Dans `src/components/leaflet-map.astro`, passer le panneau d'erreur de `text-red-600` à `text-red-700` (4,41 → 5,91) — c'est le repli affiché quand la carte ne charge pas (FR-007)
- [x] T015 [US1] Dans `src/components/leaflet-map.astro`, donner au conteneur de carte un `role="application"` et un `aria-label` paramétrable : Leaflet le rend focusable à l'exécution via `tabindex="0"`, sans nom accessible (WCAG 4.1.2, FR-008)
- [x] T016 [US1] Dans `src/components/leaflet-map.astro`, passer une option `alt` française à `L.marker()` pour que le marqueur focusable ait un nom accessible (FR-009)
- [x] T017 [US1] Vérifier au navigateur les 7 pages qui consomment `leaflet-map` (les 6 lieux + `/contact`) : marqueur nommé, conteneur annoncé, panneau d'erreur lisible en simulant l'échec de chargement via le blocage de `unpkg.com` (FR-014)
- [x] T018 [P] [US1] Dans `src/components/text.astro`, ne garder que `text-lg` pour `size="base"` et commenter que la valeur est délibérée — correction **neutre au rendu**, le texte courant doit rester à 18 px (R66-4)
- [x] T019 [P] [US1] Appliquer l'arbitrage `Tag` de `data-model.md` : remonter `text-foreground` dans `src/components/tag.astro` pour les variantes thémées, puis vérifier le rendu sur `/la-sibra`, `/a-la-carte-postale`, `/le-labo-diva`, `/le-wattignies` — **revenir au contournement local et le documenter si le rendu se dégrade**
- [x] T020 [US1] Vérifier la hiérarchie de titres de `/la-sibra` : exactement un `h1`, un `h2` par section, aucun saut de niveau (FR-010)
- [x] T021 [P] [US1] Vérifier que chaque image de `src/features/sibra/**` porte un `alt` français descriptif, et que les décorations sont bien masquées de l'arbre d'accessibilité (FR-011)
- [x] T022 [US1] Mesurer au navigateur chaque texte de `/la-sibra` posé sur un fond thémé et corriger toute valeur sous son seuil — attention à la graisse 600, qui ne qualifie **pas** comme grand texte (FR-012)
- [x] T023 [US1] Parcourir les 8 pages publiques uniquement au clavier : indicateur de focus visible partout, aucun élément focusable anonyme, sortie de la carte possible sans piège (FR-013)

**Checkpoint**: plus aucune non-conformité AA mesurable sur les pages publiques.

---

## Phase 5: User Story 3 — La page tient le rythme visuel des cinq autres (P2)

**Goal**: aucun débordement, aucune illustration coupée ou chevauchante, palette distincte.

**Independent Test**: captures des 8 pages aux deux largeurs, mises côte à côte ; `scrollWidth` == `clientWidth`.

- [x] T024 [US3] Corriger le débordement horizontal de l'accueil (27 px à 1280 px) en posant `overflow-hidden` sur la ou les sections conteneuses de `src/features/home/**`, sans déplacer les décorations (R66-7, FR-015)
- [x] T025 [US3] Revue visuelle de `/la-sibra` à 375 px et 1280 px, section par section : aucun chevauchement de texte par une illustration, aucune coupure disgracieuse (FR-016)
- [x] T026 [US3] Revue visuelle dédiée de la section bières — `src/features/sibra/sections/sibra-bieres-section.astro` — jamais vérifiée dans un navigateur, aux deux largeurs (FR-017)
- [x] T027 [P] [US3] Mettre `/la-sibra` côte à côte avec les 5 autres pages de lieux et confirmer la fidélité aux trois couleurs de la charte et la non-confusion de la palette (FR-018, SC-005 de l'epic)
- [x] T028 [US3] Re-mesurer `scrollWidth - clientWidth` sur les 8 pages aux deux largeurs : attendu 0 partout (FR-015)

**Checkpoint**: le rendu est au niveau des pages existantes.

---

## Phase 6: User Story 4 — Rien n'a régressé (P2)

**Goal**: gates verts et performance comparée, conditions de sortie de l'epic.

**Independent Test**: les trois gates en exit 0 ; Lighthouse mobile comparé dans une même session.

- [x] T029 [P] [US4] Corriger `SITE_NAME` dans `src/utils/constants.ts` en `Commun’île` (apostrophe typographique) et vérifier le `<title>` des 8 pages (R66-8)
- [x] T030 [US4] Auditer `/la-sibra` et `/a-la-carte-postale` en Lighthouse mobile dans la **même session** et comparer performance, accessibilité, SEO et poids de page — c'est l'écart entre les deux pages qui fait foi, pas le score absolu (FR-020)
- [x] T031 [US4] Corriger toute régression révélée par T030 avant d'aller plus loin (constitution III)
- [x] T032 [US4] Relancer les trois gates sur le **dépôt entier**, artefacts de specs compris — jamais restreints à un sous-dossier (FR-019)
- [x] T033 [US4] Dérouler `specs/001-page-brasserie/quickstart.md` de bout en bout et tracer chaque point ; noter ceux qui restent hors de portée et pourquoi (FR-021)
- [x] T034 [US4] Dérouler `specs/001-page-brasserie/issues/66-polish/quickstart.md`, y compris la vérification du gate #67 (FR-022)

**Checkpoint**: l'epic est prête pour une PR vers `001-page-brasserie`.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T035 Vérifier les invariants de `data-model.md` : texte courant toujours à 18 px, couleurs de la charte inchangées, `package.json` et lockfile **intacts**, aucune coordonnée non confirmée publiée
- [ ] T036 Arrêter les serveurs de développement lancés pour la vérification
- [ ] T037 Commits en Conventional Commits, artefacts de specs compris ; PR vers la branche epic `001-page-brasserie` (**jamais `main`**) avec `Closes #66`
- [ ] T038 `gh pr checks <n> --watch` jusqu'au vert — puis s'arrêter : ni merge, ni fermeture de l'issue

---

## Dependencies & Execution Order

### Dépendances de phase

- **Phase 1 (Setup)** : aucune dépendance. Sans elle, impossible de distinguer régression et dette héritée.
- **Phase 2 (Foundational)** : dépend de Phase 1. **Bloque US1 et US3** — on ne corrige pas un contraste
  sans référence fiable.
- **Phase 3 (US2)** : dépend de Phase 2. Indépendante de US1/US3 en écriture, mais volontairement placée
  avant : si la passe s'arrête là, la correction documentaire a déjà de la valeur.
- **Phase 4 (US1)** : dépend de Phase 2. T017 dépend de T014–T016.
- **Phase 5 (US3)** : dépend de Phase 2. Peut avancer en parallèle de Phase 4 sauf T022/T025 qui touchent
  les mêmes fichiers de sections.
- **Phase 6 (US4)** : dépend de tout ce qui précède — c'est une mesure de l'état final.

### Parallélisation

- Phase 1 : T002, T003, T004 en parallèle.
- Phase 3 : T012 et T013 en parallèle (même fichier, sections distinctes — sérialiser si conflit).
- Phase 4 : T018, T019, T021 en parallèle ; T014–T016 sérialisés (même fichier).
- Phase 5 : T027 en parallèle du reste.

### Chemin critique

T001 → T005/T006 → T007–T011 → T014–T017 → T022 → T024/T028 → T030 → T032 → PR.

---

## Implementation Strategy

**Incrément minimal utile** : Phase 1 + Phase 2 + Phase 3. À ce stade, le dossier de specs ne ment plus,
ce qui empêche la prochaine erreur de contraste même si rien d'autre n'est fait.

**Incrément recommandé** : + Phase 4. C'est là que le non-conforme quitte la production.

**Complet** : Phases 1 à 7, une seule PR vers l'epic.

**Règle de sécurité tout au long** : toute modification de cercle A (`leaflet-map`, `tag`, `text`) est
suivie immédiatement de sa vérification multi-pages. Ne jamais empiler deux modifications de composant
partagé sans avoir vérifié la première — on ne saurait plus laquelle a régressé.
