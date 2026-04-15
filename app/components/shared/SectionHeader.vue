<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    /** Optional editorial subtitle below the headline */
    subtitle?: string
    link?: string
    linkText?: string
  }>(),
  { linkText: 'View all' }
)
</script>

<template>
  <div class="section-header">
    <div class="section-header__text">
      <h2 class="section-header__title">{{ title }}</h2>
      <p v-if="subtitle" class="section-header__subtitle">{{ subtitle }}</p>
    </div>
    <NuxtLink
      v-if="link"
      :to="link"
      class="section-header__link"
      :aria-label="`${linkText} — ${title}`"
    >
      {{ linkText }}
      <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss" src="./SectionHeader.scss"></style>
