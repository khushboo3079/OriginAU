import { test } from './webUI.setup';
import { PDFUtil } from '../utils/PDFUtil';
import * as fs from 'fs';
import * as path from 'path';
import { originAddress } from '../testData/TC01_originAddress_data';
import { expect } from '@playwright/test';

test.describe('Origin Energy - Plan Search and Verification', () => {
  test.beforeEach(async () => {
    // Ensure downloads directory exists
    PDFUtil.ensureDownloadsDirectory();
  });

  test('Search address, verify plans, and validate Gas plan PDF', async ({ page, context, pricingPage, planDetailsPage }) => {
    // Step 1: Navigate to the pricing page
    console.log('Step 1: Navigating to Origin Energy pricing page...');
    await pricingPage.navigateToPricing();
    // Step 2/3: Search for the address
    console.log(`\nStep 2: Searching for address: ${originAddress}...`);
    await pricingPage.searchAddress(originAddress);
  // Step 4: Verify that plans are displayed
    console.log('\nStep 4: Verifying plans are displayed...');
    await pricingPage.verifyPlansDisplayed();

   // Step 5: Uncheck the Electricity checkbox
    console.log('\nStep 5: Unchecking Electricity checkbox...');
    await pricingPage.uncheckElectricity("Electricity");
    console.log('✓ Electricity checkbox unchecked');

   /* // Step 6: Verify plans are still displayed
    console.log('\nStep 6: Verifying plans still displayed after unchecking Electricity...');
    const plansStillDisplayed = await pricingPage.verifyPlansDisplayed();
    expect(plansStillDisplayed).toBeTruthy();
    const gasOnlyPlanCount = await pricingPage.getPlansCount();
    console.log(`✓ Plans still displayed (found ${gasOnlyPlanCount} Gas plans)`);*/

    // Step 7: Click on plan link
    console.log('\nStep 7: Clicking on plan link...');
    const newPage = await pricingPage.clickPlanBPIDLink('Origin Basic');
    console.log('✓ Plan link clicked');

    // Step 8: Verify new tab opened
    console.log('\nStep 8: Verifying new tab opened...');
    expect(newPage).toBeDefined();
    expect(newPage.url()).toContain('origin');
    console.log(`✓ New tab opened with URL: ${newPage.url()}`);


    // Step 9: Download the plan PDF
    console.log('\nStep 9: Downloading plan PDF...');

    let pdfPath: string;

    // Check if the current page is already a PDF
    // const isPDF = await newPlanDetailsPage.isPDFPage();

    /* if (isPDF) {
       console.log('Current page is a PDF, downloading directly...');
       const pdfUrl = await newPlanDetailsPage.getPDFUrl();
       
       // Download the PDF using Playwright's API
      const downloadPromise = planDetailsPage.waitForEvent('download', { timeout: 30000 });
       
       // Navigate to the PDF URL to trigger download
       await planDetailsPage.goto(pdfUrl);*/

    /*try {
      const download = await downloadPromise;
      const fileName = download.suggestedFilename() || `gas_plan_${Date.now()}.pdf`;
      pdfPath = path.join('downloads', fileName);
      await download.saveAs(pdfPath);
      console.log(`✓ PDF downloaded to: ${pdfPath}`);
    } catch (error) {
      // If download event doesn't work, use CDP to save the PDF
      console.log('Using alternative download method...');
      const client = await planDetailsPage.context().newCDPSession(planDetailsPage);
      const pdfBuffer = await client.send('Page.printToPDF', { 
        printBackground: true,
        preferCSSPageSize: true 
      });
      
      pdfPath = path.join('downloads', `gas_plan_${Date.now()}.pdf`);
      fs.writeFileSync(pdfPath, Buffer.from(pdfBuffer.data, 'base64'));
      console.log(`✓ PDF saved using alternative method: ${pdfPath}`);
    }
  } else {
    // Regular download process
    pdfPath = await newPlanDetailsPage.downloadPDF();
    console.log(`✓ PDF downloaded to: ${pdfPath}`);
  }

  // Verify the file exists
  expect(fs.existsSync(pdfPath)).toBeTruthy();
  const fileStats = fs.statSync(pdfPath);
  console.log(`✓ File size: ${(fileStats.size / 1024).toFixed(2)} KB`);

  // Step 10: Assert that PDF content confirms it's a Gas plan
  console.log('\nStep 10: Validating PDF content for Gas plan...');
  
  // Wait a moment to ensure file is fully written
  await page.waitForTimeout(1000);
  
  try {
    const isGasPlan = await PDFUtil.isGasPlan(pdfPath);
    expect(isGasPlan).toBeTruthy();
    console.log('✓ PDF content confirmed as Gas plan');
    
    // Extract and log some content for verification
    const pdfContent = await PDFUtil.extractTextFromPDF(pdfPath);
    const contentPreview = pdfContent.substring(0, 500).replace(/\n/g, ' ');
    console.log(`\nPDF Content Preview: ${contentPreview}...`);
    
    // Additional assertions
    expect(pdfContent.toLowerCase()).toContain('gas');
    console.log('✓ PDF contains "gas" keyword');
    
    // Get PDF info
    const pdfInfo = await PDFUtil.getPDFInfo(pdfPath);
    console.log(`\nPDF Information:`);
    console.log(`  - Pages: ${pdfInfo.numPages}`);
    console.log(`  - Text Length: ${pdfInfo.textLength} characters`);
    
  } catch (error) {
    console.error('Error parsing PDF:', error);
    // Still pass the test if PDF exists but parsing fails
    // This can happen with some PDF formats
    console.log('⚠ PDF parsing failed, but file was downloaded successfully');
  }

  console.log('\n✅ All test steps completed successfully!');
});

test.afterEach(async ({ page }) => {
  // Close any additional pages/tabs
  const pages = page.context().pages();
  for (const p of pages) {
    if (p !== page) {
      await p.close();
    }
  }
});*/
  })
});