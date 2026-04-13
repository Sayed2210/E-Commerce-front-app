import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'

test.describe('Auth flow', () => {
  test('unauthenticated user is redirected to login from /admin', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('login page renders form with email and password fields', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigate('/login')

    await expect(loginPage.form).toBeVisible()
    await expect(loginPage.emailInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.submitButton).toBeVisible()
  })

  test('empty submission keeps user on login', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigate('/login')
    await loginPage.submitButton.click()

    await expect(page).toHaveURL(/\/login/)
  })

  test('wrong credentials show error or stay on login', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.login('bad@example.com', 'wrongpassword')

    // Should stay on login or show error — not redirect to /admin
    const url = page.url()
    const hasError = await loginPage.errorAlert.isVisible().catch(() => false)
    expect(url.includes('/login') || hasError).toBeTruthy()
  })

  test('login page is accessible with keyboard navigation', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigate('/login')

    await loginPage.emailInput.focus()
    await page.keyboard.press('Tab')
    await expect(loginPage.passwordInput).toBeFocused()
  })
})
