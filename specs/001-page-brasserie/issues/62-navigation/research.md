# Research: Découverte interne de La Sibra (issue #62)

**Date**: 2026-09-19 · **Spec**: [spec.md](./spec.md)

Ce document ne reprend pas les décisions déjà prises au niveau de l'epic (`specs/001-page-brasserie/research.md`,
notamment R1 nommage, R7 navigation, R8 grille des lieux, R10 mise à jour Carte Postale). Il consigne
uniquement les points tranchés **au moment de planifier cette issue**, dont un qui contredit
partiellement l'hypothèse de R7.

---

## D1. La navigation desktop à 7 entrées **déborde** à 1280 px — R7 invalidé sur ce point

**Statut** : mesuré dans le navigateur avant écriture du plan, pas supposé.

**Constat**. R7 de l'epic estimait « le risque de débordement de la nav desktop à 7 entrées au
breakpoint `xl` est faible » du fait du libellé court « La Sibra » (8 caractères). La mesure montre
l'inverse : le débordement est **certain** à 1280 px, et la marge était déjà nulle à 6 entrées.

Mesures à 1280 px de large sur `/` (Chrome, police du site chargée) :

| État | Largeur du `<ul>` | Colonnes de la grille du header | Logo tronqué ? |
|------|-------------------|--------------------------------|----------------|
| 6 entrées (production) | 903,3 px | `156,36px 903,27px 156,37px` | limite : colonne 156,36 px pour un contenu de 158 px |
| 7 entrées (`px-4`) | 998,2 px | `118,08px 998,17px 99,75px` | **oui** — `clientWidth` 118 px pour `scrollWidth` 158 px |

Le header est une grille `xl:grid-cols-[1fr_auto_1fr]` : la colonne centrale (la nav) est en `auto`
et se sert en premier ; les deux colonnes `1fr` se partagent le reste, avec un plancher à leur
`min-content`. À 7 entrées, la nav consomme 998 px des 1216 px disponibles, il ne reste que 118 px
pour le logo dont la largeur naturelle est 158 px. Le logo « COMMUN'ÎLE » **chevauche visuellement**
la première entrée « Qui sommes-nous ? » (constaté par capture d'écran).

Point notable : à 6 entrées la colonne du logo vaut 156,36 px pour un contenu de 158 px — la
production est **déjà** à 2 px du débordement à exactement 1280 px. L'ajout de la 7ᵉ entrée ne crée
pas la fragilité, il la révèle.

**Decision**. Réduire le padding horizontal des entrées de la **navigation desktop uniquement**, de
`px-4` (16 px) à `px-2` (8 px), et restaurer `px-4` à partir de `2xl` (1536 px) où la place ne manque
plus : `class="px-2 2xl:px-4"` passé au `NavLink` de la nav desktop.

**Rationale**. C'est exactement le levier prévu par R7 (« sinon réduire `gap`/padding des
`NavLink` »), appliqué au minimum nécessaire. Le calibrage a été mesuré, pas deviné — condition à
satisfaire : `(1216 − largeur_ul) / 2 ≥ 158 px`, soit `largeur_ul ≤ 900 px`.

| Padding | Largeur du `<ul>` | Colonne logo | Logo tronqué ? |
|---------|-------------------|--------------|----------------|
| `px-4` (16 px) | 998,2 px | 118,1 px | oui |
| `px-3` (12 px) | 942,2 px | 136,9 px | oui |
| `px-2.5` (10 px) | 914,2 px | 150,9 px | oui |
| **`px-2` (8 px)** | **886,2 px** | **164,9 px** | **non** |
| `px-1.5` (6 px) | 858,2 px | 178,9 px | non |

`px-2` est la **première valeur qui passe** ; on ne descend pas plus bas que nécessaire. Vérifié par
capture d'écran à 1280 px : sept entrées sur une ligne, logo entier, pastille d'état actif toujours
lisible.

Le palier `2xl:px-4` rétablit le rendu de production sur les grands écrans : à 1536 px, la nav en
`px-4` laisse 236,9 px à la colonne du logo, très au-dessus des 158 px requis. Seule la bande
1280–1535 px est donc resserrée.

**Alternatives considered** :
- *Réduire le `gap-0.5`* (2 px) de la liste : 6 intervalles × 2 px = 12 px récupérés, insuffisant
  seul et insuffisant même combiné à `px-2.5` (il faudrait 1282 px de large pour passer). Rejeté.
