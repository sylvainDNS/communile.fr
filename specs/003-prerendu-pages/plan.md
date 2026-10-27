# Implementation Plan: Prérendu des pages

**Branch**: `003-prerendu-pages` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-prerendu-pages/spec.md`

## Summary

On passe les 8 pages du rendu à la demande au prérendu, en gardant l'adaptateur Cloudflare (Q1 → B) :
- `output: 'static'`, `build.format: 'file'` et `site` ;
- `sharp` devient une dépendance directe ;
- `not_found_handling: "404-page"`.

Quand aucune route n'est dynamique, l'adaptateur génère une config Wrangler **assets-only**, sans `main`. Plus aucune requête de page n'exécute de code. Les images sont optimisées au build avec les largeurs déjà déclarées (−97 % pour l'illustration de 1,3 Mo en 330w).

Le prototype a révélé une régression à corriger : avec `format: 'file'`, `Astro.url.pathname` vaut `/contact.html`. Cela casse la canonique et le lien de navigation actif. Un utilitaire `getPagePath` normalise ce chemin.

On ajoute aussi le sitemap (D3), un `robots.txt` et la correction des URL du logo, aujourd'hui en 404 : image de partage par défaut, JSON-LD par défaut et JSON-LD des 5 pages lieux. Toutes les décisions ont été prototypées et vérifiées, voir [research.md](./research.md) (R1 à R13).

**Amendement d'implémentation (2026-09-27)** : la page `/contact`, un reliquat du développement initial avec un contenu factice, est supprimée à la demande du mainteneur (spec, *Clarifications*). Le site compte désormais 7 pages, 404 comprise, et le sitemap 6 URL. Les chiffres « 8 pages » ci-dessous décrivent l'état au moment du plan.

## Technical Context

**Language/Version**: TypeScript 6.0.3 ; Node 24

**Primary Dependencies**: astro 7.3.5, @astrojs/cloudflare 14.3.3 (`imageService: 'compile'`), @astrojs/sitemap 3.7.4 (déjà installé, désormais branché), **sharp 0.35.4 (ajout)**, wrangler 4.141.x

**Storage**: N/A

**Testing**: pas de suite automatisée. La validation se fait par :
- `pnpm build` (qui inclut `astro check`) et `pnpm lint` ;
- des contrôles ciblés sur `dist/client/` ;
- `snapshot.sh` sur les statuts et en-têtes ;
- des captures puppeteer à 390 et 1440 px contre `tmp/astro-upgrade/current/prod/` ;
- le poids transféré et des médianes Lighthouse (voir [quickstart.md](./quickstart.md)).

**Target Platform**: Cloudflare Workers static assets (Worker `communile-fr`, Custom Domain `communile.fr`, Workers Builds depuis `main`)

**Project Type**: site vitrine statique (Astro)

**Performance Goals**:
- images de l'accueil en mobile : au moins −50 % (SC-003) ;
- aucune page plus lourde qu'aujourd'hui (SC-004) ;
- Lighthouse à −2 points au plus (SC-005).

**Constraints**:
- proxy `/mix/*` intouchable, et jamais d'appel à `/mix/load/event` ;
- parité visuelle mobile et desktop ;
- mesures de temps bruitées en 3G.

**Scale/Scope**:
- 8 pages, environ 30 images sources, 195 variantes générées ;
- 13 fichiers de code et de config touchés (dont 2 nouveaux utilitaires), plus 1 fichier ajouté dans `public/`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Statut | Justification |
|---|---|---|
| I. Contenu d'abord | ✅ | Aucun contenu modifié. Le logo par défaut pointe vers une image réelle. |
| II. Statique et simple | ✅ **mis en conformité** | Les 8 pages sont générées statiquement (résorbe D1). Une seule dépendance est ajoutée, `sharp`, pour un besoin concret : l'optimisation au build. |
| III. Performance et SEO | ✅ **mis en conformité** | Les images sont dimensionnées (résorbe D2) et le sitemap est publié (résorbe D3). Métadonnées préservées, avec le correctif R3. |
| IV. Accessibilité et responsive | ✅ | `aria-current` préservé (R3). Parité visuelle à 390 et 1440 px (quickstart). |
| V. Cohérence de la stack | ✅ | Même stack. `pnpm build` et `pnpm lint` sont verts dans le prototype. Le nouvel utilitaire suit la convention `src/utils/*.ts`. |
| Contraintes techniques : hébergement | ✅ | Workers static assets, adaptateur `@astrojs/cloudflare` conservé. **Pas d'amendement.** |
| Contraintes techniques : assets | ✅ | Aucune image ajoutée ni dupliquée. Le logo existant est réutilisé via `getImage`. |
| Contraintes techniques : vie privée | ✅ | Plausible inchangé. |

**Re-check post-design** : aucune violation. Les dérogations D1 à D3 de la spec 002 sont résorbées. Il faut le consigner dans `specs/002-astro-upgrade/plan.md` (FR-013).

## Project Structure

### Documentation (this feature)

```text
specs/003-prerendu-pages/
├── plan.md                    # ce fichier
├── research.md                # Phase 0 : décisions R1–R12 (prototypées)
├── data-model.md              # Phase 1 : inventaire des artefacts et des sorties de build
├── quickstart.md              # Phase 1 : procédure de validation
├── contracts/
│   └── public-surface.md      # surface publique : inchangée, modifiée ou ajoutée
├── checklists/requirements.md
└── tasks.md                   # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
astro.config.mjs              # output static, build.format file, site, integrations sitemap
package.json, pnpm-lock.yaml  # + sharp
wrangler.jsonc                # + assets.not_found_handling, commentaire d'en-tête
public/robots.txt             # nouveau : Sitemap
src/utils/url.ts              # nouveau : getPagePath
src/utils/image.ts            # nouveau : getLogoUrl (URL absolue du logo émis par getImage)
src/layouts/main.astro        # canonique, logo par défaut via getLogoUrl, OG sur SITE_URL, link rel=sitemap
src/pages/{a-la-carte-postale,le-bar-ile,les-landes-fertiles,le-wattignies,le-labo-diva}.astro  # JSON-LD image via getLogoUrl
src/components/header.astro   # pathname via getPagePath(Astro.url)
specs/002-astro-upgrade/plan.md   # D1–D3 marquées résorbées (FR-013)
.cursor/rules/context.mdc         # « server output » → prérendu (static output)
```

**Structure Decision** : on garde le projet unique existant. Pas de nouveau répertoire.

## Paliers d'implémentation

Chaque palier se termine par un build et un lint verts, puis par l'étape correspondante du [quickstart](./quickstart.md).

0. **Référence** : on réutilise `tmp/astro-upgrade/current/prod/` (production Astro 7, identique à `main` hors documentation). On rejoue seulement `snapshot.sh` sur la production pour dater les statuts.
1. **Prérendu (US2, US1)** :
   - Contenu : `output: 'static'`, `build.format: 'file'`, `site`, `sharp`, `assets.not_found_handling`, `getPagePath` dans le layout et le header, image OG explicite résolue sur `SITE_URL` (R1 à R6, R9, R10).
   - Vérifications (quickstart, étapes 1 et 2) : 8 pages HTML, aucun `/_image?`, config sans `main`, 404 en 404, `/contact/` en 307, canoniques et `aria-current` à l'identique de la production.
2. **SEO (US3)** :
   - Contenu : intégration sitemap filtrée, `public/robots.txt`, `<link rel="sitemap">`, `getLogoUrl` dans `main.astro` et les 5 pages lieux (R7, R8).
   - Vérifications : 7 `<loc>`, et toute URL absolue d'image (OG, JSON-LD) servie en 200.
3. **Documentation** :
   - D1 à D3 marquées « résorbées → spec 003 » dans le tableau de dérogations de `specs/002-astro-upgrade/plan.md` ;
   - `.cursor/rules/context.mdc` : mode de sortie mis à jour ;
   - issue de suivi pour la révision des `widths` et `sizes` (R5, hors périmètre).
4. **Preview (checkpoint humain)** : déploiement de preview `*.workers.dev`, puis quickstart étape 3 : captures, poids, carte, Lighthouse alterné, `noindex`.
5. **Mise en production (checkpoint humain)** : merge sur `main`, déploiement Workers Builds, puis quickstart étape 4 : statuts, proxy `script.js`, `robots.txt` fusionné, sitemap, images OG, pas de `noindex`.

**Livraison** : une seule PR, avec un commit par palier (1 à 3), comme en 002. Pour revenir en arrière, on revert le merge.

## Risques et points d'attention

- **Rebase de l'epic `001-page-brasserie`** : il aura lieu sur `main`, **après** le merge de cette branche. Les conflits se résoudront donc côté epic, et cette PR n'est pas concernée :
  - conflit add/add sur `public/robots.txt` : l'epic pointe vers `/sitemap.xml`, qui n'existe pas ; on garde la version 003 ;
  - conflits de contexte probables dans `header.astro` (ajout du lien La Sibra, à côté de la ligne `pathname`) et dans `main.astro` (union `theme`) ;
  - La Sibra sera prérendue automatiquement grâce à `output: 'static'`, sans ajout de `prerender`.
  - À rappeler dans la description de la PR, pour préparer le rebase.
- **`robots.txt` géré par Cloudflare** : la zone sert aujourd'hui un *managed robots.txt* (content signals). Il faut vérifier en production que la fusion conserve la ligne `Sitemap:` du dépôt (R7).
- **Nouvelle URL de l'image OG** : elle passe de `/_image?…` à `/_astro/…`. Les réseaux sociaux qui ont gardé l'ancienne URL en cache la rafraîchiront au prochain partage. Aucune action nécessaire.
- **Premier build en CI** : un `TimeoutError` sur `Request.cf` est possible. Il est bénin. On ne passe à `prerenderEnvironment: 'node'` que s'il fait échouer un build (R9).

## Complexity Tracking

Aucune violation de la constitution à justifier. Cette évolution résorbe les dérogations D1, D2 et D3 de la spec 002.
