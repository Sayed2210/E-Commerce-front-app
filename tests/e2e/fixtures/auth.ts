import type { Page } from '@playwright/test'
import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

type AuthFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await loginPage.login(
      process.env.TEST_EMAIL ?? 'admin@example.com',
      process.env.TEST_PASSWORD ?? 'password123'
    )
    await page.waitForURL(/\/(admin|$)/, { timeout: 10_000 })
    await use(page)
  },
})

export { expect }
