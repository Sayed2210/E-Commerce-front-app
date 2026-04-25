<script setup lang="ts">
import type { Brand, Category, Product, UpdateProductDto } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const productId = computed(() => route.params.id as string)

const { getProduct, updateProduct } = useProducts()
const { uploadImage } = useProductImages()
const { listCategories } = useCategories()
const { listBrands } = useBrands()

const [{ data: productData, pending, refresh }, { data: categoriesData }, { data: brandsData }] =
  await Promise.all([
    getProduct(productId.value),
    listCategories({ limit: 100 }),
    listBrands({ limit: 100 }),
  ])

const product = computed<Product | null>(() => productData.value ?? null)
const categories = computed<Category[]>(() => categoriesData.value ?? [])
const brands = computed<Brand[]>(() => brandsData.value ?? [])

const submitting = ref(false)
const uploading = ref(false)
const error = ref('')
const success = ref(false)
const selectedFiles = ref<File[]>([])

const form = reactive({
  name: { en: '', ar: '' },
  description: { en: '', ar: '' },
  basePrice: 0,
  categoryId: '',
  brandId: '',
  inventoryQuantity: 0,
  images: [] as string[],
  isActive: true,
})

watch(
  product,
  (value) => {
    if (!value) return
    form.name =
      typeof value.name === 'string'
        ? { en: value.name, ar: '' }
        : { en: value.name.en, ar: value.name.ar ?? '' }
    form.description =
      typeof value.description === 'string'
        ? { en: value.description, ar: '' }
        : { en: value.description.en, ar: value.description.ar ?? '' }
    form.basePrice = value.basePrice
    form.categoryId = value.categoryId
    form.brandId = value.brandId
    form.inventoryQuantity = value.inventoryQuantity
    form.images = [...(value.images ?? [])]
    form.isActive = value.isActive
  },
  { immediate: true }
)

function handleImageFiles(event: Event) {
  const input = event.target as HTMLInputElement
  selectedFiles.value = Array.from(input.files ?? [])
}

function removeImage(index: number) {
  form.images.splice(index, 1)
}

function setPrimary(index: number) {
  const [image] = form.images.splice(index, 1)
  if (image) form.images.unshift(image)
}

async function submit() {
  submitting.value = true
  error.value = ''
  success.value = false

  const dto: UpdateProductDto = {
    name: form.name,
    description: form.description,
    basePrice: form.basePrice,
    categoryId: form.categoryId,
    brandId: form.brandId,
    inventoryQuantity: form.inventoryQuantity,
    images: form.images,
    isActive: form.isActive,
  }

  const { error: updateError } = await updateProduct(productId.value, dto)

  if (updateError) {
    error.value = 'Failed to update product.'
    submitting.value = false
    return
  }

  if (selectedFiles.value.length) {
    uploading.value = true
    for (const file of selectedFiles.value) {
      const { error: uploadError } = await uploadImage(productId.value, file)
      if (uploadError) error.value = 'Product updated, but one or more images failed to upload.'
    }
    uploading.value = false
  }

  submitting.value = false
  selectedFiles.value = []
  success.value = !error.value
  await refresh()
}

useSeoMeta({ title: 'Edit Product — Admin' })
</script>

