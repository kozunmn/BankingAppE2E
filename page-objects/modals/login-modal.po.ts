import { Page, Locator, expect } from '@playwright/test';
import { BaseModal } from '../modals/base-modal.po';
import { TransfersFromOtherBanksPage } from '../pages/transfers-from-other-banks-page.po';

export class LoginModal extends BaseModal {
    constructor(page: Page) {
        super(page, '#dialog-msg');
    }

    get transfersFromOtherBanksLink() {
        return this.modalLocator.locator('a[href*="przelewy-z-innych-bankow"]');
    }

    async gotoTransfersFromOtherBanksPage(): Promise<TransfersFromOtherBanksPage> {
        await expect(this.transfersFromOtherBanksLink).toBeEnabled();
        await expect(this.transfersFromOtherBanksLink).toBeVisible();
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.transfersFromOtherBanksLink.click(),
        ]);
        await newPage.waitForLoadState('networkidle');
        await expect(newPage).toHaveURL(/bankowosc-elektroniczna\/przelewy-z-innych-bankow/);
        return new TransfersFromOtherBanksPage(newPage);
    }
}
