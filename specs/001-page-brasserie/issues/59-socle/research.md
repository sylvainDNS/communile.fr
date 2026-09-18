# Research — Socle technique La Sibra (issue #59)

**Portée** : uniquement les inconnues propres à cette issue. Les décisions structurantes sont déjà tranchées dans l'epic et **ne sont pas rediscutées** :

| Réf. epic | Décision | Où |
|---|---|---|
| R1 | Convention de nommage (article seulement pour ce qui dérive de l'URL) | [`../../research.md`](../../research.md) |
| R2 | Palette imposée par la charte de la coopérative | [`../../contracts/theme.md`](../../contracts/theme.md) |
| R3-bis | Décorations « bulles » + « trois disques » | [`../../research.md`](../../research.md) |
| R6 | Optimisation des photos ~1600 px / qualité ~80 | [`../../research.md`](../../research.md) |
| R11 | Nom d'usage « La Sibra » | [`../../research.md`](../../research.md) |

---

## S1 — Outil de conversion des photos

**Décision** : convertir avec **ImageMagick** (`magick`), en une passe `-auto-orient -resize 1600x -quality 80 -define webp:method=6`, vers WebP.

**Rationale** :
- `sharp` n'est pas résolvable en CLI dans ce dépôt (il n'est pas une dépendance directe ; Astro l'embarque pour son propre pipeline), donc pas de script Node ad hoc sans ajouter une dépendance — ce que le principe II (YAGNI) décourage.
- `magick` et `cwebp` sont installés sur le poste ; la conversion est un **acte ponctuel** hors build : le résultat est commité, la chaîne de build n'en dépend jamais. Aucune dépendance n'entre dans `package.json`.
- `-auto-orient` applique l'orientation EXIF avant redimensionnement : sans cela, une photo prise en portrait peut se retrouver pivotée après strip des métadonnées.

**Alternatives écartées** :
- *Ajouter `sharp` en devDependency + script* : dépendance et script de build pour quatre fichiers convertis une seule fois. Rejeté (principe II).
- *Laisser Astro optimiser le JPEG source de 3,5 Mo* : `astro:assets` produirait bien des dérivés optimisés, mais 10 Mo de JPEG entreraient dans git pour toujours et chaque build paierait le redimensionnement. Rejeté (principe III + poids du dépôt).
- *`cwebp` seul* : ne redimensionne pas confortablement et gère mal l'orientation EXIF ; utilisable en complément mais `magick` couvre tout en une commande.

---

## S2 — Recadrage paysage de la carte d'accueil (T002)

**Décision** : recadrer la photo boutique (portrait 3472 × 4624) par la bande **`3472 × 1111` à l'offset `+0+2350`**, puis redimensionner à **1280 px** de large → sortie ≈ 1280 × 410, ratio exactement **3,125:1** (= 800 × 256).

**Rationale** :
- Le ratio cible 800 × 256 vaut 3,125:1 ; prendre la pleine largeur (3472) impose une hauteur de 3472 / 3,125 = 1111 px. Un crop en pleine largeur **ne peut pas déformer** le sujet : on ne fait que couper du haut et du bas.
- L'offset vertical 2350 a été **validé visuellement** : la bande cadre le comptoir en bois avec son plan de travail inox, le tonneau avec les bouteilles en promo à droite, et les étagères garnies à gauche — exactement le sujet demandé (« comptoir/tonneau »). Plus haut, on récupère un plafond vide ; plus bas, on remplit l'image de carrelage.
- Largeur source 1280 px pour un affichage ~800 px : marge retina suffisante sans excès de poids.

**Alternatives écartées** :
- *Crop centré automatique (`-gravity center`)* : tomberait sur le sol et le carrelage. Rejeté.
- *`-resize 800x256!`* (avec `!`) : étirerait l'image. Interdit par la spec.
- *Utiliser la photo « bouteilles » pour la carte* : moins lisible en vignette large et moins représentative du lieu que le comptoir. Rejeté.

---

## S3 — Emplacement de l'image de carte d'accueil

**Décision** : `src/features/home/images/la-sibra-card.webp` (pas dans `src/features/sibra/images/`).

**Rationale** : les cinq cartes de lieux existantes vivent déjà dans la feature `home`, car elles sont des assets de l'écran d'accueil (cadrage, ratio et traitement dictés par la grille de l'accueil), pas des photos de la page du lieu. Le nom porte l'article (`la-sibra-card`) parce qu'il dérive du nom de la page/URL — convention R1.

---

## S4 — Décorations SVG et coloration par le thème

**Décision** : versionner les deux SVG tels quels dans `src/features/sibra/images/`, en s'assurant qu'ils utilisent `currentColor` (et non une couleur figée) pour leurs remplissages, et vérifier l'import en composant Astro (`import Deco from '../images/sibra-….svg'` → `<Deco class="… text-primary-accent" />`), sur le patron de `la-carte-postale-hero-section.astro`.

**Rationale** : Astro expose les SVG importés comme composants et inline leur markup ; `currentColor` hérite alors de la couleur de texte, donc d'une classe utilitaire `text-*-accent` du thème. C'est le mécanisme déjà utilisé par les décorations des autres lieux — aucune invention.

**Point de vigilance** : si un SVG porte un `fill` littéral, la classe `text-*` restera sans effet. La vérification fait partie de la tâche (T007), pas d'une issue ultérieure.

---

## S5 — Nom de la branche de travail

**Décision** : `001-page-brasserie-socle`.

**Rationale** : l'issue et `tasks.md` prévoyaient `001-page-brasserie/socle`, mais git stocke les références en arborescence de fichiers : tant que la branche epic s'appelle exactement `001-page-brasserie`, aucune branche `001-page-brasserie/*` ne peut exister (« cannot lock ref … `001-page-brasserie` exists »). Le tiret conserve le regroupement visuel sans renommer la branche epic (qui est la cible des PRs et sert de branche de QA client).

**Conséquence à répercuter** : les branches des issues suivantes (#60–#66) devront suivre le même schéma `001-page-brasserie-<slug>`. À corriger dans `../../tasks.md` lors d'une passe ultérieure, ou à retenir simplement comme convention de fait.

**Alternatives écartées** :
- *Renommer la branche epic en `001-page-brasserie/epic`* : casserait les PRs et le suivi côté GitHub. Rejeté.
- *Branches détachées de la convention (`socle`, `feat/socle`)* : perte du regroupement par epic. Rejeté.
