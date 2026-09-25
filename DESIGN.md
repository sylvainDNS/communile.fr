---
name: Commun'île
description: Archipel de(s) communs — une identité parapluie et une palette par lieu, reliées par un même langage de badges, de cartes arrondies et d'ornements peints.
colors:
  sky-mist: "oklch(96.8% 0.007 247.896)"
  night-ink: "oklch(0.145 0 0)"
  island-ink: "oklch(0.1292 0.0415 265.15)"
  pebble: "#e2e8f0"
  white: "#ffffff"
  watt-blue: "oklch(0.5605 0.2414 266.27)"
  watt-blue-accent: "oklch(0.4827 0.2923 265.07)"
  watt-red: "hsla(0, 100%, 57%, 1)"
  watt-yellow: "oklch(0.8408 0.1725 84.2)"
  watt-yellow-accent: "oklch(0.8982 0.181764 97.3809)"
  watt-green: "hsla(137, 71%, 36%, 1)"
  landes-grey: "oklch(0.3752 0.0394 256.85)"
  landes-grey-accent: "oklch(0.2823 0.0548 255.60)"
  landes-red: "oklch(0.4761 0.194 29.08)"
  landes-red-accent: "oklch(0.3976 0.2045 28.91)"
  landes-green: "oklch(0.2718 0.1589 135.68)"
  labo-green: "oklch(0.5997 0.1049 186.55)"
  labo-green-dark: "oklch(0.4415 0.0747 189.15)"
  labo-yellow: "oklch(0.8341 0.1634 80.48)"
  labo-yellow-accent: "oklch(0.8913 0.1725 87.3809)"
  bar-blue: "oklch(0.3546 0.1298 258.19)"
  bar-blue-accent: "oklch(0.266 0.092 256.83)"
  bar-orange: "oklch(0.772 0.1738 64.55)"
  bar-orange-accent: "oklch(0.6765 0.1738 64.55)"
  alacp-blue: "oklch(0.6622 0.1782 273.07)"
  alacp-blue-accent: "oklch(0.5002 0.2496 272.75)"
  alacp-yellow: "oklch(0.8328 0.171572 82.0575)"
  alacp-yellow-accent: "oklch(0.7596 0.171572 82.0575)"
  sibra-green: "oklch(0.6214 0.1490 120.95)"
  sibra-green-accent: "oklch(0.5214 0.1490 120.95)"
  sibra-pink: "oklch(0.6469 0.1663 1.60)"
  sibra-pink-accent: "oklch(0.5469 0.1663 1.60)"
  sibra-orange: "oklch(0.7880 0.1707 69.98)"
  sibra-orange-accent: "oklch(0.6880 0.1707 69.98)"
typography:
  display:
    fontFamily: "Pally, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "normal"
  headline:
    fontFamily: "Pally, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 500
    lineHeight: 1
  title:
    fontFamily: "Pally, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 500
    lineHeight: 1.2
  numeral:
    fontFamily: "Pally, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Rubik, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.375
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
  ui:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "16px"
  diagonal: "40px"
  info: "64px"
  pill: "9999px"
spacing:
  page-gutter: "8px"
  page-gutter-md: "16px"
  container-x: "24px"
  gap-sm: "12px"
  gap-md: "24px"
  gap-lg: "48px"
  section-y: "48px"
  card-pad: "32px"
  card-pad-sm: "16px"
components:
  button-primary:
    backgroundColor: "{colors.watt-blue}"
    textColor: "{colors.white}"
    typography: "{typography.ui}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "40px"
  badge-heading:
    backgroundColor: "{colors.watt-blue}"
    textColor: "{colors.white}"
    typography: "{typography.display}"
    rounded: "{rounded.pill}"
    padding: "12px 16px"
  tag:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card-pad}"
  card-small:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "{spacing.card-pad-sm}"
  card-diagonal:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.diagonal}"
    padding: "{spacing.card-pad-sm}"
  place-card:
    rounded: "{rounded.lg}"
    height: "256px"
  nav-link:
    textColor: "{colors.night-ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  nav-link-active:
    backgroundColor: "{colors.pebble}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
