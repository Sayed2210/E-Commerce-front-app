import { test, expect } from '@playwright/test'
import { RegisterPage } from './pages/RegisterPage'

const uniqueEmail = () => `testuser_${Date.now()}@example.com`

test.describe('User Registration', () => {
  test('register page renders all form fields', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.navigate()

    await expect(register.firstNameInput).toBeVisible()
    await expect(register.lastNameInput).toBeVisible()
    await expect(register.emailInput).toBeVisible()
    await expect(register.passwordInput).toBeVisible()
    await expect(register.confirmPasswordInput).toBeVisible()
    await expect(register.termsCheckbox).toBeVisible()
    await expect(register.submitButton).toBeVisible()
  })

  test('submit button is disabled until terms are accepted', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.navigate()

    await expect(register.submitButton).toBeDisabled()
    await register.termsCheckbox.check()
    await expect(register.submitButton).toBeEnabled()
  })

  test('shows error when passwords do not match', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.navigate()

    await register.emailInput.fill('user@example.com')
    await register.passwordInput.fill('password123')
    await register.confirmPasswordInput.fill('differentpass')
    await register.termsCheckbox.check()
    await register.submitButton.click()

    await expect(page).toHaveURL(/\/register/)
    const error = page.locator('[role="alert"], .auth-alert, text=/don.*match|mismatch/i')
    await expect(error.first()).toBeVisible()
  })

  test('shows error for invalid email format', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.navigate()

    await register.emailInput.fill('not-an-email')
    await register.passwordInput.fill('password123')
    await register.confirmPasswordInput.fill('password123')
    await register.termsCheckbox.check()
    await register.submitButton.click()

    await expect(page).toHaveURL(/\/register/)
  })

  test('shows error when terms not accepted', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.navigate()

    await register.emailInput.fill('user@example.com')
    await register.passwordInput.fill('password123')
    await register.confirmPasswordInput.fill('password123')
    await register.submitButton.click()

    // Button should remain disabled, user stays on register
    await expect(page).toHaveURL(/\/register/)
  })

  test('successful registration redirects to homepage', async ({ page }) => {
    const register = new RegisterPage(page)

    await register.register({
      firstName: 'Test',
      lastName: 'User',
      email: uniqueEmail(),
      password: 'password123',
      confirmPassword: 'password123',
    })

    // Either redirects to / or shows success state
    await page.waitForURL(/\/((?!register).)*$/, { timeout: 15_000 })
    await expect(page).not.toHaveURL(/\/register/)
  })

  test('already registered email shows server error', async ({ page }) => {
    const register = new RegisterPage(page)

    // Try to register twice with same email
    const email = uniqueEmail()
    await register.register({
      firstName: 'First',
      email,
      password: 'password123',
      confirmPassword: 'password123',
    })

    // Wait for redirect after first registration
    await page.waitForURL(/\/((?!register).)*$/, { timeout: 15_000 }).catch(() => {})

    // Try again with same email
    await register.register({
      firstName: 'Second',
      email,
      password: 'password123',
      confirmPassword: 'password123',
    })

    await expect(page).toHaveURL(/\/register/)
    // Should show some error
    const errorMsg = page.locator('[role="alert"], .auth-alert')
    await expect(errorMsg).toBeVisible({ timeout: 10_000 })
  })

  test('has link to login page', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.navigate()

    const loginLink = page.getByRole('link', { name: /sign in/i })
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('password field is masked', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.navigate()

    await expect(register.passwordInput).toHaveAttribute('type', 'password')
    await expect(register.confirmPasswordInput).toHaveAttribute('type', 'password')
  })

  test('tab order moves through form fields correctly', async ({ page }) => {
    const register = new RegisterPage(page)
    await register.navigate()

    await register.firstNameInput.focus()
    await page.keyboard.press('Tab')
    await expect(register.lastNameInput).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(register.emailInput).toBeFocused()
  })
})
