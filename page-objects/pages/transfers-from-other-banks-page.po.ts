import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base-page.po';
import { NavWithLogoComponent } from '../navi-with-logo.po';

export class TransfersFromOtherBanksPage extends BasePage {
    private readonly expectedSiteHeader = 'Przelewy z innych banków';
    readonly navWithLogoComponent: NavWithLogoComponent

    constructor(page: Page) {
        super(page);
        this.navWithLogoComponent = new NavWithLogoComponent(this.page);
    }

    get sitHeader() {
        return this.page.locator('nav h1');
    }

    async validateH1Text(): Promise<void> {
        await expect(this.sitHeader).toBeEnabled();
        await expect(this.sitHeader).toBeVisible();
        await expect(this.sitHeader).toHaveText(this.expectedSiteHeader)
    }
}