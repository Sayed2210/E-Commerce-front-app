// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettierConfig from 'eslint-config-prettier'

export default withNuxt(
  prettierConfig,

  // ── Vue 3 component standards ──────────────────────────────────────────────
  {
    files: ['**/*.vue'],
    rules: {
      // Block order: script → template → style
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],

      // Naming
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'kebab-case'],

      // Size limits
      'vue/max-lines-per-block': ['warn', { script: 100, template: 80, style: 60 }],
      'vue/max-props': ['warn', { maxProps: 7 }],
      'vue/max-template-depth': ['warn', { maxDepth: 5 }],
      'vue/max-attributes-per-line': [
        'warn',
        {
          singleline: { max: 3 },
          multiline: { max: 1 },
        },
      ],

      // Props & emits
      'vue/require-default-prop': 'off', // withDefaults handles this
      'vue/no-unused-vars': 'error',
      'vue/no-unused-components': 'error',
      'vue/no-undef-components': 'off', // Nuxt auto-imports

      // Reactivity safety
      'vue/no-setup-props-reactivity-loss': 'error', // prevents reactivity loss

      // Accessibility
      'vue/html-button-has-type': 'error',
    },
  },

  // ── TypeScript strictness ──────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // ── Composable size limit ──────────────────────────────────────────────────
  {
    files: ['app/composables/**/*.ts'],
    rules: {
      'max-lines': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
    },
  }
)
