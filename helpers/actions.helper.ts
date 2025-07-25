import { Page, Locator, expect } from '@playwright/test';


export async function navigateToByUrl(page: Page, urlPath: string = "/", baseURL?: string): Promise<Page> {
    const targetUrl = urlPath === "/" ? baseURL ?? urlPath : urlPath;
    const expectedUrl = new RegExp(`${targetUrl}.*`);
    await page.goto(urlPath, { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(expectedUrl);
    return page;
}

export async function scrollToBottomAndCollectErrors() {
    const networkErrors: string[] = [];
    const consoleErrors: string[] = [];

    this.page.on('requestfailed', req => {
        networkErrors.push(`[${req.method()}] ${req.url()} — ${req.failure()?.errorText}`);
    });

    this.page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    let prevHeight = await this.page.evaluate(() => document.body.scrollHeight);
    while (true) {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(1000);
        const currHeight = await this.page.evaluate(() => document.body.scrollHeight);
        if (currHeight === prevHeight) break;
        prevHeight = currHeight;
    }

    return { networkErrors, consoleErrors };
}