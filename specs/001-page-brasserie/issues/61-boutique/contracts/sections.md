# Contrat : `sibra-boutique-section.astro` et `sibra-infos-section.astro`

Les contrats de l'epic restent applicables tels quels : [`../../../contracts/theme.md`](../../../contracts/theme.md) (sous réserve des ratios recalculés en [research.md § R61-3](../research.md)) et [`../../../contracts/page-et-seo.md`](../../../contracts/page-et-seo.md).

## Fichiers

- `src/features/sibra/sections/sibra-boutique-section.astro` (nouveau)
- `src/features/sibra/sections/sibra-infos-section.astro` (nouveau)
- Nommage : préfixe `sibra-` **sans article** (convention R1 de l'epic) ; l'article n'est conservé que pour ce qui dérive de l'URL (`/la-sibra`, `PATH.LA_SIBRA`, `la-sibra.astro`).
- **Aucune prop** : les sections sont autonomes, leurs contenus sont des constantes locales.

---

## `sibra-boutique-section.astro`

### Structure DOM attendue

```text
<section>                              Section variant="tertiary" (fond orange)
  └ <div container>                    Container, grille 1 col → 2 cols à md, items-stretch à md
      ├ colonne texte
      │   ├ <h2>                       Heading « La boutique », text-foreground
      │   ├ <p>                        phrase du texte source, adresse « au 121 rue du Général Buat »
      │   ├ <article carte blanche>    Card (bg-white par défaut — voulu ici)
      │   │   └ <dl>                   un <div> par jour : <dt>jour</dt> <dd>plage</dd>
      │   └ <p>                        goûter / discuter avec le brasseur / bouteilles ouvertes
      └ colonne image
          └ <img>                      sibra-bouteilles.webp, alt FR, lazy, colonne bornée
```

### Invariants

**Contraste** — fond `tertiary` orange `#FEA300`

- **Zéro texte blanc** dans cette section, quelle que soit sa taille : 2,01:1 contre l'orange, très en dessous même du seuil « grand texte » (3:1). Aucune exception.
- Tout le texte posé sur l'orange est en `text-foreground` → **9,85:1**.
- Le texte de la carte blanche est en `text-foreground` → 19,79:1.
- `Badge variant="tertiary"` et `Tag color="tertiary"` restent proscrits.

**Accessibilité**

- Exactement un `h2` ; aucun saut de niveau ; la page conserve son `h1` unique (dans le hero).
- Les horaires sont dans un `<dl>` : chaque jour est un `<dt>`, sa plage le `<dd>` qui suit immédiatement. La relation ne repose **pas** sur la mise en page.
- L'image porte un `alt` en français, descriptif — ce n'est pas une image décorative.
- **Aucun élément interactif** dans la section : ni `<a>`, ni `<button>`, ni `tabindex`.

**Contenu**

- Exactement **deux** horaires : vendredi 16 h – 20 h, samedi 11 h – 20 h. Aucun autre jour, pas même sous la forme « fermé ».
- L'adresse apparaît sous la formulation du texte source (« au 121 rue du Général Buat ») ; l'adresse postale complète est du ressort de la section infos.
- Les trois propositions du texte source sont présentes : goûter les nouveautés et les classiques, en discuter avec le brasseur, quelques bouteilles toujours ouvertes dans le frigo.
- Zéro numéro de téléphone, zéro email, zéro `tel:`, zéro `mailto:` (gate #67).
- Aucune information non issue du texte source (moyens de paiement, parking, accessibilité, dégustation payante…).

**Mise en page**

- Photo en portrait (1600 × 2131) → colonne bornée : `md:items-stretch` sur la grille, `h-full max-h-[560px] max-w-[460px] object-cover` sur l'image, `widths` + `sizes` calés sur la colonne (patron `sibra-bieres-section.astro`).
- Aucun ornement SVG : la section porte des horaires et une adresse en petit corps ; l'incident de #65 (ornement semi-transparent sous du texte courant) est évité par construction.

---

## `sibra-infos-section.astro`

### Structure DOM attendue

```text
<section>                              Section variant="accent" (fond vert foncé #5E7500)
  └ <div container>                    Container, grille 1 col → 2 cols à lg
      ├ colonne infos
      │   ├ <h2>                       Heading « Infos pratiques », color="white"
      │   ├ <h3>                       « Adresse », blanc
      │   ├ <address class="not-italic">  La Sibra / 121 rue du Général Buat / 44000 Nantes
      │   ├ <h3>                       « Se repérer », blanc
      │   └ <ul>                       un <li> par repère vérifié (2 entrées)
      └ colonne carte
          └ LeafletMap                 center + marker sur le point géocodé, molette désactivée
```

### Invariants

**Contraste** — fond `accent` = `primary-accent` vert foncé `#5E7500`

- **Tout le texte est blanc** → 5,25:1, conforme AA **pour du texte courant** : la règle « grand texte » n'a pas à être invoquée.
- **`text-foreground` est interdit** sur ce fond : 3,77:1, sous le seuil 4,5:1 pour du texte courant (constat de cette issue, absent du contrat de l'epic).
- Aucune `Card` : sur ce fond, une carte claire imposerait de repasser en `text-foreground` et casserait l'uniformité ; le contenu est posé directement sur le fond.

**Accessibilité**

- Exactement un `h2` ; les deux `h3` en dépendent — aucun saut de niveau.
- L'adresse postale est dans un `<address>`, avec `not-italic` pour neutraliser l'italique par défaut du navigateur.
- Les repères sont dans un `<ul>` avec un `<li>` par repère.
- **Pas d'icône** dans la liste des repères : le jeu d'icônes partagé (`src/utils/icons.ts`) n'en contient aucune pertinente (ni épingle, ni bus, ni édifice) et l'enrichir modifierait un fichier partagé, hors périmètre (FR-026). Les repères sont purement textuels.
- La carte est **supplémentaire** : l'adresse textuelle en est l'équivalent, affichée dans la même section. Si le chargement échoue, l'information de localisation reste intégralement disponible.
- **Aucun élément interactif ajouté par la section** ; les commandes de la carte appartiennent au composant partagé.

**Carte**

- `center` et `markers[0].position` = `[47.225406, -1.543878]` — valeur unique, écrite une seule fois dans une constante locale et réutilisée aux deux endroits.
- `zoom={16}` ; `scrollWheelZoom={false}` (la carte ne capte pas le défilement de la page) ; `height="400px"` (valeur du patron `contact.astro`).
- `id` unique sur la page : `sibra-infos-map`.
- Infobulle du repère : nom du lieu + adresse. **Jamais** de téléphone ni d'email.
- `errorText` francisé, renvoyant à l'adresse affichée dans la section.
- La carte reste dans son conteneur à toutes les largeurs — aucun débordement horizontal de la page.

**Contenu**

- Seuls les repères **re-vérifiés** sont affichés (cf. [data-model.md](../data-model.md)) : les deux églises et l'arrêt « Chanzy ». Le numéro de ligne « Chronobus C1 » est retiré.
- Zéro numéro de téléphone, zéro email, zéro `tel:`, zéro `mailto:` (gate #67), y compris dans l'infobulle de la carte.

---

## Périmètre technique commun

- Fichiers touchés : les deux sections (nouvelles) et `src/pages/la-sibra.astro` (deux imports + deux insertions).
- **Aucun** composant partagé créé ou modifié — en particulier `src/components/leaflet-map.astro` est utilisé tel quel, et `src/utils/icons.ts` n'est pas enrichi.
- Aucune dépendance ajoutée, aucun JavaScript écrit, aucun asset ajouté, aucune retouche de `src/styles/global.css`.
- Import des composants par l'alias `@/`, import de l'image en chemin relatif `../images/…` (patron des sections existantes).

## Intégration dans la page

Dans `src/pages/la-sibra.astro` :

```text
<SibraHeroSection />
<SibraWhatSection />
<SibraBoutiqueSection />     ← nouveau (après « c'est quoi ? »)
<SibraBieresSection />
<SibraTireuseSection />
<SibraInfosSection />        ← nouveau (avant le fil Instagram)
<SibraInstagramSection />
```

Les imports restent triés alphabétiquement (règle ESLint `perfectionist` en vigueur dans le dépôt). L'ordre obtenu est celui énuméré par la structure de fichiers de [`../../../plan.md`](../../../plan.md).
