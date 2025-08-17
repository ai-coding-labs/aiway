import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

test.describe('Manual Webview Test', () => {
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

  test('manual verification of webview functionality', async () => {
    // 监听控制台消息
    page.on('console', msg => {
      console.log('Browser console:', msg.text());
    });

    // 检查应用是否正常启动
    console.log('=== 应用启动检查 ===');
    await expect(page.locator('#url-input')).toBeVisible();
    console.log('✓ URL输入框可见');

    // 检查是否预填充了测试URL
    const urlValue = await page.locator('#url-input').inputValue();
    console.log('预填充的URL:', urlValue);

    // 检查preview-section是否可见
    const previewSection = page.locator('#preview-section');
    const isPreviewVisible = await previewSection.isVisible();
    console.log('Preview section 可见:', isPreviewVisible);

    // 检查webview是否存在且可见
    const webview = page.locator('#website-webview');
    const webviewExists = await webview.count() > 0;
    const webviewVisible = await webview.isVisible();
    console.log('Webview 存在:', webviewExists);
    console.log('Webview 可见:', webviewVisible);

    if (webviewExists) {
      // 检查webview属性
      const attributes = {
        nodeintegration: await webview.getAttribute('nodeintegration'),
        disablewebsecurity: await webview.getAttribute('disablewebsecurity'),
        allowpopups: await webview.getAttribute('allowpopups'),
        useragent: await webview.getAttribute('useragent'),
        partition: await webview.getAttribute('partition')
      };
      console.log('Webview 属性:', attributes);
    }

    // 尝试加载一个简单的网站
    console.log('\n=== 测试网站加载 ===');
    await page.fill('#url-input', 'https://example.com');
    console.log('已输入测试URL: https://example.com');

    // 点击加载按钮
    await page.click('#load-btn');
    console.log('已点击加载按钮');

    // 等待一段时间观察状态变化
    await page.waitForTimeout(5000);

    // 检查状态消息
    const statusMessage = page.locator('.status-message');
    const statusText = await statusMessage.textContent();
    const statusClass = await statusMessage.getAttribute('class');
    console.log('状态消息:', statusText);
    console.log('状态类名:', statusClass);

    // 检查分析按钮状态
    const analyzeBtn = page.locator('#analyze-btn');
    const analyzeBtnDisabled = await analyzeBtn.isDisabled();
    console.log('分析按钮禁用状态:', analyzeBtnDisabled);

    // 截图保存当前状态
    await page.screenshot({ path: 'test-results/manual-test-screenshot.png', fullPage: true });
    console.log('已保存截图到 test-results/manual-test-screenshot.png');

    // 等待更长时间看是否有变化
    console.log('\n=== 等待加载完成 ===');
    await page.waitForTimeout(10000);

    // 再次检查状态
    const finalStatusText = await statusMessage.textContent();
    const finalStatusClass = await statusMessage.getAttribute('class');
    const finalAnalyzeBtnDisabled = await analyzeBtn.isDisabled();
    
    console.log('最终状态消息:', finalStatusText);
    console.log('最终状态类名:', finalStatusClass);
    console.log('最终分析按钮禁用状态:', finalAnalyzeBtnDisabled);

    // 检查webview的src属性
    const webviewSrc = await webview.getAttribute('src');
    console.log('Webview src:', webviewSrc);

    // 尝试获取webview内容（如果可能）
    try {
      const webviewTitle = await page.evaluate(() => {
        const webview = document.getElementById('website-webview') as any;
        return webview ? webview.getTitle() : 'N/A';
      });
      console.log('Webview 标题:', webviewTitle);
    } catch (error) {
      console.log('无法获取webview标题:', error);
    }

    // 最终截图
    await page.screenshot({ path: 'test-results/manual-test-final-screenshot.png', fullPage: true });
    console.log('已保存最终截图');

    // 总结测试结果
    console.log('\n=== 测试总结 ===');
    console.log('1. 应用启动:', '✓');
    console.log('2. Webview存在:', webviewExists ? '✓' : '✗');
    console.log('3. Webview可见:', webviewVisible ? '✓' : '✗');
    console.log('4. 加载功能:', finalStatusClass?.includes('success') ? '✓' : finalStatusClass?.includes('warning') ? '⚠' : '✗');
    console.log('5. 分析按钮:', !finalAnalyzeBtnDisabled ? '✓' : '✗');

    // 这个测试总是通过，因为它只是用来观察和记录
    expect(true).toBe(true);
  });
});
