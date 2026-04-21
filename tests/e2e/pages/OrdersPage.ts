// import type { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class OrdersPage extends BasePage {
  // constructor(page: Page) {
  //   super(page)
  // }

  get orderCards() {
    return this.page.locator('article.order-card')
  }
  get emptyState() {
    return this.page.locator('text=/no orders/i')
  }
  get viewDetailsLinks() {
    return this.page.getByRole('link', { name: /view details/i })
  }
  get requestReturnButtons() {
    return this.page.getByRole('button', { name: /request return/i })
  }
  get statusBadges() {
    return this.page.locator('.order-card__badge')
  }

  // Order detail page elements
  get returnModal() {
    return this.page.locator('.return-modal-overlay, [role="dialog"]')
  }
  get returnReasonSelect() {
    return this.page.locator('#return-reason')
  }
  get returnNotesInput() {
    return this.page.locator('#return-notes')
  }
  get submitReturnButton() {
    return this.page.getByRole('button', { name: /submit.*request|submit return/i })
  }
  get cancelReturnButton() {
    return this.page.getByRole('button', { name: /cancel/i })
  }

  async navigate() {
    await this.page.goto('/orders')
    await this.page.waitForLoadState('networkidle')
  }

  async viewFirstOrder() {
    await this.viewDetailsLinks.first().click()
    await this.page.waitForURL(/\/orders\/\w+/)
    await this.page.waitForLoadState('networkidle')
  }

  async openReturnModal() {
    await this.requestReturnButtons.first().click()
  }

  async submitReturn(reason = 'changed_mind', notes = '') {
    await this.openReturnModal()
    await this.returnReasonSelect.selectOption(reason)
    if (notes) await this.returnNotesInput.fill(notes)
    await this.submitReturnButton.click()
  }
}
