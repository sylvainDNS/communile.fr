# Feature Specification: Réserver une tireuse à La Sibra — prêt de tireuse pour l'achat d'un fût (issue #65)

**Feature Branch**: `001-page-brasserie-tireuse`

**Created**: 2026-09-19

**Status**: Draft

**Parent feature**: [`specs/001-page-brasserie/`](../../spec.md) — epic « Page La Sibra ». Les artefacts de l'epic (spec.md, plan.md, research.md, data-model.md, contracts/, tasks.md) font autorité ; ce document ne fait que découper le périmètre de l'issue GitHub #65 (tâche T023) et n'introduit aucune décision contradictoire, à l'exception — documentée et signalée — du traitement du numéro de téléphone (cf. Assumptions et « Écart assumé »).

**Input**: Issue GitHub [#65](https://github.com/sylvainDNS/communile.fr/issues/65) — « US4 (T023) : section prêt de tireuse ».

**Dépend de**: issue #59 (socle : route `/la-sibra`, thème `sibra`), #60 (hero, « c'est quoi ? », Instagram) et #64 (section bières) — toutes mergées dans la branche epic.

## Contexte

La page `/la-sibra` présente le lieu, sa gamme de bières et les endroits où les retrouver. Elle ne dit rien d'un service pourtant différenciant, cité par le texte source : la brasserie prête une tireuse à qui achète un fût.

Cette issue livre la **story P4** de l'epic : la section « prêt de tireuse ». Elle expose le principe (prêt conditionné à l'achat d'un fût), les occasions visées (anniversaire, séminaire d'entreprise, week-end entre copaines) et le mode de réservation (appeler la brasserie).

Le texte source (`brasserie-assets/Texte site internet.md`, version du 2026-09-18) est la seule source éditoriale :

> **Prêt de tireuses** — La brasserie propose aussi le prêt de tireuse pour l'achat d'un fût. Vous avez un anniversaire, un séminaire d'entreprise ou juste un weekend entre copaines ? Appelez la brasserie pour réserver une tireuse !

