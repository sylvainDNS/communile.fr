# Contrat : `sibra-tireuse-section.astro`

Les contrats de thème et de route/SEO de l'epic restent applicables tels quels : [`../../../contracts/theme.md`](../../../contracts/theme.md), [`../../../contracts/page-et-seo.md`](../../../contracts/page-et-seo.md).

## Fichier

- Chemin : `src/features/sibra/sections/sibra-tireuse-section.astro`
- Nommage : préfixe `sibra-` **sans article** (convention R1 de l'epic) ; l'article n'est conservé que pour ce qui dérive de l'URL (`/la-sibra`, `PATH.LA_SIBRA`, `la-sibra.astro`).
- **Aucune prop** : la section est autonome, ses contenus sont des constantes locales.

## Structure DOM attendue

```text
<section>                                   Section variant="secondary" (fond rose), overflow masqué
  └ svg ornement                            sibra-what-ornament.svg, aria-hidden, text-secondary-accent
  └ <div container>                         Container, positionné au-dessus de l'ornement
      ├ <h2>                                Heading blanc, grand texte (bold)
      ├ <p>                                 principe + condition + amorce d'exemples, en text-foreground
      ├ <ul role="list">                    trois occasions
      │   └ <li> × 3 → carte claire         Card bg-background : Icon (décoratif) + libellé
      └ <p>                                 invitation à appeler, blanche, size="xl" weight="bold"
```

## Invariants

**Accessibilité**
- Exactement un `h2` ; aucun saut de niveau de titre ; la page conserve un `h1` unique (dans le hero).
- Les occasions sont dans un `<ul role="list">` avec un `<li>` par occasion.
- Les icônes sont décoratives (`Icon` sans `title` → `aria-hidden="true"`), le sens est porté par le libellé.
- L'ornement SVG porte `aria-hidden="true"`.
- **Aucun élément interactif** : ni `<a>`, ni `<button>`, ni `tabindex`. Une section sans lien est acceptable ici ; un faux bouton ne l'est pas.

**Contraste (contrat de thème)**
- Fond `secondary` rose `#DC5B87` : blanc autorisé **uniquement** en grand texte — `Heading` (≥ 24 px) et `Text size="xl" weight="bold"` (20 px en graisse 700 sous `md`, ≥ 18,66 px). `weight="semibold"` est **interdit** pour du blanc.
- Texte courant : `text-foreground` sur le rose (5,5:1) ou sur les cartes claires.
- Interdits : `Text size="base" color="white"` sur le fond de marque ; `Badge variant="tertiary"` ; toute utilisation de blanc sur `tertiary`.
- Aucune retouche des teintes de `src/styles/global.css`.

**Contenu**
- Zéro numéro de téléphone, zéro email, zéro `tel:`, zéro `mailto:` (gate #67).
- Zéro condition commerciale absente du texte source.
- Exactement trois occasions, dans l'ordre du texte source, **introduites comme des exemples** : le paragraphe
  qui précède la liste se termine par une amorce (« Par exemple : ») pour que la liste ne se lise pas comme
  limitative (spec.md FR-003, data-model.md).

**Périmètre technique**
- Fichiers touchés : `src/features/sibra/sections/sibra-tireuse-section.astro` (nouveau) et `src/pages/la-sibra.astro` (une ligne d'import + une ligne d'insertion).
- Aucun composant partagé créé ou modifié ; aucune dépendance ajoutée ; aucun JavaScript client ; aucun asset ajouté.
- Import des composants par l'alias `@/`, import de l'ornement en chemin relatif `../images/…` (patron des sections existantes).

## Intégration dans la page

Dans `src/pages/la-sibra.astro`, `<SibraTireuseSection />` se place entre `<SibraBieresSection />` et `<SibraInstagramSection />`. Les imports restent triés alphabétiquement (règle ESLint `perfectionist` en vigueur dans le dépôt).
