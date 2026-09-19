# Quickstart : vérifier l'issue #60

Guide de validation de bout en bout de l'incrément « hero / c'est quoi ? / Instagram ».

## Prérequis

- Dépôt sur la branche `001-page-brasserie-hero` (partie de `001-page-brasserie-lint-baseline`, qui contient l'epic + le correctif de lint).
- Dépendances installées (`node_modules/` présent).
- Les photos sources (`brasserie-assets/`) ne sont **pas** nécessaires : les dérivés WebP sont versionnés depuis #59.

> ⚠️ Sur un poste où `pnpm` est cassé (corepack résolvant pnpm 11, dont le gate `approve-builds` bloque `esbuild`/`sharp`/`workerd`), invoquer directement les binaires de `node_modules/.bin/`. La CI, sur pnpm 9, n'est pas concernée.

## 1. Contrôles automatisés

```bash
./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css   # attendu : exit 0, aucune sortie
./node_modules/.bin/astro check                          # attendu : 0 error, 0 warning
./node_modules/.bin/astro build                          # attendu : « Complete! »
```

## 2. Contrôles sur le HTML produit

```bash
# un seul h1
grep -o '<h1' dist/**/la-sibra*.html | wc -l          # attendu : 1

# aucune coordonnée (gate #67)
grep -Ei 'tel:|mailto:|@gmail|06 ?33' dist/**/la-sibra*.html   # attendu : aucun résultat

# aucune URL interne en dur dans les sections de la feature
grep -rn 'href="/' src/features/sibra/sections/        # attendu : aucun résultat
```

## 3. Relecture visuelle (obligatoire — T012)

```bash
./node_modules/.bin/astro dev
```

Ouvrir `http://localhost:4321/la-sibra`.

### Desktop (≥ 1280 px)

- [ ] Les bulles roses (haut-gauche) et vertes pivotées (bas-droite) encadrent le hero sans toucher le texte.
- [ ] Le motif des trois disques s'affiche en orange / rose / vert de la charte, au-dessus du nom « La Sibra ».
- [ ] L'accroche « De l'houblon à la pression » est le titre principal, centré.
- [ ] La section verte affiche le texte sur deux colonnes, photo à droite, ornement en bas à gauche derrière le texte.
- [ ] Le fil Instagram s'affiche en bas de page.

### Mobile (375 px)

- [ ] Les bulles sont masquées ; le hero se réduit au motif + nom + accroche, centrés.
- [ ] Aucun défilement horizontal (aucune barre de défilement en bas de la fenêtre).
- [ ] La section verte passe sur une seule colonne, photo sous le texte.
- [ ] Aucun texte n'est recouvert par l'ornement.

### Contrastes (contrat de thème)

- [ ] Sur le fond vert, seuls le titre `h2` et l'accroche sont en blanc.
- [ ] Le paragraphe de présentation et la mention de disponibilité sont en neutre foncé, pas en blanc.
- [ ] Aucun texte blanc n'apparaît sur un fond orange.

### Accessibilité

- [ ] Navigation au clavier : les deux liens internes de la section verte sont atteignables et montrent un anneau de focus.
- [ ] Les décorations et le motif des trois disques ne sont pas annoncés par un lecteur d'écran.
- [ ] La photo porte une description alternative en français décrivant la scène.

## 4. Test indépendant de la story (spec US1)

Faire lire la page à une personne qui ne connaît pas le lieu, puis lui demander : quel quartier ? quel ancien nom ? deux caractéristiques de la bière ? pourquoi la coopérative a-t-elle ouvert ce lieu ? Les quatre réponses doivent venir de la seule lecture de la page.

## 5. Gate de PR

- PR ouverte vers la branche epic `001-page-brasserie` (jamais `main`), corps contenant `Closes #60`.
- CI verte (build + lint).
- Commits au format Conventional Commits.
- **Le merge est réservé à l'humain.**