La section boutique et infos pratiques (#61) n'est pas encore livrée : la section tireuse s'insère à la place qu'elle occupera à terme, c'est-à-dire après la section bières et avant le fil Instagram (les infos pratiques viendront s'intercaler ensuite).

### Écart assumé avec l'énoncé de la tâche T023

L'epic (T023, data-model) prévoit un CTA en lien `tel:+33633015663`. Ce numéro provient de l'archive Wayback d'avril 2025 et reste **non confirmé**, sous gate humain [#67](https://github.com/sylvainDNS/communile.fr/issues/67) (« aucune coordonnée non confirmée ne part en production »). Cet incrément livre donc le **mode de réservation sans exposer le numéro** : la section dit qu'on réserve en appelant la brasserie, et le numéro cliquable sera ajouté par le gate #67 (ou par la section infos pratiques #61, qui porte les coordonnées) une fois la coordonnée confirmée. Le test indépendant de l'US4 — « la page décrit le service et le mode de réservation » — reste satisfait. **À valider par l'humain** (cf. Assumptions A1).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Comprendre le service et sa condition (Priority: P4)

Un particulier qui organise une fête, ou une entreprise qui prépare un séminaire, veut savoir si la brasserie peut fournir de la bière à la pression et à quelles conditions.

**Why this priority**: c'est le cœur du test indépendant de la story US4 de l'epic ; la page est déjà utile sans ce service, mais il transforme un visiteur curieux en client.

**Independent Test**: ouvrir la page, atteindre la section tireuse → le visiteur peut dire que la brasserie prête une tireuse, et que le prêt est lié à l'achat d'un fût, sans naviguer ailleurs.

**Acceptance Scenarios**:

1. **Given** la section tireuse affichée, **When** le visiteur la lit, **Then** il comprend que le prêt de la tireuse accompagne l'achat d'un fût (et n'est pas un service de location facturé à part).
2. **Given** la même section, **When** le visiteur cherche si son occasion est concernée, **Then** il y trouve les trois occasions du texte source (anniversaire, séminaire d'entreprise, week-end entre copaines) formulées comme des exemples et non comme une liste limitative.
3. **Given** la même section, **When** on compare au texte source, **Then** aucune condition (durée de prêt, caution, tarif, volume du fût, zone de livraison) absente du texte source n'a été ajoutée.

---

### User Story 2 - Savoir comment réserver (Priority: P4)

Le même visiteur, convaincu, veut savoir quelle action effectuer pour réserver.

**Why this priority**: sans l'action à faire, la section informe mais ne convertit pas ; c'est la seconde moitié de l'acceptance scenario de l'US4 de l'epic.

**Independent Test**: ouvrir la page, lire la section → le visiteur sait qu'il doit appeler la brasserie pour réserver, et cette consigne est mise en évidence par rapport au texte courant.

**Acceptance Scenarios**:

1. **Given** la section tireuse affichée, **When** le visiteur cherche comment réserver, **Then** il lit une invitation explicite à appeler la brasserie, visuellement distincte du reste du texte.
2. **Given** la même section, **When** le visiteur cherche le numéro, **Then** aucun numéro de téléphone ni adresse email n'est affiché dans cet incrément (gate #67), et la formulation n'évoque pas un numéro qui serait visible ailleurs sur la page tant que les infos pratiques (#61) ne sont pas livrées.
3. **Given** un utilisateur de lecteur d'écran, **When** il parcourt la section, **Then** le mode de réservation lui est annoncé comme du texte, sans commande interactive factice (pas de bouton ou de lien sans destination).

### Edge Cases

- **Numéro non confirmé** : afficher une coordonnée issue d'une archive de 2025 exposerait la coopérative à publier un numéro erroné (constitution I, FR-011 de l'epic). Aucun `tel:` n'est donc écrit dans cet incrément.
- **Faux interactif** : un CTA qui ressemble à un bouton mais ne déclenche rien est un piège d'accessibilité et d'attente utilisateur ; la mise en avant de l'appel est purement typographique tant qu'il n'y a pas de destination.
- **Contraste sur la charte** : aucun texte courant blanc sur fond de marque ; jamais de blanc sur l'orange ; blanc réservé au grand texte (≥ 24 px, ou ≥ 18,66 px en graisse 700) sur le vert et le rose (contrat thème de l'epic).
- **Alternance des fonds** : la section précédente (bières) est sur fond clair et la suivante (Instagram) aussi ; la section tireuse doit se distinguer sans introduire de teinte hors charte.
- **Ordre des sections** : la section infos pratiques (#61) n'existe pas encore ; l'insertion ne doit ni préempter sa place ni compliquer son ajout.
- **Liste d'occasions** : les occasions sont des exemples ; la formulation ne doit pas laisser croire que les autres usages sont exclus.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La page DOIT comporter une section dédiée au prêt de tireuse, dotée d'un titre de section de niveau 2, cohérent avec les autres titres de section de la page.
- **FR-002**: La section DOIT énoncer le principe du service : la brasserie prête une tireuse pour l'achat d'un fût.
- **FR-003**: La section DOIT citer les trois occasions du texte source — anniversaire, séminaire d'entreprise, week-end entre copaines — présentées comme des exemples.
- **FR-004**: La section DOIT indiquer le mode de réservation : appeler la brasserie.
- **FR-005**: L'invitation à appeler DOIT être mise en évidence typographiquement par rapport au texte courant de la section.
- **FR-006**: Aucun numéro de téléphone, aucune adresse email NE DOIT apparaître dans cet incrément ; aucune destination d'appel n'est donc créée (gate #67).
- **FR-007**: La section NE DOIT contenir aucun élément interactif sans destination (bouton ou lien factice) ; si aucune action n'est disponible, le message de réservation reste du texte.
- **FR-008**: La section NE DOIT ajouter aucune condition commerciale absente du texte source (tarif, caution, durée, volume, livraison).
- **FR-009**: Les données éditoriales de la section (occasions) DOIVENT être portées par des constantes locales à la section, selon le patron des sections existantes — pas de constante globale, pas de fichier de données.
- **FR-010**: Les occasions DOIVENT être exposées comme une liste au sens du HTML si elles sont rendues sous forme de liste visuelle, pour être annoncées correctement par les technologies d'assistance.
- **FR-011**: La section DOIT être insérée dans la page après la section bières et avant le fil Instagram, à l'emplacement qu'occupera à terme l'intervalle « après bières (#64), avant infos pratiques (#61) ».
- **FR-012**: Les règles de contraste du contrat de thème de l'epic DOIVENT être respectées : texte courant en couleur de premier plan, blanc réservé au grand texte (≥ 24 px ou ≥ 18,66 px en graisse 700) sur le vert et le rose, jamais de blanc sur l'orange ; aucun composant rendant du blanc sur fond tertiaire n'est introduit.
- **FR-013**: Le nommage DOIT suivre la convention de l'epic : sans article pour les fichiers de la feature (`sibra-tireuse-section`), article conservé uniquement pour ce qui dérive de l'URL.
- **FR-014**: La section NE DOIT introduire aucun composant partagé nouveau ni modifier un composant partagé existant ; elle réutilise les composants déjà employés par la page.
- **FR-015**: Le rendu DOIT être vérifié visuellement à 375 px et à ≥ 1280 px ; les ajustements se font dans la section de la feature, jamais sur les teintes de base du thème.
- **FR-016**: La page DOIT continuer à ne comporter qu'un seul titre de niveau 1, et la hiérarchie des titres DOIT rester sans saut de niveau.

### Non-Goals (hors périmètre de cette issue)

- Section boutique, horaires, adresse, coordonnées et carte (#61) — y compris l'affichage du téléphone.
- Confirmation des coordonnées et ajout du lien d'appel (#67).
- Entrées de navigation, pied de page, carte du lieu sur l'accueil (#62).
- Métadonnées SEO, image Open Graph, JSON-LD, sitemap (#63) — y compris toute donnée structurée décrivant le service.
- Polish final, revue design d'ensemble et passe Lighthouse (#66).
- Formulaire ou réservation en ligne : le site reste vitrine (constitution, principe II).
- Toute condition commerciale ou tarif non fournis par le texte source ; toute photo de tireuse (aucune n'a été livrée).

### Key Entities

- **Service (prêt de tireuse)** : principe (prêt), condition (achat d'un fût), mode de réservation (appel). Correspond à l'entité « Service » du data-model de l'epic, moins la coordonnée téléphonique gelée par #67.
- **Occasion** : libellé court issu du texte source (anniversaire, séminaire d'entreprise, week-end entre copaines) ; sert d'exemple d'usage, sans valeur limitative.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Une personne qui lit la section une seule fois peut énoncer le principe (tireuse prêtée pour l'achat d'un fût) et l'action à faire (appeler la brasserie), sans relire ni naviguer ailleurs.
- **SC-002**: 100 % des faits affichés (condition, occasions, mode de réservation) proviennent du texte source du 2026-09-18 — zéro condition inventée (vérifiable par relecture croisée section ↔ texte source).
- **SC-003**: À 375 px de large, la section s'affiche sans défilement horizontal et sans texte tronqué ou chevauché ; à ≥ 1280 px, elle conserve le rythme visuel des autres sections de la page.
- **SC-004**: Aucun couple texte/fond de la section ne descend sous le seuil WCAG 2.1 AA applicable (4,5:1 pour le texte courant, 3:1 pour le grand texte).
- **SC-005**: Zéro occurrence d'un numéro de téléphone, d'un `tel:` ou d'une adresse email dans le code livré par cet incrément (vérifiable par recherche textuelle sur le diff).
- **SC-006**: Zéro élément interactif sans destination dans la section (vérifiable en inspectant les liens et boutons de la section).

## Assumptions

- **A1 — Numéro de téléphone gelé (à valider par l'humain)** : l'epic prévoit un lien `tel:+33633015663` ; le numéro étant non confirmé et sous gate #67, cet incrément livre le mode de réservation sans le numéro. Si la coopérative confirme le numéro avant la mise en ligne, l'ajout du lien d'appel dans cette section est une modification d'une ligne, portée par #67 ou #61.
- **Titre de section** : l'epic ne fixe pas la formulation. On retient « Prêt de tireuse », au singulier comme le corps du texte source (le titre source « Prêt de tireuses » est au pluriel, mais la phrase et l'usage parlent d'une tireuse).
- **Emplacement d'insertion** : la section infos pratiques (#61) n'étant pas livrée, la section tireuse est placée entre la section bières et le fil Instagram. C'est exactement sa position relative attendue une fois #61 mergée.
- **Fond de section** : la section précédente et la suivante sont sur fond clair ; la section tireuse prend un fond de marque pour marquer la rupture, dans le respect des règles de contraste (pas d'orange sous du texte blanc).
- **Occasions sous forme de liste** : le texte source les énumère dans une question ; les rendre lisibles d'un coup d'œil (liste ou trio d'items) est un choix de mise en forme qui ne change ni le sens ni les faits, comme autorisé par l'epic.
- **Aucune photo** : aucune des trois photos livrées ne montre une tireuse ; la section est textuelle, éventuellement accompagnée d'un ornement déjà présent dans la feature, afin de ne pas illustrer le propos par une image hors sujet.
- Le texte source est adapté à la marge (titres, ponctuation, majuscules) sans en changer le sens ni les faits, comme autorisé par l'epic.
