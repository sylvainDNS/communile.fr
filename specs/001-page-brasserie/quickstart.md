# Quickstart : valider la page « La Sibra »

Guide de validation de bout en bout — pas d'implémentation ici (voir `tasks.md`).

## Prérequis

- Node ≥ 21, pnpm ≥ 9
- `pnpm install`

## Lancer et vérifier

```bash
pnpm dev          # http://localhost:4321
```

1. **Page du lieu** — ouvrir `http://localhost:4321/la-sibra` :
   - hero identifiant le lieu (« La Sibra », `h1` « De l'houblon à la pression », placeholder trois disques à la place du logo) : bulles en coins (rose haut-gauche, vert bas-droit, masquées < md), trois disques de la charte au centre, palette vert/rose/orange fidèle à la charte ([contracts/theme.md](./contracts/theme.md)) ;
   - sections dans l'ordre : what (accroche, présentation « anciennement Les Bières de Charlotte », paragraphe « de l'houblon à la pression », mention autres lieux + marchés des Landes Fertiles) → boutique (horaires **vendredi 16 h–20 h, samedi 11 h–20 h**, adresse) → bières (gamme + éphémères, focus Carlota, bloc « Où retrouver nos bières ? » : Le Wattignies, L'industrie, Ohmtown, Pioche, « et bien d'autres ») → tireuse (lien `tel:`) → infos pratiques (adresse + carte) → Instagram ;
   - pas de section avis ni FAQ ; les 3 photos affichées avec des `alt` FR descriptifs ;
   - mention + liens vers les autres lieux de la coopérative.
2. **Découverte (US5)** :
   - navigation desktop (≥ 1280 px) : 7 entrées sur une ligne, sans débordement ; page active soulignée ;
   - menu mobile : l'entrée apparaît et le lien fonctionne ;
   - accueil `http://localhost:4321/` : 6ᵉ `PlaceCard` en grille 2×3, horaires boutique au survol ;
   - footer : lien présent dans la colonne des lieux ;
   - `http://localhost:4321/a-la-carte-postale` : le paragraphe final dit « C'est le quatrième restaurant de la coopérative… » (plus « le dernier lieu né »).
3. **SEO** — vérifier ([contracts/page-et-seo.md](./contracts/page-et-seo.md)) :
   - `view-source:` → title « La Sibra », meta description (avec « anciennement Les Bières de Charlotte »), canonical, OG image, JSON-LD `Brewery` (`name` La Sibra, `alternateName` Les Bières de Charlotte) valide (tester sur https://validator.schema.org) ;
   - `http://localhost:4321/sitemap.xml` → les 8 pages publiques ; `robots.txt` → ligne `Sitemap:`.
4. **Responsive / a11y (FR-012)** :
   - DevTools 375 px : pas de scroll horizontal, horaires et listes de bières lisibles ;
   - parcours clavier complet (nav, liens, carte) ; contrastes AA selon le contrat thème : aucun texte courant blanc sur fond vert/rose brut, aucun texte blanc sur orange.

## Gates avant merge (constitution)

```bash
pnpm build        # inclut astro check — doit passer
pnpm lint         # doit passer
```

- Lighthouse (mobile) sur `/la-sibra` vs une page existante (ex. `/a-la-carte-postale`) : perf/a11y/SEO équivalents, poids de page du même ordre (SC-004).
- Relecture visuelle mobile + desktop des pages touchées (accueil, header/footer partout).

## Gate avant mise en ligne (SC-006)

- [ ] Téléphone, email et repères d'accès **confirmés par la coopérative** (FR-011) — issus de l'archive Wayback d'avril 2025 ; adresse et horaires déjà confirmés par le texte source du 2026-09-18.
- [ ] Marqueur de la carte vérifié visuellement au 121 rue du Général Buat.

## Résultats attendus

| Vérification | Attendu |
|---|---|
| `pnpm build` / `pnpm lint` | exit 0 |
| `/la-sibra` | 200, contenu complet, thème distinct |
| `/sitemap.xml` | XML valide, contient la nouvelle page |
| validator.schema.org | 0 erreur sur le JSON-LD `Brewery` |
| Lighthouse | pas de régression vs pages existantes |
