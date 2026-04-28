# Frontend API Fix Plan

> Plan for the Nuxt frontend team to fix API integration issues, Swagger documentation gaps, and frontend-side contract alignment.

---

## P0 — Critical (Blocks API Usage / Swagger UI Broken)

### 1. Fix Security Scheme Name in `swagger.json`

- **File:** `swagger.json`
- **Action:** Rename `JWT-AUTH` → `bearer` in `components.securitySchemes`
- **Why:** Swagger UI "Authorize" button does not attach tokens because scheme name `bearer` is referenced by endpoints but defined as `JWT-AUTH`
- **Owner:** Frontend (since swagger.json lives in this repo)

### 2. Add Response Schemas for Core Frontend Consumption

- **Files:** `swagger.json` + shared TypeScript types
- **Actions:**
  - Define `Product`, `ProductListResponse`, `Category`, `Brand`, `User`, `Order`, `Cart`, `WishlistItem`, `Review`, `Notification` schemas
  - Link `GET /products`, `GET /products/{id}`, `GET /users/me`, `GET /orders`, `GET /cart`, `POST /auth/login` to those schemas
- **Why:** Frontend devs currently have no typed contract for API responses
- **Owner:** Frontend (can define expected shapes and push to backend for confirmation)

### 3. Define `PaginatedResponse<T>` Wrapper

- **Files:** `swagger.json` + `app/types/` (create if missing)
- **Action:** Create generic wrapper:
  ```json
  {
    "data": [],
    "meta": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
  }
  ```
  Apply to all list endpoints: `/products`, `/users`, `/orders`, `/notifications`, `/reviews/product/{productId}`, `/returns`, `/admin/staff`, etc.
- **Owner:** Frontend

---

## P1 — High (Causes Runtime Bugs or Confusing UX)

### 4. Document `Accept-Language` Header on Localized Endpoints

- **Files:** `swagger.json`
- **Endpoints:** `GET /products`, `GET /products/{id}`, `GET /search`, `GET /categories` (if added)
- **Action:** Add header parameter:
  ```json
  {
    "name": "Accept-Language",
    "in": "header",
    "schema": { "type": "string", "example": "en" }
  }
  ```
- **Why:** Frontend sends this for Arabic/English toggle; must be in contract
- **Owner:** Frontend

### 5. Add `401 Unauthorized` to All Protected Endpoints

- **Files:** `swagger.json`
- **Endpoints:** All with `security: [{ bearer: [] }]`
- **Why:** Frontend auth middleware (`app/middleware/auth.ts`) needs to know when to redirect to login
- **Owner:** Frontend

### 6. Fix `TranslatableString` Schema

- **Files:** `swagger.json`
- **Action:** Replace empty object with:
  ```json
  {
    "type": "object",
    "properties": {
      "en": { "type": "string" },
      "ar": { "type": "string" }
    },
    "additionalProperties": { "type": "string" }
  }
  ```
- **Why:** `name`, `description`, `categoryName`, `brandName` all use this type
- **Owner:** Frontend

### 7. Add Missing Request Body Schemas

- **Files:** `swagger.json`
- **Endpoints:**
  - `PATCH /orders/{id}/status` → add `UpdateOrderStatusDto` (`status` enum)
  - `POST /checkout/apply-coupon` → add `ApplyCouponDto` (`code: string`)
  - `POST /newsletter/unsubscribe` → add `UnsubscribeDto` (`email: string`)
- **Owner:** Frontend (propose shapes based on UI forms)

### 8. Fix `UpdateReviewDto` Empty Schema

- **Files:** `swagger.json`
- **Action:** Define fields: `rating`, `title`, `comment`, `images`
- **Owner:** Frontend

---

## P2 — Medium (Clean-Up & Consistency)

### 9. Consolidate Duplicate Wishlist Endpoints

- **Files:** `swagger.json` + `app/composables/useWishlist.ts`
- **Action:** Remove `GET /users/me/wishlist` from spec; keep only `GET /wishlist`. Update `useWishlist.ts` to use `/wishlist`.
- **Owner:** Frontend

