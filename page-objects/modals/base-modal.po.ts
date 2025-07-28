import { Page, Locator, expect } from '@playwright/test';

export class BaseModal {
    protected page: Page;
    protected modalLocator: Locator;

    constructor(page: Page, modalSelector: string) {
        this.page = page;
        this.modalLocator = page.locator(modalSelector); // chcemy odseparować obszar wyszukiwania elementów
    }

    get modalTitle() {
        return this.modalLocator.locator('#dialog-title');
    }

    get closeIcon() {
        return this.modalLocator.locator('[class*="close"]');
    }

    async validateModalTitle(expectedTitle: string): Promise<void> {
        await expect(this.modalTitle).toBeEnabled();
        await expect(this.modalTitle).toBeVisible();
        await expect(this.modalTitle).toHaveText(expectedTitle)
    }

    async close(): Promise<void> {
        if (await this.modalLocator.isVisible()) {
            await expect(this.closeIcon).toBeEnabled();
            await expect(this.closeIcon).toBeVisible();
            await this.closeIcon.click();
        }
    }
}