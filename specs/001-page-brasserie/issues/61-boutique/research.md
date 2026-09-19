# Research: Préparer sa visite à La Sibra (issue #61)

Ce document ne rejoue pas les recherches de l'epic ([`../../research.md`](../../research.md)) : R1 (nommage), R7 (navigation), R8 (grille d'accueil) et le contrat de thème restent applicables. Il ne traite que les points ouverts par les tâches T013–T015.

---

## R61-1 — Géocodage du 121 rue du Général Buat

- **Decision** : `latitude = 47.225406`, `longitude = -1.543878`.
- **Rationale** : valeur produite par la **Base Adresse Nationale** (`api-adresse.data.gouv.fr`), référentiel officiel français, avec le type de résultat le plus précis (`housenumber`, identifiant BAN `44109_3556_00121`, label renvoyé « 121 Rue Général Buat 44000 Nantes »). Elle a été **recoupée** par un géocodage inverse Nominatim/OpenStreetMap sur ce même point, qui retourne « 121, Rue Général Buat, Saint-Donatien, Malakoff - Saint-Donatien, Nantes, 44000 » — même numéro, même voie, même commune, quartier cohérent avec le « quartier St Clément » du texte source. Deux sources indépendantes concordantes satisfont FR-014 et SC-003.
- **Requêtes rejouables** :
  - `https://api-adresse.data.gouv.fr/search/?q=121%20rue%20du%20General%20Buat%20Nantes&limit=3`
  - `https://nominatim.openstreetmap.org/reverse?lat=47.225406&lon=-1.543878&format=jsonv2`
- **Alternatives considered** : une recherche directe Nominatim sur la chaîne « 121 rue du Général Buat, 44000 Nantes » renvoie un résultat **vide** — d'où le choix de la BAN comme source primaire et de Nominatim en contrôle inverse. Un relevé « à l'œil » sur une carte a été écarté : l'epic (data-model) exige explicitement de ne jamais approximer ce point.
- **Zoom retenu** : 16 (niveau « rue »), comparable au 15 de `contact.astro` mais un cran plus serré, la voie étant longue.

---

## R61-2 — Que faire des repères d'accès issus de l'archive ?

L'epic les tient pour non confirmés (gate #67). Chacun a été examiné séparément plutôt que traité en bloc.

- **Églises Saint-Clément et Saint-Donatien — conservés.**
  - **Decision** : afficher « Entre les églises Saint-Clément et Saint-Donatien ».
  - **Rationale** : ce n'est pas une coordonnée de contact mais un fait géographique, et il est **re-vérifiable** : Basilique Saint-Donatien-et-Saint-Rogatien à `47.229248 / -1.542346` (≈ 445 m au nord-est du point), Église Saint-Clément à `47.221405 / -1.546928` (≈ 500 m au sud-ouest). L'adresse est donc bien située entre les deux. Une fois re-vérifié, le fait cesse d'être « une reprise d'archive » et devient un fait contrôlé : le principe I est satisfait.
  - **Source** : Nominatim/OpenStreetMap, recherche par nom.

