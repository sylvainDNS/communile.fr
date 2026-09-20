# Data model — inventaire des dettes et rayon d'impact

Cette passe ne manipule pas de données métier : le site est statique et son contenu vit dans les composants.
L'« entité » qui structure le travail est la **dette** — sa nature, son rayon d'impact, et la décision prise.
C'est ce tableau qui rend SC-006 vérifiable : aucune dette n'est passée sous silence.

## Rayons d'impact

Trois cercles, du plus large au plus étroit. Le cercle détermine le coût de vérification d'une correction,
donc l'arbitrage.

| Cercle | Fichiers | Pages affectées | Vérification exigée |
|---|---|---|---|
| **A — composant partagé** | `components/leaflet-map.astro`, `tag.astro`, `text.astro`, `card.astro`, `info-card.astro` | jusqu'à 8 | les 6 pages de lieux + `/contact` + accueil |
| **B — page ou section transverse** | `features/home/**`, `utils/constants.ts` | accueil + toutes (titre) | accueil aux 2 largeurs, titre de chaque page |
| **C — local à l'epic** | `features/sibra/**`, `pages/la-sibra.astro` | 1 | `/la-sibra` aux 2 largeurs |
| **D — documentaire** | `specs/001-page-brasserie/contracts/theme.md`, `research.md` | 0 | relecture + recalcul |

## Inventaire

### Corrigées

| # | Dette | Cercle | Correction | Preuve attendue |
|---|---|---|---|---|
| D1 | `theme.md` : `tertiary-accent`/blanc annoncé 3,0, réel **2,88** — la règle « grand texte blanc autorisé » produit du non conforme | D | ratio corrigé + règle remplacée par une interdiction franche | recalcul via `contracts/contrastes.mjs` |
| D2 | `theme.md` : colonne `foreground` sous-estimée d'~10 % (5,1→**5,66**, 5,0→**5,55**, 8,9→**9,85**) | D | valeurs remplacées par les mesures | idem |
| D3 | `theme.md` : `text-foreground` sur `primary-accent` (**3,77**) et `secondary-accent` (**3,67**) — cellules **vides**, donc lues « non applicable » alors qu'elles valent « sous AA » | D | lignes remplies + interdiction explicite | idem |
| D4 | `theme.md` : `Tag color="tertiary"` présenté comme valide, rend **1,65** | D | ratio publié + règle d'usage | idem |
| D5 | `leaflet-map` : panneau d'erreur `text-red-600` sur `bg-red-50` = **4,41** (sous 4,5), et c'est le repli quand la carte ne charge pas | A | `text-red-700` (**5,91**) | mesure DevTools sur les 7 pages |
| D6 | `leaflet-map` : conteneur rendu focusable par Leaflet (`tabindex="0"`) sans `role` ni nom accessible — WCAG 4.1.2 | A | `role="application"` + `aria-label` paramétrable | arbre d'accessibilité Chrome |
| D7 | `leaflet-map` : `L.marker()` sans option `alt` → marqueur focusable sans nom accessible | A | `alt` français passé à `L.marker` | idem |
| D8 | `text.astro` : `size="base"` émet `'text-base text-lg'`, deux tailles concurrentes | A | ne garder que `text-lg` — **neutre au rendu** (cf. R66-4) | diff visuel nul aux 2 largeurs |
| D9 | `constants.ts` : `SITE_NAME` en apostrophe ASCII, face à des descriptions en apostrophe courbe | B | `Commun’île` | `<title>` des 8 pages |
| D10 | Débordement horizontal de **27 px** à 1280 px sur l'accueil (préexistant à l'epic) | B | `overflow-hidden` sur la section conteneuse | `scrollWidth` == `clientWidth` sur les 8 pages, 375 et 1280 px |

### Documentées, délibérément non corrigées

