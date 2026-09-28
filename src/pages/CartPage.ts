import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PageFactory } from './PageFactory';
import type { InventoryPage } from './InventoryPage';
import type { CheckoutInfoPage } from './CheckoutInfoPage';

export class CartPage extends BasePage<'CartPage'> {
  protected readonly pageName = 'CartPage' as const;

  constructor(page: Page) {
    super(page);
  }

  getItemCount(): Promise<number> {
    return this.el('cartItems').count();
  }

  itemByName(name: string): Locator {
    return this.el('cartItems').filter({ hasText: name });
  }

  async removeItem(name: string): Promise<void> {
    await this.click(this.itemByName(name).getByRole('button', { name: /remove/i }));
  }

  async checkout(): Promise<CheckoutInfoPage> {
    await this.click(this.el('checkoutButton'));
    return PageFactory.create<CheckoutInfoPage>('CheckoutInfoPage', this.page);
  }

  /** Goes back to the previous page (Inventory) by name via PageFactory. */
  async continueShopping(): Promise<InventoryPage> {
    await this.click(this.el('continueShoppingButton'));
    return PageFactory.create<InventoryPage>('InventoryPage', this.page);
  }
}

PageFactory.register('CartPage', CartPage);
