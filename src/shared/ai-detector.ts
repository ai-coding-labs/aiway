// AI Flavor Detection Algorithm
export interface AIFeature {
  name: string;
  detected: boolean;
  confidence: 'low' | 'medium' | 'high';
  description: string;
  score: number;
}

export interface AIAnalysisResult {
  score: number;
  features: AIFeature[];
  details: string;
  timestamp: Date;
}

export class AIFlavorDetector {
  private readonly PURPLE_COLORS = [
    // 深紫色系
    '#8B5CF6', '#A855F7', '#9333EA', '#7C3AED', '#6D28D9',
    '#5B21B6', '#4C1D95', '#3B1F47', '#2D1B3D', '#1A0E2E',

    // 中等紫色系
    '#8B5CF6', '#7C3AED', '#6366F1', '#4F46E5', '#4338CA',
    '#7E57C2', '#673AB7', '#5E35B1', '#512DA8', '#4527A0',

    // 浅紫色系
    '#DDD6FE', '#C4B5FD', '#A78BFA', '#B39DDB', '#CE93D8',
    '#E1BEE7', '#F3E5F5', '#EDE7F6', '#D1C4E9', '#C5CAE9',

    // 偏蓝紫色系
    '#4E6EF2', '#5C6BC0', '#3F51B5', '#303F9F', '#1A237E',
    '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81',

    // 偏红紫色系
    '#E91E63', '#C2185B', '#AD1457', '#880E4F', '#9C27B0',
    '#8E24AA', '#7B1FA2', '#6A1B9A', '#4A148C', '#BA68C8',

    // 粉紫色系
    '#F8BBD9', '#F48FB1', '#F06292', '#EC407A', '#E91E63',
    '#FF80AB', '#FF4081', '#F50057', '#C51162', '#E1BEE7',

    // 新增常见紫色变体
    '#9B59B6', '#8E44AD', '#663399', '#6A0DAD', '#4B0082',
    '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', '#DA70D6',
    '#DDA0DD', '#EE82EE', '#FF00FF', '#C71585', '#DB7093',

    // AI设计中常见的紫色
    '#7B68EE', '#6495ED', '#9370DB', '#8470FF', '#7B68EE',
    '#9966CC', '#CC99FF', '#B19CD9', '#C8A2C8', '#CFBFFF',

    // 渐变中常见的紫色端点
    '#8E2DE2', '#4A00E0', '#667EEA', '#764BA2', '#F093FB',
    '#F5576C', '#4FACFE', '#00F2FE', '#43E97B', '#38F9D7',

    // 现代UI框架中的紫色（Tailwind CSS, Material Design等）
    '#6366F1', '#8B5CF6', '#A855F7', '#C084FC', '#E879F9',
    '#F0ABFC', '#FBBF24', '#F59E0B', '#D97706', '#92400E',
    '#8B5A2B', '#A16207', '#CA8A04', '#EAB308', '#FACC15',

    // 品牌紫色（常见于AI/科技公司）
    '#5A67D8', '#667EEA', '#764BA2', '#F093FB', '#F5576C',
    '#4FACFE', '#00F2FE', '#43E97B', '#38F9D7', '#667EEA',
    '#764BA2', '#F093FB', '#F5576C', '#4FACFE', '#00F2FE',

    // 更多紫色变体（增强检测覆盖率）
    '#8A2387', '#E94057', '#F27121', '#6A4C93', '#C44569',
    '#F8B500', '#833AB4', '#FD1D1D', '#FCB045', '#833AB4',
    '#405DE6', '#5851DB', '#833AB4', '#C13584', '#E1306C',
    '#FD1D1D', '#F56040', '#F77737', '#FCAF45', '#FFDC80'
  ];

