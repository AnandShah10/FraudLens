import { SCORING_WEIGHTS, RISK_THRESHOLDS } from '../config/scoring';
import { RiskScore, EvidenceItem } from '../types';

export class RiskEngine {
  calculateRisk(signals: any, threshold: number = 60): RiskScore {
    let totalScore = 0;
    const evidence: EvidenceItem[] = [];

    // Domain - supports multiple evidence items for different signals (recent, entropy, unicode)
    if (signals.domain) {
      const isRecent = signals.domain.isRecent;
      const highEntropy = signals.domain.entropy > 4.0;
      const unicodeSpoof = signals.domain.unicodeSpoof;
      let domainScore = 10; // base

      if (isRecent) {
        domainScore += 45;
        evidence.push({
          category: 'Domain',
          signal: 'Recently registered domain',
          weight: SCORING_WEIGHTS.domain,
          impact: 45,
          description: 'Domain appears to be recently created (heuristic)'
        });
      }
      if (highEntropy) {
        domainScore += 35;
        evidence.push({
          category: 'Domain',
          signal: 'High entropy domain name',
          weight: SCORING_WEIGHTS.domain,
          impact: 35,
          description: 'Unusually random-looking domain (common in fraud)'
        });
      }
      if (unicodeSpoof) {
        domainScore += 50;
        evidence.push({
          category: 'Domain',
          signal: 'Unicode spoofing detected',
          weight: SCORING_WEIGHTS.domain,
          impact: 50,
          description: 'Potential IDN homograph attack (visually similar characters)'
        });
      }
      if (!isRecent && !highEntropy && !unicodeSpoof) {
        evidence.push({
          category: 'Domain',
          signal: 'Standard domain',
          weight: SCORING_WEIGHTS.domain,
          impact: 10,
          description: 'Normal domain characteristics'
        });
      }

      totalScore += domainScore * SCORING_WEIGHTS.domain;
    }

    // JavaScript
    if (signals.javascript) {
      const jsScore = signals.javascript.risk || 0;
      totalScore += jsScore * SCORING_WEIGHTS.javascript;
      if (jsScore > 0) {
        evidence.push({ 
          category: 'JavaScript', 
          signal: 'Obfuscated or suspicious JS', 
          weight: SCORING_WEIGHTS.javascript, 
          impact: jsScore, 
          description: `${signals.javascript.suspiciousCount} suspicious patterns detected` 
        });
      }
    }

    // Forms
    if (signals.forms && signals.forms.length > 0) {
      const formScore = 70;
      totalScore += formScore * SCORING_WEIGHTS.forms;
      evidence.push({ 
        category: 'Forms', 
        signal: 'Sensitive form fields', 
        weight: SCORING_WEIGHTS.forms, 
        impact: formScore, 
        description: 'Requests for credentials or wallet info' 
      });
    }

    // Fingerprinting
    if (signals.fingerprinting && signals.fingerprinting.riskScore > 0) {
      const fpScore = signals.fingerprinting.riskScore;
      totalScore += fpScore * SCORING_WEIGHTS.fingerprinting;
      evidence.push({
        category: 'Fingerprinting',
        signal: 'Browser fingerprinting detected',
        weight: SCORING_WEIGHTS.fingerprinting,
        impact: fpScore,
        description: `${signals.fingerprinting.detectedPatterns.length} fingerprinting techniques detected (${signals.fingerprinting.isAggressive ? 'AGGRESSIVE' : 'moderate'})`
      });
    }

    // Shopping / E-commerce
    if (signals.shopping && signals.shopping.hasShopping) {
      const shopScore = signals.shopping.risk || 40;
      totalScore += shopScore * SCORING_WEIGHTS.shopping;
      evidence.push({
        category: 'Shopping',
        signal: 'E-commerce patterns on suspicious site',
        weight: SCORING_WEIGHTS.shopping,
        impact: shopScore,
        description: `${signals.shopping.intensity} shopping indicators detected`
      });
    }

    // Phishing
    if (signals.phishing && signals.phishing.risk > 30) {
      const phishScore = signals.phishing.risk;
      totalScore += phishScore * SCORING_WEIGHTS.phishing;
      evidence.push({ 
        category: 'Phishing', 
        signal: 'Phishing and social engineering detected', 
        weight: SCORING_WEIGHTS.phishing, 
        impact: phishScore, 
        description: `${signals.phishing.keywordCount} keywords, urgent language: ${signals.phishing.hasUrgentLanguage}` 
      });
    }

    // Reputation
    if (signals.reputation && signals.reputation.score > 30) {
      const repScore = signals.reputation.score;
      totalScore += repScore * SCORING_WEIGHTS.reputation;
      evidence.push({
        category: 'Reputation',
        signal: 'Low domain reputation',
        weight: SCORING_WEIGHTS.reputation,
        impact: repScore,
        description: signals.reputation.isKnownBad ? 'Suspicious TLD or newly registered domain' : 'Poor reputation signals'
      });
    }

    const score = Math.min(100, Math.max(0, Math.round(totalScore)));
    const level = this.getRiskLevel(score, threshold);

    return {
      score,
      level,
      confidence: Math.min(92, 55 + Math.floor(evidence.length * 5.5)),
      evidence,
      recommendations: this.generateRecommendations(score, evidence, threshold)
    };
  }

  private getRiskLevel(score: number, threshold: number = 60): RiskScore['level'] {
    if (score <= RISK_THRESHOLDS.SAFE) return 'Safe';
    if (score <= RISK_THRESHOLDS.LOW) return 'Low Risk';
    // User threshold controls transition from Suspicious to Dangerous (default 60 = SUSPICIOUS)
    if (score < threshold) return 'Suspicious';
    if (score < RISK_THRESHOLDS.DANGEROUS) return 'Dangerous';
    return 'Critical';
  }

  private generateRecommendations(score: number, evidence: EvidenceItem[], threshold: number = 60): string[] {
    const recs: string[] = [
      'Verify the full URL and domain before entering any information',
      'Check for a valid HTTPS certificate and padlock icon in the address bar',
    ];

    const categories = new Set(evidence.map(e => e.category.toLowerCase()));

    if (categories.has('phishing')) {
      recs.push('Avoid clicking any links or buttons; phishing sites often use urgency tactics');
    }
    if (categories.has('forms')) {
      recs.push('Do not submit any forms – this site is requesting sensitive credentials or wallet data');
    }
    if (categories.has('fingerprinting')) {
      recs.push('Be cautious of tracking; consider using anti-fingerprinting extensions');
    }
    if (categories.has('javascript') || categories.has('domain')) {
      recs.push('This site uses suspicious scripts or has a risky domain – do not trust');
    }
    if (score > threshold) {
      recs.push('Leave the page immediately and do not return');
      recs.push('Report this website to Google Safe Browsing or your browser vendor');
    }

    // Add general advice if few specific ones
    if (recs.length < 4) {
      recs.push('Use two-factor authentication and monitor accounts for suspicious activity');
    }

    return recs.slice(0, 5);
  }
}

export const riskEngine = new RiskEngine();
