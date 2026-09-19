# Research: hero, « c'est quoi ? », Instagram (issue #60)

Les décisions structurantes sont prises dans l'epic ([`../../research.md`](../../research.md)) : nommage (R1), palette et contrastes (R2), composition des sections (R3), décoration « bulles » (R3-bis), optimisation d'images (R6), nom d'usage (R11). Elles ne sont pas rediscutées ici.

Cette note ne traite que les points d'adaptation propres à l'implémentation de T008–T012.

---

## R60-1 — Comment colorer le motif « trois disques » du placeholder logo ?

**Decision**: SVG **inline** dans `sibra-hero-section.astro`, trois `<circle>` portant `fill="var(--color-tertiary)"`, `var(--color-secondary)`, `var(--color-primary)`, le `<svg>` marqué `aria-hidden="true"` et `focusable="false"`.

**Rationale**:
- l'epic (tasks.md T008, contrat de thème) impose explicitement ces trois tokens, pour que le placeholder affiche les couleurs de marque **brutes** de la charte, et non des accents ;
- vérifié sur le CSS produit par `astro build` : le bloc `@theme inline` de `src/styles/global.css` émet bien `--color-primary: var(--theme-primary)`, `--color-secondary`, `--color-tertiary` dans la feuille de styles ; combinées au mapping `[data-theme='sibra']`, ces variables résolvent vers le vert, le rose et l'orange de la charte. Le motif se rethème donc tout seul si la charte évolue ;
- inline plutôt qu'un fichier `.svg` importé : le fichier `sibra-what-ornament.svg` du socle est monochrome (`currentColor`) et sert l'ornement de la section « what » ; un motif **tricolore** ne peut pas être teinté par une classe `text-*` unique. Dupliquer le fichier en version tricolore ajouterait un asset à supprimer dès réception du logo.

