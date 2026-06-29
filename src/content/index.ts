import { HeuristicEngine } from '../modules/heuristicEngine';
import { RiskEngine } from '../modules/riskEngine';

const heuristic = new HeuristicEngine();
const riskEngine = new RiskEngine();

async function performAnalysis() {
  const url = window.location.href;
  const domContent = document.documentElement.outerHTML.substring(0, 50000);

  // Get current settings
  const settings = await new Promise<any>((resolve) => {
    chrome.storage.local.get(['settings'], (result) => {
      resolve(result.settings || {
        enableFingerprinting: true,
        enableFormProtection: true,
        enableBlocking: true,
        riskThreshold: 60
      });
    });
  });

  let heuristics = heuristic.analyze(url, domContent, settings);

  const risk = riskEngine.calculateRisk(heuristics, settings.riskThreshold);

  chrome.runtime.sendMessage({
    type: 'ANALYSIS_RESULT',
    url,
    risk
  });
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'ANALYZE_PAGE') {
    performAnalysis().then(() => sendResponse({ success: true })).catch(console.error);
    return true; // Keep message channel open for async response
  }
});

// Auto analyze on page load (call directly, don't relay through background)
window.addEventListener('load', () => {
  setTimeout(() => {
    performAnalysis().catch(console.error);
  }, 1500);
});