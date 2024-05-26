import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginAstro from 'eslint-plugin-astro'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...pluginAstro.configs.all,
  {
    rules: {
      'astro/semi': ['error', 'never'],
    },
  },
  pluginPrettierRecommended,
)
