---
description: "Tâches de la mise à jour des tarifs et de la plaquette du Labo Diva (issue #87)"
---

# Tasks: Tarifs et plaquette du Labo Diva

**Input**: Design documents from `specs/004-labo-diva-tarifs-plaquette/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/public-surface.md](./contracts/public-surface.md), [quickstart.md](./quickstart.md)

**Tests** : pas de tests automatisés (R4). La validation suit le [quickstart](./quickstart.md).

**Organisation** : les trois stories modifient le même fichier, `src/features/le-labo-diva/sections/le-labo-diva-location.astro`. Elles sont donc séquentielles et aucune tâche d'implémentation n'est marquée [P]. Le tout est livré dans **une seule PR** (`Closes #87`), avec un commit par story via l'agent `git-commit` (Conventional Commits en français).

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, pas de dépendance sur une tâche non terminée)
- **[Story]** : US1, US2, US3 (cf. spec.md)
- 🧑 : **checkpoint humain**. L'agent s'arrête et attend le mainteneur.

---

## Phase 1: Setup

- [X] T001 Créer la branche `004-labo-diva-tarifs-plaquette` depuis `main` à jour (`git switch -c 004-labo-diva-tarifs-plaquette`) et y emporter les fichiers non suivis de `specs/004-labo-diva-tarifs-plaquette/` (ne pas committer `specs/001-page-brasserie/`, `brasserie-assets/` ni `.claude/settings.json`).
- [X] T002 Vérifier que la plaquette est en ligne : `curl -sI https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf` doit répondre `200` avec `application/pdf`, et `curl -s … | md5` doit valoir `ae9e5d479f015d9490e91e96b877460c` (FR-005). Si c'est faux, s'arrêter.

## Phase 2: Foundational

Aucune tâche : pas de prérequis partagé.

---

## Phase 3: User Story 1 - Voir le tarif horaire à jour (Priority: P1) 🎯 MVP

**Goal** : un seul badge tarifaire, « À partir de 20€ HT / heure ».

**Independent Test** : dans le HTML construit de `/le-labo-diva`, `À partir de 20€ HT / heure` apparaît 1 fois, et `demi-journée`, `75€`, `140€` et `>20€` n'apparaissent pas (quickstart §2).

- [X] T003 [US1] Dans le tableau `badgesLocation` de `src/features/le-labo-diva/sections/le-labo-diva-location.astro`, remplacer les trois entrées `'À partir de >20€ HT/heure'`, `'À partir de 75€ HT/ demi-journée'` et `'À partir de 140€ HT/ journée'` par une seule entrée, `'À partir de 20€ HT / heure'`, en dernière position. Les 7 premières entrées et `badgesPrivatisation` ne changent pas (data-model.md, FR-001 à FR-003).
- [X] T004 [US1] Committer : `fix(le-labo-diva): ne garder que le tarif horaire de location`.

**Checkpoint** : US1 livrable seule.

---

## Phase 4: User Story 2 - Télécharger la nouvelle plaquette (Priority: P1)

**Goal** : le lien « Télécharger notre plaquette détaillée ! » sert la plaquette 2026.

**Independent Test** : le HTML construit contient `LABO_DIVA_2026_10_27.pdf` une fois et ne contient plus `LABO_DIVA_2026_06_11.pdf` (quickstart §2) ; le PDF répond comme en T002.

- [X] T005 [US2] Dans `src/features/le-labo-diva/sections/le-labo-diva-location.astro`, remplacer le `href` `https://r2.communile.fr/downloads/LABO_DIVA_2026_06_11.pdf` par `https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf`. Le libellé, `download`, `target="_blank"` et les classes ne changent pas (FR-004, FR-007).
- [X] T006 [US2] Committer : `fix(le-labo-diva): mettre à jour la plaquette commerciale 2026`.

**Checkpoint** : US1 et US2 couvrent toute la demande du Labo Diva.

---

## Phase 5: User Story 3 - Lire une description sans doublon (Priority: P3)

**Goal** : la description de la carte « Location d'une salle au Labo » ne contient plus la phrase en double.

**Independent Test** : `!s évènements` n'apparaît pas dans le HTML construit et `vos évènements réguliers` apparaît une seule fois (quickstart §2).

- [X] T007 [US3] Dans le `<Text>` de la carte « Location d'une salle au Labo » de `src/features/le-labo-diva/sections/le-labo-diva-location.astro`, supprimer le fragment `!s évènements réguliers (cours de danse, session de chant,...) ou tout autre projet !`. Le texte doit se terminer par `…vos évènements réguliers (cours de danse, session de chant,...) ou tout autre projet !` (research R2, FR-008). Garder le formatage du fichier (les retours à la ligne sont réindentés par le lint).
- [X] T008 [US3] Committer : `fix(le-labo-diva): retirer la phrase dupliquée de la location de salle`.

---

## Phase 6: Polish & validation

- [X] T009 Lancer `pnpm lint` puis `pnpm build`. Les deux doivent réussir ; corriger et committer si besoin (`pnpm lint --fix`).
- [X] T010 Exécuter les contrôles `grep` du quickstart §2 sur le HTML construit dans `dist/client/` et vérifier chaque valeur attendue face à [contracts/public-surface.md](./contracts/public-surface.md).
- [X] T011 🧑 Relecture visuelle avec `pnpm preview` : `/le-labo-diva` à 375 px et à 1280 px (8 badges, pas de casse de mise en page), clic sur le lien de la plaquette. Vérifier aussi à l'œil que les tarifs du PDF sont cohérents avec « 20€ HT / heure » (SC-004, hypothèse de la spec).
- [X] T012 Pousser la branche et ouvrir la PR vers `main` (`Closes #87`). Le corps de la PR liste les trois changements et les résultats des contrôles T009 et T010.
- [ ] T013 🧑 Merge et mise en production par le mainteneur, puis rejouer le quickstart §5 sur `https://communile.fr/le-labo-diva`.
- [ ] T014 🧑 Faire valider la page en ligne par le Labo Diva via Sarah (SC-005), puis cocher les tâches de ce fichier.

---

## Dependencies & Execution Order

- T001 → T002 → US1 (T003–T004) → US2 (T005–T006) → US3 (T007–T008) → T009 → T010 → T011 → T012 → T013 → T014.
- Les stories sont fonctionnellement indépendantes, mais elles touchent le même fichier : on les traite à la suite pour éviter les conflits. L'ordre US1 → US2 → US3 suit les priorités.
- US2 dépend de T002 (le fichier doit être en ligne avant le lien).

### Parallel Opportunities

- Aucune dans l'implémentation (un seul fichier).
- T002 peut tourner pendant T001.
- En T011, la relecture du PDF et la relecture de la page sont indépendantes.

## Implementation Strategy

- **MVP** : US1 seule (le tarif périmé est l'information la plus trompeuse en ligne).
- **Livraison recommandée** : US1 + US2 + US3 dans une même PR. Le changement est petit et les trois stories touchent la même section.
