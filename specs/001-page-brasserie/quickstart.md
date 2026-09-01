# Quickstart : valider la page « Les Bières de Charlotte »

Guide de validation de bout en bout — pas d'implémentation ici (voir `tasks.md`).

## Prérequis

- Node ≥ 21, pnpm ≥ 9
- `pnpm install`

## Lancer et vérifier

```bash
pnpm dev          # http://localhost:4321
```

1. **Page du lieu** — ouvrir `http://localhost:4321/les-bieres-de-charlotte` :
   - hero identifiant le lieu, palette ambre/cuivre visible ([contracts/theme.md](./contracts/theme.md)) ;
   - sections dans l'ordre : what → boutique (horaires **vendredi 16 h–20 h, samedi 11 h–20 h**) → bières (gamme + éphémères, focus Carlota) → tireuse (lien `tel:`) → infos pratiques (adresse + carte) → Instagram ;
   - pas de section avis ni FAQ ; les 3 photos affichées avec des `alt` FR descriptifs ;
   - mention + liens vers les autres lieux de la coopérative.
2. **Découverte (US5)** :
   - navigation desktop (≥ 1280 px) : 7 entrées sur une ligne, sans débordement ; page active soulignée ;
   - menu mobile : l'entrée apparaît et le lien fonctionne ;
   - accueil `http://localhost:4321/` : 6ᵉ `PlaceCard` en grille 2×3, horaires boutique au survol ;
   - footer : lien présent dans la colonne des lieux.
3. **SEO** — vérifier ([contracts/page-et-seo.md](./contracts/page-et-seo.md)) :
   - `view-source:` → title, meta description, canonical, OG image, JSON-LD `Brewery` valide (tester sur https://validator.schema.org) ;
   - `http://localhost:4321/sitemap.xml` → les 8 pages publiques ; `robots.txt` → ligne `Sitemap:`.
4. **Responsive / a11y (FR-012)** :
   - DevTools 375 px : pas de scroll horizontal, horaires et listes de bières lisibles ;
   - parcours clavier complet (nav, liens, carte) ; contrastes AA sur les fonds thémés.

## Gates avant merge (constitution)

```bash
pnpm build        # inclut astro check — doit passer
pnpm lint         # doit passer
```

- Lighthouse (mobile) sur `/les-bieres-de-charlotte` vs une page existante (ex. `/a-la-carte-postale`) : perf/a11y/SEO équivalents, poids de page du même ordre (SC-004).
- Relecture visuelle mobile + desktop des pages touchées (accueil, header/footer partout).

## Gate avant mise en ligne (SC-006)

- [ ] Adresse, téléphone, email, horaires **confirmés par la coopérative** (FR-011) — coordonnées issues de l'archive Wayback d'avril 2025.
- [ ] Marqueur de la carte vérifié visuellement au 121 rue du Général Buat.

## Résultats attendus

| Vérification | Attendu |
|---|---|
| `pnpm build` / `pnpm lint` | exit 0 |
| `/les-bieres-de-charlotte` | 200, contenu complet, thème distinct |
| `/sitemap.xml` | XML valide, contient la nouvelle page |
| validator.schema.org | 0 erreur sur le JSON-LD `Brewery` |
| Lighthouse | pas de régression vs pages existantes |
