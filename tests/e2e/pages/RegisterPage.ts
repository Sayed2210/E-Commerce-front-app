// import type { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class RegisterPage extends BasePage {
  // constructor(page: Page) {
  //   super(page)
  // }

  get firstNameInput() {
    return this.page.locator('#reg-first')
  }
  get lastNameInput() {
    return this.page.locator('#reg-last')
  }
  get emailInput() {
    return this.page.locator('#reg-email')
  }
  get passwordInput() {
    return this.page.locator('#reg-password')
  }
  get confirmPasswordInput() {
    return this.page.locator('#reg-confirm')
  }
  get termsCheckbox() {
    return this.page.locator('input[type="checkbox"][aria-required="true"]')
  }
  get submitButton() {
    return this.page.getByRole('button', { name: /create account/i })
  }
  get errorAlert() {
    return this.page.getByRole('alert')
  }
  get form() {
    return this.page.locator('form[aria-label="Create account form"]')
  }

  async navigate() {
    await this.page.goto('/register')
  }

  async register(data: {
    firstName?: string
    lastName?: string
    email: string
    password: string
    confirmPassword: string
  }) {
    await this.navigate()
    if (data.firstName) await this.firstNameInput.fill(data.firstName)
    if (data.lastName) await this.lastNameInput.fill(data.lastName)
    await this.emailInput.fill(data.email)
    await this.passwordInput.fill(data.password)
    await this.confirmPasswordInput.fill(data.confirmPassword)
    await this.termsCheckbox.check()
    await this.submitButton.click()
  }
}
