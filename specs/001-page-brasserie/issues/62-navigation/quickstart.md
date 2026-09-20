# Quickstart : valider la découverte interne de La Sibra (issue #62)

**Date**: 2026-09-19 · **Contrat** : [contracts/navigation.md](./contracts/navigation.md)

Guide de validation de bout en bout. À exécuter sur la branche `001-page-brasserie-navigation`.

---

## Prérequis

- Node ≥ 21, dépendances déjà installées (`node_modules/` présent).
- ⚠️ **Ne pas utiliser `pnpm`** sur ce poste : il est cassé et dépose un `pnpm-workspace.yaml`
  parasite à la racine. Utiliser les binaires directs de `./node_modules/.bin/`.
- Un navigateur permettant de fixer la largeur de viewport à 375 px, 1280 px et 1536 px.

---

## Étape 0 — Point de référence « avant »

Les surfaces touchées sont en production : capturer l'état de départ permet de prouver l'absence de
régression plutôt que de l'affirmer.

```bash
git stash list                      # doit être propre
git switch 001-page-brasserie       # l'epic, état publié
./node_modules/.bin/astro dev --port 4331
```

Capturer, à 375 px et 1280 px : l'accueil (section « Nos lieux »), le header, le footer, la page
`/a-la-carte-postale`, et l'une des pages de lieux (par exemple `/le-bar-ile`). Puis revenir sur la
branche de travail.

---

## Étape 1 — Gates outillés

```bash
./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css   # sortie 0 exigée
./node_modules/.bin/astro check                          # 0 erreur
./node_modules/.bin/astro build                          # succès
```

Contrôle de contenu (C4.3, SC-005) :

```bash
grep -rn "dernier lieu" src/        # doit ne rien renvoyer
```

Contrôle de périmètre (C5.6, SC-007) :

```bash
git diff --stat 001-page-brasserie -- src/
# exactement 4 fichiers :
#   src/components/header.astro
#   src/components/footer.astro
#   src/features/home/sections/home-places-section.astro
#   src/features/la-carte-postale/sections/la-carte-postale-what-section.astro
```

Contrôle du gate coordonnées (C3.6, FR-016) :

```bash
grep -rnE "tel:|mailto:|06[ .]?33|bce\.brasserie" src/features/home src/components
# doit ne rien renvoyer
```

---

## Étape 2 — Navigation desktop à 1280 px (cas critique)

1. Lancer `./node_modules/.bin/astro dev --port 4331`, ouvrir `http://localhost:4331/`.
2. Fixer la largeur de viewport à **exactement 1280 px** — c'est le point de bascule `xl`, et le pire
   cas mesuré (research D1).
3. Vérifier : **7** entrées sur une seule ligne ; le logo « COMMUN'ÎLE » entièrement lisible ; aucun
   chevauchement entre le logo et « Qui sommes-nous ? » (C1.4).
4. Mesure objective (C1.5), dans la console du navigateur :

   ```js
   const ul = document.querySelector('header nav[aria-label="Navigation principale"] ul')
   const logo = ul.closest('div').parentElement.querySelector('a')
   console.log({
     entrees: ul.children.length, // attendu : 7
     largeurUl: ul.getBoundingClientRect().width, // attendu : ≤ 900
     logoTronque: logo.scrollWidth > logo.clientWidth, // attendu : false
   })
   ```

5. Élargir à **1536 px** : le padding des entrées revient à 16 px, le rendu redevient celui de la
   production (C1.6).
6. Aller sur `/la-sibra` : l'entrée « La Sibra » est marquée active (C1.3).

**Attendu** : `entrees: 7`, `largeurUl` ≈ 886 px, `logoTronque: false`.

---

## Étape 3 — Menu mobile à 375 px

1. Fixer la largeur à 375 px, recharger.
2. Ouvrir le menu : les **7** entrées sont listées, « La Sibra » en dernier (C1.8).
3. Faire défiler jusqu'à la dernière entrée — elle doit être atteignable (C1.11).
4. Parcourir au clavier (`Tab`) : les 7 entrées reçoivent le focus ; `Échap` referme (C1.10).
5. Cliquer « La Sibra » → arrivée sur `/la-sibra`.

---

## Étape 4 — Section « Nos lieux » de l'accueil

À 1280 px :

1. Compter **6** cartes ; La Sibra en dernier (C3.1).
2. Vérifier la grille : 3 rangées de 2, toutes de largeur identique, **aucune carte centrée ni à
   demi-largeur** (C3.8). C'est le point qui prouve le retrait de la classe de centrage de la carte
   À La Carte Postale.
3. Survoler la carte La Sibra : « Horaires d'ouverture », vendredi 16 h – 20 h, samedi 11 h – 20 h
   (C3.5), et rien d'autre (C3.6).
4. Cliquer → `/la-sibra` (C3.2).

À 375 px : les 6 cartes empilées sur une colonne, largeurs identiques (C3.9).

Contrôle du texte alternatif (C3.3) : inspecter l'image de la carte, l'attribut `alt` doit décrire ce
que montre la photo — l'intérieur de la boutique — et non répéter le seul nom du lieu.

---

## Étape 5 — Page À La Carte Postale

1. Ouvrir `http://localhost:4331/a-la-carte-postale`.
2. Dans la section « À La Carte Postale, c'est quoi ? », le dernier paragraphe doit se lire :
   « C'est le quatrième restaurant de la coopérative, une brique supplémentaire pour solidifier
   notre plaidoyer en faveur d'une alimentation plus végétale et locale ! » (C4.1).
3. Comparer à la capture de l'étape 0 : police, taille, graisse et largeur du paragraphe inchangées ;
   le reste de la page identique (C4.2, C4.4).

---

## Étape 6 — Non-régression sur les autres lieux

Ouvrir successivement, à 375 px et 1280 px :

- `/le-wattignies`
- `/les-landes-fertiles`
- `/le-labo-diva`
- `/le-bar-ile`
- `/a-la-carte-postale`

**Attendu** : aucune différence avec les captures de l'étape 0, hormis la 7ᵉ entrée du header et la
6ᵉ entrée du footer (C5.1).

Vérifier aussi que `/la-sibra` elle-même n'a pas bougé : cette issue ne touche pas son contenu.

---

## Étape 7 — Arrêt

Arrêter le serveur de dev et fermer les onglets ouverts pour la vérification.

```bash
git status --short     # le dépôt doit être propre, hors les fichiers de la feature
```

⚠️ Si un `pnpm-workspace.yaml` est apparu à la racine, c'est que `pnpm` a été invoqué : ne pas le
commiter.

---

## Critère de sortie

Les 7 étapes passent, les 3 gates outillés sont verts, `git diff --stat -- src/` compte exactement
4 fichiers, et `grep -rn "dernier lieu" src/` ne renvoie rien.