---

# Design System: Commun'île

## Overview

**Creative North Star: "L'Archipel"**

Commun'île n'est pas une marque qui se décline, c'est un archipel : chaque lieu est une île qui a sa couleur, son logo et son caractère (le rouge-jaune-bleu du Wattignies, la sarcelle du Labo Diva, le bleu nuit du Bar'Île, le vert houblon de La Sibra…). Ce qui fait l'archipel, c'est le langage commun qui relie les îles : les titres en badges collés de travers, les cartes blanches aux coins très arrondis, les photos réelles des lieux et les ornements peints à la main (feuillages, fleurs, étoiles, crochets). Une nouvelle page « fait Commun'île » quand on peut changer sa palette sans changer sa grammaire.

Le système est plat, lumineux et populaire. Les couleurs sont franches et posées en aplats sur un fond brume à peine bleuté ; la profondeur vient de la superposition (badges qui se chevauchent, ornements qui débordent des sections) et jamais de l'ombre. Les formes sont rondes et joueuses : pilules, coins asymétriques, rotations légères. La densité est moyenne : de grandes sections arrondies empilées, chacune un bloc de couleur ou de blanc, séparées par l'air du fond.

Deux mondes sont explicitement rejetés. **Pas de corporate ni de startup** : pas de dégradés tech, pas de gris sages, pas d'illustrations 3D génériques, pas de ton de plaquette. **Pas de bio-bobo épuré** : pas de beige, de kraft, de serif élégante ni de minimalisme d'épicerie fine ; Commun'île est populaire, pas chic.

**Key Characteristics:**
- Une palette par lieu, appliquée par `data-theme` ; les composants ne connaissent que des rôles (`primary`, `secondary`, `tertiary`, `quaternary`).
- Titres de section en piles de badges inclinés, en capitales Pally Bold.
- Cartes blanches arrondies, coins signature asymétriques (diagonale 40px, coin haut-droit 64px).
- Photos réelles des lieux, jamais de banque d'images ; ornements SVG peints propres à chaque lieu.
- Plat : aucune ombre hors du header flottant.
- Mouvement discret et physique : badges qui « se collent » à l'apparition, photos qui zooment légèrement au survol, toujours coupé sous `prefers-reduced-motion`.

## Colors

Aplats saturés et joyeux, une palette par île, posés sur une brume claire et ancrés par une encre bleu-nuit presque noire.

### Primary
- **Bleu Fresque** (watt-blue): couleur parapluie de Commun'île (thème `default`, identique au Wattignies). Badges de titre, sections pleines, boutons, fond de la section « Nous avons à cœur d'agir » (en version accent).
- **Bleu Outremer** (watt-blue-accent): variante plus profonde et plus saturée du Bleu Fresque, pour les sections `accent` qui portent du texte blanc courant.

### Secondary
- **Rouge Piment** (watt-red): second badge des piles de titres, cartes « concept », quart de cercle du footer.

### Tertiary
- **Jaune Soleil** (watt-yellow): sections pleines (« Nos valeurs »), troisième badge, ornements étoile. Couleur de fond, jamais couleur de texte sur blanc.
- **Jaune Citron** (watt-yellow-accent): variante plus claire, pour les vagues et ornements posés sur le Jaune Soleil.
- **Vert Potager** (watt-green): quatrième couleur de l'archipel parapluie (tags, chiffres).

