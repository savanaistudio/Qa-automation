# QA Automation — Playwright POM Framework

A Playwright + TypeScript test automation framework built on the Page Object Model (POM) pattern.
Example tests target [saucedemo.com](https://www.saucedemo.com), a public site made for practicing QA automation.

## Structure

```
src/
  pages/        Page Objects (BasePage + one class per page/screen) + PageFactory
  locators/     locators.ts — every selector, grouped by page, in one file
  fixtures/     Playwright test fixtures that inject page objects into tests
  data/         Static test data (users, products, etc.)
  utils/        Shared helper functions
tests/          Test specs, grouped by feature
```

### Page Object Model

Every page extends `BasePage<'YourPageName'>`, which holds shared navigation/interaction
helpers plus `el(name)` — a lookup into `src/locators/locators.ts` by element name, so no
page class hardcodes a CSS selector. Each page object exposes only action/query methods
(`login()`, `addItemToCart()`, `checkout()`) — tests never touch selectors directly.

**One file for every selector** — `src/locators/locators.ts` maps page name → element
name → selector:

```ts
export const locators = {
  LoginPage: {
    usernameInput: '#user-name',
    passwordInput: '#password',
    loginButton: '#login-button',
  },
  // ...
} as const;
```

A page object then does `this.el('usernameInput')` instead of `page.locator('#user-name')`.
To support a new site or page version, edit this one file — no page class changes needed.

**Pages connect to each other by name, not by import** — `PageFactory`
(`src/pages/PageFactory.ts`) is a name → class registry. Each page self-registers at the
bottom of its own file (`PageFactory.register('InventoryPage', InventoryPage)`), so a page's
action method returns the next (or previous) page just by naming it:

```ts
async login(username: string, password: string): Promise<InventoryPage> {
  await this.fill(this.el('usernameInput'), username);
  await this.fill(this.el('passwordInput'), password);
  await this.click(this.el('loginButton'));
  return PageFactory.create<InventoryPage>('InventoryPage', this.page);
}
```

Pages only ever reference each other via `import type` (erased at compile time) for the
return-type annotation, plus the string name at runtime — so there's no import cycle even
though Login → Inventory → Cart → Inventory all link back and forth.

Fixtures (`src/fixtures/pages.fixture.ts`) import every page class (which also makes them
self-register) and wire them into tests, so specs just declare what they need:

```ts
test('adds an item to the cart', async ({ loginPage, inventoryPage }) => {
  await loginPage.open();
  await loginPage.login(users.standard.username, users.standard.password);
  await inventoryPage.addItemToCart(products.backpack);
  expect(await inventoryPage.getCartCount()).toBe(1);
});
```

## Getting started

```bash
npm install
npx playwright install --with-deps
cp .env.example .env   # optional, defaults already point at saucedemo.com
npm test
```

## Useful scripts

| Command                | Description                              |
|-------------------------|-------------------------------------------|
| `npm test`              | Run all tests headless, all browsers      |
| `npm run test:headed`   | Run with a visible browser window         |
| `npm run test:ui`       | Open Playwright's interactive UI runner   |
| `npm run test:debug`    | Run in debug/inspector mode               |
| `npm run test:chromium` | Run only against Chromium                 |
| `npm run report`        | Open the last HTML report                 |
| `npm run codegen`       | Record new tests via Playwright Codegen   |
| `npm run typecheck`     | Type-check without emitting files         |

## Adding a new page object

1. Add its elements to `src/locators/locators.ts`: `YourPage: { someButton: '#some-id' }`.
2. Create `src/pages/YourPage.ts` extending `BasePage<'YourPage'>`, set `protected readonly pageName = 'YourPage' as const`.
3. Expose action/query methods that call `this.el('someButton')` — keep selectors out of the class.
4. If another page should navigate to it, call `PageFactory.create<YourPage>('YourPage', this.page)` and add `import type { YourPage } from './YourPage'`.
5. At the bottom of the file, self-register: `PageFactory.register('YourPage', YourPage)`.
6. Add it to `src/fixtures/pages.fixture.ts` so tests can request it (this import also triggers self-registration).
7. Write specs under `tests/`, importing `test`/`expect` from `@fixtures/pages.fixture`.

## CI

`.github/workflows/playwright.yml` runs the full suite on every push/PR to `main` and
uploads the HTML report as a build artifact.
