export { runMedicalTriage } from './triageEngine.js';
export { parseSymptoms, normalizeSymptomText } from './symptomParser.js';
export { calculateRiskScore, getAgeRiskAdjustment } from './riskScorer.js';
export { classifyRisk, toUiSeverity } from './riskClassifier.js';
export { SYMPTOM_REGISTRY } from './symptomRegistry.js';
export { RISK_LEVELS, RISK_THRESHOLDS, MEDICAL_DISCLAIMER } from './types.js';
