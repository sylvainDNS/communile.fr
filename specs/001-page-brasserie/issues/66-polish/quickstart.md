# Quickstart — vérifier la passe de polish (issue #66)

Protocole de vérification. Aucune implémentation ici (voir `tasks.md`).

Ce quickstart est **complémentaire** de `specs/001-page-brasserie/quickstart.md`, qui valide le contenu de
la page. Celui-ci valide la **qualité transverse** : contrastes, clavier, débordement, non-régression des
composants partagés.

## Prérequis

Node ≥ 21. Les binaires sont appelés directement — `pnpm` est cassé sur le poste et sème un
`pnpm-workspace.yaml` parasite.

```text
./node_modules/.bin/astro dev
```

Firefox est indisponible (erreur marionette) : les mesures se font sous Chrome. Le vrai 375 px s'obtient par
**émulation d'appareil** — l'outil de redimensionnement se clampe à 500 px et donnerait une fausse mesure.

## 1. Gates — sur le dépôt entier

```text
./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css
./node_modules/.bin/astro check
./node_modules/.bin/astro build
```

Les trois doivent sortir en exit 0. **Ne jamais restreindre `eslint` à ses propres fichiers** : la config
lint aussi les blocs de code des Markdown, et un artefact de specs peut casser la CI (précédent : 6 erreurs
lors de #62).

## 2. Contrastes — recalcul et mesure

```text
node specs/001-page-brasserie/issues/66-polish/contracts/contrastes.mjs
```

Confronter la sortie au tableau de `specs/001-page-brasserie/contracts/theme.md` : **chaque valeur doit
coïncider** (tolérance ±0,02). Un écart signifie que le contrat a de nouveau dérivé.

Puis, au navigateur, sur `/la-sibra` : relever via l'onglet Accessibility le ratio de chaque texte posé sur
un fond thémé. Attendu : aucun texte courant sous 4,5:1, aucun grand texte sous 3:1.

Pièges de lecture :

- la graisse **600** ne qualifie pas comme « grand texte » ; sous `md`, `size="xl"` rend 20 px, donc du
  texte courant au sens WCAG ;
- un ornement semi-transparent superposé au fond change le ratio réel : mesurer sur le rendu, pas sur le
  token.

## 3. Débordement horizontal — les 8 pages, 2 largeurs

Pour chaque page (`/`, `/la-sibra`, `/le-wattignies`, `/le-bar-ile`, `/le-labo-diva`,
`/les-landes-fertiles`, `/a-la-carte-postale`, `/contact`), à 375 px puis à 1280 px :

```text
document.documentElement.scrollWidth - document.documentElement.clientWidth
```

Attendu : **0** partout. L'accueil valait 27 px à 1280 px avant la passe.

## 4. Composants partagés — non-régression

Toute modification de `leaflet-map`, `Tag` ou `Text` est de rayon large. Vérifier :

| Point | Où | Attendu |
|---|---|---|
| Carte : nom accessible du conteneur | les 6 pages de lieux + `/contact` | conteneur focusable annoncé avec un rôle et un nom |
| Carte : marqueur | idem | nom accessible en français |
| Carte : panneau d'erreur | simuler en bloquant `unpkg.com` dans l'onglet Network | message lisible, ≥ 4,5:1 |
| `Tag` thémé | `/la-sibra`, `/a-la-carte-postale`, `/le-labo-diva`, `/le-wattignies` | libellé lisible, fond inchangé |
| `Text size="base"` | les 8 pages | **18 px** — toute valeur à 16 px est une régression |

## 5. Clavier

Sur `/la-sibra` puis sur une page de lieu témoin : parcours complet à la touche Tab. Attendu — indicateur de
focus visible partout, aucun élément focusable anonyme, et **sortie possible de la carte** sans piège.

## 6. Lighthouse mobile — comparé

Auditer `/la-sibra` et `/a-la-carte-postale` en conditions mobiles, même session. Attendu : performance,
accessibilité et SEO de `/la-sibra` **au moins égaux**, poids de page du même ordre (SC-004 de l'epic).

Comparer les deux pages dans la même session : un score absolu de Lighthouse varie trop d'une exécution à
l'autre pour valoir seul. C'est l'**écart** entre les deux pages qui est la mesure.

## 7. Revue design — les deux largeurs

Priorité à la **section bières** : c'est la seule section de l'epic qui n'a jamais été regardée dans un
navigateur.

- aucune illustration décorative ne chevauche un texte ni n'est coupée de façon disgracieuse ;
- rythme vertical comparable aux 5 autres pages de lieux ;
- palette vert olive / rose / orange fidèle à la charte et non confondable avec les 5 autres thèmes.

## 8. Gate #67 — vérifier qu'il tient

```text
grep -rn "tel:\|mailto:" src/
```

Attendu : **aucune** occurrence du téléphone `06 33 01 56 63` ni de l'email `bce.brasserie@gmail.com`. Le
JSON-LD de `/la-sibra` ne doit exposer ni `telephone` ni `email`.

## Avant de conclure

Arrêter les serveurs de développement lancés pour la vérification.

## Résultats attendus

| Vérification | Attendu |
|---|---|
| `eslint` / `astro check` / `astro build` | exit 0, dépôt entier |
| Ratios recalculés vs `theme.md` | coïncidence à ±0,02 |
| Débordement, 8 pages × 2 largeurs | 0 px |
| Contrastes mesurés sur `/la-sibra` | aucun texte sous son seuil |
| Lighthouse `/la-sibra` vs `/a-la-carte-postale` | pas de régression |
| `tel:` / `mailto:` non confirmés | absents |

---

## Relevé de la passe du 2026-09-20

Mesures effectuées sous Chrome, serveur de développement local. Firefox indisponible (marionette).
375 px obtenu par émulation d'appareil, pas par redimensionnement.

### Débordement horizontal — 8 pages × 2 largeurs

| | avant | après |
|---|---|---|
| `/` à 1280 px | **27 px** | **0** |
| 15 autres combinaisons | 0 | 0 |

Cause réelle : la grille `xl:grid-cols-[260px_auto_50%]` de `home-choices-section.astro`. L'élément dont
le bord droit atteignait exactement `scrollWidth` (1307 px) était la colonne des `HomeIconTextCard`, donc
du **contenu**. `overflow-hidden` l'aurait coupé. Corrigé par `minmax(0,1fr)` : colonnes 260/359/616 →
260/400/524, la colonne centrale atteignant enfin son `max-w-[400px]`.

### Contrastes — mesurés sur le rendu, pas estimés

Toutes les combinaisons texte/fond des 8 pages, seuils 4,5:1 et 3:1 selon taille et graisse :

| Page | Non-conformités |
|---|---|
| `/la-sibra` | **0** |
| `/contact` | **0** |
| `/`, `/le-wattignies`, `/le-bar-ile`, `/le-labo-diva`, `/les-landes-fertiles`, `/a-la-carte-postale` | défauts **préexistants**, hors périmètre (variantes `yellow`/`red` de `Tag` et `Badge`, non thémées) |

`/la-sibra` est la seule page de lieu sans aucune non-conformité de contraste.

### Composant de carte

| Point | Avant | Après |
|---|---|---|
| Panneau d'erreur | 4,41:1 | **5,87:1** mesuré sur le rendu |
| Conteneur | focusable anonyme (`tabindex="0"` posé par Leaflet) | `role="application"` + `aria-label` |
| Marqueur | sans nom accessible | « La Sibra 121 rue du Général Buat 44000 Nantes » |
| Icône d'erreur | exposée | `aria-hidden="true" focusable="false"` |

Le remplacement des balises du popup se fait par une **espace** et non par la chaîne vide : la première
version produisait « La Sibra121 rue du Général Buat44000 Nantes ».

### Clavier — 8 pages

Aucun élément focusable anonyme sur aucune des 8 pages. 3 pages hors epic
(`/le-wattignies`, `/le-labo-diva`, `/a-la-carte-postale`) contiennent des focusables dans un sous-arbre
`aria-hidden="true"` — défaut **préexistant**, confirmé par Lighthouse, hors périmètre.

### Lighthouse mobile — comparé dans la même session

| | `/la-sibra` | `/a-la-carte-postale` |
|---|---|---|
| Accessibilité | **100** | 93 |
| SEO | **100** | 100 |
| Bonnes pratiques | **96** | 96 |
| Agentic browsing | **100** | 50 |
| Audits en échec | **1** | 4 |
| Poids HTML | **163 Ko** | 232 Ko |

L'unique échec de `/la-sibra` (`image-size-responsive`) est **partagé** avec la page de référence : il
n'est donc pas imputable à cette page. Aucune régression — `/la-sibra` est meilleure ou à égalité partout.

### Navigation à 7 entrées (vérification due par R7)

Aucun débordement à 1280, 1366, 1440, 1536 ni 1920 px. À 1280 px, les 7 entrées occupent 874 px dans une
colonne de 886 px, sur une seule ligne. En allongeant artificiellement le dernier libellé, la page ne
déborde jamais : à +60 caractères la nav passe à **deux lignes** et le header grandit de 24 à 72 px.
C'est la hauteur qui cède, pas la largeur.

### Gates

`eslint` (dépôt entier), `astro check` (0 erreur / 0 avertissement / 0 hint) et `astro build` : exit 0.
