---
description: "Tâches de la mise à jour Astro 5 → 7 et de l'écosystème"
---

# Tasks: Mise à jour d'Astro et de son écosystème

**Input**: Design documents from `specs/002-astro-upgrade/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/public-surface.md](./contracts/public-surface.md), [quickstart.md](./quickstart.md)

**Tests**: pas de tests automatisés demandés. La validation passe par les procédures du [quickstart](./quickstart.md) : build, lint, diff HTML, diff visuel, Lighthouse.

**Organization**: les paliers du plan (0, A, B, C, D, doc, 6) sont répartis ainsi :
- palier A → phase fondatrice (bloquante) ;
- palier B → US1 ;
- paliers C et D → US2 ;
- doc → US3 ;
- palier 6 → phase finale.

Tout est livré dans **une seule PR**, avec un commit par palier (commits via l'agent `git-commit`, Conventional Commits en français).

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, pas de dépendance sur une tâche non terminée)
- **[Story]** : US1, US2, US3 (cf. spec.md)
- 🧑 : **checkpoint humain**. Action dans le dashboard Cloudflare par le mainteneur ; l'agent s'arrête et attend.

## Conventions

- Branche : `002-astro-upgrade`. Dossier de travail non versionné : `tmp/astro-upgrade/`.
- Les 8 routes du contrat : `/`, `/a-la-carte-postale`, `/contact`, `/le-bar-ile`, `/le-labo-diva`, `/le-wattignies`, `/les-landes-fertiles`, `/nexiste-pas` (404).
- Les références R1–R9 renvoient aux décisions de [research.md](./research.md).

---

## Phase 1: Setup (référence avant modification)

**Purpose** : capturer l'état de référence et l'outillage de comparaison. Aucune dépendance n'est modifiée à ce stade.

- [X] T001 Ajouter `tmp/` à `.gitignore`, sous le commentaire `# build output`, pour que les captures ne soient jamais committées. Créer ensuite `tmp/astro-upgrade/{baseline,current}/`.
- [X] T002 [P] Écrire `tmp/astro-upgrade/snapshot.sh` (non versionné). Arguments : `<base_url> <out_dir>`. Pour chacune des 8 routes :
  - `curl -s` du HTML vers `<out_dir>/html/<slug>.html` ;
  - `curl -sI` vers `<out_dir>/headers/<slug>.txt` ;
  - `curl -sI` d'un asset `/_astro/*` trouvé dans le HTML de `/`, et de `/favicon.ico`, vers `<out_dir>/headers/` ;
  - statut HTTP de `/nexiste-pas` et de `/contact/` vers `<out_dir>/status.txt`.
- [X] T003 [P] Écrire `tmp/astro-upgrade/compare.sh` (non versionné). Arguments : `<dir_a> <dir_b>`. Pour chaque `html/<slug>.html` :
  - normaliser : `_astro/<nom>.<hash>.<ext>` → `_astro/<nom>.<ext>` (sed), suppression du bloc Plausible (`<script … data-api="/mix/load/event"…>` et le stub `window.plausible` qui suit) ;
  - reformater avec `pnpm dlx prettier@3 --parser html` ;
  - `diff -u`, avec un récapitulatif des pages identiques ou différentes.
- [X] T004 Capturer la référence de **production** : `tmp/astro-upgrade/snapshot.sh https://communile.fr tmp/astro-upgrade/baseline/prod`.
- [X] T005 Capturer la référence **locale** sur le commit actuel (Astro 5) :
  - `pnpm build` ;
  - servir `./dist` avec `pnpm dlx wrangler@4 pages dev ./dist --port 8788` ;
  - `snapshot.sh http://localhost:8788 tmp/astro-upgrade/baseline/local` ;
  - arrêter le serveur.
- [ ] T006 [P] Captures d'écran pleine page, via Chrome DevTools MCP, de `https://communile.fr` à 390 px et à 1440 px de large pour les 8 routes → `tmp/astro-upgrade/baseline/screens/<slug>-<largeur>.png`.
- [ ] T007 [P] Audit Lighthouse mobile des 7 routes 200 de `https://communile.fr` → `tmp/astro-upgrade/baseline/lighthouse.json` : scores perf, a11y, best practices et SEO, plus le poids total transféré par page.

**Checkpoint** : les références prod et locale existent, et `compare.sh baseline/local baseline/local` renvoie « 8/8 identiques ».

