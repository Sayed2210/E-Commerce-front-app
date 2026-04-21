// import type { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class WishlistPage extends BasePage {
  // constructor(page: Page) {
  //   super(page)
  // }

  get title() {
    return this.page.getByRole('heading', { name: /my wishlist/i })
  }
  get itemCount() {
    return this.page.locator('.wishlist-page__count')
  }
  get clearAllButton() {
    return this.page.getByRole('button', { name: /clear all/i })
  }
  get wishlistGrid() {
    return this.page.locator('ul[role="list"]')
  }
  get wishlistItems() {
    return this.page.locator('ul[role="list"] li')
  }
  get emptyState() {
    return this.page
      .locator('.wishlist-page__empty, [role="status"]')
      .filter({ hasText: /empty|no.*saved/i })
  }
  get exploreProductsLink() {
    return this.page.getByRole('link', { name: /explore products/i })
  }

  async navigate() {
    await this.page.goto('/wishlist')
    await this.page.waitForLoadState('networkidle')
  }

  async addToCartFromWishlist(index = 0) {
    const cards = this.page.locator('ul[role="list"] li')
    await cards
      .nth(index)
      .getByRole('button', { name: /add to cart/i })
      .click()
  }

  async removeItem(index = 0) {
    // Wishlist items use the favorite button to toggle (remove when wishlisted)
    const cards = this.page.locator('ul[role="list"] li')
    await cards
      .nth(index)
      .locator('button')
      .filter({
        has: this.page.locator('.material-symbols-outlined'),
      })
      .first()
      .click()
  }
}
