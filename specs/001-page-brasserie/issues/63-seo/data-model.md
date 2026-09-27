# Data Model — Issue #63 (SEO La Sibra)

Aucune persistance : toutes les données sont littérales dans les sources. Ce document fixe **ce qui est publié**, **d'où ça vient** et **ce qui est interdit de publier**.

## Entité — Fiche lieu structurée (`Brewery`)

Portée : bloc `application/ld+json` de `/la-sibra`, construit dans le frontmatter de `src/pages/la-sibra.astro` et sérialisé par `src/layouts/main.astro` via `content.jsonLd`.

| Champ | Valeur | Source / vérification |
|---|---|---|
| `@context` | `https://schema.org` | fixe |
| `@type` | `Brewery` | issue #63, research R7 |
| `name` | `La Sibra` | nom actuel (révision epic 2026-09-18) |
| `alternateName` | `Les Bières de Charlotte` | ancien nom, cible de recherche |
| `description` | description de page (cf. entité suivante) | même constante que `<meta name="description">` |
| `url` | `https://communile.fr/la-sibra` | `SITE_URL` + `PATH.LA_SIBRA` |
| `image` | URL absolue de `sibra-boutique.webp` optimisée à 1200 px | `astro:assets` / `getImage` |
| `address` | `PostalAddress` (ci-dessous) | adresse **confirmée** (#61) |
| `geo` | `GeoCoordinates` (ci-dessous) | Base Adresse Nationale, id `44109_3556_00121` (#61) |
| `openingHoursSpecification` | 2 entrées (ci-dessous) | horaires affichés par `sibra-boutique-section.astro` |
| `sameAs` | `["https://www.instagram.com/bieresdecharlotte/"]` | compte déjà utilisé par `sibra-instagram-section.astro` |
| ~~`telephone`~~ | **ABSENT** | non confirmé — gate #67, constitution I |
| ~~`email`~~ | **ABSENT** | non confirmé — gate #67, constitution I |

### Sous-objet `address` (`PostalAddress`)

| Champ | Valeur |
|---|---|
| `streetAddress` | `121 rue du Général Buat` |
| `postalCode` | `44000` |
| `addressLocality` | `Nantes` |
| `addressCountry` | `FR` |

Cohérence exigée : identique à l'`<address>` rendue par `sibra-infos-section.astro`.

### Sous-objet `geo` (`GeoCoordinates`)

| Champ | Valeur | Type |
|---|---|---|
| `latitude` | `47.225406` | nombre |
| `longitude` | `-1.543878` | nombre |

Cohérence exigée : identiques au centre et au marqueur de la carte de `sibra-infos-section.astro:7`. Publiées en nombres (et non en chaînes) comme le fait déjà `a-la-carte-postale.astro` ; schema.org accepte les deux.

### Collection `openingHoursSpecification`

| `dayOfWeek` | `opens` | `closes` |
|---|---|---|
| `["Friday"]` | `16:00` | `20:00` |
| `["Saturday"]` | `11:00` | `20:00` |

Règles : format 24 h `HH:MM`, jours en anglais (vocabulaire schema.org), **uniquement** les jours d'ouverture de la boutique — aucun autre jour n'est déclaré, ce qui signifie « fermé » pour un moteur. Source unique : le tableau `horaires` de `sibra-boutique-section.astro`.

## Entité — Description de page

| Attribut | Valeur |
|---|---|
| Texte | `La Sibra, microbrasserie nantaise du quartier Saint-Clément, anciennement Les Bières de Charlotte. Boutique : vendredi 16 h – 20 h, samedi 11 h – 20 h.` |
| Longueur | 151 caractères (≤ 160, FR-008) |
| Consommateurs | `<meta name="description">`, `og:description`, `twitter:description` (layout) et `description` du JSON-LD |

Contraintes : une seule déclaration (constante `description` du frontmatter), jamais recopiée ; contient l'ancien nom et les deux plages horaires ; aucune coordonnée sous gate.

## Entité — Page publique

Ensemble des routes destinées aux visiteurs et à l'indexation.

| Clé `PATH` | URL |
|---|---|
| `HOME` | `https://communile.fr/` |
| `LE_WATTIGNIES` | `https://communile.fr/le-wattignies` |
| `LES_LANDES_FERTILES` | `https://communile.fr/les-landes-fertiles` |
| `LE_LABO_DIVA` | `https://communile.fr/le-labo-diva` |
| `LE_BAR_ILE` | `https://communile.fr/le-bar-ile` |
| `A_LA_CARTE_POSTALE` | `https://communile.fr/a-la-carte-postale` |
| `LA_SIBRA` | `https://communile.fr/la-sibra` |
| `CONTACT` *(ajoutée par cette issue)* | `https://communile.fr/contact` |

**Exclusions** :

- entrées d'ancre de `PATH` (`QUI_SOMMES_NOUS`, `NOTRE_CONCEPT`, `EN_QUELLES_CHIFFRES`, `SCIC`) — reconnues par la présence de `#`, elles désignent l'accueil ;
- `src/pages/404.astro` — jamais dans `PATH`, donc exclue par construction.

**Invariant** : `Object.values(PATH).filter(p => !p.includes('#'))` a exactement 8 éléments. Tout ajout de page publique au site l'étend automatiquement.

## Entité — Sitemap

| Attribut | Valeur |
|---|---|
| Adresse | `/sitemap.xml` |
| Type de contenu | `application/xml; charset=utf-8` |
| Racine | `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` |
| Entrées | une `<url><loc>` absolue par page publique, dans l'ordre de `PATH` |
| Champs optionnels | aucun (`lastmod`, `changefreq`, `priority` omis — pas de source fiable pour les dater, et les moteurs les ignorent largement) |

## Entité — Robots

| Attribut | Valeur |
|---|---|
| Adresse | `/robots.txt` (fichier statique `public/robots.txt`) |
| Règles | `User-agent: *` puis `Allow: /` — indexation intégralement autorisée |
| Sitemap | `Sitemap: https://communile.fr/sitemap.xml` (URL absolue, exigée par le format) |

Note : la page 404 n'a pas besoin d'être exclue par `robots.txt` ; elle répond en 404 et n'est listée nulle part.
