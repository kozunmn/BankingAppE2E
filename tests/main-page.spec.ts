import { test, expect } from '@playwright/test';
import * as actionsHelper from '../helpers/actions.helper'
import { MainPage } from '../page-objects/pages/main-page.po';

let mainPage: MainPage;

// .gotoMainPage() powtarza się dla kazdego testu, więc wynosimy do before
test.beforeEach(async ({ page }) => {
  mainPage = await new MainPage(page)
  .gotoMainPage(); // zgodnie ze wzorcem PO zapisujemy obiekt zwrócony przez gotoMainPage() jako mainPage. Teraz możemy na tym kontekście pracować
});

test.describe(`When we go to the bank's home page`, () => {
  test('the login modal should open correctly', async () => {
    const loginModal = await mainPage.openLoginModal(); // analogicznie jak wyżej. Akcja zmienia kontekst, więc przechodzimy do nowego page objectu
    await loginModal.validateModalTitle('Logowanie do Millenetu');
  });

  test('the link to the contact form should redirect correctly', async ({context}) => {
    const contactFormPage = await mainPage.gotoContactFormPage(context); // przekazujemy context, bo otwiera się strona w nowej zakładce w ramach tego samego browserContext 
    await contactFormPage.validateH2HeaderText();
  });

  test('no errors should appear on the page', async () => {
    const { networkErrors, consoleErrors } = await actionsHelper.scrollToBottomAndCollectErrors(); // tak jak w przypadku każdych testów staramy się oddzielić logikę biznesową od funkcji testowej: czytelność, bo przegladając test chcemy się skupić na scenariuszu, łatwe utrzymanie/refactoring
    expect.soft(networkErrors, 'Network errors').toHaveLength(0);
    expect.soft(consoleErrors, 'Console errors').toHaveLength(0); // soft asercje, bo chcemy zebrać wszystko za jednym uruchomieniem
  });
});

test.describe('When the login modal displays', () => {
  test('links should correctly redirect to articles', async () => {
    const loginModal = await mainPage.openLoginModal();
    const newPage = await loginModal.gotoTransfersFromOtherBanksPage();
    await newPage.validateH1HeaderText();
  });
});
