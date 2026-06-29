import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../tailwind.css';

interface Settings {
  enableFingerprinting: boolean;
  enableFormProtection: boolean;
  enableBlocking: boolean;
  riskThreshold: number;
}

const Options: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    enableFingerprinting: true,
    enableFormProtection: true,
    enableBlocking: true,
    riskThreshold: 60,
  });
  const [saved, setSaved] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);

  const saveSettings = () => {
    chrome.storage.local.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      chrome.runtime.sendMessage({ type: 'SETTINGS_UPDATED', settings });
    });
  };

  const clearAnalysisCache = () => {
    chrome.storage.local.get(null, (items) => {
      const analysisKeys = Object.keys(items).filter(key => key.startsWith('analysis_'));
      if (analysisKeys.length > 0) {
        chrome.storage.local.remove(analysisKeys, () => {
          setCleared(true);
          setTimeout(() => setCleared(false), 2000);
          chrome.runtime.sendMessage({ type: 'CACHE_CLEARED' });
        });
      } else {
        setCleared(true);
        setTimeout(() => setCleared(false), 2000);
      }
    });
  };

  const toggleSetting = (key: 'enableFingerprinting' | 'enableFormProtection' | 'enableBlocking') => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof Settings]
    }));
  };

  const updateThreshold = (value: number) => {
    setSettings(prev => ({ 
      ...prev, 
      riskThreshold: Math.max(30, Math.min(85, value)) 
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-zinc-950 text-white min-h-screen">
        <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Scam Risk Meter Settings</h1>
        <div className="px-3 py-1 bg-zinc-900 rounded-full text-sm text-emerald-400 font-mono">v1.5.2</div>
      </div>
      
      <div className="bg-zinc-900 rounded-3xl p-8 space-y-10">
        <div>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            🛡️ Detection Settings
          </h2>
          <div className="space-y-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={settings.enableFingerprinting}
                onChange={() => toggleSetting('enableFingerprinting')}
                className="w-5 h-5 accent-red-500" 
              />
              <div className="flex-1">
                <span className="text-lg">Enable Browser Fingerprinting Detection</span>
                <p className="text-zinc-400 text-sm mt-0.5">Detects Canvas, WebGL, AudioContext, and libraries like FingerprintJS</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={settings.enableFormProtection}
                onChange={() => toggleSetting('enableFormProtection')}
                className="w-5 h-5 accent-red-500" 
              />
              <div className="flex-1">
                <span className="text-lg">Enable Form Protection Warnings</span>
                <p className="text-zinc-400 text-sm mt-0.5">Warns on password, credit-card, wallet seed, and CVV fields</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={settings.enableBlocking}
                onChange={() => toggleSetting('enableBlocking')}
                className="w-5 h-5 accent-red-500" 
              />
              <div className="flex-1">
                <span className="text-lg">Block Known Scam Patterns</span>
                <p className="text-zinc-400 text-sm mt-0.5">Automatically blocks URLs matching phishing and scam patterns</p>
              </div>
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            📈 Risk Sensitivity
          </h2>
          <div className="bg-zinc-800 p-6 rounded-2xl">
            <div className="flex justify-between mb-3 text-xs uppercase tracking-widest text-zinc-400">
              <div>Low</div>
              <div className="font-mono text-red-400 text-base font-semibold">{settings.riskThreshold}</div>
              <div>High</div>
            </div>
            <input 
              type="range" 
              min="30" 
              max="85" 
              step="5"
              value={settings.riskThreshold}
              onChange={(e) => updateThreshold(parseInt(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
              Adjust the threshold at which sites are considered <span className="text-orange-400">Dangerous</span>. 
              Current: scores &gt; {settings.riskThreshold} trigger high risk alerts.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">🌐 Threat Intelligence</h2>
          <div className="bg-zinc-800/70 border border-dashed border-zinc-700 p-8 rounded-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
              🛡️
            </div>
            <p className="text-zinc-400 mb-2">Local heuristics, dynamic URL blocking, and deterministic risk scoring</p>
            <p className="text-emerald-400 text-sm font-medium">v1.5.2 — Clean build outputs + Tailwind v4 • Zero telemetry</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">🗄️ Data Management</h2>
          <div className="bg-zinc-800 p-6 rounded-2xl">
            <p className="text-zinc-400 mb-4">Stored analysis results take up space in browser storage. Clear the cache to force fresh risk assessments.</p>
            <button 
              onClick={clearAnalysisCache}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              🗑️ Clear Analysis Cache
            </button>
            {cleared && <p className="text-emerald-400 text-sm mt-3 flex items-center gap-2">✅ Cache cleared successfully. Future visits will be re-analyzed.</p>}
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <button 
          onClick={saveSettings}
          className="flex-1 py-4 bg-white text-black hover:bg-zinc-100 transition-all rounded-2xl font-semibold text-lg active:scale-[0.985]"
        >
          {saved ? '✅ SETTINGS SAVED' : '💾 SAVE CONFIGURATION'}
        </button>
        <button 
          onClick={() => window.close()}
          className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 transition-colors rounded-2xl font-medium"
        >
          Close
        </button>
      </div>

      <div className="mt-12 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
        <span>Privacy-First Protection</span>
        <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
        <span>No telemetry • All analysis runs locally</span>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<Options />);