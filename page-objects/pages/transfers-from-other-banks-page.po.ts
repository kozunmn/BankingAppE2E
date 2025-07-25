import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page.po';

export class TransfersFromOtherBanksPage extends BasePage {
    private readonly expectedSiteHeader = 'Przelewy z innych banków';

    // TODO Page Objects

    
    async validateH1HeaderText(): Promise<void> {
        const sitHeader = this.page.locator('nav h1');
        await expect(sitHeader).toBeEnabled();
        await expect(sitHeader).toBeVisible();
        await expect(sitHeader).toHaveText(this.expectedSiteHeader)
    }
}