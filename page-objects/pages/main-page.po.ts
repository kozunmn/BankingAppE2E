import { Page, Locator, BrowserContext, expect } from '@playwright/test';
import { BasePage } from './base-page.po';
import { ContactFormPage } from './contact-form-page.po';
import { NavWithLogoComponent } from '../navi-with-logo.po';

export class MainPage extends BasePage {
    /* 
    Komponenty (czyli złożone obiekty z własnymi metodami) — inicjalizowane w konstruktorze, co gwarantuje, że komponent jest spójny przez cały cykl życia Page Objecta
    Można użyć getter'ów - podejście zależy od projektu. Generalnie jeśli komponent ma stan (np. zapamiętuje coś, ma cache, trzyma dane), warto go stworzyć raz

    Elementy UI (czyli pojedyncze Locatory) — udostępniamy przez gettery; tworzymy nową instancję przy każdym wywołaniu
   */
    readonly navWithLogoComponent: NavWithLogoComponent

    // page, bo przekazujemy instancję strony
    // this.navWithLogoComponent = new NavWithLogoComponent(this.page) — tzw. eager; łatwa reużywalność
    constructor(page: Page) {
        super(page);
        this.navWithLogoComponent = new NavWithLogoComponent(this.page);
    }

    /*
    Gettery dla elementów UI, ponieważ:
    tzw. lazy evaluation – locator tworzony tylko wtedy, gdy jest potrzebny
    Mniej kodu w konstruktorze – konstruktor pozostaje czysty i przejrzysty
    Łatwiejsze refaktoryzowanie – zmiana selektora w jednym miejscu
    Zgodność z zasadą SRP (Single Responsibility Principle) – konstruktor nie miesza się z logiką UI
    Na minus(-) to, ze każde wywołanie this.element tworzy nowy locator (ale Playwright jest zoptymalizowany pod tym kątem, więc to nie problem w praktyce)
    */
    get writeToUsLink() {
        return this.page.getByText('Napisz do nas');
    }

    async gotoMainPage(): Promise<MainPage> { // Promise jawnie wskazany, aby kod był czytelniejszy
        await this.page.goto('/', { waitUntil: 'networkidle' }); // domyślny waitUntil: 'load' może być flaky przy aplikacjach typu SPA(React, Angular...)
        await this.closeCookiesModal();
        return this; // zgodnie ze wzorcem PO w wyniku akcji .goto() zmienia się kontekst, zatem zwracamy nowy po
    }

    /*
    Akcje na elemencie mają w sobie auto-waity, ale w aplikacjach typu SPA(React, Angular...) bywają zawodne/nieprzewidywalne, gdy np. występuje lazy-loading, animacje fade-in itp.
    Po auto-wait'ach element może być dla Palywright'a technicznie obecny w DOM, mimo że użytkownik na stronie nadal go nie widzi (jest np. przezroczysty). Playwright nie jest świadomy, że np. element nie ma jeszcze event listenera. Może go kliknąć… i nic się nie stanie
    Podsumowując:
    Lepsza diagnostyka błędów - jeśli element nie pojawi się na czas — expect(...).toBeVisible() zwróci jasny komunikat typu: „Element niewidoczny”. Samo click() w przypadku problemów może rzucić ogólny timeout bez jasnego kontekstu
    Wymuszenie kolejności zdarzeń - ręczne/jawne oczekiwanie pozwala dokładniej zsynchronizować interakcje z rzeczywistym stanem UI i odczuciami użytkownika. Użytkownik może postrzegać "gotowość" elementu inaczej niż Playwright technicznie to ocenia
    */
    async gotoContactFormPage(context: BrowserContext): Promise<ContactFormPage> {
        await this.waitForLoaded(this.writeToUsLink);
        // Promise.all, bo zapewnia minimalne opóźnienie + wygodne przy wielu równoległych oczekiwaniach. Niekiedy chcemy łączyć więcej niż jedną akcję i jeden listener, a taki zapis – równoległy, od początku stosowany - wprowadzi jednolitość/spójność w kodzie 
        const [newPage] = await Promise.all([
            context.waitForEvent('page'),
            this.writeToUsLink.click(),
        ]);
        await newPage.waitForResponse((resp) => resp.url().includes('/contactform/initContactForm')
            && resp.status() === 200); // samo "newPage.waitForResponse('**/contactform/initContactForm')" również zadziała, ale Playwright nie ma auto-weryfikacji statusów, a chcemy mieć pewność, że request się wykonał poprawnie 
        await expect(newPage).toHaveURL(/o-banku\/kontakt\/formularz-kontaktu/); // Upewniamy się, że routing się zakończył i aplikacja przeszła do konkretnego widoku
        return new ContactFormPage(newPage); // nastąpiła akcja zmieniajaca kontekst - tu przejscie do nowej karty, a więc nowa sesja przegladarki. Chcąc zachować kontrolę nad kontekstem powinnyśmy zwrócić nowy obiekt Page
    }
}