// Renderer process main script
import { ReportCardGenerator, ReportCardData, ReportCardOptions } from '../shared/report-card-generator';

class AIFlavorDetectorApp {
  private urlInput!: HTMLInputElement;
  private loadButton!: HTMLButtonElement;
  private analyzeButton!: HTMLButtonElement;
  private clearButton!: HTMLButtonElement;
  private autoAnalyzeCheckbox!: HTMLInputElement;
  private statusMessage!: HTMLElement;
  private progressBar!: HTMLElement;
  private resultsSection!: HTMLElement;
  private previewSection!: HTMLElement;
  private aiScore!: HTMLElement;
  private featuresList!: HTMLElement;
  private analysisDetails!: HTMLElement;
  private errorModal!: HTMLElement;
  private successModal!: HTMLElement;

  // Report Card Generator elements
  private reportCardGenerator!: HTMLElement;
  private generateCardBtn!: HTMLButtonElement;
  private copyCardBtn!: HTMLButtonElement;
  private downloadCardBtn!: HTMLButtonElement;
  private fullscreenCardBtn!: HTMLButtonElement;
  private cardThemeSelect!: HTMLSelectElement;
  private includeTimestampCheckbox!: HTMLInputElement;
  private reportCardPreview!: HTMLElement;
  private reportCardCanvasContainer!: HTMLElement;
  private cardLoading!: HTMLElement;
  private cardSuccessMessage!: HTMLElement;
  private cardSuccessText!: HTMLElement;

  // Report Card Generator instance
  private cardGenerator: ReportCardGenerator;
  private currentAnalysisResult: any = null;

  // Navigation elements
  private navButtons!: NodeListOf<HTMLButtonElement>;
  private pages!: NodeListOf<HTMLElement>;

  // Records page elements
  private recordsList!: HTMLElement;
  private searchInput!: HTMLInputElement;
  private scoreFilter!: HTMLSelectElement;
  private totalRecordsSpan!: HTMLElement;
  private averageScoreSpan!: HTMLElement;

  private currentUrl: string = '';
  private isLoading: boolean = false;
  private autoAnalyzeEnabled: boolean = true;
  private currentRecord: any = null;

  constructor() {
    this.cardGenerator = new ReportCardGenerator();
    this.initializeElements();
    this.setupEventListeners();
    this.initializeApp();
  }

  private initializeElements(): void {
    // Get DOM elements
    this.urlInput = document.getElementById('url-input') as HTMLInputElement;
    this.loadButton = document.getElementById('load-btn') as HTMLButtonElement;
    this.analyzeButton = document.getElementById('analyze-btn') as HTMLButtonElement;
    this.clearButton = document.getElementById('clear-btn') as HTMLButtonElement;
    this.autoAnalyzeCheckbox = document.getElementById('auto-analyze') as HTMLInputElement;
    this.statusMessage = document.getElementById('status-message') as HTMLElement;
    this.progressBar = document.getElementById('progress-bar') as HTMLElement;
    this.resultsSection = document.getElementById('results-section') as HTMLElement;
    this.previewSection = document.getElementById('preview-section') as HTMLElement;
    this.aiScore = document.getElementById('ai-score') as HTMLElement;
    this.featuresList = document.getElementById('features-list') as HTMLElement;
    this.analysisDetails = document.getElementById('analysis-details') as HTMLElement;
    this.errorModal = document.getElementById('error-modal') as HTMLElement;
    this.successModal = document.getElementById('success-modal') as HTMLElement;

    // Navigation elements
    this.navButtons = document.querySelectorAll('.nav-button');
    this.pages = document.querySelectorAll('.page');

    // Records page elements
    this.recordsList = document.getElementById('records-list') as HTMLElement;
    this.searchInput = document.getElementById('search-input') as HTMLInputElement;
    this.scoreFilter = document.getElementById('score-filter') as HTMLSelectElement;
    this.totalRecordsSpan = document.getElementById('total-records') as HTMLElement;
    this.averageScoreSpan = document.getElementById('average-score') as HTMLElement;

    // Report Card Generator elements
    this.reportCardGenerator = document.getElementById('report-card-generator') as HTMLElement;
    this.generateCardBtn = document.getElementById('generate-card-btn') as HTMLButtonElement;
    this.copyCardBtn = document.getElementById('copy-card-btn') as HTMLButtonElement;
    this.downloadCardBtn = document.getElementById('download-card-btn') as HTMLButtonElement;
    this.fullscreenCardBtn = document.getElementById('fullscreen-card-btn') as HTMLButtonElement;
    this.cardThemeSelect = document.getElementById('card-theme') as HTMLSelectElement;
    this.includeTimestampCheckbox = document.getElementById('include-timestamp') as HTMLInputElement;
    this.reportCardPreview = document.getElementById('report-card-preview') as HTMLElement;
    this.reportCardCanvasContainer = document.getElementById('report-card-canvas-container') as HTMLElement;
    this.cardLoading = document.getElementById('card-loading') as HTMLElement;
    this.cardSuccessMessage = document.getElementById('card-success-message') as HTMLElement;
    this.cardSuccessText = document.getElementById('card-success-text') as HTMLElement;

    // Validate all elements exist
    const elements = [
      this.urlInput, this.loadButton, this.analyzeButton, this.clearButton, this.autoAnalyzeCheckbox,
      this.statusMessage, this.progressBar, this.resultsSection, this.previewSection,
      this.aiScore, this.featuresList, this.analysisDetails, this.errorModal, this.successModal,
      this.reportCardGenerator, this.generateCardBtn, this.copyCardBtn
    ];

    elements.forEach((element, index) => {
      if (!element) {
        console.error(`Required DOM element not found at index ${index}`);
      }
    });
  }

