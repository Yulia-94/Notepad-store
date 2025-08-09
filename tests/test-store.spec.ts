import { test, expect, type Page } from '@playwright/test';
import { LoginPage } from '../page-objects/loginPage';
import { StorePage } from '../page-objects/storePage';
import { CartPage } from '../page-objects/cartPage';


test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  //авторизация
  await page.goto('https://enotes.pointschool.ru/login');
  await loginPage.login('test', 'test');
  //проверка имени клиента на странице магазина
  await expect(page.locator('.text-uppercase')).toHaveText('test');
  //проверка URL страницы магазина
  await expect(page).toHaveURL('https://enotes.pointschool.ru/');
});

test('1: go to empty cart', async ({ page }) => {
  const storePage = new StorePage(page);
  const cartPage = new CartPage(page);
  //нажать на пустую корзину (не работает, если другое flow)
  await storePage.clickCartButton();
  //итоговая цена: 0
  await cartPage.totalPriceInCart('0');
  //нажать кнопку перейти в корзину
  await cartPage.goToCart()
  //нажать заготовок 'OK-Notes' (вернуться назад)
  await storePage.clickOkNotes()
  //количество товара в корзине на странице магазина = 0
  await storePage.countProductOnCart('0');
});

test('2: go to cart with 1 non-promotional product', async ({ page }) => {
  const storePage = new StorePage(page)
  const cartPage = new CartPage(page)
  //купить нужный товар 'Еженедельники' - второй
  await storePage.buySpecificProduct(1, '', '', '400 р.');
  //количество товара в корзине на странице магазина = 1
  await storePage.countProductOnCart('1');
  //нажать на иконку корзины 
  await storePage.clickCartButton();
  //проверить заголовой, цена, количество товара к корзине
  await cartPage.checkCartItems([
    {
      title: 'Блокнот в точку', price: ' - 400 р.',
      count: '1'
    },
  ]);
  //итоговая цена: 400
  await cartPage.totalPriceInCart('400');
  //нажать кнопку 'Перейти в корзину'
  await cartPage.goToCart();
  //нажать заготовок 'OK-Notes' (вернуться назад)
  await storePage.clickOkNotes();
  //нажать на иконку корзины 
  await storePage.clickCartButton();
  //очистить корзину
  await cartPage.clearCart();
});

test('3: go to cart with 1 promotional product', async ({ page }) => {
  const storePage = new StorePage(page)
  const cartPage = new CartPage(page)
  //выбрать все аукционные товары
  await storePage.showOnlyWithDiscount();
  //нажать на тип товара и выбрать 'Еженедельники'
  await storePage.selectTypeProducts('Еженедельники');
  //купить нужный товар 'Еженедельники' - второй
  await storePage.buySpecificProduct(1, '120', '946 р.', '826 р. 946 р.');
  //количество товара в корзине на странице магазина = 1
  await storePage.countProductOnCart('1');
  //нажать на иконку корзины 
  await storePage.clickCartButton();
  //проверить заголовой, цена, количество товара к корзине
  await cartPage.checkCartItems([
    {
      title: 'Европейские каникулы', price: ' - 826 р.',
      count: '1'
    },
  ]);
  //итоговая цена: 826
  await cartPage.totalPriceInCart('826');
  //нажать кнопку 'Перейти в корзину'
  await cartPage.goToCart();
  //нажать заготовок 'OK-Notes' (вернуться назад)
  await storePage.clickOkNotes();
  //нажать на иконку корзины 
  await storePage.clickCartButton();
  //очистить корзину
  await cartPage.clearCart();
});

test('4: go to cart with 9 different products', async ({ page }) => {
  const storePage = new StorePage(page)
  const cartPage = new CartPage(page)
  //купить товар 'Кошечка Мари'
  await storePage.buySpecificProduct(3, '', '', '442 р.');
  //купить товар 'Игра престолов'
  await storePage.buySpecificProduct(2, '100', '385 р.', '285 р. 385 р.');
  //купить товар 'Блокнот в точку'
  await storePage.buySpecificProduct(1, '', '', '400 р.', 3);
  //купить товар 'Творческий беспорядок'
  await storePage.buySpecificProduct(0, '300', '700 р.', '400 р. 700 р.');
  //купить товар 'Нотная тетрадь'
  await storePage.buySpecificProduct(4, '', '', '499 р.',);
  //купить товар 'Black&Red'
  await storePage.buySpecificProduct(5, '50', '365 р.', '315 р. 365 р.');
  //количество товара в корзине на странице магазина = 8
  await storePage.countProductOnCart('8');
  //нажать на иконку корзины 
  await storePage.clickCartButton();

  await cartPage.checkCartItems([
    {
      title: 'Кошечка Мари', price: ' - 442 р.',
      count: '1'
    },
    { title: 'Игра престолов', price: ' - 285 р.', count: '1' },
    { title: 'Блокнот в точку', price: ' - 1200 р.', count: '3' },
    {
      title: 'Творческий беспорядок', price: ' - 400 р.',
      count: '1'
    },
    {
      title: 'Нотная тетрадь', price: ' - 499 р.',
      count: '1'
    },
    { title: 'Black&Red', price: ' - 315 р.', count: '1' }
  ]);
  //итоговая цена: 3141
  await cartPage.totalPriceInCart('3141');
  //нажать кнопку 'Перейти в корзину'
  await cartPage.goToCart();
  //нажать заготовок 'OK-Notes' (вернуться назад)
  await storePage.clickOkNotes();
  //нажать на иконку корзины 
  await storePage.clickCartButton();
  //очистить корзину
  await cartPage.clearCart();
});

test('5: go to cart with 9 promotional products of the same name', async ({ page }) => {
  const storePage = new StorePage(page)
  const cartPage = new CartPage(page)
  //выбрать все аукционные товары
  await storePage.showOnlyWithDiscount();
  //нажать на тип товара и выбрать 'Записные книжки'
  await storePage.selectTypeProducts('Записные книжки');
  //купить нужный товар 'Записные книжки'
  await storePage.buySpecificProduct(0, '300', '700 р.', '400 р. 700 р.', 8);
  //количество товара в корзине на странице магазина = 8
  await storePage.countProductOnCart('8');
  //нажать на иконку корзины 
  await storePage.clickCartButton();
  //проверить заголовой, цена, количество товара к корзине
  await cartPage.checkCartItems([
    {
      title: 'Творческий беспорядок', price: ' - 3200 р.',
      count: '8'
    },
  ]);
  //итоговая цена: 3200
  await cartPage.totalPriceInCart('3200');
  //нажать кнопку 'Перейти в корзину'
  await cartPage.goToCart();
  //нажать заготовок 'OK-Notes' (вернуться назад)
  await storePage.clickOkNotes();
  //нажать на иконку корзины 
  await storePage.clickCartButton();
  //очистить корзину
  await cartPage.clearCart();
})
