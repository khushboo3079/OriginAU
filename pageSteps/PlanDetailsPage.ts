import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PlanDetailsPageLocators } from '../locators/PlanDetailsPageLocators';

/**
 * Page Object Model for Plan Details/PDF page
 */
export class PlanDetailsPage extends BasePage {
  private locators: PlanDetailsPageLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new PlanDetailsPageLocators(page);
  }

  /**
   * Download the PDF file
   * @returns The path to the downloaded file
   */
  async downloadPDF(): Promise<string> {
    // Wait for the page to load
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
    
    const downloadBtn = this.locators.downloadButton.first();
    
    if (await downloadBtn.count() > 0) {
      await downloadBtn.click();
    } else {
      // If no download button, the current page itself might be the PDF
      // Trigger download by navigating to the URL
      const url = this.page.url();
      if (url.includes('.pdf') || this.page.url().includes('EnergyFacts')) {
        // The page itself is a PDF, trigger download
        await this.page.evaluate(() => {
          window.location.href = window.location.href;
        });
      }
    }

    const download = await downloadPromise;
    
    // Save the download to a specific path
    const fileName = download.suggestedFilename() || 'plan.pdf';
    const filePath = `downloads/${fileName}`;
    await download.saveAs(filePath);
    
    return filePath;
  }

  /**
   * Get the URL of the PDF
   */
  async getPDFUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Check if the page is displaying a PDF
   */
  async isPDFPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('.pdf') || url.includes('EnergyFacts') || 
           await this.locators.pdfViewer.isVisible();
  }
}
