/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'orange-yellow ': '#F0C020',
        'fire-engine-red ': '#c12222',
        'american-blue': '#303d76',
      },
      fontFamily: {
        sans: ['"Raleway Variable"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
