import { addPlugin, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * Include the default reveal stylesheet.
   * Set to `false` to provide your own `.reveal` / `.reveal--in` styles.
   */
  css?: boolean
  reveal?: {
    delay?: number
    duration?: number
    distance?: number
    onceKey?: string
    when?: 'mount' | 'visible'
    threshold?: number
    rootMargin?: string
    once?: boolean
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'revue',
    configKey: 'reVue',
  },
  defaults: {
    css: true,
    reveal: {
      when: 'mount',
      delay: 0,
      duration: 800,
      distance: 24,
      threshold: 0.15,
      rootMargin: '0px',
      once: true,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.revue = {
      reveal: options.reveal ?? {},
    } as typeof nuxt.options.runtimeConfig.public.revue

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    if (options.css) {
      nuxt.options.css.push(resolver.resolve('./runtime/reveal.css'))
    }

    // Enables IDE autocomplete for `v-reveal="{ ... }"` in Vue templates.
    addTypeTemplate({
      filename: 'types/nuxt-revue-directives.d.ts',
      getContents: () => `import type { Directive } from 'vue'

export interface RevueRevealOptions {
  delay?: number
  duration?: number
  distance?: number
  onceKey?: string
  /**
   * \`mount\` reveals as soon as the element is created.
   * \`visible\` waits until the element enters the viewport.
   */
  when?: 'mount' | 'visible'
  /** IntersectionObserver threshold. Defaults to \`0.15\`. */
  threshold?: number
  /** IntersectionObserver rootMargin. Defaults to \`'0px'\`. */
  rootMargin?: string
  /**
   * When \`when: 'visible'\`, stop observing after the first reveal.
   * Defaults to \`true\`.
   */
  once?: boolean
}

declare module 'vue' {
  interface GlobalDirectives {
    vReveal: Directive<HTMLElement, RevueRevealOptions | undefined>
  }
}

export {}
`,
    })
  },
})
