# Research — Issue #63 (SEO La Sibra)

## R1. Endpoint maison vs `@astrojs/sitemap` — **le R5 de l'epic est factuellement inexact**

- **Constat mesuré** (et non supposé) : `research.md` de l'epic affirme en R5 qu'« avec `output: 'server'` sans pages prérendues, l'intégration `@astrojs/sitemap` ne produirait rien (elle n'inclut que les routes prérendues) ». **C'est faux avec les versions installées ici.** Test effectué sur cette branche : ajout de `site: 'https://communile.fr'` + `integrations: [sitemap()]` à `astro.config.mjs`, puis `astro build`. Résultat : `dist/sitemap-index.xml` et `dist/sitemap-0.xml` générés, contenant **les 8 routes publiques** (`/`, les 6 lieux, `/contact`), 404 exclue, alors qu'aucune page n'est prérendue (`find dist -name '*.html'` → vide). Astro 5.16 + `@astrojs/sitemap` 3.6 collectent les routes statiques connues indépendamment du prérendu. La configuration a été restaurée à l'identique après le test.
- **Decision**: **garder malgré tout l'endpoint maison `src/pages/sitemap.xml.ts`**, mais pour les bonnes raisons, énoncées ci-dessous — pas pour celle de R5.
- **Rationale**:
  1. **L'URL contractuelle n'est pas atteignable avec l'intégration.** `contracts/page-et-seo.md` et le `robots.txt` (T021) exigent `https://communile.fr/sitemap.xml`. L'intégration produit `sitemap-index.xml` + `sitemap-0.xml` ; l'option `filenameBase` déplace le préfixe mais ne fusionne pas en un fichier unique `sitemap.xml`. Servir le contrat exigerait une redirection ou un fichier supplémentaire — plus de pièces, pas moins.
  2. **Incohérence de barre oblique finale.** L'intégration émet `https://communile.fr/la-sibra/` (avec barre finale) alors que le layout déclare `<link rel="canonical" href="https://communile.fr/la-sibra">` (sans). Deux URLs différentes pour la même page envoyées aux moteurs : exactement le signal brouillé que l'issue cherche à éviter. FR-013 de la spec l'interdit.
  3. **Changement transverse de configuration.** L'activer impose d'ajouter `site` et une intégration à `astro.config.mjs`, ce qui modifie la résolution d'URL pour l'ensemble du site — hors périmètre d'une issue de métadonnées (principe II, YAGNI).
