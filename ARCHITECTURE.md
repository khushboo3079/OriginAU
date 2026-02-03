# Origin Energy Automation - Technical Details

## 🔍 Design Decisions

### 1. Page Object Model (POM) Pattern

**Why POM?**
- **Maintainability**: Changes to UI require updates in one place only
- **Reusability**: Page methods can be used across multiple tests
- **Readability**: Tests read like user stories
- **Scalability**: Easy to add new pages and functionality

### 2. Locator Strategy

**Multi-level Fallback Approach**:
```typescript
const addressInput = page.locator(
  'input[placeholder*="address" i], ' +
  'input[type="text"][name*="address" i], ' +
  'input[aria-label*="address" i]'
).first();
```

**Benefits**:
- Resilient to UI changes
- Handles different page structures
- Reduces test brittleness

### 3. Synchronization Strategy

**Implemented Techniques**:
- `waitForLoadState('networkidle')` - Wait for network requests
- `waitFor({ state: 'visible' })` - Ensure element visibility
- Strategic `waitForTimeout()` - Handle dynamic content
- Playwright's auto-waiting - Built-in smart waiting

### 4. PDF Validation

**Using pdf-parse Library**:
```typescript
static async isGasPlan(filePath: string): Promise<boolean> {
  const content = await this.extractTextFromPDF(filePath);
  return content.toLowerCase().includes('gas');
}
```

**Features**:
- Extract text from PDF
- Search for keywords
- Validate plan type
- Get PDF metadata

## 📊 Test Architecture

```
┌─────────────────────────────────────────┐
│         Test Specification              │
│     (origin-energy.spec.ts)            │
└──────────────┬──────────────────────────┘
               │
               ├──────────────┬──────────────┐
               │              │              │
        ┌──────▼─────┐ ┌─────▼──────┐ ┌────▼─────┐
        │  Pricing   │ │   Plan     │ │   PDF    │
        │    Page    │ │  Details   │ │   Util   │
        │   (POM)    │ │   (POM)    │ │ (Helper) │
        └──────┬─────┘ └─────┬──────┘ └────┬─────┘
               │              │              │
               └──────────────┴──────────────┘
                             │
                      ┌──────▼──────┐
                      │  Base Page  │
                      │   (Common)  │
                      └─────────────┘
```

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Playwright** | ^1.48.0 | Browser automation framework |
| **TypeScript** | ^5.6.0 | Type-safe development |
| **Node.js** | 18+ | Runtime environment |
| **pdf-parse** | ^1.1.1 | PDF content extraction |
| **Docker** | 20+ | Containerization |

## 🎯 Key Features

### 1. Robust Element Location

**Strategy Pattern Implementation**:
```typescript
async uncheckElectricity(): Promise<void> {
  const checkboxSelectors = [
    'input[type="checkbox"][id*="electricity" i]',
    'input[type="checkbox"][name*="electricity" i]',
    'label:has-text("Electricity") input[type="checkbox"]'
  ];

  for (const selector of checkboxSelectors) {
    const checkbox = this.page.locator(selector).first();
    if (await checkbox.count() > 0) {
      await checkbox.uncheck();
      return;
    }
  }
}
```

### 2. Dynamic Content Handling

**Wait Strategies**:
- Network idle state
- Element visibility
- Custom timeouts
- DOM content loaded

### 3. Multi-Tab Support

**New Tab/Window Handling**:
```typescript
const [newPage] = await Promise.all([
  this.page.context().waitForEvent('page'),
  links.first().click()
]);
```

### 4. File Download Management

**Download Handling**:
```typescript
const downloadPromise = page.waitForEvent('download');
// Trigger download action
const download = await downloadPromise;
await download.saveAs(filePath);
```

## 📈 Scalability Considerations

### Adding New Tests

1. Create new spec file in `tests/`
2. Import required page objects
3. Write test using POM methods
4. Run and verify

### Adding New Pages

1. Create new class extending `BasePage`
2. Define locators
3. Implement page-specific methods
4. Export for use in tests

### Adding New Utilities

1. Create utility class in `utils/`
2. Implement static methods
3. Add TypeScript types
4. Document usage

## 🔒 Security Best Practices

- ✅ No hardcoded credentials
- ✅ Environment variables for sensitive data
- ✅ Downloaded files gitignored
- ✅ Secure Docker image
- ✅ Minimal container permissions

## 🚀 Performance Optimizations

1. **Parallel Execution**: Tests can run in parallel (configured in playwright.config.ts)
2. **Browser Reuse**: Context reuse across tests
3. **Smart Waiting**: Playwright's auto-wait reduces unnecessary delays
4. **Selective Browser**: Only Chromium by default (can enable others)

## 📝 Code Quality

### TypeScript Benefits
- Type safety prevents runtime errors
- Better IDE support
- Self-documenting code
- Easier refactoring

### ESLint & Prettier
(Can be added for code consistency)

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts",
    "format": "prettier --write '**/*.ts'"
  }
}
```

## 🔄 Continuous Improvement

### Future Enhancements
- [ ] Add more browser coverage (Firefox, Safari)
- [ ] Implement visual regression testing
- [ ] Add accessibility testing
- [ ] API mocking for faster tests
- [ ] Database cleanup utilities
- [ ] Custom reporters
- [ ] Integration with test management tools

## 📖 References

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Last Updated**: February 2026
