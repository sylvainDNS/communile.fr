# Tasks: Préparer sa visite à La Sibra (issue #61)

**Input**: Design documents de `specs/001-page-brasserie/issues/61-boutique/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/sections.md](./contracts/sections.md), [quickstart.md](./quickstart.md)

**Tests**: aucun framework de test dans le dépôt et aucun test demandé par la spec. Les portes de validation sont `eslint` + `astro check` + `astro build` + la vérification visuelle et éditoriale du [quickstart](./quickstart.md).

**Rappel impératif** : ne jamais exécuter `pnpm` dans cet environnement — appeler les binaires de `./node_modules/.bin/`. Ne jamais toucher à `.claude/` ni à `pnpm-workspace.yaml`. Ne jamais faire `git add -A` ni `git add .`.

## Format

`- [ ] [TaskID] [P?] [Story?] Description avec chemin de fichier`

---

## Phase 1: Setup

Rien à installer, rien à générer : la branche `001-page-brasserie-boutique` part de l'epic à jour, les dépendances sont en place et la photo `sibra-bouteilles.webp` existe déjà dans la feature.

- [ ] T001 Vérifier que la branche courante est `001-page-brasserie-boutique`, issue de `001-page-brasserie` à jour, et que `git status --short` ne montre que les deux fichiers non suivis hors mandat (`.claude/settings.json`, `pnpm-workspace.yaml`), à ne jamais ajouter ni modifier

**Checkpoint**: point de départ propre.

---

## Phase 2: Foundational

Aucun prérequis bloquant : le socle (#59), le thème `sibra`, la page `src/pages/la-sibra.astro` et le composant partagé `src/components/leaflet-map.astro` sont déjà en place et ne doivent pas être modifiés.

*(Phase vide — aucune tâche.)*

---

## Phase 3: User Story 1 — Savoir quand venir (P2) 🎯 MVP

**Goal**: la page affiche les horaires de la boutique de façon proéminente, avec l'adresse du texte source et ce qu'on peut faire sur place.

**Independent Test**: ouvrir `/la-sibra`, atteindre la section boutique → énoncer les deux jours et les deux plages horaires sans relire, sans zoomer, sans quitter la page.

- [ ] T002 [US1] Créer `src/features/sibra/sections/sibra-boutique-section.astro` : `Section variant="tertiary"`, `Container` en grille 1 colonne → 2 colonnes à `md` avec `md:items-stretch`, `h2` « La boutique » en `text-foreground` — structure DOM et invariants de [contracts/sections.md](./contracts/sections.md)
- [ ] T003 [US1] Dans `src/features/sibra/sections/sibra-boutique-section.astro`, déclarer la constante locale `horaires` (exactement deux entrées : `Vendredi` / `16 h – 20 h`, `Samedi` / `11 h – 20 h`, tiret demi-cadratin, espaces ordinaires — cf. la note typographique du data-model) conformément à [data-model.md](./data-model.md)
- [ ] T004 [US1] Dans `src/features/sibra/sections/sibra-boutique-section.astro`, rendre les horaires dans une `Card` blanche contenant un `<dl>` (un `<dt>` jour / `<dd>` plage par entrée), en grand caractère gras et en `text-foreground` — la relation jour ↔ plage doit être portée par le balisage (FR-004)
- [ ] T005 [US1] Dans `src/features/sibra/sections/sibra-boutique-section.astro`, rédiger les deux paragraphes issus du bloc « La Boutique » de `brasserie-assets/Texte site internet.md` : la phrase d'ouverture citant « au 121 rue du Général Buat », puis goûter les nouveautés et les classiques / en discuter avec le brasseur / quelques bouteilles toujours ouvertes dans le frigo — tout en `text-foreground`, aucun fait ajouté
- [ ] T006 [US1] Dans `src/features/sibra/sections/sibra-boutique-section.astro`, intégrer `sibra-bouteilles.webp` via `astro:assets` avec un `alt` FR descriptif, `loading="lazy"`, `widths` + `sizes` calés sur la colonne, et la borne portrait `h-full max-h-[560px] max-w-[460px] object-cover` (patron `sibra-bieres-section.astro`)
- [ ] T007 [US1] Relire `src/features/sibra/sections/sibra-boutique-section.astro` contre les invariants du contrat : zéro texte blanc sur l'orange, zéro élément interactif, zéro coordonnée, exactement un `h2`, exactement deux horaires

**Checkpoint**: la section boutique est complète et autonome ; elle n'est pas encore montée dans la page (T014).

---

## Phase 4: User Story 2 — Savoir où aller (P2)

**Goal**: la page affiche l'adresse postale complète, des repères d'accès vérifiés et une carte centrée sur le lieu.

**Independent Test**: ouvrir `/la-sibra`, atteindre la section infos pratiques → relever l'adresse complète et situer le lieu sur la carte, sans quitter la page ; avec la carte bloquée, l'adresse reste lisible.

- [ ] T008 [P] [US2] Créer `src/features/sibra/sections/sibra-infos-section.astro` : `Section variant="accent"`, `Container` en grille 1 colonne → 2 colonnes à `lg`, `h2` « Infos pratiques » en blanc, **tout le texte en blanc** (`text-foreground` interdit sur ce fond, 3,77:1) — structure DOM de [contracts/sections.md](./contracts/sections.md)
- [ ] T009 [US2] Dans `src/features/sibra/sections/sibra-infos-section.astro`, rendre l'adresse postale complète dans un `<address class="not-italic">` : `La Sibra` / `121 rue du Général Buat` / `44000 Nantes`, sous un `h3` « Adresse »
- [ ] T010 [US2] Dans `src/features/sibra/sections/sibra-infos-section.astro`, déclarer la constante locale `reperes` et la rendre en `<ul>` sous un `h3` « Se repérer » : uniquement les deux repères re-vérifiés (« Entre les églises Saint-Clément et Saint-Donatien », « Arrêt de bus “Chanzy”, à moins de 200 m ») — **aucune mention de ligne de bus**, aucune icône (jeu d'icônes partagé non enrichi, cf. FR-026)
- [ ] T011 [US2] Dans `src/features/sibra/sections/sibra-infos-section.astro`, déclarer la constante locale de coordonnées `[47.225406, -1.543878]` (valeur de [research.md § R61-1](./research.md), écrite une seule fois) et la passer à `LeafletMap` en `center` **et** en `markers[0].position`
- [ ] T012 [US2] Dans `src/features/sibra/sections/sibra-infos-section.astro`, configurer `LeafletMap` : `id="sibra-infos-map"`, `zoom={16}`, `height="400px"`, `scrollWheelZoom={false}`, popup du repère = nom du lieu + adresse (jamais de coordonnée de contact), `errorText` francisé renvoyant à l'adresse affichée dans la section, classe d'arrondi comme dans `src/pages/contact.astro`
- [ ] T013 [US2] Relire `src/features/sibra/sections/sibra-infos-section.astro` contre les invariants du contrat : zéro `text-foreground` sur le fond `accent`, zéro coordonnée de contact, zéro `tel:`/`mailto:`, un seul `h2`, `h3` sans saut de niveau, `<address>` non italique

**Checkpoint**: la section infos pratiques est complète et autonome ; elle n'est pas encore montée dans la page (T014).

---

## Phase 5: User Story 3 — Trouver les deux informations en un seul parcours (P2)

**Goal**: les deux sections sont montées au bon endroit et la page se parcourt d'une traite, sur mobile comme sur desktop.

**Independent Test**: charger `/la-sibra` à 375 px puis à 1280 px, descendre une seule fois → horaires puis localisation rencontrés dans cet ordre, sans retour en arrière ni défilement horizontal.

- [ ] T014 [US3] Dans `src/pages/la-sibra.astro`, ajouter les deux imports (triés alphabétiquement, règle `perfectionist`) et insérer `<SibraBoutiqueSection />` après `<SibraWhatSection />` et `<SibraInfosSection />` après `<SibraTireuseSection />` — aucune autre modification de la page
- [ ] T015 [US3] Vérifier l'alternance des fonds sur la page rendue : blanc → vert → orange → blanc → rose → vert foncé → blanc, aucun fond de marque répété consécutivement
- [ ] T016 [US3] Vérification visuelle à **375 px** (`./node_modules/.bin/astro dev`, `/la-sibra`) : aucun défilement horizontal, horaires lisibles sans zoom, carte contenue dans la largeur, la molette au-dessus de la carte ne zoome pas et ne bloque pas le défilement de la page, la photo n'écrase pas le texte
- [ ] T017 [US3] Vérification visuelle à **≥ 1280 px** : deux colonnes dans chaque section, colonne image bornée (≤ 460 px de large, ≤ 560 px de haut), adresse et carte visibles ensemble, rythme visuel cohérent avec les sections existantes
- [ ] T018 [US3] Vérifier la dégradation de la carte : chargement de `unpkg.com` bloqué → l'adresse complète reste lisible, la page reste navigable au clavier de bout en bout, aucun piège de focus (SC-008)

**Checkpoint**: la story P2 de l'epic est livrée et testable de bout en bout.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Recalculer les contrastes des couples réellement employés (§ 4 du [quickstart](./quickstart.md)) et confirmer dans le navigateur, aux deux largeurs, qu'aucun couple ne descend sous son seuil AA
- [ ] T020 [P] Exécuter les trois greps de contrôle du § 2 du [quickstart](./quickstart.md) : zéro `tel:`/`mailto:`/numéro/email, exactement les deux horaires du texte source (et aucun horaire d'archive), zéro `<a>`/`<button>`/`tabindex` ajouté par les deux sections
- [ ] T021 [P] Relecture croisée éditoriale section boutique ↔ bloc « La Boutique » de `brasserie-assets/Texte site internet.md` (version du 2026-09-18) : horaires, adresse et trois propositions identiques, aucun fait ajouté
- [ ] T022 Lancer les portes automatiques : `./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css` (exit 0 exigé), puis `./node_modules/.bin/astro check`, puis `./node_modules/.bin/astro build`
- [ ] T023 Commiter les artefacts de specs et le code en Conventional Commits, fichiers ajoutés **explicitement** (jamais `git add -A` ni `git add .`), puis ouvrir la PR avec `gh pr create --base 001-page-brasserie` et un corps contenant `Closes #61` ainsi que les écarts E1/E2/E3 à valider
- [ ] T024 Surveiller la CI (`gh pr checks <n> --watch`) jusqu'au vert ; corriger et repousser si rouge ; arrêter tout serveur de dev lancé pour les vérifications visuelles

