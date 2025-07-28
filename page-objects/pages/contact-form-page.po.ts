import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page.po';
import { NavWithLogoComponent } from '../navi-with-logo.po';

export class ContactFormPage extends BasePage {
    readonly navWithLogoComponent: NavWithLogoComponent
    private readonly expectedSiteHeader = 'Formularz kontaktowy';

    constructor(page: Page) {
        super(page);
        this.navWithLogoComponent = new NavWithLogoComponent(this.page);
    }

    get sitHeader() {
        return this.page.locator('.bmp-contact-form-main h2');
    }

    async validateH2Text(): Promise<void> {
        await expect(this.sitHeader).toBeEnabled();
        await expect(this.sitHeader).toBeVisible();
        await expect(this.sitHeader).toHaveText(this.expectedSiteHeader)
    }
}