# AI味儿检测器

一个基于Electron的桌面应用程序，用于检测网站的AI设计风格并进行评分。

## 功能特性

- 🌐 **网站加载**: 输入任意网址，在应用内预览网站
- 🤖 **AI味检测**: 智能分析网站的AI设计特征
- 📊 **评分系统**: 0-100分的AI味评分，分数越高AI味越重
- 🎯 **特征识别**: 检测大圆角按钮、紫色配色、渐变背景等AI特征
- 📱 **响应式设计**: 支持不同窗口大小的自适应布局
- 🎨 **现代化UI**: 符合UI设计四大原则的精美界面

## AI味特征检测

本应用检测以下AI设计特征：

1. **大圆角设计** - 检测border-radius >= 8px的元素
2. **紫色配色方案** - 识别各种紫色色调的使用
3. **渐变背景** - 检测linear-gradient、radial-gradient等渐变效果
4. **现代化按钮样式** - 识别具有圆角+阴影/渐变的按钮
5. **AI相关关键词** - 检测页面中的AI、机器学习等相关词汇

## 技术栈

- **Electron** - 跨平台桌面应用框架
- **TypeScript** - 类型安全的JavaScript超集
- **HTML5/CSS3** - 现代化前端技术
- **Playwright** - 端到端测试框架

## 项目结构

```
aiway/
├── src/
│   ├── main/           # Electron主进程
│   │   └── main.ts
│   ├── renderer/       # 渲染进程
│   │   ├── index.html
│   │   ├── renderer.ts
│   │   └── preload.ts
│   ├── shared/         # 共享模块
│   │   └── ai-detector.ts
│   └── styles/         # 样式文件
│       ├── main.css
│       └── components.css
├── tests/              # 测试文件
├── dist/               # 编译输出
└── package.json
```

## 安装和运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 启动应用

```bash
npm start
```

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

## 使用说明

1. **启动应用**: 运行 `npm start` 启动AI味儿检测器
2. **输入网址**: 在输入框中输入要检测的网站地址
3. **加载网站**: 点击"加载网站"按钮，应用会在预览区域显示网站
4. **开始检测**: 点击"开始检测AI味"按钮，开始分析网站特征
5. **查看结果**: 查看AI味评分和详细的特征分析报告
6. **清除结果**: 点击"清除结果"按钮重新开始

## 评分标准

- **0-30分**: 低AI味 - 传统设计风格，AI特征较少
- **31-69分**: 中等AI味 - 部分现代化设计元素
- **70-100分**: 高AI味 - 大量AI设计特征，现代化程度高

## 开发指南

### 添加新的检测特征

1. 在 `src/shared/ai-detector.ts` 中添加新的检测方法
2. 在 `analyzeFeatures` 方法中调用新的检测逻辑
3. 更新评分算法以包含新特征的权重

### 自定义样式

- 主要样式: `src/styles/main.css`
- 组件样式: `src/styles/components.css`

### 测试

使用Playwright进行端到端测试，测试文件位于 `tests/` 目录。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License

## 更新日志

### v1.0.0
- 初始版本发布
- 基本的AI味检测功能
- 现代化用户界面
- 完整的测试覆盖

---

**注意**: 本应用仅用于学习和研究目的，检测结果仅供参考。
