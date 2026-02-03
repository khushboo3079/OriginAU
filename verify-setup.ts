import { chromium } from '@playwright/test';

/**
 * Verification script to check if the setup is correct
 * Run with: npx ts-node verify-setup.ts
 */
async function verifySetup() {
  console.log('🔍 Verifying Playwright Setup...\n');

  try {
    // Check Node.js version
    console.log('✓ Node.js version:', process.version);
    const nodeMajorVersion = parseInt(process.version.slice(1).split('.')[0]);
    if (nodeMajorVersion < 18) {
      console.warn('⚠️  Warning: Node.js 18+ is recommended');
    }

    // Check if Playwright is installed
    console.log('✓ Playwright installed');

    // Try to launch browser
    console.log('\n📦 Testing browser launch...');
    const browser = await chromium.launch({ headless: true });
    console.log('✓ Chromium browser launched successfully');

    // Create a page and test navigation
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('\n🌐 Testing navigation...');
    await page.goto('https://www.example.com');
    console.log('✓ Navigation successful');

    // Clean up
    await browser.close();

    // Check project structure
    console.log('\n📁 Checking project structure...');
    const fs = require('fs');
    const path = require('path');

    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'playwright.config.ts',
      'pages/BasePage.ts',
      'pages/PricingPage.ts',
      'pages/PlanDetailsPage.ts',
      'tests/origin-energy.spec.ts',
      'utils/PDFUtil.ts'
    ];

    let allFilesExist = true;
    for (const file of requiredFiles) {
      const exists = fs.existsSync(path.join(process.cwd(), file));
      if (exists) {
        console.log(`✓ ${file}`);
      } else {
        console.log(`✗ ${file} - MISSING`);
        allFilesExist = false;
      }
    }

    // Check directories
    console.log('\n📂 Checking directories...');
    const dirs = ['pages', 'tests', 'utils'];
    for (const dir of dirs) {
      if (fs.existsSync(path.join(process.cwd(), dir))) {
        console.log(`✓ ${dir}/`);
      } else {
        console.log(`✗ ${dir}/ - MISSING`);
        allFilesExist = false;
      }
    }

    // Create downloads directory if it doesn't exist
    const downloadsDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
      console.log('✓ Created downloads/ directory');
    } else {
      console.log('✓ downloads/');
    }

    // Final verdict
    console.log('\n' + '='.repeat(50));
    if (allFilesExist) {
      console.log('✅ Setup verification PASSED!');
      console.log('\nYou can now run tests with:');
      console.log('  npm test');
      console.log('  npm run test:headed');
      console.log('  npm run test:ui');
    } else {
      console.log('❌ Setup verification FAILED!');
      console.log('\nPlease check the missing files above.');
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Run: npm install');
    console.log('2. Run: npx playwright install --with-deps');
    console.log('3. Check that all files are in the correct locations');
    process.exit(1);
  }
}

// Run verification
verifySetup().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
