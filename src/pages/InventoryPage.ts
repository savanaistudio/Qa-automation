import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PageFactory } from './PageFactory';
import type { CartPage } from './CartPage';

export class InventoryPage extends BasePage<'InventoryPage'> {
  protected readonly pageName = 'InventoryPage' as const;

  constructor(page: Page) {
    super(page);
  }

  async getPageTitle(): Promise<string> {
    return this.textOf(this.el('pageTitle'));
  }

  itemByName(name: string): Locator {
    return this.el('inventoryItems').filter({ hasText: name });
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
    const badge = this.el('cartBadge');
    if (!(await badge.isVisible())) return 0;
    return Number(await this.textOf(badge));
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.el('sortDropdown').selectOption(option);
  }

  async goToCart(): Promise<CartPage> {
    await this.click(this.el('cartIcon'));
    return PageFactory.create<CartPage>('CartPage', this.page);
  }

  getItemCount(): Promise<number> {
    return this.el('inventoryItems').count();
  }
}

PageFactory.register('InventoryPage', InventoryPage);
