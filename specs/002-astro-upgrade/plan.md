# Implementation Plan: Mise à jour d'Astro et de son écosystème

**Branch**: `002-astro-upgrade` | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-astro-upgrade/spec.md`

## Summary

On monte Astro 5.16 → 7.3.5, l'adaptateur Cloudflare 12 → 14.3.3, Tailwind 4.1 → 4.3.3 et TypeScript 5.9 → 6.0.3 : TS 7 est bloqué, faute d'API JS pour `astro check`. Le rendu visiteur doit rester identique.

Trois changements sont imposés par la montée :
- migration **Cloudflare Pages → Workers** : l'adaptateur ≥ 13 ne supporte plus Pages ;
- montée **ESLint 10 + antfu 9** : exigée par eslint-plugin-astro 3 ;
- réglages de parité : `compressHTML: true`, `imageService: 'compile'`, `session: false`. Ils neutralisent les nouveaux défauts qui changeraient le rendu, les images ou les ressources.

La montée se fait en paliers vérifiables : Astro 6 et Workers d'abord, puis Astro 7, TypeScript, et l'outillage de lint. Le détail est dans [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.9.3 → 6.0.3 ; Node 24 (engines relevé à `^22.22.3 || ^24.16.0 || >=26.3.0`)

**Primary Dependencies**: astro 7.3.5, @astrojs/cloudflare 14.3.3, @astrojs/check 0.9.10, @astrojs/sitemap 3.7.4, tailwindcss + @tailwindcss/vite 4.3.3, wrangler 4.141.x ; outillage : eslint 10.11, @antfu/eslint-config 9.5.1, eslint-plugin-format 2.0.1, eslint-plugin-astro 3.2.1, astro-eslint-parser 3.2.x, prettier-plugin-astro 1.1.0, prettier-plugin-tailwindcss 0.8.1

**Storage**: N/A

**Testing**: pas de suite de tests automatisés. La validation se fait par :
- `pnpm build` (inclut `astro check`) et `pnpm lint` ;
- un diff HTML des 8 routes contre une référence capturée avant la montée ;
- un diff visuel mobile et desktop, et un audit Lighthouse avant/après.

Voir [quickstart.md](./quickstart.md).

**Target Platform**: Cloudflare Workers + static assets. Aujourd'hui Cloudflare Pages.

**Project Type**: site vitrine Astro, `output: 'server'`, 8 routes rendues à la demande

**Performance Goals**: parité. Poids de page ≤ +5 % (SC-003), scores Lighthouse ≥ −2 pts (SC-004).

**Constraints**: rendu identique (FR-003), mêmes URLs et domaine (FR-008), mêmes commandes (FR-009), aucune nouvelle ressource Cloudflare payante

**Scale/Scope**: 8 routes, environ 90 composants `.astro`, 1 layout, 1 CI GitHub Actions (lint)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Statut | Justification |
|---|---|---|
| I. Contenu d'abord | ✅ | Aucun contenu modifié. `compressHTML: true` empêche l'altération des textes (R6). |
| II. Statique et simple | ⚠️ dérogation D1 | Pas de nouveau backend. `session: false` et `imageService: 'compile'` évitent les bindings KV et Images (R5, R8). **Écart préexistant reconduit** : toutes les pages sont rendues à la demande (`output: 'server'`, aucun prérendu). Voir la dérogation D1. |
| III. Performance et SEO | ⚠️ dérogations D2, D3 | La parité (poids, Lighthouse, métadonnées) est vérifiée par le quickstart avant le merge. **Écarts préexistants reconduits** : images servies sans redimensionnement (`compile` équivaut à passthrough à l'exécution), aucun sitemap branché. Voir les dérogations D2 et D3. |
| IV. Accessibilité, responsive | ✅ sous condition | DOM inchangé attendu. Le diff HTML détecte les réimbrications du compilateur Rust (R7). |
| V. Cohérence de la stack | ⚠️ amendement requis | Le texte fige « Astro 5 » et « pnpm ≥ 9, Node ≥ 21 ». Amendement **PATCH** via `/speckit-constitution` (versions de référence, sans changement de sens). La contrainte « adaptateur `@astrojs/cloudflare` » reste respectée : même adaptateur, produit Workers. Ajouts `wrangler` et `astro-eslint-parser` justifiés (R2, R4). |

**Re-check post-design** : aucune violation non justifiée. Les écarts préexistants aux principes II et III sont reconduits volontairement, avec une justification écrite (dérogations D1 à D3 dans Complexity Tracking), comme l'exige la Governance. L'amendement du principe V est une tâche du plan (FR-011).

## Project Structure

### Documentation (this feature)

```text
specs/002-astro-upgrade/
├── plan.md              # ce fichier
├── research.md          # Phase 0 — décisions R1–R9
├── data-model.md        # Phase 1 — inventaire dépendances et artefacts de config
├── quickstart.md        # Phase 1 — procédure de validation
├── contracts/
│   └── public-surface.md  # surface publique à préserver (routes, en-têtes, SEO, commandes)
├── checklists/requirements.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

Fichiers touchés, sans nouveau code applicatif :

```text
package.json              # versions, engines, devDeps wrangler + astro-eslint-parser
pnpm-lock.yaml
astro.config.mjs          # compressHTML, adapter { imageService, session }
wrangler.jsonc            # Pages → Workers (suppression pages_build_output_dir, env.*)
tsconfig.json             # suppression baseUrl
eslint.config.ts          # ajustements éventuels antfu 9 / ESLint 10
public/_headers           # règle noindex preview pages.dev → workers.dev
src/**/*.astro            # uniquement : corrections compilateur Rust + churn lint/format
.specify/memory/constitution.md   # amendement PATCH
.cursor/rules/context.mdc         # versions de référence
```

