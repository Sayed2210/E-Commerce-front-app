// import type { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class CheckoutPage extends BasePage {
  // constructor(page: Page) {
  //   super(page)
  // }

  // Address form
  get addAddressButton() {
    return this.page.getByRole('button', { name: /add new address/i })
  }
  get streetInput() {
    return this.page.locator('#addr-street')
  }
  get cityInput() {
    return this.page.locator('#addr-city')
  }
  get stateInput() {
    return this.page.locator('#addr-state')
  }
  get postalCodeInput() {
    return this.page.locator('#addr-zip')
  }
  get countryInput() {
    return this.page.locator('#addr-country')
  }
  get firstNameAddrInput() {
    return this.page.locator('#addr-first')
  }
  get lastNameAddrInput() {
    return this.page.locator('#addr-last')
  }
  get saveAddressButton() {
    return this.page.getByRole('button', { name: /save address/i })
  }

  // Payment
  get cashOnDeliveryRadio() {
    return this.page.locator('input[type="radio"][name="payment-method"][value="cash_on_delivery"]')
  }
  get stripeRadio() {
    return this.page.locator('input[type="radio"][name="payment-method"][value="stripe"]')
  }
  get cashOnDeliveryLabel() {
    return this.page.locator('.payment__card').filter({ hasText: /cash on delivery/i })
  }
  get creditCardLabel() {
    return this.page.locator('.payment__card').filter({ hasText: /credit.*debit.*card/i })
  }

  // Stripe card fields (inside Stripe iframe, if loaded)
  get stripeCardNumberFrame() {
    return this.page.frameLocator(
      'iframe[name*="card-number"], iframe[title*="Secure card number"]'
    )
  }
  get stripeCardNumberInput() {
    return this.stripeCardNumberFrame.locator(
      'input[name="cardnumber"], input[placeholder*="card" i]'
    )
  }

  // Coupon
  get couponInput() {
    return this.page.locator('#coupon-code, input[placeholder*="Enter code" i]')
  }
  get applyCouponButton() {
    return this.page.getByRole('button', { name: /^apply$/i })
  }

  // Order summary & place order
  get placeOrderButton() {
    return this.page.getByRole('button', { name: /place order/i })
  }
  get orderSummaryTitle() {
    return this.page.locator('text=Order Summary')
  }
  get subtotalRow() {
    return this.page.locator('dt:text("Subtotal")').first()
  }
  get totalRow() {
    return this.page.locator('.review-panel__row--total')
  }

  async navigate() {
    await this.page.goto('/checkout')
  }

  async fillNewAddress(data: {
    firstName?: string
    lastName?: string
    street: string
    city: string
    state?: string
    postalCode: string
    country: string
  }) {
    await this.addAddressButton.click()
    if (data.firstName) await this.firstNameAddrInput.fill(data.firstName)
    if (data.lastName) await this.lastNameAddrInput.fill(data.lastName)
    await this.streetInput.fill(data.street)
    await this.cityInput.fill(data.city)
    if (data.state) await this.stateInput.fill(data.state)
    await this.postalCodeInput.fill(data.postalCode)
    await this.countryInput.fill(data.country)
    await this.saveAddressButton.click()
  }

  async selectCashOnDelivery() {
    await this.cashOnDeliveryLabel.click()
  }

  async selectCreditCard() {
    await this.creditCardLabel.click()
  }

  async placeOrder() {
    await this.placeOrderButton.click()
  }
}
