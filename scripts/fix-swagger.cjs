const fs = require('fs');
const path = require('path');

const swaggerPath = path.join(__dirname, '..', 'swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

// ── 1. Fix TranslatableString schema ──────────────────────────────────────
swagger.components.schemas.TranslatableString = {
  type: 'object',
  properties: {
    en: { type: 'string' },
    ar: { type: 'string' }
  },
  additionalProperties: { type: 'string' }
};

// ── 2. Add PaginatedResponse schema ───────────────────────────────────────
swagger.components.schemas.PaginatedResponse = {
  type: 'object',
  properties: {
    data: { type: 'array', items: { type: 'object' } },
    meta: {
      type: 'object',
      properties: {
        page: { type: 'integer', example: 1 },
        limit: { type: 'integer', example: 10 },
        total: { type: 'integer', example: 100 },
        totalPages: { type: 'integer', example: 10 }
      }
    }
  }
};

// ── 3. Add core response schemas ──────────────────────────────────────────
const responseSchemas = {
  Product: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
      name: { $ref: '#/components/schemas/TranslatableString' },
      description: { $ref: '#/components/schemas/TranslatableString' },
      basePrice: { type: 'number', example: 99.99 },
      categoryId: { type: 'string' },
      category: { $ref: '#/components/schemas/Category' },
      brandId: { type: 'string' },
      brand: { $ref: '#/components/schemas/Brand' },
      inventoryQuantity: { type: 'integer', example: 100 },
      images: { type: 'array', items: { type: 'string' } },
      variants: { type: 'array', items: { $ref: '#/components/schemas/ProductVariant' } },
      tags: { type: 'array', items: { $ref: '#/components/schemas/Tag' } },
      isActive: { type: 'boolean', example: true },
      averageRating: { type: 'number', example: 4.5 },
      reviewCount: { type: 'integer', example: 12 },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  ProductVariant: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      variantName: { $ref: '#/components/schemas/TranslatableString' },
      priceModifier: { type: 'number', example: 0 },
      sku: { type: 'string' },
      barcode: { type: 'string' },
      inventoryQuantity: { type: 'integer', example: 50 },
      lowStockThreshold: { type: 'integer', example: 5 },
      optionValues: { type: 'object', additionalProperties: { type: 'string' } },
      imageUrl: { type: 'string' },
      isActive: { type: 'boolean', example: true }
    }
  },
  ProductListResponse: {
    type: 'object',
    properties: {
      data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
      meta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 100 },
          totalPages: { type: 'integer', example: 10 }
        }
      }
    }
  },
  Category: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      slug: { type: 'string' },
      description: { type: 'string' },
      image: { type: 'string' },
      parentId: { type: 'string' },
      children: { type: 'array', items: { $ref: '#/components/schemas/Category' } }
    }
  },
  Brand: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      slug: { type: 'string' },
      logo: { type: 'string' }
    }
  },
  User: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string', example: 'user@example.com' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      roles: { type: 'array', items: { type: 'string' } },
      phone: { type: 'string' },
      avatar: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Order: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      orderNumber: { type: 'string' },
      userId: { type: 'string' },
      user: { $ref: '#/components/schemas/User' },
      items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
      status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] },
      paymentMethod: { type: 'string', enum: ['stripe', 'paypal', 'cod'] },
      paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'] },
      shippingAddress: { $ref: '#/components/schemas/Address' },
      couponCode: { type: 'string' },
      subtotal: { type: 'number' },
      taxAmount: { type: 'number' },
      shippingAmount: { type: 'number' },
      discountAmount: { type: 'number' },
      totalAmount: { type: 'number' },
      currency: { type: 'string', example: 'USD' },
      paymentIntentId: { type: 'string' },
      trackingNumber: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  OrderItem: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      productId: { type: 'string' },
      productName: { type: 'string' },
      variantId: { type: 'string' },
      variantName: { type: 'string' },
      sku: { type: 'string' },
      product: { $ref: '#/components/schemas/Product' },
      variant: { $ref: '#/components/schemas/ProductVariant' },
      quantity: { type: 'integer' },
      unitPrice: { type: 'number' },
      totalPrice: { type: 'number' }
    }
  },
  Address: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      label: { type: 'string', enum: ['home', 'work', 'other'] },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      phone: { type: 'string' },
      streetAddress: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      country: { type: 'string' },
      postalCode: { type: 'string' },
      isDefault: { type: 'boolean' }
    }
  },
  Cart: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string' },
      items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
      subtotal: { type: 'number' },
      discount: { type: 'number' },
      total: { type: 'number' }
    }
  },
  CartItem: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      productId: { type: 'string' },
      product: { $ref: '#/components/schemas/Product' },
      variantId: { type: 'string' },
      variant: { $ref: '#/components/schemas/ProductVariant' },
      quantity: { type: 'integer' },
      unitPrice: { type: 'number' },
      totalPrice: { type: 'number' }
    }
  },
  WishlistItem: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      productId: { type: 'string' },
      product: { $ref: '#/components/schemas/Product' },
      addedAt: { type: 'string', format: 'date-time' }
    }
  },
  Review: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      productId: { type: 'string' },
      userId: { type: 'string' },
      user: { $ref: '#/components/schemas/User' },
      rating: { type: 'integer', minimum: 1, maximum: 5 },
      title: { type: 'string' },
      comment: { type: 'string' },
      images: { type: 'array', items: { type: 'string' } },
      orderId: { type: 'string' },
      isVerifiedPurchase: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  Notification: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string' },
      type: { type: 'string', enum: ['order', 'promo', 'system', 'review'] },
      title: { type: 'string' },
      message: { type: 'string' },
      isRead: { type: 'boolean' },
      data: { type: 'object' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },
  Coupon: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      code: { type: 'string' },
      type: { type: 'string', enum: ['percentage', 'fixed', 'free_shipping'] },
      value: { type: 'number' },
      maxDiscount: { type: 'number' },
      minOrderValue: { type: 'number' },
      usageLimit: { type: 'integer' },
      usageCount: { type: 'integer' },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' },
      isActive: { type: 'boolean' }
    }
  },
  Return: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      orderId: { type: 'string' },
      orderItemId: { type: 'string' },
      userId: { type: 'string' },
      reason: { type: 'string', enum: ['defective', 'wrong_item', 'not_as_described', 'changed_mind'] },
      notes: { type: 'string' },
      status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'completed'] },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  StaffMember: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      role: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' }
    }
  },
  DashboardStats: {
    type: 'object',
    properties: {
      totalRevenue: { type: 'number' },
      totalOrders: { type: 'integer' },
      totalUsers: { type: 'integer' },
      totalProducts: { type: 'integer' },
      recentOrders: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
      revenueByMonth: { type: 'array', items: { type: 'object' } },
      ordersByStatus: { type: 'array', items: { type: 'object' } },
      topProducts: { type: 'array', items: { type: 'object' } }
    }
  }
};

