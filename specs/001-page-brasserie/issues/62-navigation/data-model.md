# Data Model: Découverte interne de La Sibra (issue #62)

**Date**: 2026-09-19 · **Spec**: [spec.md](./spec.md) · **Research**: [research.md](./research.md)

Cette issue n'introduit aucune entité nouvelle. Elle ajoute **une instance** à trois collections
existantes et corrige **une chaîne de caractères**. Ce document décrit ces collections telles
qu'elles sont, et les valeurs exactes à y ajouter.

---

## 1. Entrée de navigation (`links` de `header.astro`)

Tableau littéral défini dans le frontmatter de `src/components/header.astro`, consommé **deux fois**
dans le même fichier : par la nav desktop (`xl:block`) et par le menu mobile (`xl:hidden`). Une
seule source, deux rendus — c'est ce qui garantit FR-002 sans effort.

| Champ | Type | Règle |
|-------|------|-------|
| `label` | `string` | Nom affiché du lieu, sans article ajouté ni abréviation |
| `href` | `string` | Toujours une constante `PATH.*`, jamais une chaîne littérale |

**Instance ajoutée** — en **dernière position**, après `À La Carte Postale` :

```text
{
  label: 'La Sibra',
  href: PATH.LA_SIBRA,
}
```

`PATH.LA_SIBRA` vaut `/la-sibra` et existe déjà (`src/utils/constants.ts`, livré par #59).

**État actif** : dérivé, non stocké. `header.astro` calcule `pathname` depuis l'URL de la requête et
passe `active={pathname === link.href}` ; `NavLink` en tire `aria-current="page"`. La nouvelle entrée
hérite de ce mécanisme sans code supplémentaire (FR-003).

**Invariant d'ordre** : l'ordre du tableau est l'ordre d'affichage, dans les deux rendus. Les six
entrées existantes ne changent pas de position.

**Contrainte de rendu ajoutée par cette issue** (D1) : le rendu desktop reçoit
`class="px-2 2xl:px-4"` sur son `NavLink`. C'est une propriété du **rendu desktop**, pas de la donnée
— le menu mobile n'est pas concerné et conserve `px-4`.

---

## 2. Entrée de la colonne des lieux (`footer.astro`)

Pas de structure de données : une liste `<ul>` de `<li>` écrits en dur dans
`src/components/footer.astro`, colonne « Commun'île » (la première des deux). Les cinq lieux y
figurent dans le même ordre que la nav.

**Instance ajoutée** — en dernière position de la liste, après `À La Carte Postale` :

```text
<li>
  <Link href={PATH.LA_SIBRA}>La Sibra</Link>
</li>
```

**Invariant** : forme strictement identique aux cinq `<li>` existants — même composant `Link`, même
absence de classe, même imbrication. Aucune classe d'espacement à ajouter : l'espacement vient du
`space-y-4` du `<ul>` parent.

---

## 3. Carte de lieu (`PlaceCard` dans `home-places-section.astro`)

Composant `src/components/place-card.astro`. Six instances après cette issue, écrites en clair dans
la section (pas de boucle sur un tableau) : la 6ᵉ suit le même patron.

| Prop | Type | Valeur pour La Sibra |
|------|------|---------------------|
| `href` | `string` | `PATH.LA_SIBRA` |
| `image` | `ImageMetadata` | `laSibraCardImage`, importée de `../images/la-sibra-card.webp` |
| `imageAlt` | `string` | Texte alternatif FR décrivant la photo (voir ci-dessous) |
| `tagColor` | `'blue' \| 'green' \| 'red' \| 'yellow' \| …` | `green` (D5) |
| `tagText` | `string` | `La Sibra` |
| `class` | `string?` | **absente** — aucune carte n'en porte après cette issue (D6) |
| slot `hover-content` | markup | Horaires de la boutique (voir ci-dessous) |

**Import à ajouter** — l'ordre des imports du frontmatter est alphabétique par chemin ; `la-sibra-card`
se place après `la-carte-postale-card` et avant `le-bar-ile-card` :

```ts
import laSibraCardImage from '../images/la-sibra-card.webp'
```

**Texte alternatif** : décrit ce que montre la photo, pas le lieu en général — règle suivie par les
cinq cartes existantes (« Les Landes Fertiles - 2 personnes travaillent sur des plants de
tomates »). Préfixe = nom du lieu, puis tiret, puis description. Le texte retenu doit correspondre au
contenu réel de `la-sibra-card.webp` : à vérifier en ouvrant l'image avant de le rédiger.

**Contenu de survol** (D3, D4, D8) — forme `<span>`, majoritaire parmi les cartes existantes :

```text
<div slot="hover-content" class="grid h-full">
  <span class="text-2xl font-bold"> Horaires d'ouverture </span>
  <span class="font-medium">
    <strong>Vendredi :</strong> 16h00 - 20h00 <br />
    <strong>Samedi :</strong> 11h00 - 20h00
  </span>
</div>
```

Les horaires sont **recopiés** depuis `sibra-boutique-section.astro` (source de vérité publiée en
#61), pas importés — voir D3 et la dette qui y est signalée. La **notation** est en revanche celle
des cinq cartes voisines (`HHhMM`, trait d'union), pas celle de la page Sibra (`16 h – 20 h`) : la
donnée est la même, la convention typographique est celle de la surface éditée (D8).

**Position** : dernière de la grille, après À La Carte Postale.

---

## 4. Modification de la carte À La Carte Postale

Unique changement autorisé sur une carte existante (FR-012) : suppression de l'attribut

```astro
class="md:mx-auto md:col-span-2 md:w-1/2"
```

L'attribut disparaît entièrement, il ne contenait que ces trois classes (D6). Toutes les autres props
de cette carte — `href`, `image`, `imageAlt`, `tagColor="yellow"`, `tagText`, contenu de survol —
restent inchangées.

**Invariant de grille** : le conteneur parent
`class="col-span-2 grid grid-cols-1 gap-3 md:grid-cols-2"` n'est **pas** modifié. Avec six enfants
sans classe de portée, il produit 1 colonne en mobile et 2×3 en desktop (FR-011).

---

## 5. Paragraphe de présentation d'À La Carte Postale

Chaîne de contenu dans `src/features/la-carte-postale/sections/la-carte-postale-what-section.astro`,
dernier `<Text font="pally" size="xl" weight="semibold" class="max-w-md">` de la colonne de texte.

| Avant | Après |
|-------|-------|
| C'est le **dernier lieu né** de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! | C'est le **quatrième restaurant** de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! |

**Invariants** : les props du `<Text>` (`font`, `size`, `weight`, `class`) ne changent pas ; seul le
contenu textuel change (FR-015). L'apostrophe typographique et la ponctuation de la phrase suivent
l'usage du fichier. Le retour à la ligne dans le source peut se déplacer du fait de la longueur
différente — sans effet sur le rendu.

**Contrôle associé** : `grep -rn "dernier lieu" src/` doit renvoyer **zéro** résultat après
modification (FR-014, SC-005). État au 2026-09-19 avant modification : une seule occurrence, à la
ligne 28 de ce fichier.

---

## Récapitulatif des invariants

- **I1** — Exactement 4 fichiers du site modifiés (SC-007).
- **I2** — Les 6 entrées de nav et les 5 entrées de footer préexistantes conservent ordre et libellé.
- **I3** — Les 5 `PlaceCard` préexistantes conservent toutes leurs props, à l'exception du `class`
  retiré sur À La Carte Postale.
- **I4** — Aucune chaîne de type téléphone, e-mail, `tel:` ou `mailto:` n'est introduite (FR-016).
- **I5** — Aucun composant partagé (`NavLink`, `PlaceCard`, `Tag`, `Link`, `Text`) n'est modifié.
- **I6** — Aucun asset ajouté au dépôt.
