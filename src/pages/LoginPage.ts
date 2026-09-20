import type { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PageFactory } from './PageFactory';
import type { InventoryPage } from './InventoryPage';

export class LoginPage extends BasePage<'LoginPage'> {
  protected readonly pageName = 'LoginPage' as const;

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  async login(username: string, password: string): Promise<InventoryPage> {
    await this.fill(this.el('usernameInput'), username);
    await this.fill(this.el('passwordInput'), password);
    await this.click(this.el('loginButton'));
    return PageFactory.create<InventoryPage>('InventoryPage', this.page);
  }

  async getErrorMessage(): Promise<string> {
    return this.textOf(this.el('errorMessage'));
  }

  isErrorVisible(): Promise<boolean> {
    return this.el('errorMessage').isVisible();
  }
}

PageFactory.register('LoginPage', LoginPage);
