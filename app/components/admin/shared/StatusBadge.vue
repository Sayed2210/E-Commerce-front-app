<script setup lang="ts">
import { useStatusColors } from '~/composables/admin/useStatusColors'

interface Props {
  status: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const { getStatusConfig } = useStatusColors()
const config = computed(() => getStatusConfig(props.status))

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-2 py-1 text-[10px]',
    md: 'px-3 py-1 rounded-full text-xs',
    lg: 'px-4 py-2 text-sm',
  }
  return sizes[props.size]
})
</script>

<template>
  <span
    :class="`${config.bg} ${config.text} ${sizeClasses} font-bold uppercase tracking-wide rounded-full`"
  >
    {{ status }}
  </span>
</template>

<style scoped>
/* Status badge shared styles */
</style>
