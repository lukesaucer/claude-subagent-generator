# Testing Documentation

## Overview

This document provides comprehensive guidance for testing the Claude Subagent Generator Electron application. The testing strategy covers unit tests, integration tests, end-to-end tests, and Electron-specific tests.

## Testing Stack

### Core Frameworks
- **Vitest**: Fast unit and integration testing with Vite integration
- **React Testing Library**: Component testing with user-centric approach
- **Playwright**: E2E testing for Electron/web applications
- **Electron Mocha**: Electron main process testing
- **Happy DOM**: Lightweight DOM environment for fast tests

### Testing Libraries
- `@testing-library/react`: React component testing utilities
- `@testing-library/jest-dom`: Custom matchers for DOM assertions
- `@testing-library/user-event`: User interaction simulation
- `@vitest/coverage-v8`: Code coverage reporting
- `msw`: API mocking for integration tests

## Test Structure

```
tests/
├── setup.js                    # Global test setup
├── unit/                       # Unit tests
│   ├── services/              # Service layer tests
│   │   ├── agentGenerator.test.js
│   │   ├── templateProcessor.test.js
│   │   └── pdfParser.test.js
│   └── hooks/                 # React hooks tests
│       ├── useAgentGenerator.test.js
│       └── useTheme.test.js
├── integration/               # Integration tests
│   └── agent-generation-flow.test.js
├── e2e/                       # End-to-end tests
│   └── agent-generation.spec.js
└── electron/                  # Electron-specific tests
    └── ipc-handlers.spec.js
```

## Running Tests

### Quick Commands

```bash
# Run all unit tests
npm run test:unit

# Run unit tests in watch mode
npm run test:unit:watch

# Run unit tests with coverage
npm run test:unit:coverage

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run Electron-specific tests
npm run test:electron

# Run all tests
npm run test:all
```

### Coverage Thresholds

The project maintains strict coverage requirements:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## Test Categories

### 1. Unit Tests

Unit tests focus on individual functions, classes, and hooks in isolation.

**What to test:**
- Service methods (agentGenerator, templateProcessor, pdfParser)
- React hooks (useAgentGenerator, useTheme)
- Utility functions
- Business logic
- Data transformations

**Best practices:**
- Mock external dependencies (electron API, file system)
- Test edge cases and error conditions
- Keep tests fast (< 100ms per test)
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

**Example:**
```javascript
describe('TemplateProcessor', () => {
  it('should join non-empty fields with semicolons', () => {
    const processor = new TemplateProcessor('');
    const fields = ['Field 1', 'Field 2', 'Field 3'];
    const result = processor.joinFields(fields);

    expect(result).toBe('Field 1; Field 2; Field 3');
  });
});
```

### 2. Integration Tests

Integration tests verify that multiple components work together correctly.

**What to test:**
- Complete user workflows
- Service coordination
- Data flow between components
- Hook integration with services
- State management

**Best practices:**
- Test realistic user scenarios
- Verify data persistence across components
- Test error recovery
- Use minimal mocking
- Test asynchronous operations

**Example:**
```javascript
describe('Agent Generation Integration Flow', () => {
  it('should complete full workflow from template to generation', async () => {
    const { result } = renderHook(() => useAgentGenerator());

    // Fill template
    act(() => {
      result.current.updateTemplateField('coreFunctions', 0, 'Handle API');
    });

    // Add document
    await act(async () => {
      await result.current.addDocument({ name: 'doc.pdf', path: '/doc.pdf' });
    });

    // Generate agent
    const agent = await act(async () => {
      return await result.current.generateAgent('TestAgent', 'backend-dev');
    });

    expect(agent).toBeDefined();
  });
});
```

### 3. End-to-End Tests

E2E tests verify the application works correctly from the user's perspective.

**What to test:**
- Complete user journeys
- UI interactions
- Navigation flows
- Data persistence
- Error handling in UI
- Accessibility
- Cross-browser compatibility

**Best practices:**
- Test critical paths first
- Use data-testid for stable selectors
- Test real user behavior
- Include keyboard navigation
- Test error states
- Keep tests independent

**Example:**
```javascript
test('should complete basic agent generation flow', async ({ page }) => {
  await page.goto('/');

  // Fill template
  await page.click('text=Template');
  await page.locator('input[placeholder*="Core function"]').first()
    .fill('Process requests');

  // Navigate to preview
  await page.click('text=Preview');

  await expect(page.locator('text=Agent Preview')).toBeVisible();
});
```

### 4. Electron Tests

Electron-specific tests verify main process functionality and IPC communication.

**What to test:**
- IPC handlers
- File system operations
- Window management
- Settings persistence
- PDF processing
- Security settings

**Best practices:**
- Test both main and renderer processes
- Verify IPC message contracts
- Test file system permissions
- Validate security configuration
- Test error handling in IPC

**Note:** The Electron tests use placeholder structure. For production, consider migrating to Playwright Electron API for better reliability.

## Writing New Tests

