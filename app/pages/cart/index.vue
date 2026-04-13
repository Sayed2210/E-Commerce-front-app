<script setup lang="ts">
import type { CartItem, Product, ProductVariant } from '~/types/api'

definePageMeta({ layout: 'default', middleware: 'auth' })

const cartStore = useCartStore()
const { fetchCart, updateItem, removeItem } = useCart()

const loading = ref(true)
const couponCode = ref('')
const couponMessage = ref('')
const couponApplied = ref(false)

const items = computed(() => cartStore.items)
const isEmpty = computed(() => cartStore.isEmpty)
const itemCount = computed(() => cartStore.itemCount)
const subtotal = computed(() => cartStore.subtotal)
const discount = computed(() => cartStore.discount)
const cartTotal = computed(() => {
  const shipping = subtotal.value >= 99 ? 0 : 9.99
  return Math.max(0, subtotal.value - discount.value + shipping)
})

onMounted(async () => {
  await fetchCart()
  loading.value = false
})

function productName(p: Product | undefined) {
  if (!p) return ''
  return typeof p.name === 'string' ? p.name : (p.name?.en ?? '')
}

function variantName(v: ProductVariant) {
  const n = v.variantName
  return typeof n === 'string' ? n : (n?.en ?? '')
}

async function changeQty(item: CartItem, newQty: number) {
  if (newQty < 1) return remove(item.id)
  await updateItem(item.id, { quantity: newQty })
}

async function remove(itemId: string) {
  await removeItem(itemId)
}

function saveForLater(_itemId: string) {
  // TODO: move to wishlist
}

function applyCoupon() {
  if (!couponCode.value.trim()) return
  // Validate via API when checkout composable is ready
  couponMessage.value = 'Coupon applied!'
  couponApplied.value = true
}

