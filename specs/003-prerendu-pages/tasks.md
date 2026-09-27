---
description: "Tâches du prérendu des pages (résorption des dérogations D1–D3)"
---

# Tasks: Prérendu des pages

**Input**: Design documents from `specs/003-prerendu-pages/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/public-surface.md](./contracts/public-surface.md), [quickstart.md](./quickstart.md)

**Tests**: pas de tests automatisés demandés. La validation passe par les procédures du [quickstart](./quickstart.md) : contrôles de `dist/`, statuts et en-têtes, captures, poids et Lighthouse.

**Organization** : les paliers du plan sont répartis ainsi :
- palier 1 (config de prérendu) → phase fondatrice ;
- correctif `getPagePath` et 404 → US2 ;
- images → US1 ;
- palier 2 (SEO) → US3 ;
- paliers 3 à 5 (documentation, preview, production) → phase finale.

US2 passe avant US1 : c'est elle qui corrige la régression de canonique et de lien actif créée par la phase fondatrice (R3).

Tout est livré dans **une seule PR**. On fait un commit par phase qui touche le code, avec l'agent `git-commit` (Conventional Commits en français).

## Format: `[ID] [P?] [Story] Description`

- **[P]** : parallélisable (fichiers différents, pas de dépendance sur une tâche non terminée)
- **[Story]** : US1, US2, US3 (cf. spec.md)
- 🧑 : **checkpoint humain**. L'agent s'arrête et attend le mainteneur.

## Conventions

- Branche : `003-prerendu-pages`. Dossier de travail non versionné : `tmp/prerendu/`.
- Les 8 routes du contrat : `/`, `/a-la-carte-postale`, `/contact`, `/le-bar-ile`, `/le-labo-diva`, `/le-wattignies`, `/les-landes-fertiles`, `/nexiste-pas` (404).
- Les références R1 à R12 renvoient à [research.md](./research.md).
- Référence de production : `tmp/astro-upgrade/current/prod/` (HTML, en-têtes, `pshots/`).
- **Interdit** :
  - appeler `/mix/load/event` ;
  - modifier le Worker ou la route du proxy `/mix/*`.

---

## Phase 1: Setup (référence et outillage)

**Purpose** : créer la branche, puis dater la référence et outiller la mesure du poids. Aucun fichier versionné n'est modifié à ce stade.

- [X] T001 Créer la branche depuis `main` à jour : `git switch main && git pull && git switch -c 003-prerendu-pages`. Vérifier que `specs/003-prerendu-pages/` suit bien la branche : ce dossier n'est pas encore versionné, il est committé en T016.
- [X] T002 Créer `tmp/prerendu/{ref,local,preview,prod}/`. Rejouer la référence de production, datée du jour : `tmp/astro-upgrade/snapshot.sh https://communile.fr tmp/prerendu/ref`. Vérifier que `status.txt` donne 7 routes en 200, `/nexiste-pas` en 404 et `/contact/` en `200 ->`.
- [X] T003 [P] Écrire `tmp/prerendu/weight.mjs` (non versionné, puppeteer-core et Chrome système, à lancer depuis le dossier temporaire où `puppeteer-core` est installé, comme `shots.mjs`).
  - Usage : `node weight.mjs <base_url> <out.json>`.
  - Pour chacune des 8 routes, à 390 px (`isMobile`, `deviceScaleFactor: 1`) puis à 1440 px :
    - charger la page, forcer `loading="eager"` et faire défiler comme `tmp/astro-upgrade/shots.mjs` ;
    - sommer `encodedDataLength` (événement CDP `Network.loadingFinished`) pour toutes les réponses, puis pour les seules réponses `image/*`.
  - Bloquer `instagram.com`, `cdninstagram.com` et `/mix/load/` avec la même regex `BLOCK` que `shots.mjs`.
  - Écrire `{ route, width, totalBytes, imageBytes }[]` dans `out.json`, et afficher un tableau.
- [X] T004 [P] Copier `tmp/astro-upgrade/lh-multi.sh` en `tmp/prerendu/lh-multi.sh` et l'adapter :
  - les 7 routes 200 ;
  - `--only-categories=performance,accessibility,seo` ;
  - le résumé affiche la médiane de performance et les scores d'accessibilité et de SEO, par hôte et par page.
- [X] T005 Mesurer la référence : `node weight.mjs https://communile.fr tmp/prerendu/ref/weight.json`. Noter dans `tmp/prerendu/notes.md` le `imageBytes` de `/` à 390 px : c'est la base de SC-003.

**Checkpoint** : la branche existe, `tmp/prerendu/ref/` contient les statuts, les en-têtes et le poids, et les deux scripts s'exécutent.

---

## Phase 2: Foundational (config de prérendu, bloquante)

**Purpose** : faire passer le build en prérendu, sans code applicatif (R1, R2, R4, R5, R6, R10). Sans US2, cette phase introduit une régression connue : canonique en `.html` et lien actif perdu. **Ne pas committer avant la fin de US2.**

- [X] T006 Ajouter `sharp` en dernière version stable, en dépendance directe (skill `js-deps-latest`) : `pnpm add sharp@latest`. On attend la 0.35.4 ou plus récente. `pnpm-workspace.yaml` l'autorise déjà (`allowBuilds`) : ne pas y toucher (R5).
- [X] T007 Modifier `astro.config.mjs` :
  - ajouter `site: 'https://communile.fr'`, avec un commentaire `// = SITE_URL (src/utils/constants.ts)` ;
  - remplacer `output: 'server'` par `output: 'static'`, avec un commentaire : toutes les pages sont prérendues, et une page dynamique déclarera `export const prerender = false` ;
  - ajouter `build: { format: 'file' }`, avec un commentaire : `/contact.html` sert l'URL canonique `/contact`, qui reste sans slash final ;
  - conserver `compressHTML`, `session: false` et `adapter: cloudflare({ imageService: 'compile' })`.
- [X] T008 Modifier `wrangler.jsonc` :
  - ajouter `"assets": { "not_found_handling": "404-page" }` avant `observability` ;
  - réécrire le commentaire d'en-tête : l'adaptateur fusionne `assets` et génère une config assets-only (sans `main`) tant qu'aucune page n'est dynamique ;
  - garder `compatibility_flags` et `observability` (R6, R10).
- [X] T009 `pnpm build`. Attendu :
  - 0 erreur `astro check` ;
  - `8 page(s) built` ;
  - variantes d'images générées ;
  - dans `dist/client/`, 8 fichiers `.html` ;
  - `grep -c '/_image?' dist/client/*.html` vaut 0 partout ;
  - `dist/client/wrangler.json` ne contient aucun `"main"` et contient `"not_found_handling":"404-page"`.

  Un `TimeoutError` sur `Request.cf` est bénin (R9). Si le build échoue avec `MissingSharp`, revoir T006.

**Checkpoint** : le build prérend les 8 pages, avec une config assets-only.

---

## Phase 3: User Story 2 - Les pages sont servies sans calcul à la demande (Priority: P1) 🎯 MVP

**Goal** : 8 pages générées, servies sans exécution de code. 404 avec un vrai statut 404, redirection du slash final, métadonnées et navigation identiques à la production (FR-001 à FR-004, FR-007 à FR-009).

**Independent Test** : [quickstart §1 et §2](./quickstart.md). Statuts identiques à `tmp/prerendu/ref`, sauf `/contact/` qui répond `307 -> /contact`. Canoniques et `aria-current` identiques à la référence.

- [X] T010 [US2] Créer `src/utils/url.ts` avec `export function getPagePath(url: URL)`. La fonction renvoie `url.pathname.replace(/(\/index)?\.html$/, '') || '/'`. Ajouter un commentaire d'une ligne : avec `build.format: 'file'`, `Astro.url.pathname` vaut `/contact.html` (ou `/index.html`) au prérendu (R3).
- [X] T011 [P] [US2] Dans `src/layouts/main.astro` :
  - importer `getPagePath` depuis `../utils/url` ;
  - `canonicalURL = new URL(getPagePath(Astro.url), SITE_URL)` ;
  - pour l'image OG explicite, résoudre `optimizedImage.src` sur `SITE_URL` au lieu de `Astro.url` (R4).
- [X] T012 [P] [US2] Dans `src/components/header.astro` :
  - importer `getPagePath` depuis `@/utils/url` ;
  - remplacer `new URL(Astro.request.url).pathname` par `getPagePath(Astro.url)` (R3).
- [X] T013 [US2] `pnpm build && pnpm lint`. Contrôles, en comparant `dist/client/*.html` à `tmp/astro-upgrade/current/prod/html/*.html` (`nexiste-pas.html` ↔ `404.html`) :
  - `grep -ho '<link rel="canonical"[^>]*>'` et `og:url` : mêmes valeurs, jamais `.html` ;
  - `grep -o 'aria-current="page"' | wc -l` : même nombre par page (2 sur `/` et les pages lieux, 0 sur `/contact` et la 404) ;
  - `title`, `description`, `og:title`, `og:description`, JSON-LD : identiques.
- [X] T014 [US2] Prévisualisation locale : `pnpm preview` (ou `npx wrangler dev`), puis `tmp/astro-upgrade/snapshot.sh <local_url> tmp/prerendu/local`, puis `pnpm astro preview stop`. Attendu dans `status.txt` : 7 routes en 200, `/nexiste-pas` en 404 avec le titre « Page non trouvée », `/contact/` en `307 -> /contact`. Vérifier à la main que `/index.html` et `/contact.html` répondent 307 vers `/` et `/contact`. Dans `headers/`, `Access-Control-Allow-Origin: *` est présent et `/_astro/*` a `Cache-Control: … immutable` (FR-009).
- [X] T015 [US2] `pnpm dev` : l'accueil et `/le-wattignies` s'affichent, et le lien actif est surligné en dev. `getPagePath` ne doit rien changer sans `.html`.
- [X] T016 [US2] Commit (agent `git-commit`) de `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, `wrangler.jsonc`, `src/utils/url.ts`, `src/layouts/main.astro`, `src/components/header.astro` et `specs/003-prerendu-pages/`. Exemple de message : `feat(build): prérendre toutes les pages et servir des fichiers statiques`.

**Checkpoint** : SC-002 est vérifiable localement, sans régression de métadonnées ni de navigation.

---

## Phase 4: User Story 1 - Le visiteur mobile reçoit des pages plus légères (Priority: P1)

**Goal** : chaque image est servie à la largeur déclarée, et non plus en fichier source (FR-005, FR-006). Pas de changement de rendu.

**Independent Test** : `imageBytes` de `weight.mjs` sur la prévisualisation locale, comparé à `tmp/prerendu/ref/weight.json` (SC-003). Captures à 390 et 1440 px identiques à la référence (SC-001). SC-004 se mesure sur la preview (T033).

- [ ] T017 [US1] Comparer les images de `dist/client/*.html` à la référence `tmp/astro-upgrade/current/prod/html/` : même nombre de `<img>` par page, mêmes `alt`, mêmes `width` et `height`, mêmes `sizes`, et mêmes descripteurs `w` dans chaque `srcset`. Seules les URL changent. Un écart indique un changement non voulu : le corriger avant de continuer.
- [ ] T018 [US1] Pendant que la prévisualisation locale tourne : `node weight.mjs <local_url> tmp/prerendu/local/weight.json`. Attendu :
  - `imageBytes` de `/` à 390 px au moins 50 % plus bas que dans la référence (T005), ce qui vérifie SC-003. Les images ne sont pas recompressées : la comparaison entre local et production est donc valable.
  - Relever `totalBytes`, sans le comparer. En local, HTML, CSS et JS ne passent pas par la même compression qu'en production. SC-004 se mesure sur la preview, en T033.

  Noter les chiffres dans `tmp/prerendu/notes.md`.
- [ ] T019 [US1] Captures locales : `node shots.mjs tmp/prerendu/local/pshots <local_url>` (depuis le dossier puppeteer). Comparer aux captures de `tmp/astro-upgrade/current/prod/pshots/` avec le même outil de diff pixel qu'en 002 (voir `tmp/astro-upgrade/palier-notes.md`, *Visuel palier B*). Écarts tolérés : antialiasing des badges animés et des tuiles de carte. Noter les pourcentages dans `notes.md`.
- [ ] T020 [US1] `node tmp/astro-upgrade/map.mjs <local_url>/le-wattignies` (depuis le dossier puppeteer) : tuiles chargées, marqueur présent, 0 erreur JS. Ouvrir aussi le menu mobile et la FAQ (FR-008).

**Checkpoint** : SC-001 et SC-003 sont vérifiés localement. Pas de commit : aucune modification de code dans cette phase.

---

## Phase 5: User Story 3 - Les moteurs de recherche découvrent toutes les pages (Priority: P2)

**Goal** : sitemap publié et annoncé. Images de partage, logo par défaut et images du JSON-LD servis en 200 (FR-015, FR-016).

**Independent Test** : `dist/client/sitemap-0.xml` contient les 7 URL canoniques. `robots.txt` contient `Sitemap:`. Toute URL absolue d'image du HTML (`og:image`, `twitter:image`, JSON-LD `logo` et `image`) pointe vers un fichier présent dans `dist/client/` (SC-008).

- [ ] T021 [P] [US3] Dans `astro.config.mjs`, importer `sitemap` depuis `@astrojs/sitemap`. Ajouter `integrations: [sitemap({ filter: page => !page.includes('/404') })]`, le filtre validé par le prototype. La 404 doit être exclue du résultat (R7).
- [ ] T022 [P] [US3] Créer `public/robots.txt` avec, dans l'ordre : `User-agent: *`, `Allow: /`, une ligne vide, puis `Sitemap: https://communile.fr/sitemap-index.xml` (R7).
- [ ] T023 [P] [US3] Créer `src/utils/image.ts`, qui exporte `async function getLogoUrl()`. La fonction importe `getImage` depuis `astro:assets`, `logo` depuis `@/images/communile-logo.webp` et `SITE_URL` depuis `./constants`, puis renvoie `new URL((await getImage({ src: logo })).src, SITE_URL).href`. Ajouter un commentaire d'une ligne : l'URL absolue du logo est réellement émise dans `/_astro/` au build, alors que l'ancien `/communile-logo.webp` répondait 404 (R8).

  Dans `src/layouts/main.astro` :
  - `const logoUrl = await getLogoUrl()` ;
  - l'utiliser comme valeur par défaut de `ogImageUrl` et pour `'logo'` dans le JSON-LD `Organization` par défaut, à la place des deux occurrences de `${SITE_URL}/communile-logo.webp` ;
  - ajouter `<link rel="sitemap" href="/sitemap-index.xml" />` après la canonique (R7).
- [ ] T024 [P] [US3] Dans `src/pages/a-la-carte-postale.astro`, `src/pages/le-bar-ile.astro`, `src/pages/les-landes-fertiles.astro`, `src/pages/le-wattignies.astro` et `src/pages/le-labo-diva.astro` :
  - importer `getLogoUrl` depuis `../utils/image`, à côté de l'import existant de `../utils/constants` ;
  - ajouter `const logoUrl = await getLogoUrl()` dans le frontmatter, avant l'objet JSON-LD ;
  - remplacer `'image': \`${SITE_URL}/communile-logo.webp\`` par `'image': logoUrl` dans le JSON-LD ;
  - garder l'import de `SITE_URL`, qui sert encore pour `'url'` (R8).
- [ ] T025 [US3] `pnpm build && pnpm lint`. Attendu :
  - `grep -o '<loc>[^<]*' dist/client/sitemap-0.xml` donne 7 URL (`/` et les 6 pages), sans slash final ni `/404` ;
  - `dist/client/robots.txt` est présent ;
  - `og:image` de `contact.html` et de `404.html`, `logo` du JSON-LD par défaut et `image` du JSON-LD des 5 pages lieux pointent vers `https://communile.fr/_astro/communile-logo.<hash>.webp` ;
  - `grep -c 'communile.fr/communile-logo.webp' dist/client/*.html` vaut 0 partout ;
  - toute URL absolue d'image existe dans `dist/` : `grep -hoE 'https://communile\.fr/[^"]+\.(webp|png|jpg)' dist/client/*.html | sort -u | sed 's#https://communile.fr#dist/client#' | xargs ls` ne renvoie aucune erreur.
- [ ] T026 [US3] Prévisualisation locale : `/sitemap-index.xml`, `/sitemap-0.xml` et `/robots.txt` répondent 200, et l'URL du logo répond 200.
- [ ] T027 [US3] Commit (agent `git-commit`) de `astro.config.mjs`, `public/robots.txt`, `src/utils/image.ts`, `src/layouts/main.astro` et des 5 pages de T024. Exemple de message : `feat(seo): publier le sitemap et corriger les URL du logo`.

**Checkpoint** : les trois user stories sont vérifiées localement.

---

## Phase 6: Polish, preview et mise en production

**Purpose** : documentation (palier 3), validation sur `*.workers.dev` (palier 4), puis production (palier 5).

- [ ] T028 [P] Dans `specs/002-astro-upgrade/plan.md`, section *Complexity Tracking → Dérogations* : remplacer la colonne « Suivi » de D1, D2 et D3 par `Résorbée → [spec 003](../003-prerendu-pages/spec.md)`. Ne rien toucher d'autre (FR-013).
- [ ] T029 [P] Dans `.cursor/rules/context.mdc`, lignes 13 et 27, remplacer « with server output » et « (server output) » par une mention du prérendu (`output: 'static'`, pages prérendues, Worker assets-only). Ne pas corriger les autres informations périmées du fichier (mention de Biome), qui sont hors périmètre.
- [ ] T030 `pnpm build && pnpm lint`, puis commit (agent `git-commit`) de T028 et T029. Exemple de message : `docs: marquer les dérogations D1–D3 résorbées par le prérendu`. Puis `git push -u origin 003-prerendu-pages`.
- [ ] T031 Ouvrir la PR vers `main` (`gh pr create`). La description reprend :
  - le résumé du plan ;
  - le changement accepté sur `/contact/` (307) ;
  - les chiffres de `notes.md` (poids, captures) ;
  - la section *Rebase de l'epic `001-page-brasserie`* du plan : l'epic sera rebasée **après** le merge, en gardant le `robots.txt` de la 003.
- [ ] T032 🧑 Checkpoint humain, dans le dashboard du Worker `communile-fr` :
  - Settings → Builds : le mainteneur vérifie que les builds des branches hors production sont activés. La commande par défaut est `npx wrangler versions upload` ;
  - il récupère l'URL de preview de la branche, au format `<version>-communile-fr.sylvain-denyse.workers.dev`, dans le commentaire de PR ou dans Deployments ;
  - si ces builds sont désactivés, il lance lui-même `npx wrangler versions upload` en local, authentifié.

  **Ne jamais changer la branche de production.** L'agent attend l'URL.
- [ ] T033 Quickstart §3 sur `<preview_url>` :
  - `snapshot.sh` → `tmp/prerendu/preview` ;
  - `curl -sI <preview_url>/contact | grep -i x-robots-tag` renvoie `noindex` ;
  - `weight.mjs` → `tmp/prerendu/preview/weight.json`. Attendus :
    - `imageBytes` de `/` à 390 px à −50 % ou moins (SC-003) ;
    - **SC-004** : `totalBytes` de chaque page, à 390 et à 1440 px, inférieur ou égal à `tmp/prerendu/ref/weight.json`, puisque la preview passe par la compression de Cloudflare. Si une page dépasse, identifier la ressource en cause avant de continuer ;
  - `shots.mjs` → `tmp/prerendu/preview/pshots`, avec les mêmes attendus que T019 ;
  - `map.mjs` ;
  - les images citées par les URL absolues (`og:image`, `twitter:image`, JSON-LD `logo` et `image`) répondent 200 **sur la preview**. Ces URL pointent vers `communile.fr`, qui ne sert pas encore ces fichiers : on vérifie donc leur chemin sur `<preview_url>`. Par exemple : `for p in $(grep -hoE 'https://communile\.fr/[^"]+\.(webp|png|jpg)' tmp/prerendu/preview/html/*.html | sed 's#https://communile.fr##' | sort -u); do curl -s -o /dev/null -w "%{http_code} $p\n" "<preview_url>$p"; done`.
- [ ] T034 Lighthouse (SC-005) : `tmp/prerendu/lh-multi.sh 3 tmp/prerendu/lh https://communile.fr <preview_url>`. Attendu :
  - médiane de performance à −2 points au plus par page ;
  - accessibilité et SEO sans baisse.

  Ces mesures sont bruitées en 3G : si l'écart dépasse le seuil, relancer une série alternée avant de conclure. Consigner le résultat dans `notes.md` et en commentaire de PR.
- [ ] T035 🧑 Checkpoint humain : le mainteneur relit la PR et les chiffres, puis merge sur `main`. Workers Builds déploie `main`.
- [ ] T036 Quickstart §4 sur la production :
  - `snapshot.sh https://communile.fr tmp/prerendu/prod` : mêmes statuts qu'en T014 ;
  - `curl -s -o /dev/null -w '%{http_code}' https://communile.fr/mix/load/script.js` renvoie 200, **sans aucun appel à `/mix/load/event`** ;
  - `curl -s https://communile.fr/robots.txt | grep -i '^sitemap:'` affiche la ligne : la fusion avec le *managed robots.txt* de Cloudflare la conserve ;
  - `/sitemap-index.xml` répond 200 ;
  - chaque URL absolue d'image de `tmp/prerendu/prod/html/*.html` répond 200 (`og:image`, `twitter:image`, JSON-LD `logo` et `image`) : `for u in $(grep -hoE 'https://communile\.fr/[^"]+\.(webp|png|jpg)' tmp/prerendu/prod/html/*.html | sort -u); do curl -s -o /dev/null -w "%{http_code} $u\n" "$u"; done` ;
  - pas de `X-Robots-Tag` sur `https://communile.fr/contact`.

  Si la ligne `Sitemap:` manque, le signaler au mainteneur (réglage *managed robots.txt* de la zone), sans rien modifier dans Cloudflare.
- [ ] T037 🧑 Checkpoint humain : dans le dashboard du Worker `communile-fr` (Metrics), le mainteneur confirme que les requêtes de pages ne génèrent plus d'invocations (SC-002). Le réglage Runtime « Cache » reste sur Disabled (R10).
- [ ] T038 Proposer au mainteneur d'ouvrir une issue de suivi « Revoir les `widths` et `sizes` des images » (R5 : `wattignies-marches-de-saison` pèse encore 924 Ko en pleine largeur). Ne l'ouvrir qu'après son accord. Cocher ensuite les tâches de ce fichier et committer `specs/003-prerendu-pages/tasks.md` (agent `git-commit`), par exemple `docs(specs): cocher la mise en production du prérendu`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001–T005)** : aucune dépendance. T003 et T004 peuvent se faire en parallèle. T005 dépend de T003.
- **Foundational (T006–T009)** : dépend de T001. Bloque toutes les user stories.
- **US2 (T010–T016)** : dépend de la phase fondatrice. Doit précéder tout commit, car elle corrige la régression R3.
- **US1 (T017–T020)** : dépend de T014 (prévisualisation locale) et de T005 (référence de poids). Aucune modification de code.
- **US3 (T021–T027)** : dépend de la phase fondatrice (`site`). Elle est indépendante de US1. Elle touche `main.astro` après T011 : l'enchaîner après T016 pour éviter les conflits.
- **Polish (T028–T038)** : T028 et T029 peuvent commencer après T016. T031 et la suite exigent que US1, US2 et US3 soient terminées. T032, T035 et T037 bloquent la suite.

### Within Each User Story

- US2 : T010 → (T011 ∥ T012) → T013 → T014 → T015 → T016.
- US1 : T017 → T018 → T019 → T020. T018 à T020 réutilisent la même prévisualisation locale.
- US3 : T021 ∥ T022 ∥ T023, puis T024 (dépend de T023), puis T025 → T026 → T027.

### Parallel Opportunities

- T003 ∥ T004 (deux scripts distincts, hors dépôt).
- T011 ∥ T012 (deux fichiers distincts, qui dépendent seulement de T010).
- T021 ∥ T022 ∥ T023 (`astro.config.mjs`, `public/robots.txt`, `src/utils/image.ts` et `main.astro`).
- T024 ∥ T022 (les 5 pages et `public/robots.txt`).
- T028 ∥ T029 (deux fichiers de documentation).

---

## Parallel Example: User Story 2

```text
Après T010 (src/utils/url.ts) :
  T011 [US2] src/layouts/main.astro → canonique via getPagePath, OG explicite sur SITE_URL
  T012 [US2] src/components/header.astro → pathname via getPagePath(Astro.url)
```

## Parallel Example: User Story 3

```text
  T021 [US3] astro.config.mjs → integrations: [sitemap({ filter })]
  T022 [US3] public/robots.txt → User-agent, Allow, Sitemap
  T023 [US3] src/utils/image.ts + main.astro → getLogoUrl, link rel=sitemap
Puis :
  T024 [US3] 5 pages lieux → 'image': await getLogoUrl()
```

---

## Implementation Strategy

### MVP First (US2)

1. Setup, puis Foundational : le build prérend.
2. US2 : correctif `getPagePath`, 404 et redirections. **STOP** : la parité des métadonnées et de la navigation est vérifiée localement, puis on committe.
3. À ce stade, D1 est résorbée. US1 n'est qu'une vérification, puisque l'optimisation des images est un effet direct de la phase fondatrice.

### Incremental Delivery

1. Commit 1 (T016) : prérendu, avec US2 et, de fait, US1.
2. Vérification US1 (T017 à T020), sans commit.
3. Commit 2 (T027) : SEO (US3).
4. Commit 3 (T030) : documentation, puis PR, preview 🧑, merge 🧑, production.
5. Après le merge : le mainteneur rebase l'epic `001-page-brasserie` sur `main` (hors de ce fichier de tâches).

---

## Notes

- Les checkpoints humains 🧑 (T032, T035, T037) s'effectuent dans le dashboard Cloudflare ou sur GitHub.
- Pour revenir en arrière : revert du merge sur `main`. Le redéploiement automatique rétablit le rendu à la demande.
- Mesures en 3G : on privilégie le poids transféré et le diff pixel, qui sont déterministes. Pour Lighthouse, on alterne les séries et on compare les médianes.
