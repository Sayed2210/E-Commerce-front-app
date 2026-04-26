<script setup lang="ts">
interface Props {
  title?: string
  collapsible?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  collapsible: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = defineModel<boolean>('open', { default: true })

function toggle() {
  isOpen.value = !isOpen.value
  emit('update:open', isOpen.value)
}
</script>

<template>
  <div class="bg-surface-container-lowest rounded-lg border border-outline-variant/10">
    <div
      v-if="title || collapsible"
      class="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10 cursor-pointer"
      :class="{ 'select-none': collapsible }"
      @click="collapsible && toggle()"
    >
      <h3 v-if="title" class="text-sm font-bold text-on-surface">{{ title }}</h3>
      <span v-if="collapsible" class="material-symbols-outlined text-sm text-secondary">
        {{ isOpen ? 'expand_less' : 'expand_more' }}
      </span>
    </div>
    <div v-show="!collapsible || isOpen" class="p-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Admin form panel styles */
</style>