  private readonly GRADIENT_PATTERNS = [
    'linear-gradient',
    'radial-gradient',
    'conic-gradient',
    'repeating-linear-gradient',
    'repeating-radial-gradient',
    'repeating-conic-gradient',
    // CSS函数形式
    '-webkit-linear-gradient',
    '-webkit-radial-gradient',
    '-moz-linear-gradient',
    '-moz-radial-gradient',
    '-o-linear-gradient',
    '-o-radial-gradient',
    // 常见的渐变关键词
    'gradient',
    'backdrop-filter',
    'filter: blur'
  ];

  private readonly AI_KEYWORDS = [
    // 基础AI术语
    'ai', 'artificial intelligence', 'machine learning', 'neural',
    'smart', 'intelligent', 'automated', 'algorithm', 'deep learning',

    // 扩展AI术语
    'chatgpt', 'gpt', 'llm', 'nlp', 'computer vision', 'robotics',
    'automation', 'cognitive', 'predictive', 'analytics', 'data science',
    'big data', 'cloud computing', 'iot', 'blockchain', 'quantum',

    // AI应用领域
    'chatbot', 'virtual assistant', 'recommendation', 'personalization',
    'optimization', 'recognition', 'detection', 'classification',
    'generation', 'synthesis', 'enhancement', 'transformation',

    // 现代AI工具和平台
    'openai', 'anthropic', 'claude', 'gemini', 'copilot', 'midjourney',
    'stable diffusion', 'dall-e', 'whisper', 'tensorflow', 'pytorch',

    // 中文AI术语
    '人工智能', '机器学习', '深度学习', '神经网络', '智能', '自动化',
    '算法', '数据分析', '大数据', '云计算', '物联网', '区块链',
    '聊天机器人', '虚拟助手', '个性化', '推荐系统', '图像识别'
  ];

