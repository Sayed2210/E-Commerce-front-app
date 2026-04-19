// ── Shared ────────────────────────────────────────────────────────────────

export interface TranslatableString {
  en: string
  ar?: string
  [locale: string]: string | undefined
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ── Auth ──────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'CUSTOMER'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  roles: UserRole[]
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface RefreshTokenDto {
  refreshToken: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  newPassword: string
}

export interface UpdateProfileDto {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

// ── Products ──────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string
  variantName: TranslatableString | string
  priceModifier: number
  sku?: string
  barcode?: string
  inventoryQuantity: number
  lowStockThreshold: number
  optionValues: Record<string, string>
  imageUrl?: string
  isActive: boolean
}

export interface Product {
  id: string
  name: TranslatableString | string
  description: TranslatableString | string
  basePrice: number
  categoryId: string
  category?: Category
  brandId: string
  brand?: Brand
  inventoryQuantity: number
  images: string[]
  variants: ProductVariant[]
  tags?: Tag[]
  isActive: boolean
  averageRating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductDto {
  name: TranslatableString
  description: TranslatableString
  basePrice: number
  categoryId: string
  brandId: string
  inventoryQuantity: number
  images?: string[]
  variants?: CreateVariantDto[]
  isActive?: boolean
}

export interface CreateVariantDto {
  variantName: TranslatableString | string
  priceModifier?: number
  sku?: string
  barcode?: string
  inventoryQuantity: number
  lowStockThreshold?: number
  optionValues: Record<string, string>
  imageUrl?: string
  isActive?: boolean
}

export type UpdateProductDto = Partial<CreateProductDto>

// ── Category & Brand ──────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface CreateTagDto {
  name: string
  slug?: string
}

// ── Cart ──────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  productId: string
  product: Product
  variantId?: string
  variant?: ProductVariant
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
}

export interface AddCartItemDto {
  productId: string
  variantId?: string
  quantity: number
}

export interface UpdateCartItemDto {
  quantity: number
}

// ── Orders ────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentMethod = 'stripe' | 'paypal' | 'cash_on_delivery'

export interface OrderItem {
  id: string
  productId: string
  product: Product
  variantId?: string
  variant?: ProductVariant
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Address {
  id: string
  firstName?: string
  lastName?: string
  phone?: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault?: boolean
}

export interface CreateAddressDto {
  firstName?: string
  lastName?: string
  phone?: string
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  isDefault?: boolean
}

export type UpdateAddressDto = Partial<CreateAddressDto>

export interface ApplyCouponResponse {
  discountValue: number
  type: 'percentage' | 'fixed'
  couponId: string
}

export interface Order {
  id: string
  userId: string
  user?: User
  items: OrderItem[]
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingAddress?: Address
  couponCode?: string
  subtotal: number
  discount: number
  shippingFee: number
  total: number
  createdAt: string
  updatedAt: string
}

export interface CreateOrderDto {
  shippingAddressId: string
  paymentMethod: PaymentMethod
  couponCode?: string
  paymentToken?: string
}

// ── Wishlist ──────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string
  productId: string
  product: Product
  addedAt: string
}

export interface CreateWishlistDto {
  productId: string
}

// ── Reviews ───────────────────────────────────────────────────────────────

export interface Review {
  id: string
  productId: string
  userId: string
  user?: User
  rating: number
  title?: string
  comment?: string
  images?: string[]
  orderId?: string
  isVerifiedPurchase: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateReviewDto {
  productId: string
  orderId?: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
}

export type UpdateReviewDto = Partial<CreateReviewDto>

// ── Notifications ─────────────────────────────────────────────────────────

export type NotificationType = 'order' | 'promo' | 'system' | 'review'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  data?: Record<string, unknown>
  createdAt: string
}

export interface CreateNotificationDto {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

// ── Coupons ───────────────────────────────────────────────────────────────

export type CouponType = 'percentage' | 'fixed' | 'free_shipping'

export interface Coupon {
  id: string
  code: string
  type: CouponType
  value: number
  maxDiscount?: number
  minOrderValue: number
  usageLimit?: number
  usageCount: number
  startDate: string
  endDate?: string
  isActive: boolean
}

export interface CreateCouponDto {
  code: string
  type: CouponType
  value?: number
  maxDiscount?: number
  minOrderValue?: number
  usageLimit?: number
  startDate: string
  endDate?: string
  isActive?: boolean
}

export type UpdateCouponDto = Partial<CreateCouponDto>

// ── Returns ───────────────────────────────────────────────────────────────

export type ReturnReason = 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind'
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed'

export interface Return {
  id: string
  orderId: string
  orderItemId: string
  userId: string
  reason: ReturnReason
  notes?: string
  status: ReturnStatus
  createdAt: string
  updatedAt: string
}

export interface CreateReturnDto {
  orderId: string
  orderItemId: string
  reason: ReturnReason
  notes?: string
}

export interface ProcessReturnDto {
  status: 'approved' | 'rejected'
  notes?: string
}

// ── Search ────────────────────────────────────────────────────────────────

export interface SearchResult {
  products: Product[]
  total: number
  query: string
  page: number
  limit: number
}

// ── Admin ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  recentOrders: Order[]
  revenueByMonth: { month: string; revenue: number }[]
  ordersByStatus: { status: OrderStatus; count: number }[]
  topProducts: { product: Product; sales: number }[]
}

export interface StaffMember {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  createdAt: string
}

export interface CreateStaffDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role: string
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, unknown>
  createdAt: string
}

// ── Newsletter ────────────────────────────────────────────────────────────

export interface SubscribeDto {
  email: string
}

export interface SendCampaignDto {
  subject: string
  content: string
  recipientFilter?: string
}

export interface NewsletterStats {
  totalSubscribers: number
  activeSubscribers: number
  unsubscribed: number
}
