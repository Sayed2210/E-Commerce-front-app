<script setup lang="ts">
const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl as string
// const token = getAccessToken()

const reindexing = ref(false)
const result = ref<string | null>(null)
const errorMsg = ref<string | null>(null)

async function reindexSearch() {
  reindexing.value = true
  errorMsg.value = null
  result.value = null

  try {
    const token = getAccessToken()
    const res = await $fetch<{ message: string }>(`${baseURL}/search/reindex`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    result.value = res.message
  } catch (err: any) {
    errorMsg.value = err.message || 'Reindex failed'
  } finally {
    reindexing.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <AdminPageHeader title="Search" />

    <div class="search-card">
      <div class="search-icon">
        <span class="material-symbols-outlined">search</span>
      </div>
      <h3 class="search-subtitle">Reindex Search</h3>
      <p class="search-desc">
        Rebuild the search index to ensure all products are searchable. This may take a while for
        large catalogs.
      </p>
      <button type="button" class="search-btn" :disabled="reindexing" @click="reindexSearch">
        {{ reindexing ? 'Reindexing...' : 'Rebuild Search Index' }}
      </button>

      <div v-if="result" class="search-result">
        <span class="material-symbols-outlined success">check_circle</span>
        {{ result }}
      </div>

      <div v-if="errorMsg" class="search-error">
        <span class="material-symbols-outlined">error</span>
        {{ errorMsg }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-card {
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-md);
  padding: 2rem;
  text-align: center;
}

.search-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--color-surface-container);
  border-radius: 50%;
  margin-bottom: 1rem;
}

.search-icon .material-symbols-outlined {
  font-size: 2rem;
  color: var(--color-primary);
}

.search-subtitle {
  font-family: var(--font-headline);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 0.5rem;
}

.search-desc {
  font-size: 0.875rem;
  color: var(--color-secondary);
  margin: 0 0 1.5rem;
}

.search-btn {
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
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-result {
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

.search-result .material-symbols-outlined {
  font-size: 1.25rem;
}

.search-error {
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

.search-error .material-symbols-outlined {
  font-size: 1.25rem;
}
</style>
