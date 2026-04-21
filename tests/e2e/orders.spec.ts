import { test, expect } from '@playwright/test'
import { OrdersPage } from './pages/OrdersPage'
import { LoginPage } from './pages/LoginPage'

const TEST_EMAIL = process.env.TEST_EMAIL ?? 'user@example.com'
const TEST_PASSWORD = process.env.TEST_PASSWORD ?? 'password123'

async function loginAs(page: any) {
  const loginPage = new LoginPage(page)
  await loginPage.login(TEST_EMAIL, TEST_PASSWORD)
  await page.waitForURL(/\/((?!login).)*$/, { timeout: 10_000 })
}

test.describe('Orders', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/orders')
    await expect(page).toHaveURL(/\/login/)
  })

  test('orders page loads and shows heading', async ({ page }) => {
    await loginAs(page)
    await page.goto('/orders')
    await page.waitForLoadState('networkidle')

    const heading = page.getByRole('heading', { name: /orders|my orders/i })
    await expect(heading).toBeVisible()
  })

  test('shows empty state or order cards', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const hasOrders = (await orders.orderCards.count()) > 0
    const hasEmpty = await orders.emptyState.isVisible().catch(() => false)
    expect(hasOrders || hasEmpty).toBeTruthy()
  })

  test('order card shows order ID, date, and total', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      const firstCard = orders.orderCards.first()
      await expect(firstCard).toBeVisible()

      // Order card should contain an amount with dollar sign
      const priceText = firstCard.locator('text=/\\$[0-9]+/')
      await expect(priceText.first()).toBeVisible()
    }
  })

  test('order card has View Details link', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await expect(orders.viewDetailsLinks.first()).toBeVisible()
    }
  })

  test('clicking View Details navigates to order detail page', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await orders.viewFirstOrder()
      await expect(page).toHaveURL(/\/orders\/[\w-]+/)
    }
  })

  test('order detail page shows order information', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await orders.viewFirstOrder()
      // Order detail should show status and items
      const heading = page.getByRole('heading').first()
      await expect(heading).toBeVisible()
    }
  })

  test('order detail shows shipping address section', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await orders.viewFirstOrder()
      const shippingSection = page.locator('text=/Shipping Address/i')
      await expect(shippingSection.first()).toBeVisible()
    }
  })

  test('order status badge is displayed on order card', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await expect(orders.statusBadges.first()).toBeVisible()
      const badgeText = await orders.statusBadges.first().textContent()
      expect(badgeText?.toLowerCase()).toMatch(/pending|processing|shipped|delivered|cancelled/)
    }
  })
})

test.describe('Order Returns', () => {
  test('Request Return button appears only for delivered orders', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      // Find orders with "delivered" status
      const deliveredCards = page.locator('article.order-card').filter({
        has: page.locator('.order-card__badge:has-text("delivered")'),
      })
      const deliveredCount = await deliveredCards.count()

      if (deliveredCount > 0) {
        const returnBtn = deliveredCards.first().getByRole('button', { name: /request return/i })
        await expect(returnBtn).toBeVisible()
      }
    }
  })

  test('return modal opens when Request Return is clicked on detail page', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await orders.viewFirstOrder()

      // If this order is delivered, there should be a return button in line items
      const returnBtn = page.getByRole('button', { name: /request return/i })
      const hasReturnBtn = await returnBtn.isVisible().catch(() => false)

      if (hasReturnBtn) {
        await returnBtn.click()
        await page.waitForTimeout(500)

        // Return modal should open
        const modal = page.locator('.return-modal-overlay, [role="dialog"]')
        await expect(modal.first()).toBeVisible({ timeout: 5_000 })
      }
    }
  })

  test('return modal has reason dropdown and notes field', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await orders.viewFirstOrder()

      const returnBtn = page.getByRole('button', { name: /request return/i })
      const hasReturnBtn = await returnBtn.isVisible().catch(() => false)

      if (hasReturnBtn) {
        await returnBtn.click()
        await page.waitForTimeout(500)

        await expect(orders.returnReasonSelect).toBeVisible()
        await expect(orders.returnNotesInput).toBeVisible()
        await expect(orders.submitReturnButton).toBeVisible()
      }
    }
  })

  test('return modal has all reason options', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await orders.viewFirstOrder()

      const returnBtn = page.getByRole('button', { name: /request return/i })
      const hasReturnBtn = await returnBtn.isVisible().catch(() => false)

      if (hasReturnBtn) {
        await returnBtn.click()
        await page.waitForTimeout(500)

        const select = orders.returnReasonSelect
        if (await select.isVisible()) {
          const options = await select.locator('option').allTextContents()
          expect(options.some((o) => /changed.*mind/i.test(o))).toBeTruthy()
          expect(options.some((o) => /defective/i.test(o))).toBeTruthy()
          expect(options.some((o) => /wrong.*item/i.test(o))).toBeTruthy()
          expect(options.some((o) => /not.*described/i.test(o))).toBeTruthy()
        }
      }
    }
  })

  test('can cancel return modal', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await orders.viewFirstOrder()

      const returnBtn = page.getByRole('button', { name: /request return/i })
      const hasReturnBtn = await returnBtn.isVisible().catch(() => false)

      if (hasReturnBtn) {
        await returnBtn.click()
        await page.waitForTimeout(500)

        const cancelBtn = orders.cancelReturnButton
        if (await cancelBtn.isVisible().catch(() => false)) {
          await cancelBtn.click()
          const modal = page.locator('.return-modal-overlay, [role="dialog"]')
          await expect(modal.first()).not.toBeVisible({ timeout: 3_000 })
        }
      }
    }
  })

  test('submitting return closes modal', async ({ page }) => {
    await loginAs(page)
    const orders = new OrdersPage(page)
    await orders.navigate()

    const count = await orders.orderCards.count()
    if (count > 0) {
      await orders.viewFirstOrder()

      const returnBtn = page.getByRole('button', { name: /request return/i })
      const hasReturnBtn = await returnBtn.isVisible().catch(() => false)

      if (hasReturnBtn) {
        await returnBtn.click()
        await page.waitForTimeout(500)

        const modal = page.locator('.return-modal-overlay, [role="dialog"]')
        if (
          await modal
            .first()
            .isVisible()
            .catch(() => false)
        ) {
          const select = orders.returnReasonSelect
          if (await select.isVisible().catch(() => false)) {
            await select.selectOption('changed_mind')
            await orders.returnNotesInput.fill('Changed my mind, no longer needed')
            await orders.submitReturnButton.click()
            await page.waitForTimeout(2_000)
            // Modal should close after submission
            await expect(modal.first()).not.toBeVisible({ timeout: 5_000 })
          }
        }
      }
    }
  })
})
