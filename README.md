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

- **Page Object Model**: Maintainable test fixtures with centralized locators
- **TypeScript**: Type-safe with excellent IDE support  
- **PDF Validation**: Automated download and content verification
- **Docker Support**: Isolated container execution with docker-compose
- **Environment Config**: Configurable timeouts and settings
- **Detailed Reports**: HTML reports with screenshots, videos, and traces
- **Multi-Tab Handling**: Robust new page navigation
- **CI/CD Ready**: GitHub Actions compatible

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

### 4. Verify Setup

```bash
npm run verify
```

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

**Headless mode:**
```bash
npm test
```

**With visible browser:**
```bash
npm run test:headed
```

**Debug mode:**
```bash
npm run test:debug
```

**View reports:**
```bash
npm run report
```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

**Build and run:**
```bash
docker-compose up --build
```

**Run existing image:**
```bash
docker-compose up
```

**Run in background:**
```bash
docker-compose up -d
docker-compose logs -f
```

**Clean up:**
```bash
docker-compose down
```

Results are automatically saved to:
- `./test-results/` - Test artifacts & PDFs
- `./playwright-report/` - HTML reports

### Using Docker Commands

**Build:**
```bash
docker build -t originau-automation .
```

**Run:**
```bash
docker run --rm -v ${PWD}/test-results:/app/test-results -v ${PWD}/playwright-report:/app/playwright-report originau-automation
```

### Configuration

The `docker-compose.yml` sets:
- `CI=true` - Enables headless mode
- Auto-mounts test-results and playwright-report
- Network isolation for consistent testing

## 📝 Test Scenario

The automated test performs:

1. Navigate to pricing page
2. Search and select address
3. Verify energy plans displayed
4. Uncheck Electricity checkbox
5. Click 'Origin Basic' plan
6. Verify PDF opens (or download directly in Docker)
7. Download PDF to test-results/
8. Validate Gas keywords: ["Gas", "Fuel type", "MJ/day"]

### Configuration

**Test Data:** `testData/TC01_originAddress_data.ts`  
**Environment:** `utils/envConfig.ts` (timeouts, base URL)  
**Timeouts:** Configurable in envConfig (element: 10s, navigation: 20s, action: 5s)

## 🏗️ Architecture

### Page Object Model with Fixtures

**Test Fixtures** (`webUI.setup.ts`): Auto-initialized page objects  
**BasePage.ts**: Common navigation and utility methods  
**PricingPage.ts**: Address search, plan filtering, multi-tab navigation  
**PlanDetailsPage.ts**: PDF verification and download (works in both local & Docker)

### Key Features

✅ **Centralized Locators** - Separate files for easy maintenance  
✅ **Configurable Timeouts** - `envConfig.ts` for all wait times  
✅ **Docker Support** - PDF download fallback for headless mode  
✅ **Multi-Tab Handling** - Automatic new page detection  
✅ **PDF Validation** - Dynamic pdf-parse with keyword search  

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical documentation.  

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npm test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

### Docker CI/CD

```yaml
test-docker:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - run: docker-compose up --abort-on-container-exit
    - uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: test-results/
```

## 🐛 Troubleshooting

### Quick Fixes

**Browsers not installed:**
```bash
npx playwright install --with-deps chromium
```

**Elements not found:**
- Check locators in `locators/` directory
- Use debug mode: `npm run test:debug`
- Verify page loaded: Check console for "✓ Successfully navigated"

**Docker issues:**
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

**Test timeouts:**
- Adjust timeouts in `utils/envConfig.ts`
- Current: element (10s), navigation (20s), action (5s)

### Debug Commands

```bash
# Enable debug logs
DEBUG=pw:api npm test

# Run with inspector
npm run test:debug

# View test report
npm run report
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
