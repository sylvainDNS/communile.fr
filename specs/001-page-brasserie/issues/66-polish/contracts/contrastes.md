# Contrat : contrastes mesurés du thème « sibra »

Ce document est la **source du correctif** appliqué à `specs/001-page-brasserie/contracts/theme.md`.
Il existe pour une raison : le tableau de contrastes de l'epic annonçait des valeurs estimées, dont une
autorisait une combinaison non conforme AA. Toute valeur publiée ici est reproductible.

## Méthode

Les tokens du dépôt sont définis en `oklch`. Le calcul enchaîne, sans passer par un outil externe :

1. `oklch(L C H)` → Oklab : `a = C·cos(H)`, `b = C·sin(H)` ;
2. Oklab → sRGB linéaire (matrice LMS inverse standard d'Oklab), puis encodage gamma sRGB ;
3. luminance relative WCAG : `0,2126·R + 0,7152·G + 0,0722·B` sur les composantes **linéarisées** ;
4. ratio : `(L_clair + 0,05) / (L_sombre + 0,05)`.

Pour les fonds produits par `color-mix(in oklab, <couleur> P%, white)`, l'interpolation est faite en Oklab
(`L,a,b` du blanc = `1,0,0`) **avant** conversion, conformément à ce que fait le navigateur.

Script de référence, à rejouer sous Node :

```text
node specs/001-page-brasserie/issues/66-polish/contracts/contrastes.mjs
```

Tolérance de reproduction retenue : ±0,02. Les valeurs ci-dessous ont été confrontées aux mesures de
l'onglet Accessibility de Chrome DevTools sur le rendu réel.

## Tokens de référence

| Token | `oklch` | sRGB |
|---|---|---|
| `foreground` | `oklch(0.145 0 0)` | `#0A0A0A` |
| `background` | `oklch(0.968 0.007 247.896)` | `#F1F5F9` |
| `primary` (vert olive) | `oklch(0.6214 0.1490 120.95)` | `#7A9300` |
| `primary-accent` | `oklch(0.5214 0.1490 120.95)` | `#5E7500` |
| `secondary` (rose) | `oklch(0.6469 0.1663 1.60)` | `#DC5B87` |
| `secondary-accent` | `oklch(0.5469 0.1663 1.60)` | `#B93B6A` |
| `tertiary` (orange) | `oklch(0.7880 0.1707 69.98)` | `#FEA300` |
| `tertiary-accent` | `oklch(0.6880 0.1707 69.98)` | `#DC8300` |

## Tableau de contrastes — valeurs mesurées

| Fond | Texte blanc | Texte `foreground` | Règle |
|---|---|---|---|
| `primary` `#7A9300` | **3,50** | **5,66** | blanc **en grand texte seulement** ; texte courant en `foreground` |
| `primary-accent` `#5E7500` | **5,25** | **3,77** | blanc en texte courant ✅ ; **`foreground` interdit en texte courant** ✗ |
| `secondary` `#DC5B87` | **3,57** | **5,55** | blanc **en grand texte seulement** ; texte courant en `foreground` |
| `secondary-accent` `#B93B6A` | **5,39** | **3,67** | blanc en texte courant ✅ ; **`foreground` interdit en texte courant** ✗ |
| `tertiary` `#FEA300` | **2,01** | **9,85** | **aucun texte blanc**, quelle que soit la taille ; `foreground` partout |
| `tertiary-accent` `#DC8300` | **2,88** | **6,87** | **aucun texte blanc, y compris en grand texte** (2,88 < 3,00) ; `foreground` partout |

### Seuils appliqués

- Texte courant : **4,5:1**.
- Grand texte : **3:1**, c'est-à-dire ≥ 24 px, ou ≥ 18,66 px **en graisse 700**. La graisse 600
  (`weight="semibold"`) **ne qualifie pas** : sous le point de rupture `md`, `size="xl"` rend 20 px, donc du
  texte courant au sens WCAG.
- Éléments graphiques et composants d'interface : 3:1.

### Trois corrections par rapport au tableau de l'epic

1. `tertiary-accent` / blanc valait **3,0** ; la mesure donne **2,88**. La règle « texte blanc en grand
   texte uniquement » qui en découlait autorisait donc du **non conforme**. Elle est remplacée par une
   interdiction franche.
2. La colonne `foreground` était sous-estimée d'environ 10 % (`5,1` → 5,66 ; `5,0` → 5,55 ; `8,9` → 9,85).
   Erreur conservatrice, sans conséquence de conformité, mais qui fait renoncer à des choix valides.
3. Les cellules `foreground` des lignes `-accent` étaient **vides**. Elles valent 3,77 et 3,67 :
   **sous AA en texte courant**. Une cellule vide se lit « non applicable » ; elle disait en réalité
   « non mesuré ». C'est l'omission la plus coûteuse du tableau.

## Composants

### `Tag`

`Tag` pose la couleur pleine du thème en texte sur un dégradé clair de cette même couleur
(`color-mix` 15 % → 30 % vers le blanc). Le pire cas est l'extrémité 30 %.

| Variante (thème sibra) | Ratio pire cas | AA texte courant |
|---|---|---|
| `color="primary"` | **2,51** | ✗ |
| `color="secondary"` | **2,55** | ✗ |
| `color="tertiary"` | **1,65** | ✗ |
| n'importe laquelle + `text-foreground` | **≥ 14,1** | ✅ |

Le défaut n'est pas propre au thème sibra : il touche aussi `la-carte-postale` (2,35), `labo-diva` (2,65) et
`wattignies` (3,30). Seuls `bar-ile` (6,19) et `landes-fertiles` (5,70) y échappent, parce que leur couleur
primaire est déjà très foncée. Passer la couleur de texte à la variante `-accent` **ne suffit pas**
(sibra : 3,77 / 3,85 / 2,37). Seul `text-foreground` est conforme sur tous les thèmes.

### `Tag color="quaternary"` — le piège du token qui change de nature

`quaternary` avait d'abord été laissé tel quel, au motif que ce token est « le neutre foncé commun ». **C'est
faux pour la moitié des thèmes**, et c'est exactement le genre de raccourci que ce document existe pour
empêcher :

| Thème | `--theme-quaternary` | `text-quaternary` sur fond 30 % |
|---|---|---|
| `default`, `wattignies` | `watt-green`, un vert **moyen** | **2,53** ✗ |
| `landes-fertiles` | vert foncé | 7,18 ✅ |
| `labo-diva`, `sibra` | le neutre foncé | 8,70 ✅ |
| `bar-ile`, `la-carte-postale` | **non défini** | couleur invalide → `unset` |

Deux enseignements : un token nommé pareil ne porte pas la même couleur d'un thème à l'autre, et un token
**non défini** fait retomber la couleur du texte en `unset`. `text-foreground`, lui, est toujours défini —
d'où son choix pour les quatre variantes thémées.

### Panneau d'erreur de `leaflet-map`

| Combinaison | Ratio | Verdict |
|---|---|---|
| `text-red-600` `#dc2626` sur `bg-red-50` `#fef2f2` | **4,41** | ✗ sous 4,5 |
| `text-red-700` `#b91c1c` sur `bg-red-50` | **5,91** | ✅ retenu |
| icône `text-red-500` `#ef4444` sur `bg-red-50` | 3,44 | ✅ (seuil graphique 3:1) |

## Interdits — formulation opérationnelle

À citer tel quel en revue :

- **jamais** de texte blanc sur `tertiary` ni sur `tertiary-accent`, quelle que soit la taille ;
- **jamais** de `text-foreground` en texte **courant** sur `primary-accent` ni `secondary-accent` (le blanc
  y est la bonne réponse) ;
- **jamais** de texte blanc **courant** sur `primary` ni `secondary` bruts (le grand texte y est permis) ;
- `Badge variant="tertiary"` (rend `bg-tertiary text-white`) reste interdit sur cette page ;
- une couleur de texte thémée sur un `Tag` demande `class="text-foreground"`.
