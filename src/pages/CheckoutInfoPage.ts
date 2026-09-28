import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PageFactory } from './PageFactory';
import type { CartPage } from './CartPage';
import type { CheckoutOverviewPage } from './CheckoutOverviewPage';

export class CheckoutInfoPage extends BasePage<'CheckoutInfoPage'> {
  protected readonly pageName = 'CheckoutInfoPage' as const;

  constructor(page: Page) {
    super(page);
  }

  get heading(): Locator {
    return this.el('pageTitle');
  }

  get firstName(): Locator {
    return this.el('firstNameInput');
  }

  get lastName(): Locator {
    return this.el('lastNameInput');
  }

  get postalCode(): Locator {
    return this.el('postalCodeInput');
  }

  get error(): Locator {
    return this.el('errorMessage');
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(this.firstName, firstName);
    await this.fill(this.lastName, lastName);
    await this.fill(this.postalCode, postalCode);
  }

  /** Alias kept for tests written against the older getters/verb naming. */
  fillDetails(firstName: string, lastName: string, postalCode: string): Promise<void> {
    return this.fillInfo(firstName, lastName, postalCode);
  }

  async continue(): Promise<CheckoutOverviewPage> {
    await this.click(this.el('continueButton'));
    return PageFactory.create<CheckoutOverviewPage>('CheckoutOverviewPage', this.page);
  }

  async cancel(): Promise<CartPage> {
    await this.click(this.el('cancelButton'));
    return PageFactory.create<CartPage>('CartPage', this.page);
  }

  async getErrorMessage(): Promise<string> {
    return this.textOf(this.error);
  }
}

PageFactory.register('CheckoutInfoPage', CheckoutInfoPage);
