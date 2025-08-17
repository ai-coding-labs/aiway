import { test, expect, _electron as electron } from '@playwright/test';
import { ElectronApplication, Page } from 'playwright';

test.describe('Console Test', () => {
  let electronApp: ElectronApplication;
  let page: Page;

  test.beforeAll(async () => {
    electronApp = await electron.launch({
      args: ['.'],
      cwd: process.cwd()
    });
    
    page = await electronApp.firstWindow();
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('check console output', async () => {
    const consoleLogs: string[] = [];
    
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      console.log('Console:', text);
    });
    
    // Wait for app to initialize
    await page.waitForTimeout(5000);
    
    console.log('All console logs:');
    consoleLogs.forEach((log, index) => {
      console.log(`${index + 1}: ${log}`);
    });
    
    // Check if we have any console logs
    expect(consoleLogs.length).toBeGreaterThan(0);
  });
});
