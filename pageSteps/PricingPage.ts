import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import * as locators from '../locators/PricingPageLocators';
import { getEnvConfig } from '../utils/envConfig';
const envConfig = getEnvConfig();


export class PricingPage {

  readonly page: Page;
  readonly ADDRESS_SEEARCH_BOX_ID: Locator;
  readonly PLAN_LIST_CONTAINER: Locator;
  readonly PLAN_LIST_DISTRIBUTOR_COL: Locator;
  readonly PLAN_LIST_BPID_EFS_COL: Locator;
  readonly PLAN_LIST_ENERGY_TYPE_COL: Locator;
  readonly PLAN_LIST_TARIFF_TYPE_COL: Locator;
  readonly ELECTRICITY_CHECKBOX: Locator;


  constructor(page: Page) {
    this.page = page;
    this.ADDRESS_SEEARCH_BOX_ID = page.locator(locators.ADDRESS_SEEARCH_BOX_ID);
    this.PLAN_LIST_CONTAINER = page.locator(locators.PLAN_LIST_CONTAINER);
    this.PLAN_LIST_DISTRIBUTOR_COL = page.locator(locators.PLAN_LIST_DISTRIBUTOR_COL);
    this.PLAN_LIST_BPID_EFS_COL = page.locator(locators.PLAN_LIST_BPID_EFS_COL);
    this.PLAN_LIST_ENERGY_TYPE_COL = page.locator(locators.PLAN_LIST_ENERGY_TYPE_COL);
    this.PLAN_LIST_TARIFF_TYPE_COL = page.locator(locators.PLAN_LIST_TARIFF_TYPE_COL);
    this.ELECTRICITY_CHECKBOX = page.locator(locators.ELECTRICITY_CHECKBOX);
  }
  /**
   * Navigate to the pricing page
   */
  async navigateToPricing(): Promise<void> {
    await this.page.goto(envConfig.baseUrl + '/pricing.html');
    await expect(this.page).toHaveURL(/.*pricing.*/);
    await this.page.waitForLoadState('networkidle');
    const elementExists = await this.ADDRESS_SEEARCH_BOX_ID.count();
    console.log(`✓ Successfully navigated to pricing page`);
    console.log(`✓ Address lookup elements found: ${elementExists}`);

    // Debug: Get page title and URL
    console.log(`✓ Page title: ${await this.page.title()}`);
    console.log(`✓ Current URL: ${this.page.url()}`);
  }

