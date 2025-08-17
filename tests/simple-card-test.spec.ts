import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

test.describe('Simple Card Generator Test', () => {
  let electronApp: ElectronApplication;
  let page: Page;

  test.beforeAll(async () => {
    // Launch Electron app
    electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd()
    });
    
    // Get the first window
    page = await electronApp.firstWindow();
    
    // Wait for the app to be ready
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('should load app and show basic UI', async () => {
    // Check if main elements are present
    await expect(page.locator('#url-input')).toBeVisible();
    await expect(page.locator('#load-btn')).toBeVisible();
    await expect(page.locator('#analyze-btn')).toBeVisible();
    
    // Check if analyze button is initially disabled
    await expect(page.locator('#analyze-btn')).toBeDisabled();
  });

  test('should enable analyze button after loading URL', async () => {
    // Fill in URL
    await page.fill('#url-input', 'https://example.com');
    
    // Click load button
    await page.click('#load-btn');
    
    // Wait for analyze button to be enabled (with longer timeout)
    await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 60000 });
    
    // Verify analyze button is enabled
    await expect(page.locator('#analyze-btn')).toBeEnabled();
  });

  test('should show results after analysis', async () => {
    // Ensure we have a loaded URL first
    const analyzeBtn = page.locator('#analyze-btn');
    if (await analyzeBtn.isDisabled()) {
      await page.fill('#url-input', 'https://example.com');
      await page.click('#load-btn');
      await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 60000 });
    }
    
    // Click analyze button
    await page.click('#analyze-btn');
    
    // Wait for results to appear
    await page.waitForSelector('#results-section[style*="block"]', { timeout: 60000 });
    
    // Check if results section is visible
    await expect(page.locator('#results-section')).toBeVisible();
    
    // Check if report card generator is visible
    await expect(page.locator('#report-card-generator')).toBeVisible();
  });

  test('should generate card successfully', async () => {
    // Ensure we have results first
    const resultsSection = page.locator('#results-section');
    if (!(await resultsSection.isVisible())) {
      // Run analysis first
      await page.fill('#url-input', 'https://example.com');
      await page.click('#load-btn');
      await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 60000 });
      await page.click('#analyze-btn');
      await page.waitForSelector('#results-section[style*="block"]', { timeout: 60000 });
    }
    
    // Check if generate card button is visible and enabled
    await expect(page.locator('#generate-card-btn')).toBeVisible();
    await expect(page.locator('#generate-card-btn')).toBeEnabled();
    
    // Click generate card button
    await page.click('#generate-card-btn');
    
    // Wait for card to be generated (with longer timeout for canvas rendering)
    await page.waitForSelector('.report-card-canvas', { timeout: 30000 });
    
    // Check if card preview is visible
    await expect(page.locator('#report-card-preview.visible')).toBeVisible();
    
    // Check if card image is displayed
    await expect(page.locator('.report-card-canvas')).toBeVisible();
    
    // Check if copy button is enabled
    await expect(page.locator('#copy-card-btn')).toBeEnabled();
  });

  test('should copy card to clipboard', async () => {
    // Ensure we have a generated card first
    const cardImage = page.locator('.report-card-canvas');
    if (!(await cardImage.isVisible())) {
      // Generate card first
      await page.click('#generate-card-btn');
      await page.waitForSelector('.report-card-canvas', { timeout: 30000 });
    }
    
    // Click copy button
    await page.click('#copy-card-btn');
    
    // Wait for success message
    await page.waitForSelector('#card-success-message.visible', { timeout: 10000 });
    
    // Check success message content
    const successMessage = page.locator('#card-success-text');
    await expect(successMessage).toContainText('卡片已复制到剪切板');
  });

  test('should download card', async () => {
    // Ensure we have a generated card
    const cardImage = page.locator('.report-card-canvas');
    if (!(await cardImage.isVisible())) {
      await page.click('#generate-card-btn');
      await page.waitForSelector('.report-card-canvas', { timeout: 30000 });
    }
    
    // Set up download promise
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.click('#download-card-btn');
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Check download filename
    expect(download.suggestedFilename()).toMatch(/AI味检测报告_\d{4}-\d{2}-\d{2}\.png/);
  });
});
