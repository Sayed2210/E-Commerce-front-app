<script setup lang="ts">
import type { CreateVariantDto } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { createProduct } = useProducts()
const router = useRouter()

const submitting = ref(false)
const error = ref('')
const success = ref(false)
const newImageUrl = ref('')

interface VariantForm {
  variantName: { en: string; ar?: string }
  sku: string
  priceModifier: number
  inventoryQuantity: number
  optionValues: Record<string, string>
}

const form = reactive({
  name: { en: '', ar: '' },
  description: { en: '', ar: '' },
  basePrice: 0,
  categoryId: '',
  brandId: '',
  inventoryQuantity: 0,
  images: [] as string[],
  variants: [] as VariantForm[],
  isActive: true,
})

function addVariant() {
  form.variants.push({
    variantName: { en: '' },
    sku: '',
    priceModifier: 0,
    inventoryQuantity: 0,
    optionValues: {},
  })
}

function removeVariant(i: number) {
  form.variants.splice(i, 1)
}

function addImageUrl() {
  if (newImageUrl.value.trim()) {
    form.images.push(newImageUrl.value.trim())
    newImageUrl.value = ''
  }
}

function removeImage(i: number) {
  form.images.splice(i, 1)
}

function optionValuesToString(obj: Record<string, string>) {
  return Object.entries(obj)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')
}

function parseOptionValues(i: number, str: string) {
  const obj: Record<string, string> = {}
  str.split(',').forEach((pair) => {
    const [k, v] = pair.split('=').map((s) => s.trim())
    if (k && v) obj[k] = v
  })
  const variant = form.variants[i]
  if (variant) variant.optionValues = obj
}

async function submit() {
  submitting.value = true
  error.value = ''

  const { data, error: apiError } = await createProduct({
    name: form.name,
    description: form.description,
    basePrice: form.basePrice,
    categoryId: form.categoryId,
    brandId: form.brandId,
    inventoryQuantity: form.inventoryQuantity,
    images: form.images,
    variants: form.variants.map((v) => ({
      variantName: v.variantName,
      sku: v.sku || undefined,
      priceModifier: v.priceModifier,
      inventoryQuantity: v.inventoryQuantity,
      optionValues: v.optionValues,
    })) as CreateVariantDto[],
    isActive: form.isActive,
  })

  submitting.value = false

  if (apiError || !data) {
    error.value = (apiError as any)?.message ?? 'Failed to create product'
    return
  }

  success.value = true
  setTimeout(() => router.push('/admin/products'), 1500)
}

useSeoMeta({ title: 'Add Product — Admin' })
</script>

