# Data Model: Préparer sa visite à La Sibra (issue #61)

Pas de base de données (constitution, principe II). Les « entités » sont des constantes locales aux deux composants de section, sur le patron des sections déjà livrées de la feature. Ce document fixe les valeurs exactes et leur emplacement ; il précise et complète, sans le contredire, le [data-model de l'epic](../../data-model.md).

## Entité : Horaire de boutique

Constante locale de `src/features/sibra/sections/sibra-boutique-section.astro`.

| Champ | Type | Notes |
|---|---|---|
| `jour` | `string` | Libellé du jour, capitale initiale |
| `plage` | `string` | Plage horaire déjà typographiée (tiret demi-cadratin `–`, espaces ordinaires — cf. note ci-dessous) |

```ts
interface Horaire { jour: string, plage: string }

const horaires: Horaire[] = [
  { jour: 'Vendredi', plage: '16 h – 20 h' },
  { jour: 'Samedi', plage: '11 h – 20 h' },
]
```

- **Source de vérité** : `brasserie-assets/Texte site internet.md`, version du 2026-09-18 (« ouverte le vendredi de 16h à 20h et le samedi de 11h à 20h »).
- **Exactement deux entrées.** Aucun autre jour ne doit apparaître, même sous la forme « fermé » : le texte source ne dit rien des autres jours.
- Les horaires de l'archive Wayback (mercredi–vendredi 17 h 30–19 h 30) sont **périmés** et ne doivent jamais être utilisés.
- Rendu en `<dl>` : `<dt>{jour}</dt>` / `<dd>{plage}</dd>`, un couple par entrée (FR-004).
- **Espaces ordinaires, pas d'espace insécable.** La typographie française voudrait U+00A0 avant « h », mais le dépôt n'en contient aucun dans `src/` : il utilise l'entité `&nbsp;` dans le balisage (`src/pages/404.astro:25`), ce qui est inopérant dans une chaîne interpolée par Astro (elle serait affichée littéralement). Introduire U+00A0 ferait de cette chaîne la seule du dépôt à en contenir, pour un gain nul en pratique : « 16 h – 20 h » rendu en `text-2xl` dans une carte `w-fit` ne se coupe à aucune largeur testée.

## Entité : Localisation

Valeurs en dur dans `src/features/sibra/sections/sibra-infos-section.astro`.

| Champ | Valeur | Statut | Source |
|---|---|---|---|
| Nom du lieu | La Sibra | ✅ confirmé | décision du 2026-09-18 (epic) |
| Rue | 121 rue du Général Buat | ✅ confirmé | texte source du 2026-09-18 |
| Code postal + ville | 44000 Nantes | ✅ confirmé | texte source + BAN |
| Latitude | `47.225406` | ✅ vérifié, deux sources | BAN `44109_3556_00121`, recoupé par Nominatim inverse |
| Longitude | `-1.543878` | ✅ vérifié, deux sources | idem |

- L'adresse est **rendue deux fois** sur la page, sous deux formes qui ne doivent pas se contredire :
  - section boutique — formulation du texte source, dans la phrase : « au 121 rue du Général Buat » ;
  - section infos — adresse postale complète dans un `<address class="not-italic">` : `La Sibra` / `121 rue du Général Buat` / `44000 Nantes`.
- Le couple latitude/longitude alimente `LeafletMap` (`center` **et** `markers[0].position`). **Il est aussi la valeur attendue par l'issue #63** pour le champ `geo` du JSON-LD `Brewery` : #63 doit la reprendre d'ici, sans re-géocoder.
- Le texte de l'infobulle du repère reprend le nom du lieu et l'adresse, jamais une coordonnée de contact.

## Entité : Repère d'accès

Constante locale de `sibra-infos-section.astro`. Chaque repère est **affiché seulement s'il a été re-vérifié** (FR-020).

| Repère | Affiché ? | Statut de vérification |
|---|---|---|
| Entre les églises Saint-Clément et Saint-Donatien | ✅ oui | Re-vérifié : Saint-Donatien ≈ 445 m au nord-est, Saint-Clément ≈ 500 m au sud-ouest (OpenStreetMap) |
| Arrêt de bus « Chanzy », à moins de 200 m | ✅ oui | Arrêt re-vérifié (quai le plus proche ≈ 170 m, OpenStreetMap) |
| Numéro de ligne « Chronobus C1 » | ❌ non | Non re-vérifiable depuis l'environnement de développement → retiré (écart E2, à valider par l'humain) |

```ts
const reperes: string[] = [
  'Entre les églises Saint-Clément et Saint-Donatien',
  'Arrêt de bus « Chanzy », à moins de 200 m',
]
```

