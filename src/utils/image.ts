import { getImage } from 'astro:assets'
import logo from '@/images/communile-logo.webp'
import { SITE_URL } from './constants'

let logoUrl: Promise<string> | undefined

// URL absolue du logo, réellement émis dans /_astro/ au build (l'ancien /communile-logo.webp répondait 404)
export function getLogoUrl() {
  logoUrl ??= getImage({ src: logo }).then(image => new URL(image.src, SITE_URL).href)
  return logoUrl
}
