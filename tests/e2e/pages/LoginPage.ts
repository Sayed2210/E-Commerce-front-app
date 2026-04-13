import type { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  get emailInput() {
    return this.page.locator('input[type="email"], input[name="email"]')
  }
  get passwordInput() {
    return this.page.locator('input[type="password"]')
  }
  get submitButton() {
    return this.page.getByRole('button', { name: /sign in|login|تسجيل/i })
  }
  get errorAlert() {
    return this.page.getByRole('alert')
  }
  get form() {
    return this.page.locator('form')
  }

  async login(email: string, password: string) {
    await this.navigate('/login')
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
}

// Re-export type for external use
export type { Page }
