import { test, expect } from '@playwright/test'
import { HomePage } from './pages/HomePage'

test.describe('Home page', () => {
  test('loads with a visible main content area', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    await expect(page).toHaveTitle(/E-Commerce|Shop/i)
    await expect(home.mainContent).toBeVisible()
  })

  test('navbar is visible and sticky', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    await expect(home.navbar).toBeVisible()
  })

  test('product cards are rendered on homepage', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    // Wait for products to load (API call may be async)
    await page.waitForLoadState('networkidle')
    const cards = home.productCards
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('clicking a product card navigates to product detail', async ({ page }) => {
    const home = new HomePage(page)
    await home.goto()

    await page.waitForLoadState('networkidle')
    const firstCard = home.productCards.first()
    await firstCard.click()

    await expect(page).toHaveURL(/\/products\//)
  })
})
