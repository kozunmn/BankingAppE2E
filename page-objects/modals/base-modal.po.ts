import { Page, Locator, expect } from '@playwright/test';

export class BaseModal {
    protected page: Page;
    protected modalLocator: Locator;

    constructor(page: Page, modalSelector: string) {
        this.page = page;
        this.modalLocator = page.locator(modalSelector);
    }

    async validateModalTitle(expectedTitle: string): Promise<void> {
        const modalTitle = this.modalLocator.locator('#dialog-title');
        await expect(modalTitle).toBeEnabled();
        await expect(modalTitle).toBeVisible();
        await expect(modalTitle).toHaveText(expectedTitle)
    }

    async close(): Promise<void> {
        if (await this.modalLocator.isVisible()) {
            const closeIcon = this.modalLocator.locator('[class*="close"]');
            await expect(closeIcon).toBeEnabled();
            await expect(closeIcon).toBeVisible();
            await closeIcon.click();
        }
    }
}