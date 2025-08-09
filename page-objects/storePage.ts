import { Locator, Page, expect } from '@playwright/test';

export class StorePage {

    readonly page: Page
    readonly basketCount: Locator
    readonly cartButton: Locator
    readonly okNotesHeader: Locator
    readonly clickTypeField: Locator
    readonly checkboxWithDiscount: Locator
    readonly productForCard: Locator
    readonly newPrice: Locator
    readonly oldPrice: Locator
    readonly productDiscount: Locator

    constructor(page: Page) {
        this.page = page
        this.basketCount = page.locator('.basket-count-items');
        this.cartButton = page.locator('#basketContainer');
        this.okNotesHeader = page.locator('.navbar-brand')
        this.clickTypeField = page.getByPlaceholder('Тип');
        this.checkboxWithDiscount = page.getByRole('checkbox', { name: "Показать только со скидкой" });
        this.productForCard = page.locator('.note-item');
        this.newPrice = page.locator('.product_price');
        this.oldPrice = page.locator('.product_price s');
        this.productDiscount = page.locator('.product_discount');
    }

    async countProductOnCart(count: string) {
        await expect(this.basketCount).toHaveText(count);
    }

    async clickCartButton() {
        await this.page.waitForTimeout(500)
        await this.cartButton.click({ force: true })
    }

    async clickOkNotes() {
        await this.okNotesHeader.click()
    }

    // Метод для получения локатора опции по тексту
    getOptionLocator(optionText: string): Locator {
        return this.page.locator('.select2-results__option', { hasText: optionText });
    }

    async selectTypeProducts(optionText: string) {
        await this.clickTypeField.click();
        const optionLocator = this.getOptionLocator(optionText);
        await expect(optionLocator).toBeVisible();
        await optionLocator.click();
    }

    async showOnlyWithDiscount() {
        await this.checkboxWithDiscount.check();
    }

    async buySpecificProduct(index: number = 0, discount: string, oldp: string, newp: string, desiredCount: number = 1) {
        await this.page.waitForTimeout(1000)
        const productCount = await this.productForCard.count();
        if (index >= productCount) {
            throw new Error(`Товар с индексом ${index} не найден. Всего товаров: ${productCount}`);
        }
        //найти нужный товар
        const productCard = this.productForCard.nth(index);
        //проверить наличие класса 'hasDiscount' у продукта
        const hasDiscountClass = await productCard.evaluate((node) =>
            node.classList.contains('hasDiscount')
        );
        //для товара со скидкой - скидка и старая цена
        if (hasDiscountClass) {
            await expect(productCard.locator('.product_discount')).toHaveText(discount);
            expect(await productCard.locator('.product_price s').textContent()).toBe(oldp);
        }
        //текущая цена
        await expect(productCard.locator('.product_price')).toHaveText(newp);
        //получить количество на складе
        const stockCount = await productCard.locator('.product_count').textContent();
        const stockNumber = parseInt(stockCount?.trim() || '0', 10);

        if (desiredCount > stockNumber) {
            throw new Error(`Запрошенное количество (${desiredCount}) превышает запас (${stockNumber})`);
        }
        //установить нужного количества
        await productCard.locator('input[name="product-enter-count"]').fill(desiredCount.toString());
        //нажать кнопку купить
        await productCard.getByRole('button', { name: "Купить" }).click();

    }

}