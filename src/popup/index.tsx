import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RiskScore } from '../types';
import '../tailwind.css';

const Popup: React.FC = () => {
  const [risk, setRisk] = useState<RiskScore | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.url) return;
      const url = tab.url;
      setCurrentUrl(url);

      const key = `analysis_${url}`;
      chrome.storage.local.get([key], (result) => {
        if (result[key]) {
          setRisk(result[key]);
        } else if (tab.id) {
          // Trigger analysis if no stored result
          chrome.tabs.sendMessage(tab.id, { type: 'ANALYZE_PAGE' }).catch((err) => {
            console.log('Cannot analyze this page (likely a chrome:// URL or restricted page):', err);
          });
        }
      });
    });
  }, []);

  // Listen for storage updates from background analysis
  useEffect(() => {
    const handleStorageChange = (changes: any, area: string) => {
      if (area === 'local' && currentUrl) {
        const key = `analysis_${currentUrl}`;
        if (changes[key] && changes[key].newValue) {
          setRisk(changes[key].newValue);
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, [currentUrl]);

  const getColor = (score: number) => {
    if (score <= 20) return 'text-green-400';
    if (score <= 40) return 'text-yellow-400';
    if (score <= 60) return 'text-orange-400';
    return 'text-red-500';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Safe': return 'text-green-400';
      case 'Low Risk': return 'text-emerald-400';
      case 'Suspicious': return 'text-yellow-400';
      case 'Dangerous': return 'text-orange-400';
      default: return 'text-red-500';
    }
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-2xl font-bold text-white">Scam Risk Meter</h1>
          <div className="px-2 py-0.5 text-[10px] bg-zinc-800 rounded font-mono text-emerald-400">v1.5.2</div>
        </div>
        <p className="text-zinc-400 text-sm mt-1 truncate">
          {currentUrl ? new URL(currentUrl).hostname : 'Analyzing...'}
        </p>
      </div>

      {risk ? (
        <div className="space-y-6">
          {/* Risk Gauge */}
          <div className={`relative mx-auto w-48 h-48 ${getColor(risk.score)}`}>
            <svg className="risk-gauge w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle 
                cx="60" cy="60" r="52" 
                fill="none" 
                stroke="#27272a" 
                strokeWidth="12" 
              />
              <circle 
                cx="60" cy="60" r="52" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={`${(risk.score / 100) * 327} 327`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-6xl font-bold ${getColor(risk.score)}`}>{risk.score}</div>
              <div className="text-sm text-zinc-400 -mt-2">RISK SCORE</div>
            </div>
          </div>

          <div className={`text-center text-xl font-semibold ${getLevelColor(risk.level)}`}>
            {risk.level}
          </div>

          {/* Evidence */}
          <div className="bg-zinc-900 p-4 rounded-xl">
            <h3 className="font-medium mb-3 text-white">Why this score?</h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              {risk.evidence.slice(0, 4).map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-red-400 mt-0.5">•</span> 
                  {item.description}
                </li>
              ))}
            </ul>
            {risk.evidence.length > 4 && (
              <button 
                onClick={() => setShowDetail(true)}
                className="text-xs text-blue-400 hover:text-blue-300 mt-3 flex items-center gap-1"
              >
                View all {risk.evidence.length} signals →
              </button>
            )}
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            {risk.recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} className="bg-emerald-950/50 border border-emerald-900/50 p-3 rounded-lg text-sm">
                {rec}
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowDetail(true)}
            className="w-full py-2.5 text-sm border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-xl transition-colors"
          >
            📋 View Detailed Report
          </button>
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-400">
          Analyzing current website...
        </div>
      )}

      <button 
        onClick={() => chrome.runtime.openOptionsPage()}
        className="w-full mt-6 py-3 bg-white hover:bg-zinc-100 text-black rounded-xl font-medium transition-colors"
      >
        ⚙️ Settings
      </button>

      {/* Detailed Report Modal */}
      {showDetail && risk && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowDetail(false)}>
          <div 
            className="bg-zinc-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-zinc-700 flex justify-between items-center sticky top-0 bg-zinc-900">
              <div>
                <h2 className="text-xl font-semibold">Detailed Risk Report</h2>
                <p className="text-xs text-zinc-400">{new URL(currentUrl).hostname}</p>
              </div>
              <div className={`px-4 py-1 rounded-full text-sm font-mono ${getColor(risk.score)} bg-zinc-800`}>
                {risk.score} / 100
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              <div>
                <h3 className="uppercase text-xs tracking-widest text-zinc-400 mb-3">Evidence &amp; Signals</h3>
                <div className="space-y-4">
                  {risk.evidence.map((item, i) => (
                    <div key={i} className="bg-zinc-800 rounded-2xl p-4">
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-white">{item.category}</div>
                        <div className="text-right">
                          <div className="text-xs px-2.5 py-0.5 bg-zinc-700 rounded font-mono text-amber-400">
                            +{item.impact}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-zinc-300 mt-1">{item.description}</div>
                      <div className="text-[10px] text-zinc-500 mt-2">Weight: {(item.weight * 100).toFixed(0)}% • Signal: {item.signal}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="uppercase text-xs tracking-widest text-zinc-400 mb-3">Recommendations</h3>
                <div className="space-y-3">
                  {risk.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 text-sm bg-emerald-950/40 border border-emerald-900 p-4 rounded-2xl">
                      <span className="text-emerald-400 text-xl leading-none mt-0.5">✓</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 bg-zinc-950 p-3 rounded-2xl">
                Confidence: {risk.confidence}% • Analysis based on {risk.evidence.length} heuristic signals • Local computation only
              </div>
            </div>

            <div className="p-4 border-t border-zinc-700">
              <button 
                onClick={() => setShowDetail(false)}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-sm font-medium"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<Popup />);