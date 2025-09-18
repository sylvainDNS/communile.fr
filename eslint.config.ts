import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: {
    astro: true,
    prettierOptions: {
      plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-astro'],
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
