# Quickstart : validation du prérendu

Ce guide sert à exécuter la validation, pas à implémenter. Le détail attendu est dans le [contrat](./contracts/public-surface.md) ; les artefacts et les sorties sont dans le [data model](./data-model.md).

## Prérequis

- Node 24 et pnpm ≥ 12. Chrome système pour les captures.
- Scripts de 002 dans `tmp/astro-upgrade/` : `snapshot.sh`, `shots.mjs`, `map.mjs`, `lh-multi.sh`. Pour `shots.mjs` et `map.mjs`, lancer `npm i puppeteer-core` dans un dossier temporaire, puis les exécuter depuis ce dossier.
- Référence : `tmp/astro-upgrade/current/prod/` (HTML, en-têtes, statuts, `pshots/`).
- Sortie de cette spec : `tmp/prerendu/` (non versionné).
- **Ne jamais appeler `/mix/load/event`.** Les scripts bloquent déjà `/mix/load/` dans le navigateur.

## 1. Build local

```sh
pnpm install --frozen-lockfile
pnpm build && pnpm lint
```

Attendu :
- 0 erreur, 0 avertissement `astro check` ;
- log `8 page(s) built` et `sitemap-index.xml created` ;
- un `TimeoutError` sur `Request.cf` est possible au premier build : il est bénin (R9).

Contrôles sur `dist/client/` :

```sh
ls dist/client/*.html                              # 8 fichiers
grep -c '/_image?' dist/client/*.html              # 0 partout
grep -o '"main"' dist/client/wrangler.json         # rien (assets-only)
grep -o '"not_found_handling":"[^"]*"' dist/client/wrangler.json   # 404-page
grep -o '<loc>[^<]*' dist/client/sitemap-0.xml     # 7 URL, sans slash final ni /404
grep -ho '<link rel="canonical"[^>]*>' dist/client/*.html   # jamais de .html
```

## 2. Prévisualisation locale (workerd)

```sh
pnpm preview            # ou : npx wrangler dev ; noter l'URL locale affichée
tmp/astro-upgrade/snapshot.sh <local_url> tmp/prerendu/local
pnpm astro preview stop
```

Attendu dans `status.txt` : 7 routes en 200, `/nexiste-pas` en 404 et `/contact/` en `307 -> /contact`. Pour la 404, envoyer `Sec-Fetch-Mode: navigate` si on teste à la main avec curl.

Vérifications ciblées sur `tmp/prerendu/local/html` par rapport à `current/prod/html` :
- `title`, `description`, `og:*`, `twitter:*`, canonique et JSON-LD sont égaux, sauf les URL d'images ;
- `aria-current="page"` apparaît le même nombre de fois par page ;
- même nombre de `<img>`, mêmes `alt`, mêmes descripteurs `w` dans les `srcset`.

## 3. Preview `*.workers.dev` (checkpoint humain)

Pousser la branche. Workers Builds construit alors une version de preview, à condition que les builds des branches hors production soient activés (Settings → Builds). Sinon, le mainteneur lance lui-même `npx wrangler versions upload`. **On ne change jamais la branche de production.** Sur l'URL de preview :

```sh
tmp/astro-upgrade/snapshot.sh <preview_url> tmp/prerendu/preview
curl -sI <preview_url>/contact | grep -i x-robots-tag       # noindex
node shots.mjs tmp/prerendu/preview/pshots <preview_url>     # depuis le dossier puppeteer
node map.mjs <preview_url>                                   # tuiles, marqueur, 0 erreur JS
```

Attendu :
- **SC-001** : captures à 390 et 1440 px identiques à `current/prod/pshots/`, aux écarts connus près (badges animés, carte). On compare avec le même outil de diff qu'en 002.
- **SC-003** : pour la page d'accueil à 390 px, la somme des octets des images transférées baisse d'au moins 50 %. On la mesure depuis puppeteer (réponses `image/*`, somme des `content-length` ou de la taille du corps), des deux côtés.
- **SC-004** : le poids total transféré de chaque page, en mobile et en desktop, est inférieur ou égal à la référence. On ne le mesure que sur la preview : en local, HTML, CSS et JS ne sont pas compressés comme en production, et la comparaison serait biaisée.
- **SC-005** : `lh-multi.sh`, 3 mesures alternées entre la référence et la preview, comparées sur les médianes. Accessibilité et SEO ne baissent pas. La performance ne baisse pas de plus de 2 points.
- Toute image citée en URL absolue (`og:image`, `twitter:image`, JSON-LD `logo` et `image`) répond 200 sur la preview. Comme ces URL pointent vers `communile.fr`, on vérifie leur chemin sur `<preview_url>`.
- `noindex` est bien présent : la règle `https://:version.:subdomain.workers.dev/*` de `_headers` couvre le format des URL de preview (`<version>-communile-fr.sylvain-denyse.workers.dev`).

## 4. Production (après merge sur `main`)

Workers Builds déploie `main`. Ensuite :

```sh
tmp/astro-upgrade/snapshot.sh https://communile.fr tmp/prerendu/prod
curl -s -o /dev/null -w '%{http_code}\n' https://communile.fr/mix/load/script.js   # 200, script seulement
curl -s https://communile.fr/robots.txt | grep -i '^sitemap:'                        # ligne présente
curl -s https://communile.fr/sitemap-index.xml | head -c 300
for u in $(grep -hoE 'https://communile\.fr/[^"]+\.(webp|png|jpg)' tmp/prerendu/prod/html/*.html | sort -u); do curl -s -o /dev/null -w "%{http_code} $u\n" "$u"; done   # OG + JSON-LD, tout en 200
curl -sI https://communile.fr/contact | grep -i x-robots-tag     # rien
```

Attendu (SC-007, SC-008) :
- statuts identiques à l'étape 2 ;
- proxy en 200 ;
- `Sitemap:` présent dans le `robots.txt` fusionné par Cloudflare ;
- toutes les images citées en URL absolue (OG et JSON-LD) en 200 ;
- pas de `noindex` ;
- dans le tableau de bord du Worker, les requêtes de pages n'apparaissent plus comme des invocations (SC-002).

Pour revenir en arrière : revert du merge sur `main`, puis redéploiement automatique.
