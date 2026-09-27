# Contrat : surface publique

Ce contrat liste ce qui DOIT rester identique, ce qui change volontairement et ce qui est ajouté. La référence est la production actuelle, capturée dans `tmp/astro-upgrade/current/prod/`.

## Routes

| Requête | Avant | Après |
|---|---|---|
| `/`, `/a-la-carte-postale`, `/contact`, `/le-bar-ile`, `/le-labo-diva`, `/le-wattignies`, `/les-landes-fertiles` | 200 | 200 (inchangé) |
| URL inexistante (ex. `/nexiste-pas`) | 404, page personnalisée | 404, page personnalisée (inchangé) |
| Slash final (ex. `/contact/`) | 200 | **307 → `/contact`** (changement accepté, FR-003) |
| `/contact.html`, `/index.html` | 404 | **307 → `/contact`, `/`** (effet du format de fichier, sans conséquence) |
| `/404` | 404 (page personnalisée) | 200 : `404.html` servie directement. Elle est en `noindex` et n'est liée nulle part (effet du format de fichier, constat T014) |
| `/sitemap-index.xml`, `/sitemap-0.xml` | 404 | **200** (ajout, FR-015) |
| `/robots.txt` | 200 : texte généré par Cloudflare (*managed robots.txt*, content signals, que des commentaires) | 200 : fusion du texte Cloudflare et du fichier du dépôt, qui DOIT contenir la ligne `Sitemap:` (FR-015, à vérifier en production) |
| `/mix/load/script.js` | 200 (proxy distinct) | 200 (inchangé, jamais modifié) |

## Par page

- **`<head>`** : `title`, `meta description`, `robots` (404), `og:title`, `og:description`, `og:url`, `twitter:*` et canonique DOIVENT être identiques à la référence. En particulier :
  - `og:url` et la canonique ne contiennent jamais `.html` ;
  - elles restent sans slash final, sauf `/` ;
  - **exception acceptée (constat T013)** : sur la page 404, canonique et `og:url` valent `https://communile.fr/404`, et non plus l'URL demandée. Une page prérendue ne connaît pas l'URL de la requête. La page est en `noindex` et répond 404 : aucun effet SEO.
- **Image de partage** :
  - pages avec image dédiée : même image source en 1200 px de large, mais son URL change (`/_image?…` devient `/_astro/<nom>.<hash>.webp`) ;
  - pages sans image dédiée (`/contact`, 404) : l'URL déclarée DOIT désormais répondre 200 (FR-016).
- **Toute URL absolue d'image** déclarée dans le HTML (`og:image`, `twitter:image`, JSON-LD) DOIT répondre 200 (SC-008).
- **JSON-LD** : contenu identique, sauf deux champs qui pointent aujourd'hui vers `/communile-logo.webp`, une URL en 404 :
  - `logo` de l'`Organization` par défaut ;
  - `image` des 5 pages lieux (`/a-la-carte-postale`, `/le-bar-ile`, `/le-labo-diva`, `/le-wattignies`, `/les-landes-fertiles`).

  Ces deux champs pointent désormais vers `/_astro/communile-logo.<hash>.webp`, qui répond 200 (FR-016).
- **Ajout dans le `<head>`** : `<link rel="sitemap" href="/sitemap-index.xml">`.
- **Images** :
  - même nombre d'images, mêmes `alt`, mêmes `width`/`height`, mêmes largeurs listées dans `srcset` et même `sizes` ;
  - seules les URL changent ;
  - chaque variante de largeur est un fichier réellement redimensionné (FR-005).
- **Navigation** : `aria-current="page"` apparaît sur le même lien, et le même nombre de fois qu'en production (2 fois par page lieu et sur l'accueil, 0 fois sur `/contact` et la 404).
- **Scripts** : carte Leaflet, animations anime.js, menu mobile, FAQ et script Plausible (production seulement) inchangés.
- **Rendu** : captures à 390 et 1440 px identiques à la référence, aux écarts connus près (antialiasing des badges animés et des tuiles de carte, voir 002).

## En-têtes HTTP

- `Access-Control-Allow-Origin: *` sur toutes les réponses statiques (inchangé).
- `X-Robots-Tag: noindex` sur les URL `*.workers.dev`, et jamais sur `communile.fr` (inchangé).
- `Cache-Control: public, max-age=31536000, immutable` sur `/_astro/*` (inchangé).
- Pages HTML : `Cache-Control: public, max-age=0, must-revalidate`, le défaut des static assets. C'est un nouvel en-tête, sans effet visible.

## Commandes du mainteneur (inchangées)

`pnpm install`, `pnpm dev`, `pnpm build` (qui inclut `astro check`), `pnpm preview`, `pnpm lint`. Le déploiement Workers Builds reste sur `main` : build `pnpm build`, deploy `npx wrangler deploy`.
