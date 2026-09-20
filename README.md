# QA Automation — Playwright POM Framework

A Playwright + TypeScript test automation framework built on the Page Object Model (POM) pattern.
Example tests target [saucedemo.com](https://www.saucedemo.com), a public site made for practicing QA automation.

## Structure

```
src/
  pages/        Page Objects (BasePage + one class per page/screen)
  fixtures/     Playwright test fixtures that inject page objects into tests
  data/         Static test data (users, products, etc.)
  utils/        Shared helper functions
tests/          Test specs, grouped by feature
```

### Page Object Model

Every page extends `BasePage`, which holds shared navigation/interaction helpers.
Each page object exposes locators as private fields and public methods that describe
user actions (`login()`, `addItemToCart()`, `checkout()`), never raw locators — tests
never touch selectors directly.

Fixtures (`src/fixtures/pages.fixture.ts`) wire page objects into tests, so specs just
declare what they need:

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

1. Create `src/pages/YourPage.ts` extending `BasePage`.
2. Declare locators as `private readonly` fields in the constructor.
3. Expose action/query methods only — keep selectors private.
4. Register it in `src/fixtures/pages.fixture.ts` so tests can request it.
5. Write specs under `tests/`, importing `test`/`expect` from `@fixtures/pages.fixture`.

## CI

`.github/workflows/playwright.yml` runs the full suite on every push/PR to `main` and
uploads the HTML report as a build artifact.
