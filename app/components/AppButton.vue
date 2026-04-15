<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Visual style: gradient fill | ghost | text-only */
    variant?: 'primary' | 'secondary' | 'tertiary'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    /** Stretch to parent width */
    block?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    loading: false,
    disabled: false,
    block: false,
  }
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading ? true : undefined"
    :aria-disabled="disabled ? true : undefined"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block, 'btn--loading': loading }]"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped lang="scss" src="./styles/AppButton.scss"></style>
