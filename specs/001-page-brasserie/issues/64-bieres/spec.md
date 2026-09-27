# Feature Specification: Découvrir les bières de La Sibra — gamme permanente, brassins éphémères, lieux revendeurs (issue #64)

**Feature Branch**: `001-page-brasserie-bieres`

**Created**: 2026-09-19

**Status**: Draft

**Parent feature**: [`specs/001-page-brasserie/`](../../spec.md) — epic « Page La Sibra ». Les artefacts de l'epic (spec.md, plan.md, research.md, data-model.md, contracts/, tasks.md) font autorité ; ce document ne fait que découper le périmètre de l'issue GitHub #64 (tâche T022) et n'introduit aucune décision contradictoire.

**Input**: Issue GitHub [#64](https://github.com/sylvainDNS/communile.fr/issues/64) — « US3 (T022) : section bières — gamme permanente, brassins éphémères, lieux revendeurs ».

**Dépend de**: issue #59 (socle : route `/la-sibra`, thème `sibra`, photos `src/features/sibra/images/`) et #60 (hero, « c'est quoi ? », Instagram) — toutes deux mergées dans la branche epic.

## Contexte

La page `/la-sibra` présente aujourd'hui le lieu (premier écran, section « c'est quoi ? », fil Instagram). Un visiteur sait ce qu'est la microbrasserie, mais pas ce qu'elle brasse ni où boire ses bières ailleurs qu'à la boutique.

Cette issue livre la **story P3** de l'epic : la section « bières ». Elle distingue deux offres — une gamme permanente de recettes classiques et des brassins éphémères saisonniers — et se termine par la liste, volontairement ouverte, des lieux où retrouver les bières.

Le texte source (`brasserie-assets/Texte site internet.md`, version du 2026-09-18) est la seule source éditoriale : aucun nom de bière, aucun lieu revendeur ne doit être inventé, et aucun lien externe ne doit être créé vers les lieux tiers (décision de la coopérative du 2026-09-18).

