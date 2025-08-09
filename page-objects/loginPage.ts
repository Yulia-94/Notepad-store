import { Locator, Page } from '@playwright/test';

export class LoginPage {

    readonly page:  Page
    readonly loginClient: Locator
    readonly passwordClient: Locator
    readonly loginButton: Locator

    constructor(page: Page) {
        this.page = page
        this.loginClient = page.getByPlaceholder('Логин клиента')
        this.passwordClient = page.getByPlaceholder('Пароль клиента')
        this.loginButton = page.getByRole('button', { name: "Вход" })


    }

    async login(username: string, password: string) {
        await this.loginClient.fill(username);
        await this.passwordClient.pressSequentially(password, { delay: 100 });
        await this.loginButton.click();
    }
}
