import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PageFactory } from './PageFactory';
import type { CartPage } from './CartPage';

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

  async fillDetails(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(this.firstName, firstName);
    await this.fill(this.lastName, lastName);
    await this.fill(this.postalCode, postalCode);
  }

  /** Overview page abhi nahi bana — agla screen map hone ke baad wire karenge. */
  async continue(): Promise<void> {
    await this.click(this.el('continueButton'));
  }

  async cancel(): Promise<CartPage> {
    await this.click(this.el('cancelButton'));
    return PageFactory.create<CartPage>('CartPage', this.page);
  }
}

PageFactory.register('CheckoutInfoPage', CheckoutInfoPage);
