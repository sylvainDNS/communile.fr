// avec build.format 'file', Astro.url.pathname vaut '/contact.html' (et '/index.html' pour l'accueil) au prérendu
export function getPagePath(url: URL) {
  return url.pathname.replace(/(\/index)?\.html$/, '') || '/'
}
