<script setup lang="ts">
const { t } = useI18n()

defineProps<{
  label?: string
  cardWidth?: string
}>()
</script>

<template>
  <div class="auth-page" :aria-label="label">
    <div class="auth-page__bg" aria-hidden="true">
      <div class="auth-page__blob auth-page__blob--1" />
      <div class="auth-page__blob auth-page__blob--2" />
    </div>

    <header class="auth-nav" role="banner">
      <NuxtLink to="/" class="auth-nav__logo" :aria-label="t('brand.name') + ' — home'">
        {{ t('brand.name') }}
      </NuxtLink>
    </header>

    <main id="main-content" class="auth-main">
      <div
        class="auth-card"
        role="main"
        :style="cardWidth ? { '--auth-card-width': cardWidth } : {}"
      >
        <slot />
      </div>
    </main>
  </div>
</template>