---

## Phase 2: Foundational — Palier A : Astro 6 + Cloudflare Workers (bloquant)

**Purpose** : l'adaptateur ≥ 13 ne supporte plus Pages (R2). Toute la suite en dépend.

**⚠️ CRITICAL** : aucune story ne démarre avant le checkpoint T017.

- [X] T008 Monter les dépendances du palier A :
  - `pnpm add astro@^6 @astrojs/cloudflare@^13` ;
  - `pnpm add -D wrangler@latest` (peer de l'adaptateur, R2) ;
  - vérifier dans `package.json` et `pnpm-lock.yaml` : astro 6.x (dernière), adaptateur 13.x (dernière), aucune erreur de peer bloquante.
- [X] T009 [P] Dans `package.json`, remplacer `engines.node` `">=22"` par `"^22.22.3 || ^24.16.0 || >=26.3.0"` (R9).
- [X] T010 [P] Réécrire `wrangler.jsonc` (R2) :
  - supprimer `pages_build_output_dir` et tout le bloc `env` (`preview` et `production`, avec `NODE_VERSION: 21` et `PNPM_VERSION: 9`) ;
  - passer `compatibility_date` à la date du jour ;
  - conserver `$schema`, `name: "communile-fr"`, `compatibility_flags: ["nodejs_compat"]` et `observability` ;
  - ne pas ajouter `main` ni `assets`, que l'adaptateur injecte ;
  - garder les commentaires d'en-tête utiles, supprimer ceux qui ne concernent que Pages.
- [X] T011 [P] Dans `astro.config.mjs`, remplacer `adapter: cloudflare()` par `adapter: cloudflare({ imageService: 'compile' })` pour garder le comportement image actuel (R5).
- [X] T012 [P] Dans `public/_headers`, ajouter une règle `X-Robots-Tag: noindex` pour les URLs de preview Workers (`*.workers.dev`), en conservant la règle `pages.dev` existante jusqu'à la suppression du projet Pages. Vérifier la syntaxe des motifs d'hôte dans la doc « Headers » des Workers static assets (developers.cloudflare.com/workers/static-assets/headers/) avant d'écrire la règle.
- [X] T013 `pnpm build` : corriger toute erreur liée au guide v6 (research R9 : aucun point applicable attendu). Consigner dans `tmp/astro-upgrade/palier-a.md` les avertissements restants.
- [X] T014 Lancer `pnpm preview` (workerd), puis `snapshot.sh http://localhost:4321 tmp/astro-upgrade/current/a` et `compare.sh tmp/astro-upgrade/baseline/local tmp/astro-upgrade/current/a` :
  - attendu : un diff vide ;
  - tout écart doit être corrigé dans `src/`, ou expliqué dans `tmp/astro-upgrade/palier-a.md`.
- [X] T015 `pnpm lint` doit être vert (outillage de lint encore inchangé).
- [ ] T016 Commit du palier A (agent `git-commit`), par exemple `chore(astro): monter Astro 6 et migrer Cloudflare Pages vers Workers`. Puis `git push -u origin 002-astro-upgrade`.
- [ ] T017 🧑 Checkpoint humain, dans le dashboard Cloudflare :
  - créer le Worker `communile-fr` via **Workers Builds** en connectant le dépôt GitHub. Branche de production **temporaire** : `002-astro-upgrade`. Build : `pnpm build`. Déploiement : `npx wrangler deploy`. Variable de build `NODE_VERSION=24` ;
  - vérifier que le proxy Plausible est attaché en **route** `communile.fr/mix/load/*` (et non en Custom Domain) ;
  - ne **pas** toucher au domaine `communile.fr`, qui reste sur Pages.

  Ensuite, l'agent exécute :
  - `snapshot.sh https://communile-fr.<compte>.workers.dev tmp/astro-upgrade/current/a-cf` ;
  - `compare.sh baseline/prod current/a-cf` ;
  - le contrôle d'en-têtes, avec `noindex` présent sur les assets ([quickstart §3](./quickstart.md#3-parité-sur-cloudflare-paliers-a-à-d-sur-workersdev)).

**Checkpoint** : le Worker sert le site en Astro 6 sur `*.workers.dev`, avec une parité HTML confirmée. La production reste sur Pages.

---

## Phase 3: User Story 1 — Le visiteur ne voit aucune différence (Priority: P1) 🎯 MVP

**Goal** : le site tourne en Astro 7.3.5 et Tailwind 4.3.3, avec un rendu, des images, des interactions et un SEO identiques (palier B).

**Independent Test** : [quickstart §2 et §3](./quickstart.md) sur le build du palier B. Attendus : diff HTML vide contre la référence, captures identiques à 390 px et à 1440 px, Lighthouse ≥ référence − 2 pts, poids ≤ +5 %.

- [ ] T018 [US1] Monter les dépendances du palier B : `pnpm add astro@latest @astrojs/cloudflare@latest @astrojs/check@latest @astrojs/sitemap@latest tailwindcss@latest @tailwindcss/vite@latest`. Attendu : astro 7.3.5, adaptateur 14.3.3, tailwind 4.3.3. Vérifier qu'aucune erreur de peer bloquante n'apparaît. Si `wrangler` est sous le peer requis (^4.125), le monter avec `pnpm add -D wrangler@latest`.
- [ ] T019 [US1] Dans `astro.config.mjs` :
  - ajouter `compressHTML: true` au niveau racine de `defineConfig` (R6) ;
  - passer l'adaptateur à `cloudflare({ imageService: 'compile', session: false })` (R8) ;
  - laisser `output: 'server'` et `vite.plugins` inchangés.
- [ ] T020 [US1] `pnpm build` : corriger dans `src/**/*.astro` chaque erreur du compilateur Rust (balises non-void non fermées, syntaxe refusée), sans changer le rendu attendu (R7).
- [ ] T021 [US1] Lancer `pnpm preview`, puis `snapshot.sh http://localhost:4321 tmp/astro-upgrade/current/b` et `compare.sh baseline/local current/b` :
  - corriger dans `src/` toute différence de texte, de balisage ou d'imbrication (par exemple un `<div>` dans un `<p>` qui n'est plus réimbriqué, R7) ;
  - seuls restent acceptables les écarts de sérialisation CSS de Tailwind 4.3 (R9), à consigner dans `tmp/astro-upgrade/palier-b.md`.
