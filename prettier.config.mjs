import prettierConfigStandard from 'prettier-config-standard' assert { type: 'json' }

/** @type {import("prettier").Config} */
export default {
  ...prettierConfigStandard,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  trailingComma: 'all',
}
