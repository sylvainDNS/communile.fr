# Research: Mise à jour d'Astro et de son écosystème

**Date**: 2026-09-26 | **Plan**: [plan.md](./plan.md)

Sources principales (consultées le 2026-09-26) :
[guide v6](https://docs.astro.build/en/guides/upgrade-to/v6/),
[guide v7](https://docs.astro.build/en/guides/upgrade-to/v7/),
[adaptateur Cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) et son
[CHANGELOG](https://github.com/withastro/astro/blob/main/packages/integrations/cloudflare/CHANGELOG.md),
[migration Pages → Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/),
[annonce TypeScript 7](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/),
[notes TypeScript 6](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html),
[migration ESLint 10](https://eslint.org/docs/latest/use/migrate-to-10.0.0),
releases GitHub de eslint-plugin-astro, @antfu/eslint-config, eslint-plugin-format,
prettier-plugin-astro, prettier-plugin-tailwindcss, tailwindcss ; métadonnées `npm view`.

## Versions cibles

| Paquet | Actuel | Cible | Remarque |
|---|---|---|---|
| astro | 5.16.6 | 7.3.5 | Vite 8, Node ≥ 22.12.0 |
| @astrojs/cloudflare | 12.6.12 | 14.3.3 | peer astro ^7.2, wrangler ^4.125 |
| @astrojs/check | 0.9.6 | 0.9.10 | peer typescript ^5 \|\| ^6 |
| @astrojs/sitemap | 3.6.0 | 3.7.4 | toujours non branché |
| tailwindcss, @tailwindcss/vite | 4.1.16 | 4.3.3 | Vite 8 supporté depuis 4.2.2 |
| prettier-plugin-tailwindcss | 0.7.1 | 0.8.1 | exige prettier ≥ 3.7 |
| prettier-plugin-astro | 0.14.1 | 1.1.0 | réécrit sur le compilateur Rust |
| eslint-plugin-astro | 1.4.0 | 3.2.1 | exige eslint ≥ 10 |
| typescript | 5.9.3 | **6.0.3** | 7.x bloqué (R3) |
| wrangler *(ajout devDep)* | 4.50.0 (transitif) | 4.141.x | peer de l'adaptateur (R2) |
| eslint *(hors périmètre, forcé)* | 9.39.0 | 10.11.0 | R4 |
| @antfu/eslint-config *(forcé)* | 6.2.0 | 9.5.1 | R4 |
| eslint-plugin-format *(forcé)* | 1.0.2 | 2.0.1 | R4 |
| astro-eslint-parser *(ajout devDep)* | 1.2.2 (transitif) | 3.2.x | R4 |

## R1 — Chemin de montée : passer par Astro 6

- **Decision** : deux paliers. Palier A : Astro 6.4.x + adaptateur 13.7.x + migration Pages → Workers. Palier B : Astro 7.3.5 + adaptateur 14.3.3 + Tailwind 4.3.
- **Rationale** : les deux paliers ont des risques sans rapport entre eux. A touche l'infrastructure (déploiement, images, en-têtes), B le rendu (compilateur Rust, espaces blancs). Les isoler permet de savoir d'où vient une régression. Le guide v7 suppose d'avoir appliqué le guide v6.
- **Alternatives** : saut direct 5 → 7. C'est supporté, avec une seule passe de QA, mais un diff visuel raté serait impossible à attribuer. Rejeté.
- **Livraison** : une seule PR (décision du mainteneur). Les paliers sont matérialisés par des commits distincts, chacun vérifié par le quickstart.
- **Outil** : `pnpm dlx @astrojs/upgrade`, ou une version explicite par paquet si l'outil n'accepte pas une cible numérique (non vérifié).

## R2 — Cloudflare Pages n'est plus supporté

- **Constat** : depuis la v13 (PR #15480), l'adaptateur cible uniquement les **Workers avec assets statiques**. Aujourd'hui, `wrangler.jsonc` contient `pages_build_output_dir`, ce qui en fait une config Pages incompatible (collision sur le binding réservé `ASSETS`).
- **Decision** : migrer vers Workers chez Cloudflare. C'est conforme à l'hypothèse de la spec : même hébergeur, même domaine, mêmes URLs.
  - `wrangler.jsonc` : supprimer `pages_build_output_dir` et les blocs `env.preview` / `env.production`. Ces blocs contiennent `NODE_VERSION: 21` et `PNPM_VERSION: 9` : ce sont des variables d'exécution, obsolètes, et Node 21 est incompatible. On conserve `name`, `compatibility_flags` et `observability`. `main` et `assets` sont injectés par l'adaptateur (ne pas coder `./dist` en dur). `compatibility_date` passe à la date de réalisation.
  - `wrangler` devient une devDependency explicite (peer de l'adaptateur).
  - `astro dev` et `astro preview` tournent désormais dans workerd (`@cloudflare/vite-plugin`). Les dépendances serveur (cva, clsx, tailwind-merge) sont en ESM : risque faible, à confirmer.
  - Côté dashboard, par un humain : créer le Worker via Workers Builds (build `pnpm build`, déploiement `npx wrangler deploy`, Node ≥ 22.12 dans les variables de build). Valider sur `*.workers.dev`, puis basculer le domaine personnalisé de Pages vers le Worker. Supprimer le projet Pages seulement après validation.
- **Alternatives** : rester sur l'adaptateur 12 / Astro 5, ce qui contredit l'objectif. Rejeté.
- **Risques ouverts** :
  - Le proxy Plausible `/mix/load/*` est un Worker Cloudflare distinct, hors dépôt (confirmé par le mainteneur). Les routes Workers s'exécutent avant un Worker de Custom Domain, lequel est traité comme une origine ([doc Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)). Le proxy survit donc à la bascule s'il est attaché en *route* `communile.fr/mix/load/*`. À vérifier dans le dashboard avant la bascule.
  - La règle `noindex` de `public/_headers` cible `:project.pages.dev`. Les URLs de preview deviennent `workers.dev`, donc il faut une règle équivalente. `_headers` ne s'applique qu'aux assets statiques, comme aujourd'hui sur Pages avec du SSR : on vise la parité, pas une amélioration.
  - La bascule du domaine peut provoquer une courte coupure. On la fait à faible trafic (SC-006).

## R3 — TypeScript 7 bloqué, cible 6.0.3

- **Constat** : `typescript@7.0.2`, le portage Go, ne fournit pas d'API JS. Microsoft l'annonce : les outils basés sur Volar (Astro) ne peuvent reposer que sur TS 6.0. Deux autres limites :
  - `@astrojs/check@0.9.10` a pour peer `^5 || ^6` et appelle l'ancienne API : échec à l'exécution avec TS 7.
  - `typescript-eslint` 8.70 exige `<6.1.0`.
- **Decision** : `typescript@6.0.3`, avec justification FR-012.
- **Impact tsconfig** :
  - `baseUrl` est déprécié en TS 6, et une dépréciation y devient une erreur. On le supprime : `paths` commence par `./`, il reste résolu relativement au tsconfig.
  - `moduleResolution: Bundler` (preset Astro) est OK.
  - Nouveaux défauts TS 6 : `types: []`, `noUncheckedSideEffectImports`. Risque faible : le projet n'a pas de dépendance `@types/*`. À confirmer par `astro check`.
- **Alternatives** : double installation via l'alias `@typescript/typescript6` + TS 7 natif. Aucun gain, puisque seul `astro check` tourne. Rejeté.
- **Hors périmètre, noté** : l'`include` du tsconfig remplace celui du preset et omet `.astro/types.d.ts`. C'est un problème préexistant, non traité ici.

## R4 — ESLint 10 forcé par eslint-plugin-astro 3

- **Constat** :
  - `eslint-plugin-astro` ≥ 2 exige `eslint >= 10`, et `@antfu/eslint-config` 6.x est limité à `eslint ^9`.
  - ESLint 10 est accepté par antfu ≥ 8.0. Les peers Astro sont relâchés dans antfu ≥ 9.2.
  - `eslint-plugin-format` 1.0.2 est limité à `eslint ^9`. La 2.0.1 embarque prettier ^3.8.1, ce qui satisfait aussi `prettier-plugin-tailwindcss` 0.8 (≥ 3.7).
- **Decision** : `eslint` 10.11, `@antfu/eslint-config` 9.5.1, `eslint-plugin-format` 2.0.1, plus `astro-eslint-parser` ^3.2 en devDep explicite. Sans cette dépendance explicite, antfu résoudrait le parser v1 pendant que le plugin utilise le v3 : deux compilateurs différents.
- **Alternatives** : garder ESLint 9 avec `eslint-plugin-astro` 1.7.0. Ce plugin parse avec l'ancien compilateur, alors qu'Astro 7 compile avec le compilateur Rust. On aurait un linter qui ne voit pas le même code que le build. Rejeté.
- **Attendus** :
  - Churn de `lint --fix` : nouvelles règles ESLint 10 (`no-useless-assignment`, `preserve-caught-error`…) et règles stylistiques antfu.
  - Diffs de formatage `.astro` (prettier-plugin-astro 1.x).
  - Warning peer bénin : antfu 9.5.1 déclare encore `prettier-plugin-astro ^0.14`.
  - Warning de dépréciation `valid-compile`.
- **Non retenu (FR-013)** : l'option `tailwindStylesheet` de prettier-plugin-tailwindcss. Utile, mais elle change le tri des classes : à traiter dans une évolution séparée.

## R5 — Service d'images : conserver `compile`

- **Constat** :
  - Le défaut de l'adaptateur 13+ passe de `compile` à `cloudflare-binding` (PR #15435) : les images seraient transformées à l'exécution par Cloudflare Images (binding `IMAGES` auto-provisionné). La facturation et les quotas n'ont pas été vérifiés.
  - Aujourd'hui, toutes les pages sont rendues à la demande et `compile` équivaut à `passthrough` à l'exécution. Les `.webp` sources sont servis tels quels.
- **Decision** : `cloudflare({ imageService: 'compile' })`. Le comportement et le poids restent identiques (FR-004, SC-003), sans nouvelle ressource Cloudflare ni coût.
- **Alternatives** :
  - `cloudflare-binding` : de vraies variantes redimensionnées, mais un changement de rendu, un coût potentiel et une nouvelle dépendance à un service. C'est une évolution à part entière. Rejeté ici.
  - Prérendre les pages : cela activerait l'optimisation au build, mais c'est un changement d'architecture. Hors périmètre (FR-013).
- **Changements v6 à surveiller malgré tout** : recadrage par défaut si `width` et `height` sont tous deux fournis (13 occurrences), pas d'agrandissement des images. Avec `compile` à l'exécution, on attend peu d'effet, à confirmer au diff visuel.

## R6 — Espaces blancs : `compressHTML: true`

- **Constat** : Astro 7 change le défaut de `compressHTML` en `'jsx'` (PR #16965), qui supprime les espaces contenant un retour ligne entre du texte et un élément inline. Cas vérifié : `la-carte-postale-faq-section.astro:33-34`, où « programmation sur⏎`<a>`Instagram » s'afficherait « programmation surInstagram ». Le motif revient environ 125 fois (sections FAQ de plusieurs lieux).
- **Decision** : `compressHTML: true` dans `astro.config.mjs`. C'est le comportement de la v5, en une ligne, sans toucher au contenu.
- **Alternatives** : insérer `{" "}` à chaque occurrence. Diff massif et risque d'oubli. Rejeté.

## R7 — Compilateur Rust (Astro 7)

- **Constat** : le compilateur Rust devient l'unique compilateur (PR #16462). Deux effets possibles :
  - Les balises non-void non fermées deviennent des erreurs.
  - Les imbrications invalides (`<div>` dans `<p>`) ne sont plus corrigées, ce qui peut modifier le DOM rendu.
- **Decision** : corriger au cas par cas ce que `astro build` signale. Le diff HTML et visuel du palier B détecte les changements silencieux.

## R8 — Sessions : `session: false`

- **Constat** : l'adaptateur 14 configure par défaut un binding KV `SESSION`, auto-provisionné au déploiement (déduit du code de l'adaptateur, pas de la doc). Le site n'utilise pas de sessions.
- **Decision** : `session: false` dans la config de l'adaptateur. Aucune ressource inutile n'est créée, et le runtime de session est éliminé du bundle (14.2.0, PR #16871). C'est conforme au principe II.

## R9 — Autres points

- **Ordre des scripts et styles** : ils sont désormais rendus dans l'ordre source (v6). Seul `main.astro` est concerné (JSON-LD `is:inline`, script Plausible, stub de file d'attente). Il faut vérifier que les événements Plausible partent toujours.
- **`import.meta.env`** : désormais toujours inliné. Seul `PROD` est utilisé : sans impact.
- **`getImage()`** : il lève une erreur côté client, mais n'est appelé que côté serveur (`main.astro`) : sans impact.
- **Tailwind 4.1 → 4.3** : pas de renommage cassant utilisé par le projet. Les changements de sérialisation (`m-0` → `0`, piles de polices système) n'ont pas d'effet visuel, puisque `--font-sans` est surchargé.
- **Environnement** :
  - `engines.node` passe à `^22.22.3 || ^24.16.0 || >=26.3.0`, l'intersection des exigences d'Astro 7 (≥ 22.12) et d'eslint-plugin-astro 3.
  - La CI est en Node 24 (dernière 24.x) : OK. Le poste local est en 24.16.0 : OK de justesse.
- **Non applicables** (vérifiés par grep) : content collections, `Astro.glob`, View Transitions, Markdown, `Astro.locals.runtime`, i18n, endpoints, actions, `src/fetch.ts`, `@astrojs/db`.
- **Documentation à mettre à jour** :
  - constitution : principe V « Astro 5 » ; contraintes « pnpm ≥ 9, Node ≥ 21 », obsolètes depuis pnpm 12 ;
  - `.cursor/rules/context.mdc` : Astro 5, engines, et « Cloudflare (Pages/Workers) ».
