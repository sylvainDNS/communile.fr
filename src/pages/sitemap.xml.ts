import type { APIRoute } from 'astro'
import { PATH, SITE_URL } from '@/utils/constants'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;')
}

export const GET: APIRoute = () => {
  const paths = Object.values(PATH).filter(path => !path.includes('#'))

  const urls = paths
    .map(path => `  <url><loc>${escapeXml(new URL(path, SITE_URL).href)}</loc></url>`)
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
