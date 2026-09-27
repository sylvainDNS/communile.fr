import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  formatters: {
    prettierOptions: {
      plugins: ['prettier-plugin-tailwindcss'],
    },
  },
  typescript: true,
  ignores: [
    'dist/**',
    'node_modules/**',
    'public/**',
    'tmp/**',
    '**/*.css',
    // outillage agent versionné tel quel (spec kit) : hors périmètre du lint projet
    '.claude/**',
    '.specify/**',
    // artefacts régénérés par Impeccable (sidecar design.json, cache et config locale du hook)
    '.impeccable/**',
  ],
}, {
  // antfu 9 impose trustPolicy, shellEmulator et minimumReleaseAgeExcludePrune : ces réglages changent le
  // comportement des installations (local, CI, Workers Builds), à adopter dans une évolution dédiée
  files: ['pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
  },
})
