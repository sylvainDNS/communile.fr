# Quickstart — validation de l'issue #63

Procédure de vérification manuelle. Aucun framework de test dans le dépôt : les gates sont le lint, `astro check`, le build, les réponses HTTP réelles et le validateur schema.org.

## Prérequis

```bash
# depuis la racine du dépôt (ou du worktree)
./node_modules/.bin/astro --version   # doit répondre
```

> `pnpm` est cassé sur le poste de développement de référence : utiliser les binaires directs de `node_modules/.bin`.

## 1. Gates statiques

```bash
./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css   # exit 0 exigé
./node_modules/.bin/astro check                           # 0 erreur, 0 warning
./node_modules/.bin/astro build                           # build complet vert
```

## 2. Réponses HTTP réelles

```bash
./node_modules/.bin/astro dev --port 4321 &
# attendre le démarrage, puis :

curl -sI http://localhost:4321/sitemap.xml | head -3      # 200 + application/xml
curl -s  http://localhost:4321/sitemap.xml                # 8 <loc>, URLs absolues
curl -s  http://localhost:4321/sitemap.xml | grep -c '<loc>'   # => 8
curl -s  http://localhost:4321/sitemap.xml | grep -E '#|404'   # => vide

curl -s  http://localhost:4321/robots.txt                 # règles + ligne Sitemap absolue

# ne pas oublier d'arrêter le serveur
```

Attendu : cf. `contracts/sitemap-robots.md` (invariants S1–S7, R1–R3).

## 3. Cohérence sitemap ↔ canonical (FR-013 / S5)

Pour chaque URL du sitemap, la page correspondante doit déclarer **exactement** la même URL en canonical :

```bash
curl -s http://localhost:4321/la-sibra | grep 'rel="canonical"'
# => <link rel="canonical" href="https://communile.fr/la-sibra">  (sans barre finale)
curl -s http://localhost:4321/ | grep 'rel="canonical"'
# => https://communile.fr/  (avec barre finale, comme dans le sitemap)
```

## 4. Données structurées de `/la-sibra`

```bash
curl -s http://localhost:4321/la-sibra | grep -o 'application/ld+json.*</script>' | head -1
```

Vérifier (cf. `contracts/jsonld-brewery.md`, invariants C1–C7) :

- `@type` = `Brewery`, `name` = `La Sibra`, `alternateName` = `Les Bières de Charlotte` ;
- adresse, geo, deux plages d'ouverture, `sameAs` Instagram présents ;
- `image` = URL absolue d'une photo du lieu, **pas** `communile-logo.webp` ;
- le JSON se parse sans erreur (`JSON.parse`).

**Absence des coordonnées sous gate #67** — doit ne rien retourner :

```bash
curl -s http://localhost:4321/la-sibra | grep -E 'telephone|bce\.brasserie|0633015663|33633015663'
```

**Validateur schema.org** : coller le bloc JSON-LD dans https://validator.schema.org → **0 erreur** exigé (FR-007 / SC-001). Les suggestions d'amélioration (champs recommandés manquants comme `priceRange`) ne sont pas des erreurs et n'ont pas à être corrigées.

Le même validateur est scriptable, ce qui évite le copier-coller manuel — la page entière est soumise telle qu'elle est servie :

```bash
curl -s http://localhost:4321/la-sibra > /tmp/page.html
curl -s -X POST 'https://validator.schema.org/validate' --data-urlencode 'html@/tmp/page.html'
# la réponse est du JSON préfixé par )]}'  — chercher :
#   "numObjects":1  "totalNumErrors":0  "totalNumWarnings":0   et  "type":"Brewery"
```

Résultat obtenu au moment de la livraison : `numObjects=1`, `totalNumErrors=0`, `totalNumWarnings=0`, `type=Brewery`.

## 5. Métadonnées de page

```bash
curl -s http://localhost:4321/la-sibra | grep -E '<title>|name="description"|og:image|og:description'
```

Vérifier : titre `La Sibra · Commun'île`, description de 151 caractères contenant « anciennement Les Bières de Charlotte » et les deux plages horaires, image de partage = photo du lieu.

## 6. Non-régression visuelle

Aucun changement de rendu n'est attendu : ouvrir `/la-sibra` en mobile (375 px) et desktop et constater que la page est **identique** à avant l'issue. Seul le contenu du `<head>` change.
