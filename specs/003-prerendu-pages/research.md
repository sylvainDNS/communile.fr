# Research : Prérendu des pages

Date : 2026-09-27. Toutes les décisions ci-dessous ont été validées par un prototype : un worktree jetable depuis `d0b40fc`, avec build, `wrangler dev`, `astro preview` et lint. Le diff du prototype est résumé en fin de document.

## R1 : Mode de sortie : adaptateur conservé, `output: 'static'`

- **Décision** : `output: 'static'` avec l'adaptateur `@astrojs/cloudflare` (14.3.3) conservé. On n'ajoute aucun `export const prerender` page par page.
- **Rationale** :
  - C'est le choix du mainteneur (clarification Q1 → B, FR-012).
  - `output: 'static'` prérend toutes les pages par défaut. Une future page dynamique n'aura qu'à déclarer `export const prerender = false`.
  - Constat du prototype : quand aucune route n'est dynamique, l'adaptateur génère une config Wrangler **assets-only**. `dist/client/wrangler.json` ne contient pas de `main`, et `assets.directory` vaut `"."`. Le dossier `dist/server/` est vide.
  - En production, aucune requête n'invoque donc de code : on atteint FR-001 et SC-002 sans dépendre de `run_worker_first`.
- **Alternatives écartées** :
  - Statique pur, sans adaptateur (rejeté en Q1).
  - `output: 'server'` avec `export const prerender = true` sur chacune des 8 pages : répétitif, et une nouvelle page (La Sibra) serait rendue à la demande si on oublie la ligne.

## R2 : Format des fichiers générés : `build.format: 'file'`

- **Décision** : `build: { format: 'file' }`. Le build produit `contact.html`, `index.html`, `404.html`, etc. dans `dist/client/`.
- **Rationale** :
  - Avec le réglage `html_handling` par défaut des static assets (`auto-trailing-slash`), `/contact` répond 200.
  - `/contact/`, `/contact.html` et `/index.html` répondent 307 vers l'URL canonique sans slash. Vérifié en `wrangler dev` et en `astro preview`.
  - Les URL servies correspondent ainsi aux URL canoniques déclarées (`PATH` dans `src/utils/constants.ts`).
- **Alternatives écartées** :
  - `format: 'directory'` (défaut) : produit `contact/index.html`. Workers redirigerait alors `/contact` vers `/contact/`, ce qui change toutes les URL publiques.
  - `html_handling: 'drop-trailing-slash'` : même résultat que `auto-trailing-slash` avec des fichiers `.html`, mais au prix d'un réglage de plus.
- **Changement de comportement accepté** (spec, *Edge Cases*) : aujourd'hui, `/contact/` répond 200. Après le changement, il répond 307 vers `/contact`.

## R3 : Chemin de la page au prérendu (régression détectée par le prototype)

- **Constat** : avec `format: 'file'`, `Astro.url.pathname` vaut `/contact.html` au build, et `/index.html` pour l'accueil. Le comportement est le même avec `trailingSlash: 'never'` et avec `prerenderEnvironment: 'node'`, tous deux testés. Sans correctif, on a deux régressions :
  - canonique et `og:url` deviennent `https://communile.fr/contact.html` (contraire à FR-007) ;
  - le lien de navigation actif disparaît (`aria-current="page"` absent, contraire à FR-008), parce que `src/components/header.astro:13` compare `new URL(Astro.request.url).pathname` à `PATH.*`.
- **Décision** : ajouter un utilitaire `getPagePath(url: URL)` dans `src/utils/url.ts`. Il retire le suffixe `(/index)?.html` et renvoie `/` si le résultat est vide. On l'utilise :
  - dans `src/layouts/main.astro` pour `canonicalURL` ;
  - dans `src/components/header.astro` pour `pathname`, en lisant `Astro.url` au lieu de `Astro.request.url`.
