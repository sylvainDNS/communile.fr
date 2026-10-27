import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // = SITE_URL (src/utils/constants.ts) : URL absolues au build (images OG, sitemap)
  site: 'https://communile.fr',
  vite: {
    plugins: [tailwindcss()],
  },
  // toutes les pages sont prérendues ; une page dynamique déclarera `export const prerender = false`
  output: 'static',
  // /contact.html sert l'URL canonique /contact (sans slash final, /contact/ redirige)
  build: { format: 'file' },
  // Astro 7 passe par défaut à 'jsx', qui supprime les espaces entre texte et éléments inline
  compressHTML: true,
  // aucune page n'utilise Astro.session : évite le binding KV SESSION créé par l'adaptateur
  session: false,
  // sitemap-index.xml des pages indexables (la 404 est exclue)
  integrations: [sitemap({ filter: page => page !== 'https://communile.fr/404' })],
  adapter: cloudflare({ imageService: 'compile' }),
})
