import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

test.describe('Real User Test', () => {
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

  test('test quick example buttons and manual input', async () => {
    // 监听控制台
    page.on('console', msg => {
      console.log('Console:', msg.text());
    });
    
    console.log('=== 测试快速体验按钮 ===');
    
    // 测试ChatGPT按钮
    const chatgptBtn = page.locator('button[data-url="https://chat.openai.com"]');
    await expect(chatgptBtn).toBeVisible();
    console.log('ChatGPT按钮可见');
    
    await chatgptBtn.click();
    console.log('已点击ChatGPT按钮');
    
    // 检查URL是否填入
    await page.waitForTimeout(1000);
    const urlValue = await page.locator('#url-input').inputValue();
    console.log('URL输入框值:', urlValue);
    
    // 点击加载按钮
    await page.click('#load-btn');
    console.log('已点击加载按钮');
    
    // 等待加载
    await page.waitForTimeout(5000);
    
    // 检查状态
    const statusText = await page.locator('#status-message').textContent();
    const statusClass = await page.locator('#status-message').getAttribute('class');
    console.log('状态文本:', statusText);
    console.log('状态类名:', statusClass);
    
    // 检查webview
    const webviewSrc = await page.locator('#website-webview').getAttribute('src');
    console.log('Webview src:', webviewSrc);
    
    console.log('\n=== 测试手动输入 ===');
    
    // 清空并手动输入
    await page.fill('#url-input', '');
    await page.fill('#url-input', 'https://www.google.com');
    console.log('已手动输入Google URL');
    
    await page.click('#load-btn');
    console.log('已点击加载按钮');
    
    await page.waitForTimeout(5000);
    
    const finalStatusText = await page.locator('#status-message').textContent();
    const finalStatusClass = await page.locator('#status-message').getAttribute('class');
    const finalWebviewSrc = await page.locator('#website-webview').getAttribute('src');
    
    console.log('最终状态文本:', finalStatusText);
    console.log('最终状态类名:', finalStatusClass);
    console.log('最终Webview src:', finalWebviewSrc);
    
    // 截图
    await page.screenshot({ path: 'test-results/real-user-test.png', fullPage: true });
    console.log('已保存截图');
    
    // 测试总是通过，只是为了观察
    expect(true).toBe(true);
  });
});
