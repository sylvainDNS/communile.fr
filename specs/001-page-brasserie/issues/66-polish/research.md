# Research — Polish final de l'epic « page La Sibra » (issue #66)

Toutes les valeurs de contraste de ce document sont **calculées**, pas estimées. Méthode et script :
[contracts/contrastes.md](./contracts/contrastes.md). Tolérance de reproduction : ±0,02.

---

## R66-1 — Les quatre ratios faux de `contracts/theme.md`

**Question** : le tableau « Contrastes mesurés (WCAG 2.1) » de `specs/001-page-brasserie/contracts/theme.md`
est la référence qu'ont consultée les sept issues de l'epic. Trois agents successifs ont signalé des écarts.
Lesquels sont réels et lesquels comptent ?

**Mesure** — recalcul depuis les tokens `oklch` de `src/styles/global.css`, `foreground` =
`oklch(0.145 0 0)` = `#0A0A0A` :

| Fond | Annoncé blanc | Réel blanc | Annoncé `foreground` | Réel `foreground` |
|---|---|---|---|---|
| `primary` `#7A9300` | 3,5 | **3,50** ✅ | 5,1 | **5,66** ✗ (−10 %) |
| `primary-accent` `#5E7500` | 5,2 | **5,25** ✅ | — | **3,77** non documenté |
| `secondary` `#DC5B87` | 3,6 | **3,57** ✅ | 5,0 | **5,55** ✗ (−10 %) |
| `secondary-accent` `#B93B6A` | 5,4 | **5,39** ✅ | — | **3,67** non documenté |
| `tertiary` `#FEA300` | 2,0 | **2,01** ✅ | 8,9 | **9,85** ✗ |
| `tertiary-accent` `#DC8300` | **3,0** | **2,88** ✗ | 7,0 | **6,87** ≈ |

**Décision** : corriger les six lignes, et hiérarchiser les erreurs par gravité — elles ne sont pas de même
nature :

1. **`tertiary-accent` / blanc : 3,0 annoncé, 2,88 réel.** C'est la seule erreur qui **produit du non
   conforme**. Le contrat écrit « texte blanc en grand texte uniquement », règle qui s'appuie sur le seuil
   de 3:1. À 2,88 la règle est fausse : aucun texte blanc n'est autorisé sur `tertiary-accent`. Un
   implémenteur suivant le contrat à la lettre aurait produit du non conforme en toute bonne foi.
2. **Colonne `foreground` sous-estimée d'environ 10 %** (5,1 → 5,66 ; 5,0 → 5,55 ; 8,9 → 9,85). Erreur
   *conservatrice* : elle n'a jamais autorisé quoi que ce soit d'interdit. Elle reste à corriger, parce
   qu'une marge fausse fait renoncer à des choix pourtant valides.
3. **`text-foreground` sur `primary-accent` (3,77) et `secondary-accent` (3,67)** : combinaisons **absentes**
   du tableau, toutes deux **sous 4,5:1** en texte courant. C'est l'omission la plus dangereuse, parce que
   les cellules `-accent` de la colonne `foreground` sont vides et qu'un lecteur peut y lire « non
   applicable » plutôt que « non mesuré ».

**Alternatives écartées** : ajuster les couleurs de la charte pour gagner du contraste — exclu, la charte est
imposée et les valeurs sont déclarées exactes. Supprimer le tableau plutôt que le corriger — exclu, c'est le
seul endroit où les règles d'usage sont écrites.

---

## R66-2 — `Tag color="primary"` : un défaut du design system, pas du thème sibra

**Question** : #64 a contourné localement un `Tag` illisible par `class="text-foreground"`. Le défaut est-il
propre au vert olive ou générique ?

**Mesure** — `Tag` pose la couleur pleine du thème en texte sur un dégradé clair de cette même couleur
(`color-mix` 15 % → 30 % vers le blanc). Le pire cas est l'extrémité à 30 %. Sur les six thèmes du site :

