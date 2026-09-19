# Research — section prêt de tireuse (issue #65)

Les décisions structurantes (palette, texte source, patron de page, conventions de nommage) sont tranchées dans l'epic (`../../research.md`). Ce document ne traite que les points d'adaptation propres à la tâche T023, et capitalise sur les pièges rencontrés en #60 et #64.

---

## R65-1 — Que faire du CTA téléphone prévu par T023 ?

**Décision** : la section énonce le mode de réservation (« Appelez la brasserie pour réserver une tireuse ! ») **sans afficher le numéro et sans lien `tel:`**.

**Rationale** :
- Le numéro `06 33 01 56 63` provient de l'archive Wayback d'avril 2025 ; le data-model de l'epic le marque « ⚠️ issu de l'archive — à confirmer » et l'issue #67 en fait un gate explicite : « aucune coordonnée non confirmée ne part en production ».
- La constitution (principe I) interdit toute coordonnée non vérifiée en production.
- L'issue #64, mergée, applique déjà la même règle (FR-014 de sa spec) : cet incrément reste cohérent avec le précédent.
- Le test indépendant de l'US4 de l'epic porte sur le fait que la page « décrit le service **et le mode de réservation** » — « appeler la brasserie » satisfait ce critère sans publier de coordonnée.

**Alternatives considérées** :
- *Écrire le lien `tel:+33633015663` comme prévu par T023* : rejetée — publie une coordonnée non confirmée, et un merge vers l'epic ferait exister cette donnée dans la branche de livraison.
- *Lien interne vers la section infos pratiques (ancre)* : rejetée — cette section (#61) n'existe pas encore ; l'ancre serait morte.
- *Bouton d'apparence cliquable sans destination* : rejetée — élément interactif factice, piège d'accessibilité (FR-007).

**Conséquence** : l'ajout du lien d'appel est une modification d'une ligne, à faire par #67 (confirmation) ou #61 (infos pratiques). **À valider par l'humain** : si la coopérative confirme le numéro avant la mise en ligne, le CTA devient un lien.

---

## R65-2 — Fond de section

**Décision** : `Section variant="secondary"` (rose `#DC5B87`).

**Rationale** : la section précédente (bières) et la suivante (Instagram) sont sur fond clair ; un fond de marque marque la rupture et signale un service à part. Le vert (`primary`) est déjà porté par la section « c'est quoi ? » : réutiliser le rose équilibre la page sur les trois couleurs de la charte (le hero porte déjà l'orange dans le motif). L'orange est exclu comme fond de section porteuse de texte (2,0:1 en blanc ; utilisable seulement sous du `foreground`, ce qui donnerait un bloc très saturé sur toute la largeur).

