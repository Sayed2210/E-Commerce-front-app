Review the staged or specified Vue 3 components and TypeScript files against these 5 pillars:

## 1. Structure

- Block order must be: `<script setup>` → `<template>` → `<style scoped>`
- Max 200 lines per component (excluding blanks/comments)
- Max 80 lines per block (script: 100, template: 80, style: 60)
- PascalCase component names, kebab-case event names

## 2. Props & Emits

- TypeScript generics only (`defineProps<{}>()`) — no `PropType` casting
- Use `withDefaults` for optional props
- Typed emits: `defineEmits<{ 'event-name': [payload: Type] }>()`
- Max 7 props per component — split if exceeded

## 3. Reactivity

- Primitives → `ref`, objects → `reactive`
- Never destructure a `reactive()` object directly (reactivity loss)
- No side effects in `computed()` — pure derivations only
- `v-for` keys must use a real unique ID, never `index`

## 4. Performance

- Lazy load heavy components with `defineAsyncComponent`
- Use `v-once` for static heavy content
- `v-memo` for expensive list renders with stable keys
- No unnecessary watchers — prefer `computed`

## 5. Accessibility

- All `<button>` must have explicit `type` attribute
- Interactive elements need `aria-label` if no visible text
- Form inputs need associated `<label>` (via `for`/`id` or wrapping)
- `aria-invalid`, `aria-describedby` on validated inputs

## Design System Consistency

- All colors must use CSS custom properties from `app/styles/main.css` tokens
- No hardcoded hex values (`#xxx`) in `<style scoped>` blocks
- Spacing must use Tailwind classes tied to the token system
- Fonts must reference `font-headline` or `font-body` — no raw `font-family` overrides

## Output format

For each issue found, provide:

- **File** and **line number**
- **Pillar** (Structure / Props / Reactivity / Performance / A11y / Design System)
- **What's wrong** (one sentence)
- **Suggested fix** with code example

End with a summary: ✅ pass / ⚠️ warnings / ❌ blockers
