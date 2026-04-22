// import type { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class ProductDetailPage extends BasePage {
  get productTitle() {
    return this.page.getByRole('heading', { level: 1 })
  }
  get price() {
    return this.page.locator('text=/\\$[0-9]+/').first()
  }
  get addToCartButton() {
    return this.page
      .getByRole('button', { name: /add to cart/i })
      .or(this.page.getByTitle('Add to cart'))
      .first()
  }
  get buyNowButton() {
    return this.page.getByRole('button', { name: /buy now/i })
  }
  get wishlistButton() {
    return this.page
      .locator('button')
      .filter({ has: this.page.locator('.material-symbols-outlined:text("favorite")') })
      .first()
  }
  get quantityIncrease() {
    return this.page.getByRole('button', { name: /\+|increase|add/i }).first()
  }
  get quantityDecrease() {
    return this.page.getByRole('button', { name: /−|decrease|remove/i }).first()
  }
  get writeReviewButton() {
    return this.page.getByRole('button', { name: /write a review/i })
  }
  get reviewTitleInput() {
    return this.page
      .locator('input[placeholder*="title" i], input[placeholder*="Review title" i]')
      .first()
  }
  get reviewCommentInput() {
    return this.page.locator('textarea').first()
  }
  get submitReviewButton() {
    return this.page.getByRole('button', { name: /^submit$/i })
  }

  async navigate(id: string) {
    await this.page.goto(`/products/${id}`)
  }

  async addToCart() {
    await this.addToCartButton.click()
  }

  async addToWishlist() {
    await this.wishlistButton.click()
  }
}