**Contrastes applicables** (contrat de thème de l'epic) : blanc sur rose = 3,6:1 → **grand texte uniquement** (≥ 24 px, ou ≥ 18,66 px en graisse 700) ; `foreground` sur rose = 5,5:1 → texte courant autorisé.

**Alternatives** : fond blanc (rejetée — trois sections claires consécutives, le service se fond dans la gamme de bières) ; `variant="accent"` vert foncé (rejetée — répète la section « c'est quoi ? » et assombrit le bas de page).

---

## R65-3 — Titre de section et mise en avant de l'appel

**Décision** : `Heading as="h2" size="xl" weight="bold" color="white"` pour le titre ; l'invitation à appeler en `Text size="xl" weight="bold" color="white"`.

**Rationale** : c'est exactement le patron validé en #60 sur la section « c'est quoi ? » (fond vert). `Text size="xl"` rend `text-xl` (20 px) sous `md` : seul `weight="bold"` (700) le qualifie comme grand texte au sens WCAG (≥ 18,66 px en 700). `weight="semibold"` (600) ne qualifie **pas** — piège déjà rencontré en #60 (R60-6).

**Interdits rappelés** : `Text size="base" color="white"` sur fond de marque ; `Badge variant="tertiary"` ; le patron `HeadingBadges` des pages existantes (sa pastille tertiaire rend du blanc sur orange).

---

## R65-4 — Rendu des trois occasions

**Décision** : une liste HTML (`<ul role="list">`) de trois `Card class="bg-background"` (fond clair), chacune associant une icône `Icon` et un libellé court.

**Rationale** :
- Le texte source énumère les occasions dans une question (« Vous avez un anniversaire, un séminaire d'entreprise ou juste un weekend entre copaines ? ») ; en faire trois items lisibles d'un coup d'œil ne change ni le sens ni les faits.
- Sur fond rose, des cartes claires garantissent 4,5:1 pour le texte courant sans dépendre du contraste blanc/rose.
- `Card` rend `bg-white` sans bordure ni ombre : invisible sur une section blanche (constat de #64), mais parfaitement lisible ici, sur fond de marque. On force malgré tout `bg-background` pour rester sur le neutre du thème plutôt que sur un blanc pur, comme en #64.
- `role="list"` est conservé : Tailwind neutralise le style de liste, ce qui peut supprimer la sémantique de liste dans certains navigateurs (même traitement qu'en #64).

**Icônes** (parmi celles déjà présentes dans `src/utils/icons.ts`, aucune icône ajoutée) :

| Occasion | Icône | Raison |
|---|---|---|
| Un anniversaire | `calendar-heart` | date + affect, déjà utilisée pour des événements sur le site |
| Un séminaire d'entreprise | `users-round` | groupe de personnes |
| Un week-end entre copaines | `smile` | registre convivial du texte source |

Les icônes sont décoratives : `Icon` rend `aria-hidden="true"` par défaut (sans `title`), le sens est porté par le libellé.

**Alternatives** : `Tag` (rejetée — le gradient de `Tag color="primary"` rend `text-primary` à 2,51:1, défaut structurel constaté en #64 ; et les pastilles neutres se lisent mal sur fond saturé) ; simple phrase reprise telle quelle (rejetée — moins lisible à 375 px, et le test indépendant demande que les occasions soient repérables).

---

## R65-5 — Ornement et illustration

**Décision** : aucune photo ; réutilisation de `sibra-what-ornament.svg` (motif « trois disques ») en `text-secondary-accent`, en décoration d'angle, `aria-hidden="true"`, avec `Section ... class="overflow-hidden"`.

**Rationale** : aucune des trois photos livrées ne montre une tireuse ni un fût ; illustrer par une photo hors sujet contreviendrait au principe I (pas de contenu de remplissage). L'ornement est déjà dans la feature (livré par #60), ne pèse rien et assure la continuité visuelle. `text-secondary-accent` sur fond `secondary` donne un contraste de ton discret, conforme au rôle décoratif défini par le contrat de thème.

**Piège rappelé** : ne jamais écrire `fill="var(--color-…)"` dans un attribut de présentation SVG (ne substitue pas) — l'ornement utilise `currentColor`, colorisé par une classe Tailwind `text-*` (R60-1).

---

## R65-6 — Emplacement dans la page

**Décision** : `<SibraTireuseSection />` inséré entre `<SibraBieresSection />` et `<SibraInstagramSection />` dans `src/pages/la-sibra.astro`.

**Rationale** : l'epic place la tireuse après les bières et avant les infos pratiques (#61, non livrée). L'insertion avant le fil Instagram est donc la position relative définitive : quand #61 arrivera, elle s'intercalera entre la tireuse et Instagram sans toucher à cette section.

---

## R65-7 — Composants partagés : ce qu'on ne touche pas

Rappel des défauts connus des composants partagés, **non corrigés ici** (hors périmètre, à traiter globalement) :

- `src/components/text.astro` : la variante `size="base"` déclare `'text-base text-lg'` ; `cn`/`twMerge` (`src/utils/style.ts`) ne garde que la seconde, si bien que le rendu effectif est **`text-lg` (18 px)**, pas `text-base` (16 px). Bug préexistant ; les sections existantes de la page l'utilisent telles quelles, on reste cohérent.
- `src/components/tag.astro` : `color="primary"` rend `text-primary` sur un dégradé clair de `primary` → 2,51:1. Non utilisé dans cette section.
- `src/components/card.astro` / `info-card.astro` : `bg-white` en dur, sans bordure — neutralisé ici par `bg-background` sur fond de marque.
