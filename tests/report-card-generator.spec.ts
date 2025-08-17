import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

test.describe('Report Card Generator', () => {
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
    await page.waitForTimeout(2000);
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('should show report card generator after analysis', async () => {
    // Fill in a test URL
    await page.fill('#url-input', 'https://chat.openai.com');
    
    // Click load button
    await page.click('#load-btn');
    
    // Wait for loading to complete
    await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 30000 });
    
    // Click analyze button
    await page.click('#analyze-btn');
    
    // Wait for analysis to complete
    await page.waitForSelector('#results-section[style*="block"]', { timeout: 30000 });
    
    // Check if report card generator is visible
    const reportCardGenerator = page.locator('#report-card-generator');
    await expect(reportCardGenerator).toBeVisible();
    
    // Check if generate card button is present
    const generateCardBtn = page.locator('#generate-card-btn');
    await expect(generateCardBtn).toBeVisible();
    await expect(generateCardBtn).toBeEnabled();
  });

  test('should generate and display card', async () => {
    // Ensure we have analysis results first
    const resultsSection = page.locator('#results-section');
    if (!(await resultsSection.isVisible())) {
      // Run analysis first
      await page.fill('#url-input', 'https://chat.openai.com');
      await page.click('#load-btn');
      await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 30000 });
      await page.click('#analyze-btn');
      await page.waitForSelector('#results-section[style*="block"]', { timeout: 30000 });
    }
    
    // Click generate card button
    await page.click('#generate-card-btn');
    
    // Wait for card loading to appear
    await page.waitForSelector('#card-loading[style*="flex"]', { timeout: 5000 });
    
    // Wait for card to be generated
    await page.waitForSelector('.report-card-canvas', { timeout: 15000 });
    
    // Check if card preview is visible
    const cardPreview = page.locator('#report-card-preview.visible');
    await expect(cardPreview).toBeVisible();
    
    // Check if card image is displayed
    const cardImage = page.locator('.report-card-canvas');
    await expect(cardImage).toBeVisible();
    
    // Check if copy button is enabled
    const copyCardBtn = page.locator('#copy-card-btn');
    await expect(copyCardBtn).toBeEnabled();
  });

  test('should copy card to clipboard', async () => {
    // Ensure we have a generated card first
    const cardImage = page.locator('.report-card-canvas');
    if (!(await cardImage.isVisible())) {
      // Generate card first
      await page.click('#generate-card-btn');
      await page.waitForSelector('.report-card-canvas', { timeout: 15000 });
    }
    
    // Click copy button
    await page.click('#copy-card-btn');
    
    // Wait for success message
    await page.waitForSelector('#card-success-message.visible', { timeout: 5000 });
    
    // Check success message content
    const successMessage = page.locator('#card-success-text');
    await expect(successMessage).toContainText('卡片已复制到剪切板');
    
    // Success message should auto-hide after 3 seconds
    await page.waitForTimeout(4000);
    const successMessageHidden = page.locator('#card-success-message:not(.visible)');
    await expect(successMessageHidden).toBeVisible();
  });

  test('should change card theme', async () => {
    // Ensure we have analysis results
    const resultsSection = page.locator('#results-section');
    if (!(await resultsSection.isVisible())) {
      await page.fill('#url-input', 'https://chat.openai.com');
      await page.click('#load-btn');
      await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 30000 });
      await page.click('#analyze-btn');
      await page.waitForSelector('#results-section[style*="block"]', { timeout: 30000 });
    }
    
    // Change theme to dark
    await page.selectOption('#card-theme', 'dark');
    
    // Generate card with dark theme
    await page.click('#generate-card-btn');
    await page.waitForSelector('.report-card-canvas', { timeout: 15000 });
    
    // Change theme to light
    await page.selectOption('#card-theme', 'light');
    
    // Card should regenerate automatically
    await page.waitForTimeout(2000);
    
    // Change back to gradient
    await page.selectOption('#card-theme', 'gradient');
    await page.waitForTimeout(2000);
  });

  test('should download card', async () => {
    // Ensure we have a generated card
    const cardImage = page.locator('.report-card-canvas');
    if (!(await cardImage.isVisible())) {
      await page.click('#generate-card-btn');
      await page.waitForSelector('.report-card-canvas', { timeout: 15000 });
    }
    
    // Set up download promise
    const downloadPromise = page.waitForEvent('download');
    
    // Click download button
    await page.click('#download-card-btn');
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Check download filename
    expect(download.suggestedFilename()).toMatch(/AI味检测报告_\d{4}-\d{2}-\d{2}\.png/);
    
    // Wait for success message
    await page.waitForSelector('#card-success-message.visible', { timeout: 5000 });
    const successMessage = page.locator('#card-success-text');
    await expect(successMessage).toContainText('卡片已下载');
  });

  test('should open fullscreen view', async () => {
    // Ensure we have a generated card
    const cardImage = page.locator('.report-card-canvas');
    if (!(await cardImage.isVisible())) {
      await page.click('#generate-card-btn');
      await page.waitForSelector('.report-card-canvas', { timeout: 15000 });
    }
    
    // Click fullscreen button
    await page.click('#fullscreen-card-btn');
    
    // Wait for fullscreen modal to appear
    await page.waitForSelector('div[style*="position: fixed"][style*="z-index: 10000"]', { timeout: 5000 });
    
    // Check if fullscreen image is visible
    const fullscreenImg = page.locator('div[style*="position: fixed"] img');
    await expect(fullscreenImg).toBeVisible();
    
    // Close fullscreen by clicking on modal
    await page.click('div[style*="position: fixed"]');
    
    // Wait for modal to disappear
    await page.waitForSelector('div[style*="position: fixed"][style*="z-index: 10000"]', { state: 'detached', timeout: 5000 });
  });

  test('should toggle timestamp option', async () => {
    // Ensure we have analysis results
    const resultsSection = page.locator('#results-section');
    if (!(await resultsSection.isVisible())) {
      await page.fill('#url-input', 'https://chat.openai.com');
      await page.click('#load-btn');
      await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 30000 });
      await page.click('#analyze-btn');
      await page.waitForSelector('#results-section[style*="block"]', { timeout: 30000 });
    }
    
    // Uncheck timestamp option
    await page.uncheck('#include-timestamp');
    
    // Generate card without timestamp
    await page.click('#generate-card-btn');
    await page.waitForSelector('.report-card-canvas', { timeout: 15000 });
    
    // Check timestamp option again
    await page.check('#include-timestamp');
    
    // Card should regenerate automatically
    await page.waitForTimeout(2000);
  });

  test('should clear results and hide card generator', async () => {
    // Ensure we have results and card generator visible
    const resultsSection = page.locator('#results-section');
    if (!(await resultsSection.isVisible())) {
      await page.fill('#url-input', 'https://chat.openai.com');
      await page.click('#load-btn');
      await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 30000 });
      await page.click('#analyze-btn');
      await page.waitForSelector('#results-section[style*="block"]', { timeout: 30000 });
    }
    
    // Click clear button
    await page.click('#clear-btn');
    
    // Check if results section is hidden
    await expect(page.locator('#results-section')).toBeHidden();
    
    // Check if report card generator is hidden
    await expect(page.locator('#report-card-generator')).toBeHidden();
    
    // Check if copy button is disabled
    await expect(page.locator('#copy-card-btn')).toBeDisabled();
  });
});