<template>
  <div class="space-y-8 max-w-5xl">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="text-2xl font-bold font-headline text-on-surface">Edit Product</h2>
        <p class="text-secondary text-sm">Update product details and image gallery</p>
      </div>
      <NuxtLink
        to="/admin/products"
        class="text-secondary text-sm hover:text-on-surface flex items-center gap-1 transition-colors"
      >
        <span class="material-symbols-outlined text-sm">arrow_back</span>
        Back to Inventory
      </NuxtLink>
    </div>

    <AdminSharedDataTableSkeleton v-if="pending" :rows="5" :columns="3" />

    <form v-else class="space-y-6" @submit.prevent="submit">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-surface-container-lowest rounded p-6 space-y-5">
            <h3
              class="font-bold text-on-surface font-headline border-b border-outline-variant/10 pb-3"
            >
              Product Details
            </h3>
            <div>
              <label class="field-label">Product Name (English)</label>
              <input v-model="form.name.en" required type="text" class="field-input" />
            </div>
            <div>
              <label class="field-label">Product Name (Arabic)</label>
              <input v-model="form.name.ar" type="text" dir="rtl" class="field-input" />
            </div>
            <div>
              <label class="field-label">Description (English)</label>
              <textarea v-model="form.description.en" rows="4" class="field-input resize-none" />
            </div>
            <div>
              <label class="field-label">Description (Arabic)</label>
              <textarea
                v-model="form.description.ar"
                rows="3"
                dir="rtl"
                class="field-input resize-none"
              />
            </div>
          </div>

          <div class="bg-surface-container-lowest rounded p-6 space-y-4">
            <h3
              class="font-bold text-on-surface font-headline border-b border-outline-variant/10 pb-3"
            >
              Image Gallery
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-for="(img, i) in form.images"
                :key="img"
                class="aspect-square bg-surface-container-low rounded relative group overflow-hidden"
              >
                <img :src="img" class="w-full h-full object-cover" alt="Product image" />
                <div
                  class="absolute inset-0 bg-on-surface/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                >
                  <button
                    type="button"
                    class="gallery-btn"
                    :disabled="i === 0"
                    @click="setPrimary(i)"
                  >
                    Primary
                  </button>
                  <button
                    type="button"
                    class="gallery-btn gallery-btn--danger"
                    @click="removeImage(i)"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <label
                class="aspect-square border-2 border-dashed border-outline-variant/40 rounded flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary-container transition-colors text-secondary hover:text-primary p-3 text-center"
              >
                <span class="material-symbols-outlined text-2xl">add_photo_alternate</span>
                <span class="text-xs font-medium">Upload Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  class="sr-only"
                  @change="handleImageFiles"
                />
              </label>
            </div>
            <p v-if="selectedFiles.length" class="text-xs text-secondary">
              {{ selectedFiles.length }} file{{ selectedFiles.length === 1 ? '' : 's' }} selected
              for upload on save.
            </p>
          </div>
        </div>

        <div class="space-y-4">
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
                class="field-input"
              />
            </div>
          </div>

          <div class="bg-surface-container-lowest rounded p-6 space-y-4">
            <h3
              class="font-bold text-on-surface font-headline border-b border-outline-variant/10 pb-3"
            >
              Organization
            </h3>
            <div>
              <label class="field-label">Category</label>
              <select v-model="form.categoryId" required class="field-input">
                <option value="" disabled>Select category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="field-label">Brand</label>
              <select v-model="form.brandId" required class="field-input">
                <option value="" disabled>Select brand</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-3 pt-1">
              <input
                id="isActive"
                v-model="form.isActive"
                type="checkbox"
                class="w-4 h-4 accent-primary-container rounded"
              />
              <label for="isActive" class="text-sm text-on-surface font-medium cursor-pointer"
                >Active</label
              >
            </div>
          </div>

          <button
            type="submit"
            :disabled="submitting || uploading"
            class="w-full bg-primary-container text-on-primary-container py-3 rounded font-bold text-sm hover:brightness-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span class="material-symbols-outlined text-sm">{{
              submitting || uploading ? 'hourglass_empty' : 'save'
            }}</span>
            {{ submitting || uploading ? 'Saving...' : 'Save Product' }}
          </button>

          <p v-if="error" class="text-error text-xs text-center">{{ error }}</p>
          <p v-if="success" class="success-message">Product updated.</p>
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
  background: var(--color-surface-container);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--color-on-surface);
  outline: none;
}

.field-input:focus {
  border-color: var(--color-primary);
}

.gallery-btn {
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  border: none;
  border-radius: var(--radius-sm);
  padding: 0.375rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  cursor: pointer;
}

.gallery-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gallery-btn--danger {
  color: var(--color-error);
}

.success-message {
  color: var(--color-on-success-container);
  font-size: 0.75rem;
  text-align: center;
}
</style>
