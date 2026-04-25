<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useSeoMeta({ title: 'Search — Admin' })

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl as string
const { getAccessToken } = useToken()

const reindexing = ref(false)
const result = ref<string | null>(null)
const error = ref<string | null>(null)

async function reindexSearch() {
  reindexing.value = true
  error.value = null
  result.value = null

  try {
    const token = getAccessToken()
    const res = await $fetch<{ message: string }>(`${baseURL}/search/reindex`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    result.value = res.message
  } catch (err: any) {
    error.value = err.message || 'Reindex failed'
  } finally {
    reindexing.value = false
  }
}
</script>

<template>
  <section class="search-page">
    <div class="search-page__head">
      <h1 class="search-page__title">Search</h1>
    </div>

    <div class="search-page__card">
      <div class="search-page__icon">
        <span class="material-symbols-outlined">search</span>
      </div>
      <h2 class="search-page__subtitle">Reindex Search</h2>
      <p class="search-page__desc">
        Rebuild the search index to ensure all products are searchable. This may take a while for
        large catalogs.
      </p>
      <button type="button" class="search-page__btn" :disabled="reindexing" @click="reindexSearch">
        {{ reindexing ? 'Reindexing...' : 'Rebuild Search Index' }}
      </button>

      <div v-if="result" class="search-page__result">
        <span class="material-symbols-outlined success">check_circle</span>
        {{ result }}
      </div>

      <div v-if="error" class="search-page__error">
        <span class="material-symbols-outlined">error</span>
        {{ error }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.search-page__head {
  margin-bottom: 1.5rem;
}

.search-page__title {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  margin: 0;
}

.search-page__card {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-md);
  padding: 2rem;
  text-align: center;
}

.search-page__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--color-surface-container);
  border-radius: 50%;
  margin-bottom: 1rem;
}

.search-page__icon .material-symbols-outlined {
  font-size: 2rem;
  color: var(--color-primary);
}

.search-page__subtitle {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 0.5rem;
}

.search-page__desc {
  font-size: 0.875rem;
  color: var(--color-secondary);
  margin: 0 0 1.5rem;
}

.search-page__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow var(--transition-base);
}

.search-page__btn:hover:not(:disabled) {
  box-shadow: var(--shadow-btn-hover);
}

.search-page__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-page__result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--color-success-container);
  border-radius: var(--radius-sm);
  color: var(--color-on-success-container);
  font-size: 0.875rem;
  font-weight: 600;
}

.search-page__result .material-symbols-outlined {
  font-size: 1.25rem;
}

.search-page__error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--color-error-container);
  border-radius: var(--radius-sm);
  color: var(--color-error);
  font-size: 0.875rem;
}

.search-page__error .material-symbols-outlined {
  font-size: 1.25rem;
}
</style>