Object.assign(swagger.components.schemas, responseSchemas);

// ── 4. Fix UpdateReviewDto ────────────────────────────────────────────────
swagger.components.schemas.UpdateReviewDto = {
  type: 'object',
  properties: {
    rating: { type: 'integer', minimum: 1, maximum: 5, description: 'Rating from 1 to 5' },
    title: { type: 'string', description: 'Review title' },
    comment: { type: 'string', description: 'Detailed review comment' },
    images: { type: 'array', items: { type: 'string' }, description: 'Array of image URLs' }
  }
};

// ── 5. Add missing request body schemas ───────────────────────────────────
swagger.components.schemas.UpdateOrderStatusDto = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      description: 'New order status'
    }
  },
  required: ['status']
};

swagger.components.schemas.ApplyCouponDto = {
  type: 'object',
  properties: {
    code: { type: 'string', description: 'Coupon code', example: 'SUMMER2024' }
  },
  required: ['code']
};

swagger.components.schemas.UnsubscribeDto = {
  type: 'object',
  properties: {
    email: { type: 'string', description: 'Email to unsubscribe', example: 'user@example.com' }
  },
  required: ['email']
};

// ── 6. Add 401 to all protected endpoints ─────────────────────────────────
const protectedPaths = [];
for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, spec] of Object.entries(methods)) {
    if (spec.security && spec.security.some(s => s.bearer !== undefined)) {
      if (!spec.responses['401']) {
        spec.responses['401'] = { description: 'Unauthorized - invalid or missing token' };
      }
      protectedPaths.push(`${method.toUpperCase()} ${path}`);
    }
  }
}
console.log(`Added 401 to ${protectedPaths.length} protected endpoints`);