Le repère est un **simple libellé** : pas de champ `icon`. Le jeu d'icônes partagé (`src/utils/icons.ts`) ne contient ni épingle, ni bus, ni édifice, et l'enrichir modifierait un fichier partagé — hors périmètre (FR-026). Le sens est donc intégralement porté par le texte, ce qui est de toute façon la situation la plus sûre pour les technologies d'assistance.

## Entité : Photo

| Champ | Valeur |
|---|---|
| Fichier | `src/features/sibra/images/sibra-bouteilles.webp` (existant, **non modifié**) |
| Dimensions | 1600 × 2131 — **portrait** |
| Section | boutique, colonne de droite sur desktop |
| Texte alternatif | descriptif, en français, décrivant les bouteilles de La Sibra en rayon |
| Chargement | `loading="lazy"`, `widths` + `sizes` calés sur la colonne (patron `sibra-bieres-section.astro`) |

Le format portrait impose de borner la colonne image (`md:items-stretch` + `h-full max-h-[560px] max-w-[460px] object-cover`), sans quoi elle écrase la colonne de texte sur desktop.

## Coordonnées gelées par le gate #67

| Donnée | Valeur connue (archive) | Dans cet incrément |
|---|---|---|
| Téléphone | 06 33 01 56 63 / `tel:+33633015663` | **Absent** — aucune occurrence dans le code |
| Email | bce.brasserie@gmail.com | **Absent** — aucune occurrence dans le code |
| Ligne de bus | Chronobus C1 | **Absent** — seul l'arrêt est cité |

Aucun élément interactif ne les remplace : pas de bouton désactivé, pas de lien sans destination (FR-019). Leur ajout, une fois confirmés, se limite à une constante locale et à quelques lignes de rendu dans `sibra-infos-section.astro`.

## Transitions d'état

Contenu statique — pas d'état applicatif. Un seul jalon documentaire : **téléphone / email / ligne de bus non confirmés → confirmés par la coopérative** (gate #67), condition de mise en production de la page, sans effet sur cet incrément.

## Signalements (hors périmètre, à valider par l'humain)

Relevés en recalculant les contrastes (cf. [research.md § R61-3](./research.md)). **Aucun n'est corrigé par cette issue** — le contrat de l'epic n'est pas modifié ici.

1. `../../contracts/theme.md` ligne 44 : `tertiary-accent` `#DC8300` / blanc annoncé à 3,0:1 ; réel **2,88:1**. La règle « texte blanc en grand texte uniquement » qui en découle produit du **non conforme AA**. Déjà signalé par #65, toujours en l'état.
2. `../../contracts/theme.md` ligne 43 : `Tag color="tertiary"` présenté comme valide ; il rend du texte orange sur fond clair, soit ≈ **1,83:1** sur `background`.
3. `../../contracts/theme.md` lignes 39/41 : la colonne `foreground` est sous-estimée d'environ 10 % (5,1 / 5,0 / 8,9 annoncés contre 5,66 / 5,55 / 9,85 réels). Sans danger, mais faux.
4. **Nouveau** : le contrat ne documente pas `text-foreground` sur `primary-accent` (**3,77:1**) ni sur `secondary-accent` (**3,67:1**). Les deux sont **sous AA pour du texte courant** et devraient être explicitement interdits.

### Défauts du composant partagé `src/components/leaflet-map.astro`

Relevés en revue de code sur la PR #73 et **re-vérifiés indépendamment** (calcul de contraste, lecture du source). Ils sont **pré-existants** : ils affectent déjà `/contact` en production. Aucun n'est corrigé ici — modifier un composant partagé est hors périmètre (FR-026) et ferait porter à cette issue un risque de régression sur une autre page. **À traiter par une issue dédiée** (candidat : #66).

5. **Panneau d'erreur sous AA** (`leaflet-map.astro:87`) : `text-red-600` `#E7000B` sur `bg-red-50` `#FEF2F2` = **4,36:1**, sous le seuil 4,5:1 pour du texte de 14 px. C'est précisément le panneau qui porte le repli de localisation écrit par cette issue (`errorText`, FR-016 / SC-008) : le repli existe, mais il est à la limite basse.
6. **Conteneur de carte focusable sans nom accessible** (`leaflet-map.astro:69`) : Leaflet pose `tabindex="0"` sur le `div`, qui n'a ni `role` ni `aria-label`. Son nom calculé est son contenu (« +− Leaflet | © OpenStreetMap »). WCAG 4.1.2.
7. **Marqueur focusable sans nom accessible** (`leaflet-map.astro:154`) : `L.marker(position)` est appelé sans option `alt`, donc l'image du marqueur reçoit un `alt` vide tout en étant focusable. WCAG 4.1.2 et 1.1.1.

Ce ne sont **pas** des pièges de focus (la tabulation en sort normalement, vérifié), et l'adresse textuelle reste l'équivalent accessible de la carte — FR-016 et SC-008 tiennent.
