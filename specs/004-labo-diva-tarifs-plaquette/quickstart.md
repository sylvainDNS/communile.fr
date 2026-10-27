# Quickstart : valider la feature 004

Prérequis : dépendances installées (`pnpm install`).

## 1. Build et lint

```bash
pnpm build   # astro check + astro build, doit réussir
pnpm lint    # doit réussir
```

## 2. Contrôles sur le HTML construit

Le HTML de la page est généré dans `dist/client/` (adapter le chemin si besoin : `ls dist/client/*.html`).

```bash
F=$(ls dist/client/le-labo-diva*.html dist/client/le-labo-diva/index.html 2>/dev/null | head -1)
grep -c 'À partir de 20€ HT / heure' "$F"                     # 1
grep -cE 'demi-journée|75€|140€|&gt;20€|>20€' "$F"            # 0
grep -c 'LABO_DIVA_2026_10_27.pdf' "$F"                       # 1
grep -c 'LABO_DIVA_2026_06_11.pdf' "$F"                       # 0
grep -c '!s évènements' "$F"                                  # 0
grep -o 'vos évènements réguliers' "$F" | wc -l               # 1
```

Référence attendue : [contracts/public-surface.md](./contracts/public-surface.md).

## 3. Plaquette

```bash
curl -sI https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf | grep -iE '^HTTP|content-type'   # 200, application/pdf
curl -s https://r2.communile.fr/downloads/LABO_DIVA_2026_10_27.pdf | md5      # ae9e5d479f015d9490e91e96b877460c
```

Ouvrir le PDF et vérifier à l'œil que ses tarifs de location sont cohérents avec « 20€ HT / heure ».

## 4. Relecture visuelle

`pnpm preview`, puis ouvrir `/le-labo-diva` à 375 px et à 1280 px de large : la carte « Location d'une salle au Labo » affiche 8 badges sans casse de mise en page, et le lien de la plaquette télécharge le nouveau PDF.

## 5. Après mise en production

Relancer les contrôles de l'étape 2 sur `https://communile.fr/le-labo-diva` (`curl -s … | grep …`), puis faire valider par le Labo Diva (SC-005).