- *Réduire la taille de police des entrées* : touche la lisibilité et l'échelle typographique du
  site pour un gain équivalent. Rejeté au profit du levier explicitement prévu par R7.
- *Raccourcir le libellé en « La Brasserie »* (dernier recours de R7) : plus court de peu, et
  contredit la décision de nommage R1/R11 (« La Sibra » est le nom du lieu). Rejeté — inutile
  puisque le levier padding suffit.
- *Modifier la grille `1fr_auto_1fr` du header* (colonnes asymétriques, nav non centrée) : refonte
  de la composition du header, sur des pages en production, hors périmètre et disproportionnée.
  Rejeté.
- *Appliquer `px-2` au composant `NavLink` lui-même* : le composant sert aussi au menu mobile, où
  la contrainte n'existe pas et où des cibles tactiles plus petites seraient une régression
  d'accessibilité. Rejeté au profit d'une classe passée au seul appel desktop.

**Conséquence pour l'epic** : R7 est factuellement démenti sur l'estimation du risque. À signaler
dans le rapport de PR ; la correction du texte de `specs/001-page-brasserie/research.md` est hors
périmètre de cette issue.

---

## D2. `px-2` passé en `class` et non en modification du composant `NavLink`

**Decision**. Passer `class="px-2 2xl:px-4"` au `NavLink` de la nav desktop dans `header.astro`, sans
toucher à `src/components/nav-link.astro`.

**Rationale**. `NavLink` utilise `cn()` = `twMerge(clsx(...))` : `twMerge` résout le conflit entre le
`px-4` de base et le `px-2` de la classe passée en gardant le second, et conserve `2xl:px-4` qui est
une variante distincte. Le comportement est donc celui attendu sans modifier le composant. Les deux
listes du header (desktop et mobile) partagent le tableau `links` mais sont deux rendus distincts :
seule celle de la nav desktop reçoit la classe, le menu mobile garde ses cibles tactiles en `px-4`.

**Alternatives considered** : modifier le `px-4` de base de `NavLink` (rejeté : affecte le menu
mobile, cf. D1) ; ajouter une prop `size` au composant (rejeté : YAGNI, un seul appelant).

---

## D3. Horaires de la carte d'accueil recopiés, non factorisés

**Decision**. Écrire les horaires de la boutique en clair dans le contenu de survol de la 6ᵉ carte,
comme le font les cinq cartes existantes, plutôt que de les importer depuis
`sibra-boutique-section.astro`. (Pour la **notation** retenue, voir D8.)

**Rationale**. Les cinq cartes en production portent chacune leurs horaires en clair. Introduire une
source partagée pour la seule 6ᵉ carte créerait une asymétrie et supposerait d'extraire une donnée
depuis un composant de section — un refactoring sur du code publié, interdit par FR-017. La
duplication est assumée et cohérente avec l'existant.

**Alternatives considered** : extraire les horaires dans `src/utils/constants.ts` et les consommer
des deux côtés (rejeté : refactoring hors périmètre ; à reconsidérer globalement pour les six lieux,
hors de cette issue).

**Dette signalée** : les horaires de la boutique existent désormais à deux endroits
(`sibra-boutique-section.astro` et `home-places-section.astro`). Toute correction future devra
toucher les deux. À mentionner dans le rapport de PR.

---

## D4. Forme du contenu de survol : aligner sur les cartes `<span>`, pas sur la carte `<p>`

**Decision**. Utiliser la forme majoritaire — `<span class="text-2xl font-bold">Horaires
d'ouverture</span>` puis `<span class="font-medium">…</span>` — comme les cartes Landes Fertiles,
Labo Diva, Bar'Île et Carte Postale.

**Rationale**. La carte Le Wattignies est la seule à utiliser `<p>` ; quatre cartes sur cinq
utilisent `<span>`. On suit la majorité. Harmoniser la carte Wattignies serait un changement
cosmétique sur du code publié, non demandé — hors périmètre (FR-012, FR-017).

---

## D5. Teinte de l'étiquette : `green`, sans ajout de teinte dédiée

**Decision**. `tagColor="green"`, teinte déjà supportée par le composant `Tag`.

**Rationale**. Demandé par l'issue et par R8 (rappel du vert de la charte de la brasserie). Cette
combinaison — texte `text-watt-green` sur dégradé `green-100` — est **déjà en production** sur la
carte du Labo Diva : son contraste est celui d'un usage existant, cette issue n'introduit donc aucun
risque de contraste nouveau. R8 précise explicitement que l'ajout d'une teinte dédiée à `Tag` est
« optionnel et non requis » ; l'ajouter serait une modification d'un composant partagé, hors
périmètre.

