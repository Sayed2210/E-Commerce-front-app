import { BasePage } from './BasePage'

export class ProductsPage extends BasePage {
  get productLinks() {
    return this.page.locator('a[href*="/products/"]')
  }
  get searchInput() {
    return this.page.getByRole('searchbox').or(this.page.locator('input[placeholder*="search" i]'))
  }

  async goto() {
    await this.navigate('/products')
  }

  async clickFirstProduct() {
    await this.productLinks.first().click()
  }
}
