import { RISK_LEVELS, RISK_THRESHOLDS } from './types.js';

/**
 * @param {number} riskScore
 * @param {boolean} hasEmergency
 * @returns {{ level: import('./types.js').RiskLevel; label: string; rationale: string }}
 */
export function classifyRisk(riskScore, hasEmergency) {
  if (hasEmergency) {
    return {
      level: RISK_LEVELS.HIGH,
      label: 'HIGH RISK — EMERGENCY INDICATORS',
      rationale:
        'One or more critical symptom patterns were detected. Emergency medical evaluation is recommended regardless of numeric score.',
    };
  }

  if (riskScore <= RISK_THRESHOLDS.LOW_MAX) {
    return {
      level: RISK_LEVELS.LOW,
      label: 'LOW RISK',
      rationale: `Composite score ${riskScore}/100 is within the low-risk band (0–${RISK_THRESHOLDS.LOW_MAX}). Self-care and routine follow-up may be appropriate if symptoms remain mild.`,
    };
  }

  if (riskScore <= RISK_THRESHOLDS.MODERATE_MAX) {
    return {
      level: RISK_LEVELS.MODERATE,
      label: 'MODERATE RISK',
      rationale: `Composite score ${riskScore}/100 falls in the moderate-risk band (${RISK_THRESHOLDS.LOW_MAX + 1}–${RISK_THRESHOLDS.MODERATE_MAX}). Timely clinical assessment is advised.`,
    };
  }

  return {
    level: RISK_LEVELS.HIGH,
    label: 'HIGH RISK',
    rationale: `Composite score ${riskScore}/100 exceeds ${RISK_THRESHOLDS.MODERATE_MAX}. Prompt medical evaluation is recommended.`,
  };
}

/**
 * Maps triage risk level to legacy UI severity tokens.
 * @param {import('./types.js').RiskLevel} riskLevel
 * @param {boolean} isEmergency
 */
export function toUiSeverity(riskLevel, isEmergency) {
  if (isEmergency || riskLevel === RISK_LEVELS.HIGH) return 'urgent';
  if (riskLevel === RISK_LEVELS.MODERATE) return 'warning';
  return 'optimal';
}