### Palettes des îles
Chaque lieu remplace les rôles ci-dessus par sa propre palette (mapping dans `src/styles/global.css`, `@layer base`) :
- **Les Landes Fertiles** : Ardoise de ferme (landes-grey) en primary, son accent Ardoise profonde (landes-grey-accent), Rouge Brique (landes-red) et son accent en secondary, Encre d'île en tertiary, Vert Sous-bois (landes-green) en quaternary.
- **Le Labo Diva** : Sarcelle Diva (labo-green) en primary, Jaune Moutarde (labo-yellow) en secondary, Sarcelle profonde (labo-green-dark) en tertiary, Encre d'île en quaternary.
- **Le Bar'Île** : Bleu Nuit de Bistro (bar-blue) en primary, Orange Apéro (bar-orange) en secondary, Encre d'île en tertiary.
- **À La Carte Postale** : Bleu Timbre (alacp-blue, un bleu lavande) en primary, Jaune Poste (alacp-yellow) en secondary.
- **La Sibra** : Vert Houblon (sibra-green), Rose Framboise (sibra-pink), Orange Ambrée (sibra-orange), Encre d'île. Couleurs de base **imposées par la charte fournie par la coopérative** : ne pas les ajuster (cf. `specs/001-page-brasserie/contracts/theme.md`).

### Neutral
- **Brume de ciel** (sky-mist): fond de page. Un blanc cassé à peine bleuté qui fait « flotter » les sections blanches et colorées.
- **Encre de nuit** (night-ink): texte courant par défaut (`foreground`).
- **Encre d'île** (island-ink): bleu-nuit presque noir, partagé par plusieurs îles comme rôle sombre (texte fort, sections sombres).
- **Galet** (pebble): pastilles d'icônes dans les cartes, fond du lien de navigation actif.
- **Blanc** (white): cartes, header, sections par défaut ; texte sur les aplats sombres.

### Named Rules
**The One Island, One Palette Rule.** Un composant ne lit que les rôles de thème (`bg-primary`, `text-secondary`…), jamais la couleur brute d'un lieu. Seules exceptions tolérées : le footer (tricolore parapluie) et les tags de la page d'accueil qui désignent chaque lieu par sa couleur.

**The Measured Contrast Rule.** Les contrastes se mesurent sur les tokens, ils ne s'estiment pas. Le jaune et l'orange (watt-yellow, labo-yellow, bar-orange, alacp-yellow, sibra-orange) ne portent **jamais** de texte blanc, quelle que soit la taille : blanc sur Jaune Soleil est sous 2:1. Sur ces fonds, le texte est en encre.

**The Accent Is Not Always Darker Rule.** Le suffixe `-accent` désigne la variante d'appui d'une couleur, pas un sens de variation : il est plus sombre pour les bleus, verts et rouges, plus clair pour certains jaunes (watt-yellow-accent, labo-yellow-accent). Vérifier la valeur avant de poser du texte dessus.

## Typography

**Display Font:** Pally (repli ui-sans-serif, system-ui)
**Body Font:** Rubik (repli ui-sans-serif, system-ui)
**Label/UI Font:** Inter (repli ui-sans-serif, system-ui)

**Character:** Pally, ronde et grasse, porte la voix : titres, badges, chiffres. Elle a le côté peint à la main de la fresque. Rubik, arrondie mais sage, rend le texte courant chaleureux sans le rendre fantaisiste. Inter reste invisible : navigation, tags, labels, boutons.

### Hierarchy
- **Display** (Pally 700, 2.25rem → 3rem dès `md`, interligne 1.5, capitales) : exclusivement les titres de section en piles de badges (« NOS / LIEUX », « LE CHOIX / DE LA / COOPÉRATIVE »).
- **Headline** (Pally 500 par défaut, 700 pour le h1 ; 2.25rem → 3rem) : titres de section non badgés (« La coopérative en quelques chiffres », h1 « Archipel de(s) communs »).
- **Title** (Pally 500, 1.5rem → 1.875rem) : titres de cartes et de sous-sections, titre par défaut du composant `Heading`.
- **Numeral** (Pally 700, 2.25rem) : chiffres clés sur les cartes de chiffres.
- **Body** (Rubik 400, 1.125rem, interligne 1.375) : texte courant. `Text size="base"` rend volontairement 18px : c'est le corps par défaut du site, pas le `text-base` de Tailwind. Largeur de lecture tenue par les colonnes (`max-w-sm` à `max-w-md` dans les blocs d'introduction).
- **Label** (Inter 700, 1rem) : tags et étiquettes de lieux, souvent en capitales sur les cartes photo.
- **UI** (Inter 500, 1rem) : navigation, boutons, mentions.

