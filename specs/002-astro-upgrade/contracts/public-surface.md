# Contrat : surface publique à préserver

La mise à jour ne DOIT modifier aucun élément de ce contrat (FR-003, FR-005, FR-006, FR-008, FR-009). La référence est la production actuelle, capturée au palier 0 ([quickstart](../quickstart.md)).

## Routes

| Route | Source | Statut attendu |
|---|---|---|
| `/` | `src/pages/index.astro` | 200 |
| `/a-la-carte-postale` | `src/pages/a-la-carte-postale.astro` | 200 |
| `/contact` | `src/pages/contact.astro` | 200 |
| `/le-bar-ile` | `src/pages/le-bar-ile.astro` | 200 |
| `/le-labo-diva` | `src/pages/le-labo-diva.astro` | 200 |
| `/le-wattignies` | `src/pages/le-wattignies.astro` | 200 |
| `/les-landes-fertiles` | `src/pages/les-landes-fertiles.astro` | 200 |
| URL inexistante (ex. `/nexiste-pas`) | `src/pages/404.astro` | 404, page personnalisée |

Comportement du slash final (`/contact/`) : identique à la référence (redirection ou non, même statut).

## Par page

- **HTML** : identique à la référence après normalisation. On ignore les empreintes de fichiers `_astro/*`, l'ordre des attributs et les espaces non significatifs. Tout espace significatif entre texte et élément inline DOIT être préservé (R6).
- **`<head>`** : `title`, `meta description`, balises Open Graph (image OG de 1200 px de large), JSON-LD, liens favicon et manifest : valeurs identiques.
- **Images** : même nombre d'images, mêmes `alt`, mêmes largeurs déclarées (`srcset`/`sizes`) ; poids transféré ≤ +5 %.
- **Scripts** : carte Leaflet fonctionnelle (pages lieux) ; animations anime.js déclenchées ; script Plausible chargé depuis `/mix/load/script.js` en production seulement, événements envoyés à `/mix/load/event`.

## En-têtes HTTP

- Assets statiques : `Access-Control-Allow-Origin: *` (règle `/*` de `public/_headers`).
- URLs de preview (non production) : `X-Robots-Tag: noindex` sur les assets statiques, comme aujourd'hui.
- Domaine de production `communile.fr` : aucun `noindex`.

## Commandes mainteneur

| Commande | Comportement attendu |
|---|---|
| `pnpm install` | réussit, lockfile figé en CI (`--frozen-lockfile`) |
| `pnpm dev` | serveur local, rechargement à chaud d'une page modifiée |
| `pnpm build` | `astro check` puis `astro build`, 0 erreur |
| `pnpm preview` | sert le build localement (désormais dans workerd) |
| `pnpm lint` | 0 erreur |
