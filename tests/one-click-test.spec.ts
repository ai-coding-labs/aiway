import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

test.describe('One Click Test', () => {
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

  test('should auto-load and detect when clicking example button', async () => {
    // 监听控制台
    page.on('console', msg => {
      console.log('Console:', msg.text());
    });
    
    console.log('=== 测试一键式流程 ===');
    
    // 点击ChatGPT示例按钮
    const chatgptBtn = page.locator('button[data-url="https://chat.openai.com"]');
    await expect(chatgptBtn).toBeVisible();
    
    console.log('准备点击ChatGPT按钮...');
    await chatgptBtn.click();
    console.log('已点击ChatGPT按钮');
    
    // 检查URL是否填入
    await page.waitForTimeout(1000);
    const urlValue = await page.locator('#url-input').inputValue();
    console.log('URL输入框值:', urlValue);
    expect(urlValue).toBe('https://chat.openai.com');
    
    // 检查状态消息
    const statusText1 = await page.locator('#status-message').textContent();
    console.log('初始状态:', statusText1);
    
    // 等待自动加载开始
    await page.waitForTimeout(1000);
    const statusText2 = await page.locator('#status-message').textContent();
    console.log('加载状态:', statusText2);
    
    // 等待网站加载完成
    console.log('等待网站加载完成...');
    await page.waitForTimeout(5000);
    
    const statusText3 = await page.locator('#status-message').textContent();
    console.log('加载完成状态:', statusText3);
    
    // 等待自动检测开始
    console.log('等待自动检测开始...');
    await page.waitForTimeout(2000);
    
    const statusText4 = await page.locator('#status-message').textContent();
    console.log('检测状态:', statusText4);
    
    // 等待检测完成
    console.log('等待检测完成...');
    await page.waitForTimeout(5000);
    
    const finalStatusText = await page.locator('#status-message').textContent();
    const finalStatusClass = await page.locator('#status-message').getAttribute('class');
    console.log('最终状态:', finalStatusText);
    console.log('最终状态类名:', finalStatusClass);
    
    // 检查webview是否加载了正确的URL
    const webviewSrc = await page.locator('#website-webview').getAttribute('src');
    console.log('Webview src:', webviewSrc);
    
    // 检查结果区域是否显示
    const resultsVisible = await page.locator('#results-section').isVisible();
    console.log('结果区域可见:', resultsVisible);
    
    if (resultsVisible) {
      // 检查AI评分
      const aiScore = await page.locator('#ai-score').textContent();
      console.log('AI评分:', aiScore);
      
      // 检查特征数量
      const featuresCount = await page.locator('#features-list .feature-item').count();
      console.log('检测到的特征数量:', featuresCount);
    }
    
    // 检查分析按钮状态
    const analyzeBtnEnabled = await page.locator('#analyze-btn').isEnabled();
    console.log('分析按钮启用:', analyzeBtnEnabled);
    
    // 截图保存结果
    await page.screenshot({ path: 'test-results/one-click-test.png', fullPage: true });
    console.log('已保存截图');
    
    console.log('\n=== 测试总结 ===');
    console.log('1. 点击示例按钮:', '✓');
    console.log('2. URL自动填入:', urlValue === 'https://chat.openai.com' ? '✓' : '✗');
    console.log('3. 网站自动加载:', webviewSrc?.includes('chat.openai.com') || webviewSrc?.includes('chatgpt.com') ? '✓' : '✗');
    console.log('4. 自动检测完成:', resultsVisible ? '✓' : '✗');
    console.log('5. 结果正确显示:', resultsVisible ? '✓' : '✗');
    
    // 验证一键式流程成功
    expect(urlValue).toBe('https://chat.openai.com');
    expect(resultsVisible).toBe(true);
    expect(finalStatusText).toContain('检测完成');
  });
});
