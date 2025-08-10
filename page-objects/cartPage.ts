import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page
    readonly totalPriceProductsInCart: Locator
    readonly cartPopup: Locator
    readonly goToCartButton: Locator
    readonly clearCartButton: Locator
    readonly cartTitle: Locator
    readonly cartPrice: Locator
    readonly cartCount: Locator
    readonly cartItems: Locator

    constructor(page: Page) {
        this.page = page;
        this.totalPriceProductsInCart = page.locator('.basket_price');
        this.cartPopup = page.locator('[aria-labelledby="dropdownBasket"]');
        this.goToCartButton = page.locator('[href="/basket"]');
        this.clearCartButton = page.getByRole('button', { name: "Очистить корзину" });
        this.cartTitle = page.locator('.basket-item-title');
        this.cartPrice = page.locator('.basket-item-price');
        this.cartCount = page.locator('.basket-item-count');
        this.cartItems = this.page.locator('.list-group .basket-item');
    }

    async checkCartItems(expectedItems: Array<{ title: string; price: string; count: string }>) {
        await this.page.waitForTimeout(1000);
        //количество товаров в корзине
        const itemCount = await this.cartItems.count();
        //проверка фактического и ожидаемого количество товаров в корзине
        expect(itemCount).toBe(expectedItems.length);
        //массив перебирает товары в корзине для получения заголовка,цены и количества
        for (let i = 0; i < expectedItems.length; i++) {
            const item = this.cartItems.nth(i);
            await expect(item.locator('.basket-item-title')).toHaveText(expectedItems[i].title);
            await expect(item.locator('.basket-item-price')).toHaveText(expectedItems[i].price);
            if (expectedItems[i].count !== undefined) {
                await expect(item.locator('.basket-item-count')).toHaveText(expectedItems[i].count);
            }
        }
    }

    async totalPriceInCart(price: string) {
        //проверка всплывающего окна корзины
        await expect(this.cartPopup).toBeVisible();
        //итоговая цена товара
        await expect(this.totalPriceProductsInCart).toHaveText(price);
    }

    async goToCart() {
        await this.page.waitForTimeout(100);
        await this.goToCartButton.click({ force: true });
        await expect(this.page).toHaveURL('https://enotes.pointschool.ru/basket');
    }

    async clearCart() {
        await this.clearCartButton.click();
    }

}