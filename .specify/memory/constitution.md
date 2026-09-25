<!--
Sync Impact Report
- Version change: (template, unversioned) → 1.0.0
- Modified principles: initial adoption — all 5 principles defined
  - I. Contenu d'abord, exactitude obligatoire
  - II. Statique et simple par défaut
  - III. Performance et SEO non négociables
  - IV. Accessibilité et responsive
  - V. Cohérence de la stack
- Added sections: Contraintes techniques; Workflow de développement; Governance
- Removed sections: none (template slots filled)
- Deferred items: none
-->

# Constitution du site vitrine Commun'ile

Commun'ile est une coopérative. Ce site (communile.fr) est sa vitrine publique :
il présente la coopérative, ses activités, ses lieux et ses actualités à un
public francophone.

## Core Principles

### I. Contenu d'abord, exactitude obligatoire

Le site existe pour informer. Toute information publiée (horaires, adresses,
contacts, tarifs, descriptions d'activités) DOIT être exacte et vérifiée avant
mise en ligne. Le contenu DOIT être rédigé en français correct, accents et
typographie compris. Aucun contenu factice (lorem ipsum, images de remplissage,
coordonnées inventées) ne DOIT atteindre la production.

Rationale : un site vitrine avec des informations fausses ou périmées nuit
directement à la coopérative et à ses visiteurs.

### II. Statique et simple par défaut

Chaque page DOIT être générée statiquement sauf besoin démontré du contraire.
Aucune base de données, aucun backend applicatif, aucun système d'authentification
ne DOIT être introduit sans justification écrite dans la spec correspondante.
Les dépendances ajoutées DOIVENT être justifiées par un besoin concret ; YAGNI
s'applique.

Rationale : un site vitrine n'a pas de logique métier serveur ; la simplicité
minimise les coûts d'hébergement, la surface d'attaque et la maintenance.

### III. Performance et SEO non négociables

Les pages DOIVENT rester légères : images optimisées (formats modernes,
dimensions adaptées), pas de JavaScript non nécessaire au rendu. Chaque page
publique DOIT exposer ses métadonnées SEO : title, description, données
structurées JSON-LD quand pertinent, et figurer dans le sitemap. Une régression
mesurable de performance (Lighthouse, poids de page) DOIT être corrigée avant
merge ou explicitement acceptée.

Rationale : la découvrabilité locale (recherche, cartes) est le principal canal
d'acquisition d'un site vitrine.

### IV. Accessibilité et responsive

Le site DOIT être utilisable sur mobile comme sur desktop. Le HTML DOIT être
sémantique : hiérarchie de titres cohérente, textes alternatifs sur les images
porteuses de sens, contrastes suffisants, navigation au clavier fonctionnelle.
Les cibles WCAG 2.1 niveau AA servent de référence pour arbitrer.

Rationale : le public d'une coopérative est large et varié ; l'accessibilité
est une exigence de service public de fait.

### V. Cohérence de la stack

La stack de référence est Astro 5, Tailwind CSS 4, TypeScript, pnpm, déployée
sur Cloudflare. Tout nouveau code DOIT suivre les conventions existantes du
dépôt (ESLint config @antfu, composants Astro, layouts partagés). Le build
(`pnpm build`, qui inclut `astro check`) et le lint (`pnpm lint`) DOIVENT
passer avant tout merge sur `main`.

Rationale : un projet maintenu par peu de personnes ne survit que si chaque
contribution reste lisible et homogène avec l'existant.

## Contraintes techniques

- Hébergement : Cloudflare (adapter `@astrojs/cloudflare`) ; toute alternative
  exige un amendement de cette constitution.
- Gestionnaire de paquets : pnpm ≥ 9, Node ≥ 21, conformément à `package.json`.
- Assets : stockés dans le dépôt (`public/`, `src/`) ; pas de CDN tiers pour
  les contenus propres à la coopérative.
- Vie privée : pas de traqueur tiers invasif ; l'analytics DOIT rester minimal
  et conforme au RGPD (pas de bannière de consentement requise de préférence).

## Workflow de développement

- Les évolutions significatives passent par le cycle Spec Kit :
  `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → implémentation.
- Les corrections mineures (typos, contenu, ajustements CSS) peuvent être
  commitées directement, en respectant le format Conventional Commits déjà en
  usage dans l'historique.
- Avant merge : build et lint verts (Principe V), relecture visuelle des pages
  touchées sur mobile et desktop (Principe IV).

## Governance

Cette constitution prime sur toute autre pratique du dépôt. Tout amendement
DOIT être effectué via `/speckit-constitution`, documenté dans le Sync Impact
Report, et versionné selon la sémantique suivante :

- MAJOR : suppression ou redéfinition incompatible d'un principe ;
- MINOR : ajout d'un principe ou d'une section, extension matérielle d'une
  règle existante ;
- PATCH : clarification, reformulation, correction sans changement de sens.

Les revues (specs, plans, PRs) DOIVENT vérifier la conformité aux principes ;
toute dérogation DOIT être justifiée par écrit dans l'artefact concerné.

**Version**: 1.0.0 | **Ratified**: 2026-09-01 | **Last Amended**: 2026-09-01
