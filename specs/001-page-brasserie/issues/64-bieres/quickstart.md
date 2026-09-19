# Quickstart : vérifier la section bières de La Sibra (issue #64)

Guide de validation de bout en bout de l'incrément T022. À dérouler entièrement avant d'ouvrir la PR vers la branche epic.

## Prérequis

- Node ≥ 21, dépendances déjà installées (`node_modules/` présent).
- Branche `001-page-brasserie-bieres`, partie de `001-page-brasserie` à jour.

> ⚠️ `pnpm` est cassé sur le poste de développement de référence (corepack résout une version dont le gate `approve-builds` bloque `esbuild`/`sharp`/`workerd`) et génère un `pnpm-workspace.yaml` parasite à la racine. Invoquer les binaires directement, comme ci-dessous. La CI, elle, reste sur ses scripts habituels.

## 1. Gates automatiques

```bash
./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css   # exit 0 attendu
./node_modules/.bin/astro check                          # 0 error
./node_modules/.bin/astro build                          # build vert
```

## 2. Vérifications de contenu (principe I — exactitude)

Ouvrir `brasserie-assets/Texte site internet.md` à côté de la section et confirmer :

- [ ] les deux titres de bloc sont « Des recettes classiques indémodables » et « Des brassins éphémères saisonniers » ;
- [ ] le bloc permanent cite Blonde, Ambrée, Triple, Blanche, la « blonde de soif », la Carlota, l'héritage de Charlotte et les 15 ans ;
- [ ] le bloc éphémère cite le brasseur Simon et les bières « inédites, surprenantes mais toujours délicieuses » ;
- [ ] la liste des lieux est exactement Le Wattignies, L'industrie, Ohmtown, Pioche — dans cet ordre, dans cette orthographe ;
- [ ] la mention « … et bien d'autres » est présente ;
- [ ] aucune bière, aucun lieu, aucune caractéristique absente du texte source n'a été ajouté ;
- [ ] aucun numéro de téléphone ni email n'apparaît dans la section (gate #67).

## 3. Vérifications de liens

```bash
grep -nE 'href' src/features/sibra/sections/sibra-bieres-section.astro
```

- [ ] un seul `href`, valant `PATH.LE_WATTIGNIES` (référence importée, pas d'URL littérale) ;
- [ ] aucun `http`, `tel:` ou `mailto:` ;
- [ ] dans le navigateur, seul « Le Wattignies » est cliquable et mène à `/le-wattignies`.

## 4. Vérification visuelle

```bash
./node_modules/.bin/astro dev        # puis ouvrir /la-sibra
```

**À 375 px de large** :

- [ ] aucune barre de défilement horizontale sur la page ;
- [ ] les deux cartes s'empilent, leurs textes ne débordent pas ;
- [ ] la photo de brassage reste d'une hauteur raisonnable (recadrée, pas de colonne interminable) ;
- [ ] les quatre étiquettes de lieux passent à la ligne proprement et restent lisibles ;
- [ ] les étiquettes des lieux tiers se distinguent du fond blanc de la section.

**À ≥ 1280 px** :

- [ ] texte et photo sont côte à côte, la colonne image ne dépasse pas la colonne texte ;
- [ ] le rythme des sections reste cohérent : hero (blanc) → présentation (vert) → bières (blanc) → Instagram ;
- [ ] la section ne détonne pas à côté des cinq autres pages de lieux.

## 5. Accessibilité

- [ ] la section ajoute exactement un `h2` ; le bloc revendeurs est un `h3` ; la page garde un `h1` unique ;
- [ ] les lieux sont annoncés comme une liste de 4 éléments par un lecteur d'écran ;
- [ ] la photo porte un `alt` français descriptif ;
- [ ] le lien « Le Wattignies » est atteignable au clavier et son anneau de focus est visible ;
- [ ] aucun texte blanc sur fond brut de la charte, aucun texte blanc sur l'orange (contrat de thème de l'epic).

## 6. Périmètre

```bash
git diff --stat 001-page-brasserie...
```

- [ ] seuls `src/features/sibra/sections/sibra-bieres-section.astro`, `src/pages/la-sibra.astro` et les artefacts `specs/001-page-brasserie/issues/64-bieres/` apparaissent ;
- [ ] aucun fichier de `.claude/`, aucun `pnpm-workspace.yaml`, aucun fichier temporaire à la racine.
