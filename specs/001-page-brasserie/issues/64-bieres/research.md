# Research: section bières de La Sibra (issue #64)

Les décisions structurantes sont prises dans l'epic (`../../research.md`, `../../contracts/theme.md`) : palette, convention de nommage, patron de composition des sections, décision du 2026-09-18 de ne pas lier les lieux tiers. Ce document ne traite que les points d'adaptation propres à la tâche T022.

---

## R64-1 — Titre de section : `HeadingBadges` du patron copié, ou `Heading` ?

**Décision** : `Heading as="h2" size="xl" weight="bold"`, comme `sibra-what-section.astro`.

**Rationale** : le patron `landes-find-section.astro` titre ses sections avec `HeadingBadges` + trois `Badge` (`variant="primary" | "secondary" | "tertiary"`). Or `Badge variant="tertiary"` rend `bg-tertiary text-white`, c'est-à-dire du blanc sur l'orange `#FEA300` — 2,0:1, explicitement proscrit par `../../contracts/theme.md` (« Interdits sur cette page »). Reproduire le patron à trois pastilles obligerait soit à violer le contrat, soit à n'utiliser que deux variantes, ce qui casse le rythme visuel du patron. Les trois sections déjà livrées par #60 titrent en `Heading` : la page a donc déjà sa propre convention interne, cohérente.

**Alternatives considérées** :
- *Trois pastilles avec `variant="quaternary"` à la place de `tertiary`* : `quaternary` rend du blanc sur le neutre foncé — contraste correct, mais la pastille sombre tranche avec la charte à trois couleurs vives et n'apparaît nulle part ailleurs sur la page.
- *Deux pastilles seulement* : visuellement bancal par rapport au patron, sans bénéfice.
- *Ajouter une variante `Badge` sûre* : modifierait un composant partagé utilisé par les six pages de lieux — hors périmètre de l'issue, et à traiter globalement si le besoin se confirme.

---

## R64-2 — Rendre un `Tag` cliquable

**Décision** : envelopper le `Tag` dans `<Link href={PATH.LE_WATTIGNIES}>` ; ne pas transformer `Tag` en `<a>`.

**Rationale** : `src/components/tag.astro` rend un `<span>` et n'accepte pas de `href` (ses props sont `HTMLAttributes<'span'>`). L'enveloppe `Link` fournit l'élément interactif, le focus visible (`focus-visible:ring-2`) et le soulignement au survol, sans toucher au composant partagé. La cible étant `inline-block` et généreusement rembourrée (`px-3 py-2`), la zone cliquable dépasse largement le minimum de 24 × 24 px recommandé par WCAG 2.2.

**Alternatives considérées** :
- *Ajouter une prop `href` à `Tag` et rendre conditionnellement `<a>`* : modification d'un composant partagé pour un besoin ponctuel — rejeté (périmètre, YAGNI).
- *Poser `class="hover:underline"` sur le `Tag` et le laisser inerte* : trompeur, un élément qui a l'air cliquable doit l'être.

---

## R64-3 — Lisibilité du `Tag color="neutral"` : quel fond de section ?

**Décision** : `Section` avec la variante par défaut (`bg-white`).

**Rationale** : `Tag color="neutral"` rend `bg-background text-foreground`, et `--background` vaut `oklch(96.8% 0.007 247.896)` — exactement la couleur de fond du `<body>` (`class="… bg-background …"`). Sur une section transparente, les trois étiquettes des lieux tiers seraient donc invisibles (même couleur que la page). Sur le blanc de la variante par défaut, elles se détachent nettement, et le texte `foreground` (quasi noir) y reste à un contraste très supérieur à 4,5:1. Le blanc alterne par ailleurs avec le vert de la section « c'est quoi ? » qui précède, et prépare l'insertion des sections boutique (#61) et tireuse (#65).

**Alternatives considérées** :
- *`Section class="bg-transparent"` comme le patron copié* : la page Les Landes Fertiles n'utilise pas de `Tag` neutre dans cette section, le problème ne s'y pose pas. Rejeté ici pour la raison ci-dessus.
- *Tags en `color="secondary"` pour les lieux tiers* : lisibles partout, mais le rose signale alors un lieu tiers aussi fortement que le vert signale un lieu de la coopérative — la hiérarchie voulue par le data-model de l'epic (`primary` vs `neutral`) disparaît.

---

## R64-4 — Cadrage de la photo de brassage (format portrait)

**Décision** : colonne image en `md:items-stretch`, `<Image>` en `h-full object-cover` avec un plafond de hauteur explicite (`max-h-[560px]`) et une largeur maximale (`max-w-[460px]`).

**Rationale** : les trois photos livrées par #59 sont en 1600 × 2131 (portrait). Le patron copié suppose des photos paysage : appliqué tel quel, il produit une colonne image nettement plus haute que la colonne texte — c'est précisément le défaut constaté sur la section « c'est quoi ? » livrée par #60 et laissé en arbitrage. En bornant la hauteur et en recadrant (`object-cover`), la section reste équilibrée aux deux largeurs sans toucher aux fichiers images ni à la section de #60.

**Alternatives considérées** :
- *Re-générer une version paysage de la photo* : c'est l'arbitrage de design en attente côté #60/#66, il concerne les trois photos et dépasse le périmètre de cette issue.
- *Laisser la photo à sa hauteur naturelle* : reproduirait sciemment le défaut connu.

---

## R64-5 — Icônes des deux blocs

**Décision** : `glass-water` pour la gamme permanente, `sparkles` pour les brassins éphémères — toutes deux déjà présentes dans `src/utils/icons.ts`.

**Rationale** : le verre rempli évoque une bière servie au quotidien (permanence) ; les étincelles évoquent la nouveauté et la surprise (« inédites, surprenantes »). Aucun ajout au registre d'icônes partagé n'est nécessaire, ce qui respecte la borne de périmètre du plan.

**Alternatives considérées** : `glasses` (deux verres) pour la gamme — trop proche visuellement de `glass-water` et déjà employé ailleurs pour la convivialité ; `grape`/`sprout` — connotation vin/maraîchage, hors sujet.

---

## R64-6 — Restitution du « … » de la liste des lieux

**Décision** : un `Text` « … et bien d'autres » placé **après** la liste, hors du `<ul>`.

**Rationale** : le texte source se termine par « Le Wattignies, L'industrie, Ohmtown, Pioche, … ». Reproduire le « … » comme cinquième `<li>` le ferait annoncer comme un lieu par un lecteur d'écran et fausserait le comptage d'éléments de la liste. Une phrase distincte transmet la même information (liste ouverte, FR-014 de l'epic) sans polluer la sémantique.

**Alternatives considérées** : un cinquième `Tag` « … » (rejeté, cf. ci-dessus) ; ne rien afficher (rejeté : l'epic exige explicitement que la non-exhaustivité soit lisible).

---

## R64-7 — Défaut connu, laissé intact

`src/components/text.astro` émet `'text-base text-lg'` pour `size="base"` : les deux classes coexistent et la dernière déclarée dans la feuille compilée gagne. C'est un défaut préexistant du composant partagé, déjà constaté lors de #60, qui affecte les six pages de lieux. Il **n'est pas corrigé ici** : le corriger changerait la taille du texte courant sur tout le site, ce qui n'a pas sa place dans une issue de contenu. À traiter globalement (candidat pour #66 ou une issue dédiée).
