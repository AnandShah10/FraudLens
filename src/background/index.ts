// Each rule must have a unique ID and a regex that compiles to < 2KB
const BLOCK_RULES = [
  {
    id: 1,
    pattern: '(?i).*(phish|scam|fake-(bank|login|wallet)).*'
  },
  {
    id: 2,
    pattern: '(?i).*(metamask|connect|airdrop|ledger|trust).*(verify|restore|claim|seed).*'
  },
  {
    id: 3,
    pattern: '(?i).*(crypto-scam|airdrop-scam|seed.*phrase|private.*key).*'
  },
  {
    id: 4,
    pattern: '(?i).*(verify|wallet).*(wallet|account|identity|verify|connect|claim|secure).*'
  },
  {
    id: 5,
    pattern: '(?i).*(claim).*(reward|prize|token|airdrop).*'
  },
  {
    id: 6,
    pattern: '(?i).*(secure).*(connect|login|wallet).*'
  },
  {
    id: 7,
    pattern: '(?i).*(uniswap|1inch).*(claim|airdrop).*'
  }
];

const makeRule = (id: number, regexFilter: string) => ({
  id,
  priority: 1,
  action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
  condition: {
    regexFilter,
    resourceTypes: [
      chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
      chrome.declarativeNetRequest.ResourceType.SUB_FRAME
    ]
  }
});

async function updateBlockingRules(enabled: boolean = true): Promise<void> {
  const allRuleIds = BLOCK_RULES.map(r => r.id);
  try {
    if (enabled) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: allRuleIds,
        addRules: BLOCK_RULES.map(r => makeRule(r.id, r.pattern))
      });
      console.log(`🔒 Blocking rules enabled (${BLOCK_RULES.length} rules for known scam patterns)`);
    } else {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: allRuleIds
      });
      console.log('🚫 Blocking rules disabled');
    }
  } catch (error) {
    console.error('❌ Failed to update blocking rules:', error);
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  console.log('✅ Scam Website Risk Meter installed');

  try {
    const result = await chrome.storage.local.get(['settings']);
    const defaults = {
      enableFingerprinting: true,
      enableFormProtection: true,
      enableBlocking: true,
      riskThreshold: 60
    };

    if (!result.settings) {
      await chrome.storage.local.set({ settings: defaults });
      await updateBlockingRules(true);
      console.log('📋 Default settings and blocking rules initialized');
    } else {
      await updateBlockingRules(result.settings.enableBlocking ?? true);
    }
  } catch (error) {
    console.error('❌ Error during installation initialization:', error);
    await updateBlockingRules(true);
  }
});

chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) {
    chrome.tabs.sendMessage(details.tabId, { type: 'ANALYZE_PAGE' }).catch(() => {
      // Ignore errors (content script not loaded on chrome:// URLs, etc.)
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'ANALYSIS_RESULT') {
    chrome.storage.local.set({ [`analysis_${message.url}`]: message.risk });
  } else if (message.type === 'SETTINGS_UPDATED' && message.settings) {
    updateBlockingRules(message.settings.enableBlocking ?? true);
    console.log('⚙️ Settings updated, blocking rules adjusted accordingly');
  } else if (message.type === 'CACHE_CLEARED') {
    console.log('🗑️ Analysis cache cleared by user');
  }
  return true;
});

export { updateBlockingRules };
