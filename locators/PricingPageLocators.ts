import { Page, Locator } from '@playwright/test';

/**
 * Locators for Origin Energy Pricing page
 */
export class PricingPageLocators {
  readonly page: Page;
  readonly addressInput: Locator;
  readonly addressSuggestions: Locator;
  readonly gasCheckbox: Locator;
  readonly planBPIDLink: Locator;
  readonly plansContainer: Locator;
  readonly planCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressInput = page.locator('input[placeholder*="address"], input[type="text"]').first();
    this.addressSuggestions = page.locator('ul[role="listbox"], li[role="option"]');
    this.gasCheckbox = page.locator('input[type="checkbox"][name*="gas"], label:has-text("Gas")');
    this.planBPIDLink = page.locator('a[href*="plan"], td:has-text("BPID") >> .. >> a').first();
    this.plansContainer = page.locator('[class*="plan"], [data-testid*="plan"]');
    this.planCards = page.locator('[class*="card"], [class*="plan-item"]');
  }

}
export const ADDRESS_SEEARCH_BOX_ID = '//input[@id="address-lookup" and @type="text"]';
export const PLAN_LIST_CONTAINER = '//div[@id="searchResultsContainer"]';
export const PLAN_LIST_DISTRIBUTOR_COL="//th[text()='Distributor']";
export const PLAN_LIST_BPID_EFS_COL="//th[text()='BPID/EFS']";
export const PLAN_LIST_ENERGY_TYPE_COL="//th[text()='Energy type']";
export const PLAN_LIST_TARIFF_TYPE_COL="//th[text()='Tariff type']";
export const ELECTRICITY_CHECKBOX = '//input[@type="checkbox" and @name="electricity"]';