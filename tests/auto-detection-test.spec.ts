import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

test.describe('Auto Detection Test', () => {
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

  test('should auto-detect AI flavor after loading website', async () => {
    // 监听控制台
    page.on('console', msg => {
      console.log('Console:', msg.text());
    });
    
    console.log('=== 测试自动AI味检测 ===');
    
    // 使用快速体验按钮
    const chatgptBtn = page.locator('button[data-url="https://chat.openai.com"]');
    await chatgptBtn.click();
    console.log('已点击ChatGPT按钮');
    
    // 点击加载按钮
    await page.click('#load-btn');
    console.log('已点击加载按钮');
    
    // 等待网站加载完成
    console.log('等待网站加载...');
    await page.waitForTimeout(5000);
    
    // 等待自动检测开始
    console.log('等待自动检测开始...');
    await page.waitForTimeout(2000);
    
    // 检查状态消息是否显示正在检测
    const statusText = await page.locator('#status-message').textContent();
    console.log('当前状态:', statusText);
    
    // 等待检测完成
    console.log('等待检测完成...');
    await page.waitForTimeout(5000);
    
    // 检查结果区域是否显示
    const resultsSection = page.locator('#results-section');
    const isResultsVisible = await resultsSection.isVisible();
    console.log('结果区域可见:', isResultsVisible);
    
    if (isResultsVisible) {
      // 检查AI评分
      const aiScore = await page.locator('#ai-score').textContent();
      console.log('AI评分:', aiScore);
      
      // 检查分析的URL
      const analyzedUrl = await page.locator('#analyzed-url').textContent();
      console.log('分析的URL:', analyzedUrl);
      
      // 检查特征列表
      const featuresCount = await page.locator('#features-list .feature-item').count();
      console.log('检测到的特征数量:', featuresCount);
      
      // 检查详细分析
      const analysisDetails = await page.locator('#analysis-details').textContent();
      console.log('详细分析:', analysisDetails);
    }
    
    // 最终状态检查
    const finalStatusText = await page.locator('#status-message').textContent();
    const finalStatusClass = await page.locator('#status-message').getAttribute('class');
    console.log('最终状态:', finalStatusText);
    console.log('最终状态类名:', finalStatusClass);
    
    // 截图保存结果
    await page.screenshot({ path: 'test-results/auto-detection-test.png', fullPage: true });
    console.log('已保存截图');
    
    console.log('\n=== 测试手动点击分析按钮 ===');
    
    // 测试手动点击分析按钮
    const analyzeBtn = page.locator('#analyze-btn');
    const isAnalyzeBtnEnabled = await analyzeBtn.isEnabled();
    console.log('分析按钮是否启用:', isAnalyzeBtnEnabled);
    
    if (isAnalyzeBtnEnabled) {
      await analyzeBtn.click();
      console.log('已手动点击分析按钮');
      
      await page.waitForTimeout(4000);
      
      const manualStatusText = await page.locator('#status-message').textContent();
      console.log('手动检测后状态:', manualStatusText);
    }
    
    // 测试总结
    console.log('\n=== 测试总结 ===');
    console.log('1. 网站加载:', '✓');
    console.log('2. 自动检测:', isResultsVisible ? '✓' : '✗');
    console.log('3. 结果显示:', isResultsVisible ? '✓' : '✗');
    console.log('4. 分析按钮:', isAnalyzeBtnEnabled ? '✓' : '✗');
    
    // 测试通过条件：结果区域可见
    expect(isResultsVisible).toBe(true);
  });
});
