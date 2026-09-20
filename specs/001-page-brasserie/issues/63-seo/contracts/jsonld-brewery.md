# Contrat — bloc de données structurées de `/la-sibra`

Sérialisé par `src/layouts/main.astro` dans `<script type="application/ld+json">`, à partir de `content.jsonLd`.

## Forme attendue

```jsonc
{
  "@context": "https://schema.org",
  "@type": "Brewery",
  "name": "La Sibra",
  "alternateName": "Les Bières de Charlotte",
  "description": "La Sibra, microbrasserie nantaise du quartier Saint-Clément, anciennement Les Bières de Charlotte. Boutique : vendredi 16 h – 20 h, samedi 11 h – 20 h.",
  "url": "https://communile.fr/la-sibra",
  "image": "https://communile.fr/_image?href=...&w=1200&f=webp", // URL absolue de la photo optimisée
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "121 rue du Général Buat",
    "postalCode": "44000",
    "addressLocality": "Nantes",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.225406,
    "longitude": -1.543878
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Friday"], "opens": "16:00", "closes": "20:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "11:00", "closes": "20:00" }
  ],
  "sameAs": ["https://www.instagram.com/bieresdecharlotte/"]
}
```

## Écarts assumés vis-à-vis de `specs/001-page-brasserie/contracts/page-et-seo.md`

| Champ du contrat de l'epic | Traitement ici | Motif |
|---|---|---|
| `telephone: "+33633015663"` | **omis** | annoté « ⚠️ confirmé avant mise en ligne » dans le contrat lui-même ; confirmation absente (source Wayback), gate humain #67, constitution principe I. Décision alignée sur #61 et #65. |
| `email: "bce.brasserie@gmail.com"` | **omis** | idem |
| `geo` en chaînes (`"<géocodé>"`) | nombres | schema.org accepte les deux ; le dépôt publie déjà des nombres (`a-la-carte-postale.astro`) |
| `image: "<photo optimisée>"` | photo du lieu à 1200 px, URL absolue | respecte le contrat ; les autres pages se contentent du logo |

## Invariants vérifiables

| # | Invariant | Comment le vérifier |
|---|---|---|
| C1 | `@type` vaut exactement `Brewery` | lecture du bloc dans `view-source:` |
| C2 | `name` = `La Sibra`, `alternateName` = `Les Bières de Charlotte` | idem |
| C3 | Aucune occurrence de `telephone`, `email`, `0633015663`, `bce.brasserie` dans le HTML rendu | `grep` sur la réponse HTTP |
| C4 | `address`, `geo` et les horaires coïncident avec ce qu'affiche la page | comparaison avec `sibra-infos-section.astro` et `sibra-boutique-section.astro` |
| C5 | Le JSON est syntaxiquement valide et n'échappe rien de travers (apostrophes typographiques, accents) | `JSON.parse` du contenu du script |
| C6 | 0 erreur au validateur schema.org | https://validator.schema.org (copier-coller du bloc) |
| C7 | `description` du JSON-LD ≡ `<meta name="description">` | comparaison de chaînes |

## Métadonnées de page associées

| Élément | Valeur attendue |
|---|---|
| `<title>` | `La Sibra · Commun'île` (suffixe ajouté par le layout) |
| `<meta name="description">` | la description ci-dessus, 151 caractères |
| `<link rel="canonical">` | `https://communile.fr/la-sibra` |
| `og:image` / `twitter:image` | URL absolue de `sibra-boutique.webp` optimisée (≠ logo générique) |
| `robots` | **pas** de `noindex` (la page doit rester indexable) |
