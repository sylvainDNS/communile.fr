# Contrat — `/sitemap.xml` et `/robots.txt`

## `GET /sitemap.xml`

| Attribut | Valeur |
|---|---|
| Statut | `200` |
| `Content-Type` | `application/xml; charset=utf-8` |
| Corps | document XML `urlset` (ci-dessous) |
| Méthodes autres que `GET` | non gérées (comportement par défaut d'Astro) |

### Corps attendu

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://communile.fr/</loc></url>
  <url><loc>https://communile.fr/le-wattignies</loc></url>
  <url><loc>https://communile.fr/les-landes-fertiles</loc></url>
  <url><loc>https://communile.fr/le-labo-diva</loc></url>
  <url><loc>https://communile.fr/le-bar-ile</loc></url>
  <url><loc>https://communile.fr/a-la-carte-postale</loc></url>
  <url><loc>https://communile.fr/la-sibra</loc></url>
  <url><loc>https://communile.fr/contact</loc></url>
</urlset>
```

### Invariants vérifiables

| # | Invariant | Comment le vérifier |
|---|---|---|
| S1 | Exactement 8 `<loc>` | `grep -c '<loc>'` sur la réponse |
| S2 | Toutes les URLs sont absolues sur `https://communile.fr` | inspection |
| S3 | Aucune URL ne contient `#` | `grep '#'` → vide |
| S4 | `/404` absent | `grep 404` → vide |
| S5 | Chaque `<loc>` est identique au `<link rel="canonical">` de la page correspondante, caractère pour caractère (barre finale comprise) | comparaison requête par requête |
| S6 | Le document est du XML bien formé | parseur XML |
| S7 | La liste se met à jour automatiquement si une entrée sans ancre est ajoutée à `PATH` | lecture du code : aucune URL en dur |

## `GET /robots.txt`

| Attribut | Valeur |
|---|---|
| Statut | `200` |
| Origine | fichier statique `public/robots.txt` |

### Corps attendu

```text
User-agent: *
Allow: /

Sitemap: https://communile.fr/sitemap.xml
```

### Invariants vérifiables

| # | Invariant | Comment le vérifier |
|---|---|---|
| R1 | Aucune directive `Disallow` bloquante | lecture |
| R2 | La ligne `Sitemap:` porte une URL **absolue** | lecture (le format l'exige) |
| R3 | L'URL de la ligne `Sitemap:` répond elle-même en 200 avec du XML | requête |
