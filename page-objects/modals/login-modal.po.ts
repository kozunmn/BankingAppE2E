import { Page, Locator, expect } from '@playwright/test';
import { BaseModal } from '../modals/base-modal.po';
import { TransfersFromOtherBanksPage } from '../transfers-from-other-banks-page.po';

export class LoginModal extends BaseModal {
    constructor(page: Page) {
        super(page, '#dialog-msg');
    }

    async gotoTransfersFromOtherBanksPage(): Promise<TransfersFromOtherBanksPage> {
        const link = this.modalLocator.locator('a[href*="przelewy-z-innych-bankow"]');
        await expect(link).toBeEnabled();
        await expect(link).toBeVisible();
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            link.click(),
        ]);
        await newPage.waitForLoadState('networkidle');
        await expect(newPage).toHaveURL(/bankowosc-elektroniczna\/przelewy-z-innych-bankow/);
        return new TransfersFromOtherBanksPage(newPage);
    }
}
