# Quickstart : valider la mise à jour

Procédure rejouée **à la fin de chaque palier** ([plan.md](./plan.md#paliers-dimplémentation)). Elle prouve le respect du [contrat de surface publique](./contracts/public-surface.md).

## Prérequis

- Node ≥ 24.16 (`node -v`), pnpm 12 (`pnpm -v`)
- Accès au compte Cloudflare, pour les checkpoints humains des paliers A et 6
- Chrome DevTools MCP ou `npx lighthouse`, pour les audits
- Dossier de travail non versionné `tmp/astro-upgrade/`. Il est déjà ignoré par ESLint ; ne pas le committer.

## 0. Capturer la référence (une seule fois, avant toute modification)

Sur la production actuelle `https://communile.fr`, pour chacune des 8 routes du contrat :

1. **HTML** : `curl -s https://communile.fr<route>` → `tmp/astro-upgrade/baseline/html/<slug>.html`
2. **En-têtes** : `curl -sI` sur la page, sur un asset `/_astro/*` et sur `/favicon.ico` → `…/headers/`
3. **Captures** : pleine page à 390 px et à 1440 px de large → `…/screens/`
4. **Lighthouse** (mobile) : scores perf, a11y, SEO et poids total transféré → `…/lighthouse.json`
5. **Statut** : noter le statut HTTP de `/nexiste-pas` et le comportement de `/contact/` (slash final).

## 1. Contrôles statiques (à chaque palier)

```bash
pnpm install --frozen-lockfile   # après mise à jour du lockfile
pnpm build                       # astro check + astro build : 0 erreur
pnpm lint                        # 0 erreur
pnpm outdated                    # palier final : seul typescript (6 vs 7) apparaît dans le périmètre
```

Attendu : aucune erreur. Un avertissement de dépréciation est toléré seulement s'il est listé dans research.md (R4).

## 2. Parité locale (à chaque palier)

1. `pnpm preview` : le site tourne dans workerd à partir des paliers A et B.
2. Récupérer le HTML des 8 routes en local, puis le comparer à la référence après normalisation :
   - remplacer les empreintes `_astro/<nom>.<hash>.<ext>` par `_astro/<nom>.<ext>` ;
   - reformater les deux côtés avec le même formateur HTML ;
   - retirer le bloc Plausible, absent hors production (`import.meta.env.PROD`).
3. **Attendu** : diff vide, ou seulement des écarts expliqués (sérialisation CSS de Tailwind 4.3, R9). Tout écart de texte, de balisage ou d'imbrication est une régression à corriger (R6, R7).
4. **Cas témoin des espaces blancs** : sur `/a-la-carte-postale`, la FAQ doit afficher « programmation sur Instagram », avec l'espace.
5. **Interactions** : carte Leaflet (zoom, marqueur) sur une page lieu, animations au scroll sur `/`, menu mobile du header, ouverture et fermeture des `details` de la FAQ.

## 3. Parité sur Cloudflare (paliers A à D, sur `*.workers.dev`)

1. Rejouer le point 2 sur l'URL de preview du Worker.
2. **Captures** 390 px et 1440 px à comparer visuellement à la référence. Attendu : aucune différence perceptible (SC-001).
3. **Lighthouse** : chaque score ≥ référence − 2 pts (SC-004) ; poids transféré ≤ référence × 1,05 (SC-003).
4. **En-têtes** : `X-Robots-Tag: noindex` présent sur les assets de preview ; CORS identique.
5. **Ressources** : aucun binding `IMAGES` ni `SESSION` créé sur le Worker (dashboard → Worker → Bindings) (R5, R8).

## 4. Mise en production (palier 6)

0. **Avant la bascule** : dans le dashboard, vérifier que le Worker proxy Plausible est attaché en **route** `communile.fr/mix/load/*`, et non en Custom Domain.
1. **Bascule par route** : ajouter la route Worker `communile.fr/*` sans toucher au domaine Pages. Vérifier que le HTML servi référence les `_astro/*.<hash>` du build Worker. Si la route ne prend pas le pas sur Pages, se replier sur un détachement et un rattachement en Custom Domain à très faible trafic (tasks T046).
2. Rejouer les points 3.1 à 3.4 sur `https://communile.fr`, en vérifiant l'**absence** de `noindex`.
3. **Plausible** : un pageview de test apparaît dans le tableau de bord ; `/mix/load/script.js` répond 200.
4. **Retour arrière** si écart : supprimer la route. C'est instantané, et Pages sert de nouveau le domaine.
5. **À froid**, après observation : passer en Custom Domain, retirer la route, rejouer les points 2 et 3, puis supprimer Pages (tasks T048).

## Critère de fin

Tous les points ci-dessus sont verts sur la production. Il reste alors à supprimer le projet Pages, puis à cocher SC-001 à SC-006 dans la PR.
