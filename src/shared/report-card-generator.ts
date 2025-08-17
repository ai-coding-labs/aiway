// Report Card Generator for AI Detection Results
export interface ReportCardData {
  url: string;
  title: string;
  score: number;
  features: Array<{
    name: string;
    detected: boolean;
    confidence: 'low' | 'medium' | 'high';
    description: string;
    score: number;
  }>;
  timestamp: Date;
  details: string;
}

export interface ReportCardOptions {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark' | 'gradient';
  includeQR?: boolean;
  includeTimestamp?: boolean;
  includeDetails?: boolean;
}

export class ReportCardGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private defaultOptions: ReportCardOptions = {
    width: 800,
    height: 600,
    theme: 'gradient',
    includeQR: false,
    includeTimestamp: true,
    includeDetails: true
  };

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    if (!this.ctx) {
      throw new Error('无法创建Canvas上下文');
    }
  }

  public async generateCard(data: ReportCardData, options?: ReportCardOptions): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };
    
    // 设置画布尺寸
    this.canvas.width = opts.width!;
    this.canvas.height = opts.height!;
    
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制背景
    await this.drawBackground(opts.theme!);
    
    // 绘制标题区域
    this.drawHeader(data);
    
    // 绘制评分圆圈
    this.drawScoreCircle(data.score);
    
    // 绘制特征列表
    this.drawFeatures(data.features);
    
    // 绘制网站信息
    this.drawWebsiteInfo(data.url, data.title);
    
    // 绘制时间戳（如果启用）
    if (opts.includeTimestamp) {
      this.drawTimestamp(data.timestamp);
    }
    
    // 绘制详细信息（如果启用）
    if (opts.includeDetails && data.details) {
      this.drawDetails(data.details);
    }
    
    // 绘制装饰元素
    this.drawDecorations();
    
    // 返回base64图片数据
    return this.canvas.toDataURL('image/png', 1.0);
  }

  private async drawBackground(theme: string): Promise<void> {
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    
    switch (theme) {
      case 'light':
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        break;
      case 'dark':
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#0f172a');
        break;
      case 'gradient':
      default:
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(0.5, '#764ba2');
        gradient.addColorStop(1, '#f093fb');
        break;
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 添加微妙的纹理
    this.addTexture();
  }

  private addTexture(): void {
    // 创建点状纹理
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 2 + 1;
      
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawHeader(_data: ReportCardData): void {
    // 绘制主标题
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('AI味儿检测报告', this.canvas.width / 2, 60);
    
    // 绘制副标题
    this.ctx.font = '18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillText('AI Flavor Detection Report', this.canvas.width / 2, 90);
  }

  private drawScoreCircle(score: number): void {
    const centerX = this.canvas.width / 2;
    const centerY = 180;
    const radius = 60;
    
    // 绘制外圈
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 8;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // 绘制进度圈
    const progress = (score / 100) * Math.PI * 2;
    const gradient = this.ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
    
    if (score >= 70) {
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#34d399');
    } else if (score >= 40) {
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(1, '#fbbf24');
    } else {
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(1, '#f87171');
    }
    
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 8;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + progress);
    this.ctx.stroke();
    
    // 绘制分数文字
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(score.toString(), centerX, centerY + 8);
    
    // 绘制"分"字
    this.ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillText('分', centerX, centerY + 30);
  }

  private drawFeatures(features: Array<any>): void {
    const detectedFeatures = features.filter(f => f.detected);
    const startY = 280;
    const itemHeight = 35;
    const maxFeatures = 6; // 最多显示6个特征
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('检测到的AI特征:', 60, startY);
    
    const featuresToShow = detectedFeatures.slice(0, maxFeatures);
    
    featuresToShow.forEach((feature, index) => {
      const y = startY + 40 + (index * itemHeight);
      
      // 绘制特征图标
      this.ctx.fillStyle = this.getConfidenceColor(feature.confidence);
      this.ctx.beginPath();
      this.ctx.arc(80, y - 5, 6, 0, Math.PI * 2);
      this.ctx.fill();
      
      // 绘制特征名称
      this.ctx.fillStyle = 'white';
      this.ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      this.ctx.fillText(feature.name, 100, y);
      
      // 绘制置信度
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      this.ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(this.getConfidenceText(feature.confidence), this.canvas.width - 60, y);
      this.ctx.textAlign = 'left';
    });
    
    // 如果有更多特征，显示省略号
    if (detectedFeatures.length > maxFeatures) {
      const y = startY + 40 + (maxFeatures * itemHeight);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      this.ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      this.ctx.fillText(`... 还有 ${detectedFeatures.length - maxFeatures} 个特征`, 100, y);
    }
  }

  private getConfidenceColor(confidence: string): string {
    switch (confidence) {
      case 'high': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  }

  private getConfidenceText(confidence: string): string {
    switch (confidence) {
      case 'high': return '高置信度';
      case 'medium': return '中等置信度';
      case 'low': return '低置信度';
      default: return '未知';
    }
  }

  private drawWebsiteInfo(url: string, title: string): void {
    const y = this.canvas.height - 120;
    
    // 绘制网站标题
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.textAlign = 'left';
    
    // 截断过长的标题
    const maxTitleLength = 40;
    const displayTitle = title.length > maxTitleLength ? title.substring(0, maxTitleLength) + '...' : title;
    this.ctx.fillText(`网站: ${displayTitle}`, 60, y);
    
    // 绘制URL
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    // 截断过长的URL
    const maxUrlLength = 60;
    const displayUrl = url.length > maxUrlLength ? url.substring(0, maxUrlLength) + '...' : url;
    this.ctx.fillText(displayUrl, 60, y + 25);
  }

  private drawTimestamp(timestamp: Date): void {
    const timeStr = timestamp.toLocaleString('zh-CN');
    
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`检测时间: ${timeStr}`, this.canvas.width - 60, this.canvas.height - 30);
  }

  private drawDetails(_details: string): void {
    // 这里可以添加详细信息的绘制逻辑
    // 由于空间限制，暂时跳过详细信息的绘制
  }

  private drawDecorations(): void {
    // 绘制装饰性元素
    this.drawCornerDecorations();
    this.drawBrand();
  }

  private drawCornerDecorations(): void {
    // 左上角装饰
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(20, 20);
    this.ctx.lineTo(50, 20);
    this.ctx.moveTo(20, 20);
    this.ctx.lineTo(20, 50);
    this.ctx.stroke();
    
    // 右下角装饰
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width - 20, this.canvas.height - 20);
    this.ctx.lineTo(this.canvas.width - 50, this.canvas.height - 20);
    this.ctx.moveTo(this.canvas.width - 20, this.canvas.height - 20);
    this.ctx.lineTo(this.canvas.width - 20, this.canvas.height - 50);
    this.ctx.stroke();
  }

  private drawBrand(): void {
    // 绘制品牌标识
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('AI味儿检测器', 60, this.canvas.height - 60);
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public async copyToClipboard(): Promise<boolean> {
    try {
      // 将canvas转换为blob
      return new Promise((resolve) => {
        this.canvas.toBlob(async (blob) => {
          if (!blob) {
            resolve(false);
            return;
          }
          
          try {
            // 使用Clipboard API复制图片
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            resolve(true);
          } catch (error) {
            console.error('复制到剪切板失败:', error);
            resolve(false);
          }
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('复制到剪切板失败:', error);
      return false;
    }
  }
}
