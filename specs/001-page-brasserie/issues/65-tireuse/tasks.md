# Tasks: Réserver une tireuse à La Sibra (issue #65)

**Input**: Design documents from `/specs/001-page-brasserie/issues/65-tireuse/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/sections.md](./contracts/sections.md), [quickstart.md](./quickstart.md)

**Parent**: epic [`specs/001-page-brasserie/`](../../tasks.md) — ces tâches déroulent T023 de l'epic. En cas de divergence, **les artefacts de l'epic priment**, à la seule exception du CTA téléphone : le numéro est gelé par le gate #67 (cf. [research.md](./research.md) R65-1).

**Tests**: aucun framework de test dans le dépôt — pas de tâches de tests automatisés. La validation repose sur `astro check` + `astro build`, `eslint` et la **vérification visuelle mobile + desktop**.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, pas de dépendance sur une tâche inachevée)
- **[Story]** : US1–US2, mappé sur [spec.md](./spec.md)

## Git Workflow

- Branche : `001-page-brasserie-tireuse` (schéma **plat**, depuis l'epic `001-page-brasserie`).
- PR → branche epic `001-page-brasserie`, **jamais `main`**. Corps contenant `Closes #65`.
- Conventional Commits. Les artefacts de specs sont commités avec le code.
- **Le merge est réservé à l'humain.**

---

## Phase 1: Setup

Aucune tâche : le dossier `src/features/sibra/sections/` et l'ornement `src/features/sibra/images/sibra-what-ornament.svg` existent déjà (#59, #60). Aucune dépendance à installer, aucun asset à produire.

---

## Phase 2: Foundational

- [x] T001 Créer le squelette de `src/features/sibra/sections/sibra-tireuse-section.astro` : frontmatter (imports `Section`, `Container`, `Heading`, `Text`, `Card`, `Icon`, `icons`, `SibraWhatOrnament` en relatif), `<Section variant="secondary" class="overflow-hidden">` + ornement `aria-hidden` en `text-secondary-accent` + `<Container class="relative z-20">` et le `Heading as="h2" size="xl" weight="bold" color="white"` « Prêt de tireuse » — structure sans contenu, conforme à [contracts/sections.md](./contracts/sections.md)

**Blocking**: T001 conditionne T002–T005 (même fichier).

---

## Phase 3: User Story 1 — Comprendre le service et sa condition (Priority: P4)

**Goal**: le visiteur comprend que la brasserie prête une tireuse pour l'achat d'un fût, et pour quelles occasions.

