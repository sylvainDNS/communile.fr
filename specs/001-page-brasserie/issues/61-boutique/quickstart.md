# Quickstart: valider l'issue #61 (boutique, horaires, infos pratiques et carte)

Guide de validation, pas d'implémentation. Il suppose le dépôt cloné et les dépendances installées.

> ⚠️ **Ne pas utiliser `pnpm` dans cet environnement** : corepack y résout une version incompatible et le gate `approve-builds` bloque `esbuild`/`sharp`/`workerd` ; l'appel sème en prime un `pnpm-workspace.yaml` parasite. On appelle les binaires directement.

## 1. Portes automatiques

```bash
./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css   # exit 0 exigé
./node_modules/.bin/astro check
./node_modules/.bin/astro build
```

Les trois doivent passer avant le push. `astro check` valide le typage des props `LeafletMap` (`center` et `position` sont des tuples `[number, number]`).

## 2. Vérifications textuelles sur le diff

```bash
# Gate #67 : aucune coordonnée non confirmée (doit ne rien renvoyer)
grep -rniE "tel:|mailto:|0[0-9]([ .-]?[0-9]{2}){4}|@gmail|bce\.brasserie" \
  src/features/sibra/sections/sibra-boutique-section.astro \
  src/features/sibra/sections/sibra-infos-section.astro

# Horaires : exactement deux jours, ceux du texte source (et pas ceux de l'archive)
grep -nE "Vendredi|Samedi|16 h|11 h|20 h|17 h 30|19 h 30|Mercredi|Jeudi|Dimanche|Lundi|Mardi" \
  src/features/sibra/sections/sibra-boutique-section.astro

# Aucun élément interactif ajouté par les deux sections
grep -nE "<a |<button|tabindex" \
  src/features/sibra/sections/sibra-boutique-section.astro \
  src/features/sibra/sections/sibra-infos-section.astro
```

Attendu : la première et la troisième commande ne renvoient rien ; la deuxième ne renvoie que `Vendredi`, `Samedi`, `16 h – 20 h`, `11 h – 20 h`.

## 3. Re-vérifier le géocodage

```bash
curl -s "https://api-adresse.data.gouv.fr/search/?q=121%20rue%20du%20General%20Buat%20Nantes&limit=1" | python3 -m json.tool
curl -s -A "communile-dev/1.0" "https://nominatim.openstreetmap.org/reverse?lat=47.225406&lon=-1.543878&format=jsonv2" | python3 -m json.tool
```

Attendu : la première renvoie `type: "housenumber"`, `housenumber: "121"`, `street: "Rue Général Buat"`, `postcode: "44000"`, `city: "Nantes"` et des coordonnées identiques à celles écrites dans la section ; la seconde retombe sur le même numéro de voie. Les deux sources doivent concorder (SC-003).

## 4. Recalcul des contrastes

Les ratios du contrat de thème de l'epic sont connus pour être approximatifs : ne pas s'en servir, recalculer. La méthode (conversion `oklch()` → sRGB puis luminance relative WCAG 2.1) est reproductible en quelques lignes de Python ; elle donne, pour les couples employés ici :

| Couple | Ratio | Seuil applicable | Verdict |
|---|---|---|---|
| `foreground` sur `tertiary` orange `#FEA300` | 9,85:1 | 4,5:1 (texte courant) | ✅ |
| `foreground` sur blanc (carte des horaires) | 19,79:1 | 4,5:1 | ✅ |
| blanc sur `accent` vert foncé `#5E7500` | 5,25:1 | 4,5:1 (texte courant) | ✅ |
| *blanc sur `tertiary`* | *2,01:1* | *3:1 même en grand texte* | ❌ **interdit** |
| *`foreground` sur `accent`* | *3,77:1* | *4,5:1* | ❌ **interdit** |

Contrôle complémentaire dans le navigateur (DevTools → sélecteur de couleur, ou extension de contraste) sur le rendu réel, aux deux largeurs : les valeurs calculées ne tiennent pas compte d'un éventuel chevauchement d'élément semi-transparent.

## 5. Vérification visuelle

```bash
./node_modules/.bin/astro dev   # puis http://localhost:4321/la-sibra
```

À **375 px** :

- [ ] aucun défilement horizontal sur toute la page ;
- [ ] les horaires sont lisibles sans zoom et ressortent du reste de la section ;
- [ ] la carte tient dans la largeur, sans débordement ;
- [ ] faire défiler la page avec la molette **au-dessus de la carte** ne zoome pas la carte et ne bloque pas la page ;
- [ ] la photo ne déforme pas le texte à côté d'elle (colonne unique en mobile).

À **≥ 1280 px** :

- [ ] la section boutique garde ses deux colonnes, la colonne image ne dépasse pas 460 px de large ni 560 px de haut ;
- [ ] la section infos garde ses deux colonnes, adresse et carte visibles ensemble ;
- [ ] l'alternance des fonds se lit : blanc → vert → orange → blanc → rose → vert foncé → blanc.

## 6. Accessibilité

- [ ] Un seul `h1` sur la page (dans le hero) ; chaque nouvelle section ajoute exactement un `h2` ; les `h3` de la section infos n'introduisent pas de saut de niveau.
- [ ] Navigation au clavier de bout en bout : aucun piège de focus, y compris au passage de la carte.
- [ ] Les horaires sont annoncés jour par jour avec leur plage (structure `<dl>`).
- [ ] L'adresse est dans un `<address>` et n'apparaît pas en italique.
- [ ] Carte désactivée (DevTools → blocage du domaine `unpkg.com`, ou mode hors ligne) : l'adresse complète reste lisible et la page reste navigable (SC-008).

## 7. Relecture croisée du contenu

Comparer la section boutique au bloc « La Boutique » de `brasserie-assets/Texte site internet.md` (version du 2026-09-18) :

- [ ] horaires identiques ;
- [ ] adresse identique ;
- [ ] les trois propositions (goûter, discuter avec le brasseur, bouteilles ouvertes) sont présentes ;
- [ ] aucun fait ajouté.

Et pour la section infos :

- [ ] seuls les repères re-vérifiés sont affichés ;
- [ ] aucune mention de ligne de bus ;
- [ ] aucune coordonnée de contact.
