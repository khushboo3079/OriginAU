import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import * as locators from '../locators/PlanDetailsPageLocators';
import { getEnvConfig } from '../utils/envConfig';
const fs = require('fs');
const path = require('path');
const envConfig = getEnvConfig();

export class PlanDetailsPage {

  readonly page: Page;
  readonly DOWNLOADBUTTON: Locator;

  constructor(page: Page) {
    this.page = page;
    this.DOWNLOADBUTTON = page.locator(locators.DOWNLOADBUTTON);
  }

  /**
   *  Verify new tab opened with PDF URL
   */
  async verifyPDFTabOpened(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    const currentUrl = this.page.url();
    console.log(`New tab URL: ${currentUrl}`);
    expect(currentUrl).toContain('.pdf');
    expect(currentUrl).toContain('origin');
    console.log(`✓ PDF page opened in new tab`);
  }

  /**
   *  Download PDF to local file system
   * @returns Path to downloaded PDF file
   */
  async downloadPDFToLocal(): Promise<string> {
    console.log('Downloading PDF');
    const pdfUrl = this.page.url();
    const fileName = pdfUrl.split('/').pop()?.split('?')[0] || `plan_${Date.now()}.pdf`;
    const pdfPath = `test-results/${fileName}`;
    const response = await this.page.context().request.get(pdfUrl);
    if (!response.ok()) {
      throw new Error(`Failed to download PDF: ${response.status()}`);
    }
    const buffer = await response.body();
    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(pdfPath, buffer);
    const fileSizeKB = (buffer.length / 1024).toFixed(2);
    console.log(`✓ PDF downloaded: ${pdfPath} (${fileSizeKB} KB)`);
    return pdfPath;
  }

  /**
   * Assert PDF content is a Gas plan
   * @param pdfPath - Path to the PDF file
   * @param searchStrings - Array of strings to validate in PDF
   */
  async assertGasPlan(pdfPath: string, searchStrings: string[]): Promise<void> {
    console.log(`Validating PDF content...`);
    
    const { PDFUtil } = require('../utils/PDFUtil');
    const pdfContent = await PDFUtil.extractTextFromPDF(pdfPath);
    const contentLower = pdfContent.toLowerCase();
    
    // Validate each search string
    for (const searchString of searchStrings) {
      const found = contentLower.includes(searchString.toLowerCase());
      expect(found).toBeTruthy();
      console.log(`✓ PDF contains "${searchString}"`);
    }
    
    console.log(`✓ All validations passed`);
  }
}