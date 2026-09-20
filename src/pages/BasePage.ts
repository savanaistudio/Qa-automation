import type { Locator, Page } from '@playwright/test';
import { locators, type ElementName, type PageName } from '@locators/locators';

export abstract class BasePage<P extends PageName = PageName> {
  protected readonly page: Page;
  protected abstract readonly pageName: P;

  constructor(page: Page) {
    this.page = page;
  }

  /** Look up an element by name from locators.ts instead of hardcoding a selector. */
  protected el(name: ElementName<P>): Locator {
    const pageLocators = locators[this.pageName] as Record<string, string>;
    const selector = pageLocators[name];
    return this.page.locator(selector);
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
