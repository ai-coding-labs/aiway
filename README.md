# AI味儿检测器 - AI Flavor Detector

[![GitHub stars](https://img.shields.io/github/stars/ai-coding-labs/aiway)](https://github.com/ai-coding-labs/aiway)
[![GitHub forks](https://img.shields.io/github/forks/ai-coding-labs/aiway)](https://github.com/ai-coding-labs/aiway)
[![GitHub issues](https://github.com/ai-coding-labs/aiway/issues)](https://github.com/ai-coding-labs/aiway/issues)
[![GitHub license](https://img.shields.io/github/license/ai-coding-labs/aiway)](https://github.com/ai-coding-labs/aiway/blob/main/LICENSE)

<div align="center">
  <img src="https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
</div>

A professional Electron-based desktop application for detecting AI design patterns in websites and providing intelligent scoring.

专业的基于Electron的桌面应用程序，用于检测网站中的AI设计模式并提供智能评分。

## 🌟 Project Overview

AI Flavor Detector is a specialized tool for analyzing website design styles, intelligently identifying AI design features including modern UI elements, color schemes, layout patterns, and more. It provides a 0-100 AI flavor score, making it perfect for designers, product managers, and developers to analyze competitor website design trends.

AI味儿检测器是一个专业的网站设计风格分析工具，能够智能识别AI设计特征，包括现代UI元素、配色方案、布局模式等。它提供0-100的AI味评分，非常适合设计师、产品经理和开发者分析竞争对手网站设计趋势。

## 🌐 Language Support / 语言支持

This project supports both **English** and **Chinese (Simplified)**. You can switch languages directly in the application interface.

本项目支持**英文**和**中文（简体）**两种语言。您可以在应用程序界面中直接切换语言。

**Switch Language / 切换语言:**
- Click the language button (🌐) in the top-right corner of the application
- 点击应用程序右上角的语言按钮 (🌐)

**Features / 功能:**
- **Automatic Detection**: Automatically detects system language on first launch
- **自动检测**: 首次启动时自动检测系统语言
- **Persistent Settings**: Remembers your language preference
- **持久设置**: 记住您的语言偏好
- **Real-time Switching**: Switch languages instantly without restarting
- **实时切换**: 无需重启即可即时切换语言

## ✨ Core Features

### 🔍 AI Feature Detection
- **Large Border Radius Detection** - Identifies modern rounded elements with border-radius >= 8px
- **Purple Color Scheme Analysis** - Intelligently recognizes various purple tones and their distribution
- **Gradient Background Detection** - Analyzes linear-gradient, radial-gradient, and other gradient effects
- **Modern Button Styles** - Identifies buttons with rounded corners, shadows, and gradients
- **AI-Related Keywords** - Detects AI, machine learning, and intelligent-related vocabulary on pages

### 📊 Intelligent Scoring System
- **0-30 points**: Low AI flavor - Traditional design style with minimal AI features
- **31-69 points**: Medium AI flavor - Balanced design with some modern elements
- **70-100 points**: High AI flavor - Extensive AI design features with high modernization

### 🎨 User Interface Features
- **Responsive Design** - Adaptive layout for different window sizes
- **响应式设计** - 适应不同窗口大小的自适应布局
- **Modern UI** - Beautiful interface following the four UI design principles
- **现代UI** - 遵循四大UI设计原则的美丽界面
- **Real-time Preview** - Built-in browser preview without external browser dependency
- **实时预览** - 内置浏览器预览，无需外部浏览器依赖
- **Result Export** - Support for saving and sharing detection reports
- **结果导出** - 支持保存和分享检测报告
- **Multi-language Support** - Seamless switching between English and Chinese
- **多语言支持** - 英文和中文之间的无缝切换

## 🛠️ Technical Architecture

### Core Technology Stack
- **Electron 27.0.0** - Cross-platform desktop application framework supporting Windows, macOS, and Linux
- **TypeScript 5.0.0** - Type-safe JavaScript superset for better development experience
- **HTML5/CSS3** - Modern frontend technologies supporting latest Web standards
- **Playwright 1.40.0** - Powerful end-to-end testing framework

### Project Structure
```
aiway/
├── src/
│   ├── main/                 # Electron main process
│   │   └── main.ts          # Main process entry, handles window management and IPC
│   ├── renderer/             # Renderer process
│   │   ├── index.html       # Main interface HTML structure
│   │   ├── renderer.ts      # Renderer process main logic
│   │   ├── github-badge.ts  # GitHub badge generator
│   │   └── preload.ts       # Preload script for secure main-renderer bridging
│   ├── shared/               # Shared modules
│   │   ├── ai-detector.ts   # AI feature detection core algorithms
│   │   ├── report-card-generator.ts  # Report card generator
│   │   ├── github-service.ts # GitHub service integration
│   │   ├── storage-service.ts # Local storage service
│   │   └── i18n.ts          # Internationalization support
│   ├── styles/               # Style files
│   │   ├── main.css         # Main style file
│   │   └── components.css   # Component style file
│   └── assets/               # Static assets
├── tests/                    # Playwright test files
├── dist/                     # TypeScript compilation output
├── start.sh                  # One-click startup script
└── package.json              # Project configuration and dependency management
```

### Internationalization Architecture / 国际化架构
- **i18n.ts**: Core internationalization manager with language switching
- **i18n.ts**: 核心国际化管理器，支持语言切换
- **Language Detection**: Automatic system language detection
- **语言检测**: 自动系统语言检测
- **Persistent Storage**: Language preferences saved in localStorage
- **持久存储**: 语言偏好保存在localStorage中
- **Real-time Updates**: Dynamic text updates without page refresh
- **实时更新**: 无需页面刷新即可动态更新文本

## 🚀 Quick Start

### System Requirements
- **Node.js**: >= 16.0.0 (LTS version recommended)
- **npm**: >= 8.0.0
- **Operating System**: Windows 10+, macOS 10.14+, Ubuntu 18.04+

### One-Click Startup (Recommended)
```bash
# Add execution permission to startup script
chmod +x start.sh

# Run one-click startup script
./start.sh
```

### Language Switching / 语言切换
After starting the application, you can switch languages using the language button (🌐) in the top-right corner:

启动应用程序后，您可以使用右上角的语言按钮 (🌐) 切换语言：

1. **Click the language button** to toggle between English and Chinese
   **点击语言按钮** 在英文和中文之间切换
2. **Language preference** is automatically saved and restored on next launch
   **语言偏好** 会自动保存并在下次启动时恢复
3. **All interface text** updates instantly without restarting
   **所有界面文本** 无需重启即可即时更新

### Manual Installation and Setup

#### 1. Clone Repository
```bash
git clone https://github.com/your-username/aiway.git
cd aiway
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Build Project
```bash
npm run build
```

#### 4. Launch Application
```bash
npm start
```

### Development Mode
```bash
npm run dev
```

## 📖 User Guide

### Basic Operation Flow

1. **Launch Application**
   - Run `npm start` or double-click `start.sh` script
   - Wait for application to load completely

2. **Enter Website URL**
   - Input the target website address in the URL input field
   - Supports both HTTP and HTTPS protocols
   - Recommended to use complete URL addresses

3. **Load Website**
   - Click "Load Website" button
   - Application displays target website in built-in preview area
   - Wait for page to fully load

4. **Start Detection**
   - Click "Start AI Flavor Detection" button
   - System begins analyzing website design features
   - Detection process may take several seconds

5. **View Results**
   - Check AI flavor score (0-100 points)
   - Browse detailed feature analysis report
   - View detected specific elements and styles

6. **Clear Results**
   - Click "Clear Results" button
   - Start new detection task

### Advanced Features

#### Batch Detection
- Support for batch detection of multiple URLs
- Can save detection history records
- Support for exporting and sharing detection results

#### Custom Detection
- Adjustable weights for detection features
- Support for adding custom detection rules
- Configurable detection sensitivity

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- **Unit Tests**: Core algorithms and utility function tests
- **Integration Tests**: Module interaction tests
- **End-to-End Tests**: Complete user operation flow tests using Playwright

### Test Reports
After test completion, detailed reports can be viewed in:
- `test-results/` - Test result data
- `playwright-report/` - Playwright test reports

## 🔧 Development Guide

### Adding New Detection Features

1. **Extend Detection Algorithms**
   ```typescript
   // Add new methods in src/shared/ai-detector.ts
   export function detectNewFeature(document: Document): FeatureResult {
     // Implement new detection logic
     return {
       name: 'New Feature',
       score: 0,
       elements: [],
       description: 'Feature description'
     };
   }
   ```

### Adding New Languages / 添加新语言

1. **Update i18n.ts Configuration**
   ```typescript
   // Add new language in src/shared/i18n.ts
   'ja-JP': {
     'app-title': 'AI味検出器',
     'app-subtitle': 'ウェブサイトのAIデザインスタイルを検出してスコアリング',
     // ... add all text keys
   }
   ```

2. **Update Language Type**
   ```typescript
   export type Language = 'zh-CN' | 'en-US' | 'ja-JP';
   ```

3. **Add Language Detection**
   ```typescript
   // In constructor, add Japanese detection
   if (systemLang.startsWith('ja')) {
     this.currentLanguage = 'ja-JP';
   }
   ```

4. **Test All Text Elements**
   - Verify all interface text displays correctly
   - Test language switching functionality
   - Ensure proper text alignment and layout

2. **Update Scoring Algorithm**
   ```typescript
   // Integrate new features in analyzeFeatures method
   const newFeatureResult = detectNewFeature(document);
   features.push(newFeatureResult);
   ```

3. **Add Test Cases**
   ```typescript
   // Add corresponding test files in tests/ directory
   test('should detect new feature correctly', async ({ page }) => {
     // Test new feature detection logic
   });
   ```

### Custom Styling

- **Main Styles**: `src/styles/main.css` - Global styles and layout
- **Component Styles**: `src/styles/components.css` - Component-level styles
- **Responsive Design**: Adaptive layout support for different screen sizes

### Code Standards

- Use TypeScript for type-safe development
- Follow ESLint code standards
- Maintain code readability and maintainability

## 📝 Contributing

We welcome all forms of contributions! Whether it's feature suggestions, bug reports, code contributions, or documentation improvements.

### Contribution Methods

1. **Submit Issues**
   - Report bugs or suggest features
   - Describe detailed problem information and reproduction steps

2. **Submit Pull Requests**
   - Fork project and create feature branch
   - Submit code changes
   - Ensure all tests pass

3. **Improve Documentation**
   - Enhance README documentation
   - Add usage examples and tutorials
   - Translate documentation to other languages

4. **Internationalization Support**
   - Add new language translations
   - Improve existing translations
   - Test language switching functionality
   - Ensure proper text formatting for different languages

### Development Workflow

1. Fork project to your GitHub account
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Create Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🗓️ Changelog

### v1.1.0 (2025-01-21)
- 🌐 **Multi-language Support**: Added English and Chinese language switching
- 🌐 **多语言支持**: 添加英文和中文语言切换
- 🔄 **Real-time Language Switching**: Switch languages instantly without restart
- 🔄 **实时语言切换**: 无需重启即可即时切换语言
- 💾 **Persistent Language Settings**: Remember user language preferences
- 💾 **持久语言设置**: 记住用户语言偏好
- 🎯 **Automatic Language Detection**: Detect system language on first launch
- 🎯 **自动语言检测**: 首次启动时自动检测系统语言

### v1.0.0 (2025-08-21)
- 🎉 Initial version release
- ✨ Basic AI flavor detection functionality
- 🎨 Modern user interface design
- 🧪 Complete test coverage
- 📱 Responsive design support
- 🔍 Multiple AI feature detection algorithms
- 📊 Intelligent scoring system
- 💾 Local storage and history records
- 🚀 One-click startup script

## 🤝 Contact Us

- **Project Homepage**: [GitHub Repository](https://github.com/your-username/aiway)
- **Issue Feedback**: [Issues](https://github.com/your-username/aiway/issues)
- **Discussion**: [Discussions](https://github.com/your-username/aiway/discussions)

## ⚠️ Disclaimer

This application is for learning and research purposes only. Detection results are for reference only. When using this tool for website analysis, please comply with relevant website terms of use and applicable laws and regulations. Developers are not responsible for any consequences arising from the use of this tool.

---

## 🌟 Language Switching Feature Summary / 语言切换功能总结

The **Multi-language Support** feature provides a seamless bilingual experience:

**多语言支持**功能提供无缝的双语体验：

### ✨ Key Benefits / 主要优势
- **🌍 Global Accessibility**: Support for users worldwide
- **🌍 全球可访问性**: 支持全球用户
- **🔄 Instant Switching**: Change languages with one click
- **🔄 即时切换**: 一键切换语言
- **💾 Smart Memory**: Remembers your language preference
- **💾 智能记忆**: 记住您的语言偏好
- **🎯 Auto-Detection**: Automatically detects your system language
- **🎯 自动检测**: 自动检测您的系统语言

### 🚀 How to Use / 使用方法
1. **Launch the app** - Application starts in your preferred language
   **启动应用** - 应用程序以您偏好的语言启动
2. **Click the language button (🌐)** - Located in the top-right corner
   **点击语言按钮 (🌐)** - 位于右上角
3. **Enjoy instant switching** - All text updates immediately
   **享受即时切换** - 所有文本立即更新

---

**AI Flavor Detector** - Making AI design patterns visible! 🚀