- [ ] T022 [P] [US1] Contrôle témoin des espaces blancs : dans `current/b/html/a-la-carte-postale.html`, le texte doit contenir `programmation sur <a` (avec l'espace). Faire le même contrôle sur les FAQ de `/le-labo-diva` et `/le-wattignies`.
- [ ] T023 [P] [US1] Contrôle des interactions en local via Chrome DevTools MCP :
  - carte Leaflet (tuiles chargées, marqueur visible) sur `/le-bar-ile` ;
  - animations anime.js au scroll sur `/` ;
  - menu mobile du header à 390 px ;
  - ouverture et fermeture d'un `details` de FAQ ;
  - aucune erreur en console.
- [ ] T024 [US1] `pnpm lint` (outillage encore en ancienne version) :
  - s'il est vert, continuer ;
  - si `eslint-plugin-astro` 1.x ne parse plus certains fichiers à cause de la syntaxe Astro 7, consigner les fichiers et les erreurs dans `tmp/astro-upgrade/palier-b.md`, sans désactiver de règle. Le palier D les résout ; ne pas pousser tant que ce n'est pas tranché avec le mainteneur, car la CI de la PR lance `pnpm lint`.

  Commit du palier B, par exemple `chore(astro): monter Astro 7, adaptateur Cloudflare 14 et Tailwind 4.3`. Puis `git push`. Workers Builds redéploie la branche.
- [ ] T025 [US1] Parité sur `https://communile-fr.<compte>.workers.dev` :
  - `snapshot.sh` → `current/b-cf`, puis `compare.sh baseline/prod current/b-cf` ;
  - captures à 390 et 1440 px → `current/b-cf/screens/`, à comparer visuellement à `baseline/screens/` ;
  - Lighthouse mobile → `current/b-cf/lighthouse.json`, à comparer à `baseline/lighthouse.json` (SC-003, SC-004) ;
  - consigner les résultats dans `tmp/astro-upgrade/palier-b.md`.
- [ ] T026 [US1] 🧑 Dans le dashboard, vérifier que le Worker n'a **aucun** binding `IMAGES` ni `SESSION` (Worker → Settings → Bindings) (R5, R8).

**Checkpoint** : US1 validée, avec un rendu identique en Astro 7 sur Cloudflare.

---

## Phase 4: User Story 2 — Le mainteneur construit et déploie sans friction (Priority: P1)

**Goal** : TypeScript 6 et l'outillage de lint à jour. Build, lint, dev et preview sont verts, avec les mêmes commandes (paliers C et D).

**Independent Test** : [quickstart §1](./quickstart.md#1-contrôles-statiques-à-chaque-palier) depuis un clone propre, plus HMR en `pnpm dev` et CI verte sur la PR.

### Palier C : TypeScript 6

- [ ] T027 [US2] `pnpm add -D typescript@^6.0.3` (pas la 7, R3). Dans `tsconfig.json`, supprimer `"baseUrl": "."` et conserver `paths` à l'identique.
- [ ] T028 [US2] `pnpm build` : corriger dans `src/` chaque erreur remontée par `astro check` sous TS 6 (nouveaux défauts `types: []`, `noUncheckedSideEffectImports`). Ne pas ajouter `ignoreDeprecations`. Vérifier que l'alias `@/*` se résout toujours.
- [ ] T029 [US2] Commit du palier C, par exemple `chore(typescript): monter TypeScript 6`.

### Palier D : outillage de lint et de formatage

- [ ] T030 [US2] Monter l'outillage :
  - `pnpm add -D eslint@latest @antfu/eslint-config@latest eslint-plugin-format@latest eslint-plugin-astro@latest astro-eslint-parser@latest prettier-plugin-astro@latest prettier-plugin-tailwindcss@latest` ;
  - attendu : eslint 10.x, antfu 9.5.x, eslint-plugin-format 2.x, eslint-plugin-astro 3.x, astro-eslint-parser 3.x, prettier-plugin-astro 1.x, prettier-plugin-tailwindcss 0.8.x (R4) ;
  - vérifier que `pnpm why astro-eslint-parser` ne montre qu'une seule version majeure (3) ;
  - un warning de peer `prettier-plugin-astro ^0.14` provenant d'antfu est toléré.
- [ ] T031 [US2] `pnpm lint` sans correction. Si la config échoue au chargement, adapter `eslint.config.ts` au minimum requis par antfu 9 / ESLint 10, sans ajouter d'option (pas de `tailwindStylesheet`, R4). Commit des dépendances et de la config, par exemple `chore(lint): monter ESLint 10 et la config antfu 9`.
- [ ] T032 [US2] `pnpm lint --fix`, puis corriger à la main les erreurs restantes (nouvelles règles ESLint 10 : `no-useless-assignment`, `preserve-caught-error`…). Désactiver une règle seulement si la correction changerait le rendu, et justifier la désactivation en commentaire dans `eslint.config.ts`.
- [ ] T033 [US2] Garde-fou de non-régression après le churn de formatage :
  - `pnpm build && pnpm preview` ;
  - `snapshot.sh` → `current/d`, puis `compare.sh current/b current/d` ;
  - attendu : diff vide ; tout écart provient du formatage `.astro` (espaces, prettier-plugin-astro 1.x) et doit être annulé.
- [ ] T034 [US2] Commit du churn, par exemple `style: appliquer les règles ESLint 10 et le formatage prettier-plugin-astro 1`.
- [ ] T035 [US2] Vérifier les commandes mainteneur (FR-009) :
  - `rm -rf node_modules && pnpm install --frozen-lockfile` ;
  - `pnpm dev`, puis modifier un texte dans `src/pages/contact.astro` : il doit apparaître sans redémarrage (annuler la modification ensuite) ;
  - `pnpm preview` ;
  - `pnpm build` et `pnpm lint` verts.
- [ ] T036 [P] [US2] Vérifier que `.github/workflows/pull_request.yml` fonctionne tel quel (Node `'24'`, `pnpm install --frozen-lockfile`, `pnpm lint`). Ne le modifier que s'il échoue sur la PR.
- [ ] T037 [US2] `git push`, puis contrôler que le déploiement Workers Builds de la branche réussit. Rejouer `snapshot.sh` et `compare.sh baseline/prod` sur `*.workers.dev`.

**Checkpoint** : US2 validée. Tout est vert avec les mêmes commandes qu'avant, et le déploiement fonctionne.

---

## Phase 5: User Story 3 — Versions à jour et socle documenté (Priority: P2)

**Goal** : aucune dépendance du périmètre n'est en retard (hors TS 7, justifié), et la documentation de référence reflète le nouveau socle.

**Independent Test** : `pnpm outdated` n'affiche que `typescript` dans le périmètre. La constitution et `.cursor/rules/context.mdc` citent Astro 7, Node et pnpm à jour.

- [ ] T038 [US3] `pnpm outdated`. Le seul paquet du périmètre toléré est `typescript` (6.0.3 contre 7.x, R3). Les paquets exclus (`animejs`, `leaflet`, `tailwind-merge`, `class-variance-authority`, `clsx`) restent tels quels. Copier la sortie dans `tmp/astro-upgrade/outdated.txt`, pour la PR.
- [ ] T039 [P] [US3] Amender `.specify/memory/constitution.md` via `/speckit-constitution`, en PATCH 1.0.0 → 1.0.1, avec un Sync Impact Report :
  - principe V : « Astro 7 », « déployée sur Cloudflare Workers » ;
  - contraintes techniques : « pnpm ≥ 12, Node ≥ 22.22 (cf. `package.json` engines) » ;
  - l'hébergement reste l'adaptateur `@astrojs/cloudflare`.
- [ ] T040 [P] [US3] Mettre à jour `.cursor/rules/context.mdc` :
  - « Astro 5 » → « Astro 7 » ;
  - « deployed on Cloudflare (Pages/Workers) » → « deployed on Cloudflare Workers » ;
  - la ligne « Engines » → valeurs de `package.json` (Node `^22.22.3 || ^24.16.0 || >=26.3.0`, pnpm ≥ 12).

  Le reste du fichier est hors périmètre.
- [ ] T041 [US3] Commit de la documentation, par exemple `docs: aligner constitution et règles agent sur Astro 7 et Workers`. Puis `git push`.

**Checkpoint** : US3 validée.

---

## Phase 6: Livraison et mise en production (palier 6)

**Purpose** : une seule PR, puis la bascule du domaine, sans interruption perceptible (SC-006).

- [ ] T042 Ouvrir la PR `002-astro-upgrade` → `main` avec `gh pr create`. La description contient :
  - le résumé des paliers (un commit par palier) ;
  - les écarts justifiés (TS 6, ESLint forcé, Pages → Workers : tableau Complexity Tracking de [plan.md](./plan.md)) ;
  - les résultats de parité (diff HTML, captures, Lighthouse avant/après, `outdated.txt`) ;
  - la checklist SC-001 à SC-006 ;
  - la procédure de bascule et de retour arrière ([quickstart §4](./quickstart.md#4-mise-en-production-palier-6)).
- [ ] T043 🧑 Revue, approbation et merge de la PR par le mainteneur. Le build Pages de `main` va échouer, et c'est attendu : Pages continue de servir son dernier déploiement.
- [ ] T044 🧑 Dans Workers Builds, repasser la branche de production du Worker à `main`, puis attendre la fin du déploiement.
- [ ] T045 Parité finale sur `https://communile-fr.<compte>.workers.dev` (build de `main`) : `snapshot.sh` puis `compare.sh baseline/prod`.
- [ ] T046 🧑 Bascule du domaine **par route**, sans coupure (SC-006) :
  - vérifier une dernière fois que le proxy Plausible est en route `communile.fr/mix/load/*` ;
  - sur la zone `communile.fr`, ajouter au Worker `communile-fr` la route `communile.fr/*`, **sans** toucher au domaine personnalisé Pages ni au DNS. La route intercepte les requêtes avant l'origine Pages. Le proxy `/mix/load/*`, plus spécifique, reste prioritaire (doc « Routes » : « the most specific route pattern wins ») ;
  - **vérifier que c'est bien le Worker qui répond** : le HTML de `https://communile.fr/` doit référencer les mêmes noms `_astro/*.<hash>` que `current/b-cf` ou le build de `main` sur `*.workers.dev`, et non ceux de `baseline/prod` ;
  - si la route ne prend pas le pas sur le domaine personnalisé Pages (comportement non documenté par Cloudflare) : supprimer la route, puis se replier sur un détachement du domaine de Pages et un rattachement en Custom Domain au Worker, à très faible trafic. La coupure est courte ; le certificat universel de la zone couvre déjà `communile.fr`.
  - **retour arrière** : supprimer la route. C'est instantané, et Pages sert de nouveau le domaine.
- [ ] T047 Vérification en production ([quickstart §4](./quickstart.md#4-mise-en-production-palier-6)) :
  - `snapshot.sh https://communile.fr current/prod`, puis `compare.sh baseline/prod current/prod` ;
  - absence de `X-Robots-Tag: noindex` ;
  - `/mix/load/script.js` en 200, et un pageview de test visible dans Plausible ;
  - Lighthouse final.

  En cas d'écart : retour arrière immédiat (T046).
- [ ] T048 🧑 Après quelques jours d'observation sans incident :
  - si la bascule s'est faite par route, attacher `communile.fr` en Custom Domain au Worker. Cloudflare remplace l'enregistrement DNS qui pointe vers Pages ;
  - supprimer ensuite la route `communile.fr/*`, puis rejouer T047 ;
  - supprimer le projet Cloudflare Pages. Ouvrir ensuite une issue de suivi pour retirer la règle `pages.dev` de `public/_headers`.

  Sont hors périmètre, mais à noter dans cette même issue ou une autre :
  - prérendu des pages (principe II, dérogation D1) ;
  - optimisation des images, après le prérendu (dérogation D2) ;
  - option `tailwindStylesheet` ;
  - `include` du tsconfig qui omet `.astro/types.d.ts` ;
  - branchement du sitemap (dérogation D3).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)** : aucune dépendance. **Doit** précéder toute modification de dépendance, sinon la référence est perdue.
- **Foundational (Phase 2, palier A)** : dépend de la phase 1. Bloque toutes les stories, puisque l'adaptateur ≥ 13 impose Workers.
- **US1 (Phase 3, palier B)** : dépend de la phase 2.
- **US2 (Phase 4, paliers C et D)** : dépend de US1. Le palier D suppose Astro 7 (compilateur Rust aligné avec eslint-plugin-astro 3 et prettier-plugin-astro 1). Le palier C pourrait techniquement précéder B, mais l'ordre est gardé linéaire, puisque tout va dans une seule PR avec un commit par palier.
- **US3 (Phase 5)** : dépend de US1 et US2, parce que `pnpm outdated` n'a de sens qu'une fois tout monté. T039 et T040 peuvent être rédigées plus tôt.
- **Phase 6** : dépend de toutes les stories.

### Checkpoints humains (🧑)

T017 (création du Worker), T026 (bindings), T043 (merge), T044 (branche de production), T046 (bascule du domaine), T048 (suppression de Pages).

### Parallel Opportunities

- Phase 1 : T002 et T003, puis T006 et T007 (tous deux après T004).
- Phase 2 : T009, T010, T011 et T012 (fichiers distincts), après T008.
- Phase 3 : T022 et T023, après T021.
- Phase 4 : T036 en parallèle de T035.
- Phase 5 : T039 et T040.

---

## Parallel Example: Phase 2 (palier A)

```text
Après T008 :
Task: "T009 engines.node dans package.json"
Task: "T010 réécriture de wrangler.jsonc"
Task: "T011 imageService: 'compile' dans astro.config.mjs"
Task: "T012 règle noindex workers.dev dans public/_headers"
```

## Parallel Example: User Story 1

```text
Après T021 :
Task: "T022 contrôle témoin des espaces blancs dans current/b/html/"
Task: "T023 contrôle des interactions via Chrome DevTools MCP"
```

---

## Implementation Strategy

### MVP (US1)

1. Phase 1 : référence capturée.
2. Phase 2 : Astro 6 sur Workers, validé sur `*.workers.dev`.
3. Phase 3 : Astro 7 avec un rendu identique. **Stop et validation** : c'est le cœur de la valeur. Si US1 échoue (régression de rendu impossible à corriger), la PR s'arrête ici.

### Livraison incrémentale (une seule PR)

- Un commit par palier : A, B, C, D (deux commits, dépendances puis churn), puis doc.
- Chaque commit est poussé et redéployé automatiquement sur `*.workers.dev`. La production reste sur Pages jusqu'à T046.
- Retour arrière possible tant que le projet Pages existe (T048).

## Notes

- Ne jamais committer `tmp/`.
- Ne jamais monter TypeScript en 7.x (R3).
- Ne pas activer le sitemap, prérendre les pages ni ajouter `tailwindStylesheet` (FR-013).
- Les checkpoints 🧑 sont des arrêts : l'agent attend la confirmation du mainteneur avant de continuer.
