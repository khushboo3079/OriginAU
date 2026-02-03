import { Page, Locator } from '@playwright/test';

/**
 * Locators for Plan Details Page
 */
export class PlanDetailsPageLocators {
  readonly page: Page;
  readonly downloadButton: Locator;
  readonly pdfViewer: Locator;
  readonly planTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.downloadButton = page.locator('button:has-text("Download"), a:has-text("Download"), [download]');
    this.pdfViewer = page.locator('embed[type="application/pdf"], object[type="application/pdf"]');
    this.planTitle = page.locator('h1, h2, .title');
  }
}
