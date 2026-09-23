import { test, expect } from '@fixtures/pages.fixture';
import { users, products, checkoutInfo } from '@data/testData';

const PAUSE_MS = 5_000; // demo pause after every step; set to 0 for a fast run

test.describe('E2E: login to order confirmation', () => {
  test('standard user buys two products end to end', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    test.setTimeout(120_000);
    const step = (name: string, body: () => Promise<void>) =>
      test.step(name, async () => {
        await body();
        await page.waitForTimeout(PAUSE_MS);
      });

    await step('1. Login', async () => {
      await loginPage.open();
      await loginPage.login(users.standard.username, users.standard.password);
      await expect(page).toHaveURL(/inventory\.html/);
      await expect.poll(() => inventoryPage.getPageTitle()).toBe('Products');
    });

    await step('2. Add two products to cart', async () => {
      await inventoryPage.addItemToCart(products.backpack);
      await inventoryPage.addItemToCart(products.bikeLight);
      await expect.poll(() => inventoryPage.getCartCount()).toBe(2);
    });

    await step('3. Open cart and verify items', async () => {
      await inventoryPage.goToCart();
      await expect(page).toHaveURL(/cart\.html/);
      await expect.poll(() => cartPage.getItemCount()).toBe(2);
      await expect(cartPage.itemByName(products.backpack)).toBeVisible();
      await expect(cartPage.itemByName(products.bikeLight)).toBeVisible();
    });

    await step('4. Checkout: fill customer info', async () => {
      await cartPage.checkout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
      await checkoutInfoPage.fillInfo(
        checkoutInfo.firstName,
        checkoutInfo.lastName,
        checkoutInfo.postalCode,
      );
      await checkoutInfoPage.continue();
    });

    await step('5. Overview: verify price maths', async () => {
      await expect(page).toHaveURL(/checkout-step-two\.html/);
      await expect.poll(() => checkoutOverviewPage.getItemCount()).toBe(2);

      const listed = await checkoutOverviewPage.getListedPricesSum();
      const subtotal = await checkoutOverviewPage.getSubtotal();
      const tax = await checkoutOverviewPage.getTax();
      const total = await checkoutOverviewPage.getTotal();

      expect(subtotal).toBeCloseTo(listed, 2);
      expect(total).toBeCloseTo(subtotal + tax, 2);
    });

    await step('6. Finish order and verify confirmation', async () => {
      await checkoutOverviewPage.finish();
      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect.poll(() => checkoutCompletePage.getHeader()).toBe('Thank you for your order!');
    });

    await step('7. Back home: cart is empty', async () => {
      await checkoutCompletePage.backHome();
      await expect(page).toHaveURL(/inventory\.html/);
      await expect.poll(() => inventoryPage.getCartCount()).toBe(0);
    });
  });

  test('checkout info form blocks empty submit', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutInfoPage.continue();
    await expect.poll(() => checkoutInfoPage.getErrorMessage()).toContain('First Name is required');
  });
});

