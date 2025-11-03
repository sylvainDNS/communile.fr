import { createScope } from 'animejs'

export const rootScope = createScope({
  root: 'body',
  mediaQueries: {
    mobile: '(max-width: 640px)',
    reducedMotion: '(prefers-reduced-motion)',
  },
})
