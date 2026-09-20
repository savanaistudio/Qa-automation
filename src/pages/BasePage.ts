import type { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  protected async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  protected async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  protected async textOf(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  async waitForUrlContains(fragment: string): Promise<void> {
    await this.page.waitForURL(new RegExp(fragment));
  }
}