| # | Dette | Cercle | Raison du report |
|---|---|---|---|
| D11 | `Card`/`InfoCard` rend `bg-white` sans bordure ni ombre → invisible sur section blanche | A | Toute correction à la source change le rendu des 8 pages. Le contournement `bg-background` employé par l'epic est local et suffisant. Décision de design system, pas de polish. |
| D12 | `Card` rend systématiquement un `<article>` → plusieurs « article » annoncés d'affilée | A | Du bruit d'annonce, pas une non-conformité. Y remédier proprement demande une prop `as` et une revue de chaque appelant sur 8 pages. |
| D13 | Horaires de la boutique dupliqués entre `sibra-boutique-section` et `home-places-section` | B+C | Factoriser figerait un format typographique que la coopérative n'a pas tranché (cf. D15). À reprendre une fois #67 clos. |
| D14 | `@astrojs/sitemap` déclarée dans `package.json` sans être utilisée | — | La retirer modifie le lockfile, que la CI installe en `--frozen-lockfile`. Risque de casser la CI de l'epic pour un gain nul sur les critères de succès. |

### Renvoyées à une décision humaine

| # | Point | Nature | Ce qui est demandé |
|---|---|---|---|
| D15 | Notation horaire « 16h00 - 20h00 » vs « 16 h – 20 h » | **éditoriale** | La carte Sibra suit aujourd'hui le format des 5 autres : la grille est cohérente quelle que soit l'issue. Changer signifie harmoniser **les 6 cartes**. À trancher par la coopérative, pas par la passe technique. |
| D16 | Téléphone `06 33 01 56 63` et email `bce.brasserie@gmail.com` (source Wayback) | **gate #67** | Restent non publiés. Vérifié : aucun `tel:`/`mailto:` correspondant dans le rendu, et le JSON-LD omet déjà `telephone`/`email`. Le gate n'est pas levé ici. |
| D17 | Quais « Chanzy » / `route_ref=C1` dans OSM, non reproduit (Overpass saturé) | intrant #67 | Hors périmètre. Requête consignée dans `issues/61-boutique/research.md` § R61-2. |

## Le cas `Tag` — arbitrage explicite

`Tag` avec une couleur thémée est sous AA sur **quatre des six thèmes** du site, pas seulement sur sibra :

| Thème | Ratio pire cas | Verdict |
|---|---|---|
| la-carte-postale `primary` | 2,35 | ✗ |
| sibra `primary` / `secondary` / `tertiary` | 2,51 / 2,55 / 1,65 | ✗ |
| labo-diva `primary` | 2,65 | ✗ |
| wattignies `primary` | 3,30 | ✗ |
| bar-ile `primary` | 6,19 | ✅ |
| landes-fertiles `primary` | 5,70 | ✅ |

C'est donc une dette du **design system**, que l'epic a seulement rendue visible. Deux issues de suite
(#64, puis cette passe) l'ont rencontrée et contournée par `class="text-foreground"`.

**Décision** : remonter le contournement au composant, pour les variantes thémées uniquement
(`primary`, `secondary`, `tertiary`, `quaternary`). Justification :

- c'est la **seule** correction qui passe sur les six thèmes (la variante `-accent` ne suffit pas : 3,77 /
  3,85 / 2,37) ;
- elle ne change pas le fond, donc l'identité chromatique du composant est préservée — seul le libellé passe
  au neutre foncé ;
- elle supprime la cause de contournements locaux répétés.

**Condition** : la modification étant de cercle A, elle n'est retenue qu'après vérification visuelle des six
pages de lieux. Si le rendu se dégrade sur l'une d'elles, on revient au contournement local et la dette
repasse en « documentée » — l'arbitrage est réversible et la raison sera écrite.

**Hors périmètre** : les variantes non thémées (`blue`, `green`, `red`, `yellow`, `neutral`) ne sont pas
touchées. Elles ne dépendent pas du thème et sortent du rayon de l'epic.

## Invariants à ne pas casser

Ces propriétés tiennent aujourd'hui et doivent tenir encore après la passe. Ce sont les vraies conditions
de non-régression, plus que les gates :

1. Le texte courant du site fait **18 px** (cf. R66-4). Aucune correction ne doit le ramener à 16.
2. Les trois couleurs de la charte (`#7A9300`, `#DC5B87`, `#FEA300`) sont **inchangées**. Les corrections de
   contraste passent par la couleur de texte, jamais par la couleur de marque.
3. `package.json` et le lockfile sont **intacts** (CI en `--frozen-lockfile`).
4. Aucun numéro de téléphone ni email non confirmés n'apparaît nulle part dans le rendu.
5. Les blocs de code des artefacts de specs sont en ```` ```text ```` ; tout fichier exécutable ajouté aux
   specs passe `eslint` (précédent : `no-console`, `node/prefer-global/process`, `import/first`).