**Structure Decision** : projet unique existant, pas de nouveau répertoire.

## Paliers d'implémentation

Chaque palier se termine par build + lint verts et un passage du [quickstart](./quickstart.md). Les numéros R renvoient à [research.md](./research.md).

0. **Référence** : capturer HTML, en-têtes, captures d'écran et Lighthouse des 8 routes sur la production actuelle.
1. **Palier A : Astro 6 + Workers**
   - Contenu : astro 6.4.x, @astrojs/cloudflare 13.7.x, wrangler en devDep, `wrangler.jsonc` migré, `imageService: 'compile'`, engines Node, `compatibility_date`, règle `_headers` des previews (R2, R5).
   - **Checkpoint humain** : création du Worker via Workers Builds, validation sur `*.workers.dev`, localisation du proxy Plausible `/mix/load/*`.
2. **Palier B : Astro 7**
   - Contenu : astro 7.3.5, adaptateur 14.3.3, `session: false`, `compressHTML: true`, tailwindcss et @tailwindcss/vite 4.3.3, @astrojs/check et sitemap à la dernière version, corrections du compilateur Rust (R6–R8).
   - Diff HTML et visuel complet.
3. **Palier C : TypeScript 6**
   - Contenu : typescript 6.0.3, suppression de `baseUrl`, `astro check` vert (R3).
4. **Palier D : outillage de lint et formatage**
   - Contenu : eslint 10, antfu 9.5.1, eslint-plugin-format 2, eslint-plugin-astro 3, astro-eslint-parser 3, prettier-plugin-astro 1, prettier-plugin-tailwindcss 0.8. Le `lint --fix` va dans un commit séparé (R4).
   - Garde-fou : diff HTML nul après le churn de formatage.
5. **Documentation** : amendement de la constitution, `.cursor/rules/context.mdc`.
6. **Mise en production (checkpoint humain)** : bascule du domaine `communile.fr` de Pages vers le Worker à faible trafic. On vérifie la production, puis on supprime le projet Pages après quelques jours d'observation.

## Complexity Tracking

### Dérogations à la constitution (écarts préexistants reconduits)

Ces écarts existent déjà sur `main`. La mise à jour ne les aggrave pas et ne les corrige pas : la corriger changerait le rendu, les images ou l'architecture, ce qui est contraire à FR-003, FR-004 et FR-013. Chacun fera l'objet d'une évolution dédiée, suivie en T048.

| ID | Principe | Écart | Pourquoi il est reconduit | Suivi |
|---|---|---|---|---|
| D1 | II. Statique par défaut | 8 routes rendues à la demande (`output: 'server'`), sans besoin démontré | Prérendre change l'architecture de déploiement et le comportement des images. Hors d'une mise à jour à parité stricte. | Évolution « prérendu des pages » |
| D2 | III. Images aux dimensions adaptées | Les `.webp` sources sont servis sans redimensionnement (ex. `communile-illu-agir.webp`, 1,3 Mo) | `compile` est validé par le mainteneur pour la parité (R5). L'alternative `cloudflare-binding` change le rendu et ajoute un coût. Le prérendu, qui permettrait l'optimisation au build, dépend de D1. | Évolution « optimisation des images » (après D1) |
| D3 | III. Présence dans le sitemap | `@astrojs/sitemap` est installé mais non branché | L'activer ajoute une URL publique (`/sitemap-index.xml`), ce qui est contraire à FR-013. | Évolution « sitemap » |

### Écarts au périmètre de la spec (FR-012)

| Écart | Raison | Alternative écartée |
|---|---|---|
| TypeScript 6.0.3 au lieu de 7.0.2 | TS 7 sans API JS : `astro check` et typescript-eslint cassent (R3) | Double install TS 6/7 : aucun gain |
| eslint, @antfu/eslint-config, eslint-plugin-format montés alors qu'ils sont exclus | Peer `eslint >= 10` d'eslint-plugin-astro 3 (R4) | eslint-plugin-astro 1.7 : parse avec l'ancien compilateur, divergent du build |
| Migration Pages → Workers | L'adaptateur ≥ 13 ne supporte plus Pages (R2) | Rester en Astro 5 : contraire à l'objectif |

## Décisions (2026-09-26)

1. **Déploiement** : aujourd'hui, Pages avec intégration Git. Le mainteneur gère le compte Cloudflare et réalise les checkpoints A et 6.
2. **Proxy Plausible `/mix/load/*`** : c'est un Worker Cloudflare distinct, hors dépôt. Un Worker branché sur un Custom Domain est traité comme une origine, et les routes Workers de la zone s'exécutent avant lui ([doc](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)). Le proxy continue donc de fonctionner après la bascule, **à condition** qu'il soit déclaré en *route* (`communile.fr/mix/load/*`) et non en Custom Domain. C'est à vérifier au checkpoint A (R2).
3. **Service d'images** : `compile` confirmé (R5).
4. **Livraison** : **une seule PR**, avec un commit (ou groupe de commits) par palier, pour garder la traçabilité des régressions (R1). Checkpoint A : le Worker est créé avec `002-astro-upgrade` comme branche de production **temporaire**. Il est servi uniquement sur `*.workers.dev`, pendant que Pages sert toujours le domaine. Checkpoint 6, **après le merge** :
- la branche de production du Worker repasse à `main` ;
- on vérifie sur `*.workers.dev`, puis on bascule le domaine.

Après le merge, le build Pages de `main` échoue, faute de config Pages. Pages continue alors de servir son dernier déploiement réussi, sans coupure.
