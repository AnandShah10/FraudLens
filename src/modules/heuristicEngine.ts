import { HeuristicSettings } from './heuristicSettings';

export class HeuristicEngine {
  analyze(url: string, domContent: string, settings: HeuristicSettings = { 
    enableFingerprinting: true, 
    enableFormProtection: true 
  }): any {
    const domain = new URL(url).hostname;
    const signals: any = {};

    signals.domain = this.analyzeDomain(domain);
    signals.javascript = this.analyzeJS(domContent);
    
    // Respect user settings for privacy/performance sensitive signals
    if (settings.enableFormProtection !== false) {
      signals.forms = this.analyzeForms(domContent);
    } else {
      signals.forms = [];
    }
    
    if (settings.enableFingerprinting !== false) {
      signals.fingerprinting = this.analyzeFingerprinting(domContent);
    } else {
      signals.fingerprinting = { 
        detectedPatterns: [], 
        intensity: 0, 
        riskScore: 0, 
        isAggressive: false 
      };
    }
    
    signals.shopping = this.analyzeShopping(domContent);
    signals.phishing = this.analyzePhishing(url, domContent);
    signals.reputation = this.analyzeReputation(domain);

    return signals;
  }

  private analyzeDomain(domain: string) {
    const entropy = this.calculateEntropy(domain);
    // Deterministic 'recent' heuristic: short name, contains numbers/hyphens (common in fraud domains)
    const isRecent = domain.length < 15 || /\d|-/.test(domain) || domain.split('.')[0].length < 6;
    return {
      entropy,
      isRecent,
      typosquattingScore: this.detectTyposquatting(domain),
      unicodeSpoof: /[^\x00-\x7F]/.test(domain)
    };
  }

  private calculateEntropy(str: string): number {
    let entropy = 0;
    const freq: { [key: string]: number } = {};
    for (let char of str) {
      freq[char] = (freq[char] || 0) + 1;
    }
    for (let count of Object.values(freq)) {
      const p = count / str.length;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }

  private detectTyposquatting(domain: string): number {
    const brands = ['google', 'amazon', 'paypal', 'microsoft'];
    return brands.some(brand => domain.includes(brand) && domain.length > brand.length + 2) ? 0.8 : 0.2;
  }

  private analyzeJS(content: string) {
    const suspiciousPatterns = [
      'eval(', 'document.write(', 'atob(', 'fromCharCode', 
      'unescape(', 'String.fromCharCode', '\\x', '\\\\x', 
      'base64', 'obfuscate', '%2F', 'decodeURIComponent', 'btoa(',
      'innerHTML', 'outerHTML', 'execScript', 'setTimeout.*eval', 'Function('
    ];
    const lowerContent = content.toLowerCase();
    const suspiciousCount = suspiciousPatterns.filter(p => 
      lowerContent.includes(p.toLowerCase())
    ).length;
    const risk = Math.min(95, suspiciousCount * 22 + (lowerContent.includes('eval') && lowerContent.includes('atob') ? 25 : 0));
    return { 
      suspiciousCount, 
      risk,
      patterns: suspiciousPatterns.filter(p => lowerContent.includes(p.toLowerCase()))
    };
  }

  private analyzeForms(content: string) {
    const formIndicators = ['password', 'credit-card', 'wallet', 'seed', 'cvv'];
    return formIndicators.filter(ind => content.toLowerCase().includes(ind)).map(ind => ({
      type: ind,
      suspicious: true
    }));
  }

  private analyzeFingerprinting(content: string): any {
    const fpPatterns = [
      'toDataURL', 'getContext("2d")', 'WebGLRenderingContext', 'getParameter',
      'AudioContext', 'createOscillator', 'enumerateDevices', 'fonts.check',
      'document.fonts', 'hardwareConcurrency', 'getBattery', 'FingerprintJS',
      'creepjs', 'panopticlick', 'getFingerprint', 'canvas', 'webgl', 
      'getImageData', 'addListener', 'devicePixelRatio', 'webrtc', 'sensor'
    ];

    const detected = fpPatterns.filter(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );

    const score = Math.min(100, detected.length * 16 + (detected.length > 6 ? 15 : 0));

    return {
      detectedPatterns: detected,
      intensity: detected.length,
      riskScore: score,
      isAggressive: detected.length >= 5
    };
  }

  private analyzeShopping(content: string) {
    const shoppingIndicators = ['checkout', 'cart', 'payment', 'buy now', 'add to cart', 'paypal', 'stripe', 
      'billing', 'shipping', 'visa', 'mastercard', 'coupon', 'order summary', 'proceed to', 'secure checkout'];
    const count = shoppingIndicators.filter(ind => content.toLowerCase().includes(ind)).length;
    return {
      hasShopping: count > 0,
      intensity: count,
      risk: Math.min(85, count * 18 + (count > 4 ? 20 : 0))
    };
  }

  private analyzePhishing(url: string, content: string) {
    const phishingKeywords = ['login', 'verify your', 'account suspended', 'secure login', 'password reset', 'click here', 'update now', 'confirm identity',
      'your account is', 'two factor', 'suspicious activity', 'security alert', 'account locked', 'claim your prize', 'exclusive offer', 'bank verification'];
    const lowerContent = content.toLowerCase();
    const keywordCount = phishingKeywords.filter(kw => lowerContent.includes(kw.toLowerCase())).length;
    const hasUrgent = /urgent|immediately|act now|limited time|warning|alert|expires soon|last chance/.test(lowerContent);
    const hasMismatch = url.includes('http:') || /login.*\.com/.test(url) && !url.includes('google.com') || /secure.*\.xyz/.test(url);
    const score = Math.min(95, (keywordCount * 15) + (hasUrgent ? 30 : 0) + (hasMismatch ? 30 : 0));
    return {
      keywordCount,
      hasUrgentLanguage: hasUrgent,
      urlMismatch: hasMismatch,
      risk: score
    };
  }

  private analyzeReputation(domain: string) {
    const suspiciousTlds = ['.xyz', '.top', '.club', '.online', '.tk', '.ml', '.pw', '.cf'];
    const isSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));
    const entropy = this.calculateEntropy(domain);
    // Deterministic reputation based on TLD, entropy, length (higher = worse)
    const baseScore = isSuspiciousTld ? 75 : 15;
    const entropyFactor = Math.min(35, Math.floor(entropy * 4));
    const lengthFactor = Math.max(0, 20 - domain.length);
    const repScore = Math.min(95, baseScore + entropyFactor + lengthFactor);
    return {
      score: repScore,
      isKnownBad: repScore > 60 || isSuspiciousTld,
      suspiciousTld: isSuspiciousTld,
      domainAge: isSuspiciousTld ? 0 : Math.max(1, Math.floor(10 - entropy))
    };
  }
}
