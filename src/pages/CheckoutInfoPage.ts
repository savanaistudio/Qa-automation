import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PageFactory } from './PageFactory';
import type { CheckoutOverviewPage } from './CheckoutOverviewPage';

export class CheckoutInfoPage extends BasePage<'CheckoutInfoPage'> {
  protected readonly pageName = 'CheckoutInfoPage' as const;

  constructor(page: Page) {
    super(page);
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(this.el('firstNameInput'), firstName);
    await this.fill(this.el('lastNameInput'), lastName);
    await this.fill(this.el('postalCodeInput'), postalCode);
  }

  async continue(): Promise<CheckoutOverviewPage> {
    await this.click(this.el('continueButton'));
    return PageFactory.create<CheckoutOverviewPage>('CheckoutOverviewPage', this.page);
  }

  async getErrorMessage(): Promise<string> {
    return this.textOf(this.el('errorMessage'));
  }
}

PageFactory.register('CheckoutInfoPage', CheckoutInfoPage);
