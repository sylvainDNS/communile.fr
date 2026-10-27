# Contrat : composants de section de l'issue #60

Interfaces internes exposées par cet incrément. Les contrats de thème et de route/SEO restent ceux de l'epic : [`../../../contracts/theme.md`](../../../contracts/theme.md), [`../../../contracts/page-et-seo.md`](../../../contracts/page-et-seo.md).

## Fichiers livrés

| Fichier | Props | Consommateur |
|---|---|---|
| `src/features/sibra/sections/sibra-hero-section.astro` | aucune | `src/pages/la-sibra.astro` |
| `src/features/sibra/sections/sibra-what-section.astro` | aucune | `src/pages/la-sibra.astro` |
| `src/features/sibra/sections/sibra-instagram-section.astro` | aucune | `src/pages/la-sibra.astro` |

Aucune prop : comme les sections des cinq autres lieux, le contenu est porté par le composant lui-même. Aucun export nommé, aucun script client.

## Contrat DOM et classes

### `sibra-hero-section.astro`

```text
<Section class="relative overflow-hidden bg-white">
  ├── <SibraHeroDeco aria-hidden class="absolute top-0 left-0 hidden w-[300px] md:block text-secondary-accent">
  ├── <SibraHeroDeco aria-hidden class="absolute bottom-0 right-0 hidden w-[300px] rotate-180 md:block text-primary-accent">
  └── <Container>
        └── bloc placeholder logo (précédé du commentaire « TODO logo : … »)
              ├── <svg aria-hidden focusable="false"> 3 cercles en classes fill-tertiary | fill-secondary | fill-primary
              └── <p> « La Sibra » — font-pally, gras, centré (PAS un titre)
        └── <h1 class="text-center font-pally text-4xl font-bold md:text-5xl"> « De l’houblon à la pression »
```

Invariants :

- exactement **un** `h1` dans toute la page, porté par cette section ;
- toute décoration est `aria-hidden="true"` et masquée sous le point de rupture `md` ;
- fond blanc (`bg-white`) : aucune règle de contraste de la charte ne s'y applique, le texte est en `foreground`.

### `sibra-what-section.astro`

```text
<Section variant="primary" class="overflow-hidden">
  ├── <SibraWhatOrnament aria-hidden class="absolute bottom-0 left-0 text-primary-accent">
  └── <Container class="relative z-20 grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
        ├── colonne texte
        │     ├── <Heading as="h2" color="white">        titre
        │     ├── <Text size="xl" weight="semibold" color="white">   accroche
        │     ├── <Text size="base">                      présentation  (couleur héritée = foreground)
        │     ├── <Text font="pally" size="xl" weight="semibold">     sens du projet
        │     └── <Text size="base">  disponibilité + 2 <Link href={PATH.*}>
        └── colonne image
              └── <Image src={sibraBoutique} widths=[…] alt="…">
```

Invariants :

- le conteneur de la colonne texte **ne porte pas** `text-white` ; le blanc est appliqué élément par élément, aux seuls éléments de grand texte (`Heading`, `Text size="xl" weight="semibold"`) — voir research R60-2 ;
- aucun `Text size="base" color="white"` sur cette section ;
- aucun `Badge variant="tertiary"` nulle part sur la page ;
- l'ornement est derrière le contenu (`z-20` sur le conteneur) et ne reçoit pas de texte ;
- tous les liens internes passent par `PATH.*` de `src/utils/constants.ts`.

### `sibra-instagram-section.astro`

```text
<Section class="py-24">
  └── <Container class="grid grid-cols-1 gap-6">
        ├── <h2 class="mb-2 font-pally text-4xl font-bold"> « Retrouvez-nous sur Instagram »
        └── <InstagramFeed username="bieresdecharlotte">
```

Invariant : structure identique aux cinq sections Instagram existantes (cohérence, principe V).

## Contrat de la page `src/pages/la-sibra.astro`

- `Layout theme="sibra"` et `content={{ title: 'La Sibra', description }}` **inchangés** (la version définitive des métadonnées relève de #63) ;
- corps = les trois sections, dans l'ordre hero → what → instagram ;
- le bloc `TODO #60` et les imports de SVG qu'il utilisait sont supprimés de la page (ils vivent désormais dans les sections).

## Invariants transverses (vérifiables)

| Invariant | Vérification |
|---|---|
| Un seul `h1`, pas de saut de niveau | inspection du DOM rendu |
| Aucun téléphone ni email dans le rendu | `grep` sur le HTML produit (`06`, `@gmail`, `tel:`, `mailto:`) |
| Aucune URL interne en dur | `grep` de `href="/` dans les sections de la feature |
| Contrastes conformes | couples texte/fond limités à ceux listés dans le contrat de thème |
| Pas de JS ajouté | aucune balise `<script>` dans les trois sections |
