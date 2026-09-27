import { getImage } from 'astro:assets'
import logo from '@/images/communile-logo.webp'
import { SITE_URL } from './constants'

// URL absolue du logo, réellement émis dans /_astro/ au build (l'ancien /communile-logo.webp répondait 404)
export async function getLogoUrl() {
  return new URL((await getImage({ src: logo })).src, SITE_URL).href
}
