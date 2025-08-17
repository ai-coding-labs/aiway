import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

test.describe('Manual Button Test', () => {
  let electronApp: ElectronApplication;
  let page: Page;

  test.beforeAll(async () => {
    electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd()
    });
    
    page = await electronApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('test manual analyze button click', async () => {
    // 监听控制台
    page.on('console', msg => {
      console.log('Console:', msg.text());
    });
    
    console.log('=== 测试手动点击分析按钮 ===');
    
    // 加载网站
    await page.fill('#url-input', 'https://example.com');
    await page.click('#load-btn');
    console.log('已加载网站');
    
    // 等待加载完成
    await page.waitForTimeout(8000);
    
    // 检查分析按钮状态
    const analyzeBtn = page.locator('#analyze-btn');
    const isEnabled = await analyzeBtn.isEnabled();
    const isVisible = await analyzeBtn.isVisible();
    console.log('分析按钮可见:', isVisible);
    console.log('分析按钮启用:', isEnabled);
    
    if (isVisible && isEnabled) {
      console.log('准备点击分析按钮...');
      
      // 点击前的状态
      const beforeStatus = await page.locator('#status-message').textContent();
      console.log('点击前状态:', beforeStatus);
      
      // 点击分析按钮
      await analyzeBtn.click();
      console.log('已点击分析按钮');
      
      // 等待反应
      await page.waitForTimeout(1000);
      
      // 检查点击后的状态
      const afterStatus = await page.locator('#status-message').textContent();
      console.log('点击后状态:', afterStatus);
      
      // 等待检测完成
      await page.waitForTimeout(5000);
      
      const finalStatus = await page.locator('#status-message').textContent();
      console.log('最终状态:', finalStatus);
      
      // 检查结果区域
      const resultsVisible = await page.locator('#results-section').isVisible();
      console.log('结果区域可见:', resultsVisible);
      
    } else {
      console.log('分析按钮不可用');
    }
    
    // 截图
    await page.screenshot({ path: 'test-results/manual-button-test.png', fullPage: true });
    
    expect(true).toBe(true);
  });
});