**Alternatives considered**:
- classes Tailwind `fill-primary` / `fill-secondary` / `fill-tertiary` sur les cercles — équivalent au rendu près, mais s'écarte de la formulation du contrat de thème et de T008 ;
- réutiliser `sibra-what-ornament.svg` en trois exemplaires superposés, chacun teinté par une classe `text-*` — trois requêtes de composant et un empilement fragile pour le même résultat ;
- image bitmap provisoire — proscrit (principe I : pas d'image de remplissage, et rien à convertir).

**Note d'implémentation**: le bloc est précédé du commentaire `TODO logo : remplacer par le logo de La Sibra dès réception` (exigence T008 / FR-002), pour qu'une recherche `TODO logo` le retrouve immédiatement.

---

## R60-2 — Couleur des textes de la section « c'est quoi ? » sur fond vert

**Decision**: sur `Section variant="primary"` (vert `#7A9300`) :
- accroche « Le tout nouveau lieu de la coopérative ! » et titre `h2` → **blanc**, parce qu'ils sont du grand texte (`Heading`, `Text size="xl" weight="semibold"`) ;
- paragraphe de présentation et mention de disponibilité → **`text-foreground`** (neutre foncé), pas de blanc ;
- paragraphe « de l'houblon à la pression » (`Text font="pally" size="xl" weight="semibold"`) → laissé en couleur héritée `foreground`, ce qui le distingue visuellement tout en restant conforme.

**Rationale**: le contrat de thème mesure blanc/vert à 3,5:1 — conforme AA en **grand texte** (≥ 24 px, ou ≥ 18,66 px gras) mais insuffisant en texte courant (4,5:1 requis). Le neutre foncé sur vert donne 5,1:1 et passe partout. C'est le seul écart assumé au patron copié `la-carte-postale-what-section.astro`, dont le thème tolérait le blanc courant.

**Conséquence concrète**: le conteneur de la colonne de texte **ne porte pas** `text-white` global (contrairement au patron) ; le blanc est appliqué élément par élément, aux seuls éléments de grand texte. Cela évite qu'un futur ajout de paragraphe hérite silencieusement d'un blanc non conforme.

**Alternatives considered**:
- assombrir le vert pour rendre le blanc courant conforme — rejeté par l'epic (R2 / SC-005 : les couleurs de la charte sont exactes et non ajustables) ;
- passer toute la section sur `variant="accent"` (vert accent `#5E7500`, blanc courant à 5,2:1) — rejeté : la dominante de la page serait un vert assombri, moins fidèle à la charte, et l'ornement `text-primary-accent` n'aurait plus de contraste avec le fond.

---

## R60-3 — Forme des liens internes de la mention de disponibilité (FR-007)

**Decision**: phrase rédigée, avec deux liens `<Link>` pointant vers `PATH.*` : « les autres lieux de la coopérative » → `PATH.HOME` (ancre des lieux non disponible en constante) et « la ferme des Landes Fertiles » → `PATH.LES_LANDES_FERTILES`. Liens soulignés au survol par le composant partagé, couleur héritée du texte pour rester lisibles sur le fond vert.

**Rationale**:
- l'epic (FR-007, data-model.md) demande des liens `PATH.*` sans figer lesquels ; la liste nominative des lieux revendeurs relève de la section « bières » (#64), pas d'ici ;
- pointer « les autres lieux de la coopérative » vers l'accueil est la formulation la plus sûre : elle reste juste quel que soit le nombre de lieux, et ne préempte pas la section bières ;
- aucune URL en dur : contrainte FR-002 du socle, déjà satisfaite par `PATH`.

**Alternatives considered**:
- lister nominativement Le Wattignies / Le Bar'Île / À La Carte Postale — rejeté : doublonnerait la section bières (#64) et risquerait de contredire la liste du texte source (qui mêle lieux de la coopérative et lieux tiers) ;
- pas de lien du tout — rejeté : FR-007 les demande explicitement.

---

## R60-4 — Niveaux de titres de la page

**Decision**: `h1` = accroche « De l'houblon à la pression » (hero) ; le nom « La Sibra » est rendu **au-dessus**, dans le bloc placeholder logo, par un `<p>` portant la typographie de titre (`font-pally`, grande taille, gras) — pas par un élément de titre ; `h2` pour « La Sibra, c'est quoi ? » et pour « Retrouvez-nous sur Instagram ».

**Rationale**: SC-004 exige un `h1` unique et une hiérarchie sans saut. Le nom du lieu fait partie du bloc placeholder logo : en faire un titre créerait soit un second `h1`, soit un `h2` **avant** le `h1`, ce qui casse l'ordre. Les cinq pages de lieux existantes appliquent déjà ce principe : le logo (image) porte le nom, l'accroche est le `h1`.

**Écart assumé à T008**: la tâche écrit « nom "La Sibra" en `Heading` ». Le composant `Heading` n'accepte que `h1`–`h6` dans sa prop `as` (typage strict, `astro check` le refuserait autrement) ; l'utiliser produirait donc forcément un titre, en contradiction avec SC-004 et le principe IV de la constitution. Le nom reprend donc la **typographie** du `Heading` sans en être un. C'est un écart de forme, pas de fond : le nom reste visuellement traité comme un titre de marque, et il disparaîtra de toute façon avec l'arrivée du vrai logo.

**Alternatives considered**:
- `h1` = « La Sibra » et accroche en paragraphe — rejeté : l'epic fixe explicitement l'accroche comme `h1` (data-model.md, T008) ;
- `h2` « La Sibra » avant le `h1` — rejeté : saut de hiérarchie, échec SC-004.

---

## R60-5 — Comportement responsive des décorations

**Decision**: décorations de hero en `hidden md:block w-[300px]`, section en `overflow-hidden` ; ornement de la section « what » en `absolute bottom-0 left-0` sous un contenu en `relative z-20`, section en `overflow-hidden`.

**Rationale**: reprise exacte du patron `la-carte-postale-*`, qui a déjà résolu le problème (pas de débordement horizontal, pas de chevauchement du texte). Sous `md`, les décorations disparaissent : le hero mobile se réduit au motif + nom + accroche, centrés. SC-002 est vérifiable visuellement aux deux largeurs.

**Alternatives considered**:
- garder les bulles en mobile à taille réduite — rejeté : à 375 px, un motif de 300 px de large passerait derrière le texte ou déclencherait un défilement horizontal ; T008 impose `hidden md:block`.
