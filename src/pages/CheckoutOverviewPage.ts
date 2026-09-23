import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PageFactory } from './PageFactory';
import type { CheckoutCompletePage } from './CheckoutCompletePage';

const toNumber = (text: string): number => Number(text.replace(/[^0-9.]/g, ''));

export class CheckoutOverviewPage extends BasePage<'CheckoutOverviewPage'> {
  protected readonly pageName = 'CheckoutOverviewPage' as const;

  constructor(page: Page) {
    super(page);
  }

  getItemCount(): Promise<number> {
    return this.el('cartItems').count();
  }

  /** Sum of the individual item prices shown in the list. */
  async getListedPricesSum(): Promise<number> {
    const prices = await this.el('itemPrices').allTextContents();
    return prices.reduce((sum, p) => sum + toNumber(p), 0);
  }

  async getSubtotal(): Promise<number> {
    return toNumber(await this.textOf(this.el('subtotalLabel')));
  }

  async getTax(): Promise<number> {
    return toNumber(await this.textOf(this.el('taxLabel')));
  }

  async getTotal(): Promise<number> {
    return toNumber(await this.textOf(this.el('totalLabel')));
  }

  async finish(): Promise<CheckoutCompletePage> {
    await this.click(this.el('finishButton'));
    return PageFactory.create<CheckoutCompletePage>('CheckoutCompletePage', this.page);
  }
}

PageFactory.register('CheckoutOverviewPage', CheckoutOverviewPage);