### Named Rules
**The Three Voices Rule.** Pally parle, Rubik raconte, Inter indique. Ne jamais composer un paragraphe en Pally ni un titre de section en Inter.

**The Sticker Heading Rule.** Un titre en badges fait 2 à 3 mots maximum, un badge par mot ou groupe de mots, chaque badge d'une couleur de rôle différente. C'est la signature de section, pas un style de titre courant : une seule pile par section.

## Layout

La page est une colonne de sections arrondies empilées sur le fond Brume de ciel. Le `body` garde une gouttière de 8px (16px dès `md`) ; le `main` est une grille à une colonne, `gap` 32px, plafonnée à 2000px (`max-w-2k`). Chaque section est un bloc plein (blanc, couleur de rôle, accent ou sombre) aux coins de 6px, avec 48px de padding vertical par défaut, parfois 24px, 64px ou 96px.

À l'intérieur, le `Container` (classe `container` de Tailwind, padding horizontal 24px puis 8px dès `md`) cadre le contenu. Les compositions typiques :
- introduction étroite à gauche (titre-badges + 2 à 3 paragraphes) et grille de cartes à droite sur 2 colonnes (`md:grid-cols-3` avec `col-span-2`) ;
- rangées de 3 cartes égales (`md:grid-cols-3`) ;
- grilles auto-ajustées (`repeat(auto-fit, minmax(400px, 1fr))`) pour les chiffres.

Gaps récurrents : 12px entre cartes serrées, 24px entre cartes, 48px entre colonnes de contenu. Points de rupture Tailwind standards (`md` 768px pour le passage en colonnes, `xl` 1280px pour la navigation desktop) plus un `2k` à 2000px où les bandeaux pleine largeur rentrent dans le conteneur.

**The Overflowing Ornament Rule.** Les ornements (crochets, vagues, hexagones, étoiles) se posent en `absolute`, débordent des bords de section (`-top-6 -right-6`), restent décoratifs (`aria-hidden`) et sous le contenu (`z-10` sur le contenu). La section coupe le débordement (`overflow-hidden`) : les ornements ne créent jamais de défilement horizontal.

## Elevation & Depth

Le système est plat. La profondeur vient de la superposition et du contraste de couleur : sections blanches ou pleines sur la brume, cartes blanches sur les aplats, badges qui se chevauchent et débordent, ornements derrière le contenu. Une seule ombre existe, pour le header flottant, qui doit se détacher de tout ce qui défile sous lui.

### Shadow Vocabulary
- **Header** (`box-shadow: 0 4px 40px -10px rgba(0,0,0,0.03), 0 2px 32px -5px rgba(0,0,0,0.04)`) : header fixe et panneau de menu mobile uniquement.

### Named Rules
**The Flat Island Rule.** Aucune ombre sur les cartes, sections, boutons ou badges. Si un élément doit se détacher, il change de fond (blanc sur couleur, couleur sur brume), pas d'élévation.

## Shapes

Tout est rond, rien n'est vif. Le plus petit rayon est 6px (sections, header, boutons) ; les cartes passent à 8px (petites) ou 16px (standard, cartes photo). Les pilules (9999px) servent aux badges, tags, pastille de flèche et liens de navigation actifs (16px).

La signature, ce sont les coins asymétriques : la **diagonale** (40px en haut-gauche et en bas-droite) des cartes « valeurs », le **coin haut-droit de 64px** des cartes d'information, et les **cartes de chiffres** (40px haut-gauche, 32px bas-droite). Les rotations légères font partie de la forme : les badges de titre s'inclinent de −11° à +7°, les étiquettes de cartes photo pivotent de 1° et la photo de −2° au survol.

Le footer reprend les formes en quarts de cercle (bleu en haut à gauche, jaune et rouge en bas à droite), et les bandeaux photo peuvent être en demi-pilule (`rounded-l-full`) pour sortir du cadre.

