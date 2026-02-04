# Origin Energy - Web UI Automation

Automated testing solution for Origin Energy's pricing page using Playwright with TypeScript and the Page Object Model (POM) pattern.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Docker Setup (Bonus)](#docker-setup-bonus)
- [Test Scenario](#test-scenario)
- [Architecture](#architecture)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project automates the process of searching for energy plans on the Origin Energy website, specifically testing:
- Address search and selection
- Plan filtering (Electricity/Gas)
- Plan details navigation via new tabs
- PDF download and content validation
- Gas plan verification with multiple keywords

## ✨ Features

- **Page Object Model (POM)**: Maintainable and reusable page classes with test fixtures
- **Centralized Locators**: Separate locator files for easy maintenance
- **TypeScript**: Type-safe code with excellent IDE support
- **Test Fixtures**: Clean test setup using Playwright fixtures pattern
- **PDF Validation**: Automated PDF download and content verification with pdf-parse
- **Multi-Tab Handling**: Robust new page/tab navigation support
- **Environment Config**: Centralized configuration management
- **Docker Support**: Run tests in isolated containers
- **Detailed Logging**: Step-by-step console output with ✓ symbols for debugging
- **Screenshots & Videos**: Automatic capture on test failures
- **HTML Reports**: Beautiful test reports with trace viewer

## 📁 Project Structure

```
OriginAU/
├── tests/                              # Test specifications
│   ├── TC_01_origin-energy.spec.ts    # Main test suite
│   └── webUI.setup.ts                 # Test fixtures configuration
├── pageSteps/                          # Page Object Model classes
│   ├── BasePage.ts                    # Base class with common methods
│   ├── PricingPage.ts                 # Pricing page interactions
│   └── PlanDetailsPage.ts             # Plan details & PDF handling
├── locators/                           # Centralized element locators
│   ├── PricingPageLocators.ts         # Pricing page locators
│   └── PlanDetailsPageLocators.ts     # Plan details locators
├── testData/                           # Test data files
│   └── TC01_originAddress_data.ts     # Address test data
├── utils/                              # Utility classes
│   ├── PDFUtil.ts                     # PDF parsing and validation
│   └── envConfig.ts                   # Environment configuration
├── downloads/                          # Downloaded files (gitignored)
├── test-results/                       # Test execution results
├── playwright-report/                  # HTML test reports
├── playwright.config.ts                # Playwright configuration
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Project dependencies
├── Dockerfile                          # Docker image configuration
├── docker-compose.yml                  # Docker Compose setup
├── verify-setup.ts                     # Setup verification script
├── setup.js                            # Initial setup script
├── ARCHITECTURE.md                     # Technical architecture details
├── PROJECT_SUMMARY.md                  # Project completion summary
├── QUICKSTART.md                       # Quick reference guide
└── README.md                           # This file
```

## 🔧 Prerequisites

### Local Setup
- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: For cloning the repository

### Docker Setup (Optional)
- **Docker Desktop**: v20.x or higher ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose**: v2.x or higher (included with Docker Desktop)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd OriginAU
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install --with-deps
```

Or use the npm script:

```bash
npm run install:browsers
```

This command installs Chromium, Firefox, and WebKit browsers along with system dependencies.

### 4. Verify Setup (Optional)

Verify that everything is installed correctly:

```bash
npm run verify
```

This runs the `verify-setup.ts` script to check Node.js version, dependencies, and Playwright installation.

## 🚀 Running Tests

### Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests in headless mode |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:debug` | Debug mode with Playwright Inspector |
| `npm run test:ui` | Interactive UI mode for debugging |
| `npm run report` | Show HTML test report |
| `npm run verify` | Verify setup and dependencies |
| `npm run install:browsers` | Install Playwright browsers |
| `npm run setup` | Run initial setup script |

### Standard Test Execution

Run tests in headless mode (default):

```bash
npm test
```

### Run Tests with UI (Headed Mode)

See the browser during test execution with 500ms slow motion:

```bash
npm run test:headed
```

### Debug Mode

Run tests with Playwright Inspector for step-by-step debugging:

```bash
npm run test:debug
```

### UI Mode (Interactive)

Run tests using Playwright's UI mode for interactive debugging:

```bash
npm run test:ui
```

### Run Specific Test

```bash
npx playwright test tests/TC_01_origin-energy.spec.ts
```

### Run with Specific Browser

```bash
npx playwright test --project=chromium
```

### View Test Reports

After test execution, view the HTML report:

```bash
npm run report
```

This opens an interactive HTML report showing:
- Test results with pass/fail status
- Screenshots captured at each step
- Videos (retained on failure)
- Trace viewer for detailed debugging
- Console logs and network activity

## 🐳 Docker Setup (Bonus)

### Build and Run with Docker Compose

#### 1. Build the Docker Image

```bash
docker-compose build
```

#### 2. Run Tests in Docker

```bash
docker-compose up playwright-tests
```

#### 3. View Results

Test results, reports, and downloads are automatically mounted to your local directories:
- `./test-results/` - Test execution artifacts
- `./playwright-report/` - HTML reports
- `./downloads/` - Downloaded PDF files

#### 4. Clean Up

```bash
docker-compose down
```

### Alternative: Docker Commands

Build the image:

```bash
docker build -t origin-energy-tests .
```

Run tests:

```bash
docker run --rm \
  -v ${PWD}/test-results:/app/test-results \
  -v ${PWD}/playwright-report:/app/playwright-report \
  -v ${PWD}/downloads:/app/downloads \
  origin-energy-tests
```

### Rancher Desktop

If using Rancher Desktop instead of Docker Desktop:

1. Ensure Rancher Desktop is running
2. Set `dockerd (moby)` as the container runtime in Rancher settings
3. Use the same `docker-compose` commands as above

## 📝 Test Scenario

The automated test performs the following steps:

1. **Navigate** to the pricing page using environment configuration
2. **Search** for address from test data (originAddress)
3. **Select** the address from the dropdown list with fallback strategy
4. **Verify** that energy plans are displayed (multiple columns validation)
5. **Uncheck** the Electricity checkbox if checked
6. **Click** on 'Origin Basic' plan link
7. **Verify** that the PDF page opens in a new tab (URL contains '.pdf' and 'origin')
8. **Download** the PDF file to `test-results/` directory
9. **Validate** PDF contains Gas-related keywords: ["Gas", "Fuel type", "MJ/day"]
10. **Assert** all validations pass successfully

### Test Data
Address and configuration are centralized in:
- `testData/TC01_originAddress_data.ts` - Test addresses
- `utils/envConfig.ts` - Base URL and timeout configuration

## 🏗️ Architecture

### Page Object Model (POM) with Fixtures

The project follows the Page Object Model pattern with Playwright test fixtures for better maintainability:

#### Test Fixtures (webUI.setup.ts)
- Automatic page object initialization
- Clean dependency injection
- Type-safe fixtures for PricingPage and PlanDetailsPage

#### BasePage.ts
- Common methods shared across all pages
- Navigation with `goto()`
- Page load synchronization with `waitForPageLoad()`
- Screenshot and title utilities

#### PricingPage.ts
- Navigate to pricing page with URL validation
- Address search with smart fallback selection
- Plan verification (multiple column checks)
- Checkbox state management
- Multi-tab navigation support

#### PlanDetailsPage.ts
- PDF tab verification (URL contains '.pdf' and 'origin')
- PDF download via context.request API
- Local file system storage in test-results/
- Multi-keyword content validation

### Locators Layer

#### PricingPageLocators.ts
- Centralized locators for pricing page elements
- ADDRESS_SEEARCH_BOX_ID, PLAN_LIST_CONTAINER, etc.
- Easy to update when UI changes

#### PlanDetailsPageLocators.ts
- Locators for plan details page
- DOWNLOADBUTTON and other element selectors

### Utilities

#### PDFUtil.ts
- Dynamic pdf-parse initialization
- Text extraction: `extractTextFromPDF()`
- Content search: `containsText()`
- Case-insensitive keyword validation

#### envConfig.ts
- Base URL configuration
- Timeout settings
- Environment variable support via dotenv

### Best Practices Implemented

✅ **Centralized Locators**: Separate files for element selectors  
✅ **Test Fixtures**: Clean, reusable test setup  
✅ **Explicit Waits**: `waitForLoadState('domcontentloaded')`  
✅ **Type Safety**: Full TypeScript implementation  
✅ **Error Handling**: Try-catch with fallback strategies  
✅ **Logging**: Detailed console output with ✓ symbols  
✅ **Reusability**: Modular code with DRY principles  
✅ **Maintainability**: Clear separation of concerns  
✅ **Scalability**: Easy to extend with new fixtures and pages  
✅ **Multi-Tab Support**: Proper new page/window handling  
✅ **Environment Config**: Centralized configuration management  

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npm test
      
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Docker-based CI/CD

```yaml
test-docker:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    
    - name: Build and Run Tests
      run: |
        docker-compose build
        docker-compose up --abort-on-container-exit
        
    - name: Upload Results
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: test-results/
```

## 🐛 Troubleshooting

### Common Issues

#### Browser Installation Issues

**Problem**: Browsers not installed correctly

**Solution**:
```bash
npx playwright install --with-deps chromium
```

#### PDF Parsing Errors

**Problem**: `pdf-parse` module not found or errors

**Solution**:
```bash
npm install pdf-parse
# Note: @types/pdf-parse not needed - using dynamic import
```

#### Locator Issues

**Problem**: Elements not found

**Solution**:
- Check locators in `locators/PricingPageLocators.ts` or `locators/PlanDetailsPageLocators.ts`
- Use Playwright Inspector: `npm run test:debug`
- Verify page has loaded: check `waitForLoadState('domcontentloaded')`

#### Test Data Issues

**Problem**: Address not found or invalid

**Solution**:
- Update address in `testData/TC01_originAddress_data.ts`
- Ensure address exists on Origin Energy website
- Check network connectivity

#### Permission Errors (Linux/Mac)

**Problem**: Cannot write to downloads directory

**Solution**:
```bash
chmod -R 755 downloads/
mkdir -p downloads
```

#### Docker Issues

**Problem**: Docker containers not starting

**Solution**:
```bash
# Reset Docker
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up
```

#### Test Timeout Issues

**Problem**: Tests timing out

**Solution**: Current timeout is set to 350 seconds in `playwright.config.ts`:
```typescript
timeout: 350 * 1000, // 350 seconds
```
If needed, increase this value. Also check:
- Network connectivity
- Website availability
- slowMo setting (currently 500ms for visibility)

### Debug Mode

For detailed debugging:

```bash
# Enable debug logs
DEBUG=pw:api npm test

# Run with inspector
npm run test:debug

# Run with trace
npm test -- --trace on
```

### Check Test Results

View detailed test results:

```bash
# Open HTML report
npm run report

# Or manually
npx playwright show-report
```

## 📊 Test Reports

After running tests, several artifacts are generated:

- **HTML Report**: `playwright-report/index.html` - Interactive report with traces
- **JUnit XML**: `test-results/results.xml` - For CI/CD integration
- **Screenshots**: `test-results/` - Captured with `screenshot: 'on'`
- **Videos**: `test-results/` - Retained on failure with `video: 'retain-on-failure'`
- **Traces**: `test-results/` - Full traces with `trace: 'on'`
- **Downloaded PDFs**: `test-results/*.pdf` - Downloaded plan PDFs

### Viewing Reports

```bash
# Open HTML report
npm run report

# View specific trace
npx playwright show-trace test-results/trace.zip
```

## 🔐 Security Notes

- **Credentials**: No credentials are hardcoded in the tests
- **Environment Variables**: Use `.env` file for sensitive data (not included in repo)
  - Managed via `dotenv` package
  - Configuration loaded in `utils/envConfig.ts`
- **PDF Files**: Downloaded PDFs stored in `test-results/` (gitignored)
- **Test Data**: Centralized in `testData/` directory

### Environment Configuration

Create a `.env` file in the root directory (optional):

```env
BASE_URL=https://www.originenergy.com.au
TIMEOUT=30000
```

Configuration is accessed via `utils/envConfig.ts`:
```typescript
export const getEnvConfig = () => ({
  baseUrl: process.env.BASE_URL || 'https://www.originenergy.com.au',
  timeout: parseInt(process.env.TIMEOUT || '30000')
});
```

## 📚 Additional Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed technical architecture and design decisions
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project completion summary and deliverables
- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference guide for common tasks

## 🎯 Framework Features

### Test Fixtures Pattern
Tests use Playwright fixtures for clean dependency injection:
```typescript
test('example', async ({ pricingPage, planDetailsPage }) => {
  // Page objects are automatically initialized
  await pricingPage.navigateToPricing();
});
```

### Centralized Locators
Element selectors are maintained in separate files:
- `locators/PricingPageLocators.ts`
- `locators/PlanDetailsPageLocators.ts`

Benefits:
- Single source of truth for selectors
- Easy to update when UI changes
- Better code organization

### Multi-Tab Handling
Framework handles new tab/window scenarios:
```typescript
const newPage = await pricingPage.clickPlanBPIDLink('Origin Basic');
// Returns the new page object for further interactions
```

### PDF Validation
Comprehensive PDF validation with multiple keywords:
```typescript
await planDetailsPage.assertGasPlan(pdfPath, ["Gas", "Fuel type", "MJ/day"]);
// Validates all keywords exist in PDF content
```

## 📄 License

This project is created for assessment purposes.

## 👤 Author

Created as part of the Origin Energy Web UI Automation assessment.

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
3. Check test execution logs and reports
4. Review Playwright documentation: https://playwright.dev
5. Inspect element locators in `locators/` directory

## 🧪 Test Configuration

### Current Configuration (playwright.config.ts)

- **Timeout**: 350 seconds per test
- **Workers**: 1 (sequential execution)
- **Parallel**: false
- **Retries**: 0 (local), 2 (CI)
- **Browser**: Chromium (maximized window)
- **Headless**: false (visible browser)
- **Slow Motion**: 500ms (for visibility)
- **Screenshots**: Always captured (`screenshot: 'on'`)
- **Videos**: Retained on failure (`video: 'retain-on-failure'`)
- **Traces**: Always enabled (`trace: 'on'`)

### Reporters

1. **HTML** - Interactive report in `playwright-report/`
2. **JUnit XML** - CI/CD integration in `test-results/results.xml`
3. **List** - Console output with progress

## 🔧 Extending the Framework

### Adding a New Page Object

1. **Create locator file**:
   ```typescript
   // locators/NewPageLocators.ts
   export const NEW_ELEMENT = '#newElement';
   ```

2. **Create page class**:
   ```typescript
   // pageSteps/NewPage.ts
   import { Page, Locator } from '@playwright/test';
   import * as locators from '../locators/NewPageLocators';
   
   export class NewPage {
     readonly page: Page;
     readonly NEW_ELEMENT: Locator;
     
     constructor(page: Page) {
       this.page = page;
       this.NEW_ELEMENT = page.locator(locators.NEW_ELEMENT);
     }
     
     async performAction(): Promise<void> {
       await this.NEW_ELEMENT.click();
     }
   }
   ```

3. **Add to fixtures**:
   ```typescript
   // tests/webUI.setup.ts
   export const test = base.extend<PageFixtures>({
     newPage: async ({ page }, use) => {
       await use(new NewPage(page));
     }
   });
   ```

### Adding Test Data

Create new file in `testData/` directory:
```typescript
// testData/TC02_newData.ts
export const newTestData = {
  field1: 'value1',
  field2: 'value2'
};
```

### Adding Utilities

Create utility class in `utils/`:
```typescript
// utils/NewUtil.ts
export class NewUtil {
  static async helperMethod(): Promise<void> {
    // Implementation
  }
}
```

---

**Happy Testing! 🎭**
