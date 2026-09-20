# Implementation Plan: Découverte interne de La Sibra (issue #62)

**Branch**: `001-page-brasserie-navigation` | **Date**: 2026-09-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-page-brasserie/issues/62-navigation/spec.md`

## Summary

Ouvrir les trois chemins d'accès internes vers `/la-sibra` — navigation principale, pied de page,
section « Nos lieux » de l'accueil — et corriger le paragraphe devenu faux de la page À La Carte
Postale. Toutes les surfaces sont en production : l'approche est la modification minimale, un
périmètre fermé de quatre fichiers, et une vérification navigateur avant/après sur chaque surface.

Un point a été tranché par la mesure avant d'écrire ce plan : contrairement à l'hypothèse R7 de
l'epic, la nav desktop à 7 entrées **déborde** à 1280 px — le logo chevauche la première entrée. Le
levier de repli prévu par R7 est appliqué et calibré au minimum : `px-2` sur les entrées de la nav
desktop dans la bande 1280–1535 px, `px-4` restauré à partir de `2xl`. Détail et mesures dans
[research.md](./research.md) (D1).

## Technical Context

**Language/Version**: TypeScript 5, Astro 5 (composants `.astro`, rendu statique)

**Primary Dependencies**: Astro 5, Tailwind CSS 4, `astro:assets` (`<Image />`), `tailwind-merge` +
`clsx` via `cn()`

**Storage**: N/A — site statique, aucun état persisté

**Testing**: aucun harnais de test automatisé dans le dépôt. Les gates sont `astro check`,
`astro build`, ESLint (config @antfu) et la **vérification visuelle navigateur** exigée par la
constitution (principe IV) et par le workflow de l'epic.

**Target Platform**: navigateurs web modernes, mobile et desktop ; déploiement Cloudflare

**Project Type**: site vitrine statique (Astro), pages générées au build

**Performance Goals**: aucune régression de poids de page. La seule ressource ajoutée est
`la-sibra-card.webp`, déjà présente dans le dépôt depuis #59 et servie en `loading="lazy"` avec
`widths`/`sizes` par `PlaceCard`, exactement comme les cinq cartes existantes.

**Constraints**:
- Périmètre fermé : **4 fichiers** du site modifiés, pas un de plus (SC-007, FR-017).
- Aucun téléphone ni e-mail (FR-016, gate #67).
- Zéro régression sur les 5 autres lieux et sur l'accueil (FR-018, SC-006).
- Vérification visuelle obligatoire à 375 px et ≥ 1280 px, avant/après.

**Scale/Scope**: 4 fichiers de contenu/composant modifiés, ~25 lignes ajoutées, 1 ligne supprimée,
1 paragraphe réécrit. 8 pages publiques affectées par le header et le footer.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Évaluation | Verdict |
|----------|-----------|---------|
| **I — Contenu d'abord, exactitude obligatoire** | Le cœur de T018b est précisément une correction d'exactitude imposée par ce principe : la Carte Postale ne peut rester « le dernier lieu né » une fois La Sibra publiée. Les horaires repris sont ceux déjà publiés en #61. FR-016 interdit toute coordonnée non confirmée. Textes en français, typographie et accents soignés. | ✅ Conforme — le principe **motive** la tâche |
| **II — Statique et simple par défaut** | Aucune dépendance ajoutée, aucun backend, aucun état. Les ajouts réutilisent des composants existants (`NavLink`, `Link`, `PlaceCard`). L'option « composant de navigation générique » a été écartée (YAGNI, D2). | ✅ Conforme |
| **III — Performance et SEO non négociables** | Aucun nouvel asset (l'image existe depuis #59), aucun JavaScript ajouté. Le maillage interne créé (nav + footer + carte) **améliore** le SEO de `/la-sibra`. Les métadonnées et le sitemap de la page relèvent de #63, hors périmètre. | ✅ Conforme |
| **IV — Accessibilité et responsive** | Texte alternatif FR descriptif sur la nouvelle image (FR-008). HTML sémantique inchangé : la 7ᵉ entrée est un `<li>` de la liste existante, l'entrée de footer un `<li>` de la liste existante. `aria-current` géré par `NavLink`. Navigation clavier du menu mobile à vérifier avec 7 entrées (FR-005). `px-2` n'est appliqué **qu'à la nav desktop** pour ne pas réduire les cibles tactiles du menu mobile (D2). Vérification aux deux largeurs exigée. | ✅ Conforme — sous réserve des vérifications listées en Phase 2 |
| **V — Cohérence de la stack** | Aucun écart de stack. Conventions du dépôt suivies : `PATH.*`, imports `@/`, `cn()`, `PlaceCard`. ESLint + `astro check` + `astro build` verts exigés avant PR. Conventional Commits. | ✅ Conforme |

**Verdict Phase 0** : aucun écart. Aucune entrée dans Complexity Tracking.

**Re-check post-Phase 1** : la conception confirme les cinq verdicts. Le seul point qui aurait pu
créer un écart — la réduction du padding des entrées de nav, qui touche un rendu partagé par les 8
pages — est circonscrit à la nav desktop, calibré sur mesure, réversible au-delà de `2xl`, et reste
dans la lettre de R7. Les cibles tactiles du menu mobile sont préservées. Aucun compromis
d'accessibilité.

> **Écart documenté vis-à-vis d'un artefact de l'epic** : `research.md` R7 de l'epic estime le risque
> de débordement « faible » ; la mesure le contredit (D1). Cette issue applique le repli que R7
> prévoyait, donc sans dérogation à la décision — seule l'estimation du risque était fausse. Signalé
> dans le rapport de PR ; la correction du texte de l'epic est hors périmètre.

## Project Structure

### Documentation (this feature)

```text
specs/001-page-brasserie/issues/62-navigation/
├── spec.md                  # Phase -1 (/speckit-specify)
├── plan.md                  # Ce fichier (/speckit-plan)
├── research.md              # Phase 0 — D1..D7, dont la mesure qui invalide R7
├── data-model.md            # Phase 1 — entrée de nav, entrée de footer, carte de lieu
├── quickstart.md            # Phase 1 — scénarios de validation
├── contracts/
│   └── navigation.md        # Phase 1 — contrat des 3 surfaces de découverte
├── checklists/
│   └── requirements.md      # Qualité de la spec
└── tasks.md                 # Phase 2 (/speckit-tasks — pas créé ici)
```

### Source Code (repository root)

Les quatre fichiers du site modifiés, et eux seuls :

```text
src/
├── components/
│   ├── header.astro                     # MODIFIÉ — T016 : 7ᵉ entrée + px-2 2xl:px-4 sur la nav desktop
│   └── footer.astro                     # MODIFIÉ — T017 : <li> La Sibra dans la colonne des lieux
└── features/
    ├── home/
    │   ├── images/la-sibra-card.webp     # inchangé — livré par #59, seulement importé
    │   └── sections/
    │       └── home-places-section.astro # MODIFIÉ — T018 : 6ᵉ PlaceCard + retrait du centrage
    └── la-carte-postale/
        └── sections/
            └── la-carte-postale-what-section.astro  # MODIFIÉ — T018b : « quatrième restaurant »