**The Soft Corner Rule.** Aucun angle vif sur une surface. Un nouvel élément prend au minimum 6px ; une carte mise en avant prend un coin asymétrique existant plutôt qu'un nouveau rayon.

## Components

### Buttons
Discrets : sur ce site, l'action passe surtout par des liens et des cartes cliquables.
- **Shape:** doucement arrondi (6px), hauteur 40px (36px en `sm`, 44px en `lg`).
- **Primary:** fond de rôle `primary`, texte blanc, Inter 500, padding 8px 16px.
- **Hover / Focus:** fond à 90 % au survol ; anneau de focus 2px de la couleur du variant, décalé de 2px.
- **Secondary / Tertiary / Outline / Ghost / Link:** mêmes proportions ; `outline` se remplit de la couleur courante au survol ; `ghost` prend un voile à 10 % ; `link` se souligne. Ne pas utiliser `tertiary` (texte blanc sur jaune/orange) : cf. The Measured Contrast Rule.

### Heading Badges (signature)
La pile de badges est le titre de section de l'archipel.
- **Style:** pilules pleines de couleur de rôle, texte blanc ou fond, Pally 700 en capitales, padding 12px 16px, `white-space: nowrap`.
- **Composition:** 2 à 3 badges empilés dans une grille, décalés par `translate`, inclinés de valeurs différentes (−11°, −7°, −3°, 3°, 4°, 7°), le badge central au-dessus (`z-10`).
- **Motion:** à l'entrée dans le viewport, le badge passe de 90 % à 100 % d'échelle en 300ms et ses lettres remontent en cascade (20ms d'écart). Pas d'animation s'il est déjà visible au chargement ni sous `prefers-reduced-motion`.

### Chips (Tags)
- **Style:** pilule, Inter 700 16px, padding 8px 12px. Les tags de rôle posent un dégradé très clair de la couleur du thème (15 % → 30 % de mélange avec le blanc) et un texte en encre.
- **State:** statiques ; sur les cartes photo, le tag disparaît au survol au profit du voile d'informations.

### Cards / Containers
- **Corner Style:** 16px (standard), 8px (petite), diagonale 40px (valeurs), haut-droit 64px (information).
- **Background:** blanc sur section colorée ou sur brume ; les cartes de chiffres prennent la couleur de rôle en plein, texte blanc.
- **Shadow Strategy:** aucune (cf. Elevation & Depth).
- **Border:** aucune. Une carte blanche posée sur une section blanche est invisible : dans ce cas, poser la carte en `bg-background`.
- **Internal Padding:** 32px (standard), 16px (petite). Les pastilles d'icône sont des carrés Galet de 40px aux coins de 8px.

### Place Card (signature)
La porte d'entrée vers chaque île.
- **Style:** photo réelle du lieu, 256px de haut, coins 16px, tag du lieu en haut à gauche en capitales, pastille blanche ronde avec flèche ↗ en bas à droite.
- **Hover:** la photo zoome à 105 % en 300ms ; tag et flèche s'effacent ; un voile noir à 80 % révèle les horaires d'ouverture en blanc.

### Navigation
- **Style:** header blanc flottant (fixe, 8px du bord, coins 6px, ombre Header), logo et nom en capitales à gauche, liens centrés en Inter 500.
- **Active / Hover:** lien actif en pilule de 16px au dégradé Galet, `aria-current="page"` ; survol en dégradé Galet plus léger.
- **Mobile:** sous `xl`, bouton menu dont l'icône se transforme en croix ; panneau blanc qui se déroule de haut en bas (clip-path, 300ms), liens empilés en 20px, focus piégé et restauré.

### Details (FAQ)
- **Style:** blocs aux coins 6px, question en 18–20px gras, chevron qui pivote de 90° à 270° à l'ouverture (200ms), réponse en 16–18px.

## Do's and Don'ts

### Do:
- **Do** poser `data-theme` sur la page d'un lieu et ne consommer que les rôles `primary` / `secondary` / `tertiary` / `quaternary` dans ses sections.
- **Do** ouvrir chaque section importante par une pile de 2 à 3 badges inclinés en Pally 700 capitales.
- **Do** utiliser des photos réelles des lieux et les ornements SVG du lieu concerné, en `aria-hidden`, débordant du bord de section.
- **Do** garder tous les coins arrondis (6px minimum) et réutiliser les coins signature (diagonale 40px, haut-droit 64px) pour mettre une carte en avant.
- **Do** mesurer chaque contraste sur les tokens (WCAG 2.1 AA) et poser du texte en encre sur les jaunes et oranges.
- **Do** couper toute animation sous `prefers-reduced-motion`.

### Don't:
- **Don't** faire corporate ou startup : pas de dégradés tech, pas de gris sages, pas d'illustrations 3D génériques, pas de ton de plaquette.
- **Don't** faire bio-bobo épuré : pas de beige, de kraft, de serif élégante ni de minimalisme d'épicerie fine.
- **Don't** mettre de texte blanc sur un jaune ou un orange (watt-yellow, labo-yellow, bar-orange, alacp-yellow, sibra-orange), y compris dans un badge `tertiary`.
- **Don't** ajouter d'ombre portée à une carte, un bouton ou un badge.
- **Don't** utiliser la couleur brute d'un autre lieu dans une page thémée, ni ajuster les couleurs de base imposées par la charte de La Sibra.
- **Don't** écrire un paragraphe en Pally ni un titre de section en Inter.

## Écarts avec Figma

Référence : fichier Figma « Commun'île », page « ✨ UI » (`Kj8VM1ZbQqJlGIzE06VCTI`, copie de `7XA28FhGLMCgGPVcGhdNyA`), relevé le 2026-09-25. **Le code fait foi** ; les écarts ci-dessous sont soit des bugs à corriger vers Figma, soit des choix d'intégration assumés.

**Bugs corrigés vers Figma (2026-09-25) :**
1. **Bar'Île, accent primaire** : `[data-theme='bar-ile']` mappait `--theme-primary-accent` sur `--color-le-labo-diva-green-accent` (une sarcelle). Il pointe désormais sur `--color-le-bar-ile-blue-accent` (≈ #012351, = Figma `bar-blue-darker` #012451).
2. **Landes Fertiles, accent ardoise** : `--color-landes-fertiles-grey-accent` valait `oklch(0.2961 0.2045 255.09)`, un bleu électrique (≈ #00138E) dont la chroma était recopiée de la ligne du rouge. Il vaut désormais `oklch(0.2823 0.0548 255.60)`, soit Figma `lf-grey-darker` #162A44.

**Choix d'intégration assumés (le code reste la référence) :**
- **Texte courant en Rubik 18px** ; Figma prévoit Inter (body1 20px, body2 16px). Confirmé.
- **Accents** : Figma définit des déclinaisons `-light` (fonds de tags : watt-blue-light #D6E9FF, watt-red-light #FFDDDD, watt-yellow-light #FFFBC5, watt-green-light #DDFBE4) et `-dark` (watt-blue-dark #0B155B, watt-red-dark #500000, watt-yellow-dark #482100) ; le code n'a qu'un `-accent` par couleur et calcule les fonds clairs par `color-mix`.
- **Tags** : Figma les dessine en aplat clair et texte de couleur saturée ; le code pose un dégradé clair et un texte en encre (pour tenir le contraste AA).
- **Rayons** : Figma utilise 8 / 16 / 32px ; le code utilise 6 / 8 / 16 / 40 / 64px.
- **Landes Fertiles, vert** (landes-green) : présent dans le code, absent de la palette Figma.
- **Chiffres de l'accueil** : Figma propose deux mises en page (composition en arches et grille de cartes) ; le site livre la grille de cartes.
- **Footer** : les quarts de cercle utilisent les couleurs Tailwind brutes (`blue-600`, `yellow-500`, `red-500`), et non les tokens watt.
