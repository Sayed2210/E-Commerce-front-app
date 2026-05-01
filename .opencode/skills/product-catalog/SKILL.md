---
name: product-catalog
description: Work on product listing, product detail, filtering, search, reviews, categories, brands, and wishlist in this Nuxt e-commerce frontend.
compatibility: opencode
metadata:
  app: ecommerce-front-app
  area: catalog
---

## When To Use

Use this skill for product pages, product listing, product detail, search, filters, reviews, categories, brands, and related catalog features.

## Catalog Structure

- Products listing: `app/pages/products/index.vue`.
- Product detail: `app/pages/products/[id].vue`.
- Product components: `app/components/features/products/` (ProductsFilters, ProductsPagination, ProductsResultsBar).
- Product card: `app/components/shared/ProductCard.vue`.
- Product skeleton: `app/components/shared/ProductSkeleton.vue`.
- Star rating: `app/components/base/StarRating.vue`.
- Home featured products: `app/components/features/home/HomeFeaturedProducts.vue`.

## Key Composables

| Composable          | Purpose                                                                    |
| ------------------- | -------------------------------------------------------------------------- |
| `useProducts`       | List products with reactive query params, get/create/update/delete product |
| `useProductFilters` | Reactive filter state: category, brand, price, sort, pagination            |
| `useProductImages`  | Upload/delete/set primary product images                                   |
| `useReviews`        | Product reviews CRUD with ratings                                          |
| `useSearch`         | Search products by query                                                   |
| `useCategories`     | List categories, category icon by slug                                     |
| `useBrands`         | List/get/create/update/delete brands                                       |
| `useWishlist`       | Wishlist CRUD operations                                                   |

## API Endpoints

| Composable         | Endpoints                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `useProducts`      | `GET /products`, `GET /products/:id`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`              |
| `useProductImages` | `POST /products/:id/images`, `DELETE /products/:id/images/:imageId`, `PATCH /products/:id/images/:imageId/primary` |
| `useReviews`       | `GET /reviews/product/:productId`, `POST /reviews`, `PATCH /reviews/:id`, `DELETE /reviews/:id`                    |
| `useSearch`        | `GET /search?q=...`                                                                                                |
| `useCategories`    | `GET /categories`                                                                                                  |
| `useBrands`        | `GET /brands`, `GET /brands/:id`, `POST /brands`, `PATCH /brands/:id`, `DELETE /brands/:id`                        |

## Implementation Rules

- Use `useProducts()` for product data fetching; it handles reactive query params.
- Use `useProductFilters()` for filter state management on listing page.
- Use `useSearch()` for search functionality.
- Product cards use `ProductCard` shared component; preserve its layout.
- Reviews use `StarRating` base component for rating display and input.
- Use `useCurrency()` for price formatting and conversion.
- Preserve pagination, loading skeleton, and empty state patterns.
- For image handling, use `@nuxt/image` module for optimization.

## Verification

- Products changes: run `npx vitest tests/composables/useProducts.test.ts`.
- Reviews changes: run `npx vitest tests/composables/useReviews.test.ts`.
- Run `npm run lint` for component or composable changes.
- For E2E: run `npm run test:e2e -- tests/e2e/full-journey.spec.ts`.