// ── 7. Add Accept-Language header to localized endpoints ──────────────────
const localizedEndpoints = [
  { path: '/products', methods: ['get'] },
  { path: '/products/{id}', methods: ['get'] },
  { path: '/search', methods: ['get'] },
  { path: '/categories', methods: ['get'] }
];

for (const { path: epPath, methods } of localizedEndpoints) {
  const pathSpec = swagger.paths[epPath];
  if (!pathSpec) continue;
  for (const method of methods) {
    const spec = pathSpec[method];
    if (!spec) continue;
    if (!spec.parameters) spec.parameters = [];
    const hasLang = spec.parameters.some(p => p.name === 'Accept-Language');
    if (!hasLang) {
      spec.parameters.unshift({
        name: 'Accept-Language',
        in: 'header',
        description: 'Language locale (e.g., en, ar)',
        schema: { type: 'string', example: 'en' }
      });
    }
  }
}

// ── 8. Standardize delete response codes ──────────────────────────────────
const deletePaths = [
  { path: '/tags/{id}', method: 'delete', changeTo: '204' },
  { path: '/notifications/{id}', method: 'delete', changeTo: '204' }
];

for (const { path: dPath, method } of deletePaths) {
  const pathSpec = swagger.paths[dPath];
  if (!pathSpec || !pathSpec[method]) continue;
  const responses = pathSpec[method].responses;
  if (responses['200'] && !responses['204']) {
    responses['204'] = { description: 'Successfully deleted' };
    delete responses['200'];
  }
}

// ── 9. Add descriptions to all tags ───────────────────────────────────────
const tagDescriptions = {
  'Authentication': 'User registration, login, password management',
  'Products': 'Product catalog browsing and management',
  'Cart': 'Shopping cart operations',
  'Orders': 'Order management and tracking',
  'Users': 'User profile management',
  'Checkout': 'Cart validation and order creation',
  'Wishlist': 'User wishlist management',
  'Notifications': 'User notification management',
  'Reviews': 'Product reviews and ratings',
  'Search': 'Product and catalog search',
  'Coupons': 'Coupon and discount management',
  'Tags': 'Product tag management',
  'Returns': 'Order returns and refunds',
  'Newsletter': 'Newsletter subscription and campaigns',
  'Health': 'API health checks',
  'Admin - Dashboard': 'Admin dashboard statistics and overview',
  'Admin Staff': 'Admin staff member management',
  'Admin Analytics': 'Admin analytics and reporting'
};

if (!swagger.tags) swagger.tags = [];

for (const [name, description] of Object.entries(tagDescriptions)) {
  const idx = swagger.tags.findIndex(t => t.name === name);
  if (idx >= 0) {
    swagger.tags[idx].description = description;
  } else {
    swagger.tags.push({ name, description });
  }
}

// ── 10. Normalize admin tag naming ────────────────────────────────────────
// Rename "Admin Staff" → "Admin - Staff" and "Admin Analytics" → "Admin - Analytics"
const tagRenames = {
  'Admin Staff': 'Admin - Staff',
  'Admin Analytics': 'Admin - Analytics'
};

for (const [oldName, newName] of Object.entries(tagRenames)) {
  const tagIdx = swagger.tags.findIndex(t => t.name === oldName);
  if (tagIdx >= 0) swagger.tags[tagIdx].name = newName;

  for (const pathSpec of Object.values(swagger.paths)) {
    for (const spec of Object.values(pathSpec)) {
      if (spec.tags) {
        const idx = spec.tags.indexOf(oldName);
        if (idx >= 0) spec.tags[idx] = newName;
      }
    }
  }
}

// ── 11. Add 400 Bad Request to mutation endpoints ─────────────────────────
const mutationEndpoints = [
  { path: '/users/me', method: 'patch' },
  { path: '/reviews/{id}', method: 'patch' },
  { path: '/admin/staff/{id}', method: 'patch' },
  { path: '/checkout/create-order', method: 'post' }
];

for (const { path: mPath, method } of mutationEndpoints) {
  const pathSpec = swagger.paths[mPath];
  if (!pathSpec || !pathSpec[method]) continue;
  if (!pathSpec[method].responses['400']) {
    pathSpec[method].responses['400'] = { description: 'Bad request - invalid input data' };
  }
}

