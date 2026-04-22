// import type { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class CartPage extends BasePage {
  // constructor(page: Page) {
  //   super(page)
  // }

  get cartItems() {
    return this.page.locator('ul[role="list"] li, .cart-section__list li')
  }
  get checkoutButton() {
    return this.page
      .getByRole('button', { name: /checkout|proceed/i })
      .or(this.page.getByRole('link', { name: /checkout|proceed/i }))
      .first()
  }
  get emptyState() {
    return this.page.locator('[role="status"]').filter({ hasText: /empty|no items/i })
  }
  get continueShoppingLink() {
    return this.page.getByRole('link', { name: /continue shopping/i })
  }
  get subtotal() {
    return this.page.locator('text=/Subtotal/').first()
  }

  async navigate() {
    await this.page.goto('/cart')
  }

  async proceedToCheckout() {
    await this.checkoutButton.click()
    await this.page.waitForURL(/\/checkout/)
  }
}