La section boutique (#61) et la section tireuse (#65) ne sont pas encore livrées : la section bières s'insère à la place qu'elle occupera à terme, c'est-à-dire après la présentation du lieu et avant le fil Instagram.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Découvrir la gamme permanente (Priority: P3)

Un amateur de bière veut savoir ce qu'il trouvera à coup sûr à la brasserie, quel que soit le moment de l'année.

**Why this priority**: c'est le cœur du test indépendant de la story US3 de l'epic ; la page est déjà utile sans ce détail, mais il donne envie de venir.

**Independent Test**: ouvrir la page, atteindre la section bières → le visiteur peut citer les quatre bières permanentes et dire ce qu'a de particulier la Carlota, sans naviguer ailleurs.

**Acceptance Scenarios**:

1. **Given** la section bières affichée, **When** le visiteur la lit, **Then** il y trouve un bloc « des recettes classiques indémodables » citant Blonde, Ambrée, Triple et Blanche comme gamme permanente.
2. **Given** le même bloc, **When** le visiteur poursuit, **Then** la Carlota est mise en avant comme bière emblématique, avec sa recette héritée de Charlotte elle-même, inchangée depuis 15 ans.
3. **Given** le même bloc, **When** on compare au texte source, **Then** aucun nom de bière, aucune caractéristique (degré, amertume, ingrédient) absent du texte source n'a été ajouté.

---

### User Story 2 - Découvrir les brassins éphémères (Priority: P3)

Le même visiteur veut savoir s'il y a des nouveautés à découvrir au fil des saisons.

**Why this priority**: complète la compréhension de l'offre ; c'est le deuxième volet explicite du test indépendant de l'epic.

**Independent Test**: lire la section bières → le visiteur comprend qu'il existe, en plus de la gamme permanente, des bières saisonnières créées par le brasseur.

**Acceptance Scenarios**:

1. **Given** la section bières, **When** le visiteur la parcourt, **Then** un second bloc, visuellement distinct du premier, annonce « des brassins éphémères saisonniers ».
2. **Given** ce bloc, **When** le visiteur le lit, **Then** il apprend que le brasseur Simon crée des bières inédites, surprenantes mais toujours délicieuses.
3. **Given** les deux blocs, **When** le visiteur les compare, **Then** il distingue sans ambiguïté ce qui est permanent de ce qui est éphémère.

---

### User Story 3 - Savoir où retrouver les bières (Priority: P3)

Un amateur qui ne peut pas venir à la boutique veut savoir dans quels autres lieux boire ou acheter ces bières.

**Why this priority**: couvre FR-014 de l'epic et le scénario d'acceptation 3 de l'US3 ; c'est l'ajout de la révision du 2026-09-18.

**Independent Test**: atteindre le pied de la section bières → le visiteur lit la liste des lieux nommés et comprend qu'elle n'est pas exhaustive ; le seul lien proposé mène à une page du site.

**Acceptance Scenarios**:

1. **Given** le pied de la section bières, **When** le visiteur y arrive, **Then** un bloc « Où retrouver nos bières ? » liste Le Wattignies, L'industrie, Ohmtown et Pioche, dans l'orthographe du texte source.
2. **Given** cette liste, **When** le visiteur cherche à en savoir plus sur Le Wattignies, **Then** l'entrée correspondante est un lien interne vers la page du lieu de la coopérative, construit à partir des constantes de routes partagées.
3. **Given** cette liste, **When** le visiteur regarde L'industrie, Ohmtown et Pioche, **Then** ces entrées sont nommées sans lien et se distinguent visuellement du lieu de la coopérative.
4. **Given** cette liste, **When** le visiteur la termine, **Then** une mention « … et bien d'autres » indique que la liste n'est pas exhaustive, en écho au « … » du texte source.
5. **Given** un lecteur d'écran, **When** il parcourt le bloc, **Then** les lieux sont annoncés comme une liste, et le nombre d'éléments est correct.

---

### Edge Cases

- **Écran de 375 px** : les deux blocs, la photo et la liste de lieux doivent rester lisibles, sans débordement horizontal ni chevauchement (FR-005 et FR-012 de l'epic).
- **Contraste sur la charte** : la section ne doit introduire aucun texte courant blanc sur un fond brut, ni aucun texte blanc sur l'orange. Les composants rendant du blanc sur fond tertiaire sont proscrits sur cette page (contrat thème de l'epic).
- **Liste ouverte** : le « … » du texte source ne doit pas être reproduit tel quel comme une entrée de la liste (il serait annoncé comme un lieu par un lecteur d'écran) ; il est rendu par une formulation explicite.
- **Lieux tiers** : aucune URL n'a été fournie pour L'industrie, Ohmtown et Pioche ; en inventer une (site, page Facebook, Google Maps) serait une publication d'information non validée.
- **Ordre des sections** : les sections boutique (#61) et tireuse (#65) n'existent pas encore ; l'insertion de la section bières ne doit pas préempter leur place ni compliquer leur ajout ultérieur.
- **Coordonnées** : téléphone et email restent sous gate de confirmation (#67) et ne doivent apparaître nulle part dans cet incrément — y compris dans le bloc revendeurs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La page DOIT comporter une section dédiée aux bières, dotée d'un titre de section de niveau 2, cohérent avec les autres titres de section de la page.
- **FR-002**: La section DOIT présenter un bloc « des recettes classiques indémodables » exposant la gamme permanente (Blonde, Ambrée, Triple, Blanche), la formule « de la blonde de soif à l'emblématique Carlota » et la mise en avant de la Carlota (recette héritée de Charlotte elle-même, inchangée depuis 15 ans, « il y en a pour tous les goûts »).
- **FR-003**: La section DOIT présenter un second bloc « des brassins éphémères saisonniers » exposant la créativité du brasseur Simon (bières inédites, surprenantes mais toujours délicieuses).
- **FR-004**: Les deux blocs DOIVENT être visuellement distincts l'un de l'autre et reprendre le patron de blocs d'information déjà utilisé sur le site (page Les Landes Fertiles), sans introduire de nouveau composant partagé.
- **FR-005**: La section DOIT afficher la photo de la salle de brassage livrée par le socle, avec une description alternative en français décrivant la scène, servie en plusieurs largeurs pour ne pas pénaliser les petits écrans.
- **FR-006**: La section DOIT se terminer par un bloc « Où retrouver nos bières ? » listant exactement les quatre lieux du texte source — Le Wattignies, L'industrie, Ohmtown, Pioche — dans cette orthographe, sans entrée supplémentaire ni omission.
- **FR-007**: Dans ce bloc, le lieu de la coopérative (Le Wattignies) DOIT être un lien interne vers sa page, construit à partir des constantes de routes partagées (aucune URL écrite en dur), et se distinguer visuellement des lieux tiers ; les lieux tiers NE DOIVENT porter aucun lien.
- **FR-008**: Le bloc DOIT indiquer que la liste n'est pas exhaustive par la mention « … et bien d'autres », rendue comme un texte et non comme une entrée cliquable ou un nom de lieu.
- **FR-009**: Les lieux DOIVENT être exposés comme une liste au sens du HTML, pour être annoncés correctement par les technologies d'assistance.
- **FR-010**: Les données éditoriales de la section (bières et lieux revendeurs) DOIVENT être portées par des constantes locales à la section, selon le patron des sections existantes — pas de constante globale, pas de fichier de données.
- **FR-011**: La section DOIT être insérée dans la page après la présentation du lieu et avant le fil Instagram, à l'emplacement qu'occupera à terme l'intervalle « après boutique (#61), avant tireuse (#65) ».
- **FR-012**: Les règles de contraste du contrat de thème de l'epic DOIVENT être respectées : texte courant en couleur de premier plan, blanc réservé au grand texte (≥ 24 px, ou ≥ 18,66 px en graisse 700) sur le vert et le rose, jamais de blanc sur l'orange ; aucun composant rendant du blanc sur fond tertiaire n'est introduit.
- **FR-013**: Le nommage DOIT suivre la convention de l'epic : sans article pour les fichiers de la feature (`sibra-bieres-section`), article conservé uniquement pour ce qui dérive de l'URL.
- **FR-014**: Aucune coordonnée du lieu (téléphone, email) NE DOIT apparaître dans cet incrément ; elles restent soumises au gate de confirmation (#67).
- **FR-015**: Le rendu DOIT être vérifié visuellement à 375 px et à ≥ 1280 px ; les ajustements se font dans la section de la feature, jamais sur les teintes de base du thème.

### Non-Goals (hors périmètre de cette issue)

- Section boutique, horaires et adresse (#61) ; section prêt de tireuse (#65) ; infos pratiques et carte.
- Entrées de navigation, pied de page, carte du lieu sur l'accueil (#62).
- Métadonnées SEO, image Open Graph, JSON-LD, sitemap (#63) — y compris toute donnée structurée décrivant les bières.
- Polish final, revue design d'ensemble et passe Lighthouse (#66).
- Liens externes vers les lieux tiers, quels qu'ils soient, et toute entrée de liste non fournie par le texte source.
- Fiche détaillée par bière (degré, amertume, format), non fournie par le texte source.

### Key Entities

- **Bière (gamme)** : nom, caractère permanent ou éphémère, description courte issue du texte source. Regroupée en deux blocs, pas en fiches individuelles.
- **Lieu revendeur** : nom tel qu'écrit dans le texte source, lien interne optionnel (uniquement pour les lieux de la coopérative), appartenance ou non à la coopérative (qui détermine le traitement visuel).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Une personne qui lit la section une seule fois peut citer les quatre bières permanentes et expliquer ce que sont les brassins éphémères, sans relire ni naviguer ailleurs.
- **SC-002**: 100 % des noms de bières et de lieux affichés proviennent du texte source du 2026-09-18 — zéro entrée inventée (vérifiable par relecture croisée section ↔ texte source).
- **SC-003**: À 375 px de large, la section s'affiche sans défilement horizontal et sans texte tronqué ou chevauché ; à ≥ 1280 px, elle conserve le rythme visuel des autres sections de la page.
- **SC-004**: Aucun couple texte/fond de la section ne descend sous le seuil WCAG 2.1 AA applicable (4,5:1 pour le texte courant, 3:1 pour le grand texte).
- **SC-005**: Un seul lien sortant du bloc revendeurs, pointant vers une page interne du site ; zéro lien externe (vérifiable en inspectant les liens de la section).
- **SC-006**: La page continue de ne comporter qu'un seul titre de niveau 1, et la section ajoute exactement un titre de niveau 2.

## Assumptions

- **Emplacement d'insertion** : les sections boutique (#61) et tireuse (#65) n'étant pas livrées, la section bières est placée entre la présentation (« c'est quoi ? ») et le fil Instagram. C'est exactement la position relative attendue une fois #61 et #65 mergées, en supposant que chacune s'insère au bon endroit ; aucune coordination supplémentaire n'est requise.
- **Titre de section** : l'epic ne fixe pas la formulation du titre. On retient « Nos bières », cohérent avec la voix éditoriale du texte source (« Retrouvez nos bières… ») et avec les titres des autres sections de la page.
- **Traitement visuel des lieux** : le lieu de la coopérative et les lieux tiers se distinguent par la couleur de leur étiquette, conformément au data-model de l'epic (`primary` vs `neutral`).
- **Fond de section** : la section utilise le fond clair par défaut du site, pour alterner avec la section de présentation qui la précède (fond vert) et parce que les étiquettes neutres n'y sont lisibles que sur fond clair contrasté.
- **Titres de section en pastilles** : le patron copié (Les Landes Fertiles) utilise des pastilles de titre dont la variante tertiaire rend du texte blanc sur orange, proscrite par le contrat de thème. Le titre reprend donc le composant de titre déjà utilisé par les sections de la page La Sibra.
- Le texte source est adapté à la marge (titres, ponctuation, majuscules) sans en changer le sens ni les faits, comme autorisé par l'epic.
