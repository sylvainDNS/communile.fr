import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  // Astro 7 passe par défaut à 'jsx', qui supprime les espaces entre texte et éléments inline
  compressHTML: true,
  // aucune page n'utilise Astro.session : évite le binding KV SESSION créé par l'adaptateur
  session: false,
  adapter: cloudflare({ imageService: 'compile' }),
})