- **Vérifié** : canonique `https://communile.fr/contact` et `https://communile.fr/`. `aria-current="page"` apparaît 2 fois par page lieu (desktop et mobile) et 0 fois sur `/contact`, exactement comme en production.
- **Alternatives écartées** :
  - `trailingSlash: 'never'` : sans effet sur `Astro.url` avec `format: 'file'`.
  - Normaliser dans chaque page : duplication.

## R4 : `site` et URL absolues

- **Décision** : `site: SITE_URL` (`https://communile.fr`) dans `astro.config.mjs`. L'image OG explicite sera construite avec `new URL(src, SITE_URL)` et non plus `new URL(src, Astro.url)`.
- **Rationale** :
  - `site` est requis par `@astrojs/sitemap`.
  - Il fixe `Astro.url` au domaine de production pendant le build. Sans `site`, les URL absolues pointeraient vers `localhost` (handoff, point 3).
  - Passer par `SITE_URL` rend `main.astro` cohérent (la canonique l'utilise déjà) et indépendant de `site`.
- **Détail** : `astro.config.mjs` ne peut pas importer `src/utils/constants.ts` sans risque (config en `.mjs`, alias `@/`). La valeur est donc dupliquée en littéral, avec un commentaire qui renvoie à `SITE_URL`.

## R5 : Optimisation des images au build : `sharp` en dépendance directe

- **Décision** : ajouter `sharp` 0.35.4 en `dependencies`. Il est déjà autorisé dans `pnpm-workspace.yaml` (`allowBuilds`). On garde `imageService: 'compile'`, ainsi que les largeurs, formats et `sizes` actuels.
- **Rationale** :
  - Avec des pages prérendues, `compile` optimise les images au build avec `sharp`. Sans dépendance directe, le build échoue avec `MissingSharp`, car pnpm est strict et `sharp` n'arrive qu'en transitif via l'adaptateur.
  - Prototype : 195 variantes générées en 2,5 s. Le HTML ne contient plus aucun `/_image?` : il ne reste que des `/_astro/<nom>.<hash>.webp` par largeur.
  - Exemples de gains :

    | Image | Source | Variante 330w | Variante 960w |
    |---|---|---|---|
    | `communile-illu-agir.webp` | 1 364 Ko | 37 Ko | 224 Ko |
    | `le-wattignies-card.webp` | 1 550 Ko | 15 à 93 Ko selon la largeur | |

  - SC-003 (−50 % d'images en mobile sur l'accueil) est très probablement atteint. Il sera mesuré au quickstart.
- **À noter, hors périmètre** :
  - Certaines listes `widths` incluent la largeur source. `wattignies-marches-de-saison` pèse encore 924 Ko en pleine largeur, mais cette variante n'est servie qu'aux grands écrans, selon `sizes`.
  - Revoir les `widths` et les `sizes` est exclu par la spec. À suivre dans une issue.
- **Alternatives écartées** :
  - `imageService: 'cloudflare-binding'` : coût et rendu différents, déjà écarté en 002 (R5).
  - Passer à avif : exclu par la spec.
- **Version** : dernière stable au 2026-09-27 (`pnpm view sharp version` → 0.35.4). C'est la même version que la copie transitive déjà présente dans le lockfile.

## R6 : Page 404 : `not_found_handling: "404-page"`

- **Décision** : ajouter `"assets": { "not_found_handling": "404-page" }` dans `wrangler.jsonc`.
- **Rationale** :
  - Sans `main`, rien ne produit la 404 personnalisée. Le réglage par défaut (`none`) renverrait une 404 vide.
  - Constat du prototype : l'adaptateur **fusionne** le bloc `assets` de l'utilisateur dans la config générée (`"assets":{"not_found_handling":"404-page","directory":"."}`).
  - `/nexiste-pas` répond 404 avec la page « Page non trouvée » en `wrangler dev` comme en `astro preview`. Pas de soft 404.
- **Alternative écartée** : `single-page-application`, qui renverrait `index.html` en 200.

## R7 : Sitemap et annonce aux robots

- **Décision** :
  - Brancher `@astrojs/sitemap` (3.7.4, déjà installé) dans `integrations`, avec un `filter` qui exclut la 404.
  - Créer `public/robots.txt` avec `Sitemap: https://communile.fr/sitemap-index.xml`.
  - Ajouter `<link rel="sitemap" href="/sitemap-index.xml">` dans le `<head>` de `main.astro`.
- **Rationale** :
  - Le prototype génère `sitemap-index.xml` et `sitemap-0.xml`, qui listent exactement les 7 pages indexables aux URL canoniques sans slash. `/404` en est exclu par le filtre (SC-008).
  - `robots.txt` est le canal standard d'annonce (FR-015). Il n'existe pas dans le dépôt. En production, `/robots.txt` répond pourtant 200 : c'est le *managed robots.txt* de la zone Cloudflare, qui ne contient que des commentaires (content signals) et aucune directive ni `Sitemap:`.
  - Quand l'origine fournit son propre `robots.txt`, Cloudflare le fusionne avec son contenu géré. C'est à vérifier après déploiement : la ligne `Sitemap:` doit apparaître dans la réponse finale, et les directives du dépôt ne doivent pas être écrasées.
  - Les URL de preview `*.workers.dev` gardent leur `X-Robots-Tag: noindex` via `_headers`. Le sitemap reste sur le domaine de production (`site`).
- **Conflit prévu avec l'epic `001-page-brasserie`** : il crée aussi `public/robots.txt`, mais pointe vers `/sitemap.xml`, qui **n'existe pas** avec `@astrojs/sitemap`. Au rebase de l'epic, on garde la version de cette spec. À signaler dans la PR.

## R8 : Image de partage et logo par défaut

- **Décision** : dans `main.astro`, construire l'URL du logo par défaut avec `getImage({ src: logo })`, où `logo` est `src/images/communile-logo.webp` (500 × 500), déjà importé par le header et le footer. On l'utilise pour `og:image` et `twitter:image` par défaut, et pour `logo` dans le JSON-LD `Organization`.
- **Rationale** :
  - `https://communile.fr/communile-logo.webp` répond 404 aujourd'hui : le fichier n'est pas dans `public/` (FR-016).
  - `getImage` émet `/_astro/communile-logo.<hash>.webp` au build, un fichier réellement servi.
  - On ne duplique aucun binaire dans `public/`, conformément à la convention des assets (une image n'entre dans git que si le code l'utilise ; celle-ci y est déjà).
- **Constat de `/speckit-analyze`** : le même lien cassé figure dans le champ `image` du JSON-LD de 5 pages lieux (`a-la-carte-postale`, `le-bar-ile`, `les-landes-fertiles`, `le-wattignies`, `le-labo-diva`). La décision de R8 s'applique donc aussi à ces pages : un utilitaire `getLogoUrl()` dans `src/utils/image.ts` fournit l'URL absolue du logo émis par `getImage`, à `main.astro` comme aux 5 pages. L'URL du logo n'est ainsi construite qu'à un seul endroit.
- **Vérifié** : `/contact` et la 404 déclarent `https://communile.fr/_astro/communile-logo.d7h2ogkh_stq5i.webp`. Le fichier est bien présent dans `dist/client/_astro/`.
- **Alternatives écartées** :
  - Copier le logo dans `public/` : l'URL serait stable, mais on aurait un doublon binaire. Avec `getImage`, le hash change seulement si le logo change, ce qui est acceptable pour l'OG et le JSON-LD.
  - Réaliser un visuel OG dédié en 1200 × 630 : relève du contenu, hors périmètre.

## R9 : Environnement de prérendu

- **Décision** : garder la valeur par défaut `prerenderEnvironment: 'workerd'`.
- **Rationale** :
  - C'est le même runtime que la production, sans option de config en plus.
  - Au premier build, la récupération de `Request.cf` peut échouer (`TimeoutError` en connexion lente), avec un repli automatique sur une valeur par défaut. Ce message est bénin. Il n'est apparu qu'une fois sur 5 builds et n'empêche pas le succès.
- **Alternative** : `'node'` fait passer le prérendu de 1,5 s à 0,6 s et supprime ce message. On la retient seulement si le message gêne en CI.

## R10 : Config Wrangler et cache

- **Décision** :
  - `wrangler.jsonc` : on ajoute le bloc `assets` (R6) et on met à jour le commentaire d'en-tête. `assets` est désormais fusionné, et le Worker est assets-only tant qu'aucune page n'est dynamique.
  - On garde `nodejs_compat` et `observability`. Ils sont sans effet sans `main`, mais nécessaires dès qu'une page redevient dynamique (R1). Les retirer puis les remettre ferait du churn inutile.
  - Le réglage Runtime « Cache » du Worker reste sur Disabled : il est sans objet pour des static assets.
- **Rationale** :
  - `.wrangler/deploy/config.json` redirige toujours vers `dist/client/wrangler.json`. La commande de déploiement de Workers Builds (`npx wrangler deploy`) reste la même (FR-011).
  - `public/_headers` est recopié tel quel. L'adaptateur y ajoute la règle `Cache-Control: immutable` sur `/_astro/*`, comme aujourd'hui.
  - Constaté en local : `Access-Control-Allow-Origin: *` est présent sur les pages. Les HTML sont servis en `Cache-Control: public, max-age=0, must-revalidate`, le défaut des static assets.

## R11 : Proxy Plausible `/mix/*`

- **Décision** : aucune modification. On vérifie seulement, après déploiement, que `/mix/load/script.js` répond 200, **sans jamais** appeler `/mix/load/event`.
- **Rationale** :
  - La route de zone `*communile.fr/mix/*` s'exécute avant le Worker servi en Custom Domain (002, décision 2). Un Worker assets-only reste une origine de Custom Domain, donc la route garde la priorité.
  - `import.meta.env.PROD` est inliné au build : le script Plausible reste présent dans le HTML de production.

## R12 : Validation visuelle et poids

- **Décision** : la référence est `tmp/astro-upgrade/current/prod/`, qui contient le HTML, les en-têtes et les captures puppeteer de la production actuelle.
  - On refait les captures à 390 et 1440 px avec `shots.mjs`, sur la preview `*.workers.dev`.
  - On mesure le poids transféré par page, images comprises.
  - Il n'y a pas de diff HTML strict, puisque `src` et `srcset` changent forcément. On fait en revanche une vérification ciblée : `<head>` (title, description, canonique, OG, JSON-LD), nombre d'images, `alt`, `aria-current`.
- **Rationale** : le mainteneur est souvent en 3G, et les temps mesurés sont bruités (002, *palier-notes*). Le poids et le pixel sont déterministes. Pour Lighthouse, on alterne 3 mesures avant/après et on compare les médianes (SC-005).

## Résumé du diff prototypé (6 fichiers + 1 nouveau)

- `astro.config.mjs` :
  - `site` ;
  - `output: 'static'` ;
  - `build.format: 'file'` ;
  - `integrations: [sitemap({ filter })]`.
- `package.json` et `pnpm-lock.yaml` : `sharp` ajouté.
- `wrangler.jsonc` : `assets.not_found_handling`.
- `src/utils/url.ts` (nouveau) : `getPagePath`.
- `src/layouts/main.astro` :
  - canonique via `getPagePath` ;
  - logo par défaut via `getImage` ;
  - OG via `SITE_URL`.
- `src/components/header.astro` : `pathname = getPagePath(Astro.url)`.
- Reste à ajouter (non prototypé) : `public/robots.txt` et `<link rel="sitemap">`.
