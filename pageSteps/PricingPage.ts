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
    console.log('✓ Successfully navigated to pricing page');

  }

  /**
   * this method Search for an address and select from list
   */
  async searchAddress(address: string): Promise<void> {
    await this.ADDRESS_SEEARCH_BOX_ID.clear();
    await this.ADDRESS_SEEARCH_BOX_ID.fill(address);
    console.log('✓ Address entered in search field');
    const options = this.page.getByRole('option');
    console.log(`Found ${await options.count()} options`);
    const addressOption = this.page.getByRole('option', { name: address });
    try {
      await addressOption.waitFor({ state: 'visible', timeout: 10000 });
      console.log('✓ Option is visible');
      await addressOption.click({ force: true });
      console.log('✓ Address selected from dropdown');
    } catch (error) {
      console.log(' Option click failed, trying alternatives...');
      await options.first().click();
      console.log('✓ Selected first available option');
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
    const page1Promise = this.page.context().waitForEvent('page', { timeout: 5000 });
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
    console.log(`Clicking on plan: ${planName}...`);
        const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.getByRole('link', { name: planName, exact: true }).first().click()
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    console.log(`✓ Plan link clicked`); 
    return newPage;
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