---

## Dependencies & Execution Order

### Phases

- **Phase 1 (Setup)** → prérequis de tout le reste.
- **Phase 2 (Foundational)** → vide.
- **Phase 3 (US1)** et **Phase 4 (US2)** → **indépendantes entre elles** : deux fichiers distincts, aucune donnée partagée.
- **Phase 5 (US3)** → requiert que les deux sections existent (T002–T013).
- **Phase 6 (Polish)** → requiert la Phase 5.

### Dépendances internes

- T003 → T004 (la constante alimente le `<dl>`)
- T002 → T003…T007
- T008 → T009…T013
- T011 → T012 (la constante de coordonnées alimente la carte)
- T014 → T015…T018
- T022 → T023 → T024

### Opportunités de parallélisation

- **US1 et US2 en parallèle** : `sibra-boutique-section.astro` et `sibra-infos-section.astro` sont deux fichiers neufs sans intersection. T002 et T008 peuvent démarrer ensemble.
- **Phase 6** : T019, T020 et T021 portent sur des contrôles disjoints et peuvent être menés en parallèle ; T022 les suit.

```text
# Démarrage parallèle possible :
Task: "Créer sibra-boutique-section.astro (T002)"
Task: "Créer sibra-infos-section.astro (T008)"
# Puis séquentiellement : T014 (assemblage) → T015–T018 (vérifications) → Phase 6
```

## Implementation Strategy

**MVP = Phase 3 (US1) + T014** : la section boutique montée dans la page satisfait déjà à elle seule la moitié la plus recherchée du besoin (les horaires). La section infos complète le parcours.

**Livraison** : une seule PR vers la branche epic `001-page-brasserie` (jamais `main`), corps contenant `Closes #61`. La PR n'est **pas** mergée par l'agent d'implémentation, et l'issue n'est pas fermée à la main.

**Hors périmètre, à ne pas traiter ici** : nav / footer / accueil (#62), SEO / JSON-LD (#63), polish final (#66), levée du gate coordonnées (#67), correction du contrat de thème de l'epic (signalée en [data-model.md](./data-model.md) § Signalements, à valider par l'humain).

---

## Résumé

| Phase | Story | Tâches | Nombre |
|---|---|---|---|
| 1 | — | T001 | 1 |
| 2 | — | — | 0 |
| 3 | US1 | T002–T007 | 6 |
| 4 | US2 | T008–T013 | 6 |
| 5 | US3 | T014–T018 | 5 |
| 6 | — | T019–T024 | 6 |
| **Total** | | | **24** |
