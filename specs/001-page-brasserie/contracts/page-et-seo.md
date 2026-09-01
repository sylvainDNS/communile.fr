# Contrat : routes, métadonnées et SEO

Interfaces publiques exposées par la feature (URLs et métadonnées lues par les visiteurs et les moteurs).

## Routes

| Route | Méthode | Contenu | Statut |
|---|---|---|---|
| `/les-bieres-de-charlotte` | GET | Page HTML du lieu | 200, indexable (pas de `noindex`) |
| `/sitemap.xml` | GET | XML sitemap de toutes les pages publiques | 200, `Content-Type: application/xml` |
| `/robots.txt` | GET | Autorise l'indexation, référence `Sitemap: https://communile.fr/sitemap.xml` | 200 (fichier statique `public/`) |

## Métadonnées de la page (via `Layout content={...}`)

| Élément | Contrat |
|---|---|
| `<title>` | `Les Bières de Charlotte · Commun'île` (suffixe ajouté par le layout) |
| `<meta name="description">` | Description factuelle (lieu, quartier, horaires boutique) |
| Canonical | `https://communile.fr/les-bieres-de-charlotte` (généré par le layout) |
| Open Graph / Twitter | title, description, image = photo du lieu optimisée 1200 px (via `content.image`) |
| `lang` | `fr` (layout) |

## JSON-LD (schema.org)

```jsonc
{
  "@context": "https://schema.org",
  "@type": "Brewery",
  "name": "Les Bières de Charlotte",
  "description": "<description de la page>",
  "url": "https://communile.fr/les-bieres-de-charlotte",
  "image": "<photo optimisée>",
  "telephone": "+33633015663",          // ⚠️ confirmé avant mise en ligne
  "email": "bce.brasserie@gmail.com",   // ⚠️ confirmé avant mise en ligne
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "121 rue du Général Buat",
    "postalCode": "44000",
    "addressLocality": "Nantes",
    "addressCountry": "FR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "<géocodé>", "longitude": "<géocodé>" },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Friday"], "opens": "16:00", "closes": "20:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "11:00", "closes": "20:00" }
  ],
  "sameAs": ["https://www.instagram.com/bieresdecharlotte/"]
}
```

## Sitemap — contrat de contenu

Le XML liste exactement les pages publiques indexables :
`/`, `/le-wattignies`, `/les-landes-fertiles`, `/le-labo-diva`, `/le-bar-ile`, `/a-la-carte-postale`, `/les-bieres-de-charlotte`, `/contact` — URLs absolues sur `SITE_URL`. `404` exclue. Source : constantes `PATH` (les entrées avec ancre `/#...` sont exclues).

## Points d'intégration internes (consommés par le reste du site)

| Consommateur | Contrat |
|---|---|
| `header.astro` | entrée `{ label: 'Les Bières de Charlotte', href: PATH.LES_BIERES_DE_CHARLOTTE }` en fin de `links` |
| `footer.astro` | `<li>` supplémentaire dans la colonne des lieux |
| `home-places-section.astro` | `PlaceCard` avec image paysage dédiée, alt FR, horaires boutique dans `hover-content` |
| `main.astro` | `theme` accepte `'bieres-de-charlotte'` |