  private setupEventListeners(): void {
    // URL input events
    this.urlInput.addEventListener('input', () => {
      this.validateUrlInput();
    });

    this.urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.isLoading) {
        this.handleLoadUrl();
      }
    });

    // Button events
    this.loadButton.addEventListener('click', () => {
      console.log('Load button clicked');
      this.handleLoadUrl();
    });

    this.analyzeButton.addEventListener('click', () => {
      this.handleAnalyzeAiFlavor();
    });

    this.clearButton.addEventListener('click', () => {
      this.handleClearResults();
    });

    // Auto analyze checkbox
    this.autoAnalyzeCheckbox.addEventListener('change', () => {
      this.autoAnalyzeEnabled = this.autoAnalyzeCheckbox.checked;
      console.log('Auto analyze enabled:', this.autoAnalyzeEnabled);
    });



    // Example URL buttons
    this.setupExampleUrlButtons();

    // Navigation events
    this.navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const page = button.getAttribute('data-page');
        if (page) {
          this.switchToPage(page);
        }
      });
    });

    // Records page events
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        this.filterRecords();
      });
    }

    if (this.scoreFilter) {
      this.scoreFilter.addEventListener('change', () => {
        this.filterRecords();
      });
    }

    const clearAllRecordsBtn = document.getElementById('clear-all-records');
    if (clearAllRecordsBtn) {
      clearAllRecordsBtn.addEventListener('click', () => {
        this.handleClearAllRecords();
      });
    }

    const backToRecordsBtn = document.getElementById('back-to-records');
    if (backToRecordsBtn) {
      backToRecordsBtn.addEventListener('click', () => {
        this.switchToPage('records');
      });
    }

    const deleteCurrentRecordBtn = document.getElementById('delete-current-record');
    if (deleteCurrentRecordBtn) {
      deleteCurrentRecordBtn.addEventListener('click', () => {
        this.handleDeleteCurrentRecord();
      });
    }

    // Preview controls
    const refreshPreview = document.getElementById('refresh-preview');
    const togglePreview = document.getElementById('toggle-preview');

    if (refreshPreview) {
      refreshPreview.addEventListener('click', () => {
        this.handleRefreshPreview();
      });
    }

    if (togglePreview) {
      togglePreview.addEventListener('click', () => {
        this.handleTogglePreview();
      });
    }

    // Modal events
    this.setupModalEvents();

    // Report Card Generator events
    this.setupReportCardEvents();
  }

  private setupModalEvents(): void {
    // Error modal
    const closeErrorModal = document.getElementById('close-error-modal');
    const errorOkBtn = document.getElementById('error-ok-btn');

    if (closeErrorModal) {
      closeErrorModal.addEventListener('click', () => {
        this.hideErrorModal();
      });
    }

    if (errorOkBtn) {
      errorOkBtn.addEventListener('click', () => {
        this.hideErrorModal();
      });
    }

    // Success modal
    const closeSuccessModal = document.getElementById('close-success-modal');
    const successOkBtn = document.getElementById('success-ok-btn');

    if (closeSuccessModal) {
      closeSuccessModal.addEventListener('click', () => {
        this.hideSuccessModal();
      });
    }

    if (successOkBtn) {
      successOkBtn.addEventListener('click', () => {
        this.hideSuccessModal();
      });
    }

    // Close modals on backdrop click
    this.errorModal.addEventListener('click', (e) => {
      if (e.target === this.errorModal) {
        this.hideErrorModal();
      }
    });

    this.successModal.addEventListener('click', (e) => {
      if (e.target === this.successModal) {
        this.hideSuccessModal();
      }
    });
  }

  private setupReportCardEvents(): void {
    // Generate card button
    if (this.generateCardBtn) {
      this.generateCardBtn.addEventListener('click', () => {
        this.handleGenerateCard();
      });
    }

    // Copy card button
    if (this.copyCardBtn) {
      this.copyCardBtn.addEventListener('click', () => {
        this.handleCopyCard();
      });
    }

    // Download card button
    if (this.downloadCardBtn) {
      this.downloadCardBtn.addEventListener('click', () => {
        this.handleDownloadCard();
      });
    }

    // Fullscreen card button
    if (this.fullscreenCardBtn) {
      this.fullscreenCardBtn.addEventListener('click', () => {
        this.handleFullscreenCard();
      });
    }

    // Theme change
    if (this.cardThemeSelect) {
      this.cardThemeSelect.addEventListener('change', () => {
        if (this.currentAnalysisResult) {
          this.handleGenerateCard();
        }
      });
    }

    // Timestamp checkbox change
    if (this.includeTimestampCheckbox) {
      this.includeTimestampCheckbox.addEventListener('change', () => {
        if (this.currentAnalysisResult) {
          this.handleGenerateCard();
        }
      });
    }
  }

  private initializeApp(): void {
    console.log('Initializing app...');
    console.log('Load button:', this.loadButton);
    console.log('URL input:', this.urlInput);

    this.updateStatus('准备就绪，请输入要检测的网站地址');
    this.validateUrlInput();

    // 预填充一个测试URL以便快速测试
    if (!this.urlInput.value) {
      this.urlInput.value = 'https://example.com';
      this.validateUrlInput();
    }

    // 直接测试加载功能
    setTimeout(() => {
      console.log('Testing load functionality...');
      this.testLoadFunctionality();
    }, 2000);

    // Wait for webview to be ready
    this.waitForWebviewReady();
  }

  private async testLoadFunctionality(): Promise<void> {
    console.log('Testing load with example.com');
    this.urlInput.value = 'https://example.com';
    await this.handleLoadUrl();
  }

  private waitForWebviewReady(): void {
    const checkWebview = () => {
      const webview = document.getElementById('website-webview');
      if (webview) {
        console.log('Webview element found and ready');
      } else {
        console.log('Webview element not found, retrying...');
        setTimeout(checkWebview, 100);
      }
    };
    checkWebview();
  }

  private validateUrlInput(): void {
    const url = this.urlInput.value.trim();
    const isValid = url.length > 0 && this.isValidUrl(url);
    
    this.loadButton.disabled = !isValid || this.isLoading;
    
    if (url.length > 0 && !isValid) {
      this.urlInput.classList.add('invalid');
    } else {
      this.urlInput.classList.remove('invalid');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private async handleLoadUrl(): Promise<void> {
    console.log('handleLoadUrl called');
    const url = this.urlInput.value.trim();
    console.log('URL to load:', url);

    if (!url || this.isLoading) {
      console.log('URL empty or already loading');
      return;
    }

    this.setLoading(true);
    this.updateStatus('正在验证网址...', 'loading');
    this.showProgress();

    try {
      console.log('window.electronAPI:', window.electronAPI);
      const result = await window.electronAPI.loadUrl(url);
      console.log('loadUrl result:', result);

      if (result.success) {
        this.currentUrl = result.url || url;
        this.updateStatus('正在加载网站...', 'loading');

        // Show preview section first
        this.showPreviewSection();

        // Load webview immediately after showing preview section
        this.loadUrlInWebview(this.currentUrl);
      } else {
        // 即使URL验证失败，如果格式看起来合理，也尝试进行基本分析
        if (this.isValidUrlFormat(url)) {
          this.currentUrl = url;
          this.updateStatus('URL验证失败，但格式正确，可尝试分析', 'warning');
          this.showPreviewSection();
          this.analyzeButton.disabled = false;
          this.setLoading(false);
          this.hideProgress();
        } else {
          throw new Error(result.error || '网址验证失败');
        }
      }
    } catch (error) {
      console.error('Load URL error:', error);

      // 尝试基本的URL格式检查作为备用方案
      if (this.isValidUrlFormat(url)) {
        this.currentUrl = url;
        this.updateStatus('网络连接可能有问题，但URL格式正确，可尝试分析', 'warning');
        this.showPreviewSection();
        this.analyzeButton.disabled = false;
        this.setLoading(false);
        this.hideProgress();
      } else {
        this.updateStatus('加载网站失败', 'error');
        this.showErrorModal(`加载网站失败: ${(error as Error).message}。请检查网址格式或网络连接。`);
        this.setLoading(false);
        this.hideProgress();
      }
    }
  }

  private isValidUrlFormat(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private loadUrlInWebview(url: string): void {
    const webview = document.getElementById('website-webview') as any;

    if (webview) {
      console.log('Loading URL in webview:', url);
      console.log('Webview element:', webview);
      console.log('Webview attributes:', {
        nodeintegration: webview.getAttribute('nodeintegration'),
        disablewebsecurity: webview.getAttribute('disablewebsecurity'),
        allowpopups: webview.getAttribute('allowpopups'),
        useragent: webview.getAttribute('useragent')
      });

      // Reset webview
      webview.src = 'about:blank';

      setTimeout(() => {
        // Set up event listeners
        const onDomReady = () => {
          console.log('Webview DOM ready');
          console.log('Webview URL:', webview.getURL());
          console.log('Webview title:', webview.getTitle());

          this.updateStatus(`网站加载成功: ${url}`, 'success');
          this.analyzeButton.disabled = false;
          this.setLoading(false);
          this.hideProgress();

          // Auto analyze if enabled
          if (this.autoAnalyzeEnabled) {
            setTimeout(() => {
              this.handleAnalyzeAiFlavor();
            }, 500);
          }

          webview.removeEventListener('dom-ready', onDomReady);
          webview.removeEventListener('did-fail-load', onFailLoad);
          webview.removeEventListener('did-start-loading', onStartLoading);
          webview.removeEventListener('did-stop-loading', onStopLoading);
        };

        const onStartLoading = () => {
          console.log('Webview started loading:', webview.getURL());
        };

        const onStopLoading = () => {
          console.log('Webview stopped loading:', webview.getURL());
        };

        const onFailLoad = (event: any) => {
          console.error('Webview failed to load:', event);
          console.log('Error details:', event.errorDescription, event.errorCode, event.validatedURL);

          // 对于某些网站，即使加载失败也可能是因为CORS限制，我们仍然可以尝试分析
          if (event.errorCode === -6 || event.errorCode === -20 || event.errorCode === -27) {
            // ERR_FILE_NOT_FOUND, ERR_BLOCKED_BY_CLIENT, or ERR_BLOCKED_BY_RESPONSE
            console.log('可能是CORS限制或安全策略，尝试继续分析');
            this.updateStatus('网站可能有访问限制，但仍可尝试分析', 'warning');
            this.setLoading(false);
            this.hideProgress();
            this.analyzeButton.disabled = false;

            webview.removeEventListener('dom-ready', onDomReady);
            webview.removeEventListener('did-fail-load', onFailLoad);
            return;
          }

          this.updateStatus('网站加载失败', 'error');
          this.setLoading(false);
          this.hideProgress();
          this.showErrorModal('网站加载失败，请检查网址是否正确或网络连接。部分网站可能有访问限制。');

          webview.removeEventListener('dom-ready', onDomReady);
          webview.removeEventListener('did-fail-load', onFailLoad);
        };

        webview.addEventListener('dom-ready', onDomReady);
        webview.addEventListener('did-fail-load', onFailLoad);
        webview.addEventListener('did-start-loading', onStartLoading);
        webview.addEventListener('did-stop-loading', onStopLoading);

        // Add additional debugging events
        webview.addEventListener('did-finish-load', () => {
          console.log('Webview finished loading');
        });

        webview.addEventListener('did-navigate', (event: any) => {
          console.log('Webview navigated to:', event.url);
        });

        webview.addEventListener('console-message', (event: any) => {
          console.log('Webview console:', event.message);
        });

        // Load the URL
        console.log('Setting webview src to:', url);
        webview.src = url;

        // Set timeout
        setTimeout(() => {
          if (this.isLoading) {
            console.log('Webview loading timeout, assuming success');
            this.updateStatus(`网站加载成功: ${url}`, 'success');
            this.analyzeButton.disabled = false;
            this.setLoading(false);
            this.hideProgress();
          }
        }, 8000);
      }, 500);
    } else {
      console.error('Webview element not found!');
      this.updateStatus('网站加载失败', 'error');
      this.setLoading(false);
      this.hideProgress();
      this.showErrorModal('Webview组件未找到，请刷新应用重试');
    }
  }



  private async handleAnalyzeAiFlavor(): Promise<void> {
    if (!this.currentUrl || this.isLoading) {
      return;
    }

    this.setLoading(true);
    this.updateStatus('正在分析网站的AI味...', 'loading');
    this.showProgress();

    try {
      // Use webview for analysis (the main process will create a separate window for actual analysis)
      const result = await window.electronAPI.analyzeAiFlavor('website-webview');

      if (result.success) {
        this.displayAnalysisResults(result.result);
        this.updateStatus('AI味检测完成，正在保存记录...', 'success');

        // Save detection record
        await this.saveDetectionRecord(result.result);

        this.updateStatus('AI味检测完成，记录已保存', 'success');
      } else {
        throw new Error(result.error || 'AI味检测失败');
      }
    } catch (error) {
      console.error('Analyze AI flavor error:', error);
      this.updateStatus('AI味检测失败', 'error');
      this.showErrorModal(`AI味检测失败: ${(error as Error).message}`);
    } finally {
      this.setLoading(false);
      this.hideProgress();
    }
  }

  private async saveDetectionRecord(analysisResult: any): Promise<void> {
    try {
      // Capture screenshot
      this.updateStatus('正在保存截图...', 'loading');
      const screenshotResult = await window.electronAPI.captureScreenshot('website-webview');

      if (!screenshotResult.success) {
        console.warn('Failed to capture screenshot:', screenshotResult.error);
        // Continue without screenshot
      }

      // Get website title
      const webview = document.getElementById('website-webview') as any;
      let title = 'Unknown Website';
      try {
        if (webview && webview.getTitle) {
          title = webview.getTitle() || this.currentUrl;
        } else {
          title = this.currentUrl;
        }
      } catch (error) {
        console.warn('Failed to get website title:', error);
        title = this.currentUrl;
      }

      // Prepare metadata
      const metadata = {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        loadTime: Date.now() // This is a simplified load time
      };

      // Save the record
      const saveResult = await window.electronAPI.saveDetectionRecord({
        analysisResult,
        url: this.currentUrl,
        title,
        screenshotBuffer: screenshotResult.screenshot || Buffer.alloc(0),
        metadata
      });

      if (saveResult.success) {
        console.log('Detection record saved with ID:', saveResult.recordId);
      } else {
        console.error('Failed to save detection record:', saveResult.error);
      }
    } catch (error) {
      console.error('Error saving detection record:', error);
      // Don't throw error here to avoid interrupting the main flow
    }
  }

  private handleClearResults(): void {
    this.resultsSection.style.display = 'none';
    this.previewSection.style.display = 'none';
    this.urlInput.value = '';
    this.currentUrl = '';
    this.currentAnalysisResult = null;
    this.analyzeButton.disabled = true;

    // Hide report card generator
    if (this.reportCardGenerator) {
      this.reportCardGenerator.style.display = 'none';
    }

    // Reset card generator state
    if (this.reportCardPreview) {
      this.reportCardPreview.classList.remove('visible');
    }
    if (this.copyCardBtn) {
      this.copyCardBtn.disabled = true;
    }
    if (this.cardSuccessMessage) {
      this.cardSuccessMessage.classList.remove('visible');
    }

    this.updateStatus('结果已清除，请输入新的网站地址');
    this.validateUrlInput();
  }

  private handleRefreshPreview(): void {
    if (this.currentUrl) {
      const webview = document.getElementById('website-webview') as any;
      if (webview) {
        webview.reload();
      }
    }
  }

  private handleTogglePreview(): void {
    const toggleBtn = document.getElementById('toggle-preview') as HTMLButtonElement;
    const previewContainer = document.querySelector('.preview-container') as HTMLElement;
    
    if (previewContainer.style.display === 'none') {
      previewContainer.style.display = 'block';
      toggleBtn.textContent = '隐藏预览';
    } else {
      previewContainer.style.display = 'none';
      toggleBtn.textContent = '显示预览';
    }
  }

  private displayAnalysisResults(result: any): void {
    // Store current analysis result for card generation
    this.currentAnalysisResult = result;

    // Update analyzed URL display
    const analyzedUrlElement = document.getElementById('analyzed-url');
    const urlToDisplay = result.url || this.currentUrl || '未知网站';
    if (analyzedUrlElement) {
      analyzedUrlElement.textContent = urlToDisplay;
      analyzedUrlElement.title = urlToDisplay; // Show full URL on hover
    }

    // Update score with color coding
    const score = result.score || 0;
    this.aiScore.textContent = score.toString();

    // Update score circle color based on score (10-point intervals)
    const scoreCircle = this.aiScore.parentElement;
    if (scoreCircle) {
      scoreCircle.className = 'score-circle';

      // Determine color class based on 10-point intervals
      if (score >= 90) {
        scoreCircle.classList.add('score-90-100');
      } else if (score >= 80) {
        scoreCircle.classList.add('score-80-89');
      } else if (score >= 70) {
        scoreCircle.classList.add('score-70-79');
      } else if (score >= 60) {
        scoreCircle.classList.add('score-60-69');
      } else if (score >= 50) {
        scoreCircle.classList.add('score-50-59');
      } else if (score >= 40) {
        scoreCircle.classList.add('score-40-49');
      } else if (score >= 30) {
        scoreCircle.classList.add('score-30-39');
      } else if (score >= 20) {
        scoreCircle.classList.add('score-20-29');
      } else if (score >= 10) {
        scoreCircle.classList.add('score-10-19');
      } else {
        scoreCircle.classList.add('score-0-9');
      }
    }

    // Update features list
    this.featuresList.innerHTML = '';
    if (result.features && result.features.length > 0) {
      const detectedFeatures = result.features.filter((f: any) => f.detected);
      const undetectedFeatures = result.features.filter((f: any) => !f.detected);

      if (detectedFeatures.length > 0) {
        const detectedTitle = document.createElement('h4');
        detectedTitle.textContent = '检测到的特征:';
        detectedTitle.className = 'features-subtitle detected';
        this.featuresList.appendChild(detectedTitle);

        detectedFeatures.forEach((feature: any) => {
          const featureElement = this.createFeatureElement(feature);
          this.featuresList.appendChild(featureElement);
        });
      }

      if (undetectedFeatures.length > 0) {
        const undetectedTitle = document.createElement('h4');
        undetectedTitle.textContent = '未检测到的特征:';
        undetectedTitle.className = 'features-subtitle undetected';
        this.featuresList.appendChild(undetectedTitle);

        undetectedFeatures.forEach((feature: any) => {
          const featureElement = this.createFeatureElement(feature);
          this.featuresList.appendChild(featureElement);
        });
      }
    } else {
      this.featuresList.innerHTML = '<p class="no-features">暂未检测到明显的AI特征</p>';
    }

    // Update analysis details with formatted text
    this.analysisDetails.innerHTML = this.formatAnalysisDetails(result.details || '分析详情暂不可用');

    // Show results section
    this.resultsSection.style.display = 'block';

    // Show report card generator
    if (this.reportCardGenerator) {
      this.reportCardGenerator.style.display = 'block';
    }

    // Animate score
    this.animateScore(score);
  }

  private createFeatureElement(feature: any): HTMLElement {
    const element = document.createElement('div');
    element.className = `feature-badge ${feature.detected ? 'detected' : ''} ${feature.confidence === 'high' ? 'high-confidence' : ''}`;
    
    element.innerHTML = `
      <div class="feature-icon"></div>
      <span>${feature.name || '未知特征'}</span>
    `;
    
    if (feature.description) {
      element.setAttribute('data-tooltip', feature.description);
      element.classList.add('tooltip');
    }
    
    return element;
  }

  private animateScore(targetScore: number): void {
    let currentScore = 0;
    const increment = targetScore / 50; // 50 steps animation
    const interval = setInterval(() => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        currentScore = targetScore;
        clearInterval(interval);
      }
      this.aiScore.textContent = Math.round(currentScore).toString();
    }, 20);
  }

  private setLoading(loading: boolean): void {
    this.isLoading = loading;
    
    // Update button states
    this.loadButton.disabled = loading;
    this.analyzeButton.disabled = loading || !this.currentUrl;
    
    // Update button loading states
    this.toggleButtonLoading(this.loadButton, loading);
    this.toggleButtonLoading(this.analyzeButton, loading && !!this.currentUrl);
    
    this.validateUrlInput();
  }

  private toggleButtonLoading(button: HTMLButtonElement, loading: boolean): void {
    if (loading) {
      button.classList.add('loading');
    } else {
      button.classList.remove('loading');
    }
  }

  private updateStatus(message: string, type: 'success' | 'error' | 'loading' | 'warning' | '' = ''): void {
    this.statusMessage.textContent = message;
    this.statusMessage.className = `status-message ${type}`;
  }

  private showProgress(): void {
    this.progressBar.style.display = 'block';
  }

  private hideProgress(): void {
    this.progressBar.style.display = 'none';
  }

  // Page routing methods
  private switchToPage(pageName: string): void {
    // Update navigation buttons
    this.navButtons.forEach(button => {
      button.classList.remove('active');
      if (button.getAttribute('data-page') === pageName) {
        button.classList.add('active');
        button.classList.add('pulse');
        setTimeout(() => button.classList.remove('pulse'), 500);
      }
    });

    // Update pages with animation
    this.pages.forEach(page => {
      if (page.classList.contains('active')) {
        page.style.opacity = '0';
        setTimeout(() => {
          page.classList.remove('active');
          if (page.id === `${pageName}-page`) {
            page.classList.add('active');
            page.classList.add('fade-in');
            page.style.opacity = '1';
          }
        }, 150);
      } else if (page.id === `${pageName}-page`) {
        page.classList.add('active');
        page.classList.add('fade-in');
        page.style.opacity = '1';
      }
    });

    // Current page updated

    // Load page-specific content
    if (pageName === 'records') {
      this.loadRecords();
    }
  }

  // Records management methods
  private async loadRecords(): Promise<void> {
    try {
      const result = await window.electronAPI.getRecords();
      if (result.success) {
        this.displayRecords(result.records || []);
        this.updateRecordsStats(result.records || []);
      } else {
        console.error('Failed to load records:', result.error);
        this.showErrorModal('加载记录失败');
      }
    } catch (error) {
      console.error('Error loading records:', error);
      this.showErrorModal('加载记录时发生错误');
    }
  }

  private displayRecords(records: any[]): void {
    const loadingPlaceholder = document.getElementById('records-loading');
    const emptyPlaceholder = document.getElementById('records-empty');

    if (loadingPlaceholder) {
      loadingPlaceholder.style.display = 'none';
    }

    if (records.length === 0) {
      if (emptyPlaceholder) {
        emptyPlaceholder.style.display = 'flex';
        emptyPlaceholder.classList.add('fade-in');
      }
      return;
    }

    if (emptyPlaceholder) {
      emptyPlaceholder.style.display = 'none';
    }

    // Create records HTML
    const recordsHTML = records.map(record => this.createRecordHTML(record)).join('');
    this.recordsList.innerHTML = recordsHTML;

    // Add click events to record items and animate them
    this.recordsList.querySelectorAll('.record-item').forEach((item, index) => {
      item.classList.add('fade-in');
      (item as HTMLElement).style.animationDelay = `${index * 0.1}s`;

      item.addEventListener('click', () => {
        this.showRecordDetail(records[index]);
      });
    });
  }

  private createRecordHTML(record: any): string {
    const date = new Date(record.timestamp).toLocaleString('zh-CN');
    const scoreClass = record.aiScore >= 70 ? 'high' : record.aiScore >= 31 ? 'medium' : 'low';

    return `
      <div class="record-item" data-id="${record.id}">
        <div class="record-header">
          <h3 class="record-title">${this.escapeHtml(record.title)}</h3>
          <div class="record-score score-${scoreClass}">${record.aiScore}分</div>
        </div>
        <div class="record-url">${this.escapeHtml(record.url)}</div>
        <div class="record-meta">
          <span class="record-date">${date}</span>
          <span class="record-features">${record.features.filter((f: any) => f.detected).length} 个特征</span>
        </div>
      </div>
    `;
  }

  private updateRecordsStats(records: any[]): void {
    if (this.totalRecordsSpan) {
      this.totalRecordsSpan.textContent = records.length.toString();
    }

    if (this.averageScoreSpan && records.length > 0) {
      const averageScore = records.reduce((sum, record) => sum + record.aiScore, 0) / records.length;
      this.averageScoreSpan.textContent = Math.round(averageScore).toString();
    } else if (this.averageScoreSpan) {
      this.averageScoreSpan.textContent = '0';
    }
  }

  private async filterRecords(): Promise<void> {
    try {
      const searchQuery = this.searchInput?.value.trim() || '';
      const scoreFilter = this.scoreFilter?.value || '';

      let records: any[] = [];

      if (searchQuery) {
        // Use search API
        const result = await window.electronAPI.searchRecords(searchQuery);
        if (result.success) {
          records = result.records || [];
        }
      } else {
        // Get all records
        const result = await window.electronAPI.getRecords();
        if (result.success) {
          records = result.records || [];
        }
      }

      // Apply score filter
      if (scoreFilter) {
        const [minScore, maxScore] = scoreFilter.split('-').map(Number);
        records = records.filter(record => {
          return record.aiScore >= minScore && record.aiScore <= maxScore;
        });
      }

      this.displayRecords(records);
      this.updateRecordsStats(records);
    } catch (error) {
      console.error('Error filtering records:', error);
      this.showErrorModal('筛选记录时发生错误');
    }
  }

  private async handleClearAllRecords(): Promise<void> {
    // 首先获取当前记录数量
    try {
      const recordsResult = await window.electronAPI.getRecords();
      if (!recordsResult.success || !recordsResult.records || recordsResult.records.length === 0) {
        this.showErrorModal('没有记录可以清空');
        return;
      }

      const recordCount = recordsResult.records.length;

      // 显示更详细的确认对话框
      const confirmMessage = `确定要清空所有 ${recordCount} 条检测记录吗？\n\n此操作将：\n• 删除所有检测记录\n• 删除所有相关截图\n• 清空统计数据\n\n此操作不可撤销！`;

      if (!confirm(confirmMessage)) {
        return;
      }

      // 显示加载状态
      this.updateStatus('正在清空记录...', 'loading');
      this.showProgress();

      // 禁用清空按钮防止重复点击
      const clearButton = document.getElementById('clear-all-records') as HTMLButtonElement;
      if (clearButton) {
        clearButton.disabled = true;
        clearButton.textContent = '正在清空...';
      }

      try {
        console.log(`Starting to clear ${recordCount} records...`);
        const result = await window.electronAPI.clearAllRecords();

        if (result.success) {
          console.log('Records cleared successfully');

          // 重新加载记录列表
          await this.loadRecords();

          // 显示成功消息
          this.updateStatus(`已成功清空 ${recordCount} 条记录`, 'success');
          this.showSuccessModal(`已成功清空 ${recordCount} 条检测记录`);

          // 更新统计信息
          this.updateRecordsStats([]);

        } else {
          throw new Error(result.error || '清空记录失败');
        }
      } catch (error) {
        console.error('Error clearing records:', error);
        this.updateStatus('清空记录失败', 'error');
        this.showErrorModal(`清空记录失败: ${(error as Error).message}`);
      } finally {
        // 恢复按钮状态
        if (clearButton) {
          clearButton.disabled = false;
          clearButton.textContent = '清空所有记录';
        }
        this.hideProgress();
      }
    } catch (error) {
      console.error('Error getting records count:', error);
      this.showErrorModal('无法获取记录信息，请稍后重试');
    }
  }

  private showRecordDetail(record: any): void {
    // Switch to detail page and display record
    this.currentRecord = record;
    this.switchToPage('record-detail');
    this.displayRecordDetail(record);
  }

  private async handleDeleteCurrentRecord(): Promise<void> {
    if (!this.currentRecord) {
      this.showErrorModal('没有选中的记录');
      return;
    }

    if (confirm(`确定要删除记录"${this.currentRecord.title}"吗？此操作不可撤销。`)) {
      try {
        const result = await window.electronAPI.deleteRecord(this.currentRecord.id);
        if (result.success) {
          this.switchToPage('records');
          this.loadRecords();
          this.updateStatus('记录已删除', 'success');
        } else {
          throw new Error('删除记录失败');
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        this.showErrorModal('删除记录失败');
      }
    }
  }

  private displayRecordDetail(record: any): void {
    const detailContent = document.getElementById('record-detail-content');
    if (!detailContent) return;

    const date = new Date(record.timestamp).toLocaleString('zh-CN');
    const scoreClass = record.aiScore >= 70 ? 'high' : record.aiScore >= 31 ? 'medium' : 'low';

    detailContent.innerHTML = `
      <div class="detail-info">
        <h2>${this.escapeHtml(record.title)}</h2>
        <div class="detail-meta">
          <div class="meta-item">
            <span class="meta-label">网站地址:</span>
            <span class="meta-value">${this.escapeHtml(record.url)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">检测时间:</span>
            <span class="meta-value">${date}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">AI评分:</span>
            <span class="meta-value score-${scoreClass}">${record.aiScore}分</span>
          </div>
        </div>
      </div>

      <div class="detail-screenshot">
        <h3>网站截图</h3>
        <div class="screenshot-container">
          ${this.createScreenshotHTML(record.screenshotPath)}
        </div>
      </div>

      <div class="detail-features">
        <h3>检测特征</h3>
        <div class="features-grid">
          ${record.features.map((feature: any) => `
            <div class="feature-card ${feature.detected ? 'detected' : 'not-detected'}">
              <h4>${feature.name}</h4>
              <p>${feature.description}</p>
              <div class="feature-meta">
                <span class="confidence">${feature.confidence}</span>
                <span class="score">${feature.score}分</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="detail-analysis">
        <h3>详细分析</h3>
        <div class="analysis-content">${this.formatAnalysisDetails(record.details)}</div>
      </div>
    `;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private createScreenshotHTML(screenshotPath: string): string {
    if (!screenshotPath) {
      return `
        <div class="screenshot-placeholder">
          <div class="icon">📷</div>
          <p>暂无截图</p>
        </div>
      `;
    }

    // 创建一个唯一的ID用于这个截图
    const imageId = `screenshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 异步加载截图
    setTimeout(() => {
      this.loadScreenshot(screenshotPath, imageId);
    }, 100);

    return `
      <div id="${imageId}" class="screenshot-loading">
        <div class="screenshot-placeholder">
          <div class="icon">⏳</div>
          <p>正在加载截图...</p>
        </div>
      </div>
    `;
  }

  private async loadScreenshot(screenshotPath: string, imageId: string): Promise<void> {
    try {
      const result = await window.electronAPI.getScreenshot(screenshotPath);
      const imageElement = document.getElementById(imageId);

      if (!imageElement) {
        return;
      }

      if (result.success && result.imageData) {
        imageElement.innerHTML = `
          <img
            src="${result.imageData}"
            alt="网站截图"
            class="screenshot-image"
            style="opacity: 0; transition: opacity 0.3s ease;"
            title="网站截图"
            onload="this.style.opacity='1'"
          />
        `;
      } else {
        imageElement.innerHTML = `
          <div class="screenshot-placeholder">
            <div class="icon">❌</div>
            <p>截图加载失败</p>
            <small>${result.error || '未知错误'}</small>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading screenshot:', error);
      const imageElement = document.getElementById(imageId);
      if (imageElement) {
        imageElement.innerHTML = `
          <div class="screenshot-placeholder">
            <div class="icon">❌</div>
            <p>截图加载失败</p>
            <small>网络错误</small>
          </div>
        `;
      }
    }
  }

  private showPreviewSection(): void {
    this.previewSection.style.display = 'flex';
  }

  private showErrorModal(message: string): void {
    const errorMessage = document.getElementById('error-message') as HTMLElement;
    if (errorMessage) {
      errorMessage.textContent = message;
    }
    this.errorModal.style.display = 'flex';
  }

  private hideErrorModal(): void {
    this.errorModal.style.display = 'none';
  }

  // @ts-ignore - Keeping for future use
  private showSuccessModal(message: string): void {
    const successMessage = document.getElementById('success-message') as HTMLElement;
    if (successMessage) {
      successMessage.textContent = message;
    }
    this.successModal.style.display = 'flex';
  }

  private hideSuccessModal(): void {
    this.successModal.style.display = 'none';
  }

  private formatAnalysisDetails(details: string): string {
    // Convert plain text to HTML with better formatting
    return details
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/• /g, '<span class="bullet">•</span> ');
  }

  private setupExampleUrlButtons(): void {
    const exampleUrlButtons = document.querySelectorAll('.example-url-btn');
    exampleUrlButtons.forEach(button => {
      button.addEventListener('click', () => {
        const url = button.getAttribute('data-url');
        if (url) {
          this.urlInput.value = url;
          this.validateUrlInput();

          // Add visual feedback
          button.classList.add('clicked');
          setTimeout(() => {
            button.classList.remove('clicked');
          }, 200);

          // Show status message
          this.updateStatus('已填入示例网站地址，点击"加载网站"开始检测', 'success');
        }
      });
    });
  }

  // Report Card Generator Methods
  private async handleGenerateCard(): Promise<void> {
    if (!this.currentAnalysisResult) {
      this.showErrorModal('没有可用的检测结果');
      return;
    }

    try {
      // Show loading state
      this.showCardLoading();
      this.generateCardBtn.disabled = true;

      // Get options
      const options: ReportCardOptions = {
        theme: this.cardThemeSelect?.value as any || 'gradient',
        includeTimestamp: this.includeTimestampCheckbox?.checked || true,
        includeDetails: true,
        width: 800,
        height: 600
      };

      // Prepare card data
      const cardData: ReportCardData = {
        url: this.currentUrl,
        title: this.getWebsiteTitle(),
        score: this.currentAnalysisResult.score || 0,
        features: this.currentAnalysisResult.features || [],
        timestamp: new Date(this.currentAnalysisResult.timestamp || Date.now()),
        details: this.currentAnalysisResult.details || ''
      };

      // Generate card
      const imageDataUrl = await this.cardGenerator.generateCard(cardData, options);

      // Display card
      this.displayGeneratedCard(imageDataUrl);

      // Enable copy button
      this.copyCardBtn.disabled = false;

      // Hide loading state
      this.hideCardLoading();

    } catch (error) {
      console.error('生成卡片失败:', error);
      this.showCardError('生成卡片失败: ' + (error as Error).message);
    } finally {
      this.generateCardBtn.disabled = false;
    }
  }

  private async handleCopyCard(): Promise<void> {
    if (!this.cardGenerator) {
      this.showErrorModal('卡片生成器未初始化');
      return;
    }

    try {
      this.copyCardBtn.disabled = true;
      this.copyCardBtn.textContent = '复制中...';

      const success = await this.cardGenerator.copyToClipboard();

      if (success) {
        this.showCardSuccess('卡片已复制到剪切板！');
      } else {
        throw new Error('复制失败');
      }
    } catch (error) {
      console.error('复制卡片失败:', error);
      this.showErrorModal('复制到剪切板失败: ' + (error as Error).message);
    } finally {
      this.copyCardBtn.disabled = false;
      this.copyCardBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        复制到剪切板
      `;
    }
  }

  private handleDownloadCard(): void {
    const canvas = this.cardGenerator.getCanvas();
    if (!canvas) {
      this.showErrorModal('没有可下载的卡片');
      return;
    }

    try {
      // Create download link
      const link = document.createElement('a');
      link.download = `AI味检测报告_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showCardSuccess('卡片已下载！');
    } catch (error) {
      console.error('下载卡片失败:', error);
      this.showErrorModal('下载失败: ' + (error as Error).message);
    }
  }

  private handleFullscreenCard(): void {
    const canvas = this.cardGenerator.getCanvas();
    if (!canvas) {
      this.showErrorModal('没有可查看的卡片');
      return;
    }

    try {
      // Create fullscreen modal
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
      `;

      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/png', 1.0);
      img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      `;

      modal.appendChild(img);
      document.body.appendChild(modal);

      // Close on click
      modal.addEventListener('click', () => {
        document.body.removeChild(modal);
      });

      // Close on escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          document.body.removeChild(modal);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);

    } catch (error) {
      console.error('全屏查看失败:', error);
      this.showErrorModal('全屏查看失败: ' + (error as Error).message);
    }
  }

  private getWebsiteTitle(): string {
    try {
      const webview = document.getElementById('website-webview') as any;
      if (webview && webview.getTitle) {
        return webview.getTitle() || this.currentUrl;
      }
      return this.currentUrl;
    } catch (error) {
      return this.currentUrl;
    }
  }

  private displayGeneratedCard(imageDataUrl: string): void {
    // Clear container
    this.reportCardCanvasContainer.innerHTML = '';

    // Create image element
    const img = document.createElement('img');
    img.src = imageDataUrl;
    img.className = 'report-card-canvas';
    img.alt = 'AI味检测报告卡片';

    // Add to container
    this.reportCardCanvasContainer.appendChild(img);

    // Show preview
    this.reportCardPreview.classList.add('visible');
  }

  private showCardLoading(): void {
    this.cardLoading.style.display = 'flex';
    this.reportCardCanvasContainer.innerHTML = '';
    this.reportCardCanvasContainer.appendChild(this.cardLoading);
    this.reportCardPreview.classList.add('visible');
  }

  private hideCardLoading(): void {
    this.cardLoading.style.display = 'none';
  }

  private showCardError(message: string): void {
    this.reportCardCanvasContainer.innerHTML = `
      <div class="card-error">
        <h4>生成失败</h4>
        <p>${message}</p>
      </div>
    `;
    this.reportCardPreview.classList.add('visible');
  }

  private showCardSuccess(message: string): void {
    this.cardSuccessText.textContent = message;
    this.cardSuccessMessage.classList.add('visible');

    // Auto hide after 3 seconds
    setTimeout(() => {
      this.cardSuccessMessage.classList.remove('visible');
    }, 3000);
  }
}

// Global app instance
let appInstance: AIFlavorDetectorApp;

// Global function for page switching (used by HTML onclick)
function switchToPage(pageName: string): void {
  if (appInstance) {
    (appInstance as any).switchToPage(pageName);
  }
}

// Make switchToPage available globally
(window as any).switchToPage = switchToPage;

// GitHub Badge functionality
class GitHubBadge {
  private starCountElement: HTMLElement;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.starCountElement = document.getElementById('github-star-count')!;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.updateStarCount();
      // 设置定期更新（每5分钟）
      this.updateInterval = setInterval(() => {
        this.updateStarCount();
      }, 5 * 60 * 1000);
    } catch (error) {
      console.error('Error initializing GitHub badge:', error);
      this.showError();
    }
  }

  private async updateStarCount(): Promise<void> {
    try {
      this.showLoading();

      // 从缓存获取数据
      const cached = localStorage.getItem('github_repo_ai-coding-labs_aiway');
      let repoInfo = null;

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        if ((now - timestamp) < 5 * 60 * 1000) { // 5分钟缓存
          repoInfo = data;
        }
      }

      // 如果没有缓存或缓存过期，从API获取
      if (!repoInfo) {
        try {
          const response = await fetch('https://api.github.com/repos/ai-coding-labs/aiway', {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'AI-Flavor-Detector/1.0.0'
            }
          });

          if (response.ok) {
            const data = await response.json();
            repoInfo = {
              stargazersCount: data.stargazers_count || 0,
              forksCount: data.forks_count || 0,
              updatedAt: data.updated_at
            };

            // 缓存数据
            localStorage.setItem('github_repo_ai-coding-labs_aiway', JSON.stringify({
              data: repoInfo,
              timestamp: Date.now()
            }));
          }
        } catch (apiError) {
          console.warn('GitHub API request failed:', apiError);
        }
      }

      if (repoInfo) {
        const formattedCount = this.formatStarCount(repoInfo.stargazersCount);
        this.starCountElement.textContent = formattedCount;
        this.starCountElement.className = 'github-star-count';

        // 更新tooltip
        const tooltip = document.querySelector('.github-tooltip') as HTMLElement;
        if (tooltip) {
          tooltip.textContent = `${repoInfo.stargazersCount} stars • ${repoInfo.forksCount} forks`;
        }
      } else {
        this.showError();
      }
    } catch (error) {
      console.error('Error updating star count:', error);
      this.showError();
    }
  }

  private showLoading(): void {
    this.starCountElement.textContent = '加载中...';
    this.starCountElement.className = 'github-star-count github-loading';
  }

  private showError(): void {
    this.starCountElement.textContent = '★';
    this.starCountElement.className = 'github-star-count github-error';
  }

  private formatStarCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    } else {
      return count.toString();
    }
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  appInstance = new AIFlavorDetectorApp();

  // Initialize GitHub badge
  try {
    new GitHubBadge();
  } catch (error) {
    console.error('Failed to initialize GitHub badge:', error);
  }
});
