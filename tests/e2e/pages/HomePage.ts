import { BasePage } from './BasePage'

export class HomePage extends BasePage {
  get productCards() {
    return this.page.locator('[data-testid="product-card"], .group').filter({ hasText: '$' })
  }
  get heroSection() {
    return this.page.locator('section').first()
  }
  get featuredHeading() {
    return this.page.getByRole('heading', { name: /featured|products/i })
  }
  get addToCartButtons() {
    return this.page.getByTitle('Add to cart')
  }

  async goto() {
    await this.navigate('/')
  }
}
