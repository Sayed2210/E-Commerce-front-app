<script setup lang="ts">
import type { Product, ProductVariant, Review } from '~/types/api'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const { getProduct } = useProducts()
const { addItem } = useCart()
const { addToWishlist, removeFromWishlist } = useWishlist()
const { getProductReviews, createReview } = useReviews()
const { isAuthenticated } = useAuth()

const id = route.params.id as string

const { data: productData, pending } = await getProduct(id)
const product = computed<Product | null>(() => (productData.value as any) ?? null)

const {
  data: reviewsData,
  pending: reviewsPending,
  refresh: refreshReviews,
} = await getProductReviews(id)
const reviews = computed<Review[]>(() => (reviewsData.value as any) ?? [])

// Gallery
const activeImage = ref<string>('')
watch(
  product,
  (p) => {
    if (p?.images?.[0]) activeImage.value = p.images[0]
  },
  { immediate: true }
)

// Variant selection
const selectedOptions = ref<Record<string, string>>({})
const qty = ref(1)
const addingToCart = ref(false)
const wishlisted = ref(false)
const showReviewForm = ref(false)
const newReview = reactive({ rating: 5, title: '', comment: '' })

const groupedOptions = computed(() => {
  const map: Record<string, string[]> = {}
  for (const variant of product.value?.variants ?? []) {
    for (const [key, val] of Object.entries(variant.optionValues)) {
      if (!map[key]) map[key] = []
      if (!map[key].includes(val)) map[key].push(val)
    }
  }
  return map
})

const selectedVariant = computed<ProductVariant | null>(() => {
  if (!product.value?.variants?.length) return null
  return (
    product.value.variants.find((v) =>
      Object.entries(selectedOptions.value).every(([k, val]) => v.optionValues[k] === val)
    ) ?? null
  )
})

const effectivePrice = computed(() => {
  const base = product.value?.basePrice ?? 0
  const mod = selectedVariant.value?.priceModifier ?? 0
  return base + mod
})

const productName = computed(() => {
  const n = product.value?.name
  if (!n) return ''
  return typeof n === 'string' ? n : (n.en ?? '')
})

const productDescription = computed(() => {
  const d = product.value?.description
  if (!d) return ''
  return typeof d === 'string' ? d : (d.en ?? '')
})

function selectOption(attr: string, val: string) {
  selectedOptions.value = { ...selectedOptions.value, [attr]: val }
}

async function addToCart() {
  if (!product.value) return
  addingToCart.value = true
  await addItem({
    productId: product.value.id,
    variantId: selectedVariant.value?.id,
    quantity: qty.value,
  })
  addingToCart.value = false
}

async function buyNow() {
  await addToCart()
  router.push('/cart')
}

async function toggleWishlist() {
  if (!product.value) return
  if (wishlisted.value) {
    await removeFromWishlist(product.value.id)
    wishlisted.value = false
  } else {
    await addToWishlist(product.value.id)
    wishlisted.value = true
  }
}

