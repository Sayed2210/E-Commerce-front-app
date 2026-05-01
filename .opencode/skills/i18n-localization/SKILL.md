---
name: i18n-localization
description: Work on internationalization, English/Arabic translations, RTL support, locale switching, and i18n patterns in this Nuxt e-commerce frontend.
compatibility: opencode
metadata:
  app: ecommerce-front-app
  area: i18n
---

## When To Use

Use this skill for adding translations, fixing i18n issues, RTL layout adjustments, locale detection, or working with the i18n configuration.

## i18n Structure

- Locale files: `locales/en.json` (English), `locales/ar.json` (Arabic).
- i18n config in `nuxt.config.ts` using `@nuxtjs/i18n` module.
- Strategy: `no_prefix` (no locale prefix in URLs).
- Locale detection: browser language with cookie persistence.
- Lazy loading enabled for locale files.

## Usage Patterns

- Use `useI18n()` composable in components: `const { t } = useI18n()`.
- Translation keys follow nested structure: `auth.login.title`, `products.filters.price`, etc.
- RTL support: Arabic locale triggers RTL direction via `dir="rtl"` on html element.
- Currency switcher and language switcher are in `app/components/shared/`.

## Implementation Rules

- Always add translations to BOTH `locales/en.json` and `locales/ar.json`.
- Use `t('key')` in templates, never hardcode strings in UI components.
- For dynamic values, use interpolation: `t('cart.items.count', { count: 5 })`.
- Check RTL layout when adding new UI — test with Arabic locale.
- Use existing translation key patterns; do not invent new naming conventions.
- Locale cookie name is managed by `@nuxtjs/i18n`; do not manually override.
- For SCSS/CSS RTL adjustments, use Tailwind's RTL variants or `[dir="rtl"]` selectors.

## Verification

- After translation changes, verify both locales render correctly.
- Run `npm run lint` to catch any JSON syntax issues in locale files.
- Test RTL layout by switching to Arabic locale in the UI.
- Run `npm run build` to ensure i18n module compiles correctly.
