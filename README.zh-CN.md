# AI味儿检测器

<div align="right">
  <a href="README.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/English-007ACC?style=for-the-badge&logo=language&logoColor=white" alt="English">
  </a>
  <a href="README.zh-CN.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/中文-FF6B6B?style=for-the-badge&logo=language&logoColor=white" alt="中文">
  </a>
</div>

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/ai-coding-labs/aiway?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ai-coding-labs/aiway)
[![GitHub forks](https://img.shields.io/github/forks/ai-coding-labs/aiway?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ai-coding-labs/aiway)
[![GitHub issues](https://img.shields.io/github/issues/ai-coding-labs/aiway?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ai-coding-labs/aiway/issues)
[![GitHub license](https://img.shields.io/github/license/ai-coding-labs/aiway?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ai-coding-labs/aiway/blob/main/LICENSE)

</div>

<div align="center">

![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

</div>

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-00A4EF?style=for-the-badge&logo=windows&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-FF6B6B?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-00D4AA?style=for-the-badge)

</div>

一个基于Electron的桌面应用程序，用于检测网站的AI设计风格并进行智能评分。

## 🌟 项目简介

AI味儿检测器是一款专业的网站设计风格分析工具，能够智能识别网站中的AI设计特征，包括现代化UI元素、配色方案、布局风格等，并给出0-100分的AI味评分。这款工具特别适合设计师、产品经理和开发者用来分析竞品网站的设计趋势。

## ✨ 核心功能

### 🔍 AI特征检测
- **大圆角设计识别** - 检测border-radius >= 8px的现代化圆角元素
- **紫色配色方案分析** - 智能识别各种紫色色调的使用频率和分布
- **渐变背景检测** - 分析linear-gradient、radial-gradient等渐变效果
- **现代化按钮样式** - 识别具有圆角+阴影/渐变的按钮设计
- **AI相关关键词** - 检测页面中的AI、机器学习、智能化等相关词汇

### 📊 智能评分系统
- **0-30分**: 低AI味 - 传统设计风格，AI特征较少
- **31-69分**: 中等AI味 - 部分现代化设计元素，平衡的设计风格
- **70-100分**: 高AI味 - 大量AI设计特征，现代化程度高

### 🎨 用户界面特性
- **响应式设计** - 支持不同窗口大小的自适应布局
- **现代化UI** - 符合UI设计四大原则的精美界面
- **实时预览** - 内置浏览器预览功能，无需外部浏览器
- **结果导出** - 支持检测报告的保存和分享

## 🛠️ 技术架构

### 核心技术栈
- **Electron 27.0.0** - 跨平台桌面应用框架，支持Windows、macOS、Linux
- **TypeScript 5.0.0** - 类型安全的JavaScript超集，提供更好的开发体验
- **HTML5/CSS3** - 现代化前端技术，支持最新的Web标准
- **Playwright 1.40.0** - 强大的端到端测试框架

### 项目架构
```
aiway/
├── src/
│   ├── main/                 # Electron主进程
│   │   └── main.ts          # 主进程入口，负责窗口管理和IPC通信
│   ├── renderer/             # 渲染进程
│   │   ├── index.html       # 主界面HTML结构
│   │   ├── renderer.ts      # 渲染进程主逻辑
│   │   ├── github-badge.ts  # GitHub徽章生成器
│   │   └── preload.ts       # 预加载脚本，安全桥接主进程和渲染进程
│   ├── shared/               # 共享模块
│   │   ├── ai-detector.ts   # AI特征检测核心算法
│   │   ├── report-card-generator.ts  # 报告卡片生成器
│   │   ├── github-service.ts # GitHub服务集成
│   │   └── storage-service.ts # 本地存储服务
│   ├── styles/               # 样式文件
│   │   ├── main.css         # 主样式文件
│   │   └── components.css   # 组件样式文件
│   └── assets/               # 静态资源
├── tests/                    # Playwright测试文件
├── dist/                     # TypeScript编译输出
├── start.sh                  # 一键启动脚本
└── package.json              # 项目配置和依赖管理
```

## 🚀 快速开始

### 环境要求
- **Node.js**: >= 16.0.0 (推荐使用LTS版本)
- **npm**: >= 8.0.0
- **操作系统**: Windows 10+, macOS 10.14+, Ubuntu 18.04+

### 一键启动 (推荐)
```bash
# 给启动脚本添加执行权限
chmod +x start.sh

# 运行一键启动脚本
./start.sh
```

### 手动安装和运行

#### 1. 克隆项目
```bash
git clone https://github.com/your-username/aiway.git
cd aiway
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 构建项目
```bash
npm run build
```

#### 4. 启动应用
```bash
npm start
```

### 开发模式
```bash
npm run dev
```

## 📖 使用指南

### 基本操作流程

1. **启动应用**
   - 运行 `npm start` 或双击 `start.sh` 脚本
   - 等待应用加载完成

2. **输入网址**
   - 在地址输入框中输入要检测的网站地址
   - 支持HTTP和HTTPS协议
   - 建议使用完整的URL地址

3. **加载网站**
   - 点击"加载网站"按钮
   - 应用会在内置预览区域显示目标网站
   - 等待页面完全加载

4. **开始检测**
   - 点击"开始检测AI味"按钮
   - 系统开始分析网站的设计特征
   - 检测过程可能需要几秒钟时间

5. **查看结果**
   - 查看AI味评分（0-100分）
   - 浏览详细的特征分析报告
   - 查看检测到的具体元素和样式

6. **清除结果**
   - 点击"清除结果"按钮
   - 重新开始新的检测任务

### 高级功能

#### 批量检测
- 支持多个网址的批量检测
- 可以保存检测历史记录
- 支持检测结果的导出和分享

#### 自定义检测
- 可以调整检测特征的权重
- 支持添加自定义的检测规则
- 可以设置检测的敏感度

## 🧪 测试

### 运行测试
```bash
npm test
```

### 测试覆盖
- **单元测试**: 核心算法和工具函数的测试
- **集成测试**: 模块间交互的测试
- **端到端测试**: 使用Playwright进行完整的用户操作流程测试

### 测试报告
测试完成后，可以在以下目录查看详细报告：
- `test-results/` - 测试结果数据
- `playwright-report/` - Playwright测试报告

## 🔧 开发指南

### 添加新的检测特征

1. **扩展检测算法**
   ```typescript
   // 在 src/shared/ai-detector.ts 中添加新方法
   export function detectNewFeature(document: Document): FeatureResult {
     // 实现新的检测逻辑
     return {
       name: '新特征',
       score: 0,
       elements: [],
       description: '特征描述'
     };
   }
   ```

2. **更新评分算法**
   ```typescript
   // 在 analyzeFeatures 方法中集成新特征
   const newFeatureResult = detectNewFeature(document);
   features.push(newFeatureResult);
   ```

3. **添加测试用例**
   ```typescript
   // 在 tests/ 目录中添加对应的测试文件
   test('should detect new feature correctly', async ({ page }) => {
     // 测试新特征的检测逻辑
   });
   ```

### 自定义样式

- **主样式**: `src/styles/main.css` - 全局样式和布局
- **组件样式**: `src/styles/components.css` - 组件级样式
- **响应式设计**: 支持不同屏幕尺寸的自适应布局

### 代码规范

- 使用TypeScript进行类型安全的开发
- 遵循ESLint代码规范
- 保持代码的可读性和可维护性

## 📝 贡献指南

我们欢迎所有形式的贡献！无论是功能建议、bug报告、代码贡献还是文档改进。

### 贡献方式

1. **提交Issue**
   - 报告bug或提出功能建议
   - 描述问题的详细信息和复现步骤

2. **提交Pull Request**
   - Fork项目并创建特性分支
   - 提交代码更改
   - 确保所有测试通过

3. **改进文档**
   - 完善README文档
   - 添加使用示例和教程
   - 翻译文档到其他语言

### 开发流程

1. Fork项目到你的GitHub账户
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

## 🗓️ 更新日志

### v1.0.0 (2025-08-21)
- 🎉 初始版本发布
- ✨ 基本的AI味检测功能
- 🎨 现代化用户界面设计
- 🧪 完整的测试覆盖
- 📱 响应式设计支持
- 🔍 多种AI特征检测算法
- 📊 智能评分系统
- 💾 本地存储和历史记录
- 🚀 一键启动脚本

## 🤝 联系我们

- **项目主页**: [GitHub Repository](https://github.com/your-username/aiway)
- **问题反馈**: [Issues](https://github.com/your-username/aiway/issues)
- **讨论交流**: [Discussions](https://github.com/your-username/aiway/discussions)

## ⚠️ 免责声明

本应用仅用于学习和研究目的，检测结果仅供参考。使用本工具进行网站分析时，请遵守相关网站的使用条款和法律法规。开发者不对使用本工具产生的任何后果承担责任。

---

**AI味儿检测器** - 让AI设计风格无所遁形！ 🚀 