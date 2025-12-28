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
  ],
})
