---
description: Create a new composable
agent: build
---

Create a new composable named $ARGUMENTS following project patterns.

Composable conventions:

- File naming: useXxx.ts (PascalCase with "use" prefix)
- Place in app/composables/ (or app/composables/admin/ for admin-specific)
- Use <script setup lang="ts"> compatible patterns
- Use useApiClient() from app/utils/api.ts for authenticated API calls
- Use useToasts() for error/success messages with i18n
- Return reactive state with ref() or reactive()
- Return methods as plain functions

Common patterns to follow:

- Loading state: const loading = ref(false)
- Error handling: try/catch with useToasts().showError()
- API calls: const apiClient = useApiClient()
- Check app/types/api.ts and app/types/auth.ts before introducing new response shapes

Before creating a new composable, check if an existing one can be extended:
useAuth, useProducts, useCart, useOrders, useAddresses, useWishlist, useReviews, useNotifications, useSearch, useCategories, useBrands, useTags, useCoupons, useCurrencies, usePoints, useShipping, useReturns, useNewsletter, useInvoices, useCurrency, useToasts, useValidation

Add translations to both locales/en.json and locales/ar.json for any user-facing messages.
