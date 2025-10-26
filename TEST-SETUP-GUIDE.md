# Test Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all testing dependencies including:
- vitest
- @testing-library/react
- @testing-library/jest-dom
- @testing-library/user-event
- @playwright/test
- happy-dom
- msw

### 2. Verify Installation

```bash
# Run a quick test to verify setup
npm run test:unit -- --run

# If successful, you'll see output like:
# ✓ tests/unit/services/agentGenerator.test.js (XX tests)
# ✓ tests/unit/services/templateProcessor.test.js (XX tests)
# Test Files  X passed (X)
#      Tests  XX passed (XX)
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit           # Fast unit tests
npm run test:integration    # Integration tests
npm run test:e2e            # End-to-end tests

# Development workflow
npm run test:unit:watch     # Watch mode for TDD
npm run test:unit:coverage  # Generate coverage report
```

## Installation Details

### Testing Framework Dependencies

**Already Added to package.json:**

```json
{
  "devDependencies": {
    "@babel/preset-env": "^7.23.9",
    "@babel/preset-react": "^7.23.3",
    "@babel/register": "^7.23.7",
    "@playwright/test": "^1.41.2",
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.2.1",
    "@testing-library/user-event": "^14.5.2",
    "@vitest/coverage-v8": "^1.3.1",
    "electron-mocha": "^12.3.0",
    "happy-dom": "^13.6.2",
    "msw": "^2.1.5",
    "spectron": "^19.0.0",
    "vitest": "^1.3.1"
  }
}
```

### Manual Installation (if needed)

If you need to install testing dependencies separately:

```bash
# Core testing frameworks
npm install --save-dev vitest @vitest/coverage-v8

# React testing utilities
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# E2E testing
npm install --save-dev @playwright/test

# DOM environment
npm install --save-dev happy-dom

# API mocking
npm install --save-dev msw

# Electron testing
npm install --save-dev electron-mocha spectron

# Babel for Electron tests
npm install --save-dev @babel/preset-env @babel/preset-react @babel/register
```

## Configuration Files

All configuration files have been created:

1. **vitest.config.js** - Unit test configuration
2. **vitest.integration.config.js** - Integration test configuration
3. **playwright.config.js** - E2E test configuration
4. **tests/setup.js** - Global test setup
5. **.github/workflows/test.yml** - CI/CD pipeline

## Directory Structure

```
claude-subagent-generator/
├── tests/
│   ├── setup.js                    # Global test setup
│   ├── utils/
│   │   └── test-helpers.js         # Test utilities
│   ├── unit/                       # Unit tests
│   │   ├── services/
│   │   │   ├── agentGenerator.test.js
│   │   │   ├── templateProcessor.test.js
│   │   │   └── pdfParser.test.js
│   │   └── hooks/
│   │       ├── useAgentGenerator.test.js
│   │       └── useTheme.test.js
│   ├── integration/                # Integration tests
│   │   └── agent-generation-flow.test.js
│   ├── e2e/                        # E2E tests
│   │   └── agent-generation.spec.js
│   └── electron/                   # Electron tests
│       └── ipc-handlers.spec.js
├── vitest.config.js
├── vitest.integration.config.js
├── playwright.config.js
├── TESTING.md                      # Testing documentation
└── TEST-SETUP-GUIDE.md            # This file
```

## First Test Run

### Run Unit Tests

```bash
npm run test:unit
```

Expected output:
```
 ✓ tests/unit/services/agentGenerator.test.js (32 tests)
 ✓ tests/unit/services/templateProcessor.test.js (28 tests)
 ✓ tests/unit/services/pdfParser.test.js (24 tests)
 ✓ tests/unit/hooks/useAgentGenerator.test.js (18 tests)
 ✓ tests/unit/hooks/useTheme.test.js (12 tests)

 Test Files  5 passed (5)
      Tests  114 passed (114)
   Start at  XX:XX:XX
   Duration  XXXms
```

### Run Integration Tests

```bash
npm run test:integration
```

### Run E2E Tests

```bash
# First, install Playwright browsers
npx playwright install

# Then run E2E tests
npm run test:e2e
```

## Coverage Report

Generate and view coverage:

```bash
# Generate coverage
npm run test:unit:coverage

# View HTML report (Linux/Mac)
open coverage/index.html

# View HTML report (Windows)
start coverage/index.html
```

Coverage thresholds:
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Common Issues and Solutions

### Issue: Vitest not found

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Playwright browsers not installed

**Solution:**
```bash
npx playwright install --with-deps
```

### Issue: Tests failing with "Cannot find module"