**Independent Test**: lire la section → le principe, la condition (achat d'un fût) et les trois occasions sont présents, sans condition commerciale ajoutée.

- [x] T002 [US1] Ajouter dans `src/features/sibra/sections/sibra-tireuse-section.astro` le paragraphe de principe en `<Text size="base" class="max-w-xl text-foreground">` : « La brasserie propose aussi le prêt de tireuse pour l'achat d'un fût. » — phrase reprise mot à mot du texte source ([data-model.md](./data-model.md)) — suivie de l'amorce « Par exemple : » qui introduit la liste comme illustrative et non limitative (FR-003, [contracts/sections.md](./contracts/sections.md))
- [x] T003 [US1] Ajouter la constante locale `occasions` typée `{ icon: keyof typeof icons, label: string }` dans `src/features/sibra/sections/sibra-tireuse-section.astro` : `calendar-heart` / « Un anniversaire », `users-round` / « Un séminaire d'entreprise », `smile` / « Un week-end entre copaines » — valeurs exactes et ordre dans [data-model.md](./data-model.md)
- [x] T004 [US1] Rendre `occasions` dans `src/features/sibra/sections/sibra-tireuse-section.astro` en `<ul role="list">` d'un `<li>` par occasion, chaque item en `<Card class="bg-background …">` associant `<Icon>` (décoratif, sans `title`) et le libellé ; grille empilée à 375 px, alignée horizontalement à partir de `md` ([research.md](./research.md) R65-4)

**Checkpoint**: la section expose le principe, la condition et les trois occasions, lisibles aux deux largeurs.

---

## Phase 4: User Story 2 — Savoir comment réserver (Priority: P4)

**Goal**: le visiteur sait qu'il doit appeler la brasserie pour réserver.

**Independent Test**: lire la section → l'invitation à appeler est présente, mise en évidence, et aucune coordonnée n'est affichée.

- [x] T005 [US2] Ajouter en pied de `src/features/sibra/sections/sibra-tireuse-section.astro` l'invitation « Appelez la brasserie pour réserver une tireuse ! » en `<Text size="xl" weight="bold" color="white">` — **grand texte obligatoire** sur le rose (3,6:1) : `weight="semibold"` ne qualifie pas ([research.md](./research.md) R65-3) ; **aucun numéro, aucun `tel:`, aucun `<a>`, aucun `<button>`** (gate #67, [research.md](./research.md) R65-1)

**Checkpoint**: le mode de réservation est explicite et accessible, sans coordonnée ni élément interactif factice.

---

## Phase 5: Intégration

- [x] T006 Importer et insérer `<SibraTireuseSection />` entre `<SibraBieresSection />` et `<SibraInstagramSection />` dans `src/pages/la-sibra.astro`, imports triés alphabétiquement, sans autre modification de la page ([contracts/sections.md](./contracts/sections.md))

---

## Phase 6: Polish & vérifications

- [x] T007 [P] Vérifier les invariants du contrat par relecture et `grep` sur `src/features/sibra/sections/sibra-tireuse-section.astro` : aucun `href`, aucun `<button>`, aucun `tel:`/`mailto:`, aucun chiffre de numéro, aucun `Badge`, aucun `variant="tertiary"`, aucun `color="white"` hors grand texte, aucune valeur hexadécimale
- [x] T008 [P] Relecture croisée du contenu affiché contre le bloc « Prêt de tireuses » de `brasserie-assets/Texte site internet.md` : zéro occasion, zéro condition (tarif, caution, durée, volume, livraison) inventées (principe I de la constitution, SC-002)
- [x] T009 Vérification visuelle de `/la-sibra` à **375 px** et à **≥ 1280 px** : pas de débordement horizontal, cartes d'occasions lisibles et bien réparties, ornement qui ne recouvre aucun texte, rythme des sections cohérent (blanc → vert → blanc → rose → blanc) (SC-003)
- [x] T010 Gates automatiques : `./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css` (exit 0), `./node_modules/.bin/astro check` puis `./node_modules/.bin/astro build` — ⚠️ ne pas utiliser `pnpm` sur ce poste ([quickstart.md](./quickstart.md))
- [x] T011 Dérouler [quickstart.md](./quickstart.md) de bout en bout et cocher chaque vérification, dont le contrôle de périmètre `git diff --stat` (aucun fichier de `.claude/`, aucun `pnpm-workspace.yaml`, aucun fichier temporaire)

---

## Dependencies

```text
T001 (squelette)
 ├── T002 → T003 → T004   US1
 └── T005                 US2
T006 (intégration page)   après T004/T005
T007–T011                 après T006
```

Toutes les tâches T002–T005 touchent le **même fichier** : elles sont séquentielles malgré leur indépendance logique. Seules T007 et T008 sont réellement parallélisables.

## Implementation Strategy

Fichier unique, construit de haut en bas : squelette → principe → occasions → invitation à appeler → intégration → vérifications. Les deux user stories, toutes deux P4 et portées par le même composant, sont livrées ensemble ; leur découpage sert la relecture, pas une livraison échelonnée.

**MVP** : T001–T002 + T005 + T006 satisfont déjà l'acceptance scenario de l'US4 de l'epic (principe + mode de réservation) ; les cartes d'occasions (T003–T004) complètent FR-003.
