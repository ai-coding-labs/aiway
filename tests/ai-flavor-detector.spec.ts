import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

let electronApp: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  // Launch Electron app
  electronApp = await electron.launch({
    args: ['dist/main.js'],
    cwd: process.cwd()
  });
  
  // Get the first window
  page = await electronApp.firstWindow();
  
  // Wait for the app to be ready
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000); // Give the app time to initialize
});

test.afterAll(async () => {
  // Close the app
  if (electronApp) {
    await electronApp.close();
  }
});

test.describe('AI Flavor Detector App', () => {
  test('应用程序正常启动并显示主界面', async () => {
    // Check if the main elements are visible
    await expect(page.locator('.app-title')).toBeVisible();
    await expect(page.locator('.app-title')).toHaveText('AI味儿检测器');
    
    await expect(page.locator('.app-subtitle')).toBeVisible();
    await expect(page.locator('.app-subtitle')).toContainText('检测网站的AI设计风格');
    
    // Check input elements
    await expect(page.locator('#url-input')).toBeVisible();
    await expect(page.locator('#load-btn')).toBeVisible();
    await expect(page.locator('#analyze-btn')).toBeVisible();
    await expect(page.locator('#clear-btn')).toBeVisible();
    
    // Check initial state
    await expect(page.locator('#load-btn')).toBeDisabled();
    await expect(page.locator('#analyze-btn')).toBeDisabled();
  });

  test('URL输入验证功能正常工作', async () => {
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    
    // Test empty input
    await expect(loadButton).toBeDisabled();
    
    // Test invalid URL
    await urlInput.fill('invalid-url');
    await expect(loadButton).toBeDisabled();
    
    // Test valid URL
    await urlInput.fill('https://example.com');
    await expect(loadButton).toBeEnabled();
    
    // Test URL without protocol
    await urlInput.fill('google.com');
    await expect(loadButton).toBeEnabled();
  });

  test('状态消息正确显示', async () => {
    const statusMessage = page.locator('#status-message');
    
    // Check initial status
    await expect(statusMessage).toBeVisible();
    await expect(statusMessage).toContainText('准备就绪');
  });

  test('加载网站功能', async () => {
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    const statusMessage = page.locator('#status-message');
    const analyzeButton = page.locator('#analyze-btn');
    const previewSection = page.locator('#preview-section');
    
    // Input a test URL
    await urlInput.fill('https://httpbin.org/html');
    
    // Click load button
    await loadButton.click();
    
    // Wait for loading to complete
    await page.waitForTimeout(5000);
    
    // Check if status message shows success
    await expect(statusMessage).toContainText('网站加载成功', { timeout: 10000 });
    
    // Check if analyze button is enabled
    await expect(analyzeButton).toBeEnabled();
    
    // Check if preview section is visible
    await expect(previewSection).toBeVisible();
  });

  test('AI味检测功能', async () => {
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    const analyzeButton = page.locator('#analyze-btn');
    const statusMessage = page.locator('#status-message');
    const resultsSection = page.locator('#results-section');
    const aiScore = page.locator('#ai-score');
    
    // Load a website first
    await urlInput.fill('https://httpbin.org/html');
    await loadButton.click();
    await page.waitForTimeout(5000);
    
    // Wait for analyze button to be enabled
    await expect(analyzeButton).toBeEnabled({ timeout: 10000 });
    
    // Click analyze button
    await analyzeButton.click();
    
    // Wait for analysis to complete
    await page.waitForTimeout(3000);
    
    // Check if results are displayed
    await expect(statusMessage).toContainText('AI味检测完成', { timeout: 15000 });
    await expect(resultsSection).toBeVisible();
    await expect(aiScore).toBeVisible();
    
    // Check if score is a number between 0-100
    const scoreText = await aiScore.textContent();
    const score = parseInt(scoreText || '0');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('特征检测结果显示', async () => {
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    const analyzeButton = page.locator('#analyze-btn');
    const featuresList = page.locator('#features-list');
    const analysisDetails = page.locator('#analysis-details');
    
    // Load and analyze a website
    await urlInput.fill('https://httpbin.org/html');
    await loadButton.click();
    await page.waitForTimeout(5000);
    await analyzeButton.click();
    await page.waitForTimeout(3000);
    
    // Check if features list is visible and contains content
    await expect(featuresList).toBeVisible();
    
    // Check if analysis details are visible and contain content
    await expect(analysisDetails).toBeVisible();
    const detailsContent = await analysisDetails.textContent();
    expect(detailsContent).toBeTruthy();
    expect(detailsContent!.length).toBeGreaterThan(10);
  });

  test('清除结果功能', async () => {
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    const analyzeButton = page.locator('#analyze-btn');
    const clearButton = page.locator('#clear-btn');
    const resultsSection = page.locator('#results-section');
    const previewSection = page.locator('#preview-section');
    const statusMessage = page.locator('#status-message');
    
    // Load and analyze a website first
    await urlInput.fill('https://httpbin.org/html');
    await loadButton.click();
    await page.waitForTimeout(5000);
    await analyzeButton.click();
    await page.waitForTimeout(3000);
    
    // Ensure results are visible
    await expect(resultsSection).toBeVisible();
    
    // Click clear button
    await clearButton.click();
    
    // Check if results are cleared
    await expect(resultsSection).toBeHidden();
    await expect(previewSection).toBeHidden();
    await expect(urlInput).toHaveValue('');
    await expect(analyzeButton).toBeDisabled();
    await expect(statusMessage).toContainText('结果已清除');
  });

  test('错误处理 - 无效URL', async () => {
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    const errorModal = page.locator('#error-modal');
    
    // Try to load an invalid URL
    await urlInput.fill('https://this-domain-does-not-exist-12345.com');
    await loadButton.click();
    
    // Wait for error modal or status message
    await page.waitForTimeout(10000);
    
    // Check if error is handled gracefully
    const statusMessage = page.locator('#status-message');
    const statusText = await statusMessage.textContent();
    
    // Should show error message or modal
    const hasErrorStatus = statusText?.includes('失败') || statusText?.includes('错误');
    const hasErrorModal = await errorModal.isVisible();
    
    expect(hasErrorStatus || hasErrorModal).toBeTruthy();
  });

  test('响应式设计 - 窗口调整', async () => {
    // Test different window sizes
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('.app-container')).toBeVisible();
    
    await page.setViewportSize({ width: 800, height: 600 });
    await expect(page.locator('.app-container')).toBeVisible();
    
    await page.setViewportSize({ width: 600, height: 400 });
    await expect(page.locator('.app-container')).toBeVisible();
  });

  test('键盘交互 - Enter键提交', async () => {
    const urlInput = page.locator('#url-input');
    const statusMessage = page.locator('#status-message');
    
    // Input URL and press Enter
    await urlInput.fill('https://httpbin.org/html');
    await urlInput.press('Enter');
    
    // Wait for loading
    await page.waitForTimeout(5000);
    
    // Check if website was loaded
    await expect(statusMessage).toContainText('网站加载成功', { timeout: 10000 });
  });

  test('模态框交互', async () => {
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    const successModal = page.locator('#success-modal');
    const successOkBtn = page.locator('#success-ok-btn');
    
    // Load a website to trigger success modal
    await urlInput.fill('https://httpbin.org/html');
    await loadButton.click();
    await page.waitForTimeout(5000);
    
    // Check if success modal appears
    await expect(successModal).toBeVisible({ timeout: 10000 });
    
    // Click OK button to close modal
    await successOkBtn.click();
    await expect(successModal).toBeHidden();
  });
});