**Solution:**
Check that path aliases in `vitest.config.js` match your project structure:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@renderer': path.resolve(__dirname, './src/renderer'),
    '@main': path.resolve(__dirname, './src/main'),
  },
}
```

### Issue: Electron API mocks not working

**Solution:**
Ensure `tests/setup.js` is loaded:
```javascript
// In vitest.config.js
test: {
  setupFiles: ['./tests/setup.js'],
}
```

### Issue: Coverage thresholds not met

**Solution:**
1. Check which files lack coverage:
   ```bash
   npm run test:unit:coverage -- --reporter=verbose
   ```
2. Add tests for uncovered code
3. Or adjust thresholds in `vitest.config.js` temporarily

### Issue: E2E tests timing out

**Solution:**
Increase timeout in `playwright.config.js`:
```javascript
timeout: 60000, // 60 seconds
```

## IDE Setup

### VS Code

Install recommended extensions:
- **Vitest** - Run tests from VS Code
- **Playwright Test for VSCode** - Run E2E tests
- **ESLint** - Code quality

Add to `.vscode/settings.json`:
```json
{
  "vitest.enable": true,
  "vitest.commandLine": "npm run test:unit",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm / IntelliJ

1. Go to Run > Edit Configurations
2. Add New Configuration > Vitest
3. Set working directory to project root
4. Set config file to `vitest.config.js`

## Writing Your First Test

### 1. Create Test File

Create a new file in `tests/unit/`:

```javascript
// tests/unit/myFeature.test.js
import { describe, it, expect } from 'vitest';

describe('MyFeature', () => {
  it('should work correctly', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### 2. Run Your Test

```bash
npm run test:unit -- myFeature.test.js
```

### 3. Add More Tests

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { MyService } from '@renderer/services/myService';

describe('MyService', () => {
  let service;

  beforeEach(() => {
    service = new MyService();
  });

  it('should initialize correctly', () => {
    expect(service).toBeDefined();
  });

  it('should process data', () => {
    const result = service.process('input');
    expect(result).toBe('output');
  });
});
```

## Test Development Workflow

### TDD (Test-Driven Development)

1. Write failing test
2. Run tests in watch mode: `npm run test:unit:watch`
3. Write minimal code to pass
4. Refactor
5. Repeat

### BDD (Behavior-Driven Development)

1. Define behavior in test
2. Implement feature
3. Verify behavior
4. Document

## Pre-Commit Checklist

Before committing code:

- [ ] All tests pass: `npm test`
- [ ] Coverage meets thresholds: `npm run test:unit:coverage`
- [ ] No linting errors: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] New features have tests
- [ ] Changed code has updated tests

## CI/CD Pipeline

Tests run automatically on:
- Push to `main` or `develop`
- Pull requests
- Manual trigger

View results:
1. Go to GitHub Actions tab
2. Select workflow run
3. View test results and coverage

## Performance Tips

### Speed Up Tests

1. **Use Happy DOM** (already configured)
   - 5-10x faster than jsdom

2. **Run tests in parallel** (automatic in Vitest)

3. **Mock heavy operations**
   ```javascript
   vi.mock('pdf-parse', () => ({
     default: vi.fn().mockResolvedValue({ text: 'mock' })
   }));
   ```

4. **Use beforeEach instead of beforeAll**
   - Better test isolation
   - Prevents shared state bugs

### Reduce Flakiness

1. **Avoid arbitrary timeouts**
   ```javascript
   // Bad
   await new Promise(r => setTimeout(r, 1000));

   // Good
   await waitFor(() => expect(element).toBeInTheDocument());
   ```

2. **Ensure test isolation**
   - No shared state between tests
   - Clean up after each test

3. **Use proper wait utilities**
   ```javascript
   import { waitFor } from '@testing-library/react';

   await waitFor(() => {
     expect(result.current.data).toBeDefined();
   });
   ```

## Next Steps

1. **Read TESTING.md** for comprehensive testing guide
2. **Review existing tests** in `tests/` directory
3. **Write tests for new features**
4. **Maintain > 80% coverage**
5. **Run tests before every commit**

## Getting Help

- Check **TESTING.md** for detailed testing patterns
- Review existing test files for examples
- Check Vitest docs: https://vitest.dev/
- Check Testing Library docs: https://testing-library.com/
- Check Playwright docs: https://playwright.dev/

## Summary

You now have a complete testing setup with:
- ✅ Unit testing with Vitest
- ✅ React component testing
- ✅ Integration testing
- ✅ E2E testing with Playwright
- ✅ Coverage reporting
- ✅ CI/CD pipeline
- ✅ Test utilities and helpers
- ✅ Comprehensive documentation

Run `npm test` to get started!