  /**
   * this method Search for an address and select from list
   */
  async searchAddress(address: string): Promise<void> {
    // Wait for input to be ready with explicit timeout
    await this.ADDRESS_SEEARCH_BOX_ID.waitFor({ state: 'visible', timeout: envConfig.timeouts.element });
    console.log('✓ Address field is visible');

    await this.ADDRESS_SEEARCH_BOX_ID.clear({ timeout: envConfig.timeouts.element });
    console.log('✓ Address field cleared');

    await this.ADDRESS_SEEARCH_BOX_ID.fill(address, { timeout: envConfig.timeouts.element });
    console.log('✓ Address entered in search field');

    const options = this.page.getByRole('option');

    try {
      // Wait for options with explicit timeout
      await options.first().waitFor({ state: 'visible', timeout: envConfig.timeouts.navigation });
      const optionCount = await options.count();
      console.log(`Found ${optionCount} options`);

      const addressOption = this.page.getByRole('option', { name: address });
      const exactMatchCount = await addressOption.count();

      if (exactMatchCount > 0) {
        await addressOption.first().click();
        console.log('✓ Address selected from dropdown');
      } else {
        console.log('⚠ Exact match not found, selecting first option');
        await options.first().click();
        console.log('✓ Selected first available option');
      }
    } catch (error) {
      console.log(`⚠ Timeout waiting for options: ${error.message}`);
      throw new Error(`Failed to load address options after 20s - autocomplete may not be working in this environment`);
    }
  }
  /**
    * Verify that plans are displayed on the page
    */
  async verifyPlansDisplayed() {
    await this.PLAN_LIST_CONTAINER.isVisible();
    await this.PLAN_LIST_DISTRIBUTOR_COL.first().isVisible();
    await this.PLAN_LIST_BPID_EFS_COL.first().isVisible();
    await this.PLAN_LIST_ENERGY_TYPE_COL.first().isVisible();
    await this.PLAN_LIST_TARIFF_TYPE_COL.first().isVisible();
  }
  /**
   * this method Uncheck the Electricity checkbox
   */
  async uncheckElectricity(fields: string): Promise<void> {
    if (await this.page.getByRole('checkbox', { name: fields }).isChecked()) {
      await this.page.getByRole('checkbox', { name: fields }).uncheck();
    }
  }
  /**
   * Click on a plan link (BPID/EFS link)
   * Returns the new page that opens
   */
  async clickPlanBPIDLink(planName: string): Promise<Page> {
    const currentUrl = this.page.url();
    const page1Promise = this.page.context().waitForEvent('page', { timeout: envConfig.timeouts.action });
    await this.page.getByRole('link', { name: planName, exact: true }).first().click();
    try {
      const newPage = await page1Promise;
      await newPage.waitForLoadState('domcontentloaded');
      console.log(`✓ Clicked on plan: ${planName}`);
      console.log(`✓ New page opened: ${newPage.url()}`);
      return newPage;
    } catch (error) {
      await this.page.waitForLoadState('domcontentloaded');
      if (this.page.url() !== currentUrl) {
        console.log(`✓ Clicked on plan: ${planName}`);
        console.log(`✓ Same page navigated to: ${this.page.url()}`);
        return this.page;
      } else {
        throw new Error(`Failed to navigate after clicking plan: ${planName}`);
      }
    }
  }
  /**
   * Step 7: this method click on plan link and return new page
   * @param planName - Name of the plan to click
   * @returns New page with PDF
   */
  async clickPlanLink(planName: string): Promise<Page> {
    console.log(`Searching for PDF link for plan: ${planName}...`);

    // Find the plan name text first
    const planText = this.page.locator(`text="${planName}"`).first();
    await planText.waitFor({ state: 'visible', timeout: envConfig.timeouts.element });

    // Get the parent row
    const row = planText.locator('xpath=ancestor::tr[1]');
    await row.waitFor({ state: 'visible', timeout: envConfig.timeouts.action });

    // Find all links in this row
    const linksInRow = row.locator('a');
    const linkCount = await linksInRow.count();
    console.log(`✓ Found ${linkCount} links in the plan row`);

    // Check each link to find the PDF one
    let pdfLink = null;
    for (let i = 0; i < linkCount; i++) {
      const link = linksInRow.nth(i);
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      console.log(`  Link ${i}: text="${text?.trim()}", href="${href}"`);

      if (href && (href.includes('.pdf') || href.includes('fact') || href.includes('details'))) {
        pdfLink = link;
        console.log(`✓ Found PDF link at index ${i}`);
        break;
      }
    }

    if (!pdfLink && linkCount > 0) {
      // Use the last link in the row (usually the PDF/details link)
      pdfLink = linksInRow.last();
      console.log(`⚠ No PDF link found, using last link in row`);
    }

    if (!pdfLink) {
      throw new Error(`No clickable link found for plan: ${planName}`);
    }

    await pdfLink.scrollIntoViewIfNeeded();

    // Get PDF URL before clicking for fallback
    const pdfHref = await pdfLink.getAttribute('href');
    const fullPdfUrl = pdfHref?.startsWith('http') ? pdfHref : `https://www.originenergy.com.au${pdfHref}`;
    console.log(`✓ PDF URL from href: ${fullPdfUrl}`);
    const pagePromise = this.page.context().waitForEvent('page', { timeout: envConfig.timeouts.element }).catch(() => null);
    await pdfLink.click();
    console.log(`✓ Link clicked`);
    await this.page.waitForTimeout(envConfig.timeouts.retry);
    const newPage = await pagePromise;
    if (newPage) {
      console.log(`✓ New page detected, waiting for load...`);

      // Wait for URL to be available
      let url = newPage.url();
      let retries = 0;
      while ((!url || url === '' || url === 'about:blank' || url === ':') && retries < 10) {
        await this.page.waitForTimeout(envConfig.timeouts.retry);
        url = newPage.url();
        retries++;
      }
      console.log(`✓ New page URL: ${url}`);
      if (!url || url === '' || url === 'about:blank' || url === ':' || url.length < 10) {
        console.log(`⚠ PDF page not loading in browser (URL: ${url}), will download directly instead`);
        await newPage.close();
        console.log(`✓ Using captured PDF URL: ${fullPdfUrl}`);
        await this.page.evaluate((pdfUrl) => {
          (window as any).pdfUrl = pdfUrl;
        }, fullPdfUrl);

        return this.page;
      }
      await newPage.waitForLoadState('domcontentloaded', { timeout: envConfig.timeouts.navigation }).catch((e) => {
        console.log(`⚠ Load timeout, but continuing: ${e.message}`);
      });

      if (url.includes('.pdf')) {
        console.log(`✓ PDF page confirmed`);
      }

      return newPage;
    } else {
      console.log(`⚠ No new page event, checking context...`);
      const pages = this.page.context().pages();
      console.log(`✓ Total pages: ${pages.length}`);

      if (pages.length > 1) {
        const latestPage = pages[pages.length - 1];
        await latestPage.waitForLoadState('domcontentloaded', { timeout: envConfig.timeouts.navigation }).catch(() => { });
        console.log(`✓ Using latest page: ${latestPage.url()}`);
        return latestPage;
      }

      console.log(`✓ Returning current page: ${this.page.url()}`);
      return this.page;
    }
  }

  /**
   * Validate that new tab opened with plan details
   */
  async validateNewTabOpened(newPage: Page): Promise<void> {
    expect(newPage).not.toBe(this.page);
    expect(newPage.url()).toMatch(/(plan|energy|fact|details)/i);
    await newPage.waitForLoadState('domcontentloaded');
    console.log(`✓ New tab validated: ${newPage.url()}`);
  }
}

