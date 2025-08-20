# AI Flavor Detector

<div align="right">
  <a href="README.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/English-007ACC?style=for-the-badge&logo=language&logoColor=white" alt="English">
  </a>
  <a href="README.zh-CN.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/中文-FF6B6B?style=for-the-badge&logo=language&logoColor=white" alt="中文">
  </a>
</div>

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

## 🌟 Project Overview

AI Flavor Detector is a specialized tool for analyzing website design styles, intelligently identifying AI design features including modern UI elements, color schemes, layout patterns, and more. It provides a 0-100 AI flavor score, making it perfect for designers, product managers, and developers to analyze competitor website design trends.

## 🌐 Language Support

This project supports both **English** and **Chinese (Simplified)**. You can switch languages directly in the application interface.

**Switch Language:**
- Click the language button (🌐) in the top-right corner of the application

**Features:**
- **Automatic Detection**: Automatically detects system language on first launch
- **Persistent Settings**: Remembers your language preference
- **Real-time Switching**: Switch languages instantly without restarting

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
- **Modern UI** - Beautiful interface following the four UI design principles
- **Real-time Preview** - Built-in browser preview without external browser dependency
- **Result Export** - Support for saving and sharing detection reports
- **Multi-language Support** - Seamless switching between English and Chinese

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
│   │   └── components.css   # Component styles
│   └── assets/               # Static resources
├── tests/                    # Playwright test files
├── dist/                     # TypeScript compilation output
├── start.sh                  # One-click startup script
└── package.json              # Project configuration and dependency management
```

## 🚀 Quick Start

### Requirements
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

### Manual Installation and Setup

#### 1. Clone Repository
```bash
git clone https://github.com/ai-coding-labs/aiway.git
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

#### 4. Start Application
```bash
npm start
```

## 🔧 Development

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run dist
```

### Run Tests
```bash
npm test
```

## 📱 Application Features

### Main Interface
- **URL Input**: Enter website URL for AI flavor detection
- **Language Toggle**: Switch between English and Chinese interfaces
- **Real-time Preview**: Built-in browser for website preview
- **Detection Results**: Comprehensive AI flavor analysis and scoring

### Detection Algorithm
- **Visual Analysis**: Analyzes CSS properties, color schemes, and layout patterns
- **AI Pattern Recognition**: Identifies common AI design characteristics
- **Intelligent Scoring**: Provides detailed scoring with explanations
- **Report Generation**: Creates comprehensive detection reports

## 🌍 Internationalization

The application supports multiple languages with automatic detection and manual switching:

- **English (en-US)**: Default language
- **Chinese Simplified (zh-CN)**: Full Chinese localization

Language preferences are automatically saved and restored on application restart.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Powered by [TypeScript](https://www.typescriptlang.org/)
- Testing with [Playwright](https://playwright.dev/)

---

<div align="center">
  <p>Made with ❤️ by the AI Coding Labs team</p>
  <p>AI Flavor Detector - Discover the AI in web design</p>
</div>