- **Alternatives considered**:
  - `@astrojs/sitemap` + `serialize` pour retirer les barres finales + redirection `/sitemap.xml` → `/sitemap-index.xml` : fonctionne, mais trois mécanismes (intégration, sérialiseur, redirection) là où un endpoint de 30 lignes suffit.
  - `trailingSlash: 'never'` global pour réconcilier canonical et sitemap : modification du comportement de routage de tout le site, clairement hors périmètre.
  - Sitemap statique dans `public/` : doublon manuel des routes, dérive garantie (rejeté par R5 de l'epic, toujours valable).
- **Conséquence à remonter à l'humain** : la dépendance `@astrojs/sitemap` reste déclarée dans `package.json` sans être utilisée. La retirer touche le lockfile, hors périmètre de cette issue — à trancher séparément.

## R2. Endpoint rendu à la demande plutôt que prérendu

- **Decision**: pas de `export const prerender = true` sur `src/pages/sitemap.xml.ts` ; la réponse est construite à la requête avec un en-tête `Content-Type: application/xml; charset=utf-8` explicite.
- **Rationale**: le contrat impose un type de contenu XML (`contracts/page-et-seo.md`) ; en SSR on l'écrit soi-même et il est vérifiable. En prérendu, le fichier passerait par le service d'assets statiques de Cloudflare, dont le type de contenu pour `.xml` n'est pas sous le contrôle du dépôt. Le site est par ailleurs intégralement SSR : un endpoint SSR est la solution cohérente (principe V). Le coût de calcul est négligeable (concaténation de 8 chaînes).
- **Alternatives considered**: prérendu (rejeté : type de contenu non maîtrisé, et incohérent avec le reste du site) ; fichier statique `public/sitemap.xml` (rejeté, cf. R1).

## R3. Source des URLs publiques — ajout de `PATH.CONTACT`

- **Decision**: ajouter `CONTACT: '/contact'` à `PATH` dans `src/utils/constants.ts`, puis dériver la liste du sitemap par `Object.values(PATH).filter(path => !path.includes('#'))`.
- **Rationale**: `/contact` est une page publique réelle (`src/pages/contact.astro`) absente de `PATH` — la seule dans ce cas. Sans cet ajout, l'endpoint devrait recoller une URL en dur, ce que FR-012 interdit. Le filtre sur `#` écarte les 4 entrées d'ancre (`/#qui-sommes-nous`, `/#notre-concept`, `/#en-quelques-chiffres`, `/#scic`) qui pointent toutes vers l'accueil et créeraient des doublons. Total : 8 URLs, conforme au contrat.
- **Risque de conflit** : `src/utils/constants.ts` n'est pas dans le périmètre de l'issue #62 (nav/footer/accueil), qui n'a aucune raison d'y toucher — `PATH.LA_SIBRA` existe déjà. L'ajout est placé en fin du groupe des pages pour minimiser la surface de conflit.
- **Alternatives considered**: liste d'URLs locale à l'endpoint (rejeté : duplication, dérive au prochain ajout de page) ; lecture du système de fichiers `src/pages` au build (rejeté : fragile, et impossible tel quel sur Cloudflare Workers).

## R4. Barre oblique finale et forme des URLs

- **Decision**: construire chaque URL par `new URL(path, SITE_URL).href`.
- **Rationale**: produit `https://communile.fr/` pour l'accueil et `https://communile.fr/la-sibra` (sans barre finale) pour les autres — exactement ce que le layout émet en `<link rel="canonical">` (`new URL(Astro.url.pathname, SITE_URL)`). FR-013 satisfait par construction, avec la même primitive des deux côtés.
- **Alternatives considered**: concaténation `${SITE_URL}${path}` (donne le même résultat aujourd'hui mais ne normalise rien si une route future est mal formée).

## R5. Échappement XML

- **Decision**: échapper `&`, `<`, `>`, `"` et `'` dans les URLs avant insertion dans le XML.
- **Rationale**: aucune route actuelle ne contient de caractère à échapper, mais un sitemap mal formé est silencieusement rejeté par les moteurs — le coût de l'oubli est disproportionné face à cinq lignes de code. Le sitemap étant dérivé automatiquement de `PATH`, une route future contenant `&` passerait sinon inaperçue.
- **Alternatives considered**: pas d'échappement (rejeté : fragilité silencieuse) ; `encodeURI` (rejeté : n'échappe pas `&`, qui est précisément le caractère dangereux en XML).

## R6. Coordonnées sous gate humain (#67)

- **Decision**: le JSON-LD **n'expose ni `telephone` ni `email`**, bien que `contracts/page-et-seo.md` les montre dans son exemple.
- **Rationale**: le contrat les annote lui-même « ⚠️ confirmé avant mise en ligne » ; la confirmation n'a pas eu lieu (source : archive Wayback de l'ancien site). La constitution, principe I, interdit toute donnée de contact non vérifiée en production. Les issues #61 (infos pratiques) et #65 (tireuse) ont tranché de la même façon pour l'affichage ; les données structurées sont du contenu publié au même titre — davantage même, puisqu'un moteur peut les reprendre telles quelles dans un encart ou une fiche de lieu.
- **Impact schema.org**: aucun. `telephone` et `email` sont optionnels sur `LocalBusiness`/`Brewery` ; leur absence ne produit ni erreur ni avertissement au validateur.
- **À lever par l'humain**: une fois #67 confirmé, réintroduire les deux champs dans l'objet `brewerySchema` de `src/pages/la-sibra.astro`.

## R7. Type schema.org et image

