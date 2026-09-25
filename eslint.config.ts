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
})
