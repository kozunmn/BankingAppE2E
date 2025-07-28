import { Page, Locator, expect } from '@playwright/test';
import { MainPage } from '../page-objects/pages/main-page.po';
import { LoginModal } from './modals/login-modal.po';

export class NavWithLogoComponent {
    protected page: Page;
    protected modalLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modalLocator = this.page.locator('.logo-and-buttons');
    }

    get pageLogo() {
        return this.modalLocator.locator('.header__logo');
    }

    get searchInput() {
        return this.modalLocator.locator('#search');
    }

    get logInButton() {
        return this.modalLocator.locator('a', { hasText: 'Logowanie' });
    }

    get openAccountButton() {
        return this.modalLocator.locator('a', { hasText: 'Załóż konto' });
    }

    get borrowMoneyButton() {
        return this.modalLocator.locator('a', { hasText: 'Pożycz gotówkę' });
    }

    async waitForLoaded(element: Locator): Promise<void> {
        await expect(element).toBeVisible();
        await expect(element).toBeEnabled();
    }

    async backToMainPage(): Promise<MainPage> {
        await this.waitForLoaded(this.pageLogo);
        await this.pageLogo.click();
        return new MainPage(this.page);
    }

    async openLoginModal(): Promise<LoginModal> {
        await this.waitForLoaded(this.logInButton); // świadome ręczne/jawne oczekiwanie
        await this.logInButton.click(); // gdy już ręcznie obsłużyliśmy dostępność elementu możemy wykonać akcję
        return new LoginModal(this.page) // nastąpiła akcja zmieniajaca kontekst. Zgodnie z wzorcem PO powinnyśmy zwrócić nowy obiekt
    }
}