| Thème | `text-*` | vs fond 15 % | vs fond 30 % | AA texte courant |
|---|---|---|---|---|
| sibra `primary` | `#7A9300` | 2,98 | **2,51** | ✗ |
| sibra `secondary` | `#DC5B87` | 3,03 | **2,55** | ✗ |
| sibra `tertiary` | `#FEA300` | 1,82 | **1,65** | ✗ |
| la-carte-postale `primary` | `#7186FE` | 2,76 | **2,35** | ✗ |
| labo-diva `primary` | `#00948A` | 3,16 | **2,65** | ✗ |
| wattignies `primary` | `#335FFF` | 4,08 | **3,30** | ✗ |
| bar-ile `primary` | `#02387E` | 8,48 | 6,19 | ✅ |
| landes-fertiles `primary` | `#344256` | 7,72 | 5,70 | ✅ |

**Constat** : le défaut est **générique**. Il épargne seulement les deux thèmes dont la couleur primaire est
déjà très foncée. Ce n'est donc pas une dette de l'epic sibra : c'est une dette du composant, que l'epic a
simplement rendue visible.

**Mesure de l'alternative** : remplacer la couleur de texte par sa variante `-accent` ne suffit pas
(sibra `primary` 3,77 ; `secondary` 3,85 ; `tertiary` 2,37 — toujours sous 4,5). Seul `text-foreground`
passe sur tous les thèmes, et avec une marge large : de **10,84** (bar-ile) à **16,26** (sibra tertiaire).

**Décision** : arbitrage porté par [data-model.md](./data-model.md) selon l'inventaire réel des usages. La
mesure ci-dessus établit deux choses indépendamment de cet arbitrage : *(a)* la seule correction qui
fonctionne pour tous les thèmes est `text-foreground` ; *(b)* le contournement choisi par #64 était le bon,
et mérite d'être remonté au composant plutôt que répété page par page.

---

## R66-3 — Le panneau d'erreur de la carte

**Question** : `leaflet-map.astro` affiche son message de repli en `text-red-600` sur `bg-red-50`. Conforme ?

**Mesure** : `#dc2626` sur `#fef2f2` = **4,41:1**. Sous le seuil de 4,5:1, de peu mais réellement.
L'icône en `text-red-500` (`#ef4444`) donne **3,44:1**, sous le seuil de 3:1 applicable aux éléments
graphiques — celui-là passe.

| Candidat | Ratio sur `#fef2f2` |
|---|---|
| `text-red-600` `#dc2626` (actuel) | 4,41 ✗ |
| `text-red-700` `#b91c1c` | **5,91** ✅ |
| `text-red-800` `#991b1b` | 7,60 ✅ |

**Décision** : `text-red-700`. C'est le premier cran conforme, il conserve l'intention chromatique du
composant et ne change rien à sa mise en page.

**Pourquoi cela compte plus que le chiffre ne le suggère** : ce texte n'est visible que lorsque la carte n'a
pas chargé — réseau dégradé, CDN bloqué, navigateur restrictif. C'est exactement la population qui a le plus
besoin que le repli soit lisible, et c'est le texte le moins contrasté de la page.

---

## R66-4 — `Text size="base"` : corriger sans changer le rendu

**Question** : `src/components/text.astro` émet `'text-base text-lg'` pour `size="base"`. Deux tailles
concurrentes. Laquelle gagne, et que vaut la « correction » évidente ?

**Analyse** : en Tailwind, l'ordre d'application ne dépend pas de l'ordre dans l'attribut `class` mais de
l'ordre des règles dans la feuille générée. `text-lg` y est émis après `text-base`, donc **`text-lg` gagne :
le texte courant du site fait 18 px**, sur les huit pages, depuis toujours.

**Conséquence** : la correction « évidente » — garder `text-base` — n'est pas une correction, c'est une
**refonte typographique de tout le site** déguisée en nettoyage de classe. Elle réduirait le corps de texte
de 18 à 16 px partout, rallongerait toutes les colonnes et modifierait le rythme vertical des huit pages.

