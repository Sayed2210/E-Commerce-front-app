<script setup lang="ts">
import type { Product } from '~/types/api'

const props = withDefaults(
  defineProps<{
    product: Product
    /** grid — vertical card; list — horizontal row */
    variant?: 'grid' | 'list'
    /** Show wishlist toggle button (grid only) */
    wishlist?: boolean
  }>(),
  { variant: 'grid', wishlist: false }
)

const emit = defineEmits<{
  'add-to-cart': [productId: string]
  'toggle-wish': [productId: string]
}>()

const { t } = useI18n()
const { format } = useCurrency()

const isGrid = computed(() => props.variant === 'grid')

const name = computed(() => {
  const n = props.product.name
  return typeof n === 'string' ? n : (n?.en ?? '')
})

const isLowStock = computed(
  () => props.product.inventoryQuantity > 0 && props.product.inventoryQuantity < 10
)
const isOutOfStock = computed(() => props.product.inventoryQuantity === 0)
</script>

<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    class="card"
    :class="isGrid ? 'card--grid' : 'card--list'"
    :aria-label="`${name}, ${format(product.basePrice)}`"
  >
    <div class="card__img-wrap" :class="isGrid ? 'card__img-wrap--grid' : 'card__img-wrap--list'">
      <span
        v-if="isLowStock"
        class="card__badge card__badge--warn"
        :aria-label="$t('products.lowStock')"
      >
        {{ $t('products.lowStock') }}
      </span>
      <span
        v-else-if="isOutOfStock"
        class="card__badge card__badge--error"
        :aria-label="$t('products.soldOut')"
      >
        {{ $t('products.soldOut') }}
      </span>

      <img
        v-if="product.images?.[0]"
        :src="product.images[0]"
        :alt="name"
        class="card__img"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="card__img-placeholder" aria-hidden="true">
        <span class="material-symbols-outlined">image</span>
      </div>

      <button
        v-if="isGrid && wishlist"
        type="button"
        class="card__wish"
        :aria-label="t('products.addToWishlistAria', { name })"
        @click.prevent="emit('toggle-wish', product.id)"
      >
        <span class="material-symbols-outlined" aria-hidden="true">favorite_border</span>
      </button>
    </div>

    <div class="card__info" :class="isGrid ? 'card__info--grid' : 'card__info--list'">
      <p v-if="product.brand?.name" class="card__brand">{{ product.brand.name }}</p>

      <h3 class="card__title" :class="isGrid ? 'card__title--grid' : 'card__title--list'">
        {{ name }}
      </h3>

      <StarRating
        :rating="product.averageRating ?? 0"
        :count="product.reviewCount ?? 0"
        :label="name"
        class="card__rating"
      />

      <div class="card__foot">
        <span class="card__price" :class="isGrid ? 'card__price--grid' : 'card__price--list'">
          {{ format(product.basePrice) }}
        </span>

        <button
          type="button"
          class="card__cta"
          :class="isGrid ? 'card__cta--icon' : 'card__cta--full'"
          :aria-label="isGrid ? t('products.addToCartAria', { name }) : undefined"
          :disabled="isOutOfStock"
          @click.prevent="emit('add-to-cart', product.id)"
        >
          <span v-if="isGrid" class="material-symbols-outlined" aria-hidden="true">
            add_shopping_cart
          </span>
          <template v-else>{{ $t('products.addToCart') }}</template>
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped lang="scss" src="./ProductCard.scss"></style>