useSeoMeta({ title: 'Shopping Cart — ArchitectMarket' })
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 mb-8 text-xs uppercase tracking-widest text-secondary">
      <NuxtLink to="/" class="hover:text-primary transition-colors">Marketplace</NuxtLink>
      <span class="material-symbols-outlined text-[10px]">chevron_right</span>
      <span class="text-on-surface">Shopping Cart</span>
    </nav>

    <!-- Empty state -->
    <div v-if="isEmpty && !loading" class="text-center py-24">
      <span class="material-symbols-outlined text-7xl text-secondary/20 block mb-4"
        >shopping_cart</span
      >
      <h2 class="text-2xl font-bold text-on-surface font-headline mb-2">Your cart is empty</h2>
      <p class="text-secondary text-sm mb-6">Looks like you haven't added anything yet.</p>
      <NuxtLink
        to="/products"
        class="inline-block bg-primary-container text-on-primary-container px-8 py-3 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all"
      >
        Start Shopping
      </NuxtLink>
    </div>

    <div v-else class="flex flex-col lg:flex-row gap-8">
      <!-- Cart items -->
      <section class="lg:w-3/4 space-y-4">
        <div class="flex items-end justify-between border-b border-outline-variant/15 pb-4">
          <h1 class="text-3xl font-bold text-on-surface font-headline">Shopping Cart</h1>
          <span class="text-secondary text-sm"
            >{{ itemCount }} item{{ itemCount !== 1 ? 's' : '' }}</span
          >
        </div>

        <!-- Loading skeletons -->
        <div v-if="loading" class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-surface-container-lowest rounded p-6 flex gap-6 animate-pulse"
          >
            <div class="w-32 h-32 bg-surface-container-low rounded shrink-0"></div>
            <div class="flex-1 space-y-3">
              <div class="h-5 bg-surface-container-low rounded w-2/3"></div>
              <div class="h-4 bg-surface-container-low rounded w-1/3"></div>
              <div class="h-4 bg-surface-container-low rounded w-1/4"></div>
            </div>
          </div>
        </div>

        <div
          v-for="item in items"
          :key="item.id"
          class="bg-surface-container-lowest rounded p-6 flex gap-6 transition-all hover:shadow-ambient"
        >
          <!-- Image -->
          <div class="w-32 h-32 shrink-0 bg-surface-container-low rounded overflow-hidden">
            <img
              v-if="item.product?.images?.[0]"
              :src="item.product.images[0]"
              :alt="productName(item.product)"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Details -->
          <div class="flex-grow flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-headline font-semibold text-lg text-on-surface">
                    {{ productName(item.product) }}
                  </h3>
                  <p v-if="item.variant" class="text-secondary text-sm mt-0.5">
                    Variant: {{ variantName(item.variant) }}
                  </p>
                </div>
                <p class="font-headline font-bold text-xl text-on-surface">
                  ${{ item.totalPrice.toFixed(2) }}
                </p>
              </div>
              <div class="mt-2">
                <span
                  :class="
                    item.product?.inventoryQuantity > 0
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-error-container text-on-error-container'
                  "
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter"
                >
                  {{ item.product?.inventoryQuantity > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
              </div>
            </div>

            <!-- Qty + actions -->
            <div class="flex items-center gap-6 mt-4">
              <div class="flex items-center gap-2">
                <label class="text-[10px] font-bold uppercase text-secondary">Qty:</label>
                <div class="flex items-center border border-outline-variant/20 rounded">
                  <button
                    type="button"
                    class="px-2 py-1 text-secondary hover:text-primary transition-colors"
                    @click="changeQty(item, item.quantity - 1)"
                  >
                    <span class="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span class="px-3 text-sm font-bold">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="px-2 py-1 text-secondary hover:text-primary transition-colors"
                    @click="changeQty(item, item.quantity + 1)"
                  >
                    <span class="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
              <div class="h-4 w-px bg-outline-variant/30"></div>
              <div class="flex gap-4">
                <button
                  type="button"
                  class="text-xs text-error hover:underline transition-all"
                  @click="remove(item.id)"
                >
                  Remove
                </button>
                <button
                  type="button"
                  class="text-xs text-primary hover:underline transition-all"
                  @click="saveForLater(item.id)"
                >
                  Save for later
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Continue shopping -->
        <NuxtLink
          to="/products"
          class="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:underline mt-2"
        >
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          Continue Shopping
        </NuxtLink>
      </section>

      <!-- Order summary -->
      <aside class="lg:w-1/4 space-y-4">
        <div class="bg-surface-container-lowest rounded p-6 space-y-4 sticky top-24">
          <h2
            class="font-headline font-bold text-lg text-on-surface border-b border-outline-variant/15 pb-3"
          >
            Order Summary
          </h2>

          <!-- Coupon -->
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-secondary"
              >Coupon Code</label
            >
            <div class="flex gap-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Enter code"
                class="flex-1 bg-surface-container-low border-none rounded py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                class="bg-surface-container text-primary px-3 py-2 rounded text-xs font-bold hover:bg-primary-container hover:text-on-primary-container transition-all"
                @click="applyCoupon"
              >
                Apply
              </button>
            </div>
            <p
              v-if="couponMessage"
              class="text-xs"
              :class="couponApplied ? 'text-green-600' : 'text-error'"
            >
              {{ couponMessage }}
            </p>
          </div>

          <!-- Totals -->
          <div class="space-y-2 text-sm border-t border-outline-variant/15 pt-4">
            <div class="flex justify-between text-secondary">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="discount > 0" class="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${{ discount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-secondary">
              <span>Shipping</span>
              <span class="text-green-600 font-semibold">{{
                subtotal >= 99 ? 'FREE' : '$9.99'
              }}</span>
            </div>
            <div
              class="flex justify-between font-bold text-on-surface text-base border-t border-outline-variant/15 pt-2 mt-2"
            >
              <span>Total</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>

          <NuxtLink
            to="/checkout"
            class="w-full bg-primary-container text-on-primary-container py-3 rounded font-bold text-sm hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-sm">lock</span>
            Proceed to Checkout
          </NuxtLink>

          <div class="flex items-center justify-center gap-4 text-xs text-secondary pt-2">
            <span class="flex items-center gap-1"
              ><span class="material-symbols-outlined text-sm">credit_card</span> Stripe</span
            >
            <span class="flex items-center gap-1"
              ><span class="material-symbols-outlined text-sm">account_balance</span> PayPal</span
            >
            <span class="flex items-center gap-1"
              ><span class="material-symbols-outlined text-sm">payments</span> COD</span
            >
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
