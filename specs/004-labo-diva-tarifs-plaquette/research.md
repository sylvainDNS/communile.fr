# Research: Tarifs et plaquette du Labo Diva

Aucun point « NEEDS CLARIFICATION » dans le contexte technique. Les décisions ci-dessous fixent les détails laissés ouverts par la spec.

## R1 — Libellé du badge tarifaire

- **Decision** : `À partir de 20€ HT / heure`, en remplacement des trois entrées tarifaires du tableau `badgesLocation`, à la même position (dernière entrée).
- **Rationale** : c'est la formulation exacte de la demande. Elle supprime le `>` parasite (« À partir de >20€ ») et garde le badge à sa place actuelle dans la liste.
- **Alternatives considered** : espace insécable avant « € » (« 20 € ») selon la typographie française. Rejeté : la demande et les autres pages écrivent « 20€ », et la spec fixe le libellé exact (FR-001).

## R2 — Correction de la phrase en double

- **Decision** : la description devient « …Idéal pour vos évènements professionnels ponctuels (réunion, AG, formation...), vos évènements réguliers (cours de danse, session de chant,...) ou tout autre projet ! ». Le fragment `!s évènements réguliers (cours de danse, session de chant,...) ou tout autre projet !` est supprimé.
- **Rationale** : c'est un défaut de copier-coller manifeste. On garde la première occurrence, complète.
- **Alternatives considered** : réécrire le paragraphe. Rejeté, car hors demande et sans validation du Labo Diva.

## R3 — Hébergement de la plaquette

- **Decision** : garder `https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf`, publié le 2026-10-27, en conservant l'ancien fichier `LABO_DIVA_2026_06_11.pdf`.
- **Rationale** : c'est la pratique déjà en place pour les plaquettes. Un PDF de 3,4 Mo n'a pas sa place dans l'historique git. Le domaine appartient à la coopérative, ce n'est pas un CDN tiers. Un nom daté évite les caches périmés. Le fichier a été vérifié : réponse 200, `application/pdf`, 3 588 559 octets, MD5 `ae9e5d479f015d9490e91e96b877460c` identique à la pièce jointe de l'issue #87.
- **Alternatives considered** : placer le PDF dans `public/`. Rejeté : poids dans git et rupture avec la convention des autres plaquettes.

## R4 — Validation

- **Decision** : pas de test automatisé. Les contrôles reposent sur `grep` dans le HTML construit, `curl` sur le PDF et une relecture visuelle.
- **Rationale** : le dépôt n'a pas de suite de tests. Le changement porte sur des chaînes statiques, que les contrôles textuels couvrent complètement.
- **Alternatives considered** : ajouter un test e2e. Rejeté (YAGNI, principe II).