**Note de vigilance** : les teintes `primary` / `tertiary` de `Tag` sont connues pour être en deçà de
l'AA (≈ 2,5:1 et ≈ 1,8:1) ; elles ne sont pas utilisées ici. Les teintes `blue|green|red|yellow`
relèvent d'une autre échelle (`watt-*`) et sont celles en usage sur les cinq cartes existantes.

---

## D6. Le retrait de la classe de centrage ne touche rien d'autre

**Decision**. Retirer exactement `md:mx-auto md:col-span-2 md:w-1/2` de la `PlaceCard` À La Carte
Postale ; l'attribut `class` disparaît entièrement puisqu'il ne contenait que ces trois classes.

**Rationale**. Ces classes n'existaient que pour centrer une 5ᵉ carte orpheline dans une grille à
deux colonnes (R8). Avec six cartes, elles produiraient une dernière rangée déséquilibrée. Aucune
autre carte ne porte de classe : après retrait, les six appels sont homogènes.

**Vérification associée** : la grille parente (`col-span-2 grid grid-cols-1 gap-3 md:grid-cols-2`)
n'est pas modifiée — le nombre de colonnes reste 2 en desktop (Non-Goal explicite de la spec).

---

## D7. Aucune coordonnée introduite

**Decision**. Le contenu de survol de la carte ne comporte que les horaires ; aucun téléphone,
aucune adresse e-mail, aucun lien `tel:` ou `mailto:`, et aucun bouton de substitution.

**Rationale**. FR-016 et gate #67 : téléphone et e-mail proviennent d'une archive Wayback et ne sont
pas confirmés ; la constitution (principe I) interdit de publier une information non vérifiée. Les
issues #61 et #65 ont tranché de la même façon, et sans faux bouton pour compenser l'absence.
L'adresse postale (121 rue du Général Buat) est confirmée mais n'a pas sa place dans le survol d'une
carte, dont le contenu est uniformément « horaires » sur les cinq cartes existantes.

---

## D8. Notation horaire de la carte : celle des cinq cartes voisines, pas celle de la page Sibra

**Statut** : décision **révisée en revue**. Le premier jet reprenait la notation de la page Sibra
(`16 h – 20 h`) ; la relecture du fichier a montré que la carte serait alors la seule des six à ne
pas suivre la convention de la grille.

**Constat**. Les cinq cartes existantes de `home-places-section.astro` écrivent toutes leurs
horaires en `HHhMM`, séparés par un trait d'union : « 10h00 - 23h00 », « 12h00 - 22h00 »,
« 10h00 - 14h00 ». La page de la brasserie (`sibra-boutique-section.astro`, livrée en #61) emploie
en revanche « 16 h – 20 h », avec espaces fines et tiret demi-cadratin.

**Decision**. Sur la carte d'accueil, écrire « 16h00 - 20h00 » et « 11h00 - 20h00 » — la convention
**de la surface éditée**. La page Sibra conserve sa propre notation, qui n'est pas modifiée.

**Rationale**. Les deux surfaces ont des registres typographiques distincts et établis. Un visiteur
survole les six cartes d'affilée sur une même grille : l'écart y est directement perceptible. Il
compare en revanche rarement le survol d'une carte au tableau d'horaires d'une page de lieu. La
règle habituelle — suivre la convention locale du fichier que l'on édite — tranche donc en faveur
des cinq voisines, et c'est aussi ce que demandait la formulation de la spec (« dans la même forme
que les autres cartes »). **La donnée est identique dans les deux cas** ; seule la notation diffère,
et aucune des deux n'est fausse.

**Alternatives considered** :
- *Garder « 16 h – 20 h » sur la carte* (premier jet) : typographiquement plus correct en français
  et aligné sur la page Sibra, mais fait de la 6ᵉ carte la seule dissidente de la grille. Rejeté.
- *Harmoniser les cinq cartes existantes sur « 16 h – 20 h »* : ce serait la solution de fond, mais
  c'est une retouche cosmétique de cinq blocs de code **en production**, non demandée, et
  frontalement contraire à FR-017. Rejeté — signalé comme piste pour #66 (polish).
- *Aligner la page Sibra sur `HHhMM`* : modifierait un fichier hors des 4 du périmètre. Rejeté.

**À valider par l'humain** : si la coopérative préfère la typographie « 16 h – 20 h » partout, c'est
la grille entière qu'il faut harmoniser, dans #66 — pas cette seule carte.
