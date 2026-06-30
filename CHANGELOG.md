# FraudLens Changelog

## v1.5.2 (Current)
- Cleaned Vite multi-page build output: added Rollup `generateBundle` plugin to rename `src/popup/index.html` → `popup.html` and `src/options/index.html` → `options.html` at dist root
- Updated `public/manifest.json`, package.json, UI badges, and descriptions to v1.5.2
- Manifest now consistently references flat `popup.html`/`options.html` (matches built structure)
- Improved build config for cleaner Chrome extension packaging (no nested src/ in dist)

## v1.5.1
- Switched to Tailwind CSS v4 native Vite plugin (`@tailwindcss/vite`) + `@import "tailwindcss";` syntax in `src/tailwind.css`, removing `postcss.config.js` and `autoprefixer` dependency
- Updated `HeuristicEngine.analyze()` to accept typed `HeuristicSettings` (with defaults) and conditionally run privacy/performance-heavy signals (`forms`, `fingerprinting`)
- Bumped project to v1.5.1; expanded changelog with Tailwind v4 migration, heuristic settings integration, and UI version sync
- Ensured deterministic heuristics (no `Math.random()`) and proper TypeScript interfaces across `RiskScore`/`EvidenceItem` pipeline
- Updated options and popup to v1.5.1 with Tailwind CSS import in both entrypoints

## v1.5.0
- Added Data Management section in Options with "Clear Analysis Cache" button
- Enhanced SVG risk gauge in popup using Tailwind's `.risk-gauge` component for better drop-shadow effect
- Expanded declarativeNetRequest blocking regex for more fraud patterns (seed phrases, private keys, popular DEX scams, hardware wallets)
- Cleaned up unused dependencies (React Query, Chart.js, Zod)
- Updated UI badges, descriptions, and manifest across the extension
- Improved cache clearing with background notification
- Version bumped to 1.5.0

## v1.4.0
- Full deterministic heuristic engine with domain, JS, forms, fingerprinting, shopping, phishing, and reputation analysis
- Granular typed EvidenceItems and category-aware recommendations in RiskEngine
- Settings-aware filtering of heuristics (fingerprinting/form protection toggles)
- Dynamic blocking rules via declarativeNetRequest
- React + Tailwind popup with risk gauge, evidence list, modal details
- MV3 service worker with storage-driven analysis persistence
- Zero-telemetry local-only pipeline

## v1.3.0
- Initial structured risk scoring and UI parity
- Basic heuristic modules and config-driven weights/thresholds

Built with Chrome MV3, TypeScript, React 18, Vite, Tailwind CSS 4.
All analysis runs deterministically in-browser with no external API calls.