async function submitReview() {
  if (!product.value) return
  await createReview({ productId: product.value.id, ...newReview })
  showReviewForm.value = false
  newReview.rating = 5
  newReview.title = ''
  newReview.comment = ''
  await refreshReviews()
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

useSeoMeta({ title: computed(() => `${productName.value} — ArchitectMarket`) })
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-4">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <NuxtLink
        to="/"
        class="text-[10px] font-medium tracking-wide uppercase text-secondary hover:text-primary transition-colors"
        >Home</NuxtLink
      >
      <span class="material-symbols-outlined text-secondary text-[12px]">chevron_right</span>
      <NuxtLink
        to="/products"
        class="text-[10px] font-medium tracking-wide uppercase text-secondary hover:text-primary transition-colors"
        >Products</NuxtLink
      >
      <span class="material-symbols-outlined text-secondary text-[12px]">chevron_right</span>
      <span class="text-[10px] font-medium tracking-wide uppercase text-on-surface">{{
        productName
      }}</span>
    </nav>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-pulse">
      <div class="lg:col-span-5 space-y-4">
        <div class="aspect-square bg-surface-container-low rounded"></div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="aspect-square bg-surface-container-low rounded"></div>
        </div>
      </div>
      <div class="lg:col-span-4 space-y-4">
        <div class="h-8 bg-surface-container-low rounded w-3/4"></div>
        <div class="h-4 bg-surface-container-low rounded w-1/2"></div>
        <div class="h-20 bg-surface-container-low rounded"></div>
      </div>
    </div>

    <!-- Product -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Image gallery -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-surface-container-lowest rounded overflow-hidden">
          <img
            :src="activeImage || product.images?.[0]"
            :alt="productName"
            class="w-full aspect-square object-cover"
          />
        </div>
        <div v-if="product.images?.length > 1" class="grid grid-cols-4 gap-4">
          <button
            v-for="(img, i) in product.images"
            :key="i"
            type="button"
            :class="
              activeImage === img ? 'ring-2 ring-primary-container' : 'opacity-60 hover:opacity-100'
            "
            class="bg-surface-container-lowest p-2 rounded transition-opacity"
            @click="activeImage = img"
          >
            <img :src="img" class="w-full aspect-square object-cover" />
          </button>
        </div>
      </div>

      <!-- Info panel -->
      <div class="lg:col-span-4 space-y-6">
        <div class="space-y-2">
          <p
            v-if="product.brand?.name"
            class="text-xs font-bold uppercase tracking-widest text-secondary"
          >
            {{ product.brand.name }}
          </p>
          <h1
            class="text-3xl font-extrabold tracking-tight text-on-surface leading-tight font-headline"
          >
            {{ productName }}
          </h1>
          <!-- Stars -->
          <div class="flex items-center gap-2">
            <div class="flex text-primary-container">
              <span
                v-for="s in 5"
                :key="s"
                class="material-symbols-outlined text-sm"
                :style="
                  s <= Math.round(product.averageRating ?? 0)
                    ? `font-variation-settings: 'FILL' 1`
                    : ''
                "
                >star</span
              >
            </div>
            <span class="text-xs text-secondary"
              >{{ product.averageRating?.toFixed(1) ?? '0.0' }} ({{
                product.reviewCount ?? 0
              }}
              reviews)</span
            >
          </div>
        </div>

        <!-- Price -->
        <div class="flex items-baseline gap-3">
          <span class="text-3xl font-bold text-on-surface font-headline"
            >${{ effectivePrice }}</span
          >
          <span
            v-if="selectedVariant?.priceModifier && selectedVariant.priceModifier !== 0"
            class="text-sm text-secondary line-through"
            >${{ product.basePrice }}</span
          >
        </div>

        <!-- Description -->
        <p class="text-secondary text-sm leading-relaxed">{{ productDescription }}</p>

        <!-- Variants -->
        <div v-if="product.variants?.length" class="space-y-4">
          <div v-for="(opts, attr) in groupedOptions" :key="attr">
            <p class="text-xs font-bold uppercase tracking-widest text-on-surface mb-2">
              {{ attr }}
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="val in opts"
                :key="val"
                type="button"
                :class="
                  selectedOptions[attr] === val
                    ? 'bg-on-surface text-surface-container-lowest'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                "
                class="px-4 py-2 rounded text-sm font-medium transition-colors"
                @click="selectOption(attr, val)"
              >
                {{ val }}
              </button>
            </div>
          </div>
        </div>

        <!-- Quantity + Add to cart -->
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <label class="text-xs font-bold uppercase tracking-widest text-secondary">Qty</label>
            <div class="flex items-center border border-outline-variant/30 rounded">
              <button
                type="button"
                class="px-3 py-2 text-secondary hover:text-primary transition-colors"
                @click="qty = Math.max(1, qty - 1)"
              >
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <span class="px-4 text-sm font-bold text-on-surface">{{ qty }}</span>
              <button
                type="button"
                class="px-3 py-2 text-secondary hover:text-primary transition-colors"
                @click="qty++"
              >
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <span class="text-xs text-secondary micro-chip bg-surface-container-low">
              {{ product.inventoryQuantity }} in stock
            </span>
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              :disabled="addingToCart"
              class="flex-1 bg-primary-container text-on-primary-container py-3 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              @click="addToCart"
            >
              <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
              {{ addingToCart ? 'Adding…' : 'Add to Cart' }}
            </button>
            <button
              type="button"
              :class="
                wishlisted
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-surface-container text-secondary hover:text-primary'
              "
              class="p-3 rounded transition-colors"
              @click="toggleWishlist"
            >
              <span
                class="material-symbols-outlined text-sm"
                :style="wishlisted ? `font-variation-settings: 'FILL' 1` : ''"
                >favorite</span
              >
            </button>
          </div>
        </div>

        <!-- Spec micro-grid -->
        <div v-if="selectedVariant" class="flex flex-wrap gap-2">
          <span
            v-for="(val, key) in selectedVariant.optionValues"
            :key="key"
            class="micro-chip bg-surface-container-low text-secondary"
          >
            {{ key }}: {{ val }}
          </span>
          <span
            v-if="selectedVariant.sku"
            class="micro-chip bg-surface-container-low text-secondary"
            >SKU: {{ selectedVariant.sku }}</span
          >
        </div>
      </div>

      <!-- Buy box (sticky right) -->
      <div class="lg:col-span-3">
        <div class="bg-surface-container-lowest rounded p-6 space-y-4 sticky top-24">
          <p class="text-2xl font-bold text-on-surface font-headline">${{ effectivePrice }}</p>
          <p class="text-xs text-secondary">FREE delivery on orders over $99</p>
          <div class="flex items-center gap-2 text-xs">
            <span class="material-symbols-outlined text-sm text-green-600">check_circle</span>
            <span class="text-green-700 font-semibold">In Stock</span>
          </div>
          <button
            type="button"
            :disabled="addingToCart"
            class="w-full bg-primary-container text-on-primary-container py-3 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all disabled:opacity-60"
            @click="addToCart"
          >
            {{ addingToCart ? 'Adding…' : 'Add to Cart' }}
          </button>
          <button
            type="button"
            class="w-full border border-outline-variant/30 text-on-surface py-3 rounded font-bold text-sm hover:bg-surface-container-low transition-all"
            @click="buyNow"
          >
            Buy Now
          </button>
          <div class="text-xs text-secondary space-y-1 pt-2 border-t border-outline-variant/15">
            <p class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">lock</span> Secure checkout
            </p>
            <p class="flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">autorenew</span> 30-day returns
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews section -->
    <section v-if="product" class="mt-16 border-t border-outline-variant/15 pt-12">
      <div class="flex items-end justify-between mb-8">
        <h2 class="text-2xl font-bold text-on-surface font-headline">Customer Reviews</h2>
        <button
          v-if="isAuthenticated"
          type="button"
          class="bg-primary-container text-on-primary-container px-5 py-2 rounded text-sm font-semibold hover:bg-primary hover:text-on-primary transition-all"
          @click="showReviewForm = !showReviewForm"
        >
          Write a Review
        </button>
      </div>

      <!-- Review form -->
      <div v-if="showReviewForm" class="bg-surface-container-lowest rounded p-6 mb-8 space-y-4">
        <h3 class="font-bold text-on-surface">Your Review</h3>
        <div class="flex gap-2">
          <button
            v-for="s in 5"
            :key="s"
            type="button"
            class="material-symbols-outlined text-2xl transition-colors"
            :class="s <= newReview.rating ? 'text-primary-container' : 'text-outline-variant'"
            :style="s <= newReview.rating ? `font-variation-settings: 'FILL' 1` : ''"
            @click="newReview.rating = s"
          >
            star
          </button>
        </div>
        <input
          v-model="newReview.title"
          type="text"
          placeholder="Review title"
          class="w-full bg-surface-container-low border-none rounded py-2 px-4 text-sm outline-none focus:ring-1 focus:ring-primary"
        />
        <textarea
          v-model="newReview.comment"
          placeholder="Share your experience…"
          rows="4"
          class="w-full bg-surface-container-low border-none rounded py-2 px-4 text-sm outline-none focus:ring-1 focus:ring-primary resize-none"
        ></textarea>
        <div class="flex gap-3">
          <button
            type="button"
            class="bg-primary-container text-on-primary-container px-6 py-2 rounded text-sm font-semibold hover:bg-primary hover:text-on-primary transition-all"
            @click="submitReview"
          >
            Submit
          </button>
          <button
            type="button"
            class="text-sm text-secondary hover:text-on-surface transition-colors"
            @click="showReviewForm = false"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Reviews list -->
      <div v-if="reviewsPending" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-surface-container-lowest rounded p-6 animate-pulse space-y-2"
        >
          <div class="h-4 bg-surface-container-low rounded w-1/3"></div>
          <div class="h-3 bg-surface-container-low rounded w-full"></div>
        </div>
      </div>
      <div v-else-if="reviews.length" class="space-y-4">
        <div
          v-for="review in reviews"
          :key="review.id"
          class="bg-surface-container-lowest rounded p-6"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <div class="flex">
                  <span
                    v-for="s in 5"
                    :key="s"
                    class="material-symbols-outlined text-sm"
                    :class="s <= review.rating ? 'text-primary-container' : 'text-outline-variant'"
                    :style="s <= review.rating ? `font-variation-settings: 'FILL' 1` : ''"
                    >star</span
                  >
                </div>
                <span
                  v-if="review.isVerifiedPurchase"
                  class="micro-chip bg-surface-container-low text-secondary"
                  >Verified</span
                >
              </div>
              <h4 class="font-bold text-on-surface text-sm">{{ review.title ?? 'Review' }}</h4>
            </div>
            <span class="text-xs text-secondary">{{ formatDate(review.createdAt) }}</span>
          </div>
          <p class="text-secondary text-sm leading-relaxed">{{ review.comment }}</p>
          <p v-if="review.user" class="text-xs text-secondary mt-3">
            — {{ review.user.firstName ?? review.user.email }}
          </p>
        </div>
      </div>
      <p v-else class="text-secondary text-sm">
        No reviews yet. Be the first to review this product!
      </p>
    </section>
  </div>
</template>
