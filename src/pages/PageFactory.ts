import type { Page } from '@playwright/test';

type PageCtor = new (page: Page) => unknown;

/**
 * Name -> page class registry. Each page class self-registers at the
 * bottom of its own file via PageFactory.register(...), so this file
 * never imports the page classes it serves (avoids import cycles).
 *
 * To link one page to another, call PageFactory.create<NextPage>('NextPage', this.page)
 * instead of `new NextPage(this.page)` — add a page once and any existing
 * page can navigate to it by name.
 */
const registry = new Map<string, PageCtor>();

export const PageFactory = {
  register(name: string, ctor: PageCtor): void {
    registry.set(name, ctor);
  },

  create<T>(name: string, page: Page): T {
    const Ctor = registry.get(name);
    if (!Ctor) {
      throw new Error(
        `PageFactory: no page registered as "${name}". Make sure that page's module is ` +
          `imported somewhere (e.g. src/fixtures/pages.fixture.ts) so it can self-register.`,
      );
    }
    return new Ctor(page) as T;
  },
};