- **« Chronobus C1 » — réduit à l'arrêt « Chanzy ».**
  - **Decision** : afficher `Arrêt de bus « Chanzy », à moins de 200 m`, **sans** numéro de ligne (libellé exact retenu, cf. [data-model.md](./data-model.md) § « Repère d'accès » ; le quai le plus proche est à ≈ 170 m, « à moins de 200 m » est donc la borne exacte).
  - **Rationale** : l'existence d'un arrêt nommé « Chanzy » est vérifiable (deux quais OpenStreetMap, `47.224062 / -1.544972` et `47.223598 / -1.545437`, soit ≈ 170 m et ≈ 220 m du point). Le fait qu'il soit desservi par la ligne C1 n'a **pas** pu être re-vérifié : la requête de relations d'itinéraire (Overpass, deux instances) et le portail open data de Nantes Métropole n'ont pas répondu depuis l'environnement de développement. Affirmer un numéro de ligne non vérifié contreviendrait au principe I ; le retirer ne coûte qu'un mot et n'enlève rien à l'utilité du repère.
  - **Alternatives considered** : (a) reprendre « Chronobus C1 » tel quel — écarté, non vérifié ; (b) supprimer complètement le repère transport — écarté, la part vérifiée est utile et l'issue demande explicitement un repère de transport ; (c) bloquer l'issue en attendant #67 — écarté, l'issue précise que le gate bloque la mise en ligne, pas cette issue.
  - **À valider par l'humain** : si la coopérative confirme la ligne, l'ajout est d'un mot dans la constante locale.
  - **Intrant pour #67, non reproduit ici** : la revue de code de la PR #73 rapporte avoir obtenu d'Overpass que les deux quais « Chanzy » portent `route_ref=C1`, ce qui rendrait le « Chronobus C1 » re-vérifiable depuis une source publique. **Je n'ai pas pu reproduire cette requête** (instance principale d'Overpass en surcharge, miroirs muets ou hors zone). Tant qu'elle n'est pas reproduite, le principe I s'applique et le code continue de n'afficher que l'arrêt. À rejouer au moment de lever #67 : `node(around:400,47.225406,-1.543878)[public_transport=platform];out tags center;`
  - **Choix de l'arrêt affiché** : la même revue rapporte un arrêt « Desaix » à ≈ 108 m, plus proche que le quai Chanzy le plus proche (≈ 171 m) — également non reproduit ici. Cela ne change pas le repère retenu : « Chanzy » est l'arrêt que cite la source d'origine et, s'il est bien desservi par le Chronobus, le plus reconnaissable pour s'orienter. La formulation affichée (« à moins de 200 m ») reste exacte dans les deux cas. FR-012 a en revanche été reformulée : elle exigeait « l'arrêt le plus proche », ce que le code ne fait pas et n'a pas à faire.

- **Téléphone et email — exclus.** Voir R61-4.

---

## R61-3 — Contrastes réels de la palette (les chiffres du contrat de thème sont faux)

Le contrat [`../../contracts/theme.md`](../../contracts/theme.md) est connu pour porter des ratios approximatifs — #65 l'avait déjà signalé. Tous les couples utilisés par cette issue ont donc été **recalculés** : conversion `oklch()` → sRGB puis luminance relative WCAG 2.1.

| Fond | Hex | vs blanc | vs `foreground` (`#0A0A0A`) |
|---|---|---|---|
| `primary` vert | `#7A9300` | 3,50:1 | **5,66:1** |
| `primary-accent` vert foncé | `#5E7500` | **5,25:1** | 3,77:1 ✗ |
| `secondary` rose | `#DC5B87` | 3,57:1 | **5,55:1** |
| `secondary-accent` rose foncé | `#B93B6A` | **5,39:1** | 3,67:1 ✗ |
| `tertiary` orange | `#FEA300` | **2,01:1 ✗** | **9,85:1** |
| `tertiary-accent` orange foncé | `#DC8300` | **2,88:1 ✗** | 6,87:1 |
| `background` | `#F1F5F9` | 1,10:1 | 18,05:1 |
| blanc | `#FFFFFF` | — | 19,79:1 |

- **Écarts relevés avec le contrat** (à corriger hors périmètre, cf. [data-model.md](./data-model.md) § « Signalements ») :
  - ligne `tertiary-accent` : le contrat annonce 3,0:1 contre le blanc et autorise le « grand texte blanc » ; le réel est **2,88:1**, sous le seuil 3:1 → la règle du contrat produit du non-conforme AA. Déjà signalé par #65, toujours non corrigé.
  - ligne `Tag color="tertiary"` présentée comme valide : rend du texte orange sur fond clair, soit **1,83:1** sur `background`. Inutilisable.
  - colonne `foreground` sous-estimée d'environ 10 % sur toute la palette (le contrat donne 5,1 / 5,0 / 8,9 là où le calcul donne 5,66 / 5,55 / 9,85). Sous-estimation ⇒ sans danger, mais la table reste fausse.
  - **Nouveau constat de cette issue** : `text-foreground` sur `primary-accent` (3,77:1) et sur `secondary-accent` (3,67:1) est **sous AA pour du texte courant**. Le contrat ne documente pas ces deux couples ; il faut les considérer comme interdits en texte courant.

- **Conséquences retenues pour les deux sections** :
  - section boutique sur `tertiary` → **tout en `text-foreground`** (9,85:1), **zéro blanc**. La règle « grand texte » ne s'applique nulle part : aucun piège possible.
  - section infos sur `accent` (= `primary-accent`) → **tout en blanc** (5,25:1), **zéro `text-foreground`**. Même bénéfice : du texte courant blanc y est conforme AA, il n'y a pas à qualifier de « grand texte ».
  - `Badge variant="tertiary"` et `Tag color="tertiary"` restent proscrits sur la page.
  - `Card` par défaut rend `bg-white` : c'est voulu **ici** (carte blanche sur fond orange, 19,79:1 pour le texte) et c'était le piège de #64/#65 uniquement parce que la section y était blanche.

- **Méthode rejouable** : `specs/001-page-brasserie/issues/61-boutique/quickstart.md` § « Recalcul des contrastes ».

---

## R61-4 — Téléphone et email : pourquoi ne pas les afficher

- **Decision** : n'afficher ni téléphone, ni email, ni lien `tel:` / `mailto:` ; ne pas les remplacer par un bouton ou un lien sans destination.
- **Rationale** : les deux valeurs proviennent de l'archive Wayback d'avril 2025 et restent non confirmées par la coopérative (gate [#67](https://github.com/sylvainDNS/communile.fr/issues/67)). La constitution, principe I, interdit qu'une coordonnée non vérifiée atteigne la production ; un site vitrine qui publie un numéro erroné nuit directement au lieu. L'issue #65 a tranché de la même façon pour son CTA (« Appelez la brasserie pour réserver une tireuse ! », sans numéro et sans faux bouton) : la cohérence de la page l'impose.
- **Pourquoi pas de bouton désactivé / de placeholder** : un élément interactif sans destination est un piège d'accessibilité (annoncé comme actionnable, il ne fait rien) et une fausse promesse. Le choix de #65 est reconduit tel quel.
- **Impact sur le test indépendant de l'US2** : nul. Le test porte sur « horaires exacts + localisation trouvables en un seul parcours » (SC-002 de l'epic) ; ni le téléphone ni l'email n'y participent.
- **Coût de la levée du gate** : une constante locale à ajouter dans `sibra-infos-section.astro` et deux lignes de rendu. Aucune restructuration.
- **À valider par l'humain.**

---

## R61-5 — Mise en forme des horaires « proéminents »

- **Decision** : une liste de définitions `<dl>` (un `<div>` par jour, `<dt>` jour / `<dd>` plage) dans une carte blanche, en `text-2xl font-bold`.
- **Rationale** : « proéminent » est un critère visuel, mais la relation jour ↔ plage doit survivre à la mise en page (FR-004). `<dl>` est le seul groupement HTML natif qui exprime « terme → valeur » ; un tableau serait surdimensionné pour deux lignes, et une suite de `<p>` perdrait la relation. La carte blanche sur l'orange donne le contraste maximal (19,79:1) et isole le bloc du texte courant, ce qui produit la proéminence attendue sans recourir à une couleur.
- **Alternatives considered** : (a) `<table>` — trop lourd pour deux paires, et annoncé comme tableau de données par les lecteurs d'écran ; (b) horaires en gros texte blanc sur l'orange — impossible (2,01:1) ; (c) horaires fondus dans le paragraphe source — échoue au critère « repérables sans lire le paragraphe » (FR-003).
- **Typographie des heures** : « 16 h – 20 h », tiret demi-cadratin. Espaces **ordinaires** et non insécables : `src/` ne contient aucun U+00A0 (le dépôt passe par l'entité `&nbsp;`, inopérante dans une chaîne interpolée par Astro), et la chaîne ne se coupe à aucune largeur testée. Écart typographique assumé et documenté en [data-model.md](./data-model.md).

---

## R61-6 — Carte : réglages et dégradation

- **Decision** : réutiliser `src/components/leaflet-map.astro` sans le modifier, avec `scrollWheelZoom={false}` et un `errorText` francisé renvoyant à l'adresse affichée dans la section.
- **Rationale** :
  - **Molette désactivée** : une carte pleine largeur qui capte la molette (ou le geste de défilement tactile) bloque la lecture de la page ; c'est le défaut le plus fréquent d'une carte intégrée. Les autres commandes (glisser, boutons de zoom, clavier) restent actives, la carte demeure donc explorable.
  - **Dégradation** : le composant charge Leaflet depuis un CDN et bascule sur un panneau d'erreur si le chargement échoue. L'adresse en `<address>` étant affichée à côté, la localisation ne dépend jamais de ce chargement (FR-016, SC-008) — c'est ce qui rend la carte « supplémentaire » et non « essentielle » au sens de l'accessibilité.
  - **Pas de modification du composant partagé** : hauteur, fond de carte et chargement du script sont déjà éprouvés sur `/contact` ; les toucher dépasserait le périmètre (FR-026) et créerait un risque de régression sur une page en production.
- **Alternatives considered** : (a) auto-héberger Leaflet — souhaitable un jour (constitution : « pas de CDN tiers pour les contenus propres à la coopérative » ne vise pas les bibliothèques, mais la dépendance reste), écarté car hors périmètre et applicable à tout le site ; (b) une image statique de carte — perd l'exploration et impose un asset supplémentaire ; (c) une carte pleine largeur sur toute la section — écarté, l'adresse doit rester visible au même moment que la carte sur desktop.
- **Hauteur** : `400px`, valeur du patron `contact.astro`. La prop est une chaîne appliquée en style inline : elle ne peut pas être rendue responsive sans modifier le composant partagé. 400 px reste confortable à 375 px comme à 1280 px.

---

## R61-7 — Où placer les deux sections et quels fonds leur donner

- **Decision** : `boutique` entre « c'est quoi ? » et « bières » ; `infos` entre « tireuse » et « instagram ». Fonds : orange (`tertiary`) pour la boutique, vert foncé (`accent`) pour les infos.
- **Rationale** :
  - **L'ordre est celui de l'epic** : la structure de fichiers de [`../../plan.md`](../../plan.md) énumère les sections dans l'ordre `hero, what, boutique, bières, tireuse, infos, instagram`. #65 l'avait anticipé (« les infos pratiques viendront s'intercaler ensuite »). Cet ordre satisfait aussi l'US3 : en descendant la page une seule fois, on rencontre les horaires puis la localisation.
  - **Les fonds découlent des contrastes** (R61-3), pas d'une préférence esthétique : l'orange est la seule teinte qui rende des horaires en très gros caractères sombres avec 9,85:1, et le vert foncé est la seule qui rende du texte courant blanc conforme AA. Chacune tombe par construction à un emplacement où elle ne jouxte pas un fond identique, et la page utilise enfin les trois couleurs de la charte.
- **Alternatives considered** : (a) les deux sections en blanc — deux fonds clairs de plus au milieu de la page, horaires peu saillants ; (b) `infos` en blanc — créerait `infos` blanc suivi d'`instagram` blanc, sans rupture ; (c) `infos` sur `secondary-accent` rose foncé (5,39:1 en blanc, également conforme) — écarté, il jouxterait directement la section tireuse déjà rose.
- **Ornements** : aucun n'est ajouté. L'incident de #65 (ornement semi-transparent passant sous du texte courant et faisant chuter le contraste à 3,8:1) invite à ne pas en empiler un sur une section qui porte de l'adresse et des horaires en petit corps. La photo et la carte suffisent à l'intérêt visuel.

---

## R61-8 — Colonne image pour une photo en portrait

- **Decision** : reprendre telle quelle la contrainte validée en #64 — `md:items-stretch` sur la grille, `h-full max-h-[560px] max-w-[460px] object-cover` sur l'image, `widths` + `sizes` calés sur la colonne.
- **Rationale** : `sibra-bouteilles.webp` mesure 1600 × 2131 (portrait), alors que le patron à deux colonnes suppose du paysage. Sans borne, la colonne image impose sa hauteur et écrase la colonne de texte sur desktop. La combinaison ci-dessus a déjà été éprouvée sur la section bières avec la même photo source recadrée au même format.
- **Alternatives considered** : recadrer une variante paysage — écarté : cela ajouterait un asset au dépôt (hors périmètre, la convention d'assets veut qu'une image n'entre dans git que quand le code l'utilise, et celle-ci est déjà là) et #64 a démontré que la borne CSS suffit.
