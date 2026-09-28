import { test, expect } from '@fixtures/pages.fixture';
import { users, products, customer } from '@data/testData';

test.describe('Checkout - Information step', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.addItemToCart(products.boltTShirt);
  });

  test('cart se checkout dabane pe information page khulta hai', async ({ inventoryPage }) => {
    const cartPage = await inventoryPage.goToCart();
    const checkoutInfoPage = await cartPage.checkout();

    await expect(checkoutInfoPage.heading).toHaveText('Checkout: Your Information');
    await expect(checkoutInfoPage.firstName).toBeVisible();
    await expect(checkoutInfoPage.lastName).toBeVisible();
    await expect(checkoutInfoPage.postalCode).toBeVisible();
  });

  test('cancel dabane pe wapas cart pe aa jata hai', async ({ inventoryPage }) => {
    const cartPage = await inventoryPage.goToCart();
    const checkoutInfoPage = await cartPage.checkout();

    const backToCart = await checkoutInfoPage.cancel();
    await expect(backToCart.itemByName(products.boltTShirt)).toBeVisible();
  });

  test('details bhar ke continue dabate hain', async ({ inventoryPage }) => {
    const cartPage = await inventoryPage.goToCart();
    const checkoutInfoPage = await cartPage.checkout();

    await checkoutInfoPage.fillDetails(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutInfoPage.continue();

    // Agla screen (Overview) abhi map nahi hua — bas itna check ki error nahi aaya
    await expect(checkoutInfoPage.error).toBeHidden();
  });
});
