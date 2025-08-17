import { test, expect } from '@playwright/test';

test.describe('URL Display Fix Tests', () => {
  test('should display correct URL in analysis results', async ({ page }) => {
    // Navigate to the application
    await page.goto('file://' + process.cwd() + '/dist/renderer/index.html');
    
    // Wait for the application to load
    await page.waitForSelector('#url-input');
    
    // Test URL input and loading
    const testUrl = 'https://www.google.com';
    await page.fill('#url-input', testUrl);
    
    // Check if load button is enabled
    await expect(page.locator('#load-btn')).not.toBeDisabled();
    
    // Click load button
    await page.click('#load-btn');
    
    // Wait for loading to complete (this might take a while in real Electron app)
    await page.waitForTimeout(3000);
    
    // Check if analyze button becomes enabled
    await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 10000 });
    
    // Click analyze button
    await page.click('#analyze-btn');
    
    // Wait for analysis to complete
    await page.waitForSelector('#results-section[style*="block"]', { timeout: 15000 });
    
    // Check if the analyzed URL is displayed correctly
    const analyzedUrlElement = page.locator('#analyzed-url');
    await expect(analyzedUrlElement).toBeVisible();
    
    // The URL should contain the test URL or be properly formatted
    const displayedUrl = await analyzedUrlElement.textContent();
    console.log('Displayed URL:', displayedUrl);
    
    // Verify the URL is not the old hardcoded "https://www.baidu.com/"
    expect(displayedUrl).not.toBe('https://www.baidu.com/');
    
    // Verify the URL contains our test URL or is properly formatted
    expect(displayedUrl).toContain('google.com');
  });

  test('should show URL info section in results', async ({ page }) => {
    // Navigate to the application
    await page.goto('file://' + process.cwd() + '/dist/renderer/index.html');
    
    // Wait for the application to load
    await page.waitForSelector('#url-input');
    
    // Test with a different URL
    const testUrl = 'https://www.github.com';
    await page.fill('#url-input', testUrl);
    
    // Click load button
    await page.click('#load-btn');
    
    // Wait for loading and analysis
    await page.waitForTimeout(3000);
    await page.waitForSelector('#analyze-btn:not([disabled])', { timeout: 10000 });
    await page.click('#analyze-btn');
    
    // Wait for results
    await page.waitForSelector('#results-section[style*="block"]', { timeout: 15000 });
    
    // Check if URL info section exists
    const urlInfoSection = page.locator('.analyzed-url-info');
    await expect(urlInfoSection).toBeVisible();
    
    // Check if URL label exists
    const urlLabel = page.locator('.url-label');
    await expect(urlLabel).toBeVisible();
    await expect(urlLabel).toHaveText('分析网站：');
    
    // Check if analyzed URL element exists and has content
    const analyzedUrl = page.locator('#analyzed-url');
    await expect(analyzedUrl).toBeVisible();
    
    const urlText = await analyzedUrl.textContent();
    expect(urlText).toBeTruthy();
    expect(urlText).not.toBe('-');
    expect(urlText).not.toBe('未知网站');
  });
});
