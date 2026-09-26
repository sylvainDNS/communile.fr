# Data Model: Mise à jour d'Astro et de son écosystème

Aucune donnée applicative. Les « entités » de cette évolution sont les dépendances et les artefacts de configuration, dont l'état doit être contrôlé.

## Dépendance

| Champ | Description |
|---|---|
| nom | paquet npm |
| type | `dependency` \| `devDependency` |
| périmètre | `inclus` \| `forcé` (hors périmètre, monté par contrainte peer) \| `exclu` |
| version actuelle / cible | cf. tableau [research.md](./research.md#versions-cibles) |
| justification | obligatoire si cible ≠ dernière version stable, ou si périmètre = `forcé` (FR-012) |
| palier | A, B, C ou D ([plan.md](./plan.md#paliers-dimplémentation)) |

**Règles de validation**

- `pnpm outdated` ne liste aucun paquet `inclus`, sauf `typescript`, justifié par R3 (SC-005).
- Tout paquet `forcé` a une justification écrite dans research.md (R4).
- Les paquets `exclus` gardent leur version : `animejs`, `leaflet`, `tailwind-merge`, `class-variance-authority`, `clsx`.
- `pnpm install --frozen-lockfile` réussit en CI, sans erreur de peer bloquante. Warning bénin toléré : antfu 9.5.1 déclare `prettier-plugin-astro ^0.14`.

## Artefact de configuration

| Fichier | État cible | Décision |
|---|---|---|
| `astro.config.mjs` | `compressHTML: true` ; `cloudflare({ imageService: 'compile', session: false })` ; `output: 'server'` et plugin Vite Tailwind inchangés | R5, R6, R8 |
| `wrangler.jsonc` | sans `pages_build_output_dir` ni `env.*` ; `name`, `compatibility_flags`, `observability` conservés ; `compatibility_date` à jour | R2 |
| `tsconfig.json` | sans `baseUrl` ; `paths` inchangé | R3 |
| `package.json` | engines Node relevé ; `wrangler` et `astro-eslint-parser` ajoutés en devDeps ; scripts inchangés | R2, R4, R9, FR-009 |
| `public/_headers` | règle CORS inchangée ; règle `noindex` étendue aux URLs de preview Workers | R2 |
| `eslint.config.ts` | options inchangées sauf ajustement exigé par antfu 9 | R4 |

## Transitions d'état du déploiement

```text
Pages (prod actuelle)
  └─ palier A ─▶ Worker déployé sur *.workers.dev (Pages sert toujours communile.fr)
       └─ paliers B–D validés sur *.workers.dev
            └─ bascule domaine ─▶ Worker sert communile.fr (Pages conservé, inactif)
                 └─ observation OK ─▶ projet Pages supprimé
```

Retour arrière possible à chaque étape tant que le projet Pages existe : il suffit de rattacher le domaine à Pages.
