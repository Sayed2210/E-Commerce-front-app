---
description: Create a new page
agent: build
---

Create a new page named $ARGUMENTS following Nuxt 4 file-based routing conventions.

Page structure:

- Place in the appropriate location under app/pages/
- Use <script setup lang="ts">
- Apply the correct layout: default.vue (customer) or admin.vue (admin)
- Apply route middleware if needed: auth.ts, admin.ts, guest.ts, or user.ts
- Use existing composables for data fetching instead of direct API calls
- Use useToasts() for user-facing messages
- Use useI18n() for all user-facing strings

Page conventions:

- index.vue for list/index routes
- [id].vue for dynamic routes
- Use definePageMeta() for layout and middleware configuration

Add translations to both locales/en.json and locales/ar.json for all user-facing text.

Consider if a new composable is needed for data fetching, or if an existing one can be extended.
