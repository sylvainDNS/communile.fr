# Tasks: Découvrir les bières de La Sibra (issue #64)

**Input**: Design documents from `/specs/001-page-brasserie/issues/64-bieres/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/sections.md](./contracts/sections.md), [quickstart.md](./quickstart.md)

**Parent**: epic [`specs/001-page-brasserie/`](../../tasks.md) — ces tâches déroulent T022 de l'epic. En cas de divergence, **les artefacts de l'epic priment**.

**Tests**: aucun framework de test dans le dépôt — pas de tâches de tests automatisés. La validation repose sur `astro check` + `astro build`, `eslint` et la **vérification visuelle mobile + desktop**.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, pas de dépendance sur une tâche inachevée)
- **[Story]** : US1–US3, mappé sur [spec.md](./spec.md)

## Git Workflow

- Branche : `001-page-brasserie-bieres` (schéma **plat**, depuis l'epic `001-page-brasserie`).
- PR → branche epic `001-page-brasserie`, **jamais `main`**. Corps contenant `Closes #64`.
- Conventional Commits. Les artefacts de specs sont commités avec le code.
- **Le merge est réservé à l'humain.**

---

## Phase 1: Setup

Aucune tâche : le dossier `src/features/sibra/sections/` et la photo `src/features/sibra/images/sibra-brassage.webp` existent déjà (#59, #60). Aucune dépendance à installer.

---

## Phase 2: Foundational

- [ ] T001 Créer le squelette de `src/features/sibra/sections/sibra-bieres-section.astro` : frontmatter (imports `Image`, `Section`, `Container`, `Heading`, `Text`, `InfoCard`, `Icon`, `Tag`, `Link`, `icons`, `PATH`, `sibraBrassageImage`), `<Section>` + `<Container>` et le `Heading as="h2"` « Nos bières » — structure vide de contenu, conforme à [contracts/sections.md](./contracts/sections.md)

**Blocking**: T001 conditionne T002–T005 (même fichier).

---

## Phase 3: User Story 1 — Découvrir la gamme permanente (Priority: P3)

**Goal**: le visiteur peut citer les quatre bières permanentes et ce qu'a de particulier la Carlota.

**Independent Test**: lire la section → Blonde, Ambrée, Triple, Blanche et la Carlota (recette héritée de Charlotte, inchangée depuis 15 ans) sont présentes, sans ajout.

- [ ] T002 [US1] Ajouter la constante locale `infoCards` typée `InfoCardType` dans `src/features/sibra/sections/sibra-bieres-section.astro` et sa première entrée (icône `glass-water`, titre « Des recettes classiques indémodables », description reprise mot à mot du texte source) — valeurs exactes dans [data-model.md](./data-model.md)
- [ ] T003 [US1] Rendre les entrées de `infoCards` en `<InfoCard>` (slots `icon`, `title`, `description`) dans la colonne texte de `src/features/sibra/sections/sibra-bieres-section.astro`, patron `src/features/landes-fertiles/sections/landes-find-section.astro`

**Checkpoint**: la section affiche le bloc « recettes classiques » avec le contenu exact du texte source.

---

## Phase 4: User Story 2 — Découvrir les brassins éphémères (Priority: P3)

**Goal**: le visiteur comprend qu'il existe, en plus de la gamme permanente, des bières saisonnières créées par le brasseur.

**Independent Test**: lire la section → un second bloc distinct annonce les brassins éphémères et cite le brasseur Simon.

- [ ] T004 [US2] Ajouter la seconde entrée de `infoCards` (icône `sparkles`, titre « Des brassins éphémères saisonniers », description citant le brasseur Simon) dans `src/features/sibra/sections/sibra-bieres-section.astro` — valeurs exactes dans [data-model.md](./data-model.md)
- [ ] T005 [US2] Ajouter la colonne image de `src/features/sibra/sections/sibra-bieres-section.astro` : `<Image src={sibraBrassageImage}>` avec `alt` FR descriptif, `widths`, `sizes`, `loading="lazy"`, hauteur bornée et `object-cover` (photo portrait 1600×2131 — voir [research.md](./research.md) R64-4)

**Checkpoint**: les deux blocs coexistent, visuellement distincts, illustrés par la photo de brassage cadrée correctement.

---

## Phase 5: User Story 3 — Savoir où retrouver les bières (Priority: P3)

**Goal**: le visiteur lit la liste des lieux revendeurs et comprend qu'elle n'est pas exhaustive.

**Independent Test**: atteindre le pied de la section → les quatre lieux sont listés, seul Le Wattignies est un lien interne, la mention « … et bien d'autres » est présente.

- [ ] T006 [US3] Ajouter la constante locale `revendeurs` (`{ name, href? }`) dans `src/features/sibra/sections/sibra-bieres-section.astro` : Le Wattignies → `PATH.LE_WATTIGNIES` ; L'industrie, Ohmtown, Pioche sans `href` — aucune URL littérale, aucune entrée inventée ([data-model.md](./data-model.md))
- [ ] T007 [US3] Rendre le bloc « Où retrouver nos bières ? » en pied de `src/features/sibra/sections/sibra-bieres-section.astro` : `Heading as="h3"`, `<ul>` d'un `<li>` par lieu, `Tag color="primary"` enveloppé dans `Link` pour le lieu de la coopérative, `Tag color="neutral"` sans lien pour les lieux tiers
- [ ] T008 [US3] Ajouter la mention « … et bien d'autres » en `<Text>` après la liste (hors du `<ul>`) dans `src/features/sibra/sections/sibra-bieres-section.astro` — voir [research.md](./research.md) R64-6

**Checkpoint**: le bloc revendeurs est complet, sémantiquement correct et ne contient qu'un seul lien, interne.

---

## Phase 6: Intégration

- [ ] T009 Importer et insérer `<SibraBieresSection />` entre `<SibraWhatSection />` et `<SibraInstagramSection />` dans `src/pages/la-sibra.astro`, sans autre modification de la page (invariants P-01 à P-03 de [contracts/sections.md](./contracts/sections.md))

---

## Phase 7: Polish & vérifications

- [ ] T010 [P] Vérifier les invariants du contrat par relecture et `grep` sur `src/features/sibra/sections/sibra-bieres-section.astro` : un seul `<a>`, aucun `http`/`tel:`/`mailto:`, aucun `Badge`, aucun `variant="tertiary"`, aucun `color="white"`, aucune valeur hexadécimale (C-01 à C-12)
- [ ] T011 [P] Relecture croisée du contenu affiché contre `brasserie-assets/Texte site internet.md` : zéro bière, zéro lieu, zéro caractéristique inventés (principe I de la constitution, SC-002)
- [ ] T012 Vérification visuelle de `/la-sibra` à **375 px** et à **≥ 1280 px** : pas de débordement horizontal, étiquettes lisibles et bien réparties, colonne image ne dépassant pas la colonne texte, rythme des sections cohérent (SC-003)
- [ ] T013 Gates automatiques : `./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css` (exit 0), `./node_modules/.bin/astro check` puis `./node_modules/.bin/astro build` — ⚠️ ne pas utiliser `pnpm` sur ce poste ([quickstart.md](./quickstart.md))
- [ ] T014 Dérouler [quickstart.md](./quickstart.md) de bout en bout et cocher chaque vérification, dont le contrôle de périmètre `git diff --stat` (aucun fichier de `.claude/`, aucun fichier temporaire)

---

## Dependencies

```text
T001 (squelette)
 ├── T002 → T003        US1
 ├── T004, T005         US2   (T004 après T002 : même constante)
 └── T006 → T007 → T008 US3
T009 (intégration page)  après T003/T005/T008
T010–T014                après T009
```

Toutes les tâches T002–T008 touchent le **même fichier** : elles sont séquentielles malgré leur indépendance logique. Seules T010 et T011 sont réellement parallélisables.

## Implementation Strategy

Fichier unique, construit de haut en bas : squelette → blocs de gamme → photo → bloc revendeurs → intégration → vérifications. Les trois user stories étant toutes P3 et portées par le même composant, elles sont livrées ensemble ; leur découpage sert la relecture, pas une livraison échelonnée.

**MVP** : T001–T005 + T009 donnent déjà une section conforme à l'US3 de l'epic (gamme permanente + brassins éphémères) ; le bloc revendeurs (T006–T008) complète FR-014.