### Unit Test Template

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('YourComponent/Service', () => {
  let instance;

  beforeEach(() => {
    // Setup
    instance = new YourService();
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = instance.methodName(input);

      // Assert
      expect(result).toBe('expected');
    });

    it('should handle edge case', () => {
      // Test edge case
    });

    it('should handle errors gracefully', () => {
      // Test error handling
    });
  });
});
```

### Integration Test Template

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('Integration: Feature Name', () => {
  beforeEach(() => {
    // Setup mocks
  });

  it('should complete full workflow', async () => {
    // Test complete feature flow
  });

  it('should handle errors in workflow', async () => {
    // Test error scenarios
  });
});
```

### E2E Test Template

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform user action', async ({ page }) => {
    // Simulate user behavior
    await page.click('text=Button');

    // Verify result
    await expect(page.locator('text=Result')).toBeVisible();
  });
});
```

## Mocking Electron API

All tests mock the Electron API for isolation. The mock is defined in `tests/setup.js`:

```javascript
global.electronAPI = {
  saveAgent: vi.fn(),
  loadAgents: vi.fn(),
  processPDF: vi.fn(),
  loadSettings: vi.fn(),
  saveSettings: vi.fn(),
  consultAgent: vi.fn(),
  loadTemplate: vi.fn(),
  getAppVersion: vi.fn(),
};
```

Override mocks in specific tests:

```javascript
beforeEach(() => {
  global.window.electronAPI.processPDF = vi.fn().mockResolvedValue({
    success: true,
    text: 'Sample text',
    pages: 5,
  });
});
```

## Debugging Tests

### Vitest Debugging

```bash
# Run specific test file
npm run test:unit -- agentGenerator.test.js

# Run tests matching pattern
npm run test:unit -- --grep "should generate"

# Run with verbose output
npm run test:unit -- --reporter=verbose

# Run in UI mode
npm run test:unit:watch
```

### Playwright Debugging

```bash
# Run with UI
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed

# Debug specific test
npx playwright test --debug agent-generation.spec.js

# Generate trace
npx playwright test --trace on
```

## Common Testing Patterns

### Testing Async Operations

```javascript
it('should handle async operation', async () => {
  const { result } = renderHook(() => useAgentGenerator());

  await act(async () => {
    await result.current.addDocument(mockFile);
  });

  expect(result.current.documents).toHaveLength(1);
});
```

### Testing Error States

```javascript
it('should handle errors gracefully', async () => {
  global.window.electronAPI.processPDF = vi.fn().mockRejectedValue(
    new Error('Processing failed')
  );

  const { result } = renderHook(() => useAgentGenerator());

  await act(async () => {
    await result.current.addDocument(mockFile);
  });

  expect(result.current.error).toBe('Processing failed');
});
```

### Testing State Changes

```javascript
it('should update state correctly', () => {
  const { result } = renderHook(() => useAgentGenerator());

  act(() => {
    result.current.updateTemplateField('coreFunctions', 0, 'New Value');
  });

  expect(result.current.templateData.coreFunctions[0]).toBe('New Value');
});
```

## CI/CD Integration

Tests run automatically on:
- Every push to main branch
- Every pull request
- Manual workflow dispatch

GitHub Actions workflow includes:
- Unit test execution
- Integration test execution
- E2E test execution
- Coverage reporting
- Test result publishing

## Coverage Reports

Coverage reports are generated in multiple formats:
- **HTML**: `coverage/index.html` (browseable)
- **LCOV**: `coverage/lcov.info` (CI integration)
- **JSON**: `coverage/coverage-final.json` (programmatic access)
- **Text**: Console output

View HTML coverage:
```bash
npm run test:unit:coverage
open coverage/index.html
```

## Best Practices Summary

### DO
- Write tests for all new features
- Maintain > 80% code coverage
- Test error conditions
- Use descriptive test names
- Mock external dependencies
- Test user workflows
- Keep tests independent
- Run tests before committing

### DON'T
- Test implementation details
- Write flaky tests
- Share state between tests
- Use arbitrary timeouts
- Skip error handling tests
- Commit failing tests
- Mock everything
- Write tests without assertions

## Troubleshooting

### Tests Failing Locally

1. Clear coverage cache: `rm -rf coverage`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Update snapshots: `npm run test:unit -- -u`
4. Check for global state pollution

### Tests Failing in CI

1. Check Node.js version match
2. Verify dependencies installed
3. Check for timing issues
4. Review CI logs for specifics

### Flaky Tests

1. Avoid arbitrary timeouts
2. Use proper wait utilities
3. Ensure test isolation
4. Check for race conditions
5. Add retry for known transient failures

## Performance Optimization

- Use `happy-dom` instead of `jsdom` (5-10x faster)
- Run tests in parallel (automatic in Vitest)
- Mock heavy operations (file I/O, PDF parsing)
- Use `beforeEach` for setup instead of `beforeAll` for isolation
- Keep unit tests under 100ms each

## Future Improvements

- [ ] Add visual regression testing with Percy/Chromatic
- [ ] Add performance benchmarking tests
- [ ] Implement mutation testing with Stryker
- [ ] Add contract testing for IPC
- [ ] Add smoke tests for production builds
- [ ] Set up test data factories
- [ ] Add accessibility automated testing
- [ ] Implement load testing for PDF processing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Electron Testing Guide](https://www.electronjs.org/docs/latest/tutorial/automated-testing)
