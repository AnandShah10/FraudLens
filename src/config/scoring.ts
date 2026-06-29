export const SCORING_WEIGHTS = {
  domain: 0.12,
  javascript: 0.15,
  forms: 0.15,
  fingerprinting: 0.18,   // High weight
  shopping: 0.15,
  phishing: 0.20,
  reputation: 0.12,
} as const;

export const RISK_THRESHOLDS = {
  SAFE: 20,
  LOW: 40,
  SUSPICIOUS: 60,
  DANGEROUS: 80,
  HIGH: 100,
} as const;