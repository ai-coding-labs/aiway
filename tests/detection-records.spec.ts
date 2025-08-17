import { test, expect } from '@playwright/test';
import { ElectronApplication, Page, _electron as electron } from 'playwright';

let electronApp: ElectronApplication;
let page: Page;

test.beforeAll(async () => {
  // Launch Electron app
  electronApp = await electron.launch({
    args: ['.'],
    env: {
      ...process.env,
      NODE_ENV: 'test'
    }
  });
  
  // Get the first window that the app opens, wait if necessary
  page = await electronApp.firstWindow();
  
  // Wait for the app to be ready
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000); // Give the app time to initialize
});

test.afterAll(async () => {
  await electronApp.close();
});

test.describe('检测记录功能测试', () => {
  test('应用启动后显示检测页面', async () => {
    // 检查导航菜单是否存在
    await expect(page.locator('.nav-menu')).toBeVisible();
    
    // 检查AI检测按钮是否激活
    const detectionNavBtn = page.locator('.nav-button[data-page="detection"]');
    await expect(detectionNavBtn).toHaveClass(/active/);
    
    // 检查检测页面是否显示
    const detectionPage = page.locator('#detection-page');
    await expect(detectionPage).toHaveClass(/active/);
    
    // 检查主要元素是否存在
    await expect(page.locator('#url-input')).toBeVisible();
    await expect(page.locator('#load-btn')).toBeVisible();
    await expect(page.locator('#analyze-btn')).toBeVisible();
  });

  test('切换到检测记录页面', async () => {
    // 点击记录页面导航按钮
    const recordsNavBtn = page.locator('.nav-button[data-page="records"]');
    await recordsNavBtn.click();
    
    // 等待页面切换动画
    await page.waitForTimeout(500);
    
    // 检查记录页面是否激活
    await expect(recordsNavBtn).toHaveClass(/active/);
    const recordsPage = page.locator('#records-page');
    await expect(recordsPage).toHaveClass(/active/);
    
    // 检查记录页面元素
    await expect(page.locator('.records-header h2')).toHaveText('检测记录');
    await expect(page.locator('#search-input')).toBeVisible();
    await expect(page.locator('#score-filter')).toBeVisible();
    await expect(page.locator('#clear-all-records')).toBeVisible();
  });

  test('执行AI检测并保存记录', async () => {
    // 切换回检测页面
    const detectionNavBtn = page.locator('.nav-button[data-page="detection"]');
    await detectionNavBtn.click();
    await page.waitForTimeout(500);
    
    // 输入测试网址
    const urlInput = page.locator('#url-input');
    await urlInput.fill('https://example.com');
    
    // 点击加载网站按钮
    const loadBtn = page.locator('#load-btn');
    await loadBtn.click();
    
    // 等待网站加载
    await page.waitForTimeout(3000);
    
    // 检查预览区域是否显示
    const previewSection = page.locator('#preview-section');
    await expect(previewSection).toBeVisible();
    
    // 点击分析按钮
    const analyzeBtn = page.locator('#analyze-btn');
    await expect(analyzeBtn).toBeEnabled();
    await analyzeBtn.click();
    
    // 等待分析完成
    await page.waitForTimeout(5000);
    
    // 检查结果是否显示
    const resultsSection = page.locator('#results-section');
    await expect(resultsSection).toBeVisible();
    
    // 检查AI评分是否显示
    const aiScore = page.locator('#ai-score');
    await expect(aiScore).toBeVisible();
    
    // 检查状态消息是否显示记录已保存
    const statusMessage = page.locator('#status-message');
    await expect(statusMessage).toContainText('记录已保存');
  });

  test('查看保存的检测记录', async () => {
    // 切换到记录页面
    const recordsNavBtn = page.locator('.nav-button[data-page="records"]');
    await recordsNavBtn.click();
    await page.waitForTimeout(1000);
    
    // 等待记录加载
    await page.waitForTimeout(2000);
    
    // 检查是否有记录显示
    const recordItems = page.locator('.record-item');
    await expect(recordItems.first()).toBeVisible();
    
    // 检查记录内容
    const firstRecord = recordItems.first();
    await expect(firstRecord.locator('.record-title')).toBeVisible();
    await expect(firstRecord.locator('.record-url')).toContainText('example.com');
    await expect(firstRecord.locator('.record-score')).toBeVisible();
    await expect(firstRecord.locator('.record-date')).toBeVisible();
    
    // 检查统计信息
    const totalRecords = page.locator('#total-records');
    await expect(totalRecords).not.toHaveText('0');
  });

  test('查看记录详情', async () => {
    // 确保在记录页面
    const recordsNavBtn = page.locator('.nav-button[data-page="records"]');
    await recordsNavBtn.click();
    await page.waitForTimeout(1000);
    
    // 点击第一条记录
    const firstRecord = page.locator('.record-item').first();
    await firstRecord.click();
    
    // 等待页面切换
    await page.waitForTimeout(1000);
    
    // 检查详情页面是否显示
    const detailPage = page.locator('#record-detail-page');
    await expect(detailPage).toHaveClass(/active/);
    
    // 检查详情内容
    const detailContent = page.locator('#record-detail-content');
    await expect(detailContent).toBeVisible();
    
    // 检查各个部分是否存在
    await expect(detailContent.locator('.detail-info')).toBeVisible();
    await expect(detailContent.locator('.detail-screenshot')).toBeVisible();
    await expect(detailContent.locator('.detail-features')).toBeVisible();
    await expect(detailContent.locator('.detail-analysis')).toBeVisible();
    
    // 检查返回按钮
    const backBtn = page.locator('#back-to-records');
    await expect(backBtn).toBeVisible();
  });

  test('搜索记录功能', async () => {
    // 切换到记录页面
    const recordsNavBtn = page.locator('.nav-button[data-page="records"]');
    await recordsNavBtn.click();
    await page.waitForTimeout(1000);
    
    // 在搜索框中输入关键词
    const searchInput = page.locator('#search-input');
    await searchInput.fill('example');
    
    // 等待搜索结果
    await page.waitForTimeout(1000);
    
    // 检查搜索结果
    const recordItems = page.locator('.record-item');
    const count = await recordItems.count();
    expect(count).toBeGreaterThan(0);
    
    // 清空搜索
    await searchInput.fill('');
    await page.waitForTimeout(1000);
  });

  test('评分筛选功能', async () => {
    // 确保在记录页面
    const recordsNavBtn = page.locator('.nav-button[data-page="records"]');
    await recordsNavBtn.click();
    await page.waitForTimeout(1000);
    
    // 选择评分筛选
    const scoreFilter = page.locator('#score-filter');
    await scoreFilter.selectOption('0-30');
    
    // 等待筛选结果
    await page.waitForTimeout(1000);
    
    // 重置筛选
    await scoreFilter.selectOption('');
    await page.waitForTimeout(1000);
  });

  test('删除记录功能', async () => {
    // 切换到记录页面
    const recordsNavBtn = page.locator('.nav-button[data-page="records"]');
    await recordsNavBtn.click();
    await page.waitForTimeout(1000);
    
    // 获取当前记录数量
    const totalRecordsBefore = await page.locator('#total-records').textContent();
    
    // 点击第一条记录进入详情
    const firstRecord = page.locator('.record-item').first();
    await firstRecord.click();
    await page.waitForTimeout(1000);
    
    // 点击删除按钮
    const deleteBtn = page.locator('#delete-current-record');
    await deleteBtn.click();
    
    // 处理确认对话框
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    
    // 等待删除完成并返回记录页面
    await page.waitForTimeout(2000);
    
    // 检查是否返回到记录页面
    const recordsPage = page.locator('#records-page');
    await expect(recordsPage).toBeVisible();
    
    // 检查记录数量是否减少
    const totalRecordsAfter = await page.locator('#total-records').textContent();
    expect(parseInt(totalRecordsAfter || '0')).toBeLessThan(parseInt(totalRecordsBefore || '0'));
  });

  test('界面响应性测试', async () => {
    // 测试不同视窗大小下的界面
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(500);
    
    // 检查导航菜单在小屏幕下的显示
    const navMenu = page.locator('.nav-menu');
    await expect(navMenu).toBeVisible();
    
    // 恢复正常大小
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
  });

  test('错误处理测试', async () => {
    // 切换到检测页面
    const detectionNavBtn = page.locator('.nav-button[data-page="detection"]');
    await detectionNavBtn.click();
    await page.waitForTimeout(500);
    
    // 输入无效网址
    const urlInput = page.locator('#url-input');
    await urlInput.fill('invalid-url');
    
    // 尝试加载
    const loadBtn = page.locator('#load-btn');
    await loadBtn.click();
    
    // 等待错误处理
    await page.waitForTimeout(2000);
    
    // 检查是否显示错误信息
    const statusMessage = page.locator('#status-message');
    await expect(statusMessage).toBeVisible();
  });
});