### 10. Standardize Delete Response Codes

- **Files:** `swagger.json`
- **Action:** Change `DELETE /tags/{id}` and `DELETE /notifications/{id}` responses from `200` → `204` to match `/products`, `/users`, `/cart/items/{id}`, `/wishlist/{productId}`
- **Owner:** Frontend (document expected contract)

### 11. Add Descriptions to All Tags

- **Files:** `swagger.json`
- **Tags Missing Descriptions:**
  - `Wishlist`, `Notifications`, `Reviews`, `Search`
  - `Admin - Dashboard`, `Admin Staff`, `Admin Analytics`
  - `Returns`, `Newsletter`, `Health`, `Tags`, `Coupons`, `Checkout`
- **Owner:** Frontend

### 12. Normalize Admin Tag Naming

- **Files:** `swagger.json`
- **Action:** Pick one convention:
  - Option A: `Admin - Dashboard`, `Admin - Staff`, `Admin - Analytics`
  - Option B: `AdminDashboard`, `AdminStaff`, `AdminAnalytics`
- **Owner:** Frontend

### 13. Document `sortBy` / `sortOrder` Strategy

- **Files:** `swagger.json`
- **Action:** Decide if direction is embedded (`price_asc`) or separate (`sortBy=price&sortOrder=asc`). Update both `/products` and `/search` params accordingly.
- **Owner:** Frontend

### 14. Add `400 Bad Request` to Mutation Endpoints

- **Files:** `swagger.json`
- **Endpoints:** `PATCH /users/me`, `PATCH /reviews/{id}`, `PATCH /admin/staff/{id}`, `POST /checkout/create-order`
- **Owner:** Frontend

---

## P3 — Low (Nice to Have / Future Proofing)

### 15. Add `429 Too Many Requests` to Auth Endpoints

- **Files:** `swagger.json`
- **Endpoints:** `POST /auth/login`, `POST /auth/register`, `POST /auth/forgot-password`
- **Why:** Frontend can show rate-limit messages if backend implements it
- **Owner:** Frontend

### 16. Add `403 Forbidden` to Resource-Specific Endpoints

- **Files:** `swagger.json`
- **Endpoints:** `GET /orders/{id}`, `GET /returns/{id}`, `PATCH /reviews/{id}`
- **Why:** Clarify when users try to access others' data
- **Owner:** Frontend

### 17. Create Frontend API Type Definitions

- **Files:** `app/types/api.ts` (new)
- **Action:** Export TypeScript interfaces for all request/response DTOs so composables (`useAuth.ts`, `useCart.ts`, `useOrders.ts`, etc.) are fully typed
- **Owner:** Frontend

### 18. Update `app/utils/api.ts` to Handle `401` Globally

- **File:** `app/utils/api.ts`
- **Action:** Ensure `navigateTo('/login')` happens consistently on `401`. Add optional callback hook for custom handling.
- **Owner:** Frontend

---

## Execution Order

```
Week 1
├── Fix P0 items (security scheme, core schemas, pagination wrapper)
└── Generate TypeScript types from corrected swagger.json

Week 2
├── Fix P1 items (Accept-Language, 401s, request bodies, translatable strings)
└── Update all composables to match finalized DTOs

Week 3
├── Fix P2 items (duplicate endpoints, delete codes, tag descriptions, naming)
└── Add missing `400` and `403` documentation

Week 4
├── Fix P3 items (429s, type definitions, api.ts enhancements)
└── Full QA pass against staging backend
```

---

## Definition of Done

- [ ] `swagger.json` passes Swagger Editor validation with **zero errors**
- [ ] Every endpoint has at least one success response with a defined schema
- [ ] Every protected endpoint documents `401` response
- [ ] All list endpoints return a `PaginatedResponse<T>` shape
- [ ] `app/utils/api.ts` handles `401` consistently and retries with refreshed token
- [ ] All frontend composables have typed request/response objects
- [ ] Swagger UI "Authorize" button successfully attaches tokens to requests
