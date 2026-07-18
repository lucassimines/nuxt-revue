import type { Directive } from 'vue'
import type { RevealOptions } from './types'

declare module 'vue' {
  interface GlobalDirectives {
    /**
     * Reveal animation directive.
     *
     * @example
     * ```vue
     * <div v-reveal="{ when: 'visible', delay: 100 }" />
     * ```
     */
    vReveal: Directive<HTMLElement, RevealOptions | undefined>
  }
}

export {}
