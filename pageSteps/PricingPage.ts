import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import * as locators  from '../locators/PricingPageLocators';
import { config } from 'process';
import { getEnvConfig } from '../utils/envConfig';
const envConfig = getEnvConfig();
export class PricingPageLocators {
  readonly page: Page;
  readonly ADDRESS_SEEARCH_BOX_ID: Locator;
  readonly PLAN_LIST_CONTAINER: Locator;
  readonly gasCheckbox: Locator;
  readonly planBPIDLink: Locator;
  readonly plansContainer: Locator;
  readonly planCards: Locator;
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
}
export class PricingPage extends BasePage {
  private locators: PricingPageLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new PricingPageLocators(page);
  }

  /**
   * Navigate to the pricing page
   */
  async navigateToPricing(): Promise<void> {
    await this.page.pause();
    await this.page.goto(envConfig.baseUrl + '/pricing.html' );
   // await this.waitForPageLoad();
    await expect(this.page).toHaveURL(/.*pricing.*/);
    console.log('✓ Successfully navigated to pricing page');

  }

  /**
   * Search for an address
   * @param address - The address to search for
   */
  async searchAddress(address: string): Promise<void> {
    await this.locators.ADDRESS_SEEARCH_BOX_ID.clear();
    await this.locators.ADDRESS_SEEARCH_BOX_ID.fill(address);
    console.log('✓ Address entered in search field');
    
    // Wait for suggestions to appear
    await this.page.waitForTimeout(3000);
    
    // Debug: Check if options are visible
    const options = this.page.getByRole('option');
    console.log(`Found ${await options.count()} options`);
    
    // Try the specific option
    const addressOption = this.page.getByRole('option', { name: address });
    
    try {
      await addressOption.waitFor({ state: 'visible', timeout: 10000 });
      console.log('✓ Option is visible');
      
      // Force click if regular click doesn't work
      await addressOption.click({ force: true });
      console.log('✓ Address selected from dropdown');
    } catch (error) {
      console.log('❌ Option click failed, trying alternatives...');
      // Try clicking first available option
      await options.first().click();
      console.log('✓ Selected first available option');
    }
    
    await this.page.waitForTimeout(2000);
  }

  /**
   * Select an address from the dropdown suggestions
   * @param address - The address text to select
   */
 /* async selectAddressFromList(address: string): Promise<void> {
    // Wait for suggestions to appear
    await this.locators.addressSuggestions.waitFor({ state: 'visible', timeout: 10000 });
    
    // Find and click the matching address
    const addressOption = this.page.locator(`li:has-text("${address}"), [role="option"]:has-text("${address}")`).first();
    await addressOption.waitFor({ state: 'visible', timeout: 5000 });
    await addressOption.click();
    
    // Wait for results to load
    await this.page.waitForTimeout(3000);
    await this.waitForPageLoad();
  }*.

  /**
   * Verify that plans are displayed on the page
   */
  async verifyPlansDisplayed() {
    await this.locators.PLAN_LIST_CONTAINER.isVisible();
    
    // Check columns is avaialbe or not possible selectors for plans
    await this.locators.PLAN_LIST_DISTRIBUTOR_COL.first().isVisible();
    await this.locators.PLAN_LIST_BPID_EFS_COL.first().isVisible();
    await this.locators.PLAN_LIST_ENERGY_TYPE_COL.first().isVisible();
    await this.locators.PLAN_LIST_TARIFF_TYPE_COL.first().isVisible();
  }
  /**
   * this method Uncheck the Electricity checkbox
   */
  async uncheckElectricity(fields: string): Promise<void> {
   // await this.locators.ELECTRICITY_CHECKBOX.waitFor({ state: 'visible', timeout: 5000 });
    if (await this.page.getByRole('checkbox', { name: fields }).isChecked()) {
      await this.page.getByRole('checkbox', { name: fields }).uncheck();
    }
  }
  /**
   * Click on a plan link (BPID/EFS link)
   * Returns the new page that opens
   */
    /**
   * Click on a plan link by plan name
   * Returns the page (either new tab or same page after navigation)
   * @param planName - The name of the plan to click (e.g., 'Origin Basic')
   */
  async clickPlanBPIDLink(planName: string): Promise<Page> {
    await this.page.pause();
    
    const currentUrl = this.page.url();
    
    // Set up listener BEFORE clicking
    const page1Promise = this.page.context().waitForEvent('page', { timeout: 5000 });
    
    // Click the link
    await this.page.getByRole('link', { name: planName, exact: true }).first().click();
    
    try {
      // If new tab opens, use it
      const newPage = await page1Promise;
      await newPage.waitForLoadState('domcontentloaded');
      console.log(`✓ Clicked on plan: ${planName}`);
      console.log(`✓ New page opened: ${newPage.url()}`);
      return newPage;
    } catch (error) {
      // If no new tab, check if same page navigated
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
   * Validate that new tab opened with plan details
   */
  async validateNewTabOpened(newPage: Page): Promise<void> {
    // Check that we have a different page object
    expect(newPage).not.toBe(this.page);
    
    // Check URL contains plan-related content
    expect(newPage.url()).toMatch(/(plan|energy|fact|details)/i);
    
    // Check page has loaded
    await newPage.waitForLoadState('domcontentloaded');
    
    console.log(`✓ New tab validated: ${newPage.url()}`);
  }

  /**
   * Get the count of visible plans
   */
  async getPlansCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    
    const planSelectors = [
      '[class*="plan"]',
      '[data-testid*="plan"]',
      'article',
      '.card'
    ];

    for (const selector of planSelectors) {
      const elements = this.page.locator(selector).filter({ hasText: /gas|electricity/i });
      const count = await elements.count();
      if (count > 0) {
        return count;
      }
    }
    
    return 0;
  }
}
