# Contrat : surface publique de `/le-labo-diva` (section « Privatisation et location »)

Ce que la page expose après la livraison. Tout écart est une régression.

## Doit apparaître

- Exactement une occurrence de `À partir de 20€ HT / heure`.
- Un lien `href="https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf"` portant `download` et `target="_blank"`, libellé `Télécharger notre plaquette détaillée !`.
- Une seule occurrence de `vos évènements réguliers (cours de danse, session de chant,...)`.

## Ne doit plus apparaître

- `demi-journée`, `75€`, `140€`
- `>20€`
- `LABO_DIVA_2026_06_11.pdf`
- `!s évènements`

## Ressource externe

`GET https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf` doit répondre `200`, avec le `Content-Type` `application/pdf` et le MD5 `ae9e5d479f015d9490e91e96b877460c`.

## Inchangé

Toutes les autres pages, les métadonnées SEO de `/le-labo-diva`, le sitemap et les badges de la carte « Privatisation du Labo Diva ».
