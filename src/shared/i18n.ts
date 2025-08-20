export interface I18nConfig {
  [key: string]: {
    [key: string]: string;
  };
}

export const i18n: I18nConfig = {
  'zh-CN': {
    // 应用标题和描述
    'app-title': 'AI味儿检测器',
    'app-subtitle': '检测网站的AI设计风格并进行评分',
    
    // 导航菜单
    'nav-detection': 'AI检测',
    'nav-records': '检测记录',
    
    // 检测页面
    'url-input-label': '请输入要检测的网站地址：',
    'url-input-placeholder': '例如：https://example.com',
    'load-button': '加载网站',
    'loading': '加载中...',
    
    // 示例网站
    'example-urls-label': '快速体验示例网站：',
    'example-urls-note': '💡 提示：某些网站可能因安全策略无法在预览中显示，但仍可进行AI味检测分析',
    
    // 检测结果
    'detection-result': '检测结果',
    'ai-score': 'AI味评分',
    'ai-probability': 'AI概率',
    'detection-time': '检测时间',
    
    // 记录页面
    'no-records': '暂无检测记录',
    'clear-records': '清空记录',
    
    // 通用按钮
    'copy': '复制',
    'delete': '删除',
    'export': '导出',
    
    // 语言切换
    'switch-to-english': '切换到英文',
    'switch-to-chinese': '切换到中文',
    
    // GitHub相关
    'github-tooltip': '点击访问GitHub仓库',
    'github-loading': '加载中...',
    
    // 错误信息
    'error-invalid-url': '无效的URL地址',
    'error-load-failed': '加载失败',
    'error-network': '网络错误',
    
    // 成功信息
    'success-copied': '已复制到剪贴板',
    'success-exported': '导出成功',
    
    // 设置
    'settings': '设置',
    'language': '语言',
    'theme': '主题',
    'auto-detect': '自动检测'
  },
  
  'en-US': {
    // App title and description
    'app-title': 'AI Flavor Detector',
    'app-subtitle': 'Detect AI design style in websites and score them',
    
    // Navigation menu
    'nav-detection': 'AI Detection',
    'nav-records': 'Records',
    
    // Detection page
    'url-input-label': 'Enter website URL to detect:',
    'url-input-placeholder': 'e.g., https://example.com',
    'load-button': 'Load Website',
    'loading': 'Loading...',
    
    // Example websites
    'example-urls-label': 'Quick experience with example websites:',
    'example-urls-note': '💡 Note: Some websites may not display in preview due to security policies, but AI flavor detection analysis can still be performed',
    
    // Detection results
    'detection-result': 'Detection Result',
    'ai-score': 'AI Flavor Score',
    'ai-probability': 'AI Probability',
    'detection-time': 'Detection Time',
    
    // Records page
    'no-records': 'No detection records',
    'clear-records': 'Clear Records',
    
    // Common buttons
    'copy': 'Copy',
    'delete': 'Delete',
    'export': 'Export',
    
    // Language switching
    'switch-to-english': 'Switch to English',
    'switch-to-chinese': 'Switch to Chinese',
    
    // GitHub related
    'github-tooltip': 'Click to visit GitHub repository',
    'github-loading': 'Loading...',
    
    // Error messages
    'error-invalid-url': 'Invalid URL address',
    'error-load-failed': 'Load failed',
    'error-network': 'Network error',
    
    // Success messages
    'success-copied': 'Copied to clipboard',
    'success-exported': 'Export successful',
    
    // Settings
    'settings': 'Settings',
    'language': 'Language',
    'theme': 'Theme',
    'auto-detect': 'Auto-detect'
  }
};

export type Language = 'zh-CN' | 'en-US';

export class I18nManager {
  private currentLanguage: Language = 'zh-CN';
  private listeners: Array<(lang: Language) => void> = [];

  constructor() {
    // 从localStorage恢复语言设置
    const savedLang = localStorage.getItem('aiway-language');
    if (savedLang && (savedLang === 'zh-CN' || savedLang === 'en-US')) {
      this.currentLanguage = savedLang;
    } else {
      // 自动检测系统语言
      const systemLang = navigator.language || 'zh-CN';
      this.currentLanguage = systemLang.startsWith('zh') ? 'zh-CN' : 'en-US';
    }
    
    // 初始化时更新HTML lang属性
    this.updateHtmlLang();
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(lang: Language): void {
    if (this.currentLanguage !== lang) {
      this.currentLanguage = lang;
      localStorage.setItem('aiway-language', lang);
      this.updateHtmlLang();
      this.notifyListeners();
    }
  }

  t(key: string): string {
    return i18n[this.currentLanguage]?.[key] || key;
  }

  addLanguageChangeListener(listener: (lang: Language) => void): void {
    this.listeners.push(listener);
  }

  removeLanguageChangeListener(listener: (lang: Language) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  private updateHtmlLang(): void {
    document.documentElement.lang = this.currentLanguage;
  }
}

// 创建全局实例
export const i18nManager = new I18nManager(); 