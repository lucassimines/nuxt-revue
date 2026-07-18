export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  reVue: {
    reveal: {
      when: 'visible',
      duration: 700,
      distance: 32,
      threshold: 0.2,
      once: true,
    },
  },
})
