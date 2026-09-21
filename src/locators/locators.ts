/**
 * Single source of truth for every element selector, grouped by page.
 * Add a page's elements here once and every page object can look them
 * up by name via BasePage.el() — no selectors duplicated in page classes.
 */
export const locators = {
  LoginPage: {
    usernameInput: '#user-name',
    passwordInput: '#password',
    loginButton: '#login-button',
    errorMessage: '[data-test="error"]',
  },
  InventoryPage: {
    inventoryItems: '.inventory_item',
    cartIcon: '.shopping_cart_link',
    cartBadge: '.shopping_cart_badge',
    sortDropdown: '[data-test="product-sort-container"]',
    pageTitle: '.title',
  },
  CartPage: {
    cartItems: '.cart_item',
    checkoutButton: '[data-test="checkout"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
  },
  CheckoutInfoPage: {
    pageTitle: '.title',
    firstNameInput: '[data-test="firstName"]',
    lastNameInput: '[data-test="lastName"]',
    postalCodeInput: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    cancelButton: '[data-test="cancel"]',
    errorMessage: '[data-test="error"]',
  },
} as const;

export type PageLocators = typeof locators;
export type PageName = keyof PageLocators;
export type ElementName<P extends PageName> = keyof PageLocators[P] & string;
