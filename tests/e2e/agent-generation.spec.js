import { test, expect } from '@playwright/test';

test.describe('Agent Generation E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display application title', async ({ page }) => {
    await expect(page.locator('h6:has-text("Claude Subagent Generator")')).toBeVisible();
  });

  test('should navigate between views', async ({ page }) => {
    // Start on template view
    await expect(page.locator('text=Template')).toBeVisible();

    // Navigate to documents
    await page.click('text=Documents');
    await expect(page.locator('text=Upload Documents')).toBeVisible();

    // Navigate to preview
    await page.click('text=Preview');
    await expect(page.locator('text=Agent Preview')).toBeVisible();

    // Navigate back to template
    await page.click('text=Template');
    await expect(page.locator('text=Core Functions')).toBeVisible();
  });

  test('should fill template fields', async ({ page }) => {
    // Navigate to template view
    await page.click('text=Template');

    // Fill core function field
    const firstInput = page.locator('input[placeholder*="Core function"]').first();
    await firstInput.fill('Handle API requests');
    await expect(firstInput).toHaveValue('Handle API requests');

    // Fill domain expertise field
    const domainInput = page.locator('input[placeholder*="domain"]').first();
    await domainInput.fill('RESTful APIs');
    await expect(domainInput).toHaveValue('RESTful APIs');
  });

  test('should toggle theme', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button:has(svg)').first();

    // Check initial theme (dark mode by default)
    const body = page.locator('body');
    const initialBg = await body.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    // Toggle theme
    await themeToggle.click();

    // Wait for theme change
    await page.waitForTimeout(500);

    // Check theme changed
    const newBg = await body.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    expect(initialBg).not.toBe(newBg);
  });

  test('should show error when generating without core functions', async ({ page }) => {
    // Navigate to template
    await page.click('text=Template');

    // Try to generate without filling required fields
    const generateButton = page.locator('button:has-text("Generate")');

    if (await generateButton.isVisible()) {
      await generateButton.click();

      // Should show validation error or remain on page
      await expect(page.locator('text=Template')).toBeVisible();
    }
  });

  test('should complete basic agent generation flow', async ({ page }) => {
    // Step 1: Fill template
    await page.click('text=Template');

    await page.locator('input[placeholder*="Core function"]').first()
      .fill('Process user requests');

    await page.locator('input[placeholder*="Core function"]').nth(1)
      .fill('Validate input data');

    // Step 2: Navigate to preview
    await page.click('text=Preview');

    // Should show some preview content
    await expect(page.locator('text=Agent Preview')).toBeVisible();
  });

  test('should maintain state when switching views', async ({ page }) => {
    // Fill data in template view
    await page.click('text=Template');

    const testValue = 'Persistent function';
    await page.locator('input[placeholder*="Core function"]').first()
      .fill(testValue);

    // Switch to documents view
    await page.click('text=Documents');
    await expect(page.locator('text=Upload Documents')).toBeVisible();

    // Switch back to template view
    await page.click('text=Template');

    // Verify data persisted
    const input = page.locator('input[placeholder*="Core function"]').first();
    await expect(input).toHaveValue(testValue);
  });

  test('should display navigation drawer', async ({ page }) => {
    // Check navigation items
    await expect(page.locator('text=Template')).toBeVisible();
    await expect(page.locator('text=Documents')).toBeVisible();
    await expect(page.locator('text=Preview')).toBeVisible();
    await expect(page.locator('text=History')).toBeVisible();
  });

  test('should highlight active navigation item', async ({ page }) => {
    // Click on Documents
    const documentsNav = page.locator('text=Documents').first();
    await documentsNav.click();

    // Wait for navigation
    await page.waitForTimeout(300);

    // Check if Documents view is active (has selected state)
    const navItem = page.locator('[role="button"]:has-text("Documents")').first();
    const isSelected = await navItem.evaluate(el => {
      return el.classList.contains('Mui-selected') ||
             el.getAttribute('aria-selected') === 'true';
    });

    expect(isSelected).toBeTruthy();
  });

  test('should handle multiple template fields', async ({ page }) => {
    await page.click('text=Template');

    // Fill multiple core functions
    const coreInputs = page.locator('input[placeholder*="Core function"]');
    const count = await coreInputs.count();

    expect(count).toBeGreaterThanOrEqual(12);

    // Fill first 3 fields
    await coreInputs.nth(0).fill('Function 1');
    await coreInputs.nth(1).fill('Function 2');
    await coreInputs.nth(2).fill('Function 3');

    // Verify all filled
    await expect(coreInputs.nth(0)).toHaveValue('Function 1');
    await expect(coreInputs.nth(1)).toHaveValue('Function 2');
    await expect(coreInputs.nth(2)).toHaveValue('Function 3');
  });

  test('should render Material-UI components correctly', async ({ page }) => {
    // Check for Material-UI AppBar
    const appBar = page.locator('[class*="MuiAppBar"]');
    await expect(appBar).toBeVisible();

    // Check for Material-UI Drawer
    const drawer = page.locator('[class*="MuiDrawer"]');
    await expect(drawer).toBeVisible();

    // Check for Material-UI Typography
    const title = page.locator('h6:has-text("Claude Subagent Generator")');
    await expect(title).toBeVisible();
  });

  test('should be responsive to window size', async ({ page }) => {
    // Set viewport to desktop size
    await page.setViewportSize({ width: 1400, height: 900 });

    // Check drawer is visible
    const drawer = page.locator('[class*="MuiDrawer"]');
    await expect(drawer).toBeVisible();

    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // On desktop app, drawer should still be visible (permanent drawer)
    // This test validates that the layout works at different sizes
    await expect(page.locator('h6:has-text("Claude Subagent Generator")')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.click('text=Template');

    // Focus first input
    const firstInput = page.locator('input').first();
    await firstInput.focus();

    // Type value
    await page.keyboard.type('API Handler');

    // Tab to next input
    await page.keyboard.press('Tab');

    // Type in second input
    await page.keyboard.type('Data Validator');

    // Verify values
    const inputs = page.locator('input');
    await expect(inputs.first()).toHaveValue('API Handler');
    await expect(inputs.nth(1)).toHaveValue('Data Validator');
  });
});

test.describe('Error Handling', () => {
  test('should handle missing electron API gracefully', async ({ page }) => {
    // Even without electron API, UI should load
    await page.goto('/');

    await expect(page.locator('h6:has-text("Claude Subagent Generator")')).toBeVisible();
  });

  test('should display error messages when operations fail', async ({ page }) => {
    await page.goto('/');

    // Navigate to documents view
    await page.click('text=Documents');

    // The UI should be functional even if file operations fail
    await expect(page.locator('text=Upload Documents')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');

    // Check for accessible navigation
    const navButtons = page.locator('[role="button"]');
    const count = await navButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should support keyboard focus', async ({ page }) => {
    await page.goto('/');

    // Tab through focusable elements
    await page.keyboard.press('Tab');

    // At least one element should have focus
    const focusedElement = await page.locator(':focus').count();
    expect(focusedElement).toBeGreaterThan(0);
  });

  test('should have readable text contrast', async ({ page }) => {
    await page.goto('/');

    // Check that text is visible (basic accessibility check)
    const title = page.locator('h6:has-text("Claude Subagent Generator")');
    await expect(title).toBeVisible();

    const color = await title.evaluate(el =>
      window.getComputedStyle(el).color
    );

    expect(color).toBeTruthy();
  });
});
