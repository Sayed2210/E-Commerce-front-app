<script setup lang="ts">
const { t } = useI18n()

const perks = computed(() => [
  { icon: 'local_shipping', title: t('home.perkShippingTitle'), body: t('home.perkShippingBody') },
  {
    icon: 'verified',
    title: t('home.perkAuthenticityTitle'),
    body: t('home.perkAuthenticityBody'),
  },
  { icon: 'replay', title: t('home.perkReturnsTitle'), body: t('home.perkReturnsBody') },
  { icon: 'headset_mic', title: t('home.perkSupportTitle'), body: t('home.perkSupportBody') },
])
</script>

<template>
  <section class="perks" :aria-label="$t('home.perksAriaLabel')">
    <div class="perks__inner">
      <div v-for="perk in perks" :key="perk.icon" class="perk">
        <span class="perk__icon material-symbols-outlined" aria-hidden="true">{{ perk.icon }}</span>
        <div>
          <p class="perk__title">{{ perk.title }}</p>
          <p class="perk__body">{{ perk.body }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.perks {
  background: var(--color-surface-container);
}

.perks__inner {
  max-width: var(--container-max);
  margin-inline: auto;
  padding: 2.5rem var(--container-pad);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (width >= 1024px) {
  .perks__inner {
    grid-template-columns: repeat(4, 1fr);
  }
}

.perk {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.perk__icon {
  font-size: 1.5rem;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 0.0625rem;
}

.perk__title {
  font-family: var(--font-headline);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 0.25rem;
}

.perk__body {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: var(--color-on-surface-variant);
  margin: 0;
  line-height: 1.5;
}
</style>
