import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PageFactory } from './PageFactory';
import type { InventoryPage } from './InventoryPage';

export class CheckoutCompletePage extends BasePage<'CheckoutCompletePage'> {
  protected readonly pageName = 'CheckoutCompletePage' as const;

  constructor(page: Page) {
    super(page);
  }

  async getHeader(): Promise<string> {
    return this.textOf(this.el('completeHeader'));
  }

  async getMessage(): Promise<string> {
    return this.textOf(this.el('completeText'));
  }

  async backHome(): Promise<InventoryPage> {
    await this.click(this.el('backHomeButton'));
    return PageFactory.create<InventoryPage>('InventoryPage', this.page);
  }
}

PageFactory.register('CheckoutCompletePage', CheckoutCompletePage);
