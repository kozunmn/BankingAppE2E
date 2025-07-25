import { Page, expect } from '@playwright/test';

export class BasePage {
    constructor(protected page: Page) {
        this.page = page;
    }

    async closeCookiesModal(page: Page): Promise<void> {
        const cookiesModal = page.locator('dialog[data-config-id="COOKIES_CONFIGURATION"]');
        if (!(await cookiesModal.isVisible())) {
            return;
        }
        await expect(cookiesModal).toBeEnabled();
        await cookiesModal.getByRole('button', { name: 'Potwierdź' }).click();
        await expect(cookiesModal).toBeHidden();
    }
}