# AI Flavor Detector

A professional Electron-based desktop application for detecting AI design patterns in websites and providing intelligent scoring.

## 🌟 Project Overview

AI Flavor Detector is a specialized tool for analyzing website design styles, intelligently identifying AI design features including modern UI elements, color schemes, layout patterns, and more. It provides a 0-100 AI flavor score, making it perfect for designers, product managers, and developers to analyze competitor website design trends.

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
│   │   └── storage-service.ts # Local storage service
│   ├── styles/               # Style files
│   │   ├── main.css         # Main style file
│   │   └── components.css   # Component style file
│   └── assets/               # Static assets
├── tests/                    # Playwright test files
├── dist/                     # TypeScript compilation output
├── start.sh                  # One-click startup script
└── package.json              # Project configuration and dependency management
```

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

### Development Workflow

1. Fork project to your GitHub account
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Create Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🗓️ Changelog

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

**AI Flavor Detector** - Making AI design patterns visible! 🚀
