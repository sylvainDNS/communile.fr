# Quickstart : vérifier la section prêt de tireuse de La Sibra (issue #65)

Guide de validation de bout en bout de l'incrément T023. À dérouler entièrement avant d'ouvrir la PR vers la branche epic.

## Prérequis

- Node ≥ 21, dépendances déjà installées (`node_modules/` présent).
- Branche `001-page-brasserie-tireuse`, partie de `001-page-brasserie` à jour.

> ⚠️ `pnpm` est cassé sur le poste de développement de référence (corepack résout une version dont le gate `approve-builds` bloque `esbuild`/`sharp`/`workerd`) et génère un `pnpm-workspace.yaml` parasite à la racine. Invoquer les binaires directement, comme ci-dessous. La CI, elle, reste sur ses scripts habituels.

## 1. Gates automatiques

```bash
./node_modules/.bin/eslint . --ext .js,.ts,.astro,.css   # exit 0 attendu
./node_modules/.bin/astro check                          # 0 error
./node_modules/.bin/astro build                          # build vert
```

## 2. Vérifications de contenu (principe I — exactitude)

Ouvrir `brasserie-assets/Texte site internet.md` (bloc « Prêt de tireuses ») à côté de la section et confirmer :

- [ ] le principe affiché est bien « prêt de tireuse pour l'achat d'un fût » ;
- [ ] les trois occasions sont anniversaire, séminaire d'entreprise, week-end entre copaines — dans cet ordre, sans ajout ;
- [ ] les occasions sont présentées comme des exemples, pas comme une liste limitative ;
- [ ] l'invitation à appeler la brasserie est présente et mise en évidence ;
- [ ] aucune condition inventée (tarif, caution, durée, volume du fût, livraison) ;
- [ ] aucun numéro de téléphone ni email n'apparaît (gate #67).

## 3. Vérifications de coordonnées et d'interactivité

```bash
grep -nE 'tel:|mailto:|href|<button|[0-9]{2}( ?[0-9]{2}){4}' src/features/sibra/sections/sibra-tireuse-section.astro
```

- [ ] aucune correspondance : pas de `tel:`, pas de `mailto:`, aucun numéro, aucun `href`, aucun `<button>` ;
- [ ] dans le navigateur, la section ne contient aucun élément focalisable au clavier.

## 4. Vérification visuelle

```bash
./node_modules/.bin/astro dev        # puis ouvrir /la-sibra
```

**À 375 px de large** :

- [ ] aucune barre de défilement horizontale sur la page ;
- [ ] les trois cartes d'occasions s'empilent, libellés et icônes alignés, sans texte tronqué ;
- [ ] le titre et l'invitation à appeler restent lisibles sur le fond rose ;
- [ ] l'ornement décoratif ne recouvre aucun texte et ne crée pas de débordement.

**À ≥ 1280 px** :

- [ ] les trois cartes s'alignent horizontalement sans déséquilibre ;
- [ ] le rythme des sections reste cohérent : hero (blanc) → présentation (vert) → bières (blanc) → tireuse (rose) → Instagram (blanc) ;
- [ ] la section ne détonne pas à côté des cinq autres pages de lieux.

## 5. Accessibilité

- [ ] la section ajoute exactement un `h2` ; la page garde un `h1` unique ; aucun saut de niveau ;
- [ ] les occasions sont annoncées comme une liste de 3 éléments par un lecteur d'écran ;
- [ ] les icônes sont ignorées par les technologies d'assistance (décoratives) ;
- [ ] tout texte blanc de la section est du grand texte (`Heading`, ou `Text size="xl" weight="bold"`) — aucun blanc en `semibold` ni en `size="base"` ;
- [ ] aucun texte blanc sur l'orange (contrat de thème de l'epic).

## 6. Périmètre

```bash
git diff --stat 001-page-brasserie...
```

- [ ] seuls `src/features/sibra/sections/sibra-tireuse-section.astro`, `src/pages/la-sibra.astro` et les artefacts `specs/001-page-brasserie/issues/65-tireuse/` apparaissent ;
- [ ] aucun fichier de `.claude/`, aucun `pnpm-workspace.yaml`, aucun fichier temporaire à la racine.
