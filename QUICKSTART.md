# Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
npm run install:browsers
```

### 2. Run Tests
```bash
npm test
```

### 3. View Results
```bash
npm run report
```

## 🐳 Docker Quick Start (3 minutes)

```bash
# Build and run
docker-compose up playwright-tests

# View results in ./playwright-report/
```

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run tests headless |
| `npm run test:headed` | Run with visible browser |
| `npm run test:debug` | Debug mode with inspector |
| `npm run test:ui` | Interactive UI mode |
| `npm run report` | View test report |

## 🎯 What Gets Tested?

1. ✅ Navigate to Origin Energy pricing
2. ✅ Search for address
3. ✅ Select from dropdown
4. ✅ Verify plans display
5. ✅ Filter by Gas only
6. ✅ Verify Gas plans
7. ✅ Click plan details
8. ✅ Open in new tab
9. ✅ Download PDF
10. ✅ Validate Gas plan content

## 📂 Where to Find Things

- **Tests**: `tests/origin-energy.spec.ts`
- **Pages**: `pages/` directory
- **Reports**: `playwright-report/index.html`
- **Downloads**: `downloads/` directory
- **Results**: `test-results/` directory

## 🐛 Troubleshooting

**Browser not found?**
```bash
npx playwright install chromium
```

**PDF parsing error?**
```bash
npm install pdf-parse
```

**Permission denied?**
```bash
mkdir -p downloads test-results playwright-report
```

## 📚 Learn More

- Full documentation: [README.md](README.md)
- Playwright docs: https://playwright.dev
- TypeScript docs: https://www.typescriptlang.org
