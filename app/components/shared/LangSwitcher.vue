<script setup lang="ts">
const { locale, setLocale } = useI18n()

const options = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
]

const currentLabel = computed(
  () => options.find((o) => o.code === locale.value)?.label ?? locale.value
)

function switchLocale(code: string) {
  setLocale(code)
}
</script>

<template>
  <div class="lang-switcher">
    <button type="button" class="lang-switcher__trigger" :aria-label="$t('language.switch')">
      <span class="material-symbols-outlined" aria-hidden="true">language</span>
      <span class="lang-switcher__label">{{ currentLabel }}</span>
    </button>
    <div class="lang-switcher__dropdown">
      <button
        v-for="opt in options"
        :key="opt.code"
        type="button"
        class="lang-switcher__option"
        :class="{ 'lang-switcher__option--active': locale === opt.code }"
        @click="switchLocale(opt.code)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.lang-switcher {
  position: relative;
}

.lang-switcher__trigger {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: var(--radius-md, 0.5rem);
  font-family: var(--font-label);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    background 150ms ease,
    color 150ms ease;
}

.lang-switcher__trigger:hover {
  background: var(--color-surface-container-low);
  color: var(--color-on-surface);
}

.lang-switcher__label {
  display: none;
}

@media (width >= 640px) {
  .lang-switcher__label {
    display: inline;
  }
}

.lang-switcher__dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  min-width: 8rem;
  background: var(--color-surface-container-high);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md, 0.5rem);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition:
    opacity 150ms ease,
    transform 150ms ease,
    visibility 150ms ease;
  z-index: 50;
}

.lang-switcher:hover .lang-switcher__dropdown,
.lang-switcher:focus-within .lang-switcher__dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.lang-switcher__option {
  display: block;
  width: 100%;
  text-align: start;
  padding: 0.5rem 0.75rem;
  font-family: var(--font-label);
  font-size: 0.875rem;
  color: var(--color-on-surface);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 150ms ease;
}

.lang-switcher__option:hover {
  background: var(--color-surface-container-low);
}

.lang-switcher__option--active {
  font-weight: 700;
  color: var(--color-primary);
}

.lang-switcher__option:first-child {
  border-radius: var(--radius-md, 0.5rem) var(--radius-md, 0.5rem) 0 0;
}

.lang-switcher__option:last-child {
  border-radius: 0 0 var(--radius-md, 0.5rem) var(--radius-md, 0.5rem);
}
</style>
