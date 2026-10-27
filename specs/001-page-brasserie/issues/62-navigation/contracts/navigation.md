# Contrat : les trois surfaces de découverte de La Sibra (issue #62)

**Date**: 2026-09-19 · **Spec**: [../spec.md](../spec.md) · **Data model**: [../data-model.md](../data-model.md)

Ce contrat décrit ce qu'un visiteur — et un relecteur — doit pouvoir constater dans le HTML rendu.
Il est écrit pour être vérifiable sans lire le code source : chaque clause est une assertion sur la
page servie.

---

## C1 — Navigation principale (les 8 pages publiques)

### Rendu desktop (viewport ≥ 1280 px)

```html
<nav aria-label="Navigation principale">
  <ul>
    …
    <li><a href="/a-la-carte-postale" …>À La Carte Postale</a></li>
    <li><a href="/la-sibra" …>La Sibra</a></li>   <!-- 7e et dernier -->
  </ul>
</nav>
```

| Clause | Assertion |
|--------|-----------|
| C1.1 | La liste contient exactement **7** `<li>`, dans l'ordre : Qui sommes-nous ?, Le Wattignies, Les Landes Fertiles, Le Labo Diva, Le Bar'Île, À La Carte Postale, La Sibra |
| C1.2 | La 7ᵉ entrée porte le libellé exact `La Sibra` (majuscule à L et à S, espace simple) et `href="/la-sibra"` |
| C1.3 | Sur `/la-sibra`, et sur elle seule, cette entrée porte `aria-current="page"` |
| C1.4 | À 1280 px : les 7 entrées tiennent sur **une seule ligne**, le logo est affiché en entier, aucun chevauchement entre le logo et la première entrée |
| C1.5 | À 1280 px : la largeur du `<ul>` de la nav est ≤ 900 px (condition mesurée en D1 pour que la colonne du logo atteigne ses 158 px) |
| C1.6 | À partir de 1536 px : le padding horizontal des entrées revient à 16 px — rendu identique à la production actuelle |
| C1.7 | Aucune barre de défilement horizontale n'apparaît sur le `<header>` |

### Rendu mobile (viewport < 1280 px)

| Clause | Assertion |
|--------|-----------|
| C1.8 | Le menu mobile liste les **mêmes 7** entrées, dans le même ordre |
| C1.9 | Le padding horizontal des entrées du menu mobile reste **16 px** — la réduction de C1.6 ne s'y applique pas (cibles tactiles préservées) |
| C1.10 | Le bouton d'ouverture bascule `aria-expanded` entre `false` et `true` ; `Échap` referme le panneau |
| C1.11 | Les 7 entrées sont atteignables au clavier et au doigt, sans qu'aucune soit hors du panneau ; le panneau défile si nécessaire |

---

## C2 — Pied de page (les 8 pages publiques)

```html
<ul>
  …
  <li><a href="/a-la-carte-postale">À La Carte Postale</a></li>
  <li><a href="/la-sibra">La Sibra</a></li>   <!-- 6e et dernier -->
</ul>
```

| Clause | Assertion |
|--------|-----------|
| C2.1 | La colonne « Commun'île » du pied de page liste **6** lieux, La Sibra en dernier |
| C2.2 | L'entrée porte le libellé exact `La Sibra` et `href="/la-sibra"` |
| C2.3 | Sa mise en forme est indiscernable de celle des 5 entrées voisines (aucune classe propre) |

---

## C3 — Section « Nos lieux » de l'accueil

| Clause | Assertion |
|--------|-----------|
| C3.1 | La section contient **6** cartes de lieu, La Sibra en dernière position |
| C3.2 | La carte pointe vers `/la-sibra` |
| C3.3 | Son image a un attribut `alt` non vide, en français, décrivant le contenu de la photo |
| C3.4 | Son étiquette affiche `La Sibra` dans la teinte verte, la même que celle du Labo Diva |
| C3.5 | Son contenu de survol affiche l'intitulé « Horaires d'ouverture » puis les deux plages de la boutique — vendredi 16 h – 20 h, samedi 11 h – 20 h — écrites dans la notation des cinq cartes voisines : « 16h00 - 20h00 » et « 11h00 - 20h00 » (D8) |
| C3.6 | Le contenu de survol ne contient **ni** numéro de téléphone, **ni** adresse e-mail, **ni** lien `tel:`/`mailto:` |
| C3.7 | **Aucune** des 6 cartes ne porte de classe modifiant sa portée ou sa largeur dans la grille |
| C3.8 | À ≥ 768 px : les 6 cartes forment 3 rangées de 2, toutes de largeur identique |
| C3.9 | À < 768 px : les 6 cartes sont empilées sur une colonne, toutes de largeur identique |
| C3.10 | L'image de la carte est servie en chargement différé, avec les mêmes `widths`/`sizes` que les 5 autres (comportement hérité de `PlaceCard`, aucune surcharge) |

---

## C4 — Page À La Carte Postale

| Clause | Assertion |
|--------|-----------|
| C4.1 | Le dernier paragraphe de la section « À La Carte Postale, c'est quoi ? » se lit exactement : « C'est le quatrième restaurant de la coopérative, une brique supplémentaire pour solidifier notre plaidoyer en faveur d'une alimentation plus végétale et locale ! » |
| C4.2 | Ce paragraphe conserve sa police, sa taille, sa graisse et sa largeur maximale d'origine |
| C4.3 | Aucune occurrence de « dernier lieu » ne subsiste dans `src/` |
| C4.4 | Le reste de la page est identique au rendu précédent |

---

## C5 — Non-régression (contrat négatif)

Ce qui ne doit **pas** avoir changé. C'est la moitié du contrat : les surfaces touchées sont en
production.

| Clause | Assertion |
|--------|-----------|
| C5.1 | Les 5 pages de lieux préexistantes s'affichent sans différence visuelle, hors l'entrée ajoutée au header et au footer |
| C5.2 | Les 6 entrées de nav préexistantes conservent libellé, ordre et destination |
| C5.3 | Les 5 entrées de footer préexistantes conservent libellé, ordre et destination |
| C5.4 | Les 5 cartes de lieu préexistantes conservent image, texte alternatif, teinte d'étiquette, libellé et horaires de survol |
| C5.5 | Aucun composant de `src/components/` n'est modifié |
| C5.6 | Aucun fichier hors des 4 fichiers du périmètre n'est modifié dans `src/` |
| C5.7 | Le nombre de requêtes et le poids de la page d'accueil n'augmentent que de la seule image de la 6ᵉ carte |

---

## Méthode de vérification

- **C1.1–C1.3, C2.*, C3.1–C3.7, C4.1, C4.3** : lecture du HTML rendu et `grep` sur `src/`.
- **C1.4–C1.7, C3.8–C3.9, C4.2, C4.4, C5.1** : inspection navigateur à 375 px et 1280 px, plus un
  contrôle à ≥ 1536 px pour C1.6.
- **C1.5** : mesure de `document.querySelector('header nav ul').getBoundingClientRect().width` à
  1280 px.
- **C1.8–C1.11** : manipulation du menu mobile à 375 px, souris et clavier.
- **C5.6** : `git diff --stat` — la liste des fichiers touchés dans `src/` doit compter exactement 4
  entrées.
