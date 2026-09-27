# Contrat : section bières de La Sibra (issue #64)

Complète les contrats de l'epic : [`../../../contracts/theme.md`](../../../contracts/theme.md) (couleurs et contrastes) et [`../../../contracts/page-et-seo.md`](../../../contracts/page-et-seo.md) (route et métadonnées). Ce contrat décrit le seul composant créé par l'issue et son point d'insertion.

## `src/features/sibra/sections/sibra-bieres-section.astro`

**Props** : aucune. La section est autonome ; ses contenus sont des constantes locales (voir [`../data-model.md`](../data-model.md)).

**Imports autorisés** : `astro:assets` (`Image`), `@/components/{section,container,heading,text,info-card,icon,tag,link}.astro`, `@/utils/icons`, `@/utils/constants` (`PATH`), `../images/sibra-brassage.webp`. Aucun autre import, aucune dépendance npm.

### Structure DOM attendue

```text
<Section>                                   variante par défaut → bg-white (research R64-3)
  <Container>                               grille 1 colonne ; md: 2 colonnes
    ├── colonne texte (ordre 1 en mobile)
    │   ├── <Heading as="h2" size="xl" weight="bold">Nos bières</Heading>
    │   └── 2 × <InfoCard class="bg-background">  slots icon / title / description (Card rend `bg-white`,
    │                                       invisible sur la section blanche : ni ombre ni bordure)
    └── colonne image (ordre 2 en mobile)
        └── <Image src={sibraBrassageImage} alt="…" loading="lazy" />
  <Container>                               pied de section — bloc revendeurs
    ├── <Heading as="h3" size="base">Où retrouver nos bières ?</Heading>
    ├── <ul role="list"> → 4 × <li>       (`list-none` retire le rôle de liste sous Safari/VoiceOver)
    │     ├── Le Wattignies : <Link href={PATH.LE_WATTIGNIES}><Tag color="primary" class="text-foreground">…</Tag></Link>
    │     └── autres        : <Tag color="neutral">…</Tag>
    └── <Text>… et bien d'autres</Text>
```

### Invariants

| # | Invariant | Vérification |
|---|---|---|
| C-01 | Exactement un `h2` ajouté à la page ; le bloc revendeurs est un `h3` (pas de saut de niveau) | inspection du DOM |
| C-02 | La page conserve un `h1` unique | inspection du DOM |
| C-03 | La photo porte un `alt` en français décrivant la scène, non vide | inspection du DOM |
| C-04 | La photo est servie via `<Image>` avec `widths` et `sizes`, et `loading="lazy"` | lecture du source |
| C-05 | Les lieux sont dans un `<ul>` avec un `<li>` par lieu, sans `<li>` supplémentaire | inspection du DOM |
| C-06 | Un seul `<a>` dans la section, `href` = `PATH.LE_WATTIGNIES`, valeur importée et non littérale | `grep` du source + inspection du DOM |
| C-07 | Aucun `href` commençant par `http`, `tel:` ou `mailto:` dans la section | `grep` du source |
| C-08 | Aucun `Badge`, aucun `variant="tertiary"`, aucun `color="white"` sur fond brut | `grep` du source |
| C-09 | Aucun `fill="var(--color-…)"` (la section n'introduit aucun SVG ; invariant préventif de l'epic) | `grep` du source |
| C-10 | Les noms de bières et de lieux affichés sont exactement ceux du texte source | relecture croisée |
| C-11 | La colonne image ne dépasse pas la colonne texte à ≥ 1280 px et ne provoque aucun débordement à 375 px | vérification visuelle |
| C-12 | Le nom de fichier est `sibra-bieres-section.astro` — préfixe sans article (convention R1 de l'epic) | arborescence |

### Classes de thème utilisées

| Élément | Classe / prop | Contraste |
|---|---|---|
| Fond de section | `Section` par défaut → `bg-white` | — |
| Titres et textes | `text-foreground` (défaut hérité du `<body>`) sur blanc | ≥ 15:1 |
| `Tag color="primary"` | dégradé clair + `text-foreground` | ≥ 14:1 — ⚠️ le `text-primary` par défaut du composant (vert `#7A9300` sur son propre dégradé clair) ne donne que 2,5 à 3,0:1, sous le seuil AA ; le 5,1:1 du contrat de thème vaut pour `foreground` sur le vert **plein**, pas pour ce couple |
| `Tag color="neutral"` | `bg-background text-foreground` | ≥ 14:1, et se détache du blanc de la section |
| Cartes `InfoCard` | `bg-background` (surcharge de `bg-white` via `Card`) sur section blanche | — ; `Card` n'a ni ombre ni bordure, donc `bg-white` sur `bg-white` ne se distinguerait pas |

Aucune couleur n'est ajoutée à `src/styles/global.css` ; aucune valeur hexadécimale n'apparaît dans le composant.

## `src/pages/la-sibra.astro`

**Modification** : ajout de l'import `SibraBieresSection` et de `<SibraBieresSection />` entre `<SibraWhatSection />` et `<SibraInstagramSection />`.

**Invariants** :

| # | Invariant | Vérification |
|---|---|---|
| P-01 | Ordre final : hero → what → **bieres** → instagram | lecture du source |
| P-02 | Aucune autre modification de la page (titre, description, `theme`, JSON-LD inchangés) | `git diff` |
| P-03 | Les imports restent triés selon la règle ESLint `perfectionist` du dépôt | `eslint` |
