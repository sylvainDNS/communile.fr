/**
 * Calcul reproductible des ratios de contraste WCAG 2.1 du thème « sibra ».
 *
 * Existe parce que le tableau de `specs/001-page-brasserie/contracts/theme.md` annonçait des valeurs
 * estimées, dont une (`tertiary-accent` sur blanc, annoncée 3,0) autorisait une combinaison réellement
 * non conforme (2,88). Toute valeur publiée dans les specs de l'epic doit pouvoir être rejouée ici.
 *
 * Usage : node specs/001-page-brasserie/issues/66-polish/contracts/contrastes.mjs
 */

import process from 'node:process'

/** Convertit oklch en composantes Oklab. */
function oklchToOklab(l, c, hDegrees) {
  const h = (hDegrees * Math.PI) / 180
  return [l, c * Math.cos(h), c * Math.sin(h)]
}

/** Convertit Oklab en sRGB encodé (composantes 0..1). */
function oklabToSrgb([l, a, b]) {
  const lCube = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const mCube = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const sCube = (l - 0.0894841775 * a - 1.2914855480 * b) ** 3

  const linear = [
    4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube,
    -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube,
    -0.0041960863 * lCube - 0.7034186147 * mCube + 1.7076147010 * sCube,
  ]

  return linear.map((channel) => {
    const encoded = channel <= 0.0031308
      ? 12.92 * channel
      : 1.055 * channel ** (1 / 2.4) - 0.055
    return Math.min(1, Math.max(0, encoded))
  })
}

/** Reproduit `color-mix(in oklab, <couleur> P%, white)` : interpolation en Oklab, blanc = (1, 0, 0). */
function mixWithWhite(oklab, proportion) {
  const white = [1, 0, 0]
  return oklab.map((value, index) => value * proportion + white[index] * (1 - proportion))
}

function hexToSrgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16)
  return [(value >> 16) & 0xFF, (value >> 8) & 0xFF, value & 0xFF].map(channel => channel / 255)
}

function srgbToHex(srgb) {
  return `#${srgb.map(channel => Math.round(channel * 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

/** Luminance relative WCAG : les composantes doivent être linéarisées avant pondération. */
function relativeLuminance(srgb) {
  const [r, g, b] = srgb.map((channel) => {
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(a, b) {
  const first = relativeLuminance(a)
  const second = relativeLuminance(b)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

// `console.log` est interdit par la config ESLint du dépôt, qui lint aussi les artefacts de specs.
const print = line => process.stdout.write(`${line}\n`)

const format = ratio => ratio.toFixed(2).replace('.', ',')

// Tokens tels qu'ils sont écrits dans src/styles/global.css.
const TOKENS = {
  'foreground': [0.145, 0, 0],
  'background': [0.968, 0.007, 247.896],
  'primary': [0.6214, 0.1490, 120.95],
  'primary-accent': [0.5214, 0.1490, 120.95],
  'secondary': [0.6469, 0.1663, 1.60],
  'secondary-accent': [0.5469, 0.1663, 1.60],
  'tertiary': [0.7880, 0.1707, 69.98],
  'tertiary-accent': [0.6880, 0.1707, 69.98],
}

const srgbOf = name => oklabToSrgb(oklchToOklab(...TOKENS[name]))
const WHITE = [1, 1, 1]
const foreground = srgbOf('foreground')

print('— Tokens —')
for (const name of Object.keys(TOKENS)) {
  print(`${name.padEnd(18)} ${srgbToHex(srgbOf(name))}`)
}

print('\n— Fonds thémés : texte blanc vs texte foreground —')
print(`${'fond'.padEnd(18)} ${'blanc'.padStart(6)} ${'foreground'.padStart(11)}`)
for (const name of ['primary', 'primary-accent', 'secondary', 'secondary-accent', 'tertiary', 'tertiary-accent']) {
  const background = srgbOf(name)
  const onWhite = format(contrastRatio(background, WHITE))
  const onForeground = format(contrastRatio(background, foreground))
  print(`${name.padEnd(18)} ${onWhite.padStart(6)} ${onForeground.padStart(11)}`)
}

print('\n— Tag : couleur pleine sur son propre dégradé clair (pire cas = mélange à 30 %) —')
for (const name of ['primary', 'secondary', 'tertiary']) {
  const oklab = oklchToOklab(...TOKENS[name])
  const text = oklabToSrgb(oklab)
  const worstCase = oklabToSrgb(mixWithWhite(oklab, 0.30))
  const themed = format(contrastRatio(text, worstCase))
  const neutral = format(contrastRatio(foreground, worstCase))
  print(`${`color="${name}"`.padEnd(22)} text-${name} ${themed}   avec text-foreground ${neutral}`)
}

print('\n— Panneau d\'erreur de leaflet-map, sur bg-red-50 #fef2f2 —')
const redBackground = hexToSrgb('#fef2f2')
for (const [name, hex] of [['text-red-600 (actuel)', '#dc2626'], ['text-red-700 (retenu)', '#b91c1c'], ['text-red-500 (icône)', '#ef4444']]) {
  print(`${name.padEnd(24)} ${format(contrastRatio(hexToSrgb(hex), redBackground))}`)
}
