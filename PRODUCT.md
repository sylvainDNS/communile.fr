# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primaires : les client·es des lieux.** Habitant·es de Nantes et visiteurs de passage qui cherchent où manger, boire un coup, faire leur marché ou sortir. Ils arrivent souvent depuis une recherche locale ou une carte, sur mobile, avec une question pratique : c'est où, c'est ouvert quand, qu'est-ce qu'on y trouve.
- **Secondaires : partenaires et institutions.** Collectivités, financeurs, presse, producteurs et structures de l'ESS qui évaluent le sérieux et l'impact de la coopérative.
- Les futur·es sociétaires sont servi·es par le contenu existant (section SCIC, contact `gerance@communile.fr`) mais ne sont pas le public prioritaire confirmé.

## Product Purpose

communile.fr est le site vitrine de Commun'île, SCIC (société coopérative d'intérêt collectif) nantaise qui fait vivre un « archipel de(s) communs » : un réseau de lieux ouverts et conviviaux. Le site présente la coopérative, ses valeurs et chacun de ses lieux.

**Succès = le visiteur se déplace dans un lieu.** Il repart avec l'information pratique juste (adresse, horaires, offre) et vient. Comprendre le modèle coopératif soutient cette décision et sert les partenaires, sans passer devant.

## Positioning

- Un seul collectif derrière des lieux très différents : bistro, cantine, tiers-lieu social, ferme maraîchère, microbrasserie, café-cantine.
- Une chaîne intégrée « de la fourche à la fourchette » : la coopérative produit ses légumes bio (Les Landes Fertiles) et les cuisine dans ses restaurants ou les vend sur ses marchés paysans.
- Statut SCIC : 1 personne = 1 voix, réserves impartageables, gouvernance partagée entre salarié·es, usager·es, partenaires et collectivités.
- Promesse de prix juste et d'accessibilité : « le meilleur, au meilleur prix ».

## Operating Context

Toutes les activités sont à **Nantes**. Les lieux, chacun avec sa page :

| Lieu | Route | Nature |
|---|---|---|
| Le Wattignies | `/le-wattignies` | Tiers-lieu social : restaurant, bar, programmation culturelle, 12 structures résidentes de l'ESS, marchés |
| Le Labo Diva | `/le-labo-diva` | Cantine, marché de producteurs, café-bar, coworking, location d'espaces |
| Le Bar'Île | `/le-bar-ile` | Bistro de quartier : restaurant végétarien du midi, bar du soir avec programmation culturelle |
| À La Carte Postale | `/a-la-carte-postale` | Café-cantine |
| Les Landes Fertiles | `/les-landes-fertiles` | Ferme maraîchère bio de la coopérative, points de vente |
| La Sibra | `/la-sibra` | Microbrasserie du quartier Saint-Clément (ex-« Les Bières de Charlotte »), boutique, prêt de tireuse |

Plus : accueil `/` (lieux, concept, valeurs, SCIC, chiffres), `/contact`, `/404`.

Les visiteurs consultent surtout sur mobile, souvent en situation (dans la rue, avant de sortir). Instagram est le canal vivant de chaque lieu ; le site renvoie vers lui.

## Capabilities and Constraints

- Site statique Astro 5 + Tailwind CSS 4 + TypeScript strict, déployé sur Cloudflare, pnpm. Pas de backend, de base de données ni d'authentification sans justification écrite (constitution, principe II).
- Évolutions significatives via le cycle Spec Kit (`/speckit-specify` → `plan` → `tasks` → implémentation) ; constitution dans `.specify/memory/constitution.md`, qui prime.
- Build (`pnpm build`, inclut `astro check`) et lint (`pnpm lint`) verts avant merge sur `main`.
- SEO local non négociable : title, description, JSON-LD pertinent (`WebSite`, `Brewery`…), présence au sitemap.
- Analytics minimal (Plausible), conforme RGPD, sans bannière de consentement si possible ; pas de traqueur tiers invasif ; pas de CDN tiers pour les contenus de la coopérative.
- Contenu en français, avec écriture inclusive au point médian (client·e·s, salarié·es).
- **Dette de contenu connue** : les mentions erronées de Lille (accueil, page contact) ont été corrigées en Nantes le 2026-09-25. La page contact contient encore du contenu à confirmer par la coopérative : l'adresse de rue du Wattignies (absente du dépôt, donc non publiée), un téléphone factice « 03 20 XX XX XX » et des horaires d'ouverture génériques.
- **Non tranché** : notation des horaires (« 16 h – 20 h » sur La Sibra, « 16h00 - 20h00 » ailleurs).

## Brand Commitments

- Nom : **Commun'île** (apostrophe typographique `’`), signature « Archipel de(s) communs ».
- Une identité parapluie Commun'île, et **chaque lieu garde sa propre identité** (thème dédié via `data-theme`, logo propre). La charte de La Sibra est fournie par la coopérative et ses couleurs de base sont imposées (cf. `specs/001-page-brasserie/contracts/theme.md`).
- Voix chaleureuse, militante, familière (« boire un coup », « concert enjaillé », tutoiement ponctuel), jamais corporate.
- Valeurs affichées : convivialité, solidarité, inclusion, durabilité, ancrage local, accessibilité.

## Evidence on Hand

- Chiffres publiés sur l'accueil : +18 300 repas servis, 4,8/5 sur Google (+650 avis), 70 % de références bio et locales, +100 sociétaires, +200 événements par an, +55 000 personnes accueillies par an. À faire revérifier par la coopérative avant toute réutilisation ailleurs.
- Photos réelles des lieux et illustrations maison dans `src/features/*/images/` ; sources hors dépôt dans `brasserie-assets/`.
- Logos de chaque lieu (`*-hero-logo.webp`) et ornements SVG par lieu.
- Aucun témoignage, cas client ou article de presse dans le dépôt : ne pas en inventer.
- La Sibra : téléphone et email non confirmés, volontairement non publiés.

## Product Principles

1. **L'info pratique d'abord.** Adresse, horaires et offre de chaque lieu doivent être trouvables en quelques secondes sur mobile ; tout le reste vient après.
2. **Exact ou absent.** Une information non vérifiée ne se publie pas ; mieux vaut un manque assumé qu'un horaire faux.
3. **Un archipel, pas une chaîne.** Chaque lieu a sa personnalité ; le fil commun est le projet coopératif, pas l'uniformité.
4. **Le projet se prouve par les faits.** Le modèle coopératif se montre par ce qui existe (la ferme, les marchés, les chiffres, les lieux), pas par des slogans.
5. **Léger et découvrable.** Statique, rapide, bien référencé localement : la recherche et la carte sont le premier canal.

## Accessibility & Inclusion

WCAG 2.1 AA comme référence d'arbitrage (constitution, principe IV) : HTML sémantique, hiérarchie de titres cohérente, textes alternatifs descriptifs, navigation clavier, contrastes mesurés (pas estimés). Public large et varié, lieux inclusifs par vocation. Dette connue : non-conformités de contraste sur plusieurs pages de lieux (variantes `yellow`/`red` de `Tag`/`Badge`) et focusables sous `aria-hidden` sur 3 pages ; `/la-sibra` et `/contact` sont conformes.