  public async analyzeWebsite(webContents: any): Promise<AIAnalysisResult> {
    try {
      // Execute analysis script in the web page
      const analysisData = await webContents.executeJavaScript(`
        (function() {
          const analysis = {
            elements: [],
            styles: [],
            colors: [],
            text: document.body.innerText.toLowerCase(),
            title: document.title.toLowerCase()
          };

          // Collect all elements with computed styles
          const allElements = document.querySelectorAll('*');
          
          for (let i = 0; i < Math.min(allElements.length, 1000); i++) {
            const element = allElements[i];
            const computedStyle = window.getComputedStyle(element);
            
            const elementData = {
              tagName: element.tagName.toLowerCase(),
              className: element.className,
              borderRadius: computedStyle.borderRadius,
              backgroundColor: computedStyle.backgroundColor,
              background: computedStyle.background,
              backgroundImage: computedStyle.backgroundImage,
              color: computedStyle.color,
              borderColor: computedStyle.borderColor,
              borderTopColor: computedStyle.borderTopColor,
              borderRightColor: computedStyle.borderRightColor,
              borderBottomColor: computedStyle.borderBottomColor,
              borderLeftColor: computedStyle.borderLeftColor,
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

      // Analyze the collected data
      const features = this.analyzeFeatures(analysisData);
      const score = this.calculateAIScore(features);
      const details = this.generateAnalysisDetails(features, analysisData);

      return {
        score,
        features,
        details,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing website:', error);
      throw new Error('Failed to analyze website for AI flavor');
    }
  }

  private analyzeFeatures(data: any): AIFeature[] {
    const features: AIFeature[] = [];

    // Feature 1: Large Border Radius (Rounded Corners)
    const roundedElements = this.detectRoundedElements(data.elements);
    features.push({
      name: '大圆角设计',
      detected: roundedElements.count > 5,
      confidence: roundedElements.count > 15 ? 'high' : roundedElements.count > 10 ? 'medium' : 'low',
      description: `检测到 ${roundedElements.count} 个大圆角元素，平均圆角半径 ${roundedElements.avgRadius}px`,
      score: Math.min(roundedElements.count * 2, 25)
    });

    // Feature 2: Purple Color Scheme
    const purpleElements = this.detectPurpleColors(data.elements);
    features.push({
      name: '紫色配色方案',
      detected: purpleElements.count > 3,
      confidence: purpleElements.count > 10 ? 'high' : purpleElements.count > 6 ? 'medium' : 'low',
      description: `检测到 ${purpleElements.count} 个紫色元素，紫色覆盖率 ${purpleElements.coverage}%`,
      score: Math.min(purpleElements.count * 3, 30)
    });

    // Feature 3: Gradient Backgrounds
    const gradientElements = this.detectGradients(data.elements);
    features.push({
      name: '渐变背景',
      detected: gradientElements.count > 2,
      confidence: gradientElements.count > 8 ? 'high' : gradientElements.count > 5 ? 'medium' : 'low',
      description: `检测到 ${gradientElements.count} 个渐变背景元素`,
      score: Math.min(gradientElements.count * 2.5, 20)
    });

    // Feature 4: Modern Button Styles
    const modernButtons = this.detectModernButtons(data.elements);
    features.push({
      name: '现代化按钮样式',
      detected: modernButtons.count > 2,
      confidence: modernButtons.count > 6 ? 'high' : modernButtons.count > 4 ? 'medium' : 'low',
      description: `检测到 ${modernButtons.count} 个现代化样式按钮`,
      score: Math.min(modernButtons.count * 3, 15)
    });

    // Feature 5: AI-related Keywords
    const aiKeywords = this.detectAIKeywords(data.text + ' ' + data.title);
    features.push({
      name: 'AI相关关键词',
      detected: aiKeywords.count > 0,
      confidence: aiKeywords.count > 5 ? 'high' : aiKeywords.count > 2 ? 'medium' : 'low',
      description: `检测到 ${aiKeywords.count} 个AI相关关键词: ${aiKeywords.keywords.join(', ')}`,
      score: Math.min(aiKeywords.count * 2, 10)
    });

    return features;
  }

  private detectRoundedElements(elements: any[]): { count: number; avgRadius: number } {
    let roundedCount = 0;
    let totalRadius = 0;

    elements.forEach(element => {
      const borderRadius = element.borderRadius;
      if (borderRadius && borderRadius !== '0px') {
        // 处理各种圆角格式
        let maxRadius = 0;

        // 处理百分比圆角（如50%表示圆形）
        if (borderRadius.includes('%')) {
          const percentMatch = borderRadius.match(/(\d+(?:\.\d+)?)%/);
          if (percentMatch) {
            const percent = parseFloat(percentMatch[1]);
            if (percent >= 25) { // 25%以上认为是大圆角
              maxRadius = Math.max(maxRadius, 20); // 给一个等效的像素值
            }
          }
        }

        // 处理像素值圆角
        const pxMatches = borderRadius.match(/(\d+(?:\.\d+)?)px/g);
        if (pxMatches) {
          for (const match of pxMatches) {
            const value = parseFloat(match.replace('px', ''));
            maxRadius = Math.max(maxRadius, value);
          }
        }

        // 处理em/rem单位（假设1em = 16px）
        const emMatches = borderRadius.match(/(\d+(?:\.\d+)?)(em|rem)/g);
        if (emMatches) {
          for (const match of emMatches) {
            const value = parseFloat(match.replace(/(em|rem)/, '')) * 16;
            maxRadius = Math.max(maxRadius, value);
          }
        }

        // 降低阈值到6px，更容易检测到圆角
        if (maxRadius >= 6) {
          roundedCount++;
          totalRadius += maxRadius;
        }
      }
    });

    return {
      count: roundedCount,
      avgRadius: roundedCount > 0 ? Math.round(totalRadius / roundedCount) : 0
    };
  }

  private detectPurpleColors(elements: any[]): { count: number; coverage: number } {
    let purpleCount = 0;
    const totalElements = elements.length;
    const checkedElements = new Set(); // 避免重复计算同一个元素

    elements.forEach((element, index) => {
      let hasPurple = false;

      // 检查背景颜色
      const bgColor = element.backgroundColor;
      if (bgColor && this.isPurpleColor(bgColor)) {
        hasPurple = true;
      }

      // 检查文字颜色
      const color = element.color;
      if (!hasPurple && color && this.isPurpleColor(color)) {
        hasPurple = true;
      }

      // 检查边框颜色
      const borderColors = [
        element.borderColor,
        element.borderTopColor,
        element.borderRightColor,
        element.borderBottomColor,
        element.borderLeftColor
      ];

      if (!hasPurple) {
        for (const borderColor of borderColors) {
          if (borderColor && this.isPurpleColor(borderColor)) {
            hasPurple = true;
            break;
          }
        }
      }

      // 检查背景属性（包括渐变）
      const background = element.background;
      if (!hasPurple && background && this.containsPurple(background)) {
        hasPurple = true;
      }

      // 检查背景图片属性
      const backgroundImage = element.gradient || element.backgroundImage;
      if (!hasPurple && backgroundImage && this.containsPurple(backgroundImage)) {
        hasPurple = true;
      }

      // 检查阴影颜色
      const boxShadow = element.boxShadow;
      if (!hasPurple && boxShadow && this.containsPurple(boxShadow)) {
        hasPurple = true;
      }

      if (hasPurple && !checkedElements.has(index)) {
        purpleCount++;
        checkedElements.add(index);
      }
    });

    return {
      count: purpleCount,
      coverage: totalElements > 0 ? Math.round((purpleCount / totalElements) * 100) : 0
    };
  }

  private detectGradients(elements: any[]): { count: number } {
    let gradientCount = 0;
    const checkedElements = new Set();

    elements.forEach((element, index) => {
      if (checkedElements.has(index)) return;

      const background = element.background || '';
      const backgroundImage = element.backgroundImage || '';
      const gradient = element.gradient || '';
      const filter = element.filter || '';
      const backdropFilter = element.backdropFilter || '';

      // 检查各种可能包含渐变的属性
      const allBackgrounds = [background, backgroundImage, gradient, filter, backdropFilter].join(' ');

      // 检查渐变模式
      const hasGradient = this.GRADIENT_PATTERNS.some(pattern =>
        allBackgrounds.toLowerCase().includes(pattern.toLowerCase())
      );

      // 检查多色渐变特征（包含多个颜色值）
      const colorMatches = allBackgrounds.match(/(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|hsla?\([^)]+\))/g);
      const hasMultipleColors = colorMatches && colorMatches.length >= 2;

      // 检查渐变关键词
      const gradientKeywords = ['gradient', 'fade', 'blend', 'transition', 'smooth'];
      const hasGradientKeywords = gradientKeywords.some(keyword =>
        allBackgrounds.toLowerCase().includes(keyword)
      );

      if (hasGradient || (hasMultipleColors && hasGradientKeywords)) {
        gradientCount++;
        checkedElements.add(index);
      }
    });

    return { count: gradientCount };
  }

  private detectModernButtons(elements: any[]): { count: number } {
    let modernButtonCount = 0;

    elements.forEach(element => {
      // 扩展按钮识别条件
      const isButton = element.isButton ||
                      element.tagName === 'BUTTON' ||
                      element.role === 'button' ||
                      element.cursor === 'pointer' ||
                      (element.className && element.className.toLowerCase().includes('btn')) ||
                      (element.className && element.className.toLowerCase().includes('button'));

      if (isButton) {
        // 解析圆角值（支持多种格式）
        let maxRadius = 0;
        const borderRadius = element.borderRadius || '0px';

        if (borderRadius.includes('%')) {
          const percentMatch = borderRadius.match(/(\d+(?:\.\d+)?)%/);
          if (percentMatch && parseFloat(percentMatch[1]) >= 20) {
            maxRadius = 15; // 等效像素值
          }
        } else {
          const pxMatches = borderRadius.match(/(\d+(?:\.\d+)?)px/g);
          if (pxMatches) {
            for (const match of pxMatches) {
              maxRadius = Math.max(maxRadius, parseFloat(match.replace('px', '')));
            }
          }
        }

        // 检查现代化特征
        const hasBoxShadow = element.boxShadow && element.boxShadow !== 'none';
        const hasGradient = (element.background || element.backgroundImage || '').toLowerCase().includes('gradient');
        const hasTransition = element.transition && element.transition !== 'none';
        const hasTransform = element.transform && element.transform !== 'none';
        const hasBorder = element.border && element.border !== 'none' && !element.border.includes('0px');

        // 现代化按钮标准：圆角 + (阴影 OR 渐变 OR 过渡效果 OR 变换效果)
        if (maxRadius >= 4 && (hasBoxShadow || hasGradient || hasTransition || hasTransform || hasBorder)) {
          modernButtonCount++;
        }
      }
    });

    return { count: modernButtonCount };
  }

  private detectAIKeywords(text: string): { count: number; keywords: string[] } {
    const foundKeywords: string[] = [];
    const lowerText = text.toLowerCase();

    this.AI_KEYWORDS.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();

      // 精确匹配
      if (lowerText.includes(lowerKeyword)) {
        foundKeywords.push(keyword);
        return;
      }

      // 模糊匹配（处理变体和复数形式）
      const variations = this.generateKeywordVariations(lowerKeyword);
      for (const variation of variations) {
        if (lowerText.includes(variation)) {
          foundKeywords.push(keyword);
          break;
        }
      }
    });

    // 去重
    const uniqueKeywords = [...new Set(foundKeywords)];

    return {
      count: uniqueKeywords.length,
      keywords: uniqueKeywords
    };
  }

  private generateKeywordVariations(keyword: string): string[] {
    const variations = [keyword];

    // 添加复数形式
    if (!keyword.endsWith('s') && !keyword.includes(' ')) {
      variations.push(keyword + 's');
    }

    // 添加常见变体
    const commonVariations: { [key: string]: string[] } = {
      'ai': ['a.i.', 'a.i', 'artificial intelligence'],
      'ml': ['machine learning'],
      'nlp': ['natural language processing'],
      'cv': ['computer vision'],
      'dl': ['deep learning'],
      'bot': ['robot', 'chatbot'],
      'auto': ['automatic', 'automation'],
      'smart': ['intelligent', 'smartly'],
      'data': ['big data', 'data-driven'],
      'cloud': ['cloud computing', 'cloud-based']
    };

    if (commonVariations[keyword]) {
      variations.push(...commonVariations[keyword]);
    }

    return variations;
  }

  private isPurpleColor(color: string): boolean {
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
      return false;
    }

    // 直接检查是否包含紫色关键词
    const lowerColor = color.toLowerCase();
    if (lowerColor.includes('purple') || lowerColor.includes('violet') ||
        lowerColor.includes('magenta') || lowerColor.includes('plum') ||
        lowerColor.includes('orchid') || lowerColor.includes('indigo') ||
        lowerColor.includes('lavender') || lowerColor.includes('amethyst')) {
      return true;
    }

    // 处理RGB和RGBA格式（支持更多格式）
    const rgbMatch = color.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/);
    if (rgbMatch) {
      const r = Math.round(parseFloat(rgbMatch[1]));
      const g = Math.round(parseFloat(rgbMatch[2]));
      const b = Math.round(parseFloat(rgbMatch[3]));

      // 使用更智能的紫色检测算法
      if (this.isColorPurplish(r, g, b)) {
        return true;
      }

      // 转换为hex进行精确匹配
      const hexColor = this.rgbToHex(`rgb(${r}, ${g}, ${b})`);
      if (hexColor) {
        return this.PURPLE_COLORS.some(purple =>
          this.colorDistance(hexColor, purple) < 120  // 进一步增加容差到120
        );
      }
    }

    // 处理hex格式（支持3位和6位）
    if (color.startsWith('#')) {
      let hexColor = color.toUpperCase();
      // 转换3位hex为6位
      if (hexColor.length === 4) {
        hexColor = '#' + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2] + hexColor[3] + hexColor[3];
      }

      if (hexColor.length === 7) {
        return this.PURPLE_COLORS.some(purple =>
          this.colorDistance(hexColor, purple) < 120
        );
      }
    }

    // 处理HSL格式
    const hslMatch = color.match(/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%/);
    if (hslMatch) {
      const h = parseFloat(hslMatch[1]);
      const s = parseFloat(hslMatch[2]) / 100;
      const l = parseFloat(hslMatch[3]) / 100;

      // 紫色的色相范围：扩展到200-340度，降低饱和度和亮度要求
      if ((h >= 200 && h <= 340) && s > 0.1 && l > 0.05 && l < 0.95) {
        return true;
      }
    }

    return false;
  }

  private containsPurple(background: string): boolean {
    if (!background) return false;

    const lowerBackground = background.toLowerCase();

    // 检查紫色关键词（扩展列表）
    if (lowerBackground.includes('purple') || lowerBackground.includes('violet') ||
        lowerBackground.includes('magenta') || lowerBackground.includes('plum') ||
        lowerBackground.includes('orchid') || lowerBackground.includes('indigo') ||
        lowerBackground.includes('lavender') || lowerBackground.includes('amethyst') ||
        lowerBackground.includes('lilac') || lowerBackground.includes('mauve')) {
      return true;
    }

    // 检查hex颜色值（支持3位和6位）
    const hexMatches = background.match(/#[0-9a-fA-F]{3,6}/g);
    if (hexMatches) {
      for (let hex of hexMatches) {
        // 转换3位hex为6位
        if (hex.length === 4) {
          hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }

        if (hex.length === 7 && this.PURPLE_COLORS.some(purple =>
          this.colorDistance(hex.toUpperCase(), purple) < 120  // 进一步增加容差
        )) {
          return true;
        }
      }
    }

    // 检查RGB颜色值（支持更多格式）
    const rgbMatches = background.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/g);
    if (rgbMatches) {
      for (const rgbMatch of rgbMatches) {
        const match = rgbMatch.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/);
        if (match) {
          const r = Math.round(parseFloat(match[1]));
          const g = Math.round(parseFloat(match[2]));
          const b = Math.round(parseFloat(match[3]));

          if (this.isColorPurplish(r, g, b)) {
            return true;
          }
        }
      }
    }

    // 检查HSL颜色值
    const hslMatches = background.match(/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%/g);
    if (hslMatches) {
      for (const hslMatch of hslMatches) {
        const match = hslMatch.match(/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%/);
        if (match) {
          const h = parseFloat(match[1]);
          const s = parseFloat(match[2]) / 100;
          const l = parseFloat(match[3]) / 100;

          // 紫色的色相范围：扩展到200-340度
          if (h >= 200 && h <= 340 && s > 0.1 && l > 0.05 && l < 0.95) {
            return true;
          }
        }
      }
    }

    // 检查预定义的紫色值
    return this.PURPLE_COLORS.some(purple =>
      lowerBackground.includes(purple.toLowerCase())
    );
  }

  private isColorPurplish(r: number, g: number, b: number): boolean {
    // 紫色的特征：
    // 1. 蓝色分量通常较高
    // 2. 红色分量中等到高
    // 3. 绿色分量相对较低

    // 预先计算HSV值，用于多个检测规则
    const hsv = this.rgbToHsv(r, g, b);

    // 规则1: HSV色彩空间检测（最准确的方法）
    // 紫色的色相范围：扩展到200-340度，覆盖更多紫色变体
    if ((hsv.h >= 200 && hsv.h <= 340) && hsv.s > 0.15 && hsv.v > 0.15) {
      return true;
    }

    // 规则2: 特殊情况 - 检测灰紫色和淡紫色
    if ((hsv.h >= 240 && hsv.h <= 300) && hsv.s > 0.05 && hsv.v > 0.3) {
      return true;
    }

    // 规则3: 基本紫色检测 - 蓝色分量占主导
    if (b > g && b > 60 && (b - g) > 20) {
      return true;
    }

    // 规则4: 粉紫色检测 - 红色和蓝色都较高，绿色较低
    if (r > 100 && b > 100 && g < Math.min(r, b) * 0.9) {
      return true;
    }

    // 规则5: 深紫色检测 - 蓝色 > 红色 > 绿色
    if (b > r && r > g && b > 50 && (b - r) > 10) {
      return true;
    }

    // 规则6: 偏蓝紫色检测 - 蓝色明显高于其他颜色
    if (b > r * 1.05 && b > g * 1.2 && b > 80) {
      return true;
    }

    // 规则7: 中等紫色检测 - 红色和蓝色接近，都大于绿色
    if (Math.abs(r - b) < 60 && r > g * 1.1 && b > g * 1.1 && Math.max(r, b) > 70) {
      return true;
    }

    // 规则8: 浅紫色检测 - 整体亮度较高，但保持紫色特征
    if (r > 140 && b > 140 && g > 80 && (r + b) > g * 1.6) {
      return true;
    }

    // 规则9: 现代UI紫色检测 - 针对常见的UI设计紫色
    // 检测类似 #6366f1, #8b5cf6 这样的现代紫色
    if (b > 200 && r > 80 && r < 180 && g > 50 && g < 120) {
      return true;
    }

    // 规则10: 品牌紫色检测 - 针对科技公司常用的紫色
    if ((r > 80 && r < 150) && (g > 40 && g < 110) && (b > 180 && b < 255)) {
      return true;
    }

    // 规则11: 渐变紫色检测 - 检测渐变中常见的紫色过渡
    const totalIntensity = r + g + b;
    const purpleRatio = (r + b) / totalIntensity;
    if (purpleRatio > 0.65 && b > g && totalIntensity > 150) {
      return true;
    }

    // 规则12: 低饱和度紫色检测 - 检测接近灰色但带紫色调的颜色
    if (hsv.h >= 220 && hsv.h <= 320 && hsv.s > 0.03 && hsv.v > 0.2) {
      const colorVariance = Math.max(r, g, b) - Math.min(r, g, b);
      if (colorVariance > 10 && (b >= g || r >= g)) {
        return true;
      }
    }

    return false;
  }

  private rgbToHsv(r: number, g: number, b: number): {h: number, s: number, v: number} {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    const s = max === 0 ? 0 : diff / max;
    const v = max;

    if (diff !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / diff + 2) / 6;
          break;
        case b:
          h = ((r - g) / diff + 4) / 6;
          break;
      }
    }

    return {
      h: h * 360,
      s: s,
      v: v
    };
  }

  private rgbToHex(rgb: string): string | null {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }
    return null;
  }

  private colorDistance(color1: string, color2: string): number {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);

    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);

    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
  }

  private calculateAIScore(features: AIFeature[]): number {
    const totalScore = features.reduce((sum, feature) => sum + feature.score, 0);
    return Math.min(Math.round(totalScore), 100);
  }

  private generateAnalysisDetails(features: AIFeature[], data: any): string {
    const detectedFeatures = features.filter(f => f.detected);
    const highConfidenceFeatures = features.filter(f => f.confidence === 'high');
    
    let details = `分析了 ${data.elements.length} 个页面元素。\n\n`;
    
    if (detectedFeatures.length > 0) {
      details += `检测到 ${detectedFeatures.length} 个AI设计特征:\n`;
      detectedFeatures.forEach(feature => {
        details += `• ${feature.name} (${feature.confidence}置信度): ${feature.description}\n`;
      });
    } else {
      details += '未检测到明显的AI设计特征。\n';
    }
    
    if (highConfidenceFeatures.length > 0) {
      details += `\n高置信度特征 (${highConfidenceFeatures.length}个) 表明该网站具有较强的AI设计风格。`;
    }
    
    return details;
  }
}
