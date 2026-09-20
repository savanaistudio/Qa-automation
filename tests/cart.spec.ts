import { test, expect } from '@fixtures/pages.fixture';
import { users, products } from '@data/testData';

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test('adding an item updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(products.backpack);

    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('removing an item clears the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.removeItemFromCart(products.backpack);

    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('cart page lists the added product', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(products.bikeLight);
    const cartPage = await inventoryPage.goToCart();

    expect(await cartPage.getItemCount()).toBe(1);
    await expect(cartPage.itemByName(products.bikeLight)).toBeVisible();
  });

  test('multiple items can be added to the cart', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.addItemToCart(products.boltTShirt);

    expect(await inventoryPage.getCartCount()).toBe(2);
  });
});
