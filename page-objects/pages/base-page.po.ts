import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async closeCookiesModal(): Promise<void> {
        const cookiesModal = this.page.locator('dialog[data-config-id="COOKIES_CONFIGURATION"]');
        if (!(await cookiesModal.isVisible())) {
            return;
        }
        await expect(cookiesModal).toBeEnabled();
        await cookiesModal.getByRole('button', { name: 'Potwierdź' }).click();
        await expect(cookiesModal).toBeHidden();
    }

    async waitForLoaded(element: Locator): Promise<void> {
        await expect(element).toBeVisible();
        await expect(element).toBeEnabled();
    }
}