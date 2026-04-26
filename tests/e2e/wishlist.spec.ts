import { test, expect } from '@playwright/test'
import { WishlistPage } from './pages/WishlistPage'
import { ProductsPage } from './pages/ProductsPage'
import { LoginPage } from './pages/LoginPage'

async function loginAs(
  page: any,
  email = process.env.TEST_EMAIL ?? 'user@example.com',
  password = process.env.TEST_PASSWORD ?? 'password123'
) {
  const loginPage = new LoginPage(page)
  await loginPage.login(email, password)
  await page.waitForURL(/\/((?!login).)*$/, { timeout: 10_000 })
}

test.describe('Wishlist', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/wishlist')
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows "My Wishlist" heading when authenticated', async ({ page }) => {
    await loginAs(page)
    const wishlist = new WishlistPage(page)
    await wishlist.navigate()

    await expect(wishlist.title).toBeVisible()
  })

  test('shows item count when wishlist has items', async ({ page }) => {
    await loginAs(page)
    const wishlist = new WishlistPage(page)
    await wishlist.navigate()

    await expect(wishlist.itemCount).toBeVisible()
  })

  test('shows empty state when wishlist is empty', async ({ page }) => {
    await loginAs(page)
    const wishlist = new WishlistPage(page)
    await wishlist.navigate()

    const itemCount = await wishlist.wishlistItems.count()
    if (itemCount === 0) {
      await expect(wishlist.emptyState).toBeVisible()
      await expect(wishlist.exploreProductsLink).toBeVisible()
    }
  })

  test('Explore Products link goes to /products', async ({ page }) => {
    await loginAs(page)
    const wishlist = new WishlistPage(page)
    await wishlist.navigate()

    const itemCount = await wishlist.wishlistItems.count()
    if (itemCount === 0) {
      await wishlist.exploreProductsLink.click()
      await expect(page).toHaveURL(/\/products/)
    }
  })

  test('add product to wishlist from products listing', async ({ page }) => {
    await loginAs(page)

    const products = new ProductsPage(page)
    await products.goto()
    await page.waitForLoadState('networkidle')

    // Click wishlist/heart icon on first product card
    const wishlistBtn = page
      .locator('button')
      .filter({
        has: page.locator('.material-symbols-outlined'),
      })
      .first()

    if (await wishlistBtn.isVisible()) {
      await wishlistBtn.click()
      await page.waitForTimeout(1_000)
      // Navigate to wishlist to verify item was added
      await page.goto('/wishlist')
      await page.waitForLoadState('networkidle')
      const count = await page.locator('ul[role="list"] li').count()
      expect(count).toBeGreaterThan(0) // Verify item was actually added
    }
  })

  test('clear all button removes all wishlist items', async ({ page }) => {
    await loginAs(page)
    const wishlist = new WishlistPage(page)
    await wishlist.navigate()

    const itemCount = await wishlist.wishlistItems.count()
    if (itemCount > 0) {
      await expect(wishlist.clearAllButton).toBeVisible()
      await wishlist.clearAllButton.click()
      await page.waitForLoadState('networkidle')

      // After clearing, should show empty state or 0 items
      const newCount = await wishlist.wishlistItems.count()
      expect(newCount).toBe(0)
    }
  })

  test('wishlist items show product information', async ({ page }) => {
    await loginAs(page)
    const wishlist = new WishlistPage(page)
    await wishlist.navigate()

    const items = await wishlist.wishlistItems.count()
    if (items > 0) {
      const firstItem = wishlist.wishlistItems.first()
      // Product card should show price
      const priceText = await firstItem
        .locator('text=/\\$[0-9]+/')
        .first()
        .isVisible()
        .catch(() => false)
      expect(priceText).toBeTruthy() // Price should be visible
    }
  })

  test('add to cart from wishlist moves item to cart', async ({ page }) => {
    await loginAs(page)
    const wishlist = new WishlistPage(page)
    await wishlist.navigate()

    const items = await wishlist.wishlistItems.count()
    if (items > 0) {
      const addToCartBtn = page
        .locator('ul[role="list"] li')
        .first()
        .getByRole('button', { name: /add to cart/i })
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click()
        await page.waitForTimeout(1_000)
        // Item should be removed from wishlist after moving to cart
        const newCount = await wishlist.wishlistItems.count()
        expect(newCount).toBeLessThan(items)
      }
    }
  })
})
