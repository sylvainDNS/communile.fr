# Data model : Prérendu des pages

Pas de données métier. Le « modèle » est l'inventaire des artefacts de configuration et des sorties de build, avec les règles de validation qui découlent de la spec.

## Artefacts de configuration

| Artefact | Avant (`main`) | Après | Règle (réf.) |
|---|---|---|---|
| `astro.config.mjs` → `output` | `'server'` | `'static'` | Toutes les pages sont prérendues par défaut (FR-001, R1) |
| `astro.config.mjs` → `build.format` | absent (`directory`) | `'file'` | URL sans slash final (FR-002, FR-003, R2) |
| `astro.config.mjs` → `site` | absent | `'https://communile.fr'` | Égal à `SITE_URL` (FR-007, R4) |
| `astro.config.mjs` → `integrations` | absent | `[sitemap({ filter: exclut /404 })]` | FR-015, R7 |
| `astro.config.mjs` → `adapter` | `cloudflare({ imageService: 'compile' })` | inchangé | FR-012, R1, R5 |
| `package.json` → `dependencies.sharp` | absent (transitif) | `^0.35.4` | Seule dépendance ajoutée (FR-014, R5) |
| `wrangler.jsonc` → `assets` | absent (injecté par l'adaptateur) | `{ "not_found_handling": "404-page" }`, fusionné par l'adaptateur | FR-004, R6 |
| `wrangler.jsonc` → `compatibility_flags`, `observability` | présents | inchangés | R10 |
| `public/_headers` | CORS `/*`, `noindex` sur `*.workers.dev` | inchangé | FR-009 |
| `public/robots.txt` | absent | `User-agent: *`, `Allow: /`, `Sitemap: https://communile.fr/sitemap-index.xml` | FR-015, R7 |

## Code touché

| Fichier | Changement | Règle |
|---|---|---|
| `src/utils/url.ts` (nouveau) | `getPagePath(url: URL): string` : retire `(/index)?.html` et renvoie `/` si le résultat est vide | Pas d'effet sur une URL sans `.html` : même résultat en dev (rendu à la demande) et au build (R3) |
| `src/utils/image.ts` (nouveau) | `getLogoUrl(): Promise<string>` : URL absolue (`SITE_URL`) du logo émis par `getImage` | Seule source de l'URL du logo (FR-016, R8) |
| `src/layouts/main.astro` | canonique via `getPagePath` ; logo par défaut via `getLogoUrl()` pour `og:image`, `twitter:image` et JSON-LD `logo` ; image OG explicite résolue sur `SITE_URL` ; `<link rel="sitemap">` | FR-007, FR-015, FR-016 (R3, R4, R7, R8) |
| `src/pages/{a-la-carte-postale,le-bar-ile,les-landes-fertiles,le-wattignies,le-labo-diva}.astro` | JSON-LD `'image': await getLogoUrl()` au lieu de `${SITE_URL}/communile-logo.webp` (404) | FR-016, SC-008 (R8) |
| `src/components/header.astro` | `pathname = getPagePath(Astro.url)` | FR-008 (R3) |

## Sorties de build (`dist/client/`)

| Sortie | Attendu |
|---|---|
| `index.html`, `a-la-carte-postale.html`, `contact.html`, `le-bar-ile.html`, `le-labo-diva.html`, `le-wattignies.html`, `les-landes-fertiles.html`, `404.html` | 8 fichiers (SC-002) |
| `_astro/*.webp` | variantes par largeur déclarée ; aucune URL `/_image?` dans le HTML (FR-005) |
| `_astro/communile-logo.<hash>.webp` | cible de l'image OG et du logo par défaut (FR-016) |
| `sitemap-index.xml`, `sitemap-0.xml` | 7 `<loc>` : `/` et les 6 pages sans slash final, sans `/404` (SC-008) |
| `robots.txt`, `_headers`, favicons, `site.webmanifest`, `fonts/` | copiés depuis `public/` (`_headers` complété par l'adaptateur avec `immutable` sur `/_astro/*`) |
| `wrangler.json` | config générée **sans `main`** (assets-only), `assets.not_found_handling: "404-page"` (R1, R6) |
| `dist/server/` | vide tant qu'aucune page n'est dynamique |

## Transition d'état du Worker `communile-fr`

`Worker avec code (rendu à la demande de 8 routes)` → déploiement de `main` par Workers Builds → `Worker assets-only (8 pages + assets statiques)`.

Le domaine, le Custom Domain, la route du proxy `/mix/*` et la commande de déploiement ne changent pas. Pour revenir en arrière, il suffit de revert le merge : le déploiement suivant rétablit le rendu à la demande.