- **Decision**: `@type: 'Brewery'` (sous-type de `FoodEstablishment` → `LocalBusiness`), `image` pointant vers la photo du lieu optimisée à 1200 px, en URL absolue.
- **Rationale**: `Brewery` est le type le plus spécifique disponible et celui que l'issue impose. L'héritage de `LocalBusiness` rend valides `address`, `geo`, `openingHoursSpecification`, `telephone`, `email` et `sameAs`. Pour l'image, les 6 autres pages du site se contentent du logo générique (`communile-logo.webp`) ; le contrat de cette feature demande explicitement « photo optimisée », et une photo réelle du lieu sert mieux les encarts de résultats. Même image que l'Open Graph (`sibra-boutique.webp`, celle de la section « c'est quoi ? », patron des autres pages), obtenue via `getImage` d'`astro:assets`.
- **Alternatives considered**: `@type: 'LocalBusiness'` (rejeté : moins spécifique, et l'issue tranche) ; logo générique en `image` (rejeté : le contrat demande la photo du lieu).

## R9. Décisions issues de la revue de code

- **`image` du JSON-LD résolue sur `SITE_URL`, pas sur `Astro.url`** : la première version résolvait l'URL de l'image sur l'origine de la requête (comme le fait le layout pour `og:image`). Cela produisait un objet incohérent — `url: "https://communile.fr/la-sibra"` (canonique, via `SITE_URL`) à côté d'une `image` sur `http://localhost:…` ou sur un domaine de preview. Les données structurées sont canoniques par nature : `new URL(optimizedImage.src, SITE_URL).href`. En production les deux origines coïncident, donc `og:image` et `image` restent identiques ; ailleurs, seule la donnée structurée reste juste. Note : `public/_headers` marque déjà `*.pages.dev` en `X-Robots-Tag: noindex`, ce qui limitait la portée du défaut sans le corriger.
- **Duplication assumée du `width: 1200`** entre `src/pages/la-sibra.astro` et `src/layouts/main.astro` : les deux appellent `getImage` avec la même largeur pour obtenir la même URL. Le corriger proprement supposerait que le layout expose l'URL calculée aux pages — une modification du layout, donc de toutes les pages du site, hors périmètre de cette issue. Astro déduplique la transformation : il n'y a pas de coût de build réel, seulement un couplage implicite à surveiller si la largeur change un jour.
- **Pas d'en-tête `Cache-Control` sur `/sitemap.xml`** : envisagé, écarté. Un sitemap est requêté quelques fois par jour par des robots, la génération est une concaténation de huit chaînes, et un cache introduirait un risque de sitemap périmé après l'ajout d'une page. YAGNI (principe II).
- **`escapeXml` ordonne `&` en premier**, sinon les entités produites par les remplacements suivants seraient ré-échappées. `replaceAll` requiert ES2021 : supporté par Node ≥ 21 et par le runtime Cloudflare Workers, et validé par `astro check` sous `astro/tsconfigs/strict`.
- **Le filtre `!path.includes('#')`** écarte les ancres mais laisserait passer une éventuelle URL externe ajoutée un jour à `PATH`. Aucune entrée de ce type n'existe et `PATH` est documenté comme la liste des routes internes ; renforcer le filtre serait de la défense spéculative.

## R8. Description de page

- **Decision**: `La Sibra, microbrasserie nantaise du quartier Saint-Clément, anciennement Les Bières de Charlotte. Boutique : vendredi 16 h – 20 h, samedi 11 h – 20 h.`
- **Rationale**: **151 caractères** (mesurés), sous la limite de 160 de FR-008. Contient les trois éléments exigés : ancien nom textuel (« anciennement Les Bières de Charlotte », cible de recherche principale), quartier, et les deux plages d'ouverture de la boutique — ce que `contracts/page-et-seo.md:18` réclame et que la description actuelle ne faisait pas. Typographie reprise à l'identique de `sibra-boutique-section.astro:13` (vérifiée au niveau octet) : espaces ordinaires et tiret demi-cadratin `–` dans « 16 h – 20 h », espace avant le deux-points. Les plages sont copiées de cette seule source affichée.
- **Réutilisation**: la même chaîne alimente `<meta name="description">`, `og:description`, `twitter:description` (via le layout) et le champ `description` du JSON-LD — une seule constante, pas de divergence possible.
- **Alternatives considered**: format à émojis de `a-la-carte-postale.astro` (rejeté : l'issue demande une description factuelle en prose ; les émojis consomment des caractères utiles et ne sont pas le patron des pages de lieux) ; mention du téléphone (interdite, cf. R6).
