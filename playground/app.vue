<template>
  <div style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1.5rem;">
    <h1 v-reveal="{ when: 'mount', duration: 600 }">
      ReVue playground
    </h1>
    <p v-reveal="{ when: 'mount', delay: 120 }">
      Local module sandbox. The public demo site lives in a separate private repo.
    </p>
    <div
      v-for="(item, index) in items"
      :key="item"
      v-reveal="{ delay: index * 80 }"
      style="margin-top: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 0.75rem;"
    >
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
const items = [
  'Scroll to reveal',
  'Uses local ../src/module',
  'Keep this minimal — ship the real site from revue-docs',
]
</script>