```

Fichiers **lus mais non modifiés** (référence) : `src/utils/constants.ts` (`PATH.LA_SIBRA`, existant
depuis #59), `src/components/nav-link.astro`, `src/components/place-card.astro`,
`src/components/tag.astro`, `src/features/sibra/sections/sibra-boutique-section.astro` (source des
horaires).

**Structure Decision**: aucune nouvelle structure. Le dépôt organise les sections par lieu sous
`src/features/<lieu>/sections/` et les composants partagés sous `src/components/`. Cette issue ne
crée aucun fichier de code : elle ajoute des entrées dans des structures de données et du balisage
existants. C'est précisément l'objectif — le périmètre fermé de FR-017 se lit directement dans
l'arborescence ci-dessus.

## Phase 2 — Vérifications exigées avant PR

Ces vérifications ne sont pas optionnelles : trois des quatre fichiers touchés sont rendus sur des
pages déjà publiques.

**Gates outillés** (binaires directs — `pnpm` est cassé sur ce poste et sème un `pnpm-workspace.yaml`
parasite ; ne pas l'utiliser) :

1. `./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css` → sortie 0 exigée
2. `./node_modules/.bin/astro check` → 0 erreur
3. `./node_modules/.bin/astro build` → succès
4. `grep -rn "dernier lieu" src/` → **zéro** résultat (SC-005)

**Vérification navigateur** — à 375 px et à 1280 px (1280 est le cas critique : c'est exactement le
point de bascule `xl`, cf. D1) :

| Surface | À vérifier |
|---------|-----------|
| Header desktop (1280 px) | 7 entrées sur une ligne, logo entier, aucun chevauchement, état actif correct sur `/la-sibra` |
| Header desktop (≥ 1536 px) | retour au padding `px-4`, rendu identique à la production |
| Menu mobile (375 px) | ouverture/fermeture, 7 entrées atteignables, défilement, `Échap`, navigation clavier |
| Footer | « La Sibra » en 6ᵉ position de la colonne des lieux, lien correct |
| Accueil — section lieux (1280 px) | grille 2×3 régulière, aucune carte centrée ni de largeur différente |
| Accueil — section lieux (375 px) | 6 cartes empilées, largeurs identiques |
| Survol de la carte La Sibra | horaires affichés, même forme que les autres cartes |
| Page À La Carte Postale | paragraphe « quatrième restaurant », mise en forme inchangée |
| **Non-régression** | les 5 autres pages de lieux s'affichent sans différence hors header/footer |

## Complexity Tracking

> Aucune violation de la Constitution Check à justifier — section laissée vide intentionnellement.
