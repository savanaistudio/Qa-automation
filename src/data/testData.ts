export const users = {
  standard: {
    username: process.env.STANDARD_USERNAME ?? 'standard_user',
    password: process.env.PASSWORD ?? 'secret_sauce',
  },
  locked: {
    username: process.env.LOCKED_USERNAME ?? 'locked_out_user',
    password: process.env.PASSWORD ?? 'secret_sauce',
  },
  problem: {
    username: process.env.PROBLEM_USERNAME ?? 'problem_user',
    password: process.env.PASSWORD ?? 'secret_sauce',
  },
  invalid: {
    username: 'no_such_user',
    password: 'wrong_password',
  },
} as const;

export const customer = {
  firstName: 'Savan',
  lastName: 'Patel',
  postalCode: '380015',
} as const;

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
} as const;
