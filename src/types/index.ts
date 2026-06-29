export interface RiskScore {
  score: number;
  level: 'Safe' | 'Low Risk' | 'Suspicious' | 'Dangerous' | 'High Scam Risk';
  confidence: number;
  evidence: EvidenceItem[];
  recommendations: string[];
}

export interface EvidenceItem {
  category: string;
  signal: string;
  weight: number;
  impact: number;
  description: string;
}

export interface DomainAnalysis {
  entropy: number;
  isRecent: boolean;
  typosquattingScore: number;
  unicodeSpoof: boolean;
}

export interface FormField {
  type: string;
  suspicious: boolean;
}

export interface AnalysisResult {
  domain: DomainAnalysis;
  javascript: any;
  forms: FormField[];
  fingerprinting: any;
  shopping?: any;
  phishing?: any;
  reputation?: any;
  riskScore: RiskScore;
}