import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page.po';

export class ContactFormPage extends BasePage {
    private readonly expectedSiteHeader = 'Formularz kontaktowy';

    // TODO Page Objects


    async validateH2HeaderText(): Promise<void> {
        const sitHeader = this.page.locator('.bmp-contact-form-main h2');
        await expect(sitHeader).toBeEnabled();
        await expect(sitHeader).toBeVisible();
        await expect(sitHeader).toHaveText(this.expectedSiteHeader)
    }
}