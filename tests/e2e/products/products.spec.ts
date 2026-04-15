import { test, expect } from '@playwright/test'
import { ProductsPage } from '../pages/ProductsPage'

test.describe('Products listing', () => {
  test('products page loads and shows product links', async ({ page }) => {
    const products = new ProductsPage(page)
    await products.goto()

    await page.waitForLoadState('networkidle')
    const links = products.productLinks
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })

  test('clicking a product navigates to detail page', async ({ page }) => {
    const products = new ProductsPage(page)
    await products.goto()

    await page.waitForLoadState('networkidle')
    await products.clickFirstProduct()

    await expect(page).toHaveURL(/\/products\/\w+/)
  })

  test('product detail page shows price and add-to-cart', async ({ page }) => {
    const products = new ProductsPage(page)
    await products.goto()

    await page.waitForLoadState('networkidle')
    await products.clickFirstProduct()

    // Price should be visible
    await expect(page.locator('text=/\\$[0-9]+/').first()).toBeVisible()

    // Add-to-cart button should exist
    const cartBtn = page
      .getByRole('button', { name: /add to cart/i })
      .or(page.getByTitle('Add to cart'))
    await expect(cartBtn.first()).toBeVisible()
  })
})
