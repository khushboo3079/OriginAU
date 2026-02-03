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
- Plan details navigation
- PDF download and content validation

## ✨ Features

- **Page Object Model (POM)**: Maintainable and reusable page classes
- **TypeScript**: Type-safe code with excellent IDE support
- **Robust Locators**: Multiple fallback strategies for element location
- **PDF Validation**: Automated PDF download and content verification
- **Docker Support**: Run tests in isolated containers
- **Detailed Logging**: Step-by-step console output for debugging
- **Screenshots & Videos**: Automatic capture on test failures
- **HTML Reports**: Beautiful test reports with trace viewer

## 📁 Project Structure

```
OriginAU/
├── pages/                      # Page Object Model classes
│   ├── BasePage.ts            # Base class with common methods
│   ├── PricingPage.ts         # Pricing page interactions
│   └── PlanDetailsPage.ts     # Plan details page interactions
├── tests/                      # Test specifications
│   └── origin-energy.spec.ts  # Main test suite
├── utils/                      # Utility classes
│   └── PDFUtil.ts             # PDF parsing and validation
├── downloads/                  # Downloaded PDF files (auto-created)
├── test-results/              # Test execution results
├── playwright-report/         # HTML test reports
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
├── Dockerfile                 # Docker image configuration
├── docker-compose.yml         # Docker Compose setup
└── README.md                  # This file
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

## 🚀 Running Tests

### Standard Test Execution

Run tests in headless mode (default):

```bash
npm test
```

### Run Tests with UI (Headed Mode)

See the browser during test execution:

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

### View Test Reports

After test execution, view the HTML report:

```bash
npm run report
```

This opens an interactive HTML report showing:
- Test results
- Screenshots
- Videos (on failure)
- Trace viewer for detailed debugging

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

1. **Navigate** to https://www.originenergy.com.au/pricing.html
2. **Search** for address: "17 Bolinda Road, Balwyn North, VIC 3104"
3. **Select** the address from the dropdown list
4. **Verify** that energy plans are displayed
5. **Uncheck** the Electricity checkbox
6. **Verify** that Gas plans are still displayed
7. **Click** on a plan link in the Plan BPID/EFS column
8. **Verify** that the plan details page opens in a new tab
9. **Download** the plan PDF file to local file system
10. **Assert** that the PDF content confirms it is a Gas plan

## 🏗️ Architecture

### Page Object Model (POM)

The project follows the Page Object Model pattern for better maintainability:

#### BasePage.ts
- Common methods shared across all pages
- Navigation, waiting, screenshot utilities

#### PricingPage.ts
- Address search and selection
- Plan filtering (Electricity/Gas)
- Plan verification
- Checkbox interactions

#### PlanDetailsPage.ts
- PDF download functionality
- PDF URL extraction
- Page verification

### Utilities

#### PDFUtil.ts
- PDF text extraction using `pdf-parse`
- Gas plan validation
- PDF metadata extraction
- Content verification

### Best Practices Implemented

✅ **Robust Locators**: Multiple fallback strategies for element location  
✅ **Explicit Waits**: Proper synchronization with page loading  
✅ **Type Safety**: Full TypeScript implementation  
✅ **Error Handling**: Graceful failure handling with detailed logging  
✅ **Reusability**: Modular code with DRY principles  
✅ **Maintainability**: Clear separation of concerns  
✅ **Scalability**: Easy to extend with new pages and tests  

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
npm install --save-dev @types/pdf-parse
```

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

**Solution**: Increase timeouts in `playwright.config.ts`:
```typescript
timeout: 180000, // 3 minutes
use: {
  actionTimeout: 30000,
  navigationTimeout: 30000,
}
```

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

- **HTML Report**: `playwright-report/index.html`
- **Screenshots**: `test-results/` (on failure)
- **Videos**: `test-results/` (on failure)
- **Traces**: Available in HTML report for debugging
- **Downloads**: `downloads/` (PDF files)

## 🔐 Security Notes

- **Credentials**: No credentials are hardcoded in the tests
- **Environment Variables**: Use `.env` file for sensitive data (not included in repo)
- **PDF Files**: Downloaded PDFs are gitignored for privacy

## 📄 License

This project is created for assessment purposes.

## 👤 Author

Created as part of the Origin Energy Web UI Automation assessment.

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Playwright documentation: https://playwright.dev
3. Check test execution logs and reports

---

**Happy Testing! 🎭**
