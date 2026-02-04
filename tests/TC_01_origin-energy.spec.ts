import { test } from './webUI.setup';
import { PlanDetailsPage } from '../pageSteps/PlanDetailsPage';
import { originAddress } from '../testData/TC01_originAddress_data';

test.describe('Origin Energy - Plan Search and Verification', () => {
  
  test('Search address, verify plans, and validate Gas plan PDF', async ({ pricingPage, planDetailsPage, browser }) => {
    const context = await browser.newContext({ acceptDownloads: true });
    await pricingPage.navigateToPricing();
    await pricingPage.searchAddress(originAddress);
    await pricingPage.verifyPlansDisplayed();
    await pricingPage.uncheckElectricity("Electricity");
    const pdfPage = await pricingPage.clickPlanLink('Origin Basic');
    const newPlanDetailsPage = new PlanDetailsPage(pdfPage);
    await newPlanDetailsPage.verifyPDFTabOpened();
    const pdfPath = await newPlanDetailsPage.downloadPDFToLocal();
    await newPlanDetailsPage.assertGasPlan(pdfPath, ["Gas", "Fuel type", "MJ/day"]);
    console.log('\nAll steps completed successfully!');
  });

});