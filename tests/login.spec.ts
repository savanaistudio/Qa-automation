import { test, expect } from '@fixtures/pages.fixture';
import { users } from '@data/testData';

test.describe('Login', () => {
  test('standard user can log in successfully', async ({ loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect.poll(() => inventoryPage.getPageTitle()).toBe('Products');
  });

  test('locked out user sees an error message', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.locked.username, users.locked.password);

    await expect(await loginPage.getErrorMessage()).toContain('locked out');
  });

  test('invalid credentials are rejected', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.invalid.username, users.invalid.password);

    expect(await loginPage.isErrorVisible()).toBe(true);
  });
});
