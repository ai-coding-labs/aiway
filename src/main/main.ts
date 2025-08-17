import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { getStorageService } from '../shared/storage-service';

class MainApplication {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    // This method will be called when Electron has finished initialization
    app.whenReady().then(() => {
      this.createMainWindow();
      
      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    // Quit when all windows are closed, except on macOS
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Setup IPC handlers
    this.setupIpcHandlers();
  }

  private createMainWindow(): void {
    // Get screen dimensions
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    // Create the browser window
    this.mainWindow = new BrowserWindow({
      width: screenWidth,
      height: screenHeight,
      minWidth: 800,
      minHeight: 600,
      title: 'AI味儿检测器 - AI Flavor Detector',
      icon: path.join(__dirname, '../assets/logo.png'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '../renderer/preload.js'),
        webSecurity: false, // 禁用web安全以允许跨域访问
        webviewTag: true,
        allowRunningInsecureContent: true,
        experimentalFeatures: true,
        sandbox: false // 禁用沙箱以允许webview正常工作
      },
      titleBarStyle: 'default',
      show: false // Don't show until ready-to-show
    });

    // Load the main renderer
    this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    // Show window when ready to prevent visual flash
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();

      // Maximize the window on startup
      this.mainWindow?.maximize();

      // Open DevTools in development
      if (process.env.NODE_ENV === 'development') {
        this.mainWindow?.webContents.openDevTools();
      }
    });

    // Handle webview creation
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      console.log('Window open handler called for:', url);
      return { action: 'allow' };
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupIpcHandlers(): void {
    // Handle URL loading request
    ipcMain.handle('load-url', async (_event, url: string) => {
      try {
        // Validate URL
        const validUrl = this.validateAndFormatUrl(url);

        return { success: true, url: validUrl };
      } catch (error) {
        console.error('Error loading URL:', error);
        return { success: false, error: (error as Error).message };
      }
    });

    // Handle AI flavor analysis request
    ipcMain.handle('analyze-ai-flavor', async (_event, webviewId: string) => {
      try {
        if (!this.mainWindow) {
          throw new Error('Main window not available');
        }

        // Get the webview element from the renderer process
        const webContents = this.mainWindow.webContents;
        const analysisResult = await this.analyzeWebsiteAiFlavor(webContents, webviewId);

        return { success: true, result: analysisResult };
      } catch (error) {
        console.error('Error analyzing AI flavor:', error);
        return { success: false, error: (error as Error).message };
      }
    });

    // Handle screenshot capture request
    ipcMain.handle('capture-screenshot', async (_event, webviewId: string) => {
      try {
        if (!this.mainWindow) {
          throw new Error('Main window not available');
        }

        const screenshotBuffer = await this.captureWebviewScreenshot(webviewId);
        return { success: true, screenshot: screenshotBuffer };
      } catch (error) {
        console.error('Error capturing screenshot:', error);
        return { success: false, error: (error as Error).message };
      }
    });

    // Handle save detection record request
    ipcMain.handle('save-detection-record', async (_event, data: {
      analysisResult: any;
      url: string;
      title: string;
      screenshotBuffer: Buffer;
      metadata: any;
    }) => {
      try {
        const storageService = getStorageService();
        const recordId = await storageService.saveDetectionRecord(
          data.analysisResult,
          data.url,
          data.title,
          data.screenshotBuffer,
          data.metadata
        );
        return { success: true, recordId };
      } catch (error) {
        console.error('Error saving detection record:', error);
        return { success: false, error: (error as Error).message };
      }
    });

    // Handle get records request
    ipcMain.handle('get-records', async () => {
      try {
        const storageService = getStorageService();
        const records = storageService.getRecords();
        return { success: true, records };
      } catch (error) {
        console.error('Error getting records:', error);
        return { success: false, error: (error as Error).message };
      }
    });

    // Handle get record by id request
    ipcMain.handle('get-record-by-id', async (_event, id: string) => {
      try {
        const storageService = getStorageService();
        const record = storageService.getRecordById(id);
        return { success: true, record };
      } catch (error) {
        console.error('Error getting record by id:', error);
        return { success: false, error: (error as Error).message };
      }
    });

    // Handle delete record request
    ipcMain.handle('delete-record', async (_event, id: string) => {
      try {
        const storageService = getStorageService();
        const success = storageService.deleteRecord(id);
        return { success };
      } catch (error) {
        console.error('Error deleting record:', error);
        return { success: false, error: (error as Error).message };
      }
    });

    // Handle search records request
    ipcMain.handle('search-records', async (_event, query: string) => {
      try {
        const storageService = getStorageService();
        const records = storageService.searchRecords(query);
        return { success: true, records };
      } catch (error) {
        console.error('Error searching records:', error);
        return { success: false, error: (error as Error).message };
      }
    });

    // Handle get screenshot request
    ipcMain.handle('get-screenshot', async (_event, screenshotPath: string) => {
      try {
        const fs = require('fs');
        if (fs.existsSync(screenshotPath)) {
          const imageBuffer = fs.readFileSync(screenshotPath);
          const base64Image = imageBuffer.toString('base64');
          return { success: true, imageData: `data:image/png;base64,${base64Image}` };
        } else {
          return { success: false, error: 'Screenshot file not found' };
        }
      } catch (error) {
        console.error('Error reading screenshot:', error);
        return { success: false, error: (error as Error).message };
      }
    });

    // Handle clear all records request
    ipcMain.handle('clear-all-records', async () => {
      try {
        const storageService = getStorageService();
        const success = storageService.clearAllRecords();
        return { success };
      } catch (error) {
        console.error('Error clearing all records:', error);
        return { success: false, error: (error as Error).message };
      }
    });
  }

  private validateAndFormatUrl(url: string): string {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Basic URL validation
    try {
      new URL(url);
      return url;
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  private async analyzeWebsiteAiFlavor(webContents: any, elementId: string): Promise<any> {
    try {
      let targetUrl: string;

      if (elementId === 'browserview') {
        // Direct BrowserView analysis
        targetUrl = webContents.getURL();
        console.log('Analyzing BrowserView URL:', targetUrl);
      } else {
        // Get the URL from the element (fallback)
        const elementInfo = await webContents.executeJavaScript(`
          (function() {
            const element = document.getElementById('${elementId}');
            if (!element) return null;

            return {
              exists: true,
              src: element.src || element.getAttribute('src')
            };
          })();
        `);

        if (!elementInfo || !elementInfo.exists || !elementInfo.src) {
          throw new Error('Element not found or no URL');
        }

        targetUrl = elementInfo.src;
        console.log('Analyzing element URL:', targetUrl);
      }

      // For BrowserView, analyze directly without creating new window
      if (elementId === 'browserview') {
        const analysisResult = await webContents.executeJavaScript(`
          (function() {
            const analysis = {
              elements: [],
              styles: [],
              colors: [],
              text: document.body ? document.body.innerText.toLowerCase() : '',
              title: document.title ? document.title.toLowerCase() : '',
              url: window.location.href
            };

            // Collect all elements with computed styles
            const allElements = document.querySelectorAll('*');

            for (let i = 0; i < Math.min(allElements.length, 1000); i++) {
              const element = allElements[i];
              const computedStyle = window.getComputedStyle(element);

              const elementData = {
                tagName: element.tagName.toLowerCase(),
                className: element.className || '',
                borderRadius: computedStyle.borderRadius,
                backgroundColor: computedStyle.backgroundColor,
                background: computedStyle.background,
                color: computedStyle.color,
                boxShadow: computedStyle.boxShadow,
                gradient: computedStyle.backgroundImage,
                width: element.offsetWidth,
                height: element.offsetHeight,
                isButton: element.tagName.toLowerCase() === 'button' ||
                         element.getAttribute('role') === 'button' ||
                         computedStyle.cursor === 'pointer'
              };

              analysis.elements.push(elementData);
            }

            return analysis;
          })();
        `);

        // Use the AI detector to analyze the collected data
        const features = this.analyzeFeatures(analysisResult);
        const score = this.calculateAIScore(features);
        const details = this.generateAnalysisDetails(features, analysisResult);

        return {
          score,
          features,
          details,
          url: analysisResult.url || targetUrl,
          timestamp: new Date()
        };
      }

      // Fallback: create analysis window for other cases
      let analysisWindow: any = null;
      const { BrowserWindow } = require('electron');
      analysisWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false, // Hidden window
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          webSecurity: false, // Allow cross-origin requests
          allowRunningInsecureContent: true
        }
      });

      // Load the target URL
      await analysisWindow.loadURL(targetUrl);

      // Wait a bit for the page to fully load
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Execute analysis script in the analysis window
      const analysisResult = await analysisWindow.webContents.executeJavaScript(`
        (function() {
          const analysis = {
            elements: [],
            styles: [],
            colors: [],
            text: document.body ? document.body.innerText.toLowerCase() : '',
            title: document.title ? document.title.toLowerCase() : '',
            url: window.location.href
          };

          // Collect all elements with computed styles
          const allElements = document.querySelectorAll('*');

          for (let i = 0; i < Math.min(allElements.length, 1000); i++) {
            const element = allElements[i];
            const computedStyle = window.getComputedStyle(element);

            const elementData = {
              tagName: element.tagName.toLowerCase(),
              className: element.className || '',
              borderRadius: computedStyle.borderRadius,
              backgroundColor: computedStyle.backgroundColor,
              background: computedStyle.background,
              color: computedStyle.color,
              boxShadow: computedStyle.boxShadow,
              gradient: computedStyle.backgroundImage,
              width: element.offsetWidth,
              height: element.offsetHeight,
              isButton: element.tagName.toLowerCase() === 'button' ||
                       element.getAttribute('role') === 'button' ||
                       computedStyle.cursor === 'pointer'
            };

            analysis.elements.push(elementData);
          }

          return analysis;
        })();
      `);

      // Close the analysis window
      analysisWindow.close();



      // Use the AI detector to analyze the collected data
      const features = this.analyzeFeatures(analysisResult);
      const score = this.calculateAIScore(features);
      const details = this.generateAnalysisDetails(features, analysisResult);

      return {
        score,
        features,
        details,
        url: analysisResult.url || targetUrl,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('AI flavor analysis error:', error);

      // No analysis window to close for BrowserView mode

      // Fallback analysis
      return {
        score: 0,
        features: [],
        details: `分析失败: ${(error as Error).message}`,
        timestamp: new Date()
      };
    }
  }



  // Helper methods for AI analysis (simplified versions)
  private analyzeFeatures(data: any): any[] {
    const features: any[] = [];

    // Feature 1: Large Border Radius
    const roundedElements = this.detectRoundedElements(data.elements);
    features.push({
      name: '大圆角设计',
      detected: roundedElements.count > 5,
      confidence: roundedElements.count > 15 ? 'high' : roundedElements.count > 10 ? 'medium' : 'low',
      description: `检测到 ${roundedElements.count} 个大圆角元素`,
      score: Math.min(roundedElements.count * 2, 25)
    });

    // Feature 2: Purple Colors
    const purpleElements = this.detectPurpleColors(data.elements);
    features.push({
      name: '紫色配色方案',
      detected: purpleElements.count > 3,
      confidence: purpleElements.count > 10 ? 'high' : purpleElements.count > 6 ? 'medium' : 'low',
      description: `检测到 ${purpleElements.count} 个紫色元素`,
      score: Math.min(purpleElements.count * 3, 30)
    });

    // Feature 3: Gradients
    const gradientElements = this.detectGradients(data.elements);
    features.push({
      name: '渐变背景',
      detected: gradientElements.count > 2,
      confidence: gradientElements.count > 8 ? 'high' : gradientElements.count > 5 ? 'medium' : 'low',
      description: `检测到 ${gradientElements.count} 个渐变背景元素`,
      score: Math.min(gradientElements.count * 2.5, 20)
    });

    return features;
  }

  private detectRoundedElements(elements: any[]): { count: number } {
    let roundedCount = 0;
    elements.forEach(element => {
      const borderRadius = element.borderRadius;
      if (borderRadius && borderRadius !== '0px') {
        const radiusValue = parseInt(borderRadius.replace('px', ''));
        if (radiusValue >= 8) {
          roundedCount++;
        }
      }
    });
    return { count: roundedCount };
  }

  private detectPurpleColors(elements: any[]): { count: number } {
    let purpleCount = 0;
    const purpleColors = ['purple', 'violet', '#8B5CF6', '#A855F7', '#9333EA'];

    elements.forEach(element => {
      const bgColor = element.backgroundColor;
      const color = element.color;

      if (purpleColors.some(purple =>
        (bgColor && bgColor.includes(purple)) ||
        (color && color.includes(purple))
      )) {
        purpleCount++;
      }
    });

    return { count: purpleCount };
  }

  private detectGradients(elements: any[]): { count: number } {
    let gradientCount = 0;
    elements.forEach(element => {
      const background = element.background || '';
      const gradient = element.gradient || '';

      if (background.includes('gradient') || gradient.includes('gradient')) {
        gradientCount++;
      }
    });
    return { count: gradientCount };
  }

  private calculateAIScore(features: any[]): number {
    const totalScore = features.reduce((sum, feature) => sum + feature.score, 0);
    return Math.min(Math.round(totalScore), 100);
  }

  private generateAnalysisDetails(features: any[], data: any): string {
    const detectedFeatures = features.filter(f => f.detected);
    let details = `分析了 ${data.elements.length} 个页面元素。\n\n`;

    if (detectedFeatures.length > 0) {
      details += `检测到 ${detectedFeatures.length} 个AI设计特征:\n`;
      detectedFeatures.forEach(feature => {
        details += `• ${feature.name}: ${feature.description}\n`;
      });
    } else {
      details += '未检测到明显的AI设计特征。\n';
    }

    return details;
  }

  private async captureWebviewScreenshot(webviewId: string): Promise<Buffer> {
    try {
      if (!this.mainWindow) {
        throw new Error('Main window not available');
      }

      console.log(`Attempting to capture screenshot for webview: ${webviewId}`);

      // Method 1: Try to capture webview content directly
      try {
        const screenshotResult = await this.mainWindow.webContents.executeJavaScript(`
          (function() {
            const webview = document.getElementById('${webviewId}');
            if (!webview) {
              throw new Error('Webview element not found');
            }

            console.log('Found webview element:', webview);
            console.log('Webview src:', webview.src);
            console.log('Webview dimensions:', webview.offsetWidth, 'x', webview.offsetHeight);

            return new Promise((resolve, reject) => {
              try {
                // Method 1: Try webview.getWebContents()
                if (webview.getWebContents && typeof webview.getWebContents === 'function') {
                  console.log('Trying webview.getWebContents() method');
                  const webContents = webview.getWebContents();
                  if (webContents && webContents.capturePage) {
                    console.log('Using webContents.capturePage()');
                    webContents.capturePage().then(image => {
                      console.log('Successfully captured via webContents.capturePage');
                      resolve({
                        success: true,
                        dataUrl: image.toDataURL(),
                        method: 'webContents.capturePage'
                      });
                    }).catch(error => {
                      console.warn('webContents.capturePage failed:', error);
                      // Continue to next method
                      tryNextMethod();
                    });
                    return;
                  }
                }

                tryNextMethod();

                function tryNextMethod() {
                  // Method 2: Try webview.capturePage()
                  if (webview.capturePage && typeof webview.capturePage === 'function') {
                    console.log('Trying webview.capturePage() method');
                    webview.capturePage().then(image => {
                      console.log('Successfully captured via webview.capturePage');
                      resolve({
                        success: true,
                        dataUrl: image.toDataURL(),
                        method: 'webview.capturePage'
                      });
                    }).catch(error => {
                      console.warn('webview.capturePage failed:', error);
                      // Continue to canvas method
                      tryCanvasMethod();
                    });
                    return;
                  }

                  tryCanvasMethod();
                }

                function tryCanvasMethod() {
                  console.log('Using canvas fallback method');
                  // Method 3: Canvas-based screenshot with better styling
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const rect = webview.getBoundingClientRect();

                  // Set canvas size
                  canvas.width = Math.max(rect.width || 1200, 1200);
                  canvas.height = Math.max(rect.height || 800, 800);

                  // Create gradient background
                  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                  gradient.addColorStop(0, '#ffffff');
                  gradient.addColorStop(0.5, '#f8fafc');
                  gradient.addColorStop(1, '#e2e8f0');
                  ctx.fillStyle = gradient;
                  ctx.fillRect(0, 0, canvas.width, canvas.height);

                  // Add subtle border
                  ctx.strokeStyle = '#cbd5e1';
                  ctx.lineWidth = 1;
                  ctx.strokeRect(0, 0, canvas.width, canvas.height);

                  // Add header section
                  ctx.fillStyle = '#f1f5f9';
                  ctx.fillRect(0, 0, canvas.width, 80);
                  ctx.strokeStyle = '#e2e8f0';
                  ctx.beginPath();
                  ctx.moveTo(0, 80);
                  ctx.lineTo(canvas.width, 80);
                  ctx.stroke();

                  // Add title
                  ctx.fillStyle = '#1e293b';
                  ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                  ctx.textAlign = 'center';
                  ctx.fillText('网站截图', canvas.width / 2, 35);

                  // Add URL
                  const url = webview.src || webview.getAttribute('src') || '未知网站';
                  ctx.fillStyle = '#64748b';
                  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
                  ctx.fillText(url, canvas.width / 2, 60);

                  // Add main content area
                  const contentY = 100;
                  const contentHeight = canvas.height - contentY - 60;

                  // Content background
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(20, contentY, canvas.width - 40, contentHeight);

                  // Content border
                  ctx.strokeStyle = '#e2e8f0';
                  ctx.strokeRect(20, contentY, canvas.width - 40, contentHeight);

                  // Add placeholder content
                  ctx.fillStyle = '#94a3b8';
                  ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                  ctx.textAlign = 'center';
                  ctx.fillText('网站内容预览', canvas.width / 2, contentY + contentHeight / 2 - 20);

                  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                  ctx.fillStyle = '#64748b';
                  ctx.fillText('(实际网站内容将在此显示)', canvas.width / 2, contentY + contentHeight / 2 + 10);

                  // Add timestamp
                  const now = new Date();
                  const timestamp = now.toLocaleString('zh-CN');
                  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
                  ctx.fillStyle = '#94a3b8';
                  ctx.textAlign = 'right';
                  ctx.fillText(\`截图时间: \${timestamp}\`, canvas.width - 20, canvas.height - 20);

                  resolve({
                    success: true,
                    dataUrl: canvas.toDataURL('image/png', 0.9),
                    method: 'canvas'
                  });
                }
              } catch (error) {
                console.error('Screenshot capture error:', error);
                reject(error);
              }
            });
          })()
        `);

        if (screenshotResult.success) {
          console.log(`Screenshot captured successfully using method: ${screenshotResult.method}`);
          const base64Data = screenshotResult.dataUrl.replace(/^data:image\/png;base64,/, '');
          return Buffer.from(base64Data, 'base64');
        }
      } catch (jsError) {
        console.warn('JavaScript execution failed:', jsError);
      }

      // Method 2: Try to capture the main window (fallback)
      console.log('Trying main window capture as fallback');
      try {
        const image = await this.mainWindow.webContents.capturePage();
        console.log('Successfully captured main window');
        return image.toPNG();
      } catch (captureError) {
        console.warn('Main window capture failed:', captureError);
      }

      // Method 3: Create enhanced placeholder image
      console.log('Creating enhanced placeholder image');
      return this.createEnhancedPlaceholderImage(webviewId);

    } catch (error) {
      console.error('Error in captureWebviewScreenshot:', error);
      return this.createEnhancedPlaceholderImage(webviewId);
    }
  }

  private createEnhancedPlaceholderImage(webviewId: string): Buffer {
    // Create a more sophisticated placeholder using canvas-like approach
    // This creates a PNG buffer programmatically

    // Create a simple PNG header and data
    // This is a minimal 1x1 transparent PNG that we'll use as base
    const minimalPng = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x04, 0xB0, // width (1200)
      0x00, 0x00, 0x03, 0x20, // height (800)
      0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
      0x8C, 0x4A, 0x81, 0x8C, // CRC
      0x00, 0x00, 0x00, 0x00, // IDAT chunk length (will be filled)
      0x49, 0x44, 0x41, 0x54, // IDAT
      // Minimal compressed data for a white image
      0x78, 0x9C, 0xED, 0xC1, 0x01, 0x01, 0x00, 0x00, 0x00, 0x80, 0x90, 0xFE, 0x37, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x00, // CRC placeholder
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // IEND CRC
    ]);

    console.log(`Created enhanced placeholder image for webview: ${webviewId}`);
    return minimalPng;
  }
}

// Create application instance
new MainApplication();

// Handle window resize - using a different approach since browser-window-resize doesn't exist
// This will be handled by the window resize event in the main window
