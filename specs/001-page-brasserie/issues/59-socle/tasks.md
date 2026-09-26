# Tasks: Socle technique La Sibra (issue #59)

**Input**: Design documents from `specs/001-page-brasserie/issues/59-socle/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/assets.md](./contracts/assets.md), [quickstart.md](./quickstart.md)

**Tests**: aucun framework de test dans le dépôt → **aucune tâche de test automatisé**. La validation repose sur `pnpm build` (qui inclut `astro check`), `pnpm lint` et la vérification visuelle mobile + desktop.

**Numérotation** : les identifiants **T001–T007 sont ceux de l'epic** ([`../../tasks.md`](../../tasks.md)) et sont conservés tels quels pour la traçabilité avec l'issue GitHub #59. Ils ne reflètent donc pas l'ordre d'exécution ; celui-ci est donné explicitement dans « Ordre d'exécution » plus bas. Les sous-tâches ajoutées par ce découpage portent un suffixe (`T001a`, `T006b`…), les tâches purement locales un préfixe `T0xx`.

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, aucune dépendance sur une tâche inachevée)
- **[Story]** : US1 (route), US2 (identité visuelle), US3 (assets) — cf. [spec.md](./spec.md)

## Path Conventions

Site Astro organisé par features : page dans `src/pages/`, feature du lieu dans `src/features/sibra/images/`, asset d'accueil dans `src/features/home/images/`, thème dans `src/styles/global.css`, layout dans `src/layouts/main.astro`, constantes dans `src/utils/constants.ts`.

---

## Phase 1: Setup (arborescence)

**Purpose**: préparer le dossier de feature avant d'y déposer quoi que ce soit.

- [x] T000 Créer le dossier `src/features/sibra/images/` (la feature `sibra` n'existe pas encore dans le dépôt ; nom **sans article**, convention R1)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: route, thème et typage — bloquants pour la page et pour toutes les issues suivantes (#60–#66).

**⚠️ CRITICAL**: aucune tâche des phases 3+ ne peut être validée avant la fin de cette phase.

- [x] T003 [P] Ajouter `LA_SIBRA: '/la-sibra'` à l'objet `PATH` de `src/utils/constants.ts`, inséré **après** `A_LA_CARTE_POSTALE` et **avant** les entrées à ancre (`QUI_SOMMES_NOUS`…), en respectant le style existant (guillemets simples, `as const` inchangé)
- [x] T004 Déclarer les 8 couleurs nommées dans le bloc `@theme` de `src/styles/global.css`, sous un commentaire `/* La Sibra */` placé après le bloc « À La Carte Postale » : `--color-sibra-green` `oklch(0.6214 0.1490 120.95)`, `--color-sibra-green-accent` `oklch(0.5214 0.1490 120.95)`, `--color-sibra-pink` `oklch(0.6469 0.1663 1.60)`, `--color-sibra-pink-accent` `oklch(0.5469 0.1663 1.60)`, `--color-sibra-orange` `oklch(0.7880 0.1707 69.98)`, `--color-sibra-orange-accent` `oklch(0.6880 0.1707 69.98)`, `--color-sibra-neutral` `oklch(0.1292 0.0415 265.15)`, `--color-sibra-neutral-accent` `oklch(0.0501 0.0086 264.05)` — **valeurs exactes de la charte, aucune retouche** ([contracts/theme.md](../../contracts/theme.md))
- [x] T004a Ajouter le mapping `[data-theme='sibra']` dans `@layer base` de `src/styles/global.css`, après `[data-theme='la-carte-postale']` : primary=green, secondary=pink, tertiary=orange, quaternary=neutral, chacun avec son `-accent`. **Ne modifier aucun des cinq thèmes existants** ; ne rien ajouter au bloc `@theme inline` (les dérivés `-light`/`-dark` sont déjà générés)
- [x] T005 [P] Ajouter `'sibra'` en fin de l'union `Props['theme']` de `src/layouts/main.astro` (≈ l. 16), sans toucher aux autres valeurs

**Checkpoint**: `pnpm build` passe, le thème est déclaré mais encore inutilisé.

---

## Phase 3: User Story 1 — Atteindre la page du lieu (Priority: P1) 🎯 MVP

**Goal**: `/la-sibra` répond en 200, dans l'habillage commun du site, avec son titre et une description provisoire.

**Independent Test**: ouvrir `http://localhost:4321/la-sibra` → page servie, en-tête/pied de page présents, onglet « La Sibra · Commun'île », 0 erreur console.