<template>
  <div class="space-y-8 max-w-5xl">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-bold font-headline text-on-surface">Add New Product</h2>
        <p class="text-secondary text-sm">Fill in the details to list a new product</p>
      </div>
      <NuxtLink
        to="/admin/products"
        class="text-secondary text-sm hover:text-on-surface flex items-center gap-1 transition-colors"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Back to Inventory
      </NuxtLink>
    </div>

    <form class="space-y-6" @submit.prevent="submit">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main info (2/3) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic details -->
          <div class="bg-surface-container-lowest rounded p-6 space-y-5">
            <h3
              class="font-bold text-on-surface font-headline border-b border-outline-variant/10 pb-3"
            >
              Product Details
            </h3>

            <div>
              <label class="field-label">Product Name (English)</label>
              <input
                v-model="form.name.en"
                required
                type="text"
                placeholder="e.g. Titanium Precision Drafting Set"
                class="field-input"
              />
            </div>
            <div>
              <label class="field-label">Product Name (Arabic)</label>
              <input
                v-model="form.name.ar"
                type="text"
                placeholder="اسم المنتج بالعربية"
                dir="rtl"
                class="field-input"
              />
            </div>
            <div>
              <label class="field-label">Description (English)</label>
              <textarea
                v-model="form.description.en"
                rows="4"
                placeholder="Detailed product description…"
                class="field-input resize-none"
              ></textarea>
            </div>
            <div>
              <label class="field-label">Description (Arabic)</label>
              <textarea
                v-model="form.description.ar"
                rows="3"
                dir="rtl"
                placeholder="وصف المنتج بالعربية…"
                class="field-input resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Images -->
          <div class="bg-surface-container-lowest rounded p-6 space-y-4">
            <h3
              class="font-bold text-on-surface font-headline border-b border-outline-variant/10 pb-3"
            >
              Product Images
            </h3>
            <div class="grid grid-cols-4 gap-3">
              <div
                v-for="(img, i) in form.images"
                :key="i"
                class="aspect-square bg-surface-container-low rounded relative group overflow-hidden"
              >
                <img :src="img" class="w-full h-full object-cover" />
                <button
                  type="button"
                  class="absolute inset-0 bg-on-surface/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="removeImage(i)"
                >
                  <span class="material-symbols-outlined text-surface-container-lowest"
                    >delete</span
                  >
                </button>
              </div>
              <div
                class="aspect-square border-2 border-dashed border-outline-variant/40 rounded flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-container transition-colors text-secondary hover:text-primary"
              >
                <span class="material-symbols-outlined text-2xl">add_photo_alternate</span>
                <span class="text-xs font-medium">Add Image</span>
              </div>
            </div>
            <div>
              <label class="field-label">Or paste image URL</label>
              <div class="flex gap-2">
                <input
                  v-model="newImageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  class="field-input flex-1"
                />
                <button
                  type="button"
                  class="bg-surface-container text-on-surface px-4 py-2 rounded text-sm font-semibold hover:bg-surface-container-high transition-colors"
                  @click="addImageUrl"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <!-- Variants -->
          <div class="bg-surface-container-lowest rounded p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-outline-variant/10 pb-3">
              <h3 class="font-bold text-on-surface font-headline">Variants</h3>
              <button
                type="button"
                class="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
                @click="addVariant"
              >
                <span class="material-symbols-outlined text-sm">add</span> Add Variant
              </button>
            </div>

            <div v-if="!form.variants.length" class="text-sm text-secondary text-center py-4">
              No variants added. Product will have a single base price.
            </div>

            <div
              v-for="(variant, i) in form.variants"
              :key="i"
              class="border border-outline-variant/20 rounded p-4 space-y-3 relative"
            >
              <button
                type="button"
                class="absolute top-3 right-3 text-secondary hover:text-error transition-colors"
                @click="removeVariant(i)"
              >
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="field-label">Variant Name (EN)</label>
                  <input
                    v-model="variant.variantName.en"
                    type="text"
                    placeholder="e.g. Black - Medium"
                    class="field-input"
                  />
                </div>
                <div>
                  <label class="field-label">SKU</label>
                  <input
                    v-model="variant.sku"
                    type="text"
                    placeholder="e.g. BLK-MED-001"
                    class="field-input"
                  />
                </div>
                <div>
                  <label class="field-label">Price Modifier ($)</label>
                  <input
                    v-model.number="variant.priceModifier"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    class="field-input"
                  />
                </div>
                <div>
                  <label class="field-label">Stock Quantity</label>
                  <input
                    v-model.number="variant.inventoryQuantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="field-input"
                  />
                </div>
              </div>
              <div>
                <label class="field-label">Option Values (e.g. color=Black, size=Medium)</label>
                <input
                  :value="optionValuesToString(variant.optionValues)"
                  type="text"
                  placeholder="color=Black, size=Medium"
                  class="field-input"
                  @input="parseOptionValues(i, ($event.target as HTMLInputElement).value)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar (1/3) -->
        <div class="space-y-4">
          <!-- Pricing -->
          <div class="bg-surface-container-lowest rounded p-6 space-y-4">
            <h3
              class="font-bold text-on-surface font-headline border-b border-outline-variant/10 pb-3"
            >
              Pricing & Stock
            </h3>
            <div>
              <label class="field-label">Base Price ($)</label>
              <input
                v-model.number="form.basePrice"
                required
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="field-input"
              />
            </div>
            <div>
              <label class="field-label">Inventory Quantity</label>
              <input
                v-model.number="form.inventoryQuantity"
                required
                type="number"
                min="0"
                placeholder="0"
                class="field-input"
              />
            </div>
          </div>

          <!-- Organization -->
          <div class="bg-surface-container-lowest rounded p-6 space-y-4">
            <h3
              class="font-bold text-on-surface font-headline border-b border-outline-variant/10 pb-3"
            >
              Organization
            </h3>
            <div>
              <label class="field-label">Category ID</label>
              <input
                v-model="form.categoryId"
                required
                type="text"
                placeholder="Category UUID"
                class="field-input"
              />
            </div>
            <div>
              <label class="field-label">Brand ID</label>
              <input
                v-model="form.brandId"
                required
                type="text"
                placeholder="Brand UUID"
                class="field-input"
              />
            </div>
            <div class="flex items-center gap-3 pt-1">
              <input
                id="isActive"
                v-model="form.isActive"
                type="checkbox"
                class="w-4 h-4 accent-primary-container rounded"
              />
              <label for="isActive" class="text-sm text-on-surface font-medium cursor-pointer"
                >Active (visible on store)</label
              >
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="submitting"
            class="w-full bg-primary-container text-on-primary-container py-3 rounded font-bold text-sm hover:brightness-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-sm">{{
              submitting ? 'hourglass_empty' : 'add_box'
            }}</span>
            {{ submitting ? 'Creating…' : 'Create Product' }}
          </button>

          <p v-if="error" class="text-error text-xs text-center">{{ error }}</p>
          <p
            v-if="success"
            class="text-green-600 text-xs text-center flex items-center justify-center gap-1"
          >
            <span
              class="material-symbols-outlined text-sm"
              style="font-variation-settings: 'FILL' 1"
              >check_circle</span
            >
            Product created!
          </p>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.field-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
  display: block;
  margin-bottom: 0.375rem;
}

.field-input {
  width: 100%;
  background-color: var(--color-surface-container-low);
  border: none;
  border-radius: var(--radius-lg);
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  outline: none;
  transition: box-shadow 200ms ease;
}

.field-input:focus {
  box-shadow: 0 0 0 1px var(--color-primary);
}
</style>
