<img src="logo.svg" alt="ReVue logo" width="72" height="72">

# ReVue

## 🚀 [Live Demo](https://nuxt-revue.lucassimines.dev)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

ReVue is a lightweight Nuxt module that adds configurable, hydration-safe reveal animations through a `v-reveal` directive.

## Features

- One directive with no component wrappers
- Mount-time or viewport-triggered reveals (`IntersectionObserver`)
- Configurable delay, duration, and travel distance
- Staggered list animations
- Optional replay prevention with `onceKey`
- Compatible with server-rendered Nuxt applications

## Installation

Add ReVue to your Nuxt application:

```bash
npx nuxt module add nuxt-revue
```

Or install and register it manually:

```bash
npm install nuxt-revue
```

```ts
export default defineNuxtConfig({
  modules: ['nuxt-revue'],
})
```

## Usage

### Basic reveal

Add `v-reveal` to any HTML element:

```vue
<template>
  <h1 v-reveal>
    Revealed on page load
  </h1>
</template>
```

### Custom animation

Values for `delay` and `duration` are milliseconds. `distance` is measured in pixels.

```vue
<template>
  <section
    v-reveal="{
      delay: 150,
      duration: 600,
      distance: 32,
    }"
  >
    Custom reveal
  </section>
</template>
```

### Staggered list

Calculate the delay from the item index to reveal a list in sequence:

```vue
<template>
  <article
    v-for="(item, index) in items"
    :key="item.id"
    v-reveal="{
      delay: index * 100,
    }"
  >
    {{ item.title }}
  </article>
</template>
```

### Reveal on scroll

Use `when: 'visible'` to wait until the element enters the viewport:

```vue
<template>
  <section
    v-reveal="{
      when: 'visible',
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px',
    }"
  >
    Revealed when scrolled into view
  </section>
</template>
```

### Reveal only once

Use `onceKey` to prevent an animation from replaying when a group is mounted again:

```vue
<template>
  <section v-reveal="{ onceKey: 'pricing' }">
    Pricing
  </section>
</template>
```

## Styling

The default reveal stylesheet ships with the module — no setup required.
ReVue adds `reveal`, then `reveal--in`, and sets `--reveal-delay`,
`--reveal-duration`, and `--reveal-distance`.

To provide your own animation, disable the built-in CSS and style those
classes yourself:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-revue'],
  reVue: {
    css: false,
  },
})
```

```css
.reveal {
  opacity: 0;
  transform: translateY(var(--reveal-distance, 24px));
}

.reveal.reveal--in {
  animation:
    my-reveal var(--reveal-duration, 800ms) cubic-bezier(0.16, 1, 0.3, 1)
    var(--reveal-delay, 0ms) forwards;
}

@keyframes my-reveal {
  from {
    opacity: 0;
    transform: translateY(var(--reveal-distance, 24px));
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal.reveal--in {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
```

## Options

### Module options

- `css`: include the default reveal stylesheet. Defaults to `true`.

### Directive options

- `when`: `'mount'` (default) or `'visible'` for IntersectionObserver.
- `delay`: delay before the animation starts. Defaults to `0`.
- `duration`: animation duration. Defaults to `800`.
- `distance`: vertical travel distance. Defaults to `24`.
- `threshold`: IntersectionObserver threshold. Defaults to `0.15`.
- `rootMargin`: IntersectionObserver rootMargin. Defaults to `'0px'`.
- `once`: when `when: 'visible'`, reveal only the first time. Defaults to `true`.
- `onceKey`: prevents the same reveal group from replaying after it has mounted.

Set app-wide defaults in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-revue'],
  reVue: {
    reveal: {
      when: 'visible',
      duration: 700,
    },
  },
})
```

## Development

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-revue/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-revue

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-revue.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-revue

[license-src]: https://img.shields.io/npm/l/nuxt-revue.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-revue

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