**Décision** : ne garder que `text-lg`. Le rendu est **identique au pixel près**, l'ambiguïté disparaît, et
la taille réelle devient lisible dans le code. Un commentaire consigne que la valeur est délibérée, pour que
la prochaine personne ne « corrige » pas dans l'autre sens.

**Alternative écartée** : renommer la variante `base` en `lg`. Cela imposerait de toucher tous les appelants
pour un gain nul — et `size="base"` reste le bon nom pour « le corps de texte par défaut », quelle que soit
sa valeur en pixels.

---

## R66-5 — Ce que le conteneur de carte n'annonce pas

**Question** : quels sont les défauts a11y réels de `leaflet-map.astro`, au-delà du contraste ?

**Analyse** :

1. **Nom accessible du conteneur.** Leaflet pose lui-même `tabindex="0"` sur son conteneur quand l'option
   `keyboard` est active (c'est le cas par défaut ici). Le conteneur devient donc focusable **à l'exécution**,
   sans `role` ni `aria-label` : un utilisateur de lecteur d'écran atteint un élément focusable anonyme.
   WCAG 4.1.2 (Name, Role, Value). Le défaut n'est pas visible dans le source Astro, ce qui explique qu'il
   ait survécu aux revues.
2. **Marqueurs sans nom.** `L.marker(position)` est appelé sans option `alt`. Leaflet crée alors une `<img>`
   dont l'`alt` est vide, tout en la rendant focusable au clavier. Élément focusable sans nom accessible.
3. **Skeleton de chargement.** Le squelette animé est masqué par `style.display = 'none'` une fois la carte
   prête — correct — mais il n'est pas annoncé pendant le chargement. Défaut mineur, non bloquant.

**Décision** : corriger (1) par `role="application"` + `aria-label` paramétrable, et (2) en passant un `alt`
français à `L.marker`. Laisser (3) : ajouter une région live pour un squelette qui dure moins d'une seconde
ajoute du bruit d'annonce pour un gain douteux.

**Choix de `role="application"` plutôt que `role="region"`** : une carte Leaflet interceptant les flèches du
clavier pour se déplacer, `application` est le rôle qui décrit honnêtement ce comportement et évite que le
lecteur d'écran intercepte ces mêmes touches en mode lecture.

**Portée** : ce composant sert les six pages de lieux **et** `/contact`. Toute modification s'y vérifie sur
les sept pages, pas sur `/la-sibra` seule.

---

## R66-6 — R5 et R7 de `research.md` de l'epic sont faux

**Question** : deux entrées de recherche de l'epic ont été démenties par la mesure. Faut-il les corriger
alors que les décisions qu'elles ont guidées sont déjà prises et mergées ?

**Analyse** : oui, et c'est précisément parce que les décisions sont prises. Une entrée de recherche n'est
pas un journal de ce qu'on a cru : c'est ce que la prochaine personne lira pour décider. R5 (« sitemap
inopérant avec `output: 'server'` ») et R7 (« débordement de nav à 7 entrées : risque faible ») ont toutes
deux été contredites par les faits pendant l'epic — #63 a bien produit un sitemap, et le débordement mesuré
n'était pas où R7 l'annonçait.

**Décision** : ne pas réécrire l'historique. Chaque entrée conserve son texte d'origine et reçoit un bloc
**« Correction (2026-09-20, issue #66) »** qui dit ce qui a été mesuré et ce qui a été fait. Le lecteur voit
à la fois la conclusion valide et le fait que l'hypothèse initiale était fausse — information utile en soi.

**Alternative écartée** : supprimer les entrées. Cela effacerait la trace d'un raisonnement erroné qui a
coûté du temps ; le garder visible est ce qui empêche de le refaire.

---

## R66-7 — Débordement horizontal : préexistant mais dans le périmètre

**Question** : l'accueil déborde de 27 px à 1280 px (mesuré à 1307 px **avant** toute modification de #62).
Une dette antérieure à l'epic entre-t-elle dans une passe de polish d'epic ?

**Analyse** : T024 nomme l'accueil parmi les pages touchées et exige « aucun débordement ». Le critère est
sur la page, pas sur la provenance de la dette. Par ailleurs un débordement horizontal est un défaut
responsive au sens du principe IV, pas un détail esthétique : à 375 px il produit un balayage latéral
parasite sur toute la page.

**Cause identifiée** : des éléments décoratifs positionnés en marge négative (`-top-6 -right-6`, un bloc
`-mr-6`) dont l'ancêtre ne porte pas `overflow-hidden`, et qui dépassent donc la boîte de la page.

**Décision** : corriger, en posant `overflow-hidden` sur la section conteneuse plutôt qu'en déplaçant les
décorations. Le rendu visuel reste identique dans la zone visible — seule disparaît la partie qui dépassait
hors écran, invisible par construction.

**Vérification** : `scrollWidth` vs `clientWidth` mesurés au navigateur sur les huit pages, à 375 px et
1280 px, avant et après.

---

## R66-8 — `SITE_NAME` : une apostrophe qui se voit

**Question** : `src/utils/constants.ts` définit `SITE_NAME = 'Commun\'île'` avec une apostrophe ASCII, alors
que les descriptions du site emploient l'apostrophe typographique `’`. Détail ou défaut ?

**Analyse** : les deux caractères coexistent dans le même onglet de navigateur — `<title>` en `Commun'île`
face à une meta description en `Commun’île`. Le principe I exige une typographie française correcte, et
l'apostrophe courbe en fait partie. Le nom de la coopérative est par ailleurs l'élément le plus répété du
site.

**Décision** : passer à `'Commun’île'`. Le fichier est déjà en UTF-8, aucun échappement n'est nécessaire, et
la valeur n'est comparée à aucune chaîne littérale ailleurs dans le code (vérifié).

---

## R66-9 — Ce qui n'est délibérément pas corrigé

Chaque dette héritée reçoit une décision explicite. Celles laissées de côté le sont pour une raison écrite,
et non par omission — c'est la condition SC-006.

| Dette | Décision | Raison |
|---|---|---|
| `Card`/`InfoCard` rend `bg-white` sans bordure ni ombre, invisible sur fond blanc | **Documentée, non corrigée** | Ajouter une bordure ou une ombre à la source change le rendu des huit pages. Le contournement `bg-background` employé par l'epic est local et suffisant. Relève d'une décision de design system. |
| `Card` rend systématiquement un `<article>` | **Documentée, non corrigée** | Plusieurs « article » annoncés d'affilée sont du bruit, pas une erreur de conformité. Y remédier proprement demande une prop `as` et une revue de chaque appelant sur huit pages. |
| Horaires de la boutique dupliqués (`sibra-boutique-section` / `home-places-section`) | **Documentée, non corrigée** | Factoriser touche une donnée de contenu sous gate éditorial (#67, notation horaire). Fusionner maintenant figerait un format que la coopérative n'a pas encore tranché. |
| Notation « 16h00 - 20h00 » vs « 16 h – 20 h » | **Renvoyée à l'humain** | Décision **éditoriale** portant sur les six cartes de lieux, pas sur la seule Sibra. La carte Sibra suit aujourd'hui le format des cinq autres : la cohérence actuelle est correcte quelle que soit l'issue. |
| `@astrojs/sitemap` déclarée sans être utilisée | **Documentée, non corrigée** | La retirer modifie le lockfile, que la CI installe en `--frozen-lockfile`. Risque de casser la CI de l'epic pour un gain nul sur les critères de succès. À traiter dans un lot dépendances. |
| Gate #67 — téléphone et email non confirmés | **Reste fermé** | Constitution, principe I. Vérifié : aucun `tel:` ni `mailto:` correspondant n'est publié, et le JSON-LD omet déjà `telephone`/`email`. Aucune correction de polish ne doit les réintroduire. |
| Quais « Chanzy » / `route_ref=C1` dans OSM | **Hors périmètre** | Intrant de #67, non reproduit (Overpass saturé). Consigné dans `issues/61-boutique/research.md` § R61-2. |