// ── 12. Add 429 to auth endpoints ─────────────────────────────────────────
const authEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password'];
for (const ep of authEndpoints) {
  const pathSpec = swagger.paths[ep];
  if (!pathSpec || !pathSpec.post) continue;
  if (!pathSpec.post.responses['429']) {
    pathSpec.post.responses['429'] = { description: 'Too many requests - rate limit exceeded' };
  }
}

// ── 13. Add 403 to resource-specific endpoints ────────────────────────────
const resourceEndpoints = [
  { path: '/orders/{id}', method: 'get' },
  { path: '/returns/{id}', method: 'get' },
  { path: '/reviews/{id}', method: 'patch' }
];

for (const { path: rPath, method } of resourceEndpoints) {
  const pathSpec = swagger.paths[rPath];
  if (!pathSpec || !pathSpec[method]) continue;
  if (!pathSpec[method].responses['403']) {
    pathSpec[method].responses['403'] = { description: 'Forbidden - access to resource denied' };
  }
}

// ── 14. Document sortBy/sortOrder strategy ────────────────────────────────
// Add sortOrder parameter to /products and /search if sortBy exists
const sortEndpoints = ['/products', '/search'];
for (const ep of sortEndpoints) {
  const pathSpec = swagger.paths[ep];
  if (!pathSpec || !pathSpec.get || !pathSpec.get.parameters) continue;
  const hasSortBy = pathSpec.get.parameters.some(p => p.name === 'sortBy');
  const hasSortOrder = pathSpec.get.parameters.some(p => p.name === 'sortOrder');
  if (hasSortBy && !hasSortOrder) {
    pathSpec.get.parameters.push({
      name: 'sortOrder',
      in: 'query',
      description: 'Sort direction',
      schema: { type: 'string', enum: ['asc', 'desc'], example: 'asc' }
    });
  }
}

// ── 15. Link response schemas to core endpoints ───────────────────────────
const responseLinks = [
  { path: '/products', method: 'get', schema: '#/components/schemas/ProductListResponse' },
  { path: '/products/{id}', method: 'get', schema: '#/components/schemas/Product' },
  { path: '/users/me', method: 'get', schema: '#/components/schemas/User' },
  { path: '/orders', method: 'get', schema: '#/components/schemas/PaginatedResponse' },
  { path: '/orders/{id}', method: 'get', schema: '#/components/schemas/Order' },
  { path: '/cart', method: 'get', schema: '#/components/schemas/Cart' },
  { path: '/wishlist', method: 'get', schema: '#/components/schemas/PaginatedResponse' },
  { path: '/auth/login', method: 'post', schema: '#/components/schemas/User' }
];

for (const { path: rPath, method, schema } of responseLinks) {
  const pathSpec = swagger.paths[rPath];
  if (!pathSpec || !pathSpec[method]) continue;
  const successCode = method === 'post' ? '201' : '200';
  const altCode = '200';
  const targetCode = pathSpec[method].responses[successCode] ? successCode : altCode;
  if (pathSpec[method].responses[targetCode]) {
    pathSpec[method].responses[targetCode].content = {
      'application/json': { schema: { $ref: schema } }
    };
  }
}

// ── 16. Add requestBody links for missing DTOs ────────────────────────────
const requestBodyLinks = [
  { path: '/orders/{id}/status', method: 'patch', schema: '#/components/schemas/UpdateOrderStatusDto' },
  { path: '/checkout/apply-coupon', method: 'post', schema: '#/components/schemas/ApplyCouponDto' },
  { path: '/newsletter/unsubscribe', method: 'post', schema: '#/components/schemas/UnsubscribeDto' }
];

for (const { path: rPath, method, schema } of requestBodyLinks) {
  const pathSpec = swagger.paths[rPath];
  if (!pathSpec || !pathSpec[method]) continue;
  pathSpec[method].requestBody = {
    required: true,
    content: {
      'application/json': { schema: { $ref: schema } }
    }
  };
}

// ── Write back ────────────────────────────────────────────────────────────
fs.writeFileSync(swaggerPath, JSON.stringify(swagger, null, 2) + '\n');
console.log('swagger.json updated successfully');
