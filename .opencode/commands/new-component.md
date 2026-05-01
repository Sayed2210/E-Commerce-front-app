---
description: Create a new Vue component
agent: build
---

Create a new Vue component named $ARGUMENTS following project conventions.

Component naming rules:

- Every .vue filename under app/components/ must be globally unique (pathPrefix: false in nuxt.config.ts)
- Use PascalCase for component filenames
- Place in the appropriate subfolder: base/ (primitives), shared/ (reusable), or feature-specific folder

Component structure:

- Use <script setup lang="ts">
- Define props with TypeScript interfaces
- Use useI18n() for any user-facing strings
- Include loading, empty, and error states where applicable
- Add SCSS file alongside if component-specific styles are needed

Available base components to reuse: AppButton, AppInput, StarRating
Available shared components: AppBreadcrumb, AppEmptyState, AppTabBar, ProductCard, SectionHeader, CurrencySwitcher, LangSwitcher, NotificationBell

Create the component file and any associated SCSS file. Add translations to both locales/en.json and locales/ar.json if the component has user-facing text.
