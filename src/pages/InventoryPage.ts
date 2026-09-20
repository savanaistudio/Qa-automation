import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';

export class InventoryPage extends BasePage {
  private readonly inventoryItems: Locator;
  private readonly cartIcon: Locator;
  private readonly cartBadge: Locator;
  private readonly sortDropdown: Locator;
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('.inventory_item');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.pageTitle = page.locator('.title');
  }

  async getPageTitle(): Promise<string> {
    return this.textOf(this.pageTitle);
  }

  itemByName(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  async addItemToCart(name: string): Promise<void> {
    const item = this.itemByName(name);
    await this.click(item.getByRole('button', { name: /add to cart/i }));
  }

  async removeItemFromCart(name: string): Promise<void> {
    const item = this.itemByName(name);
    await this.click(item.getByRole('button', { name: /remove/i }));
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return Number(await this.textOf(this.cartBadge));
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async goToCart(): Promise<CartPage> {
    await this.click(this.cartIcon);
    return new CartPage(this.page);
  }

  getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }
}
