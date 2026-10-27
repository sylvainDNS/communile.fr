# Data model — section prêt de tireuse (issue #65)

Site statique : aucune base de données, aucun schéma persistant. Le « modèle » est l'ensemble des contenus portés par le composant de section, sous forme de **constantes locales** au fichier (patron des sections existantes — aucune constante globale, aucun fichier de données).

Source unique : `brasserie-assets/Texte site internet.md`, version du 2026-09-18, bloc « Prêt de tireuses » :

> La brasserie propose aussi le prêt de tireuse pour l'achat d'un fût. Vous avez un anniversaire, un séminaire d'entreprise ou juste un weekend entre copaines ? Appelez la brasserie pour réserver une tireuse !

## Entité : Service (prêt de tireuse)

Reprend l'entité « Service » du data-model de l'epic (`../../data-model.md`), moins la coordonnée gelée par #67.

| Champ | Valeur affichée | Rendu | Origine |
|---|---|---|---|
| Titre | « Prêt de tireuse » | `Heading as="h2"` blanc sur fond rose | titre source « Prêt de tireuses », ramené au singulier (cf. spec, Assumptions) |
| Principe + condition | « La brasserie propose aussi le prêt de tireuse pour l'achat d'un fût. » | `Text` en `foreground` | phrase source intégrale |
| Occasions | voir ci-dessous | liste de 3 cartes claires | question source, découpée en items |
| Réservation | « Appelez la brasserie pour réserver une tireuse ! » | `Text size="xl" weight="bold" color="white"` | phrase source intégrale |
| Téléphone | **non affiché** | — | gelé par le gate #67 (research R65-1) |

## Entité : Occasion

Constante locale `occasions`, trois entrées, dans l'ordre du texte source :

| Libellé affiché | Icône (`src/utils/icons.ts`) | Origine |
|---|---|---|
| Un anniversaire | `calendar-heart` | « un anniversaire » |
| Un séminaire d'entreprise | `users-round` | « un séminaire d'entreprise » |
| Un week-end entre copaines | `smile` | « juste un weekend entre copaines » — orthographe normalisée en « week-end » (correction typographique autorisée par l'epic), « copaines » conservé tel quel (registre voulu par la coopérative) |

Forme du type local :

```text
Occasion = {
  icon: clé de `icons` (src/utils/icons.ts)
  label: libellé affiché
}
```

**Invariants** :
- Exactement trois occasions — aucune ajoutée, aucune retirée.
- Les occasions sont des **exemples** : la formulation introductive ne doit pas les présenter comme une liste limitative.
- Aucune condition commerciale (tarif, caution, durée de prêt, volume du fût, livraison) : rien de tel n'existe dans le texte source.
- Aucun numéro de téléphone, aucune adresse email, aucun `tel:` / `mailto:` dans le fichier livré.

## Relations / points d'intégration

```text
src/pages/la-sibra.astro
  ├── <SibraHeroSection />        (#60)
  ├── <SibraWhatSection />        (#60)
  ├── <SibraBieresSection />      (#64)
  ├── <SibraTireuseSection />     ← cette issue (#65)
  └── <SibraInstagramSection />   (#60)

À terme : la section infos pratiques (#61) s'intercalera entre la tireuse et Instagram.
```

Aucune constante de route (`PATH.*`) n'est consommée : la section ne contient aucun lien.
