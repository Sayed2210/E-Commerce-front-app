import type { Page } from '@playwright/test'

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    await this.page.goto(path)
  }

  async waitForToast(message: string) {
    await this.page.getByRole('alert').filter({ hasText: message }).waitFor()
  }

  get navbar() {
    return this.page.getByRole('navigation')
  }

  get mainContent() {
    return this.page.locator('main')
  }
}