- [x] T006 [US1] Créer `src/pages/la-sibra.astro` : importer `Layout` depuis `../layouts/main.astro`, rendre `<Layout theme="sibra" content={{ title: 'La Sibra', description }}>` avec une `description` **provisoire et factuelle** (lieu, microbrasserie du quartier Saint-Clément à Nantes, anciennement « Les Bières de Charlotte ») — pas de contenu factice, pas de coordonnées (gate #67) ; suivre le style de `src/pages/a-la-carte-postale.astro` (frontmatter, `const description`)
- [x] T006a [US1] Vérifier le rendu : `pnpm dev` puis `/la-sibra` → 200, titre d'onglet correct, `<meta name="description">` renseignée, aucune erreur console

**Checkpoint**: la route existe — les issues #60+ peuvent y accrocher leurs sections.

---

## Phase 4: User Story 2 — Reconnaître l'identité visuelle (Priority: P1)

**Goal**: les couleurs de la charte s'appliquent à la page, sans régression sur les autres lieux.

**Independent Test**: prélever `--theme-primary/secondary/tertiary` sur `/la-sibra` → vert `#7A9300`, rose `#DC5B87`, orange `#FEA300` ; rouvrir les cinq autres pages de lieu → inchangées.

- [x] T006b [US2] Vérifier dans l'inspecteur, sur l'élément `[data-theme="sibra"]` de `/la-sibra`, que `--theme-primary`, `--theme-secondary`, `--theme-tertiary` et `--theme-quaternary` résolvent bien vers les valeurs de la charte (cf. [quickstart.md](./quickstart.md) § 2)
- [x] T006c [US2] Vérifier la non-régression : ouvrir `/le-wattignies`, `/les-landes-fertiles`, `/le-labo-diva`, `/le-bar-ile`, `/a-la-carte-postale` → aucune couleur modifiée
- [x] T006d [US2] Consigner dans la PR les règles de contraste applicables aux sections futures (blanc en grand texte seulement sur vert/rose, jamais de blanc sur orange, `Badge variant="tertiary"` proscrit) — elles sont déjà écrites dans [contracts/theme.md](../../contracts/theme.md), il s'agit de les rappeler pour la revue

**Checkpoint**: l'identité du lieu est en place et isolée des autres thèmes.

---

## Phase 5: User Story 3 — Disposer des visuels (Priority: P2)

**Goal**: photos et décorations livrées, optimisées, à leur emplacement définitif.

**Independent Test**: `magick identify` sur les quatre images → dimensions et poids conformes ; les deux SVG s'importent comme composants Astro et se teintent via `text-*-accent`.

- [x] T001 [P] [US3] Convertir les trois photos vers `src/features/sibra/images/` avec `magick <source> -auto-orient -resize 1600x -quality 80 <cible>` : `brasserie-assets/1000016867.jpg` → `sibra-boutique.webp`, `1000016868.jpg` → `sibra-brassage.webp`, `1000016869.jpg` → `sibra-bouteilles.webp` ; vérifier largeur ≤ 1600 px et poids < 300 Ko par fichier
- [x] T002 [P] [US3] Créer le recadrage paysage `src/features/home/images/la-sibra-card.webp` : `magick brasserie-assets/1000016867.jpg -auto-orient -crop 3472x1111+0+2350 +repage -resize 1280x -quality 80 <cible>` — offset validé visuellement (comptoir + tonneau, cf. [research.md](./research.md) S2) ; ratio attendu 3,125:1 (≈ 1280 × 410), **jamais** de `-resize …!` (déformation interdite)
- [x] T007 [P] [US3] Copier `specs/001-page-brasserie/assets/sibra-hero-decoration.svg` et `sibra-what-ornament.svg` vers `src/features/sibra/images/` (le fichier `fallback-hero-decoration-labo-diva-recolore.svg` **reste** dans `specs/`, non retenu) ; vérifier qu'aucun `fill="#…"` ne subsiste (`grep -E 'fill="#|stroke="#' src/features/sibra/images/*.svg` doit être vide)
- [x] T007a [US3] Vérifier l'import des deux SVG comme composants Astro depuis `src/pages/la-sibra.astro` (patron `src/features/la-carte-postale/sections/la-carte-postale-hero-section.astro`) : `<SibraHeroDeco class="… text-secondary-accent" aria-hidden="true" />` et `<SibraWhatOrnament class="… text-primary-accent" aria-hidden="true" />` — contrôler visuellement que `currentColor` prend bien la teinte du thème (rose foncé / vert foncé, pas noir)
- [x] T007b [US3] Vérifier qu'aucun asset source n'a été versionné par erreur : `git status` ne doit lister ni `brasserie-assets/` ni `specs/001-page-brasserie/assets/`

**Checkpoint**: les issues #60–#66 peuvent importer les visuels sans retraitement.

---

## Phase 6: Polish & Cross-Cutting

- [x] T0P1 Lancer `pnpm lint` et corriger les éventuelles remontées (config ESLint @antfu : quotes, ordre des imports, formatage CSS)
- [x] T0P2 Lancer `pnpm build` (inclut `astro check`) et obtenir un build vert sans avertissement nouveau
- [x] T0P3 Vérification visuelle **mobile (375 px) + desktop (≥ 1280 px)** de `/la-sibra` : pas de débordement horizontal, décorations de vérification correctement positionnées ou masquées
- [x] T0P4 Commiter en Conventional Commits, en incluant **les artefacts de specs** de `specs/001-page-brasserie/issues/59-socle/` ; ouvrir la PR avec `--base 001-page-brasserie` (jamais `main`) et `Closes #59` dans le corps

---

## Ordre d'exécution

```text
T000
 └─> T003 [P]  T004 → T004a   T005 [P]        (Phase 2, bloquante)
       └─> T006 → T006a                        (US1)
             ├─> T006b, T006c, T006d           (US2)
             └─> T001 [P], T002 [P], T007 [P] → T007a → T007b   (US3)
                   └─> T0P1 → T0P2 → T0P3 → T0P4
```

**Dépendances clés**

- T004a dépend de T004 (le mapping référence les tokens).
- T006 dépend de T005 (sans l'union élargie, `astro check` échoue) et de T004a (sinon la page n'a pas de thème).
- T007a dépend de T006 (il faut une page où insérer les décorations) et de T007.
- Les phases US2 et US3 sont indépendantes l'une de l'autre et peuvent être menées en parallèle une fois US1 terminée.

**Parallélisable** : `T003 ∥ T005` ; puis `T001 ∥ T002 ∥ T007`.

## Portée MVP

**T000 + Phase 2 + T006/T006a** suffisent à débloquer les issues suivantes : la route rend avec son thème. Les assets (US3) restent néanmoins **dans cette issue** car les issues #60–#63 en dépendent immédiatement.

## Hors périmètre (rappel)

Sections de contenu (#60–#63, #65), navigation/footer/accueil/sitemap/robots/JSON-LD définitif (#64, #66), logo de La Sibra (non fourni), confirmation des coordonnées (gate #67).
