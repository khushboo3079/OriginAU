import { test as base } from '@playwright/test';
import { PricingPage } from "../pageSteps/PricingPage";
import { PlanDetailsPage } from "../pageSteps/PlanDetailsPage";

type PageFixtures = {
  pricingPage: PricingPage;
  planDetailsPage: PlanDetailsPage;
};

export const test = base.extend<PageFixtures>({
  pricingPage: async ({ page }, use) => {
    await use(new PricingPage(page));
  },

  planDetailsPage: async ({ page }, use) => {
    await use(new PlanDetailsPage(page));
  }
});

