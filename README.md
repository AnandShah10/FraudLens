# Scam Risk Meter 🛡️

**Advanced Chrome Extension for Real-Time Scam Detection**

A powerful, privacy-first browser extension that analyzes websites in real-time, providing instant risk scoring, evidence breakdowns, and protection against phishing, scams, and malicious patterns.

![Version](https://img.shields.io/badge/version-1.5.2-success)
![Chrome](https://img.shields.io/badge/Chrome-MV3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![React](https://img.shields.io/badge/React-18-61dafb)

## ✨ Features

### Core Capabilities
- **Real-time Risk Scoring** (0-100 scale) with visual SVG gauge
- **Multi-Layer Heuristic Analysis**:
  - Domain entropy, typosquatting & suspicious TLD detection
  - JavaScript obfuscation & dangerous pattern detection
  - Form protection (password, seed phrase, credit card fields)
  - Browser fingerprinting detection (Canvas, WebGL, AudioContext, etc.)
  - Phishing language & urgency pattern recognition
  - Shopping/cart security analysis
  - Reputation scoring based on domain characteristics
- **Dynamic URL Blocking** using Chrome's `declarativeNetRequest` API
- **Evidence & Impact Tracking** with weighted signals
- **Actionable Recommendations** tailored to risk level

### User Interface
- **Popup**: Clean risk meter, top evidence, quick recommendations
- **Detailed Modal**: Full evidence list with categories, impact scores, and confidence metrics
- **Options Page**: Toggle detection modules, adjust risk sensitivity, clear analysis cache
- **Beautiful Dark UI** built with Tailwind CSS v4 and React

### Privacy & Performance
- **Zero Telemetry** - All analysis runs locally in the browser
- **Deterministic Heuristics** - No randomness in scoring
- **Configurable Analysis** - Disable fingerprinting or form protection for performance
- **Smart Caching** - Analysis results stored locally with easy cache management

## 📸 Screenshots

*(Add screenshots of the popup, options page, and risk gauge here)*

**Popup with Risk Gauge:**
- Live risk score visualization
- Color-coded risk levels (Safe → Dangerous)
- Evidence list with explanations

**Options Page:**
- Detection toggles
- Risk sensitivity slider (30-85)
- Data management tools
- Threat intelligence summary

## 🚀 Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/scam-website-risk-meter.git
   cd scam-website-risk-meter
   ```

   *Replace `your-username` with your GitHub username.*

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable **Developer mode**
   - Click **"Load unpacked"**
   - Select the `dist` folder

### Chrome Web Store
*(Coming soon - currently distributed as unpacked or .crx)*

## 📖 Usage

1. **Click the extension icon** in your toolbar to view the current website's risk score
2. **Review the evidence** - see exactly why a site received its score
3. **Check recommendations** for next steps (especially on high-risk sites)
4. **Open Settings** to customize detection behavior:
   - Toggle fingerprinting detection
   - Enable/disable form protection warnings
   - Control automatic blocking of known scam patterns
   - Adjust the risk threshold

## 🛠️ How It Works

The extension uses a sophisticated `HeuristicEngine` combined with a `RiskEngine` that aggregates multiple signals:

```typescript
const signals = heuristicEngine.analyze(url, domContent, settings);
const riskScore = riskEngine.calculateRisk(signals, settings.riskThreshold);
```

**Analysis Pipeline:**
- **Background Service Worker** (MV3) coordinates analysis and blocking rules
- **Content Script** extracts DOM content and sends to background
- **Risk Engine** combines signals with configurable weights
- **Storage** persists results for instant popup loading

All computation happens **client-side** with no external API dependencies.

## 🧪 Development

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint and format
npm run lint
npm run format
```

**Key Files:**
- `src/modules/heuristicEngine.ts` - Core analysis logic
- `src/modules/riskEngine.ts` - Score calculation and recommendations
- `src/popup/index.tsx` - Main popup UI
- `src/options/index.tsx` - Settings interface
- `src/background/index.ts` - Service worker and blocking rules
- `public/manifest.json` - Extension configuration

## 📊 Changelog

See the full [CHANGELOG.md](CHANGELOG.md) for version history.

**Recent Updates (v1.5.2):**
- Clean Vite multi-page build output (flat `popup.html`/`options.html`)
- Updated to Tailwind CSS v4 with native Vite plugin
- Improved heuristic determinism and settings integration
- Enhanced blocking rules for popular scam patterns

## 🤝 Contributing

Contributions welcome! Areas of improvement:
- Additional heuristic modules
- Machine learning-inspired pattern detection (still local)
- Better test coverage for edge cases
- Performance optimizations
- Internationalization

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for a safer web.**

*Privacy-first. Local-only. Zero telemetry.*

## Support

⭐ Star this repo if you find it useful!

**Disclaimer**: This extension uses heuristic analysis and is not a replacement for professional security tools or common sense. Always verify critical transactions independently.
