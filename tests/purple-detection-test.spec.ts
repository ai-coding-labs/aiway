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

test.describe('优化后的紫色检测功能测试', () => {
  test('测试51aigc网站的紫色检测', async () => {
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    const analyzeButton = page.locator('#analyze-btn');
    const statusMessage = page.locator('#status-message');
    const resultsSection = page.locator('#results-section');
    const aiScore = page.locator('#ai-score');
    const featuresList = page.locator('#features-list');
    
    // 输入51aigc网站URL
    await urlInput.fill('https://www.51aigc.cc/#/login');
    
    // 点击加载按钮
    await loadButton.click();
    
    // 等待网站加载完成
    await page.waitForTimeout(8000);
    
    // 检查是否加载成功
    await expect(statusMessage).toContainText('网站加载成功', { timeout: 15000 });
    
    // 确保分析按钮可用
    await expect(analyzeButton).toBeEnabled({ timeout: 10000 });
    
    // 点击分析按钮
    await analyzeButton.click();
    
    // 等待分析完成
    await page.waitForTimeout(5000);
    
    // 检查分析是否完成
    await expect(statusMessage).toContainText('AI味检测完成', { timeout: 20000 });
    await expect(resultsSection).toBeVisible();
    await expect(aiScore).toBeVisible();
    
    // 获取AI评分
    const scoreText = await aiScore.textContent();
    const score = parseInt(scoreText || '0');
    console.log(`51aigc网站AI评分: ${score}`);
    
    // 检查紫色配色方案特征
    const featuresText = await featuresList.textContent();
    console.log('检测到的特征:', featuresText);
    
    // 验证紫色检测是否有效
    // 由于51aigc网站确实有紫色元素，应该检测到紫色配色方案
    expect(featuresText).toContain('紫色配色方案');
    
    // 检查紫色特征是否被标记为检测到
    const purpleFeature = page.locator('.feature-item').filter({ hasText: '紫色配色方案' });
    await expect(purpleFeature).toBeVisible();
    
    // 检查是否有"检测到"的标记
    const detectedBadge = purpleFeature.locator('.detected');
    await expect(detectedBadge).toBeVisible();
    
    // AI评分应该有所提升（因为检测到了更多紫色元素）
    expect(score).toBeGreaterThan(20); // 期望评分至少大于20
  });

  test('测试其他AI味浓重的网站', async () => {
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    const analyzeButton = page.locator('#analyze-btn');
    const statusMessage = page.locator('#status-message');
    const resultsSection = page.locator('#results-section');
    const aiScore = page.locator('#ai-score');
    const featuresList = page.locator('#features-list');
    
    // 测试其他已知的AI味网站
    const testUrls = [
      'https://openai.com',
      'https://claude.ai',
      'https://www.anthropic.com'
    ];
    
    for (const url of testUrls) {
      console.log(`测试网站: ${url}`);
      
      // 清除之前的结果
      await page.locator('#clear-btn').click();
      await page.waitForTimeout(1000);
      
      // 输入URL
      await urlInput.fill(url);
      
      // 点击加载按钮
      await loadButton.click();
      
      // 等待网站加载完成
      await page.waitForTimeout(8000);
      
      // 检查是否加载成功
      const statusText = await statusMessage.textContent();
      if (statusText?.includes('网站加载成功')) {
        // 确保分析按钮可用
        await expect(analyzeButton).toBeEnabled({ timeout: 10000 });
        
        // 点击分析按钮
        await analyzeButton.click();
        
        // 等待分析完成
        await page.waitForTimeout(5000);
        
        // 检查分析是否完成
        await expect(statusMessage).toContainText('AI味检测完成', { timeout: 20000 });
        
        // 获取AI评分
        const scoreText = await aiScore.textContent();
        const score = parseInt(scoreText || '0');
        console.log(`${url} AI评分: ${score}`);
        
        // 获取检测到的特征
        const featuresText = await featuresList.textContent();
        console.log(`${url} 检测到的特征:`, featuresText);
        
        // 记录是否检测到紫色
        const hasPurple = featuresText?.includes('紫色配色方案');
        console.log(`${url} 是否检测到紫色: ${hasPurple}`);
      } else {
        console.log(`${url} 加载失败，跳过测试`);
      }
    }
  });

  test('验证紫色检测算法的准确性', async () => {
    // 创建一个包含明确紫色元素的测试页面
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>紫色测试页面</title>
        <style>
          .purple-bg { background-color: rgb(126, 87, 194); }
          .purple-text { color: #8B5CF6; }
          .purple-border { border: 2px solid rgb(78, 110, 242); }
          .purple-gradient { 
            background: linear-gradient(135deg, rgb(179, 157, 219), rgb(126, 87, 194)); 
          }
          .purple-shadow { 
            box-shadow: 0 4px 8px rgba(126, 87, 194, 0.3); 
          }
        </style>
      </head>
      <body>
        <div class="purple-bg">紫色背景</div>
        <div class="purple-text">紫色文字</div>
        <div class="purple-border">紫色边框</div>
        <div class="purple-gradient">紫色渐变</div>
        <div class="purple-shadow">紫色阴影</div>
        <button style="background: #A855F7; color: white; border-radius: 8px;">紫色按钮</button>
      </body>
      </html>
    `;
    
    // 将测试HTML写入文件
    const fs = require('fs');
    const path = require('path');
    const testFilePath = path.join(process.cwd(), 'test-purple-page.html');
    fs.writeFileSync(testFilePath, testHtml);
    
    const urlInput = page.locator('#url-input');
    const loadButton = page.locator('#load-btn');
    const analyzeButton = page.locator('#analyze-btn');
    const statusMessage = page.locator('#status-message');
    const resultsSection = page.locator('#results-section');
    const aiScore = page.locator('#ai-score');
    const featuresList = page.locator('#features-list');
    
    // 加载测试页面
    await urlInput.fill(`file://${testFilePath}`);
    await loadButton.click();
    await page.waitForTimeout(3000);
    
    // 检查是否加载成功
    await expect(statusMessage).toContainText('网站加载成功', { timeout: 10000 });
    
    // 分析页面
    await analyzeButton.click();
    await page.waitForTimeout(3000);
    
    // 检查分析结果
    await expect(statusMessage).toContainText('AI味检测完成', { timeout: 15000 });
    
    // 获取特征检测结果
    const featuresText = await featuresList.textContent();
    console.log('测试页面检测到的特征:', featuresText);
    
    // 验证紫色检测
    expect(featuresText).toContain('紫色配色方案');
    
    // 检查紫色特征是否被正确标记为检测到
    const purpleFeature = page.locator('.feature-item').filter({ hasText: '紫色配色方案' });
    await expect(purpleFeature).toBeVisible();
    
    const detectedBadge = purpleFeature.locator('.detected');
    await expect(detectedBadge).toBeVisible();
    
    // 获取AI评分
    const scoreText = await aiScore.textContent();
    const score = parseInt(scoreText || '0');
    console.log(`测试页面AI评分: ${score}`);
    
    // 由于页面包含多个紫色元素，评分应该较高
    expect(score).toBeGreaterThan(15);
    
    // 清理测试文件
    fs.unlinkSync(testFilePath);
  });
});
